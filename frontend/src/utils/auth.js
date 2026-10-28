export const setAuth = (token, admin) => {
  localStorage.setItem('drk_token', token)
  localStorage.setItem('drk_admin', JSON.stringify(admin))
}

export const clearAuth = () => {
  localStorage.removeItem('drk_token')
  localStorage.removeItem('drk_admin')
}

export const getToken = () => localStorage.getItem('drk_token')

export const getAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem('drk_admin'))
  } catch {
    return null
  }
}

export const isAuthenticated = () => !!getToken()
