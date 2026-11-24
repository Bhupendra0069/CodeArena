import { Link } from 'react-router-dom'
import { Code2, Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-accent-purple rounded-lg flex items-center justify-center">
                <Code2 size={15} className="text-white" />
              </div>
              <span className="font-bold text-white">
                Code<span className="text-accent-purple-light">Arena</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Real-time competitive coding platform. Battle other developers,
              solve problems, and climb the leaderboard.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Platform</h4>
            <ul className="space-y-2">
              {[
                { to: '/problems', label: 'Problems' },
                { to: '/battles/create', label: 'Battles' },
                { to: '/leaderboard', label: 'Leaderboard' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Account</h4>
            <ul className="space-y-2">
              {[
                { to: '/register', label: 'Sign Up' },
                { to: '/login', label: 'Log In' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} CodeArena. Built with React, Node.js, MongoDB &amp; Socket.IO
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition-colors">
              <Github size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition-colors">
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
