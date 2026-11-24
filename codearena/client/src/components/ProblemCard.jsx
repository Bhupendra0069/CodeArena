import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, Tag } from 'lucide-react'

function DifficultyBadge({ difficulty }) {
  const cls = {
    Easy: 'badge-easy',
    Medium: 'badge-medium',
    Hard: 'badge-hard',
  }
  return <span className={cls[difficulty] || 'badge-easy'}>{difficulty}</span>
}

export default function ProblemCard({ problem, index }) {
  return (
    <Link
      to={`/problems/${problem._id}`}
      className="flex items-center gap-4 px-5 py-4 bg-dark-800 hover:bg-dark-700 border border-white/5 hover:border-white/10 rounded-xl transition-all duration-200 group"
    >
      {/* Number */}
      <span className="text-sm text-gray-600 font-mono w-8 shrink-0">{index + 1}.</span>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">
          {problem.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Tag size={11} className="text-gray-600" />
          <span className="text-xs text-gray-600">{problem.category}</span>
        </div>
      </div>

      {/* Difficulty */}
      <DifficultyBadge difficulty={problem.difficulty} />

      {/* Solved indicator placeholder */}
      <Clock size={15} className="text-gray-700 shrink-0" />
    </Link>
  )
}
