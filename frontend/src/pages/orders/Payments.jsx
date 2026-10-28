import { useEffect, useState } from 'react'
import { getPayments } from '../../services/adminService'
import Badge from '../../components/ui/Badge'
import Pagination from '../../components/ui/Pagination'
import toast from 'react-hot-toast'

export default function Payments() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const fetch = async () => {
    setLoading(true)
    try {
      const { data } = await getPayments({ status: statusFilter, page, limit: 20 })
      setList(data.data.payments); setTotal(data.data.total)
    } catch { toast.error('Failed to load payments.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [statusFilter, page])

  return (
    <div className="page">
      <div className="page__header">
        <div><h2 className="page__title">Payments</h2><p className="page__subtitle">View all payment records</p></div>
      </div>

      <div className="section-card">
        <div className="section-card__header">
          <div className="filters">
            <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        {loading ? <div className="page-loader"><span className="spinner" /></div> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Order</th><th>Gateway</th><th>Amount</th><th>Status</th><th>Transaction ID</th><th>Paid At</th></tr></thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={6}><div className="empty-state">No payments found.</div></td></tr>}
                {list.map((p) => (
                  <tr key={p._id}>
                    <td><span className="order-num">{p.order_id?.order_number || '—'}</span></td>
                    <td>{p.gateway}</td>
                    <td>₹{p.amount?.toLocaleString('en-IN')} <small>{p.currency}</small></td>
                    <td><Badge value={p.status} /></td>
                    <td><small>{p.gateway_payment_id || '—'}</small></td>
                    <td>{p.paid_at ? new Date(p.paid_at).toLocaleString('en-IN') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="table-footer"><Pagination page={page} total={total} limit={20} onChange={setPage} /></div>
      </div>
    </div>
  )
}
