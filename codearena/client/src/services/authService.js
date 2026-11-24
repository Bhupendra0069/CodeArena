import api from './api'

export const authService = {
  async register(username, email, password) {
    const { data } = await api.post('/auth/register', { username, email, password })
    return data
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    return data
  },

  async logout() {
    const { data } = await api.post('/auth/logout')
    return data
  },

  async getMe() {
    const { data } = await api.get('/auth/me')
    return data
  },

  async changePassword(currentPassword, newPassword) {
    const { data } = await api.put('/auth/change-password', { currentPassword, newPassword })
    return data
  },
}
