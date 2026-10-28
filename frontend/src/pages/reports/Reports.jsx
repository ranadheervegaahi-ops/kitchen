import { useEffect, useState } from 'react'
import { getSalesReport, getProductSalesReport } from '../../services/adminService'
import { IndianRupee, ShoppingBag, CheckCircle, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const today = () => new Date().toISOString().split('T')[0]
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0] }

export default function Reports() {
  const [tab, setTab] = useState('sales')
  const [preset, setPreset] = useState('today')
  const [dateFrom, setDateFrom] = useState(today())
  const [dateTo, setDateTo] = useState(today())
  const [sales, setSales] = useState(null)
  const [productSales, setProductSales] = useState([])
  const [loading, setLoading] = useState(false)

  const applyPreset = (p) => {
    setPreset(p)
    if (p === 'today') { setDateFrom(today()); setDateTo(today()) }
    else if (p === 'yesterday') { setDateFrom(yesterday()); setDateTo(yesterday()) }
  }

  const fetch = async () => {
    setLoading(true)
    try {
      const params = { date_from: dateFrom, date_to: dateTo }
      const [sRes, pRes] = await Promise.all([getSalesReport(params), getProductSalesReport(params)])
      setSales(sRes.data.data)
      setProductSales(pRes.data.data)
    } catch { toast.error('Failed to load reports.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [dateFrom, dateTo])

  return (
    <div className="page">
      <div className="page__header">
        <div><h2 className="page__title">Reports</h2><p className="page__subtitle">Sales and product performance</p></div>
        <div className="filters">
          <button className={`btn ${preset === 'today' ? 'btn--primary' : 'btn--outline'}`} onClick={() => applyPreset('today')}>Today</button>
          <button className={`btn ${preset === 'yesterday' ? 'btn--primary' : 'btn--outline'}`} onClick={() => applyPreset('yesterday')}>Yesterday</button>
          <input type="date" className="filter-select" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPreset('custom') }} />
          <input type="date" className="filter-select" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPreset('custom') }} />
        </div>
      </div>

      {loading ? <div className="page-loader"><span className="spinner" /></div> : (
        <>
          {sales && (
            <div className="stats-grid">
              <div className="stat-card card--blue"><div className="stat-card__icon"><ShoppingBag size={24} /></div><div className="stat-card__body"><p className="stat-card__value">{sales.total_orders}</p><p className="stat-card__label">Total Orders</p></div></div>
              <div className="stat-card card--green"><div className="stat-card__icon"><CheckCircle size={24} /></div><div className="stat-card__body"><p className="stat-card__value">{sales.completed_orders}</p><p className="stat-card__label">Completed</p></div></div>
              <div className="stat-card card--teal"><div className="stat-card__icon"><TrendingUp size={24} /></div><div className="stat-card__body"><p className="stat-card__value">{sales.confirmed_orders}</p><p className="stat-card__label">Confirmed</p></div></div>
              <div className="stat-card card--orange"><div className="stat-card__icon"><IndianRupee size={24} /></div><div className="stat-card__body"><p className="stat-card__value">₹{sales.sales?.toLocaleString('en-IN')}</p><p className="stat-card__label">Total Sales</p></div></div>
            </div>
          )}

          <div className="section-card">
            <div className="section-card__header"><h3 className="section-card__title">Product Sales</h3></div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Product</th><th>Variant</th><th>Qty Sold</th><th>Revenue</th></tr></thead>
                <tbody>
                  {productSales.length === 0 && <tr><td colSpan={4}><div className="empty-state">No sales data for this period.</div></td></tr>}
                  {productSales.map((r, i) => (
                    <tr key={i}>
                      <td><strong>{r.product}</strong></td>
                      <td>{r.variant}</td>
                      <td>{r.quantity_sold}</td>
                      <td>₹{r.revenue?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
