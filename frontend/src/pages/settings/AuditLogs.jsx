import { useEffect, useState } from 'react'
import { getAuditLogs } from '../../services/adminService'
import Pagination from '../../components/ui/Pagination'
import toast from 'react-hot-toast'

export default function AuditLogs() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState('')
  const [entityFilter, setEntityFilter] = useState('')

  const fetch = async () => {
    setLoading(true)
    try {
      const { data } = await getAuditLogs({ action: actionFilter, entity_type: entityFilter, page, limit: 20 })
      setList(data.data.logs); setTotal(data.data.total)
    } catch { toast.error('Failed to load audit logs.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [actionFilter, entityFilter, page])

  return (
    <div className="page">
      <div className="page__header">
        <div><h2 className="page__title">Audit Logs</h2><p className="page__subtitle">Track all admin activity</p></div>
      </div>

      <div className="section-card">
        <div className="section-card__header">
          <div className="filters">
            <select className="filter-select" value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}>
              <option value="">All Actions</option>
              {['LOGIN','LOGOUT','PRODUCT_CREATED','PRODUCT_UPDATED','PRODUCT_DISABLED','PRICE_CHANGED','VARIANT_CHANGED','CATEGORY_CHANGED','ORDER_STATUS_CHANGED','PAYMENT_ACTION','SETTINGS_CHANGED'].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select className="filter-select" value={entityFilter} onChange={(e) => { setEntityFilter(e.target.value); setPage(1) }}>
              <option value="">All Entities</option>
              {['Admin','Category','Product','ProductVariant','Order','Payment','BusinessSettings','OrderSettings','BusinessHours'].map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? <div className="page-loader"><span className="spinner" /></div> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Admin</th><th>Action</th><th>Entity</th><th>Entity ID</th><th>IP</th><th>Time</th></tr></thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={6}><div className="empty-state">No audit logs found.</div></td></tr>}
                {list.map((log) => (
                  <tr key={log._id}>
                    <td>{log.admin_id?.name || '—'}<br /><small>{log.admin_id?.email}</small></td>
                    <td><span className="badge badge--blue">{log.action}</span></td>
                    <td>{log.entity_type || '—'}</td>
                    <td><small>{log.entity_id || '—'}</small></td>
                    <td><small>{log.ip_address || '—'}</small></td>
                    <td>{new Date(log.createdAt).toLocaleString('en-IN')}</td>
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
