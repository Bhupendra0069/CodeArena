import api from './api'

export const submissionService = {
  async runCode({ problemId, sourceCode, language, stdin }) {
    const { data } = await api.post('/submissions/run', { problemId, sourceCode, language, stdin })
    return data
  },

  async submitSolution({ problemId, sourceCode, language, matchId }) {
    const { data } = await api.post('/submissions/submit', { problemId, sourceCode, language, matchId })
    return data
  },

  async getHistory() {
    const { data } = await api.get('/submissions/history')
    return data
  },
}
