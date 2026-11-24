import { Crown, TrendingUp } from 'lucide-react'

export default function LeaderboardTable({ users, currentUserId }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
            <th className="text-left pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Player</th>
            <th className="text-right pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
            <th className="text-right pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Battles</th>
            <th className="text-right pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Wins</th>
            <th className="text-right pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Win Rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((u) => {
            const isMe = u._id?.toString() === currentUserId?.toString()
            const isTop3 = u.rank <= 3
            const rankColors = { 1: 'text-yellow-400', 2: 'text-gray-300', 3: 'text-amber-600' }

            return (
              <tr
                key={u._id}
                className={`transition-colors ${
                  isMe ? 'bg-accent-purple/10 border-l-2 border-l-accent-purple' : 'hover:bg-white/2'
                }`}
              >
                {/* Rank */}
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-1">
                    {isTop3 ? (
                      <Crown size={14} className={rankColors[u.rank]} />
                    ) : null}
                    <span className={`font-bold ${isTop3 ? rankColors[u.rank] : 'text-gray-500'}`}>
                      #{u.rank}
                    </span>
                  </div>
                </td>

                {/* Username */}
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-accent-purple/25 border border-accent-purple/30 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-accent-purple-light">
                        {u.username[0].toUpperCase()}
                      </span>
                    </div>
                    <span className={`font-medium ${isMe ? 'text-accent-purple-light' : 'text-gray-200'}`}>
                      {u.username}
                      {isMe && <span className="ml-1.5 text-xs text-accent-purple-light">(you)</span>}
                    </span>
                  </div>
                </td>

                {/* Rating */}
                <td className="py-3.5 pr-4 text-right">
                  <span className="font-bold text-accent-purple-light">{u.rating}</span>
                </td>

                {/* Battles */}
                <td className="py-3.5 pr-4 text-right text-gray-400 hidden sm:table-cell">{u.battlesPlayed}</td>

                {/* Wins */}
                <td className="py-3.5 pr-4 text-right text-gray-400 hidden sm:table-cell">{u.battlesWon}</td>

                {/* Win Rate */}
                <td className="py-3.5 text-right hidden md:table-cell">
                  <span className={`text-xs font-semibold ${u.winRate >= 60 ? 'text-green-400' : u.winRate >= 40 ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {u.winRate}%
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
