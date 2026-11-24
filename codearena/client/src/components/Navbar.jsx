import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Code2, Swords, Trophy, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setProfileOpen(false)
    setMobileOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/problems', label: 'Problems' },
    { to: '/battles/create', label: 'Battles' },
    { to: '/leaderboard', label: 'Leaderboard' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-dark-800/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center group-hover:bg-accent-purple-light transition-colors">
              <Code2 size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Code<span className="text-accent-purple-light">Arena</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-accent-purple/20 text-accent-purple-light'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-purple/30 border border-accent-purple/40 flex items-center justify-center">
                    <span className="text-sm font-bold text-accent-purple-light">
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-200">{user.username}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-dark-700 border border-white/10 rounded-xl shadow-xl py-1 animate-fade-in">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-xs text-gray-500">Rating</p>
                      <p className="text-sm font-bold text-accent-purple-light">{user.rating} ELO</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <User size={15} />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <LogOut size={15} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                  Log In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-800 border-t border-white/5 py-4 px-4 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-accent-purple/20 text-accent-purple-light'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-white/5 pt-3 mt-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 rounded-lg">
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 rounded-lg">
                  <User size={15} /> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">
                  <LogOut size={15} /> Log Out
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-sm text-center py-2.5">Log In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-sm text-center py-2.5">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
