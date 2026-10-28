import { useEffect, useState } from 'react'
import {
  ShoppingBag, CheckCircle, Clock, Loader, XCircle,
  TrendingUp, Calendar, IndianRupee, RefreshCw
} from 'lucide-react'
import { getDashboard, getRecentOrders } from '../../services/authService'
import toast from 'react-hot-toast'

const statusBadge = {
  NEW: 'badge--blue',
  PAYMENT_PENDING: 'badge--yellow',
  CONFIRMED: 'badge--green',
  PROCESSING: 'badge--purple',
  COMPLETED: 'badge--teal',
  CANCELLED: 'badge--red',
  PAYMENT_FAILED: 'badge--red',
  PAYMENT_EXPIRED: 'badge--gray',
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const [statsRes, ordersRes] = await Promise.all([getDashboard(), getRecentOrders()])
      setStats(statsRes.data.data)
      setOrders(ordersRes.data.data)
    } catch {
      toast.error('Failed to load dashboard data.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const cards = stats ? [
    { icon: ShoppingBag, value: stats.today_orders, color: 'card--blue', label: "Today's Orders" },
    { icon: CheckCircle, value: stats.confirmed, color: 'card--green', label: 'Confirmed' },
    { icon: Clock, value: stats.pending_payment, color: 'card--yellow', label: 'Pending Payment' },
    { icon: Loader, value: stats.processing, color: 'card--purple', label: 'Processing' },
    { icon: TrendingUp, value: stats.completed, color: 'card--teal', label: 'Completed' },
    { icon: XCircle, value: stats.cancelled, color: 'card--red', label: 'Cancelled' },
    { icon: Calendar, value: stats.pre_orders, color: 'card--indigo', label: 'Pre-Orders' },
    { icon: IndianRupee, value: `₹${stats.today_sales?.toLocaleString('en-IN') || 0}`, color: 'card--orange', label: "Today's Sales" },
  ] : []

  if (loading) return <div className="page-loader"><span className="spinner" /></div>

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">Good {getGreeting()}, Admin 👋</h2>
          <p className="page__subtitle">Here's what's happening today.</p>
        </div>
        <button className="btn btn--outline" onClick={() => fetchData(true)} disabled={refreshing}>
          <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {cards.map(({ icon: Icon, value, color, label }) => (
          <div key={label} className={`stat-card ${color}`}>
            <div className="stat-card__icon"><Icon size={24} /></div>
            <div className="stat-card__body">
              <p className="stat-card__value">{value}</p>
              <p className="stat-card__label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="section-card">
        <div className="section-card__header">
          <h3 className="section-card__title">Recent Orders</h3>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={40} />
            <p>No orders yet today.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td><span className="order-num">{o.order_number}</span></td>
                    <td>{o.customer_id?.name || '—'}</td>
                    <td><span className="badge badge--gray">{o.order_type}</span></td>
                    <td>₹{o.total_amount?.toLocaleString('en-IN')}</td>
                    <td><span className={`badge ${statusBadge[o.status] || 'badge--gray'}`}>{o.status}</span></td>
                    <td>{new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Morning'
  if (h < 17) return 'Afternoon'
  return 'Evening'
}
