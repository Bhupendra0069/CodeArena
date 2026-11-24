import { useEffect, useState } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'

/**
 * Displays a countdown timer.
 * @param {number} timeRemaining - Milliseconds remaining
 */
export default function Timer({ timeRemaining }) {
  const totalSeconds = Math.max(0, Math.floor(timeRemaining / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const isWarning = totalSeconds <= 60 && totalSeconds > 0
  const isDanger = totalSeconds <= 30 && totalSeconds > 0
  const isExpired = totalSeconds === 0

  return (
    <div
      className={`flex items-center gap-2 font-mono font-bold text-lg px-4 py-2 rounded-lg border transition-all duration-300 ${
        isExpired
          ? 'text-gray-500 border-gray-700 bg-gray-800/30'
          : isDanger
          ? 'text-red-400 border-red-500/40 bg-red-500/10 animate-pulse'
          : isWarning
          ? 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10'
          : 'text-green-400 border-green-500/30 bg-green-500/10'
      }`}
    >
      {isDanger ? <AlertTriangle size={16} /> : <Clock size={16} />}
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}
