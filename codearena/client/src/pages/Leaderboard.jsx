import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { battleService } from '../services/battleService'
import LeaderboardTable from '../components/LeaderboardTable'
import { Trophy, Loader2 } from 'lucide-react'

export default function Leaderboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await battleService.getLeaderboard({ limit: 50 })
        setUsers(data.data || [])
      } catch (err) {
        setError('Failed to load leaderboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-500/15 rounded-2xl mb-4">
          <Trophy size={28} className="text-yellow-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">Leaderboard</h1>
        <p className="text-gray-500">Top players ranked by ELO rating</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="text-accent-purple animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-400">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No players yet. Be the first to register!</div>
        ) : (
          <LeaderboardTable users={users} currentUserId={user?._id} />
        )}
      </div>
    </div>
  )
}
