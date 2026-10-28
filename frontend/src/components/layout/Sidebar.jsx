// import { NavLink, useNavigate } from 'react-router-dom'
// import {
//   LayoutDashboard, ShoppingBag, Tag, Package, Users,
//   BarChart2, Settings, LogOut, ChevronLeft, ChevronRight,
//   UtensilsCrossed, ClipboardList, CreditCard, FileText
// } from 'lucide-react'
// import { useState } from 'react'
// import { logoutAdmin } from '../../services/authService'
// import { clearAuth, getAdmin } from '../../utils/auth'
// import toast from 'react-hot-toast'

// const navItems = [
//   { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//   { to: '/orders', icon: ShoppingBag, label: 'Orders' },
//   { to: '/categories', icon: Tag, label: 'Categories' },
//   { to: '/products', icon: Package, label: 'Products' },
//   { to: '/hundi', icon: UtensilsCrossed, label: 'Hundi' },
//   { to: '/customers', icon: Users, label: 'Customers' },
//   { to: '/payments', icon: CreditCard, label: 'Payments' },
//   { to: '/reports', icon: BarChart2, label: 'Reports' },
//   { to: '/audit-logs', icon: FileText, label: 'Audit Logs' },
//   { to: '/settings', icon: Settings, label: 'Settings' },
// ]

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false)
//   const navigate = useNavigate()
//   const admin = getAdmin()

//   const handleLogout = async () => {
//     try {
//       await logoutAdmin()
//     } catch {}
//     clearAuth()
//     toast.success('Logged out successfully')
//     navigate('/login')
//   }

//   return (
//     <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
//       {/* Logo */}
//       <div className="sidebar__logo">
//         {!collapsed && (
//           <div className="sidebar__brand">
//             <span className="sidebar__brand-icon">🍽️</span>
//             <span className="sidebar__brand-text">DRK Kitchen</span>
//           </div>
//         )}
//         {collapsed && <span className="sidebar__brand-icon">🍽️</span>}
//         <button className="sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
//           {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
//         </button>
//       </div>

//       {/* Nav */}
//       <nav className="sidebar__nav">
//         {navItems.map(({ to, icon: Icon, label }) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
//             }
//           >
//             <Icon size={20} className="sidebar__link-icon" />
//             {!collapsed && <span className="sidebar__link-label">{label}</span>}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="sidebar__footer">
//         {!collapsed && (
//           <div className="sidebar__admin-info">
//             <div className="sidebar__avatar">
//               {admin?.name?.charAt(0).toUpperCase() || 'A'}
//             </div>
//             <div className="sidebar__admin-details">
//               <p className="sidebar__admin-name">{admin?.name || 'Admin'}</p>
//               <p className="sidebar__admin-email">{admin?.email || ''}</p>
//             </div>
//           </div>
//         )}
//         <button className="sidebar__logout" onClick={handleLogout} title="Logout">
//           <LogOut size={18} />
//           {!collapsed && <span>Logout</span>}
//         </button>
//       </div>
//     </aside>
//   )
// }
// import { NavLink, useNavigate } from 'react-router-dom'
// import {
//   LayoutDashboard, ShoppingBag, Tag, Package, Users,
//   BarChart2, Settings, LogOut, ChevronLeft, ChevronRight,
//   UtensilsCrossed, ClipboardList, CreditCard, FileText, Scale
// } from 'lucide-react'
// import { useState } from 'react'
// import { logoutAdmin } from '../../services/authService'
// import { clearAuth, getAdmin } from '../../utils/auth'
// import toast from 'react-hot-toast'

// const navItems = [
//   { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//   { to: '/orders', icon: ShoppingBag, label: 'Orders' },
//   { to: '/categories', icon: Tag, label: 'Categories' },
//   { to: '/products', icon: Package, label: 'Products' },
//   { to: '/weightage', icon: Scale, label: 'Weightage' },
//   { to: '/hundi', icon: UtensilsCrossed, label: 'Hundi' },
//   { to: '/customers', icon: Users, label: 'Customers' },
//   { to: '/payments', icon: CreditCard, label: 'Payments' },
//   { to: '/reports', icon: BarChart2, label: 'Reports' },
//   { to: '/audit-logs', icon: FileText, label: 'Audit Logs' },
//   { to: '/settings', icon: Settings, label: 'Settings' },
// ]

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false)
//   const navigate = useNavigate()
//   const admin = getAdmin()

//   const handleLogout = async () => {
//     try {
//       await logoutAdmin()
//     } catch {}
//     clearAuth()
//     toast.success('Logged out successfully')
//     navigate('/login')
//   }

//   return (
//     <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
//       {/* Logo */}
//       <div className="sidebar__logo">
//         {!collapsed && (
//           <div className="sidebar__brand">
//             <span className="sidebar__brand-icon">🍽️</span>
//             <span className="sidebar__brand-text">DRK Kitchen</span>
//           </div>
//         )}
//         {collapsed && <span className="sidebar__brand-icon">🍽️</span>}
//         <button className="sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
//           {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
//         </button>
//       </div>

//       {/* Nav */}
//       <nav className="sidebar__nav">
//         {navItems.map(({ to, icon: Icon, label }) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
//             }
//           >
//             <Icon size={20} className="sidebar__link-icon" />
//             {!collapsed && <span className="sidebar__link-label">{label}</span>}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="sidebar__footer">
//         {!collapsed && (
//           <div className="sidebar__admin-info">
//             <div className="sidebar__avatar">
//               {admin?.name?.charAt(0).toUpperCase() || 'A'}
//             </div>
//             <div className="sidebar__admin-details">
//               <p className="sidebar__admin-name">{admin?.name || 'Admin'}</p>
//               <p className="sidebar__admin-email">{admin?.email || ''}</p>
//             </div>
//           </div>
//         )}
//         <button className="sidebar__logout" onClick={handleLogout} title="Logout">
//           <LogOut size={18} />
//           {!collapsed && <span>Logout</span>}
//         </button>
//       </div>
//     </aside>
//   )
// }
import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { logoutAdmin } from '../../services/authService'
import { clearAuth, getAdmin } from '../../utils/auth'
import '../styles/Sidebar.css'
const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/orders', label: 'Orders', badgeKey: 'orders' },
  { to: '/preorder-schedule', label: 'Pre-order schedule' },
  { to: '/menu', label: 'Menu' },
  { to: '/customers', label: 'Customers' },
  { to: '/payments', label: 'Payments', badgeKey: 'payments' },
  { to: '/settings', label: 'Settings' },
]

// counts example: { orders: 12, payments: 3 } (pass from AdminLayout)
export default function Sidebar({ counts = {} }) {
  const navigate = useNavigate()
  const admin = getAdmin()

  const handleLogout = async () => {
    try {
      await logoutAdmin()
    } catch {}
    clearAuth()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <img
          className="sidebar__logo-img"
          src="/drk-logo.png"
          alt="DRK"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="sidebar__brand-text">
          <p className="sidebar__brand-name">DRK Kitchen</p>
          <p className="sidebar__brand-sub">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
        {navItems.map(({ to, label, badgeKey }) => {
          const count = badgeKey ? counts[badgeKey] : 0
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <span className="sidebar__link-label">{label}</span>
              {count > 0 && <span className="sidebar__badge">{count}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar__footer">
        <p className="sidebar__admin-name">{admin?.name || 'Admin'}</p>
        <p className="sidebar__admin-role">{admin?.role || 'Owner'}</p>
        <button className="sidebar__logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </aside>
  )
}