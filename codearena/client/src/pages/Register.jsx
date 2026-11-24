import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (form.username.length < 3) return 'Username must be at least 3 characters'
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) return 'Username can only contain letters, numbers, and underscores'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (form.password !== form.confirm) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    try {
      await register(form.username, form.email, form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const requirements = [
    { label: 'At least 3 characters', met: form.username.length >= 3 },
    { label: 'Letters, numbers, underscores only', met: /^[a-zA-Z0-9_]*$/.test(form.username) && form.username.length > 0 },
  ]

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-purple/20 rounded-2xl mb-4">
            <Code2 size={28} className="text-accent-purple-light" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-500 mt-1 text-sm">Join CodeArena and start competing</p>
        </div>

        <div className="card">
          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="coolcoder123"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                autoFocus
              />
              {form.username && (
                <div className="mt-2 space-y-1">
                  {requirements.map((r) => (
                    <div key={r.label} className="flex items-center gap-1.5 text-xs">
                      <CheckCircle2 size={12} className={r.met ? 'text-green-400' : 'text-gray-600'} />
                      <span className={r.met ? 'text-green-400' : 'text-gray-600'}>{r.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`input-field ${form.confirm && form.password !== form.confirm ? 'border-red-500/50 focus:ring-red-500' : ''}`}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
              />
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-purple-light hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
