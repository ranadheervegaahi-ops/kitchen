import { useEffect, useState } from 'react'
import { Search, Eye } from 'lucide-react'
import { getCustomers, getCustomer, getCustomerOrders } from '../../services/adminService'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Pagination from '../../components/ui/Pagination'
import toast from 'react-hot-toast'

export default function Customers() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState(null)
  const [orders, setOrders] = useState([])

  const fetch = async () => {
    setLoading(true)
    try {
      const { data } = await getCustomers({ search, page, limit: 20 })
      setList(data.data.customers); setTotal(data.data.total)
    } catch { toast.error('Failed to load customers.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [search, page])

  const openDetail = async (id) => {
    try {
      const [custRes, ordersRes] = await Promise.all([getCustomer(id), getCustomerOrders(id, { limit: 10 })])
      setDetail(custRes.data.data)
      setOrders(ordersRes.data.data.orders)
    } catch { toast.error('Failed to load customer.') }
  }

  return (
    <div className="page">
      <div className="page__header">
        <div><h2 className="page__title">Customers</h2><p className="page__subtitle">View customer information and order history</p></div>
      </div>

      <div className="section-card">
        <div className="section-card__header">
          <div className="filters">
            <div className="search-box"><Search size={15} /><input placeholder="Search name or mobile..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} /></div>
          </div>
        </div>

        {loading ? <div className="page-loader"><span className="spinner" /></div> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Name</th><th>Mobile</th><th>Email</th><th>Orders</th><th>Last Order</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={7}><div className="empty-state">No customers found.</div></td></tr>}
                {list.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.mobile}</td>
                    <td>{c.email || '—'}</td>
                    <td>{c.order_count}</td>
                    <td>{c.last_order_at ? new Date(c.last_order_at).toLocaleDateString('en-IN') : '—'}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><button className="icon-btn icon-btn--view" onClick={() => openDetail(c._id)}><Eye size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="table-footer"><Pagination page={page} total={total} limit={20} onChange={setPage} /></div>
      </div>

      {detail && (
        <Modal title={`Customer — ${detail.name}`} onClose={() => setDetail(null)} width="600px">
          <div className="order-detail">
            <div className="order-detail__section">
              <h4>Details</h4>
              <p>Mobile: {detail.mobile}</p>
              <p>Email: {detail.email || '—'}</p>
              <p>Joined: {new Date(detail.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
            <div className="order-detail__section">
              <h4>Recent Orders</h4>
              {orders.length === 0 ? <p>No orders yet.</p> : (
                <table className="table">
                  <thead><tr><th>Order No</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id}>
                        <td><span className="order-num">{o.order_number}</span></td>
                        <td>₹{o.total_amount?.toLocaleString('en-IN')}</td>
                        <td><Badge value={o.payment_status} /></td>
                        <td><Badge value={o.status} /></td>
                        <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
