
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Menu from './pages/menu/Menu'
import Hundi from './pages/products/Hundi'
import Orders from './pages/orders/Orders'
import Payments from './pages/orders/Payments'
import Customers from './pages/customers/Customers'
import Reports from './pages/reports/Reports'
import Settings from './pages/settings/Settings'
import AuditLogs from './pages/settings/AuditLogs'
import PreorderSchedule from './pages/orders/PreorderSchedule'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{ duration: 3000 }}
      />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          {/* Menu with Categories, Sizes and Add Dish */}
          <Route path="menu" element={<Menu />} />

          {/* Redirect old menu URLs */}
          <Route path="categories" element={<Navigate to="/menu" replace />} />
          <Route path="products" element={<Navigate to="/menu" replace />} />
          <Route path="weightage" element={<Navigate to="/menu" replace />} />

          <Route path="hundi" element={<Hundi />} />
          <Route path="orders" element={<Orders />} />
         <Route path="preorder-schedule" element={<PreorderSchedule/>} />
          <Route path="payments" element={<Payments />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}