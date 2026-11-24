import { Link } from 'react-router-dom'
import { Swords, Clock, Trophy, Circle } from 'lucide-react'

function ResultBadge({ result, winnerId, currentUserId }) {
  if (!result) return <span className="text-gray-500 text-xs">—</span>
  if (result === 'draw') return <span className="text-yellow-400 text-xs font-semibold">Draw</span>
  if (result === 'cancelled') return <span className="text-gray-500 text-xs">Cancelled</span>

  const isWin = winnerId && currentUserId && winnerId.toString() === currentUserId.toString()
  return isWin
    ? <span className="text-green-400 text-xs font-semibold">Win</span>
    : <span className="text-red-400 text-xs font-semibold">Loss</span>
}

export default function BattleCard({ match, currentUserId }) {
  const opponent = match.players?.find(p => {
    const uid = p.user?._id || p.user
    return uid?.toString() !== currentUserId?.toString()
  })

  const durationMin = match.duration
  const problem = match.problem

  return (
    <div className="card hover:border-white/10 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent-purple/20 rounded-lg flex items-center justify-center shrink-0">
            <Swords size={17} className="text-accent-purple-light" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-200">
              vs {opponent?.username || 'Unknown'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {problem?.title || 'Problem not available'}
            </p>
          </div>
        </div>

        <ResultBadge
          result={match.result}
          winnerId={match.winner?._id || match.winner}
          currentUserId={currentUserId}
        />
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={12} />
          {durationMin} min
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              problem?.difficulty === 'Easy'
                ? 'text-green-400 bg-green-500/10'
                : problem?.difficulty === 'Medium'
                ? 'text-yellow-400 bg-yellow-500/10'
                : 'text-red-400 bg-red-500/10'
            }`}
          >
            {problem?.difficulty || 'N/A'}
          </span>
        </div>
        <span className="text-xs text-gray-600 ml-auto">
          {match.createdAt ? new Date(match.createdAt).toLocaleDateString() : ''}
        </span>
      </div>
    </div>
  )
}
