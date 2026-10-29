import api from './api'
export const registerAdmin = (data) => api.post('/admin/auth/register', data)
export const loginAdmin = (data) => api.post('/admin/auth/login', data)
export const logoutAdmin = () => api.post('/admin/auth/logout')
export const getMe =() => api.get('/admin/auth/me')
export const getDashboard = () => api.get('/admin/dashboard')
export const getRecentOrders = () => api.get('/admin/dashboard/recent-orders')
