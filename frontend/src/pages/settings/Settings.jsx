// import { useEffect, useState } from 'react'
// import { getBusinessSettings, updateBusinessSettings, getOrderSettings, updateOrderSettings, getBusinessHours, updateBusinessHours } from '../../services/adminService'
// import toast from 'react-hot-toast'

// const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
// const DEFAULT_HOURS = DAYS.map((day) => ({ day, is_open: true, open_time: '09:00', close_time: '21:00' }))

// export default function Settings() {
//   const [tab, setTab] = useState('business')
//   const [biz, setBiz] = useState({ business_name: '', mobile: '', email: '', address: '', whatsapp_number: '' })
//   const [order, setOrder] = useState({ min_preorder_hours: 2, timezone: 'Asia/Kolkata', currency: 'INR', order_prefix: 'DRK' })
//   const [hours, setHours] = useState(DEFAULT_HOURS)
//   const [saving, setSaving] = useState(false)

//   useEffect(() => {
//     getBusinessSettings().then(({ data }) => setBiz({ ...biz, ...data.data })).catch(() => {})
//     getOrderSettings().then(({ data }) => setOrder({ ...order, ...data.data })).catch(() => {})
//     getBusinessHours().then(({ data }) => {
//       if (data.data?.length) {
//         const map = {}; data.data.forEach((h) => (map[h.day] = h))
//         setHours(DAYS.map((day) => map[day] || { day, is_open: true, open_time: '09:00', close_time: '21:00' }))
//       }
//     }).catch(() => {})
//   }, [])

//   const saveBiz = async (e) => {
//     e.preventDefault(); setSaving(true)
//     try { await updateBusinessSettings(biz); toast.success('Business settings saved.') }
//     catch (err) { toast.error(err.response?.data?.message || 'Failed.') }
//     finally { setSaving(false) }
//   }

//   const saveOrder = async (e) => {
//     e.preventDefault(); setSaving(true)
//     try { await updateOrderSettings(order); toast.success('Order settings saved.') }
//     catch (err) { toast.error(err.response?.data?.message || 'Failed.') }
//     finally { setSaving(false) }
//   }

//   const saveHours = async (e) => {
//     e.preventDefault(); setSaving(true)
//     try { await updateBusinessHours(hours); toast.success('Business hours saved.') }
//     catch (err) { toast.error(err.response?.data?.message || 'Failed.') }
//     finally { setSaving(false) }
//   }

//   const updateHour = (day, field, value) => {
//     setHours(hours.map((h) => h.day === day ? { ...h, [field]: value } : h))
//   }

//   return (
//     <div className="page">
//       <div className="page__header"><div><h2 className="page__title">Settings</h2><p className="page__subtitle">Configure your business</p></div></div>

//       <div className="tabs">
//         {['business', 'order', 'hours'].map((t) => (
//           <button key={t} className={`tab-btn ${tab === t ? 'tab-btn--active' : ''}`} onClick={() => setTab(t)}>
//             {t === 'business' ? 'Business Info' : t === 'order' ? 'Order Config' : 'Business Hours'}
//           </button>
//         ))}
//       </div>

//       {tab === 'business' && (
//         <div className="section-card">
//           <div className="section-card__header"><h3 className="section-card__title">Business Information</h3></div>
//           <form className="settings-form" onSubmit={saveBiz}>
//             <div className="form-row">
//               <div className="form-group"><label className="form-label">Business Name *</label><input className="form-input" value={biz.business_name} onChange={(e) => setBiz({ ...biz, business_name: e.target.value })} /></div>
//               <div className="form-group"><label className="form-label">Mobile *</label><input className="form-input" value={biz.mobile} onChange={(e) => setBiz({ ...biz, mobile: e.target.value })} /></div>
//             </div>
//             <div className="form-row">
//               <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={biz.email} onChange={(e) => setBiz({ ...biz, email: e.target.value })} /></div>
//               <div className="form-group"><label className="form-label">WhatsApp Number</label><input className="form-input" value={biz.whatsapp_number} onChange={(e) => setBiz({ ...biz, whatsapp_number: e.target.value })} /></div>
//             </div>
//             <div className="form-group"><label className="form-label">Address *</label><textarea className="form-input" rows={3} value={biz.address} onChange={(e) => setBiz({ ...biz, address: e.target.value })} /></div>
//             <div className="settings-form__footer"><button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button></div>
//           </form>
//         </div>
//       )}

//       {tab === 'order' && (
//         <div className="section-card">
//           <div className="section-card__header"><h3 className="section-card__title">Order Configuration</h3></div>
//           <form className="settings-form" onSubmit={saveOrder}>
//             <div className="form-row">
//               <div className="form-group"><label className="form-label">Min Pre-Order Hours</label><input className="form-input" type="number" min={1} value={order.min_preorder_hours} onChange={(e) => setOrder({ ...order, min_preorder_hours: Number(e.target.value) })} /></div>
//               <div className="form-group"><label className="form-label">Timezone</label><input className="form-input" value={order.timezone} onChange={(e) => setOrder({ ...order, timezone: e.target.value })} /></div>
//             </div>
//             <div className="form-row">
//               <div className="form-group"><label className="form-label">Currency</label><input className="form-input" value={order.currency} onChange={(e) => setOrder({ ...order, currency: e.target.value })} /></div>
//               <div className="form-group"><label className="form-label">Order Prefix</label><input className="form-input" value={order.order_prefix} onChange={(e) => setOrder({ ...order, order_prefix: e.target.value })} /></div>
//             </div>
//             <div className="settings-form__footer"><button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button></div>
//           </form>
//         </div>
//       )}

//       {tab === 'hours' && (
//         <div className="section-card">
//           <div className="section-card__header"><h3 className="section-card__title">Business Hours</h3></div>
//           <form className="settings-form" onSubmit={saveHours}>
//             <div className="hours-grid">
//               {hours.map((h) => (
//                 <div key={h.day} className="hours-row">
//                   <div className="hours-row__day">{h.day}</div>
//                   <label className="toggle-label">
//                     <input type="checkbox" checked={h.is_open} onChange={(e) => updateHour(h.day, 'is_open', e.target.checked)} />
//                     <span>{h.is_open ? 'Open' : 'Closed'}</span>
//                   </label>
//                   {h.is_open && (
//                     <>
//                       <input type="time" className="form-input hours-input" value={h.open_time} onChange={(e) => updateHour(h.day, 'open_time', e.target.value)} />
//                       <span>to</span>
//                       <input type="time" className="form-input hours-input" value={h.close_time} onChange={(e) => updateHour(h.day, 'close_time', e.target.value)} />
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="settings-form__footer"><button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving...' : 'Save Hours'}</button></div>
//           </form>
//         </div>
//       )}
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import {
  getBusinessSettings, updateBusinessSettings,
  getOrderSettings, updateOrderSettings,
  getBusinessHours, updateBusinessHours,
  getChargeSettings, updateChargeSettings,
} from '../../services/adminService'
import toast from 'react-hot-toast'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DEFAULT_HOURS = DAYS.map((day) => ({ day, is_open: true, open_time: '09:00', close_time: '21:00' }))

const TAB_LABELS = {
  business: 'Business Info',
  order: 'Order Config',
  hours: 'Business Hours',
  charges: 'Delivery & Packing',
}

// Charge fields are kept as text so the admin can clear and retype freely.
const DEFAULT_CHARGES = {
  max_delivery_km: '10',
  delivery_rate_per_km: '10',
  packing_charge: '30',
  min_delivery_km: '1',
  packing_on_pickup: true,
  packing_on_delivery: true,
}

const chargesToForm = (c = {}) => ({
  max_delivery_km: String(c.max_delivery_km ?? 10),
  delivery_rate_per_km: String(c.delivery_rate_per_km ?? 10),
  packing_charge: String(c.packing_charge ?? 30),
  min_delivery_km: String(c.min_delivery_km ?? 1),
  packing_on_pickup: c.packing_on_pickup !== false,
  packing_on_delivery: c.packing_on_delivery !== false,
})

const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

const describeError = (err) => {
  const status = err?.response?.status
  const message = err?.response?.data?.message || err?.message || 'Request failed'
  return status ? `(${status}) ${message}` : message
}

export default function Settings() {
  const [tab, setTab] = useState('business')
  const [biz, setBiz] = useState({ business_name: '', mobile: '', email: '', address: '', whatsapp_number: '' })
  const [order, setOrder] = useState({ min_preorder_hours: 2, timezone: 'Asia/Kolkata', currency: 'INR', order_prefix: 'DRK' })
  const [hours, setHours] = useState(DEFAULT_HOURS)
  const [charges, setCharges] = useState(DEFAULT_CHARGES)
  const [chargesError, setChargesError] = useState('')
  const [chargesLoading, setChargesLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadCharges = async () => {
    setChargesLoading(true)
    try {
      const { data } = await getChargeSettings()
      setCharges(chargesToForm(data.data))
      setChargesError('')
    } catch (err) {
      console.error('Load charges failed:', err?.response?.status, err?.response?.data || err)
      setChargesError(describeError(err))
    } finally {
      setChargesLoading(false)
    }
  }

  useEffect(() => {
    getBusinessSettings().then(({ data }) => setBiz({ ...biz, ...data.data })).catch(() => {})
    getOrderSettings().then(({ data }) => setOrder({ ...order, ...data.data })).catch(() => {})
    getBusinessHours().then(({ data }) => {
      if (data.data?.length) {
        const map = {}; data.data.forEach((h) => (map[h.day] = h))
        setHours(DAYS.map((day) => map[day] || { day, is_open: true, open_time: '09:00', close_time: '21:00' }))
      }
    }).catch(() => {})
    loadCharges()
  }, [])

  const saveBiz = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await updateBusinessSettings(biz); toast.success('Business settings saved.') }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.') }
    finally { setSaving(false) }
  }

  const saveOrder = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await updateOrderSettings(order); toast.success('Order settings saved.') }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.') }
    finally { setSaving(false) }
  }

  const saveHours = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await updateBusinessHours(hours); toast.success('Business hours saved.') }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.') }
    finally { setSaving(false) }
  }

  const saveCharges = async (e) => {
    e.preventDefault()

    const max = Number(charges.max_delivery_km)
    const rate = Number(charges.delivery_rate_per_km)
    const packing = Number(charges.packing_charge)
    const min = Number(charges.min_delivery_km)

    if (![max, rate, packing, min].every((n) => Number.isFinite(n) && n >= 0)) {
      return toast.error('Enter valid numbers (0 or more) in every field.')
    }
    if (max > 0 && min > max) {
      return toast.error('Minimum billed distance cannot be more than the maximum delivery distance.')
    }

    setSaving(true)
    try {
      const { data } = await updateChargeSettings({
        max_delivery_km: max,
        delivery_rate_per_km: rate,
        packing_charge: packing,
        min_delivery_km: min,
        packing_on_pickup: charges.packing_on_pickup,
        packing_on_delivery: charges.packing_on_delivery,
      })
      if (data?.data) setCharges(chargesToForm(data.data))
      setChargesError('')
      toast.success('Delivery and packing settings saved.')
    } catch (err) {
      console.error('Save charges failed:', err?.response?.status, err?.response?.data || err)
      toast.error(describeError(err))
    } finally {
      setSaving(false)
    }
  }

  const updateHour = (day, field, value) => {
    setHours(hours.map((h) => h.day === day ? { ...h, [field]: value } : h))
  }

  // Live preview: same rule the backend uses (whole km x price per km)
  const rate = Number(charges.delivery_rate_per_km)
  const minKm = Number(charges.min_delivery_km)
  const maxKm = Number(charges.max_delivery_km)
  const preview =
    Number.isFinite(rate) && Number.isFinite(minKm)
      ? [1, 2, 3, 4]
          .filter((km) => !(maxKm > 0 && km > maxKm))
          .map((km) => ({ km, fee: Math.max(minKm, km) * rate }))
      : []

  return (
    <div className="page">
      <div className="page__header"><div><h2 className="page__title">Settings</h2><p className="page__subtitle">Configure your business</p></div></div>

      <div className="tabs">
        {['business', 'order', 'hours', 'charges'].map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'tab-btn--active' : ''}`} onClick={() => setTab(t)}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === 'business' && (
        <div className="section-card">
          <div className="section-card__header"><h3 className="section-card__title">Business Information</h3></div>
          <form className="settings-form" onSubmit={saveBiz}>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Business Name *</label><input className="form-input" value={biz.business_name} onChange={(e) => setBiz({ ...biz, business_name: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Mobile *</label><input className="form-input" value={biz.mobile} onChange={(e) => setBiz({ ...biz, mobile: e.target.value })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={biz.email} onChange={(e) => setBiz({ ...biz, email: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">WhatsApp Number</label><input className="form-input" value={biz.whatsapp_number} onChange={(e) => setBiz({ ...biz, whatsapp_number: e.target.value })} /></div>
            </div>
            <div className="form-group"><label className="form-label">Address *</label><textarea className="form-input" rows={3} value={biz.address} onChange={(e) => setBiz({ ...biz, address: e.target.value })} /></div>
            <div className="settings-form__footer"><button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button></div>
          </form>
        </div>
      )}

      {tab === 'order' && (
        <div className="section-card">
          <div className="section-card__header"><h3 className="section-card__title">Order Configuration</h3></div>
          <form className="settings-form" onSubmit={saveOrder}>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Min Pre-Order Hours</label><input className="form-input" type="number" min={1} value={order.min_preorder_hours} onChange={(e) => setOrder({ ...order, min_preorder_hours: Number(e.target.value) })} /></div>
              <div className="form-group"><label className="form-label">Timezone</label><input className="form-input" value={order.timezone} onChange={(e) => setOrder({ ...order, timezone: e.target.value })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Currency</label><input className="form-input" value={order.currency} onChange={(e) => setOrder({ ...order, currency: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Order Prefix</label><input className="form-input" value={order.order_prefix} onChange={(e) => setOrder({ ...order, order_prefix: e.target.value })} /></div>
            </div>
            <div className="settings-form__footer"><button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button></div>
          </form>
        </div>
      )}

      {tab === 'hours' && (
        <div className="section-card">
          <div className="section-card__header"><h3 className="section-card__title">Business Hours</h3></div>
          <form className="settings-form" onSubmit={saveHours}>
            <div className="hours-grid">
              {hours.map((h) => (
                <div key={h.day} className="hours-row">
                  <div className="hours-row__day">{h.day}</div>
                  <label className="toggle-label">
                    <input type="checkbox" checked={h.is_open} onChange={(e) => updateHour(h.day, 'is_open', e.target.checked)} />
                    <span>{h.is_open ? 'Open' : 'Closed'}</span>
                  </label>
                  {h.is_open && (
                    <>
                      <input type="time" className="form-input hours-input" value={h.open_time} onChange={(e) => updateHour(h.day, 'open_time', e.target.value)} />
                      <span>to</span>
                      <input type="time" className="form-input hours-input" value={h.close_time} onChange={(e) => updateHour(h.day, 'close_time', e.target.value)} />
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="settings-form__footer"><button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving...' : 'Save Hours'}</button></div>
          </form>
        </div>
      )}

      {tab === 'charges' && (
        <div className="section-card">
          <div className="section-card__header"><h3 className="section-card__title">Delivery &amp; Packing Charges</h3></div>
          <form className="settings-form" onSubmit={saveCharges}>
            {chargesError && (
              <div style={{ background: '#fff3f1', border: '1px solid #f1c6c0', color: '#b42318', borderRadius: 10, padding: 12, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span>
                  Could not load the saved values from the server: <strong>{chargesError}</strong>.
                  You can still enter values and click Save Charges.
                </span>
                <button type="button" className="btn btn--outline" onClick={loadCharges} disabled={chargesLoading}>
                  {chargesLoading ? 'Loading...' : 'Retry'}
                </button>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Maximum Delivery Distance (KM) *</label>
                <input
                  className="form-input" type="number" min={0} step="0.5" placeholder="10"
                  value={charges.max_delivery_km}
                  onChange={(e) => setCharges({ ...charges, max_delivery_km: e.target.value })}
                />
                <small style={{ color: '#64748b' }}>Orders beyond this distance are rejected. Enter 0 for no limit.</small>
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Price Per KM (₹) *</label>
                <input
                  className="form-input" type="number" min={0} step="1" placeholder="10"
                  value={charges.delivery_rate_per_km}
                  onChange={(e) => setCharges({ ...charges, delivery_rate_per_km: e.target.value })}
                />
                <small style={{ color: '#64748b' }}>Fee = whole km × this price. 2 km = 2 × price, 3 km = 3 × price.</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Packing Charge (₹) *</label>
                <input
                  className="form-input" type="number" min={0} step="1" placeholder="30"
                  value={charges.packing_charge}
                  onChange={(e) => setCharges({ ...charges, packing_charge: e.target.value })}
                />
                <small style={{ color: '#64748b' }}>Added to every order where packing is switched on below.</small>
              </div>
              <div className="form-group">
                <label className="form-label">Minimum Billed Distance (KM)</label>
                <input
                  className="form-input" type="number" min={0} step="1" placeholder="1"
                  value={charges.min_delivery_km}
                  onChange={(e) => setCharges({ ...charges, min_delivery_km: e.target.value })}
                />
                <small style={{ color: '#64748b' }}>Short trips are billed as at least this many km.</small>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Charge packing on</label>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <label className="toggle-label">
                  <input
                    type="checkbox" checked={charges.packing_on_pickup}
                    onChange={(e) => setCharges({ ...charges, packing_on_pickup: e.target.checked })}
                  />
                  <span>Pickup orders</span>
                </label>
                <label className="toggle-label">
                  <input
                    type="checkbox" checked={charges.packing_on_delivery}
                    onChange={(e) => setCharges({ ...charges, packing_on_delivery: e.target.checked })}
                  />
                  <span>Delivery orders</span>
                </label>
              </div>
            </div>

            {preview.length > 0 && (
              <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 10, padding: 14, fontSize: 14 }}>
                <strong>Customer will pay for delivery:</strong>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 8 }}>
                  {preview.map((p) => (
                    <span key={p.km}>{p.km} km → <strong>{rupees(p.fee)}</strong></span>
                  ))}
                </div>
                <div style={{ marginTop: 8, color: '#64748b' }}>
                  Packing: {rupees(Number(charges.packing_charge) || 0)}
                  {' · '}
                  {charges.packing_on_pickup ? 'on Pickup' : 'not on Pickup'}
                  {', '}
                  {charges.packing_on_delivery ? 'on Delivery' : 'not on Delivery'}
                </div>
              </div>
            )}
            <div className="settings-form__footer">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Charges'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}