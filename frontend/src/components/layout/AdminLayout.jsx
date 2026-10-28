import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/orders': 'Orders',
  '/categories': 'Categories',
  '/products': 'Products',
  '/hundi': 'Hundi Packages',
  '/customers': 'Customers',
  '/payments': 'Payments',
  '/reports': 'Reports',
  '/audit-logs': 'Audit Logs',
  '/settings': 'Settings',
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] || 'DRK Kitchen Admin'

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout__main">
        <Topbar title={title} />
        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
