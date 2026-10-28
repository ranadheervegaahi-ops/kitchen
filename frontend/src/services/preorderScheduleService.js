import api from './api' // your existing axios instance (baseURL ends with /api)

const base = '/admin/preorder-schedule'
const unwrap = (r) => (r.data && r.data.data !== undefined ? r.data.data : r.data)

export const getWeek = () => api.get(`${base}/week`).then(unwrap)
export const getDay = (date) => api.get(`${base}/day`, { params: { date } }).then(unwrap)
export const blockSlot = (date, start) => api.post(`${base}/block`, { date, start }).then(unwrap)
export const unblockSlot = (date, start) => api.post(`${base}/unblock`, { date, start }).then(unwrap)
export const setDayClosed = (date, closed) => api.post(`${base}/close-day`, { date, closed }).then(unwrap)

export const getOrder = (id) => api.get(`${base}/orders/${id}`).then(unwrap)
export const startOrder = (id) => api.post(`${base}/orders/${id}/start`).then(unwrap)
export const cancelOrder = (id, reason) => api.post(`${base}/orders/${id}/cancel`, { reason }).then(unwrap)
export const printKot = (id) => api.post(`${base}/orders/${id}/kot`).then(unwrap)