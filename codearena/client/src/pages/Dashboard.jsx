import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { battleService } from '../services/battleService'
import BattleCard from '../components/BattleCard'
import {
  Trophy, Swords, Code2, TrendingUp, Star, Plus, BookOpen,
  Activity, ChevronRight
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, color = 'text-accent-purple-light', bg = 'bg-accent-purple/10' }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
          <Icon size={17} className={color} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user, refreshUser } = useAuth()
  const [battles, setBattles] = useState([])
  const [rank, setRank] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshUser()
        const [historyData, profileData] = await Promise.all([
          battleService.getBattleHistory(),
          battleService.getMyProfile(),
        ])
        setBattles(historyData.data?.slice(0, 5) || [])
        setRank(profileData.data?.rank || null)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const winRate = user?.battlesPlayed > 0
    ? Math.round((user.battlesWon / user.battlesPlayed) * 100)
    : 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="text-accent-purple-light">{user?.username}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your coding journey at a glance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Trophy} label="Rating" value={user?.rating || 1000} color="text-yellow-400" bg="bg-yellow-500/10" />
        <StatCard icon={Code2} label="Problems Solved" value={user?.problemsSolved || 0} color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard icon={Swords} label="Battles Played" value={user?.battlesPlayed || 0} color="text-accent-purple-light" bg="bg-accent-purple/10" />
        <StatCard icon={Star} label="Win Rate" value={`${winRate}%`} color="text-green-400" bg="bg-green-500/10" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-green-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Battles Won</p>
            <p className="text-xl font-bold text-white">{user?.battlesWon || 0}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0">
            <Activity size={18} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Leaderboard Rank</p>
            <p className="text-xl font-bold text-white">{rank ? `#${rank}` : '—'}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center shrink-0">
            <Star size={18} className="text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Member Since</p>
            <p className="text-sm font-bold text-white">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link to="/battles/create"
          className="flex items-center justify-between bg-accent-purple/15 hover:bg-accent-purple/25 border border-accent-purple/30 rounded-xl px-6 py-5 group transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent-purple/30 rounded-lg flex items-center justify-center">
              <Swords size={19} className="text-accent-purple-light" />
            </div>
            <div>
              <p className="font-semibold text-white">Create a Battle</p>
              <p className="text-xs text-gray-400">Challenge another developer</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link to="/problems"
          className="flex items-center justify-between bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl px-6 py-5 group transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BookOpen size={19} className="text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Practice Problems</p>
              <p className="text-xs text-gray-400">Improve your skills</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent battles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recent Battles</h2>
          <Link to="/battles/history" className="text-sm text-accent-purple-light hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="card animate-pulse h-24 bg-dark-700" />)}
          </div>
        ) : battles.length === 0 ? (
          <div className="card text-center py-10">
            <Swords size={36} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No battles yet. Challenge someone!</p>
            <Link to="/battles/create" className="btn-primary text-sm px-6">
              Create First Battle
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {battles.map(battle => (
              <BattleCard key={battle._id} match={battle} currentUserId={user?._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
