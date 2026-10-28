import api from './api' // same axios instance your other services use

const unwrap = (r) => (r.data && r.data.data !== undefined ? r.data.data : r.data)

export const fetchOrders = (params) => api.get('/admin/orders', { params }).then(unwrap)
export const changeOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/status`, { status }).then(unwrap)

// formatted order detail (placed time, items, totals, payment) for the side panel
export const fetchOrderDetail = (id) => api.get(`/admin/preorder-schedule/orders/${id}`).then(unwrap)
// cancels and marks the refund as pending
export const cancelOrderWithRefund = (id, reason) =>
  api.post(`/admin/preorder-schedule/orders/${id}/cancel`, { reason }).then(unwrap)