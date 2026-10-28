// // // // import { useEffect, useState } from 'react'
// // // // import { Search, Eye } from 'lucide-react'
// // // // import { getOrders, getOrder, updateOrderStatus } from '../../services/adminService'
// // // // import Modal from '../../components/ui/Modal'
// // // // import Badge from '../../components/ui/Badge'
// // // // import Pagination from '../../components/ui/Pagination'
// // // // import toast from 'react-hot-toast'

// // // // const TRANSITIONS = {
// // // //   NEW: ['PAYMENT_PENDING', 'CANCELLED'],
// // // //   PAYMENT_PENDING: ['CONFIRMED', 'PAYMENT_FAILED', 'PAYMENT_EXPIRED', 'CANCELLED'],
// // // //   CONFIRMED: ['PROCESSING', 'CANCELLED'],
// // // //   PROCESSING: ['COMPLETED', 'CANCELLED'],
// // // //   COMPLETED: [], CANCELLED: [], PAYMENT_FAILED: [], PAYMENT_EXPIRED: [],
// // // // }

// // // // export default function Orders() {
// // // //   const [list, setList] = useState([])
// // // //   const [total, setTotal] = useState(0)
// // // //   const [page, setPage] = useState(1)
// // // //   const [loading, setLoading] = useState(true)
// // // //   const [search, setSearch] = useState('')
// // // //   const [statusFilter, setStatusFilter] = useState('')
// // // //   const [paymentFilter, setPaymentFilter] = useState('')
// // // //   const [typeFilter, setTypeFilter] = useState('')
// // // //   const [dateFrom, setDateFrom] = useState('')
// // // //   const [dateTo, setDateTo] = useState('')
// // // //   const [detail, setDetail] = useState(null)
// // // //   const [detailLoading, setDetailLoading] = useState(false)

// // // //   const fetch = async () => {
// // // //     setLoading(true)
// // // //     try {
// // // //       const { data } = await getOrders({ search, status: statusFilter, payment_status: paymentFilter, order_type: typeFilter, date_from: dateFrom, date_to: dateTo, page, limit: 20 })
// // // //       setList(data.data.orders); setTotal(data.data.total)
// // // //     } catch { toast.error('Failed to load orders.') }
// // // //     finally { setLoading(false) }
// // // //   }

// // // //   useEffect(() => { fetch() }, [search, statusFilter, paymentFilter, typeFilter, dateFrom, dateTo, page])

// // // //   const openDetail = async (id) => {
// // // //     setDetailLoading(true); setDetail({ loading: true })
// // // //     try { const { data } = await getOrder(id); setDetail(data.data) }
// // // //     catch { toast.error('Failed to load order.'); setDetail(null) }
// // // //     finally { setDetailLoading(false) }
// // // //   }

// // // //   const handleStatusChange = async (orderId, status) => {
// // // //     try {
// // // //       await updateOrderStatus(orderId, status)
// // // //       toast.success('Status updated.')
// // // //       fetch()
// // // //       if (detail?.order?._id === orderId) openDetail(orderId)
// // // //     } catch (err) { toast.error(err.response?.data?.message || 'Failed.') }
// // // //   }

// // // //   return (
// // // //     <div className="page">
// // // //       <div className="page__header">
// // // //         <div><h2 className="page__title">Orders</h2><p className="page__subtitle">View and manage all orders</p></div>
// // // //       </div>

// // // //       <div className="section-card">
// // // //         <div className="section-card__header">
// // // //           <div className="filters filters--wrap">
// // // //             <div className="search-box"><Search size={15} /><input placeholder="Search order / customer / mobile..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} /></div>
// // // //             <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
// // // //               <option value="">All Status</option>
// // // //               {['NEW','PAYMENT_PENDING','CONFIRMED','PROCESSING','COMPLETED','CANCELLED','PAYMENT_FAILED','PAYMENT_EXPIRED'].map(s => <option key={s} value={s}>{s}</option>)}
// // // //             </select>
// // // //             <select className="filter-select" value={paymentFilter} onChange={(e) => { setPaymentFilter(e.target.value); setPage(1) }}>
// // // //               <option value="">All Payments</option>
// // // //               <option value="PENDING">Pending</option>
// // // //               <option value="SUCCESS">Success</option>
// // // //               <option value="FAILED">Failed</option>
// // // //             </select>
// // // //             <select className="filter-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}>
// // // //               <option value="">All Types</option>
// // // //               <option value="IMMEDIATE">Immediate</option>
// // // //               <option value="PRE_ORDER">Pre-Order</option>
// // // //             </select>
// // // //             <input type="date" className="filter-select" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} />
// // // //             <input type="date" className="filter-select" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} />
// // // //           </div>
// // // //         </div>

// // // //         {loading ? <div className="page-loader"><span className="spinner" /></div> : (
// // // //           <div className="table-wrap">
// // // //             <table className="table">
// // // //               <thead><tr><th>Order No</th><th>Customer</th><th>Type</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
// // // //               <tbody>
// // // //                 {list.length === 0 && <tr><td colSpan={8}><div className="empty-state">No orders found.</div></td></tr>}
// // // //                 {list.map((o) => (
// // // //                   <tr key={o._id}>
// // // //                     <td><span className="order-num">{o.order_number}</span></td>
// // // //                     <td>{o.customer_id?.name || '—'}<br /><small>{o.customer_id?.mobile}</small></td>
// // // //                     <td><Badge value={o.order_type} /></td>
// // // //                     <td>₹{o.total_amount?.toLocaleString('en-IN')}</td>
// // // //                     <td><Badge value={o.payment_status} /></td>
// // // //                     <td><Badge value={o.status} /></td>
// // // //                     <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
// // // //                     <td><button className="icon-btn icon-btn--view" onClick={() => openDetail(o._id)}><Eye size={15} /></button></td>
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         )}
// // // //         <div className="table-footer"><Pagination page={page} total={total} limit={20} onChange={setPage} /></div>
// // // //       </div>

// // // //       {detail && (
// // // //         <Modal title={`Order — ${detail.order?.order_number || ''}`} onClose={() => setDetail(null)} width="620px">
// // // //           {detail.loading ? <div className="page-loader"><span className="spinner" /></div> : (
// // // //             <div className="order-detail">
// // // //               <div className="order-detail__section">
// // // //                 <h4>Customer</h4>
// // // //                 <p>{detail.order?.customer_id?.name} · {detail.order?.customer_id?.mobile}</p>
// // // //                 {detail.order?.customer_id?.email && <p>{detail.order.customer_id.email}</p>}
// // // //               </div>
// // // //               <div className="order-detail__section">
// // // //                 <h4>Order Info</h4>
// // // //                 <p>Type: <Badge value={detail.order?.order_type} /> &nbsp; Status: <Badge value={detail.order?.status} /></p>
// // // //                 {detail.order?.requested_at && <p>Requested: {new Date(detail.order.requested_at).toLocaleString('en-IN')}</p>}
// // // //               </div>
// // // //               <div className="order-detail__section">
// // // //                 <h4>Items</h4>
// // // //                 <table className="table">
// // // //                   <thead><tr><th>Product</th><th>Variant</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
// // // //                   <tbody>
// // // //                     {detail.items?.map((item) => (
// // // //                       <tr key={item._id}>
// // // //                         <td>{item.product_name_snapshot}</td>
// // // //                         <td>{item.variant_name_snapshot}</td>
// // // //                         <td>{item.quantity}</td>
// // // //                         <td>₹{item.unit_price_snapshot}</td>
// // // //                         <td>₹{item.subtotal}</td>
// // // //                       </tr>
// // // //                     ))}
// // // //                   </tbody>
// // // //                 </table>
// // // //                 <p className="order-detail__total">Total: ₹{detail.order?.total_amount?.toLocaleString('en-IN')}</p>
// // // //               </div>
// // // //               {detail.payment && (
// // // //                 <div className="order-detail__section">
// // // //                   <h4>Payment</h4>
// // // //                   <p>Status: <Badge value={detail.payment.status} /> &nbsp; Gateway: {detail.payment.gateway}</p>
// // // //                   {detail.payment.gateway_payment_id && <p>Ref: {detail.payment.gateway_payment_id}</p>}
// // // //                 </div>
// // // //               )}
// // // //               {TRANSITIONS[detail.order?.status]?.length > 0 && (
// // // //                 <div className="order-detail__section">
// // // //                   <h4>Update Status</h4>
// // // //                   <div className="action-btns">
// // // //                     {TRANSITIONS[detail.order.status].map((s) => (
// // // //                       <button key={s} className="btn btn--outline btn--sm" onClick={() => handleStatusChange(detail.order._id, s)}>{s}</button>
// // // //                     ))}
// // // //                   </div>
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           )}
// // // //         </Modal>
// // // //       )}
// // // //     </div>
// // // //   )
// // // // }
// // // import { useEffect, useRef, useState } from 'react'
// // // import { Search, Eye, RotateCcw } from 'lucide-react'
// // // import { getOrders } from '../../services/adminService'
// // // import Modal from '../../components/ui/Modal'
// // // import Badge from '../../components/ui/Badge'
// // // import Pagination from '../../components/ui/Pagination'
// // // import toast from 'react-hot-toast'

// // // const LIMIT = 20

// // // // NOTE: keep these values in sync with your backend enums
// // // const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']
// // // const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']
// // // const ORDER_TYPES = [
// // //   { value: 'instant', label: 'Instant' },
// // //   { value: 'pre_order', label: 'Pre-order' },
// // // ]

// // // const EMPTY_FILTERS = { status: '', payment_status: '', order_type: '', date_from: '', date_to: '' }

// // // const cap = (s) => (s ? s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : '—')
// // // const money = (n) => (n == null ? '—' : `₹${Number(n).toLocaleString('en-IN')}`)
// // // const fmtDate = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—')

// // // const customerName = (o) => o.customer_id?.name || o.customer_name || '—'
// // // const customerMobile = (o) => o.customer_id?.mobile || o.customer_mobile || ''

// // // const paymentClass = (s) => (s === 'paid' ? 'badge--green' : s === 'failed' ? 'badge--red' : s === 'refunded' ? 'badge--blue' : 'badge--yellow')
// // // const typeClass = (t) => (t === 'pre_order' ? 'badge--blue' : 'badge--green')

// // // export default function Orders() {
// // //   const [list, setList] = useState([])
// // //   const [total, setTotal] = useState(0)
// // //   const [page, setPage] = useState(1)
// // //   const [loading, setLoading] = useState(true)
// // //   const [error, setError] = useState(false)
// // //   const [searchInput, setSearchInput] = useState('')
// // //   const [search, setSearch] = useState('')
// // //   const [filters, setFilters] = useState(EMPTY_FILTERS)
// // //   const [selected, setSelected] = useState(null)
 
// // //   const requestId = useRef(0)

// // //   // ---------- data loading ----------
// // //   const loadOrders = async () => {
// // //     const current = ++requestId.current
// // //     setLoading(true)
// // //     setError(false)
// // //     try {
// // //       const params = { page, limit: LIMIT }
// // //       if (search) params.search = search
// // //       Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })

// // //       const { data } = await getOrders(params)
// // //       if (current !== requestId.current) return // ignore stale response
// // //       setList(data.data.orders || [])
// // //       setTotal(data.data.total || 0)
// // //     } catch (err) {
// // //       if (current === requestId.current) {
// // //         setError(true)
// // //         toast.error(err.response?.data?.message || 'Failed to load orders.')
// // //       }
// // //     } finally {
// // //       if (current === requestId.current) setLoading(false)
// // //     }
// // //   }

// // //   useEffect(() => { loadOrders() }, [search, filters, page])

// // //   // debounce search (order no, customer name, mobile)
// // //   useEffect(() => {
// // //     const t = setTimeout(() => { setSearch(searchInput.trim()); setPage(1) }, 400)
// // //     return () => clearTimeout(t)
// // //   }, [searchInput])

// // //   // ---------- filters ----------
// // //   const setFilter = (key, value) => {
// // //     // date range sanity check
// // //     if (key === 'date_from' && value && filters.date_to && value > filters.date_to) {
// // //       return toast.error('"From" date cannot be after "To" date.')
// // //     }
// // //     if (key === 'date_to' && value && filters.date_from && value < filters.date_from) {
// // //       return toast.error('"To" date cannot be before "From" date.')
// // //     }
// // //     setFilters((f) => ({ ...f, [key]: value }))
// // //     setPage(1)
// // //   }

// // //   const hasFilters = searchInput || Object.values(filters).some(Boolean)

// // //   const resetFilters = () => {
// // //     setSearchInput('')
// // //     setSearch('')
// // //     setFilters(EMPTY_FILTERS)
// // //     setPage(1)
// // //   }

// // //   return (
// // //     <div className="page">
// // //       <div className="page__header">
// // //         <div><h2 className="page__title">Orders</h2><p className="page__subtitle">View and process incoming orders</p></div>
// // //       </div>

// // //       <div className="section-card">
// // //         <div className="section-card__header">
// // //           <div className="filters" style={{ flexWrap: 'wrap', gap: 8 }}>
// // //             <div className="search-box">
// // //               <Search size={15} />
// // //               <input placeholder="Search order no, customer, mobile..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
// // //             </div>

// // //             <select className="filter-select" value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
// // //               <option value="">All Status</option>
// // //               {ORDER_STATUSES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
// // //             </select>

// // //             <select className="filter-select" value={filters.payment_status} onChange={(e) => setFilter('payment_status', e.target.value)}>
// // //               <option value="">All Payments</option>
// // //               {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
// // //             </select>

// // //             <select className="filter-select" value={filters.order_type} onChange={(e) => setFilter('order_type', e.target.value)}>
// // //               <option value="">All Order Types</option>
// // //               {ORDER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
// // //             </select>

// // //             <input className="filter-select" type="date" title="From date" value={filters.date_from}
// // //               max={filters.date_to || undefined} onChange={(e) => setFilter('date_from', e.target.value)} />
// // //             <input className="filter-select" type="date" title="To date" value={filters.date_to}
// // //               min={filters.date_from || undefined} onChange={(e) => setFilter('date_to', e.target.value)} />

// // //             {hasFilters && (
// // //               <button type="button" className="btn btn--outline" onClick={resetFilters}><RotateCcw size={14} /> Reset</button>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {loading ? <div className="page-loader"><span className="spinner" /></div> : (
// // //           <div className="table-wrap">
// // //             <table className="table">
// // //               <thead>
// // //                 <tr>
// // //                   <th>Order No</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Order Type</th>
// // //                   <th>Requested Time</th><th>Status</th><th>Created Time</th><th>Action</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {error && list.length === 0 && (
// // //                   <tr><td colSpan={9}><div className="empty-state">Could not load orders. <button type="button" className="btn btn--outline" onClick={loadOrders}>Retry</button></div></td></tr>
// // //                 )}
// // //                 {!error && list.length === 0 && <tr><td colSpan={9}><div className="empty-state">No orders found.</div></td></tr>}
// // //                 {list.map((o) => (
// // //                   <tr key={o._id}>
// // //                     <td><strong>{o.order_number}</strong></td>
// // //                     <td>
// // //                       <div>{customerName(o)}</div>
// // //                       {customerMobile(o) && <small style={{ color: '#64748b' }}>{customerMobile(o)}</small>}
// // //                     </td>
// // //                     <td>{money(o.total_amount ?? o.amount)}</td>
// // //                     <td><span className={`badge ${paymentClass(o.payment_status)}`}>{cap(o.payment_status)}</span></td>
// // //                     <td><span className={`badge ${typeClass(o.order_type)}`}>{cap(o.order_type)}</span></td>
// // //                     <td>{fmtDate(o.requested_at)}</td>
// // //                     <td><Badge value={o.status} /></td>
// // //                     <td>{fmtDate(o.created_at || o.createdAt)}</td>
// // //                     <td>
// // //                       <div className="action-btns">
// // //                         <button className="icon-btn" title="View" onClick={() => setSelected(o)}><Eye size={15} /></button>
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         )}

// // //         <div className="table-footer">
// // //           <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />
// // //         </div>
// // //       </div>

// // //       {selected && (
// // //         <Modal title={`Order ${selected.order_number}`} onClose={() => setSelected(null)}>
// // //           <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px 12px', fontSize: 14 }}>
// // //             <strong>Customer</strong><span>{customerName(selected)}</span>
// // //             <strong>Mobile</strong><span>{customerMobile(selected) || '—'}</span>
// // //             <strong>Amount</strong><span>{money(selected.total_amount ?? selected.amount)}</span>
// // //             <strong>Payment</strong><span>{cap(selected.payment_status)}</span>
// // //             <strong>Order Type</strong><span>{cap(selected.order_type)}</span>
// // //             <strong>Requested Time</strong><span>{fmtDate(selected.requested_at)}</span>
// // //             <strong>Status</strong><span>{cap(selected.status)}</span>
// // //             <strong>Created Time</strong><span>{fmtDate(selected.created_at || selected.createdAt)}</span>
             
// // //           </div>
          
// // //         </Modal>
        
// // //       )}
// // //     </div>
// // //   )
// // // }
// // import { useEffect, useMemo, useRef, useState } from 'react'
// // import { Search, Eye, RotateCcw, CalendarDays, Store, Truck } from 'lucide-react'
// // import { getOrders, getProducts, getProductPreorder } from '../../services/adminService'
// // import Modal from '../../components/ui/Modal'
// // import Badge from '../../components/ui/Badge'
// // import Pagination from '../../components/ui/Pagination'
// // import toast from 'react-hot-toast'

// // const LIMIT = 20

// // // NOTE: keep these values in sync with your backend enums
// // const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']
// // const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']
// // const ORDER_TYPES = [
// //   { value: 'instant', label: 'Instant' },
// //   { value: 'pre_order', label: 'Pre-order' },
// // ]

// // const EMPTY_FILTERS = { status: '', payment_status: '', order_type: '', date_from: '', date_to: '' }

// // const cap = (s) => (s ? s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : '—')
// // const money = (n) => (n == null ? '—' : `₹${Number(n).toLocaleString('en-IN')}`)
// // const moneyDec = (n) =>
// //   `₹${Number(n ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
// // const fmtDate = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—')

// // const getTodayIstDate = () => {
// //   const parts = new Intl.DateTimeFormat('en-CA', {
// //     timeZone: 'Asia/Kolkata',
// //     year: 'numeric',
// //     month: '2-digit',
// //     day: '2-digit',
// //   }).formatToParts(new Date())
// //   const get = (type) => parts.find((p) => p.type === type)?.value
// //   return `${get('year')}-${get('month')}-${get('day')}`
// // }

// // const formatClockTime = (time) => {
// //   const [hour, minute] = time.split(':').map(Number)
// //   const suffix = hour >= 12 ? 'PM' : 'AM'
// //   const displayHour = hour % 12 || 12
// //   return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`
// // }

// // const toIstTimestamp = (date, time) =>
// //   new Date(`${date}T${time}:00+05:30`).getTime()

// // const customerName = (o) => o.customer_id?.name || o.customer_name || '—'
// // const customerMobile = (o) => o.customer_id?.mobile || o.customer_mobile || ''

// // const paymentClass = (s) => (s === 'paid' ? 'badge--green' : s === 'failed' ? 'badge--red' : s === 'refunded' ? 'badge--blue' : 'badge--yellow')
// // const typeClass = (t) => (t === 'pre_order' ? 'badge--blue' : 'badge--green')

// // const boxStyle = {
// //   border: '1px solid #e5e7eb',
// //   borderRadius: 10,
// //   padding: 12,
// //   display: 'grid',
// //   gap: 8,
// //   fontSize: 14,
// //   background: '#fff',
// // }
// // const lineStyle = { display: 'flex', justifyContent: 'space-between' }
// // const fieldStyle = {
// //   width: '100%',
// //   boxSizing: 'border-box',
// //   padding: '10px 12px',
// //   border: '1px solid #e5e7eb',
// //   borderRadius: 8,
// //   fontSize: 14,
// //   fontFamily: 'inherit',
// //   background: '#fff',
// // }
// // const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }

// // /* ───────────── Pre-order availability (moved from Products page) ───────────── */

// // function PreorderModal({ onClose }) {
// //   const [products, setProducts] = useState([])
// //   const [productsLoading, setProductsLoading] = useState(true)
// //   const [productId, setProductId] = useState('')
// //   const [date, setDate] = useState(getTodayIstDate)
// //   const [time, setTime] = useState('')
// //   const [fulfillment, setFulfillment] = useState('pickup')
// //   const [variantId, setVariantId] = useState('')
// //   const [preorderData, setPreorderData] = useState(null)
// //   const [loading, setLoading] = useState(false)
// //   const [serverClockOffset, setServerClockOffset] = useState(0)
// //   const [clockTick, setClockTick] = useState(Date.now())

// //   useEffect(() => {
// //     const timer = window.setInterval(
// //       () => setClockTick(Date.now()),
// //       30_000
// //     )
// //     return () => window.clearInterval(timer)
// //   }, [])

// //   // load product list for the picker
// //   useEffect(() => {
// //     let active = true
// //     const loadProducts = async () => {
// //       try {
// //         const { data } = await getProducts({ search: '', status: 'active', category_id: '', page: 1, limit: 100 })
// //         if (!active) return
// //         const items = Array.isArray(data?.data?.products) ? data.data.products : []
// //         setProducts(items)
// //         if (items.length) setProductId(items[0]._id)
// //       } catch (err) {
// //         if (active) toast.error(err.response?.data?.message || 'Failed to load products.')
// //       } finally {
// //         if (active) setProductsLoading(false)
// //       }
// //     }
// //     loadProducts()
// //     return () => { active = false }
// //   }, [])

// //   // load pre-order availability for the chosen product + date
// //   useEffect(() => {
// //     if (!productId) return
// //     let active = true
// //     const loadPreorder = async () => {
// //       setLoading(true)
// //       try {
// //         const response = await getProductPreorder(productId, date)
// //         const data = response?.data?.data
// //         if (!active) return
// //         setPreorderData(data ?? null)
// //         const serverNow = Date.parse(data?.preorder?.serverNow)
// //         if (Number.isFinite(serverNow)) {
// //           setServerClockOffset(serverNow - Date.now())
// //         }
// //         setVariantId((current) =>
// //           data?.variants?.some((v) => v._id === current) ? current : data?.variants?.[0]?._id ?? ''
// //         )
// //       } catch (err) {
// //         if (active) {
// //           toast.error(err.response?.data?.message || 'Failed to load pre-order availability.')
// //           setPreorderData(null)
// //           setVariantId('')
// //         }
// //       } finally {
// //         if (active) setLoading(false)
// //       }
// //     }
// //     loadPreorder()
// //     return () => { active = false }
// //   }, [productId, date])

// //   const preorder = preorderData?.preorder
// //   const variant = preorderData?.variants?.find((v) => v._id === variantId)
// //   const pricing = variant?.pricing?.[fulfillment]
// //   const availableTimes = useMemo(() => {
// //     if (!preorder?.isOpen || !preorder.openingTime || !preorder.closingTime) {
// //       return []
// //     }

// //     const toMinutes = (value) => {
// //       const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value)
// //       return match ? Number(match[1]) * 60 + Number(match[2]) : null
// //     }
// //     const opening = toMinutes(preorder.openingTime)
// //     const closing = toMinutes(preorder.closingTime)
// //     if (opening === null || closing === null || closing < opening) return []

// //     const leadHours = Math.max(2, Number(preorder.leadHours) || 2)
// //     const earliest = clockTick + serverClockOffset + leadHours * 60 * 60 * 1000
// //     const today = getTodayIstDate()
// //     const options = []

// //     for (let minutes = opening; minutes <= closing; minutes += 30) {
// //       const value = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
// //       if (date === today && toIstTimestamp(date, value) < earliest) continue
// //       options.push(value)
// //     }

// //     return options
// //   }, [date, preorder, clockTick, serverClockOffset])

// //   useEffect(() => {
// //     setTime((current) =>
// //       availableTimes.includes(current) ? current : availableTimes[0] || ''
// //     )
// //   }, [availableTimes])

// //   const segBtn = (active) => ({
// //     flex: 1,
// //     justifyContent: 'center',
// //     ...(active ? { background: '#eff6ff', borderColor: '#3b82f6', color: '#1d4ed8' } : {}),
// //   })

// //   return (
// //     <Modal title="Pre-order availability" onClose={onClose}>
// //       <div style={{ display: 'grid', gap: 16 }}>
// //         <div>
// //           <label style={labelStyle} htmlFor="preorder-product">Product</label>
// //           <select
// //             id="preorder-product"
// //             style={fieldStyle}
// //             value={productId}
// //             disabled={productsLoading || products.length === 0}
// //             onChange={(e) => setProductId(e.target.value)}
// //           >
// //             {productsLoading && <option value="">Loading products...</option>}
// //             {!productsLoading && products.length === 0 && <option value="">No products found</option>}
// //             {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
// //           </select>
// //         </div>

// //         <div>
// //           <label style={labelStyle} htmlFor="preorder-date">Pre-order date</label>
// //           <input
// //             id="preorder-date"
// //             style={fieldStyle}
// //             type="date"
// //             min={getTodayIstDate()}
// //             value={date}
// //             onChange={(e) => setDate(e.target.value)}
// //           />
// //         </div>

// //         <div>
// //           <label style={labelStyle} htmlFor="preorder-time">Available pre-order time</label>
// //           <select
// //             id="preorder-time"
// //             style={fieldStyle}
// //             value={time}
// //             disabled={loading || availableTimes.length === 0}
// //             onChange={(e) => setTime(e.target.value)}
// //           >
// //             {availableTimes.length ? (
// //               availableTimes.map((option) => (
// //                 <option key={option} value={option}>
// //                 {formatClockTime(option)}
// //                 </option>
// //               ))
// //             ) : (
// //               <option value="">No available times</option>
// //             )}
// //           </select>
// //           <small style={{ display: 'block', marginTop: 6, color: '#64748b' }}>
// //             Minimum pre-order time: 2 hours. Final order validation uses server time
// //             (Asia/Kolkata).
// //           </small>
// //         </div>

// //         {loading ? (
// //           <div className="page-loader"><span className="spinner" /></div>
// //         ) : preorder ? (
// //           <div style={boxStyle}>
// //             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //               <CalendarDays size={16} />
// //               <strong>Availability</strong>
// //               <span className={`badge ${preorder.isOpen ? 'badge--green' : 'badge--red'}`} style={{ marginLeft: 'auto' }}>
// //                 {preorder.isOpen ? 'Open' : 'Closed'}
// //               </span>
// //             </div>
// //             <div>Date / day: <strong>{preorder.date} ({preorder.day})</strong></div>
// //             <div>Opening: <strong>{preorder.openingTime || 'Not configured'}</strong></div>
// //             <div>Closing: <strong>{preorder.closingTime || 'Not configured'}</strong></div>
// //             {preorder.message && <small>{preorder.message}</small>}
// //           </div>
// //         ) : null}

// //         {!loading && preorderData && (
// //           <>
// //             <div>
// //               <label style={labelStyle} htmlFor="preorder-variant">Product option</label>
// //               <select
// //                 id="preorder-variant"
// //                 style={fieldStyle}
// //                 value={variantId}
// //                 onChange={(e) => setVariantId(e.target.value)}
// //                 disabled={!preorderData.variants?.length}
// //               >
// //                 {preorderData.variants?.length ? (
// //                   preorderData.variants.map((item) => (
// //                     <option key={item._id} value={item._id}>{item.variant_name}</option>
// //                   ))
// //                 ) : (
// //                   <option value="">No available product options</option>
// //                 )}
// //               </select>
// //             </div>

// //             <div style={{ display: 'flex', gap: 8 }}>
// //               <button type="button" className="btn btn--outline" style={segBtn(fulfillment === 'pickup')} onClick={() => setFulfillment('pickup')}>
// //                 <Store size={15} /> Pickup
// //               </button>
// //               <button type="button" className="btn btn--outline" style={segBtn(fulfillment === 'delivery')} onClick={() => setFulfillment('delivery')}>
// //                 <Truck size={15} /> Delivery
// //               </button>
// //             </div>

// //             <div style={boxStyle}>
// //               {pricing ? (
// //                 <>
// //                   <div style={lineStyle}><span>Subtotal</span><strong>{moneyDec(pricing.subtotal)}</strong></div>
// //                   <div style={lineStyle}><span>Packing charge</span><strong>{moneyDec(pricing.packingCharge)}</strong></div>
// //                   {fulfillment === 'delivery' && (
// //                     <div style={lineStyle}><span>Delivery charge</span><strong>{moneyDec(pricing.deliveryCharge)}</strong></div>
// //                   )}
// //                   <div style={{ ...lineStyle, borderTop: '1px dashed #d1d5db', paddingTop: 10, fontWeight: 800 }}>
// //                     <span>Total</span><span>{moneyDec(pricing.total)}</span>
// //                   </div>
// //                 </>
// //               ) : (
// //                 <small>Select an available product option to see pricing.</small>
// //               )}
// //             </div>
// //           </>
// //         )}
// //       </div>
// //     </Modal>
// //   )
// // }

// // /* ───────────────────────── ORDERS PAGE ───────────────────────── */

// // export default function Orders() {
// //   const [list, setList] = useState([])
// //   const [total, setTotal] = useState(0)
// //   const [page, setPage] = useState(1)
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState(false)
// //   const [searchInput, setSearchInput] = useState('')
// //   const [search, setSearch] = useState('')
// //   const [filters, setFilters] = useState(EMPTY_FILTERS)
// //   const [selected, setSelected] = useState(null)
// //   const [preorderOpen, setPreorderOpen] = useState(false)

// //   const requestId = useRef(0)

// //   // ---------- data loading ----------
// //   const loadOrders = async () => {
// //     const current = ++requestId.current
// //     setLoading(true)
// //     setError(false)
// //     try {
// //       const params = { page, limit: LIMIT }
// //       if (search) params.search = search
// //       Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })

// //       const { data } = await getOrders(params)
// //       if (current !== requestId.current) return // ignore stale response
// //       setList(data.data.orders || [])
// //       setTotal(data.data.total || 0)
// //     } catch (err) {
// //       if (current === requestId.current) {
// //         setError(true)
// //         toast.error(err.response?.data?.message || 'Failed to load orders.')
// //       }
// //     } finally {
// //       if (current === requestId.current) setLoading(false)
// //     }
// //   }

// //   useEffect(() => { loadOrders() }, [search, filters, page])

// //   // debounce search (order no, customer name, mobile)
// //   useEffect(() => {
// //     const t = setTimeout(() => { setSearch(searchInput.trim()); setPage(1) }, 400)
// //     return () => clearTimeout(t)
// //   }, [searchInput])

// //   // ---------- filters ----------
// //   const setFilter = (key, value) => {
// //     // date range sanity check
// //     if (key === 'date_from' && value && filters.date_to && value > filters.date_to) {
// //       return toast.error('"From" date cannot be after "To" date.')
// //     }
// //     if (key === 'date_to' && value && filters.date_from && value < filters.date_from) {
// //       return toast.error('"To" date cannot be before "From" date.')
// //     }
// //     setFilters((f) => ({ ...f, [key]: value }))
// //     setPage(1)
// //   }

// //   const hasFilters = searchInput || Object.values(filters).some(Boolean)

// //   const resetFilters = () => {
// //     setSearchInput('')
// //     setSearch('')
// //     setFilters(EMPTY_FILTERS)
// //     setPage(1)
// //   }

// //   return (
// //     <div className="page">
// //       <div className="page__header">
// //         <div><h2 className="page__title">Orders</h2><p className="page__subtitle">View and process incoming orders</p></div>
// //         <button type="button" className="btn btn--primary" onClick={() => setPreorderOpen(true)}>
// //           <CalendarDays size={15} /> Pre-order availability
// //         </button>
// //       </div>

// //       <div className="section-card">
// //         <div className="section-card__header">
// //           <div className="filters" style={{ flexWrap: 'wrap', gap: 8 }}>
// //             <div className="search-box">
// //               <Search size={15} />
// //               <input placeholder="Search order no, customer, mobile..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
// //             </div>

// //             <select className="filter-select" value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
// //               <option value="">All Status</option>
// //               {ORDER_STATUSES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
// //             </select>

// //             <select className="filter-select" value={filters.payment_status} onChange={(e) => setFilter('payment_status', e.target.value)}>
// //               <option value="">All Payments</option>
// //               {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
// //             </select>

// //             <select className="filter-select" value={filters.order_type} onChange={(e) => setFilter('order_type', e.target.value)}>
// //               <option value="">All Order Types</option>
// //               {ORDER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
// //             </select>

// //             <input className="filter-select" type="date" title="From date" value={filters.date_from}
// //               max={filters.date_to || undefined} onChange={(e) => setFilter('date_from', e.target.value)} />
// //             <input className="filter-select" type="date" title="To date" value={filters.date_to}
// //               min={filters.date_from || undefined} onChange={(e) => setFilter('date_to', e.target.value)} />

// //             {hasFilters && (
// //               <button type="button" className="btn btn--outline" onClick={resetFilters}><RotateCcw size={14} /> Reset</button>
// //             )}
// //           </div>
// //         </div>

// //         {loading ? <div className="page-loader"><span className="spinner" /></div> : (
// //           <div className="table-wrap">
// //             <table className="table">
// //               <thead>
// //                 <tr>
// //                   <th>Order No</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Order Type</th>
// //                   <th>Requested Time</th><th>Status</th><th>Created Time</th><th>Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {error && list.length === 0 && (
// //                   <tr><td colSpan={9}><div className="empty-state">Could not load orders. <button type="button" className="btn btn--outline" onClick={loadOrders}>Retry</button></div></td></tr>
// //                 )}
// //                 {!error && list.length === 0 && <tr><td colSpan={9}><div className="empty-state">No orders found.</div></td></tr>}
// //                 {list.map((o) => (
// //                   <tr key={o._id}>
// //                     <td><strong>{o.order_number}</strong></td>
// //                     <td>
// //                       <div>{customerName(o)}</div>
// //                       {customerMobile(o) && <small style={{ color: '#64748b' }}>{customerMobile(o)}</small>}
// //                     </td>
// //                     <td>{money(o.total_amount ?? o.amount)}</td>
// //                     <td><span className={`badge ${paymentClass(o.payment_status)}`}>{cap(o.payment_status)}</span></td>
// //                     <td><span className={`badge ${typeClass(o.order_type)}`}>{cap(o.order_type)}</span></td>
// //                     <td>{fmtDate(o.requested_at)}</td>
// //                     <td><Badge value={o.status} /></td>
// //                     <td>{fmtDate(o.created_at || o.createdAt)}</td>
// //                     <td>
// //                       <div className="action-btns">
// //                         <button className="icon-btn" title="View" onClick={() => setSelected(o)}><Eye size={15} /></button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}

// //         <div className="table-footer">
// //           <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />
// //         </div>
// //       </div>

// //       {selected && (
// //         <Modal title={`Order ${selected.order_number}`} onClose={() => setSelected(null)}>
// //           <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px 12px', fontSize: 14 }}>
// //             <strong>Customer</strong><span>{customerName(selected)}</span>
// //             <strong>Mobile</strong><span>{customerMobile(selected) || '—'}</span>
// //             <strong>Amount</strong><span>{money(selected.total_amount ?? selected.amount)}</span>
// //             <strong>Payment</strong><span>{cap(selected.payment_status)}</span>
// //             <strong>Order Type</strong><span>{cap(selected.order_type)}</span>
// //             <strong>Requested Time</strong><span>{fmtDate(selected.requested_at)}</span>
// //             <strong>Status</strong><span>{cap(selected.status)}</span>
// //             <strong>Created Time</strong><span>{fmtDate(selected.created_at || selected.createdAt)}</span>
// //           </div>
// //         </Modal>
// //       )}

// //       {preorderOpen && <PreorderModal onClose={() => setPreorderOpen(false)} />}
// //     </div>
// //   )
// // }
// import { useCallback, useEffect, useRef, useState } from 'react'
// import { Search, X } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Pagination from '../../components/ui/Pagination'
// import * as svc from '../../services/ordersService'
// import '../../components/styles/Orders.css'

// const LIMIT = 20
// const IST = 'Asia/Kolkata'

// const TABS = [
//   { key: 'new', label: 'New' },
//   { key: 'kitchen', label: 'In kitchen' },
//   { key: 'ready', label: 'Ready / out' },
//   { key: 'scheduled', label: 'Scheduled' },
//   { key: 'completed', label: 'Completed' },
//   { key: 'cancelled', label: 'Cancelled' },
//   { key: 'all', label: 'All' },
// ]
// const TYPES = [
//   { key: '', label: 'All' },
//   { key: 'PICKUP', label: 'Pickup' },
//   { key: 'DELIVERY', label: 'Delivery' },
// ]

// const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
// const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong'

// const dayKey = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: IST })
// const timeText = (d) => {
//   if (!d) return '—'
//   const t = new Date(d)
//     .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: IST })
//     .toUpperCase()
//   if (dayKey(d) === dayKey(new Date())) return t
//   const day = new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: IST })
//   return `${day}, ${t}`
// }
// const nowText = () => {
//   const d = new Date()
//   const date = d.toLocaleDateString('en-IN', {
//     weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', timeZone: IST,
//   })
//   const time = d
//     .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: IST })
//     .toUpperCase()
//   return `${date} · ${time}`
// }

// export default function Orders() {
//   const [tab, setTab] = useState('all')
//   const [type, setType] = useState('')
//   const [searchInput, setSearchInput] = useState('')
//   const [search, setSearch] = useState('')
//   const [page, setPage] = useState(1)
//   const [data, setData] = useState({ orders: [], total: 0, counts: {} })
//   const [loading, setLoading] = useState(true)
//   const [failed, setFailed] = useState(false)
//   const [busyId, setBusyId] = useState(null)
//   const [drawerId, setDrawerId] = useState(null)
//   const [detail, setDetail] = useState(null)
//   const [clock, setClock] = useState(nowText())
//   const reqId = useRef(0)

//   const load = useCallback(
//     async (silent = false) => {
//       const id = ++reqId.current
//       if (!silent) setLoading(true)
//       try {
//         const params = { page, limit: LIMIT }
//         if (tab !== 'all') params.group = tab
//         if (type) params.fulfillment_type = type
//         if (search) params.search = search
//         const d = await svc.fetchOrders(params)
//         if (id !== reqId.current) return
//         setData({ orders: d.orders || [], total: d.total || 0, counts: d.counts || {} })
//         setFailed(false)
//       } catch (e) {
//         if (id === reqId.current && !silent) {
//           setFailed(true)
//           toast.error(errMsg(e))
//         }
//       } finally {
//         if (id === reqId.current && !silent) setLoading(false)
//       }
//     },
//     [page, tab, type, search]
//   )

//   useEffect(() => {
//     load()
//   }, [load])

//   // new orders and waiting times stay fresh
//   useEffect(() => {
//     const t = setInterval(() => {
//       load(true)
//       setClock(nowText())
//     }, 20000)
//     return () => clearInterval(t)
//   }, [load])

//   // debounce search
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setSearch(searchInput.trim())
//       setPage(1)
//     }, 400)
//     return () => clearTimeout(t)
//   }, [searchInput])

//   // order detail panel
//   useEffect(() => {
//     if (!drawerId) {
//       setDetail(null)
//       return
//     }
//     svc
//       .fetchOrderDetail(drawerId)
//       .then(setDetail)
//       .catch((e) => {
//         toast.error(errMsg(e))
//         setDrawerId(null)
//       })
//   }, [drawerId])

//   const pickTab = (key) => {
//     setTab(key)
//     setPage(1)
//   }
//   const pickType = (key) => {
//     setType(key)
//     setPage(1)
//   }

//   const runAction = async (row) => {
//     const a = row.ui.action
//     if (!a || a.disabled) return
//     setBusyId(row._id)
//     try {
//       await svc.changeOrderStatus(row._id, a.next)
//       toast.success(`#${row.order_number} · ${a.label}`)
//       await load(true)
//       if (drawerId === row._id) setDetail(await svc.fetchOrderDetail(row._id))
//     } catch (e) {
//       toast.error(errMsg(e))
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const cancelFromDrawer = async () => {
//     if (!window.confirm('Cancel this order and start the refund?')) return
//     setBusyId(drawerId)
//     try {
//       await svc.cancelOrderWithRefund(drawerId, 'Cancelled by admin')
//       toast.success('Order cancelled')
//       setDetail(await svc.fetchOrderDetail(drawerId))
//       await load(true)
//     } catch (e) {
//       toast.error(errMsg(e))
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const drawerRow = data.orders.find((o) => o._id === drawerId)

//   return (
//     <div className="od">
//       <header className="od-head">
//         <h1>Orders</h1>
//         <p>{clock}</p>
//       </header>

//       <div className="od-body">
//         {/* Status tabs */}
//         <div className="od-tabs">
//           {TABS.map((t) => (
//             <button
//               key={t.key}
//               className={`od-tab ${tab === t.key ? 'od-tab--active' : ''}`}
//               onClick={() => pickTab(t.key)}
//             >
//               {t.label}
//               <span className="od-tab__count">{data.counts[t.key] ?? 0}</span>
//             </button>
//           ))}
//         </div>

//         {/* Search + pickup / delivery */}
//         <div className="od-tools">
//           <label className="od-search">
//             <Search size={16} />
//             <input
//               placeholder="Search order no., customer, phone or item"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
//           </label>
//           <div className="od-seg">
//             {TYPES.map((t) => (
//               <button
//                 key={t.key || 'all'}
//                 className={`od-seg__btn ${type === t.key ? 'od-seg__btn--active' : ''}`}
//                 onClick={() => pickType(t.key)}
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Orders table */}
//         <div className="od-card">
//           <div className="od-table-wrap">
//             <table className="od-table">
//               <colgroup>
//                 <col style={{ width: 150 }} />
//                 <col />
//                 <col style={{ width: 200 }} />
//                 <col style={{ width: 130 }} />
//                 <col style={{ width: 160 }} />
//                 <col style={{ width: 220 }} />
//               </colgroup>
//               <thead>
//                 <tr>
//                   <th>Order</th>
//                   <th>Customer · Items</th>
//                   <th>Type · When</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th />
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading && (
//                   <tr>
//                     <td colSpan={6} className="od-empty">Loading…</td>
//                   </tr>
//                 )}
//                 {!loading && failed && data.orders.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="od-empty">
//                       Could not load orders.{' '}
//                       <button className="od-btn od-btn--ghost" onClick={() => load()}>Retry</button>
//                     </td>
//                   </tr>
//                 )}
//                 {!loading && !failed && data.orders.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="od-empty">No orders found.</td>
//                   </tr>
//                 )}

//                 {!loading &&
//                   data.orders.map((o) => (
//                     <tr
//                       key={o._id}
//                       className={`od-row ${o.ui.alert ? 'od-row--alert' : ''}`}
//                       onClick={() => setDrawerId(o._id)}
//                     >
//                       <td>
//                         <div className="od-no">#{o.order_number}</div>
//                         {o.ui.alert ? (
//                           <div className="od-wait">Waiting {o.ui.wait_minutes} min</div>
//                         ) : (
//                           <div className="od-sub">{timeText(o.createdAt)}</div>
//                         )}
//                       </td>
//                       <td>
//                         <div className="od-name">{o.customer.name}</div>
//                         <div className="od-sub od-clip" title={o.items_summary}>{o.items_summary}</div>
//                       </td>
//                       <td>
//                         <div className="od-name">{o.when.type}</div>
//                         <div className="od-sub">{o.when.label}</div>
//                       </td>
//                       <td>
//                         <div className="od-name">{money(o.total_amount)}</div>
//                         <span className={`od-pill od-pill--${o.payment.tone}`}>{o.payment.label}</span>
//                       </td>
//                       <td>
//                         <span className={`od-status od-status--${o.ui.tone}`}>{o.ui.label}</span>
//                       </td>
//                       <td className="od-act">
//                         <ActionBtn row={o} busy={busyId === o._id} onRun={runAction} />
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="od-footer">
//             <Pagination page={page} total={data.total} limit={LIMIT} onChange={setPage} />
//           </div>
//         </div>
//       </div>

//       {/* Order detail panel */}
//       {drawerId && (
//         <>
//           <div className="od-overlay" onClick={() => setDrawerId(null)} />
//           <aside className="od-drawer">
//             <div className="od-drawer__head">
//               <div>
//                 <h2>#{detail?.orderNumber || drawerRow?.order_number || '…'}</h2>
//                 {drawerRow && (
//                   <span className={`od-status od-status--${drawerRow.ui.tone}`}>{drawerRow.ui.label}</span>
//                 )}
//               </div>
//               <button className="od-close" onClick={() => setDrawerId(null)} aria-label="Close">
//                 <X size={18} />
//               </button>
//             </div>

//             {!detail ? (
//               <div className="od-drawer__body"><p className="od-sub">Loading…</p></div>
//             ) : (
//               <>
//                 <div className="od-drawer__body">
//                   <div className="od-box">
//                     <Row k="Placed" v={detail.placed} />
//                     <Row k="Type" v={detail.type} />
//                     <Row k="When" v={detail.when === '—' ? 'ASAP' : detail.when} />
//                   </div>

//                   <div className="od-box od-box--customer">
//                     <div>
//                       <strong>{detail.customer.name}</strong>
//                       <div className="od-sub">{detail.customer.phone}</div>
//                     </div>
//                     {detail.customer.phone && (
//                       <a className="od-btn od-btn--ghost" href={`tel:${detail.customer.phone.replace(/\s/g, '')}`}>
//                         Call
//                       </a>
//                     )}
//                   </div>

//                   <div className="od-box">
//                     {detail.items.map((i, idx) => (
//                       <div key={idx} className="od-item">
//                         <div>
//                           <strong>{i.name}</strong>
//                           <div className="od-sub">{i.sizeLabel} × {i.qty}</div>
//                         </div>
//                         <strong>{money(i.lineTotal)}</strong>
//                       </div>
//                     ))}
//                     <hr />
//                     <Row k="Subtotal" v={money(detail.subtotal)} />
//                     <Row k="Packing" v={money(detail.packing)} />
//                     {detail.delivery > 0 && <Row k="Delivery" v={money(detail.delivery)} />}
//                     <div className="od-total">
//                       <span>Total</span>
//                       <span>{money(detail.total)}</span>
//                     </div>
//                     <Row
//                       k={['Payment', detail.payment.method, detail.payment.status].filter(Boolean).join(' · ')}
//                       v={detail.payment.reference}
//                     />
//                   </div>
//                 </div>

//                 <div className="od-drawer__foot">
//                   {drawerRow && <ActionBtn row={drawerRow} busy={busyId === drawerId} onRun={runAction} />}
//                   {drawerRow?.ui.can_cancel && (
//                     <button className="od-btn od-btn--danger" disabled={busyId === drawerId} onClick={cancelFromDrawer}>
//                       Cancel &amp; refund
//                     </button>
//                   )}
//                 </div>
//               </>
//             )}
//           </aside>
//         </>
//       )}
//     </div>
//   )
// }

// function ActionBtn({ row, busy, onRun }) {
//   const a = row.ui.action
//   if (!a) return null
//   return (
//     <button
//       className={`od-btn ${a.disabled ? 'od-btn--off' : 'od-btn--primary'}`}
//       disabled={a.disabled || busy}
//       title={a.hint || ''}
//       onClick={(e) => {
//         e.stopPropagation()
//         onRun(row)
//       }}
//     >
//       {busy ? '…' : a.label}
//     </button>
//   )
// }

// function Row({ k, v }) {
//   return (
//     <div className="od-row2">
//       <span>{k}</span>
//       <strong>{v}</strong>
//     </div>
//   )
// }
// import { useCallback, useEffect, useRef, useState } from 'react'
// import { Search, X } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Pagination from '../../components/ui/Pagination'
// import * as svc from '../../services/ordersService'
// import '../../components/styles/Orders.css'

// const LIMIT = 20
// const IST = 'Asia/Kolkata'

// const TABS = [
//   { key: 'new', label: 'New' },
//   { key: 'kitchen', label: 'In kitchen' },
//   { key: 'ready', label: 'Ready / out' },
//   { key: 'scheduled', label: 'Scheduled' },
//   { key: 'completed', label: 'Completed' },
//   { key: 'cancelled', label: 'Cancelled' },
//   { key: 'all', label: 'All' },
// ]
// const TYPES = [
//   { key: '', label: 'All' },
//   { key: 'PICKUP', label: 'Pickup' },
//   { key: 'DELIVERY', label: 'Delivery' },
// ]

// const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
// const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong'

// const dayKey = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: IST })
// const timeText = (d) => {
//   if (!d) return '—'
//   const t = new Date(d)
//     .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: IST })
//     .toUpperCase()
//   if (dayKey(d) === dayKey(new Date())) return t
//   const day = new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: IST })
//   return `${day}, ${t}`
// }
// const nowText = () => {
//   const d = new Date()
//   const date = d.toLocaleDateString('en-IN', {
//     weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', timeZone: IST,
//   })
//   const time = d
//     .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: IST })
//     .toUpperCase()
//   return `${date} · ${time}`
// }

// export default function Orders() {
//   const [tab, setTab] = useState('all')
//   const [type, setType] = useState('')
//   const [searchInput, setSearchInput] = useState('')
//   const [search, setSearch] = useState('')
//   const [page, setPage] = useState(1)
//   const [data, setData] = useState({ orders: [], total: 0, counts: {} })
//   const [loading, setLoading] = useState(true)
//   const [errorText, setErrorText] = useState('')
//   const [busyId, setBusyId] = useState(null)
//   const [drawerId, setDrawerId] = useState(null)
//   const [detail, setDetail] = useState(null)
//   const [clock, setClock] = useState(nowText())
//   const reqId = useRef(0)

//   const load = useCallback(
//     async (silent = false) => {
//       const id = ++reqId.current
//       if (!silent) setLoading(true)
//       try {
//         const params = { page, limit: LIMIT }
//         if (tab !== 'all') params.group = tab
//         if (type) params.fulfillment_type = type
//         if (search) params.search = search
//         const d = await svc.fetchOrders(params)
//         if (id !== reqId.current) return
//         const orders = Array.isArray(d?.orders) ? d.orders : []
//         setData({ orders, total: d?.total || 0, counts: d?.counts || {} })
//         setErrorText('')
//       } catch (e) {
//         console.error('Orders load failed:', e?.response?.status, e?.response?.data || e)
//         if (id === reqId.current && !silent) {
//           const status = e?.response?.status
//           setErrorText(`${status ? `(${status}) ` : ''}${errMsg(e)}`)
//           toast.error(errMsg(e))
//         }
//       } finally {
//         if (id === reqId.current && !silent) setLoading(false)
//       }
//     },
//     [page, tab, type, search]
//   )

//   useEffect(() => {
//     load()
//   }, [load])

//   // new orders and waiting times stay fresh
//   useEffect(() => {
//     const t = setInterval(() => {
//       load(true)
//       setClock(nowText())
//     }, 20000)
//     return () => clearInterval(t)
//   }, [load])

//   // debounce search
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setSearch(searchInput.trim())
//       setPage(1)
//     }, 400)
//     return () => clearTimeout(t)
//   }, [searchInput])

//   // order detail panel
//   useEffect(() => {
//     if (!drawerId) {
//       setDetail(null)
//       return
//     }
//     svc
//       .fetchOrderDetail(drawerId)
//       .then(setDetail)
//       .catch((e) => {
//         toast.error(errMsg(e))
//         setDrawerId(null)
//       })
//   }, [drawerId])

//   const pickTab = (key) => {
//     setTab(key)
//     setPage(1)
//   }
//   const pickType = (key) => {
//     setType(key)
//     setPage(1)
//   }

//   const runAction = async (row) => {
//     const a = row.ui?.action
//     if (!a || a.disabled) return
//     setBusyId(row._id)
//     try {
//       await svc.changeOrderStatus(row._id, a.next)
//       toast.success(`#${row.order_number} · ${a.label}`)
//       await load(true)
//       if (drawerId === row._id) setDetail(await svc.fetchOrderDetail(row._id))
//     } catch (e) {
//       toast.error(errMsg(e))
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const cancelFromDrawer = async () => {
//     if (!window.confirm('Cancel this order and start the refund?')) return
//     setBusyId(drawerId)
//     try {
//       await svc.cancelOrderWithRefund(drawerId, 'Cancelled by admin')
//       toast.success('Order cancelled')
//       setDetail(await svc.fetchOrderDetail(drawerId))
//       await load(true)
//     } catch (e) {
//       toast.error(errMsg(e))
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const drawerRow = data.orders.find((o) => o._id === drawerId)

//   return (
//     <div className="od">
//       <header className="od-head">
//         <h1>Orders</h1>
//         <p>{clock}</p>
//       </header>

//       <div className="od-body">
//         {/* Status tabs */}
//         <div className="od-tabs">
//           {TABS.map((t) => (
//             <button
//               key={t.key}
//               className={`od-tab ${tab === t.key ? 'od-tab--active' : ''}`}
//               onClick={() => pickTab(t.key)}
//             >
//               {t.label}
//               <span className="od-tab__count">{data.counts[t.key] ?? 0}</span>
//             </button>
//           ))}
//         </div>

//         {/* Search + pickup / delivery */}
//         <div className="od-tools">
//           <label className="od-search">
//             <Search size={16} />
//             <input
//               placeholder="Search order no., customer, phone or item"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
//           </label>
//           <div className="od-seg">
//             {TYPES.map((t) => (
//               <button
//                 key={t.key || 'all'}
//                 className={`od-seg__btn ${type === t.key ? 'od-seg__btn--active' : ''}`}
//                 onClick={() => pickType(t.key)}
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Orders table */}
//         <div className="od-card">
//           <div className="od-table-wrap">
//             <table className="od-table">
//               <colgroup>
//                 <col style={{ width: 150 }} />
//                 <col />
//                 <col style={{ width: 200 }} />
//                 <col style={{ width: 130 }} />
//                 <col style={{ width: 160 }} />
//                 <col style={{ width: 220 }} />
//               </colgroup>
//               <thead>
//                 <tr>
//                   <th>Order</th>
//                   <th>Customer · Items</th>
//                   <th>Type · When</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th />
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading && (
//                   <tr>
//                     <td colSpan={6} className="od-empty">Loading…</td>
//                   </tr>
//                 )}
//                 {!loading && errorText && data.orders.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="od-empty">
//                       <div className="od-error">Could not load orders: {errorText}</div>
//                       <button className="od-btn od-btn--ghost" onClick={() => load()}>Retry</button>
//                     </td>
//                   </tr>
//                 )}
//                 {!loading && !errorText && data.orders.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="od-empty">No orders found.</td>
//                   </tr>
//                 )}

//                 {!loading &&
//                   data.orders.map((o) => (
//                     <tr
//                       key={o._id}
//                       className={`od-row ${o.ui?.alert ? 'od-row--alert' : ''}`}
//                       onClick={() => setDrawerId(o._id)}
//                     >
//                       <td>
//                         <div className="od-no">#{o.order_number}</div>
//                         {o.ui?.alert ? (
//                           <div className="od-wait">Waiting {o.ui.wait_minutes} min</div>
//                         ) : (
//                           <div className="od-sub">{timeText(o.createdAt)}</div>
//                         )}
//                       </td>
//                       <td>
//                         <div className="od-name">{o.customer?.name || 'Guest'}</div>
//                         <div className="od-sub od-clip" title={o.items_summary}>{o.items_summary}</div>
//                       </td>
//                       <td>
//                         <div className="od-name">{o.when?.type}</div>
//                         <div className="od-sub">{o.when?.label}</div>
//                       </td>
//                       <td>
//                         <div className="od-name">{money(o.total_amount)}</div>
//                         {o.payment && (
//                           <span className={`od-pill od-pill--${o.payment.tone}`}>{o.payment.label}</span>
//                         )}
//                       </td>
//                       <td>
//                         {o.ui && <span className={`od-status od-status--${o.ui.tone}`}>{o.ui.label}</span>}
//                       </td>
//                       <td className="od-act">
//                         <ActionBtn row={o} busy={busyId === o._id} onRun={runAction} />
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="od-footer">
//             <Pagination page={page} total={data.total} limit={LIMIT} onChange={setPage} />
//           </div>
//         </div>
//       </div>

//       {/* Order detail panel */}
//       {drawerId && (
//         <>
//           <div className="od-overlay" onClick={() => setDrawerId(null)} />
//           <aside className="od-drawer">
//             <div className="od-drawer__head">
//               <div>
//                 <h2>#{detail?.orderNumber || drawerRow?.order_number || '…'}</h2>
//                 {drawerRow?.ui && (
//                   <span className={`od-status od-status--${drawerRow.ui.tone}`}>{drawerRow.ui.label}</span>
//                 )}
//               </div>
//               <button className="od-close" onClick={() => setDrawerId(null)} aria-label="Close">
//                 <X size={18} />
//               </button>
//             </div>

//             {!detail ? (
//               <div className="od-drawer__body"><p className="od-sub">Loading…</p></div>
//             ) : (
//               <>
//                 <div className="od-drawer__body">
//                   <div className="od-box">
//                     <Row k="Placed" v={detail.placed} />
//                     <Row k="Type" v={detail.type} />
//                     <Row k="When" v={detail.when === '—' ? 'ASAP' : detail.when} />
//                   </div>

//                   <div className="od-box od-box--customer">
//                     <div>
//                       <strong>{detail.customer.name}</strong>
//                       <div className="od-sub">{detail.customer.phone}</div>
//                     </div>
//                     {detail.customer.phone && (
//                       <a className="od-btn od-btn--ghost" href={`tel:${detail.customer.phone.replace(/\s/g, '')}`}>
//                         Call
//                       </a>
//                     )}
//                   </div>

//                   <div className="od-box">
//                     {detail.items.map((i, idx) => (
//                       <div key={idx} className="od-item">
//                         <div>
//                           <strong>{i.name}</strong>
//                           <div className="od-sub">{i.sizeLabel} × {i.qty}</div>
//                         </div>
//                         <strong>{money(i.lineTotal)}</strong>
//                       </div>
//                     ))}
//                     <hr />
//                     <Row k="Subtotal" v={money(detail.subtotal)} />
//                     <Row k="Packing" v={money(detail.packing)} />
//                     {detail.delivery > 0 && <Row k="Delivery" v={money(detail.delivery)} />}
//                     <div className="od-total">
//                       <span>Total</span>
//                       <span>{money(detail.total)}</span>
//                     </div>
//                     <Row
//                       k={['Payment', detail.payment.method, detail.payment.status].filter(Boolean).join(' · ')}
//                       v={detail.payment.reference}
//                     />
//                   </div>
//                 </div>

//                 <div className="od-drawer__foot">
//                   {drawerRow && <ActionBtn row={drawerRow} busy={busyId === drawerId} onRun={runAction} />}
//                   {drawerRow?.ui?.can_cancel && (
//                     <button className="od-btn od-btn--danger" disabled={busyId === drawerId} onClick={cancelFromDrawer}>
//                       Cancel &amp; refund
//                     </button>
//                   )}
//                 </div>
//               </>
//             )}
//           </aside>
//         </>
//       )}
//     </div>
//   )
// }

// function ActionBtn({ row, busy, onRun }) {
//   const a = row.ui?.action
//   if (!a) return null
//   return (
//     <button
//       className={`od-btn ${a.disabled ? 'od-btn--off' : 'od-btn--primary'}`}
//       disabled={a.disabled || busy}
//       title={a.hint || ''}
//       onClick={(e) => {
//         e.stopPropagation()
//         onRun(row)
//       }}
//     >
//       {busy ? '…' : a.label}
//     </button>
//   )
// }


// function Row({ k, v }) {
//   return (
//     <div className="od-row2">
//       <span>{k}</span>
//       <strong>{v}</strong>
//     </div>
//   )
// }

import { useCallback, useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Pagination from '../../components/ui/Pagination'
import * as svc from '../../services/ordersService'
import '../../components/styles/Orders.css'
const LIMIT = 20
const IST = 'Asia/Kolkata'
const TABS = [
  { key: 'new', label: 'New' },
  { key: 'kitchen', label: 'In kitchen' },
  { key: 'ready', label: 'Ready / out' },
  { key: 'scheduled', label: 'Scheduled'},
  { key: 'completed', label: 'Completed'},
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'all', label: 'All' },
]

const TYPES = [
  { key: '', label: 'All' },
  { key: 'PICKUP', label: 'Pickup' },
  { key: 'DELIVERY', label: 'Delivery' },
]

const money = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN')}`

const errMsg = (e) =>
  e?.response?.data?.message ||
  e?.message ||
  'Something went wrong'

const dayKey = (d) =>
  new Date(d).toLocaleDateString('en-CA', { timeZone: IST })

const timeText = (d) => {
  if (!d) return '—'

  const t = new Date(d)
    .toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: IST,
    })
    .toUpperCase()

  if (dayKey(d) === dayKey(new Date())) return t

  const day = new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    timeZone: IST,
  })

  return `${day}, ${t}`
}

const nowText = () => {
  const d = new Date()

  const date = d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: IST,
  })

  const time = d
    .toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: IST,
    })
    .toUpperCase()

  return `${date} · ${time}`
}

// Use backend action first.
// Fallback is only for regular orders.
// Scheduled preorder timing must be controlled by backend.
function getDashboardAction(row) {
  if (row.ui?.action) return row.ui.action

  const status = String(row.status || '').toUpperCase()
  const fulfillment = String(
    row.fulfillment_type || row.fulfillmentType || ''
  ).toUpperCase()

  const isScheduled =
    row.ui?.group === 'scheduled' ||
    String(row.order_type || '').toUpperCase() === 'PRE_ORDER'

  if (status === 'NEW') {
    return {
      label: 'Accept',
      next: 'CONFIRMED',
      disabled: false,
    }
  }

  if (status === 'PAYMENT_PENDING') {
    return null
  }

  // Do not bypass preorder slot validation on the frontend.
  if (isScheduled && status === 'CONFIRMED') {
    return null
  }

  if (status === 'CONFIRMED') {
    return {
      label: 'Start Preparing',
      next: 'PROCESSING',
      disabled: false,
    }
  }

  if (status === 'PROCESSING') {
    if (fulfillment === 'DELIVERY') {
      return {
        label: 'Out for Delivery',
        next: 'OUT_FOR_DELIVERY',
        disabled: false,
      }
    }

    return {
      label: 'Ready for Pickup',
      next: 'READY_FOR_PICKUP',
      disabled: false,
    }
  }

  if (
    status === 'READY_FOR_PICKUP' ||
    status === 'OUT_FOR_DELIVERY'
  ) {
    return {
      label: 'Complete',
      next: 'COMPLETED',
      disabled: false,
    }
  }

  return null
}

export default function Orders() {
  const [tab, setTab] = useState('all')
  const [type, setType] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [data, setData] = useState({
    orders: [],
    total: 0,
    counts: {},
  })

  const [loading, setLoading] = useState(true)
  const [errorText, setErrorText] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [drawerId, setDrawerId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [clock, setClock] = useState(nowText())

  const reqId = useRef(0)

  const load = useCallback(
    async (silent = false) => {
      const id = ++reqId.current

      if (!silent) setLoading(true)

      try {
        const params = { page, limit: LIMIT }

        if (tab !== 'all') params.group = tab
        if (type) params.fulfillment_type = type
        if (search) params.search = search

        const d = await svc.fetchOrders(params)

        if (id !== reqId.current) return

        const orders = Array.isArray(d?.orders)
          ? d.orders
          : []

        setData({
          orders,
          total: d?.total || 0,
          counts: d?.counts || {},
        })

        setErrorText('')
      } catch (e) {
        console.error(
          'Orders load failed:',
          e?.response?.status,
          e?.response?.data || e
        )

        if (id === reqId.current && !silent) {
          const status = e?.response?.status

          setErrorText(
            `${status ? `(${status}) ` : ''}${errMsg(e)}`
          )

          toast.error(errMsg(e))
        }
      } finally {
        if (id === reqId.current && !silent) {
          setLoading(false)
        }
      }
    },
    [page, tab, type, search]
  )

  useEffect(() => {
    load()
  }, [load])

  // Refresh orders and current time every 20 seconds.
  useEffect(() => {
    const t = setInterval(() => {
      load(true)
      setClock(nowText())
    }, 20000)

    return () => clearInterval(t)
  }, [load])

  // Debounced search.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 400)

    return () => clearTimeout(t)
  }, [searchInput])

  // Load order detail drawer.
  useEffect(() => {
    if (!drawerId) {
      setDetail(null)
      return
    }

    let active = true

    svc
      .fetchOrderDetail(drawerId)
      .then((result) => {
        if (active) setDetail(result)
      })
      .catch((e) => {
        if (!active) return

        toast.error(errMsg(e))
        setDrawerId(null)
      })

    return () => {
      active = false
    }
  }, [drawerId])

  const pickTab = (key) => {
    setTab(key)
    setPage(1)
  }

  const pickType = (key) => {
    setType(key)
    setPage(1)
  }

  const runAction = async (row, action) => {
    if (!action || action.disabled || busyId) return

    setBusyId(row._id)

    try {
      await svc.changeOrderStatus(row._id, action.next)

      toast.success(
        `#${row.order_number} · ${action.label}`
      )

      await load(true)

      if (drawerId === row._id) {
        const updatedDetail = await svc.fetchOrderDetail(row._id)
        setDetail(updatedDetail)
      }
    } catch (e) {
      toast.error(errMsg(e))
    } finally {
      setBusyId(null)
    }
  }

  const cancelFromDrawer = async () => {
    if (!drawerId || busyId) return

    if (
      !window.confirm(
        'Cancel this order and start the refund?'
      )
    ) {
      return
    }

    setBusyId(drawerId)

    try {
      await svc.cancelOrderWithRefund(
        drawerId,
        'Cancelled by admin'
      )

      toast.success('Order cancelled')

      const updatedDetail = await svc.fetchOrderDetail(drawerId)
      setDetail(updatedDetail)

      await load(true)
    } catch (e) {
      toast.error(errMsg(e))
    } finally {
      setBusyId(null)
    }
  }

  const drawerRow = data.orders.find(
    (o) => o._id === drawerId
  )

  return (
    <div className="od">
      <header className="od-head">
        <h1>Orders</h1>
        <p>{clock}</p>
      </header>

      <div className="od-body">
        {/* Status tabs */}
        <div className="od-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`od-tab ${
                tab === t.key ? 'od-tab--active' : ''
              }`}
              onClick={() => pickTab(t.key)}
            >
              {t.label}

              <span className="od-tab__count">
                {data.counts[t.key] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search and fulfillment filters */}
        <div className="od-tools">
          <label className="od-search">
            <Search size={16} />

            <input
              placeholder="Search order no., customer, phone or item"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </label>

          <div className="od-seg">
            {TYPES.map((t) => (
              <button
                key={t.key || 'all'}
                type="button"
                className={`od-seg__btn ${
                  type === t.key ? 'od-seg__btn--active' : ''
                }`}
                onClick={() => pickType(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders table */}
        <div className="od-card">
          <div className="od-table-wrap">
            <table className="od-table">
              <colgroup>
                <col style={{ width: 150 }} />
                <col />
                <col style={{ width: 200 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 220 }} />
              </colgroup>

              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer · Items</th>
                  <th>Type · When</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="od-empty">
                      Loading…
                    </td>
                  </tr>
                )}

                {!loading &&
                  errorText &&
                  data.orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="od-empty">
                        <div className="od-error">
                          Could not load orders: {errorText}
                        </div>

                        <button
                          type="button"
                          className="od-btn od-btn--ghost"
                          onClick={() => load()}
                        >
                          Retry
                        </button>
                      </td>
                    </tr>
                  )}

                {!loading &&
                  !errorText &&
                  data.orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="od-empty">
                        No orders found.
                      </td>
                    </tr>
                  )}

                {!loading &&
                  data.orders.map((o) => (
                    <tr
                      key={o._id}
                      className={`od-row ${
                        o.ui?.alert ? 'od-row--alert' : ''
                      }`}
                      onClick={() => setDrawerId(o._id)}
                    >
                      <td>
                        <div className="od-no">
                          #{o.order_number}
                        </div>

                        {o.ui?.alert ? (
                          <div className="od-wait">
                            Waiting {o.ui.wait_minutes} min
                          </div>
                        ) : (
                          <div className="od-sub">
                            {timeText(o.createdAt)}
                          </div>
                        )}
                      </td>

                      <td>
                        <div className="od-name">
                          {o.customer?.name || 'Guest'}
                        </div>

                        <div
                          className="od-sub od-clip"
                          title={o.items_summary}
                        >
                          {o.items_summary}
                        </div>
                      </td>

                      <td>
                        <div className="od-name">
                          {o.when?.type}
                        </div>

                        <div className="od-sub">
                          {o.when?.label}
                        </div>
                      </td>

                      <td>
                        <div className="od-name">
                          {money(o.total_amount)}
                        </div>

                        {o.payment && (
                          <span
                            className={`od-pill od-pill--${o.payment.tone}`}
                          >
                            {o.payment.label}
                          </span>
                        )}
                      </td>

                      <td>
                        {o.ui && (
                          <span
                            className={`od-status od-status--${o.ui.tone}`}
                          >
                            {o.ui.label}
                          </span>
                        )}
                      </td>

                      <td
                        className="od-act"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionBtn
                          row={o}
                          busy={busyId === o._id}
                          onRun={runAction}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="od-footer">
            <Pagination
              page={page}
              total={data.total}
              limit={LIMIT}
              onChange={setPage}
            />
          </div>
        </div>
      </div>

      {/* Order detail panel */}
      {drawerId && (
        <>
          <div
            className="od-overlay"
            onClick={() => setDrawerId(null)}
          />

          <aside className="od-drawer">
            <div className="od-drawer__head">
              <div>
                <h2>
                  #{detail?.orderNumber ||
                    drawerRow?.order_number ||
                    '…'}
                </h2>

                {drawerRow?.ui && (
                  <span
                    className={`od-status od-status--${drawerRow.ui.tone}`}
                  >
                    {drawerRow.ui.label}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="od-close"
                onClick={() => setDrawerId(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {!detail ? (
              <div className="od-drawer__body">
                <p className="od-sub">Loading…</p>
              </div>
            ) : (
              <>
                <div className="od-drawer__body">
                  <div className="od-box">
                    <Row k="Placed" v={detail.placed} />
                    <Row k="Type" v={detail.type} />
                    <Row
                      k="When"
                      v={detail.when === '—' ? 'ASAP' : detail.when}
                    />
                  </div>

                  <div className="od-box od-box--customer">
                    <div>
                      <strong>{detail.customer?.name}</strong>

                      <div className="od-sub">
                        {detail.customer?.phone}
                      </div>
                    </div>

                    {detail.customer?.phone && (
                      <a
                        className="od-btn od-btn--ghost"
                        href={`tel:${detail.customer.phone.replace(/\s/g, '')}`}
                      >
                        Call
                      </a>
                    )}
                  </div>

                  <div className="od-box">
                    {(detail.items || []).map((i, idx) => (
                      <div key={idx} className="od-item">
                        <div>
                          <strong>{i.name}</strong>

                          <div className="od-sub">
                            {i.sizeLabel} × {i.qty}
                          </div>
                        </div>

                        <strong>{money(i.lineTotal)}</strong>
                      </div>
                    ))}

                    <hr />

                    <Row
                      k="Subtotal"
                      v={money(detail.subtotal)}
                    />

                    <Row
                      k="Packing"
                      v={money(detail.packing)}
                    />

                    {detail.delivery > 0 && (
                      <Row
                        k="Delivery"
                        v={money(detail.delivery)}
                      />
                    )}

                    <div className="od-total">
                      <span>Total</span>
                      <span>{money(detail.total)}</span>
                    </div>

                    <Row
                      k={[
                        'Payment',
                        detail.payment?.method,
                        detail.payment?.status,
                      ].filter(Boolean).join(' · ')}
                      v={detail.payment?.reference}
                    />
                  </div>
                </div>
                <div className="od-drawer__foot">
                  {drawerRow && (
                    <ActionBtn
                      row={drawerRow}
                      busy={busyId === drawerId}
                      onRun={runAction}
                    />
                  )}

                  {drawerRow?.ui?.can_cancel && (
                    <button
                      type="button"
                      className="od-btn od-btn--danger"
                      disabled={busyId === drawerId}
                      onClick={cancelFromDrawer}
                    >
                      Cancel &amp; refund
                    </button>
                  )}
                </div>
              </>
            )}
          </aside>
        </>
      )}
    </div>
  )
}
function ActionBtn({ row, busy, onRun }) {
  const action = getDashboardAction(row)
  if (!action) return null

  return (
    <button
      type="button"
      className={`od-btn ${
        action.disabled ? 'od-btn--off' : 'od-btn--primary'
      }`}
      disabled={action.disabled || busy}
      title={action.hint || ''}
      onClick={(e) => {
        e.stopPropagation()
        onRun(row, action)
      }}
    >
      {busy ? 'Updating…' : action.label}
    </button>
  )
}
function Row({ k, v }) {
  return (
    <div className="od-row2">
      <span>{k}</span>
      <strong>{v ?? '—'}</strong>
    </div>
  )
}
