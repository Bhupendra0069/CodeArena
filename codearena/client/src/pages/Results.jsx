import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { battleService } from '../services/battleService'
import { useSkyrocket } from '../hooks/useSkyrocket'
import { Trophy, Swords, TrendingUp, TrendingDown, Minus, ArrowLeft, Plus } from 'lucide-react'

export default function Results() {
  const { id } = useParams()
  const { user } = useAuth()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { fireWin, fireDraw } = useSkyrocket()

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const data = await battleService.getBattleById(id)
        setMatch(data.data)
      } catch (err) {
        setError('Failed to load results.')
      } finally {
        setLoading(false)
      }
    }
    fetchMatch()
  }, [id])

  // 🚀 Fire skyrocket when results are loaded
  useEffect(() => {
    if (!match || !user) return
    const winnerId = match.winner?._id?.toString() || match.winner?.toString()
    const isWinner = winnerId === user._id?.toString()
    const isDraw = match.result === 'draw'

    if (isDraw) {
      // Short delay so the page renders first
      const t = setTimeout(() => fireDraw(), 400)
      return () => clearTimeout(t)
    } else if (isWinner) {
      const t = setTimeout(() => fireWin(), 400)
      return () => clearTimeout(t)
    }
  }, [match, user, fireWin, fireDraw])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error || !match) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-red-400">{error || 'Results not found.'}</p>
    </div>
  )

  const myPlayer = match.players?.find(p => {
    const uid = p.user?._id || p.user
    return uid?.toString() === user?._id?.toString()
  })
  const opponent = match.players?.find(p => {
    const uid = p.user?._id || p.user
    return uid?.toString() !== user?._id?.toString()
  })

  const winnerId = match.winner?._id?.toString() || match.winner?.toString()
  const isWinner = winnerId === user?._id?.toString()
  const isDraw = match.result === 'draw'
  const isCancelled = match.result === 'cancelled'

  const resultLabel = isCancelled ? 'Cancelled' : isDraw ? 'Draw' : isWinner ? 'Victory!' : 'Defeat'
  const resultColor = isCancelled || isDraw ? 'text-yellow-400' : isWinner ? 'text-green-400' : 'text-red-400'

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      {/* Result banner */}
      <div className={`card mb-6 text-center border-2 ${
        isWinner ? 'border-green-500/30 bg-green-500/5'
        : isDraw ? 'border-yellow-500/30 bg-yellow-500/5'
        : isCancelled ? 'border-gray-500/30'
        : 'border-red-500/20 bg-red-500/5'
      }`}>
        <div className="py-4">
          {!isDraw && !isCancelled && (
            <Trophy size={48} className={`mx-auto mb-3 ${isWinner ? 'text-yellow-400' : 'text-gray-600'}`} />
          )}
          {isDraw && <Swords size={48} className="mx-auto mb-3 text-yellow-400" />}
          <h1 className={`text-4xl font-extrabold mb-1 ${resultColor}`}>{resultLabel}</h1>
          {match.problem && (
            <p className="text-gray-400 text-sm">{match.problem.title}</p>
          )}
        </div>
      </div>

      {/* Players comparison */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Players</h2>
        <div className="grid grid-cols-2 gap-4">
          {[myPlayer, opponent].map((p, i) => {
            if (!p) return <div key={i} />
            const pId = p.user?._id?.toString() || p.user?.toString()
            const pIsWinner = winnerId === pId
            const ratingChange = p.ratingChange || 0
            return (
              <div key={p.username} className={`rounded-xl p-4 border-2 ${
                pIsWinner && !isDraw
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-white/5 bg-dark-700'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-accent-purple/25 border border-accent-purple/30 flex items-center justify-center">
                    <span className="font-bold text-accent-purple-light">{p.username[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-200">{p.username}</p>
                    {i === 0 && <p className="text-xs text-gray-500">(you)</p>}
                  </div>
                  {pIsWinner && !isDraw && <Trophy size={14} className="text-yellow-400 ml-auto" />}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Rating Before</span>
                    <span className="text-gray-300">{p.ratingBefore || '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Rating After</span>
                    <span className="text-gray-300">{p.ratingAfter || '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Change</span>
                    <span className={ratingChange > 0 ? 'text-green-400' : ratingChange < 0 ? 'text-red-400' : 'text-gray-500'}>
                      {ratingChange > 0 ? '+' : ''}{ratingChange}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-gray-500">
                    {p.hasSubmitted
                      ? p.submissionVerdict === 'Accepted'
                        ? <span className="text-green-400">✓ Accepted</span>
                        : <span className="text-red-400">✗ {p.submissionVerdict}</span>
                      : <span className="text-gray-600">No submission</span>
                    }
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Match details */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Match Details</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-500">Problem</p>
            <p className="text-gray-200 font-medium">{match.problem?.title || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Difficulty</p>
            <p className="text-gray-200 font-medium">{match.difficulty}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-gray-200 font-medium">{match.duration} minutes</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-gray-200 font-medium">
              {match.createdAt ? new Date(match.createdAt).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to="/dashboard" className="btn-secondary flex items-center gap-2 flex-1 justify-center">
          <ArrowLeft size={16} />
          Dashboard
        </Link>
        <Link to="/battles/create" className="btn-primary flex items-center gap-2 flex-1 justify-center">
          <Plus size={16} />
          New Battle
        </Link>
      </div>
    </div>
  )
}
