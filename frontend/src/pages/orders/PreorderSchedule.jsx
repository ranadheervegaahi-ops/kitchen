// import { useCallback, useEffect, useState } from 'react'
// import toast from 'react-hot-toast'
// import { X } from 'lucide-react'
// import * as svc from '../../services/preorderScheduleService'
// import '../../components/styles/PreorderSchedule.css'

// const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
// const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong'
// const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1)
// const STATUS_TEXT = { past: 'Past', too_soon: 'Too soon', open: 'Open', full: 'Full', blocked: 'Blocked' }

// const nowText = () => {
//   const d = new Date()
//   const date = d.toLocaleDateString('en-IN', {
//     weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
//   })
//   const time = d
//     .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })
//     .toUpperCase()
//   return `${date} · ${time}`
// }

// export default function PreorderSchedule() {
//   const [week, setWeek] = useState(null)
//   const [date, setDate] = useState(null)
//   const [day, setDay] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [orderId, setOrderId] = useState(null)
//   const [order, setOrder] = useState(null)
//   const [busy, setBusy] = useState(false)
//   const [clock, setClock] = useState(nowText())

//   const loadWeek = useCallback(async () => {
//     const w = await svc.getWeek()
//     setWeek(w)
//     setDate((d) => d || w.today)
//   }, [])

//   const loadDay = useCallback(async (d) => {
//     if (!d) return
//     try {
//       setDay(await svc.getDay(d))
//     } catch (e) {
//       toast.error(errMsg(e))
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     loadWeek().catch((e) => toast.error(errMsg(e)))
//   }, [loadWeek])

//   useEffect(() => {
//     if (date) {
//       setLoading(true)
//       loadDay(date)
//     }
//   }, [date, loadDay])

//   // keep statuses (Past / Too soon) and counts fresh
//   useEffect(() => {
//     if (!date) return
//     const t = setInterval(() => {
//       loadWeek().catch(() => {})
//       loadDay(date)
//       setClock(nowText())
//     }, 30000)
//     return () => clearInterval(t)
//   }, [date, loadWeek, loadDay])

//   useEffect(() => {
//     if (!orderId) {
//       setOrder(null)
//       return
//     }
//     svc
//       .getOrder(orderId)
//       .then(setOrder)
//       .catch((e) => {
//         toast.error(errMsg(e))
//         setOrderId(null)
//       })
//   }, [orderId])

//   const refreshAll = () => Promise.all([loadWeek(), loadDay(date)])

//   const toggleSlot = async (slot) => {
//     try {
//       if (slot.status === 'blocked') await svc.unblockSlot(date, slot.start)
//       else await svc.blockSlot(date, slot.start)
//       await refreshAll()
//     } catch (e) {
//       toast.error(errMsg(e))
//     }
//   }

//   const toggleDay = async () => {
//     try {
//       await svc.setDayClosed(date, !day.closed)
//       toast.success(day.closed ? 'Day reopened' : 'Day closed')
//       await refreshAll()
//     } catch (e) {
//       toast.error(errMsg(e))
//     }
//   }

//   const runOrderAction = async (fn, successMsg) => {
//     setBusy(true)
//     try {
//       await fn()
//       toast.success(successMsg)
//       setOrder(await svc.getOrder(orderId))
//       await refreshAll()
//     } catch (e) {
//       toast.error(errMsg(e))
//     } finally {
//       setBusy(false)
//     }
//   }

//   const handleStart = () => runOrderAction(() => svc.startOrder(orderId), 'Order moved to preparing')

//   const handleCancel = () => {
//     if (!window.confirm('Cancel this order and start the refund?')) return
//     runOrderAction(() => svc.cancelOrder(orderId, 'Cancelled by admin'), 'Order cancelled')
//   }

//   const handlePrintKot = async () => {
//     setBusy(true)
//     try {
//       const kot = await svc.printKot(orderId)
//       const lines = [
//         'KITCHEN ORDER TICKET',
//         `#${kot.orderNumber}`,
//         `${kot.type} · ${kot.when}`,
//         `Customer: ${kot.customer}`,
//         '--------------------------',
//         ...kot.items.map((i) => `${i.qty} x ${i.name} ${i.sizeLabel}`.trim()),
//       ]
//       const w = window.open('', '_blank', 'width=340,height=600')
//       if (!w) {
//         toast.error('Allow pop-ups to print the KOT')
//       } else {
//         w.document.write('<pre id="kot" style="font:14px monospace"></pre>')
//         w.document.getElementById('kot').textContent = lines.join('\n')
//         w.document.close()
//         w.focus()
//         w.print()
//       }
//       setOrder(await svc.getOrder(orderId))
//     } catch (e) {
//       toast.error(errMsg(e))
//     } finally {
//       setBusy(false)
//     }
//   }

//   const canStart = order?.status === 'scheduled'
//   const canCancel = order && ['scheduled', 'preparing'].includes(order.status)

//   return (
//     <div className="ps">
//       <header className="ps-head">
//         <h1>Pre-order schedule</h1>
//         <p>{clock}</p>
//       </header>

//       {/* Day tabs */}
//       <div className="ps-tabs">
//         {week?.days.map((d) => {
//           const sub = d.closed ? 'Closed' : d.booked ? `${d.booked} booked` : '—'
//           return (
//             <button
//               key={d.date}
//               className={`ps-tab ${d.date === date ? 'ps-tab--active' : ''} ${d.closed ? 'ps-tab--closed' : ''}`}
//               onClick={() => setDate(d.date)}
//             >
//               <span className="ps-tab__label">{d.tabLabel}</span>
//               <span className="ps-tab__num">{d.dayNumber}</span>
//               <span className="ps-tab__sub">{sub}</span>
//             </button>
//           )
//         })}
//       </div>

//       <div className="ps-grid">
//         {/* Slots */}
//         <section className="ps-card">
//           {loading || !day ? (
//             <p className="ps-muted">Loading…</p>
//           ) : (
//             <>
//               <div className="ps-card__head">
//                 <h2>
//                   {day.label}
//                   {!day.closed && ` · ${day.openTime}–${day.closeTime}`}
//                 </h2>
//                 <button className="ps-btn ps-btn--sm" onClick={toggleDay}>
//                   {day.closed ? 'Reopen day' : 'Close day'}
//                 </button>
//               </div>

//               {day.closed ? (
//                 <p className="ps-muted">Closed — no pre-orders can be booked on this day.</p>
//               ) : (
//                 <>
//                   <p className="ps-meta">
//                     Capacity {day.capacityPerSlot} per slot · Hundi {day.hundi.used}/{day.hundi.capacity}
//                     {day.isToday &&
//                       (day.sameDayFrom
//                         ? ` · Same-day bookings from ${day.sameDayFrom}`
//                         : ' · No more same-day slots')}
//                   </p>

//                   <ul className="ps-slots">
//                     {day.slots.map((s) => {
//                       const pct = Math.min(100, (s.booked / s.capacity) * 100)
//                       return (
//                         <li key={s.start} className={`ps-slot ps-slot--${s.status}`}>
//                           <span className="ps-slot__label">{s.label}</span>
//                           <span className="ps-bar">
//                             <span className="ps-bar__fill" style={{ width: `${pct}%` }} />
//                           </span>
//                           <span className="ps-slot__count">
//                             {s.booked}/{s.capacity}
//                           </span>
//                           <span className="ps-slot__status">{STATUS_TEXT[s.status]}</span>
//                           <span className="ps-slot__action">
//                             {s.status !== 'past' && (
//                               <button className="ps-btn ps-btn--sm" onClick={() => toggleSlot(s)}>
//                                 {s.status === 'blocked' ? 'Unblock' : 'Block'}
//                               </button>
//                             )}
//                           </span>
//                         </li>
//                       )
//                     })}
//                   </ul>
//                 </>
//               )}
//             </>
//           )}
//         </section>

//         {/* Bookings */}
//         <section className="ps-card ps-card--side">
//           <h2>All bookings · {day?.label || ''}</h2>
//           {day && day.bookings.length === 0 && <p className="ps-muted">No bookings for this day.</p>}
//           {day?.bookings.map((b) => (
//             <button key={b.id} className="ps-booking" onClick={() => setOrderId(b.id)}>
//               <div className="ps-booking__top">
//                 <strong>#{b.orderNumber}</strong>
//                 <span className="ps-chip">{cap(b.status)}</span>
//               </div>
//               <div className="ps-booking__items">{b.summary}</div>
//               <div className="ps-booking__meta">
//                 {b.customerName} · {b.typeLabel} {b.startLabel} · {money(b.total)}
//               </div>
//             </button>
//           ))}
//         </section>
//       </div>

//       {/* Order drawer */}
//       {orderId && (
//         <>
//           <div className="ps-overlay" onClick={() => setOrderId(null)} />
//           <aside className="ps-drawer">
//             <div className="ps-drawer__head">
//               <div>
//                 <h2>#{order?.orderNumber || '…'}</h2>
//                 {order && <span className="ps-chip">{cap(order.status)}</span>}
//               </div>
//               <button className="ps-close" onClick={() => setOrderId(null)} aria-label="Close">
//                 <X size={18} />
//               </button>
//             </div>

//             {!order ? (
//               <div className="ps-drawer__body">
//                 <p className="ps-muted">Loading…</p>
//               </div>
//             ) : (
//               <>
//                 <div className="ps-drawer__body">
//                   <div className="ps-box">
//                     <Row k="Placed" v={order.placed} />
//                     <Row k="Type" v={order.type} />
//                     <Row k="When" v={order.when} />
//                     <Row k="KOT" v={order.kotPrinted ? 'Printed' : 'Not printed'} />
//                   </div>

//                   <div className="ps-box ps-box--customer">
//                     <div>
//                       <strong>{order.customer.name}</strong>
//                       <div className="ps-muted">{order.customer.phone}</div>
//                     </div>
//                     {order.customer.phone && (
//                       <a className="ps-btn ps-btn--sm" href={`tel:${order.customer.phone.replace(/\s/g, '')}`}>
//                         Call
//                       </a>
//                     )}
//                   </div>

//                   <div className="ps-box">
//                     {order.items.map((i, idx) => (
//                       <div key={idx} className="ps-item">
//                         <div>
//                           <strong>{i.name}</strong>
//                           {i.nameTe && ` · ${i.nameTe}`}
//                           <div className="ps-muted">
//                             {i.sizeLabel} × {i.qty}
//                           </div>
//                         </div>
//                         <strong>{money(i.lineTotal)}</strong>
//                       </div>
//                     ))}
//                     <hr />
//                     <Row k="Subtotal" v={money(order.subtotal)} />
//                     <Row k="Packing" v={money(order.packing)} />
//                     {order.delivery > 0 && <Row k="Delivery" v={money(order.delivery)} />}
//                     <div className="ps-total">
//                       <span>Total</span>
//                       <span>{money(order.total)}</span>
//                     </div>
//                     <Row
//                       k={['Payment', order.payment.method, order.payment.status].filter(Boolean).join(' · ')}
//                       v={order.payment.reference}
//                     />
//                   </div>
//                 </div>

//                 <div className="ps-drawer__foot">
//                   {canStart && (
//                     <button className="ps-btn ps-btn--primary" disabled={busy} onClick={handleStart}>
//                       Start preparing
//                     </button>
//                   )}
//                   {canCancel && (
//                     <button className="ps-btn ps-btn--danger" disabled={busy} onClick={handleCancel}>
//                       Cancel &amp; refund
//                     </button>
//                   )}
//                   <button className="ps-btn" disabled={busy} onClick={handlePrintKot}>
//                     Print KOT
//                   </button>
//                 </div>
//               </>
//             )}
//           </aside>
//         </>
//       )}
//     </div>
//   )
// }

// function Row({ k, v }) {
//   return (
//     <div className="ps-row">
//       <span>{k}</span>
//       <strong>{v}</strong>
//     </div>
//   )
// }
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Lock, X } from 'lucide-react' // NEW: Lock icon
import * as svc from '../../services/preorderScheduleService'
import '../../components/styles/PreorderSchedule.css'

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong'
const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1)

// NEW: "Full" is now "Slot filled"
const STATUS_TEXT = {
  past: 'Past',
  too_soon: 'Too soon',
  open: 'Open',
  full: 'Slot filled',
  blocked: 'Blocked',
}

// NEW: customers cannot book any of these
const isDisabledStatus = (status) => status !== 'open'

const nowText = () => {
  const d = new Date()
  const date = d.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  })
  const time = d
    .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })
    .toUpperCase()
  return `${date} · ${time}`
}

// NEW: message for the banner when customers cannot pre-order anything on this day
const dayBlockMessage = (day) => {
  if (!day || day.closed || day.slots.length === 0) return ''
  const bookable = day.slots.filter((s) => s.status === 'open').length
  if (bookable > 0) return ''

  const filledOrBlocked = day.slots.some((s) => s.status === 'full' || s.status === 'blocked')
  return filledOrBlocked
    ? 'All remaining slots are filled or blocked. Customers cannot pre-order for this day.'
    : 'No more bookable slots for this day.'
}

export default function PreorderSchedule() {
  const [week, setWeek] = useState(null)
  const [date, setDate] = useState(null)
  const [day, setDay] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState(null)
  const [order, setOrder] = useState(null)
  const [busy, setBusy] = useState(false)
  const [slotBusy, setSlotBusy] = useState('') // NEW: slot that is being blocked / unblocked
  const [clock, setClock] = useState(nowText())

  const loadWeek = useCallback(async () => {
    const w = await svc.getWeek()
    setWeek(w)
    setDate((d) => d || w.today)
  }, [])

  const loadDay = useCallback(async (d) => {
    if (!d) return
    try {
      setDay(await svc.getDay(d))
    } catch (e) {
      toast.error(errMsg(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWeek().catch((e) => toast.error(errMsg(e)))
  }, [loadWeek])

  useEffect(() => {
    if (date) {
      setLoading(true)
      loadDay(date)
    }
  }, [date, loadDay])

  // keep statuses (Past / Too soon) and counts fresh
  useEffect(() => {
    if (!date) return
    const t = setInterval(() => {
      loadWeek().catch(() => {})
      loadDay(date)
      setClock(nowText())
    }, 30000)
    return () => clearInterval(t)
  }, [date, loadWeek, loadDay])

  useEffect(() => {
    if (!orderId) {
      setOrder(null)
      return
    }
    svc
      .getOrder(orderId)
      .then(setOrder)
      .catch((e) => {
        toast.error(errMsg(e))
        setOrderId(null)
      })
  }, [orderId])

  const refreshAll = () => Promise.all([loadWeek(), loadDay(date)])

  // NEW: busy guard + toast, the row turns disabled as soon as the data reloads
  const toggleSlot = async (slot) => {
    const key = `${date}|${slot.start}`
    if (slotBusy) return

    setSlotBusy(key)
    try {
      if (slot.status === 'blocked') {
        await svc.unblockSlot(date, slot.start)
        toast.success(`${slot.label} unblocked`)
      } else {
        await svc.blockSlot(date, slot.start)
        toast.success(`${slot.label} blocked. Customers cannot book it.`)
      }
      await refreshAll()
    } catch (e) {
      toast.error(errMsg(e))
    } finally {
      setSlotBusy('')
    }
  }

  const toggleDay = async () => {
    try {
      await svc.setDayClosed(date, !day.closed)
      toast.success(day.closed ? 'Day reopened' : 'Day closed')
      await refreshAll()
    } catch (e) {
      toast.error(errMsg(e))
    }
  }

  const runOrderAction = async (fn, successMsg) => {
    setBusy(true)
    try {
      await fn()
      toast.success(successMsg)
      setOrder(await svc.getOrder(orderId))
      await refreshAll()
    } catch (e) {
      toast.error(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const handleStart = () => runOrderAction(() => svc.startOrder(orderId), 'Order moved to preparing')

  const handleCancel = () => {
    if (!window.confirm('Cancel this order and start the refund?')) return
    runOrderAction(() => svc.cancelOrder(orderId, 'Cancelled by admin'), 'Order cancelled')
  }

  const handlePrintKot = async () => {
    setBusy(true)
    try {
      const kot = await svc.printKot(orderId)
      const lines = [
        'KITCHEN ORDER TICKET',
        `#${kot.orderNumber}`,
        `${kot.type} · ${kot.when}`,
        `Customer: ${kot.customer}`,
        '--------------------------',
        ...kot.items.map((i) => `${i.qty} x ${i.name} ${i.sizeLabel}`.trim()),
      ]
      const w = window.open('', '_blank', 'width=340,height=600')
      if (!w) {
        toast.error('Allow pop-ups to print the KOT')
      } else {
        w.document.write('<pre id="kot" style="font:14px monospace"></pre>')
        w.document.getElementById('kot').textContent = lines.join('\n')
        w.document.close()
        w.focus()
        w.print()
      }
      setOrder(await svc.getOrder(orderId))
    } catch (e) {
      toast.error(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const canStart = order?.status === 'scheduled'
  const canCancel = order && ['scheduled', 'preparing'].includes(order.status)

  const blockMessage = dayBlockMessage(day) // NEW

  return (
    <div className="ps">
      <header className="ps-head">
        <h1>Pre-order schedule</h1>
        <p>{clock}</p>
      </header>

      {/* Day tabs */}
      <div className="ps-tabs">
        {week?.days.map((d) => {
          const sub = d.closed ? 'Closed' : d.booked ? `${d.booked} booked` : '—'
          return (
            <button
              key={d.date}
              className={`ps-tab ${d.date === date ? 'ps-tab--active' : ''} ${d.closed ? 'ps-tab--closed' : ''}`}
              onClick={() => setDate(d.date)}
            >
              <span className="ps-tab__label">{d.tabLabel}</span>
              <span className="ps-tab__num">{d.dayNumber}</span>
              <span className="ps-tab__sub">{sub}</span>
            </button>
          )
        })}
      </div>

      <div className="ps-grid">
        {/* Slots */}
        <section className="ps-card">
          {loading || !day ? (
            <p className="ps-muted">Loading…</p>
          ) : (
            <>
              <div className="ps-card__head">
                <h2>
                  {day.label}
                  {!day.closed && ` · ${day.openTime}–${day.closeTime}`}
                </h2>
                <button className="ps-btn ps-btn--sm" onClick={toggleDay}>
                  {day.closed ? 'Reopen day' : 'Close day'}
                </button>
              </div>

              {day.closed ? (
                <p className="ps-muted">Closed — no pre-orders can be booked on this day.</p>
              ) : (
                <>
                  <p className="ps-meta">
                    Capacity {day.capacityPerSlot} per slot · Hundi {day.hundi.used}/{day.hundi.capacity}
                    {day.isToday &&
                      (day.sameDayFrom
                        ? ` · Same-day bookings from ${day.sameDayFrom}`
                        : ' · No more same-day slots')}
                  </p>

                  {/* NEW: shown when customers cannot pre-order anything on this day */}
                  {blockMessage && <div className="ps-banner">{blockMessage}</div>}

                  <ul className="ps-slots">
                    {day.slots.map((s) => {
                      const pct = Math.min(100, (s.booked / s.capacity) * 100)
                      const off = isDisabledStatus(s.status) // NEW
                      const rowBusy = slotBusy === `${date}|${s.start}` // NEW

                      return (
                        <li
                          key={s.start}
                          className={`ps-slot ps-slot--${s.status} ${off ? 'ps-slot--off' : ''}`}
                        >
                          <span className="ps-slot__label">{s.label}</span>
                          <span className="ps-bar">
                            <span className="ps-bar__fill" style={{ width: `${pct}%` }} />
                          </span>
                          <span className="ps-slot__count">
                            {s.booked}/{s.capacity}
                          </span>
                          <span className="ps-slot__status">
                            {s.status === 'blocked' && <Lock size={12} className="ps-slot__lock" />}
                            {STATUS_TEXT[s.status]}
                          </span>
                          <span className="ps-slot__action">
                            {s.status !== 'past' && (
                              <button
                                className="ps-btn ps-btn--sm"
                                disabled={rowBusy}
                                onClick={() => toggleSlot(s)}
                              >
                                {rowBusy ? '…' : s.status === 'blocked' ? 'Unblock' : 'Block'}
                              </button>
                            )}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </>
              )}
            </>
          )}
        </section>

        {/* Bookings */}
        <section className="ps-card ps-card--side">
          <h2>All bookings · {day?.label || ''}</h2>
          {day && day.bookings.length === 0 && <p className="ps-muted">No bookings for this day.</p>}
          {day?.bookings.map((b) => (
            <button key={b.id} className="ps-booking" onClick={() => setOrderId(b.id)}>
              <div className="ps-booking__top">
                <strong>#{b.orderNumber}</strong>
                <span className="ps-chip">{cap(b.status)}</span>
              </div>
              <div className="ps-booking__items">{b.summary}</div>
              <div className="ps-booking__meta">
                {b.customerName} · {b.typeLabel} {b.startLabel} · {money(b.total)}
              </div>
            </button>
          ))}
        </section>
      </div>

      {/* Order drawer */}
      {orderId && (
        <>
          <div className="ps-overlay" onClick={() => setOrderId(null)} />
          <aside className="ps-drawer">
            <div className="ps-drawer__head">
              <div>
                <h2>#{order?.orderNumber || '…'}</h2>
                {order && <span className="ps-chip">{cap(order.status)}</span>}
              </div>
              <button className="ps-close" onClick={() => setOrderId(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {!order ? (
              <div className="ps-drawer__body">
                <p className="ps-muted">Loading…</p>
              </div>
            ) : (
              <>
                <div className="ps-drawer__body">
                  <div className="ps-box">
                    <Row k="Placed" v={order.placed} />
                    <Row k="Type" v={order.type} />
                    <Row k="When" v={order.when} />
                    <Row k="KOT" v={order.kotPrinted ? 'Printed' : 'Not printed'} />
                  </div>

                  <div className="ps-box ps-box--customer">
                    <div>
                      <strong>{order.customer.name}</strong>
                      <div className="ps-muted">{order.customer.phone}</div>
                    </div>
                    {order.customer.phone && (
                      <a className="ps-btn ps-btn--sm" href={`tel:${order.customer.phone.replace(/\s/g, '')}`}>
                        Call
                      </a>
                    )}
                  </div>

                  <div className="ps-box">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="ps-item">
                        <div>
                          <strong>{i.name}</strong>
                          {i.nameTe && ` · ${i.nameTe}`}
                          <div className="ps-muted">
                            {i.sizeLabel} × {i.qty}
                          </div>
                        </div>
                        <strong>{money(i.lineTotal)}</strong>
                      </div>
                    ))}
                    <hr />
                    <Row k="Subtotal" v={money(order.subtotal)} />
                    <Row k="Packing" v={money(order.packing)} />
                    {order.delivery > 0 && <Row k="Delivery" v={money(order.delivery)} />}
                    <div className="ps-total">
                      <span>Total</span>
                      <span>{money(order.total)}</span>
                    </div>
                    <Row
                      k={['Payment', order.payment.method, order.payment.status].filter(Boolean).join(' · ')}
                      v={order.payment.reference}
                    />
                  </div>
                </div>

                <div className="ps-drawer__foot">
                  {canStart && (
                    <button className="ps-btn ps-btn--primary" disabled={busy} onClick={handleStart}>
                      Start preparing
                    </button>
                  )}
                  {canCancel && (
                    <button className="ps-btn ps-btn--danger" disabled={busy} onClick={handleCancel}>
                      Cancel &amp; refund
                    </button>
                  )}
                  <button className="ps-btn" disabled={busy} onClick={handlePrintKot}>
                    Print KOT
                  </button>
                </div>
              </>
            )}
          </aside>
        </>
      )}
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="ps-row">
      <span>{k}</span>
      <strong>{v}</strong>
    </div>
  )
}