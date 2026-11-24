import api from './api'

export const problemService = {
  async getProblems(params = {}) {
    const { data } = await api.get('/problems', { params })
    return data
  },

  async getProblemById(id) {
    const { data } = await api.get(`/problems/${id}`)
    return data
  },
}
