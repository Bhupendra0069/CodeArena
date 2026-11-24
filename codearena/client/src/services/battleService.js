import api from './api'

export const battleService = {
  async createBattle(difficulty, duration) {
    const { data } = await api.post('/battles', { difficulty, duration })
    return data
  },

  async joinBattle(roomCode) {
    const { data } = await api.post('/battles/join', { roomCode })
    return data
  },

  async getBattleById(id) {
    const { data } = await api.get(`/battles/${id}`)
    return data
  },

  async getBattleHistory() {
    const { data } = await api.get('/battles/history')
    return data
  },

  async getLeaderboard(params = {}) {
    const { data } = await api.get('/leaderboard', { params })
    return data
  },

  async getMyProfile() {
    const { data } = await api.get('/users/me')
    return data
  },

  async getUserById(id) {
    const { data } = await api.get(`/users/${id}`)
    return data
  },
}
