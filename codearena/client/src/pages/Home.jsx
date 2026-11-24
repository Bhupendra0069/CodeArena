import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2, Swords, Trophy, Zap, ArrowRight, Shield, Clock } from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: 'Rich Code Editor',
    description: 'Write code in Monaco Editor with syntax highlighting for Python, JavaScript, Java, and C++.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Swords,
    title: 'Real-Time Battles',
    description: 'Challenge other developers to live coding duels. Solve the same problem, see who finishes first.',
    color: 'text-accent-purple-light',
    bg: 'bg-accent-purple/10',
  },
  {
    icon: Zap,
    title: 'Instant Execution',
    description: 'Your code is compiled and executed securely via Judge0. Get results in seconds.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Trophy,
    title: 'ELO Rating System',
    description: 'Win battles to climb the leaderboard. Ratings are calculated with the Elo formula.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Shield,
    title: 'Fair & Secure',
    description: 'All code runs on Judge0. Battle state is controlled server-side. No cheating possible.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    icon: Clock,
    title: 'Timed Challenges',
    description: 'Choose 15, 30, or 60-minute battles. Race against the clock and your opponent.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-purple/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent-purple/15 border border-accent-purple/30 text-accent-purple-light text-sm font-medium px-4 py-2 rounded-full mb-8">
            <Zap size={14} />
            Real-Time Competitive Coding
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Code. Battle.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple-light to-cyan-400">
              Dominate.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            CodeArena is where developers compete head-to-head in real-time coding battles.
            Solve algorithmic problems, climb the leaderboard, and prove your skills.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/battles/create" className="btn-primary flex items-center gap-2 justify-center text-base px-8 py-3.5">
                  <Swords size={18} />
                  Start a Battle
                </Link>
                <Link to="/problems" className="btn-secondary flex items-center gap-2 justify-center text-base px-8 py-3.5">
                  <Code2 size={18} />
                  Practice Problems
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary flex items-center gap-2 justify-center text-base px-8 py-3.5">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <Link to="/problems" className="btn-secondary flex items-center gap-2 justify-center text-base px-8 py-3.5">
                  <Code2 size={18} />
                  Browse Problems
                </Link>
              </>
            )}
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 pt-10 border-t border-white/5">
            {[
              { value: '10+', label: 'Problems' },
              { value: 'Real-time', label: 'Battles via Socket.IO' },
              { value: '4', label: 'Languages Supported' },
              { value: 'ELO', label: 'Rating System' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-dark-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Everything you need to compete</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A complete competitive programming platform built with modern technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:border-white/10 transition-all duration-200 group">
                <div className={`w-10 h-10 ${f.bg} rounded-lg flex items-center justify-center mb-4`}>
                  <f.icon size={20} className={f.color} />
                </div>
                <h3 className="font-semibold text-gray-200 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to prove yourself?</h2>
            <p className="text-gray-500 mb-8">
              Create a free account and start your first battle today.
            </p>
            <Link to="/register" className="btn-primary text-base px-10 py-3.5 inline-flex items-center gap-2">
              Create Free Account
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
