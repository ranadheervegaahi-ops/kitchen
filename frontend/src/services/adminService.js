// import api from './api'

// export const getCategories = (params) => api.get('/admin/categories', { params })
// export const getCategory = (id) => api.get(`/admin/categories/${id}`)
// export const createCategory = (data) => {
//   const fd = new FormData()
//   Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k === 'image' ? 'image' : k, v) })
//   return api.post('/admin/categories', fd)
// }
// export const updateCategory = (id, data) => {
//   const fd = new FormData()
//   Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k === 'image' ? 'image' : k, v) })
//   return api.put(`/admin/categories/${id}`, fd)
// }
// export const updateCategoryStatus = (id, status) => api.patch(`/admin/categories/${id}/status`, { status })
// export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`)

// export const getProducts = (params) => api.get('/admin/products', { params })
// export const getProduct = (id) => api.get(`/admin/products/${id}`)
// export const getProductPreorder = (id, date) => api.get(`/admin/products/${id}/preorder`, { params: { date } })
// export const createProduct = (data) => api.post('/admin/products', data)
// export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data)
// export const updateProductStatus = (id, status) => api.patch(`/admin/products/${id}/status`, { status })
// export const updateProductAvailability = (id, availability) => api.patch(`/admin/products/${id}/availability`, { availability })
// export const deleteProduct = (id) => api.delete(`/admin/products/${id}`)
// export const getVariants = (productId) => api.get(`/admin/products/${productId}/variants`)
// export const createVariant = (productId, data) => api.post(`/admin/products/${productId}/variants`, data)
// export const deleteVariant = (id) => api.delete(`/admin/variants/${id}`)
// export const updateVariant = (id, data) => api.put(`/admin/variants/${id}`, data)
// export const updateVariantPrice = (id, price) => api.put(`/admin/variants/${id}/price`, { price })
// export const updateVariantStatus = (id, status) => api.patch(`/admin/variants/${id}/status`, { status })
// export const updateVariantAvailability = (id, availability) => api.patch(`/admin/variants/${id}/availability`, { availability })

// export const getHundi = () => api.get('/admin/hundi')
// export const getHundiPreorder = (id, date) => api.get(`/admin/hundi/${id}/preorder`, { params: { date } })

// const asHundiFormData = (data = {}) => {
//   const fd = data instanceof FormData ? data : new FormData()

//   if (!(data instanceof FormData)) {
//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) fd.append(key, value)
//     })
//   }

//   return fd
// }

// export const createHundi = (data) => {
//   const fd = asHundiFormData(data)
//   return api.post('/admin/hundi', fd)
// }

// export const updateHundi = (id, data) => {
//   const fd = asHundiFormData(data)
//   return api.put(`/admin/hundi/${id}`, fd)
// }

// export const updateHundiStatus = (id, status) => api.patch(`/admin/hundi/${id}/status`, { status })
// export const deleteHundi = (id) => api.delete(`/admin/hundi/${id}`)

// export const getOrders = (params) => api.get('/admin/orders', { params })
// export const getOrder = (id) => api.get(`/admin/orders/${id}`)
// export const updateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/status`, { status })
// export const getOrderPayment = (id) => api.get(`/admin/orders/${id}/payment`)

// export const getPayments = (params) => api.get('/admin/payments', { params })

// export const getCustomers = (params) => api.get('/admin/customers', { params })
// export const getCustomer = (id) => api.get(`/admin/customers/${id}`)
// export const getCustomerOrders = (id, params) => api.get(`/admin/customers/${id}/orders`, { params })

// export const getSalesReport = (params) => api.get('/admin/reports/sales', { params })
// export const getProductSalesReport = (params) => api.get('/admin/reports/product-sales', { params })

// export const getBusinessSettings = () => api.get('/admin/settings/business')
// export const updateBusinessSettings = (data) => api.put('/admin/settings/business', data)
// export const getOrderSettings = () => api.get('/admin/settings/order')
// export const updateOrderSettings = (data) => api.put('/admin/settings/order', data)
// export const getBusinessHours = () => api.get('/admin/settings/hours')
// export const updateBusinessHours = (hours) => api.put('/admin/settings/hours', { hours })

// export const getAuditLogs = (params) => api.get('/admin/audit-logs', { params })
import api from './api'
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`)
export const getCategories = (params) => api.get('/admin/categories', { params })
export const getCategory = (id) => api.get(`/admin/categories/${id}`)
export const createCategory = (data) => {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k === 'image' ? 'image' : k, v) })
  return api.post('/admin/categories', fd)
}
export const updateCategory = (id, data) => {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k === 'image' ? 'image' : k, v) })
  return api.put(`/admin/categories/${id}`, fd)
}
export const updateCategoryStatus = (id, status) => api.patch(`/admin/categories/${id}/status`, { status })
// export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`)

export const getProducts = (params) => api.get('/admin/products', { params })
export const getProduct = (id) => api.get(`/admin/products/${id}`)
export const getProductPreorder = (id, date) => api.get(`/admin/products/${id}/preorder`, { params: { date } })
export const createProduct = (data) => api.post('/admin/products', data)
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data)
export const updateProductStatus = (id, status) => api.patch(`/admin/products/${id}/status`, { status })
export const updateProductAvailability = (id, availability) => api.patch(`/admin/products/${id}/availability`, { availability })
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`)
export const getVariants = (productId) => api.get(`/admin/products/${productId}/variants`)
export const createVariant = (productId, data) => api.post(`/admin/products/${productId}/variants`, data)
export const deleteVariant = (id) => api.delete(`/admin/variants/${id}`)
export const updateVariant = (id, data) => api.put(`/admin/variants/${id}`, data)
export const updateVariantPrice = (id, price) => api.put(`/admin/variants/${id}/price`, { price })
export const updateVariantStatus = (id, status) => api.patch(`/admin/variants/${id}/status`, { status })
export const updateVariantAvailability = (id, availability) => api.patch(`/admin/variants/${id}/availability`, { availability })

export const getHundi = () => api.get('/admin/hundi')
export const getHundiPreorder = (id, date) => api.get(`/admin/hundi/${id}/preorder`, { params: { date } })

const asHundiFormData = (data = {}) => {
  const fd = data instanceof FormData ? data : new FormData()

  if (!(data instanceof FormData)) {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) fd.append(key, value)
    })
  }

  return fd
}

export const createHundi = (data) => {
  const fd = asHundiFormData(data)
  return api.post('/admin/hundi', fd)
}

export const updateHundi = (id, data) => {
  const fd = asHundiFormData(data)
  return api.put(`/admin/hundi/${id}`, fd)
}

export const updateHundiStatus = (id, status) => api.patch(`/admin/hundi/${id}/status`, { status })
export const deleteHundi = (id) => api.delete(`/admin/hundi/${id}`)

export const getOrders = (params) => api.get('/admin/orders', { params })
export const getOrder = (id) => api.get(`/admin/orders/${id}`)
export const updateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/status`, { status })
export const getOrderPayment = (id) => api.get(`/admin/orders/${id}/payment`)

export const getPayments = (params) => api.get('/admin/payments', { params })

export const getCustomers = (params) => api.get('/admin/customers', { params })
export const getCustomer = (id) => api.get(`/admin/customers/${id}`)
export const getCustomerOrders = (id, params) => api.get(`/admin/customers/${id}/orders`, { params })

export const getSalesReport = (params) => api.get('/admin/reports/sales', { params })
export const getProductSalesReport = (params) => api.get('/admin/reports/product-sales', { params })

export const getBusinessSettings = () => api.get('/admin/settings/business')
export const updateBusinessSettings = (data) => api.put('/admin/settings/business', data)
export const getOrderSettings = () => api.get('/admin/settings/order')
export const updateOrderSettings = (data) => api.put('/admin/settings/order', data)
export const getBusinessHours = () => api.get('/admin/settings/hours')
export const updateBusinessHours = (hours) => api.put('/admin/settings/hours', { hours })

// Delivery price per km, max delivery distance and packing charge
export const getChargeSettings = () => api.get('/admin/charges')
export const updateChargeSettings = (data) => api.put('/admin/charges', data)

export const getAuditLogs = (params) => api.get('/admin/audit-logs', { params })