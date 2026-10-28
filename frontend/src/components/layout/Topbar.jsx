import { Bell, Menu } from 'lucide-react'
import { getAdmin } from '../../utils/auth'

export default function Topbar({ title }) {
  const admin = getAdmin()

  return (
    <header className="topbar">
      <div className="topbar__left">
        <h1 className="topbar__title">{title}</h1>
      </div>
      <div className="topbar__right">
        <button className="topbar__icon-btn" title="Notifications">
          <Bell size={20} />
        </button>
        <div className="topbar__user">
          <div className="topbar__avatar">
            {admin?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="topbar__username">{admin?.name || 'Admin'}</span>
        </div>
      </div>
    </header>
  )
}
