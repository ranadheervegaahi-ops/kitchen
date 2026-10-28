const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')
const PreorderSettings = require('../models/PreorderSettings')
const { ORDER_STATUS, ORDER_TYPES, PAYMENT_STATUS, VALID_TRANSITIONS } = require('../utils/constants')
const { emitToAdmins } = require('../sockets')

// Payment model is optional: if it fails to load, payment method/reference stay blank
let Payment = null
try {
  Payment = require('../models/Payment')
} catch {}

/* ------------------- constants resolved from YOUR constants.js ------------------- */
const pickVal = (obj, ...keys) => {
  for (const k of keys) if (obj && obj[k] !== undefined) return obj[k]
}
const PREORDER_TYPE =
  ORDER_TYPES.PRE_ORDER || Object.values(ORDER_TYPES || {}).find((v) => /pre/i.test(String(v)))

const ST = {
  cancelled: pickVal(ORDER_STATUS, 'CANCELLED', 'CANCELED'),
  preparing: pickVal(ORDER_STATUS, 'PROCESSING', 'PREPARING', 'IN_PROGRESS'),
  ready: pickVal(ORDER_STATUS, 'READY', 'READY_FOR_PICKUP'),
  done: ['COMPLETED', 'DELIVERED', 'PICKED_UP', 'OUT_FOR_DELIVERY']
    .map((k) => ORDER_STATUS[k])
    .filter(Boolean),
}
const PAID = pickVal(PAYMENT_STATUS, 'PAID', 'SUCCESS', 'COMPLETED')

// These statuses do NOT hold a slot
const NOT_BOOKED = ['CANCELLED', 'PAYMENT_FAILED', 'PAYMENT_EXPIRED']

const canMove = (from, to) => (VALID_TRANSITIONS[from] || []).includes(to)

// screen status: scheduled | preparing | ready | completed | cancelled
const uiStatus = (st) => {
  if (st === ST.cancelled) return 'cancelled'
  if (st === ST.preparing) return 'preparing'
  if (st === ST.ready) return 'ready'
  if (ST.done.includes(st)) return 'completed'
  return 'scheduled'
}

/* ----------------------------- time helpers (IST) ---------------------------- */
const IST_MS = 330 * 60000
const pad = (n) => String(n).padStart(2, '0')
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

const ymd = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
const todayIST = () => ymd(new Date(Date.now() + IST_MS))
const addDays = (s, n) => {
  const d = new Date(`${s}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return ymd(d)
}
const weekday = (s) => new Date(`${s}T00:00:00Z`).getUTCDay()
const toMin = (t) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const toHHmm = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
const instant = (date, hhmm) => new Date(`${date}T${hhmm}:00+05:30`).getTime()
const istOf = (d) => {
  const x = new Date(new Date(d).getTime() + IST_MS)
  return { date: ymd(x), mins: x.getUTCHours() * 60 + x.getUTCMinutes() }
}

const fmtTime = (m) => {
  const h = Math.floor(m / 60)
  const mm = m % 60
  const ap = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return mm ? `${h12}:${pad(mm)} ${ap}` : `${h12} ${ap}`
}
const slotLabel = (s, e) => `${fmtTime(toMin(s))} – ${fmtTime(toMin(e))}`

const dayLabel = (s) => {
  const t = todayIST()
  if (s === t) return 'Today'
  if (s === addDays(t, 1)) return 'Tomorrow'
  const d = new Date(`${s}T00:00:00Z`)
  return `${WD[d.getUTCDay()]}, ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`
}
const tabLabel = (s) => {
  const t = todayIST()
  if (s === t) return 'Today'
  if (s === addDays(t, 1)) return 'Tomorrow'
  return WD[weekday(s)]
}
const fmtPlaced = (createdAt) => {
  const { date, mins } = istOf(createdAt)
  const t = todayIST()
  const rel =
    date === t
      ? 'Today'
      : date === addDays(t, -1)
      ? 'Yesterday'
      : `${Number(date.slice(8))} ${MON[Number(date.slice(5, 7)) - 1]}`
  return `${rel} ${fmtTime(mins)}`
}
const cap = (s = '') => {
  const t = String(s).toLowerCase().replace(/_/g, ' ')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

/* --------------------------------- plumbing --------------------------------- */
const httpError = (status, message) => Object.assign(new Error(message), { status })
const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res)
  } catch (e) {
    res.status(e.status || 500).json({ success: false, message: e.message || 'Server error' })
  }
}
const ok = (res, data) => res.json({ success: true, data })
const needDate = (v) => {
  if (!DATE_RE.test(v || '')) throw httpError(400, 'date must be YYYY-MM-DD')
  return v
}
const needTime = (v) => {
  if (!TIME_RE.test(v || '')) throw httpError(400, 'start must be HH:mm')
  return v
}

/* ----------------------------- order queries/mapping ----------------------------- */
const rangeFilter = (fromMs, toMs) => {
  const f = {
    requested_at: { $gte: new Date(fromMs), $lt: new Date(toMs) },
    status: { $nin: NOT_BOOKED },
  }
  if (PREORDER_TYPE) f.order_type = PREORDER_TYPE
  return f
}
const dayRange = (date) => [instant(date, '00:00'), instant(addDays(date, 1), '00:00')]

const slotStartFor = (s, date, mins) => {
  const cfg = s.weekly.find((w) => w.day === weekday(date))
  const open = toMin(cfg?.openTime || '11:00')
  const idx = Math.max(0, Math.floor((mins - open) / s.slotMinutes))
  return toHHmm(open + idx * s.slotMinutes)
}

const normalizeItem = (r) => ({
  name: r.product_name_snapshot || 'Item',
  nameTe: '',
  sizeLabel: r.variant_name_snapshot || '',
  qty: r.quantity,
  lineTotal: r.subtotal,
})

async function loadItems(orderIds) {
  if (!orderIds.length) return {}
  const rows = await OrderItem.find({ order_id: { $in: orderIds } }).lean()
  const map = {}
  for (const r of rows) (map[String(r.order_id)] ||= []).push(normalizeItem(r))
  return map
}
const loadPayment = async (orderId) =>
  Payment ? Payment.findOne({ order_id: orderId }).sort({ createdAt: -1 }).lean() : null

const customerOf = (o) => ({
  name: o.customer_id?.name || 'Guest',
  phone: o.customer_id?.mobile || '',
})

const mapBooking = (o, items, s) => {
  const { date, mins } = istOf(o.requested_at)
  const start = slotStartFor(s, date, mins)
  return {
    id: o._id,
    orderNumber: o.order_number,
    status: uiStatus(o.status),
    summary: (items || []).map((i) => `${i.name}${i.sizeLabel ? ' ' + i.sizeLabel : ''} ×${i.qty}`).join(', '),
    customerName: customerOf(o).name,
    typeLabel: cap(o.fulfillment_type || 'pickup'),
    startLabel: fmtTime(toMin(start)),
    total: o.total_amount,
  }
}

const mapOrderDetail = (o, items, payment, s) => {
  let when = '—'
  if (o.requested_at) {
    const { date, mins } = istOf(o.requested_at)
    const start = slotStartFor(s, date, mins)
    const end = toHHmm(toMin(start) + s.slotMinutes)
    when = `${dayLabel(date)} · ${slotLabel(start, end)}`
  }
  return {
    id: o._id,
    orderNumber: o.order_number,
    status: uiStatus(o.status),
    placed: fmtPlaced(o.createdAt),
    type: cap(o.fulfillment_type || 'pickup'),
    when,
    kotPrinted: !!o.kot_printed_at,
    customer: customerOf(o),
    items: items || [],
    subtotal: o.subtotal,
    packing: o.packing_charge || 0,
    delivery: o.delivery_charge || 0,
    total: o.total_amount,
    payment: {
      method: String(payment?.method || payment?.payment_method || '').toUpperCase(),
      status: cap(o.payment_status || ''),
      reference:
        payment?.gateway_payment_id ||
        payment?.razorpay_payment_id ||
        payment?.transaction_id ||
        payment?.reference ||
        '',
    },
  }
}

/* ------------------------------ schedule engine ------------------------------ */
const isClosed = (s, date) => {
  const o = s.dayOverrides.find((x) => x.date === date)
  if (o) return o.closed
  const cfg = s.weekly.find((w) => w.day === weekday(date))
  return !cfg || !cfg.open
}

async function countsFor(dates, s) {
  const from = instant(dates[0], '00:00')
  const to = instant(addDays(dates[dates.length - 1], 1), '00:00')
  const rows = await Order.find(rangeFilter(from, to)).select('requested_at has_hundi').lean()

  const slot = {}
  const total = {}
  const hundi = {}
  for (const r of rows) {
    const { date, mins } = istOf(r.requested_at)
    const start = slotStartFor(s, date, mins)
    ;(slot[date] ||= {})[start] = (slot[date][start] || 0) + 1
    total[date] = (total[date] || 0) + 1
    if (r.has_hundi) hundi[date] = (hundi[date] || 0) + 1
  }
  return { slot, total, hundi }
}

function buildDay(date, s, slotCounts = {}) {
  const cfg = s.weekly.find((w) => w.day === weekday(date)) || { openTime: '11:00', closeTime: '22:00' }
  const closed = isClosed(s, date)
  const now = Date.now()
  const earliest = now + s.leadTimeMinutes * 60000
  const slots = []
  let firstBookable = null

  if (!closed) {
    const open = toMin(cfg.openTime)
    const close = toMin(cfg.closeTime)
    for (let m = open; m + s.slotMinutes <= close; m += s.slotMinutes) {
      const start = toHHmm(m)
      const end = toHHmm(m + s.slotMinutes)
      const startAt = instant(date, start)
      const endAt = instant(date, end)
      const booked = slotCounts[start] || 0
      const blocked = s.blockedSlots.some((b) => b.date === date && b.start === start)

      let status = 'open'
      if (endAt <= now) status = 'past'
      else if (blocked) status = 'blocked'
      else if (startAt < earliest) status = 'too_soon'
      else if (booked >= s.capacityPerSlot) status = 'full'

      if (!firstBookable && startAt >= earliest) firstBookable = fmtTime(m)

      slots.push({ start, end, label: slotLabel(start, end), booked, capacity: s.capacityPerSlot, status })
    }
  }
  return { closed, openTime: cfg.openTime, closeTime: cfg.closeTime, slots, firstBookable }
}

/**
 * Used by orderController.validateAndCreateOrder before saving a pre-order.
 * Throws an error with .status (400/409) and a customer-friendly .message.
 */
// exports.assertSlotAvailable = async (requestedAt, { hasHundi = false } = {}) => {
//   const s = await PreorderSettings.get()
//   const { date, mins } = istOf(requestedAt)
//   const c = await countsFor([date], s)
//   const day = buildDay(date, s, c.slot[date])
//   if (day.closed) throw httpError(409, 'We are closed on that day')
//   const start = slotStartFor(s, date, mins)
//   const slot = day.slots.find((x) => x.start === start)
//   if (!slot) throw httpError(400, 'That time is outside our pre-order hours')
//   const reasons = {
//     past: 'That slot has already passed',
//     blocked: 'That slot is not available',
//     too_soon: `Pre-orders need at least ${Math.round(s.leadTimeMinutes / 60)} hours notice`,
//     full: 'That slot is full',
//   }
//   if (slot.status !== 'open') throw httpError(409, reasons[slot.status])
//   if (hasHundi && (c.hundi[date] || 0) >= s.hundiCapacityPerDay) {
//     throw httpError(409, 'Hundi bookings are full for that day')
//   }
// }

exports.assertSlotAvailable = async (requestedAt, { hasHundi = false } = {}) => {
  const s = await PreorderSettings.get();

  const { date, mins } = istOf(requestedAt);

  const c = await countsFor([date], s);
  const day = buildDay(date, s, c.slot[date]);

  if (day.closed) {
    throw httpError(409, "We are closed on that day");
  }

  const start = slotStartFor(s, date, mins);

  // Only accept the exact start time of a generated slot.
  // Example: 11:00 is valid, but 11:15 is not.
  if (mins !== toMin(start)) {
    throw httpError(400, "Please select a valid pre-order slot");
  }

  const slot = day.slots.find((item) => item.start === start);

  if (!slot) {
    throw httpError(400, "That time is outside our pre-order hours");
  }

  const reasons = {
    past: "That slot has already passed",
    blocked: "That slot is not available",
    too_soon: `Pre-orders need at least ${s.leadTimeMinutes} minutes notice`,
    full: "That slot is full",
  };

  if (slot.status !== "open") {
    throw httpError(
      409,
      reasons[slot.status] || "That slot is unavailable"
    );
  }

  if (
    hasHundi &&
    (c.hundi[date] || 0) >= s.hundiCapacityPerDay
  ) {
    throw httpError(409, "Hundi bookings are full for that day");
  }
};

/* --------------------------------- handlers --------------------------------- */
exports.getWeek = wrap(async (req, res) => {
  const today = todayIST()
  const from = req.query.from ? needDate(req.query.from) : today
  const dates = Array.from({ length: 7 }, (_, i) => addDays(from, i))
  const s = await PreorderSettings.get()
  const c = await countsFor(dates, s)

  ok(res, {
    today,
    days: dates.map((date) => ({
      date,
      tabLabel: tabLabel(date),
      dayNumber: Number(date.slice(8)),
      closed: isClosed(s, date),
      booked: c.total[date] || 0,
    })),
  })
})

exports.getDay = wrap(async (req, res) => {
  const date = needDate(req.query.date)
  const s = await PreorderSettings.get()
  const c = await countsFor([date], s)
  const day = buildDay(date, s, c.slot[date])

  const [from, to] = dayRange(date)
  const orders = await Order.find(rangeFilter(from, to))
    .populate('customer_id', 'name mobile')
    .sort({ requested_at: 1, createdAt: 1 })
    .lean()
  const itemsMap = await loadItems(orders.map((o) => o._id))

  const isToday = date === todayIST()
  ok(res, {
    date,
    label: dayLabel(date),
    isToday,
    closed: day.closed,
    openTime: day.openTime,
    closeTime: day.closeTime,
    capacityPerSlot: s.capacityPerSlot,
    hundi: { used: c.hundi[date] || 0, capacity: s.hundiCapacityPerDay },
    sameDayFrom: isToday ? day.firstBookable : null,
    slots: day.slots,
    bookings: orders.map((o) => mapBooking(o, itemsMap[String(o._id)], s)),
  })
})

exports.blockSlot = wrap(async (req, res) => {
  const date = needDate(req.body.date)
  const start = needTime(req.body.start)
  const s = await PreorderSettings.get()
  if (!s.blockedSlots.some((b) => b.date === date && b.start === start)) {
    s.blockedSlots.push({ date, start })
    await s.save()
  }
  ok(res, { date, start, blocked: true })
})

exports.unblockSlot = wrap(async (req, res) => {
  const date = needDate(req.body.date)
  const start = needTime(req.body.start)
  const s = await PreorderSettings.get()
  s.blockedSlots = s.blockedSlots.filter((b) => !(b.date === date && b.start === start))
  await s.save()
  ok(res, { date, start, blocked: false })
})

exports.setDayClosed = wrap(async (req, res) => {
  const date = needDate(req.body.date)
  if (typeof req.body.closed !== 'boolean') throw httpError(400, 'closed must be true or false')
  const s = await PreorderSettings.get()
  s.dayOverrides = s.dayOverrides.filter((o) => o.date !== date)
  s.dayOverrides.push({ date, closed: req.body.closed })
  await s.save()
  ok(res, { date, closed: req.body.closed })
})

exports.getSettings = wrap(async (req, res) => {
  ok(res, await PreorderSettings.get())
})

exports.updateSettings = wrap(async (req, res) => {
  const b = req.body
  const s = await PreorderSettings.get()
  const int = (v, min, max, name) => {
    if (!Number.isInteger(v) || v < min || v > max) throw httpError(400, `${name} must be ${min}-${max}`)
    return v
  }
  if (b.leadTimeMinutes !== undefined) s.leadTimeMinutes = int(b.leadTimeMinutes, 0, 10080, 'leadTimeMinutes')
  if (b.slotMinutes !== undefined) s.slotMinutes = int(b.slotMinutes, 15, 480, 'slotMinutes')
  if (b.capacityPerSlot !== undefined) s.capacityPerSlot = int(b.capacityPerSlot, 1, 500, 'capacityPerSlot')
  if (b.hundiCapacityPerDay !== undefined) s.hundiCapacityPerDay = int(b.hundiCapacityPerDay, 0, 500, 'hundiCapacityPerDay')
  if (b.weekly !== undefined) {
    if (!Array.isArray(b.weekly) || b.weekly.length !== 7) throw httpError(400, 'weekly needs 7 entries')
    s.weekly = b.weekly.map((w) => {
      if (!TIME_RE.test(w.openTime) || !TIME_RE.test(w.closeTime) || toMin(w.openTime) >= toMin(w.closeTime)) {
        throw httpError(400, 'Invalid open/close time')
      }
      return { day: int(w.day, 0, 6, 'day'), open: !!w.open, openTime: w.openTime, closeTime: w.closeTime }
    })
  }
  await s.save()
  ok(res, s)
})

/* ---------------------------- order drawer actions ---------------------------- */
const loadOrder = async (id) => {
  const o = await Order.findById(id).populate('customer_id', 'name mobile')
  if (!o) throw httpError(404, 'Order not found')
  return o
}
const detailOf = async (o) => {
  const s = await PreorderSettings.get()
  const items = (await loadItems([o._id]))[String(o._id)] || []
  const payment = await loadPayment(o._id)
  return mapOrderDetail(o, items, payment, s)
}

exports.getOrder = wrap(async (req, res) => {
  ok(res, await detailOf(await loadOrder(req.params.id)))
})

exports.startOrder = wrap(async (req, res) => {
  if (!ST.preparing) throw httpError(500, 'ORDER_STATUS has no PROCESSING value; set it in utils/constants.js')
  const o = await loadOrder(req.params.id)
  if (!canMove(o.status, ST.preparing)) {
    throw httpError(409, `Cannot start preparing: order is ${cap(o.status)}. Confirm it first.`)
  }
  o.status = ST.preparing
  await o.save()
  emitToAdmins('order_status_changed', { order_id: o._id, order_number: o.order_number, status: o.status })
  ok(res, await detailOf(o))
})

exports.cancelOrder = wrap(async (req, res) => {
  if (!ST.cancelled) throw httpError(500, 'ORDER_STATUS has no CANCELLED value; set it in utils/constants.js')
  const o = await loadOrder(req.params.id)
  if (!canMove(o.status, ST.cancelled)) {
    throw httpError(409, `Cannot cancel an order that is ${cap(o.status)}.`)
  }
  o.status = ST.cancelled
  o.cancelled_at = new Date()
  o.cancel_reason = (req.body.reason || 'Cancelled by admin').toString().slice(0, 200)
  o.refund_status = PAID && o.payment_status === PAID ? 'pending' : 'none'
  // TODO: call your payment gateway refund here, then set o.refund_status = 'refunded'
  await o.save()
  emitToAdmins('order_status_changed', { order_id: o._id, order_number: o.order_number, status: o.status })
  ok(res, await detailOf(o))
})

exports.printKot = wrap(async (req, res) => {
  const o = await loadOrder(req.params.id)
  if (!o.kot_printed_at) {
    o.kot_printed_at = new Date()
    await o.save()
  }
  const d = await detailOf(o)
  ok(res, {
    orderNumber: d.orderNumber,
    when: d.when,
    type: d.type,
    customer: d.customer.name,
    items: d.items.map((i) => ({ name: i.name, sizeLabel: i.sizeLabel, qty: i.qty })),
  })
})
// GET /api/customer/orders/slots?date=YYYY-MM-DD  (customer app: which slots can I pick?)
exports.getCustomerSlots = wrap(async (req, res) => {
  const date = needDate(req.query.date)
  if (date < todayIST()) throw httpError(400, 'Date cannot be in the past')
  const s = await PreorderSettings.get()
  const c = await countsFor([date], s)
  const day = buildDay(date, s, c.slot[date])

  const label = { open: 'available', full: 'full', too_soon: 'too_soon', blocked: 'unavailable', past: 'past' }
  ok(res, {
    date,
    label: dayLabel(date),
    closed: day.closed,
    openTime: day.openTime,
    closeTime: day.closeTime,
    slots: day.slots.map((x) => ({
      start: x.start,
      end: x.end,
      label: x.label,
      available: x.status === 'open',
      status: label[x.status],
      requested_at: `${date}T${x.start}:00+05:30`, // send this value as requested_at when ordering
    })),
  })
})
// Describe the requested pre-order time for the Orders page.
const describeWhen = (requestedAt, settings) => {
  if (!requestedAt || !settings) return null;

  const { date, mins } = istOf(requestedAt);
  const start = slotStartFor(settings, date, mins);
  const end = toHHmm(toMin(start) + settings.slotMinutes);

  return {
    date,
    startAt: instant(date, start),
    label: `${dayLabel(date)} · ${slotLabel(start, end)}`,
  };
};
exports.describeWhen = describeWhen;