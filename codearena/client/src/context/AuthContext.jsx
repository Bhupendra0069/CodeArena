import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // On mount, verify the stored token is still valid
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        setLoading(false)
        return
      }
      try {
        const data = await authService.getMe()
        setUser(data.user)
      } catch {
        // Token invalid or expired — clear storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verifyToken()
  }, [])

  // Listen for the global 401 event emitted by the axios interceptor.
  // This handles token expiry mid-session without a full page reload.
  useEffect(() => {
    const handleForcedLogout = () => {
      setToken(null)
      setUser(null)
    }
    window.addEventListener('auth:logout', handleForcedLogout)
    return () => window.removeEventListener('auth:logout', handleForcedLogout)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (username, email, password) => {
    const data = await authService.register(username, email, password)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    // Best-effort server-side logout notification
    try { await authService.logout() } catch { /* ignore */ }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  // Refresh user data from server (e.g. after a battle)
  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.getMe()
      setUser(data.user)
    } catch (err) {
      console.error('Failed to refresh user:', err)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
