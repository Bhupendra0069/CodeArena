import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { battleService } from '../services/battleService'
import BattleCard from '../components/BattleCard'
import { User, Calendar, Trophy, Swords, Code2, TrendingUp, Loader2 } from 'lucide-react'

function StatRow({ icon: Icon, label, value, color = 'text-gray-300' }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Icon size={15} />
        {label}
      </div>
      <span className={`text-sm font-semibold ${color}`}>{value}</span>
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await battleService.getMyProfile()
        setProfile(data.data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={28} className="text-accent-purple animate-spin" />
    </div>
  )

  const p = profile || user
  const winRate = p?.battlesPlayed > 0
    ? Math.round((p.battlesWon / p.battlesPlayed) * 100)
    : 0

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Profile header */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-accent-purple/25 border-2 border-accent-purple/40 flex items-center justify-center shrink-0">
            <span className="text-3xl font-black text-accent-purple-light">
              {p?.username?.[0]?.toUpperCase()}
            </span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">{p?.username}</h1>
            <p className="text-gray-500 text-sm mb-3">{p?.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-dark-700 px-3 py-1.5 rounded-full border border-white/5">
                <Calendar size={12} />
                Joined {p?.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
              </div>
              {profile?.rank && (
                <div className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                  <Trophy size={12} />
                  Rank #{profile.rank}
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">ELO Rating</p>
            <p className="text-4xl font-black text-accent-purple-light">{p?.rating}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Battle stats */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Battle Stats</h2>
          <StatRow icon={Swords} label="Battles Played" value={p?.battlesPlayed || 0} />
          <StatRow icon={Trophy} label="Battles Won" value={p?.battlesWon || 0} color="text-green-400" />
          <StatRow icon={TrendingUp} label="Win Rate" value={`${winRate}%`} color={winRate >= 50 ? 'text-green-400' : 'text-red-400'} />
        </div>

        {/* Coding stats */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Coding Stats</h2>
          <StatRow icon={Code2} label="Problems Solved" value={p?.problemsSolved || 0} color="text-blue-400" />
          <StatRow icon={Trophy} label="Current Rating" value={p?.rating || 1000} color="text-accent-purple-light" />
          <StatRow icon={User} label="Username" value={p?.username} />
        </div>
      </div>

      {/* Recent battles */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Recent Battles</h2>
        {profile?.recentMatches?.length > 0 ? (
          <div className="space-y-3">
            {profile.recentMatches.map(m => (
              <BattleCard key={m._id} match={m} currentUserId={user?._id} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <Swords size={32} className="text-gray-700 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No battles yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
