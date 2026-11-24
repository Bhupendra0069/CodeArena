import { useEffect, useState } from 'react'
import { problemService } from '../services/problemService'
import ProblemCard from '../components/ProblemCard'
import { Search, Filter, BookOpen } from 'lucide-react'

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

export default function Problems() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true)
      try {
        const params = {}
        if (difficulty !== 'All') params.difficulty = difficulty
        if (search.trim()) params.search = search.trim()
        const data = await problemService.getProblems(params)
        setProblems(data.data || [])
        setTotal(data.pagination?.total || 0)
      } catch (err) {
        console.error('Failed to fetch problems:', err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchProblems, 300) // debounce search
    return () => clearTimeout(timer)
  }, [difficulty, search])

  const counts = {
    Easy: problems.filter(p => p.difficulty === 'Easy').length,
    Medium: problems.filter(p => p.difficulty === 'Medium').length,
    Hard: problems.filter(p => p.difficulty === 'Hard').length,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Problem Library</h1>
        <p className="text-gray-500">Practice and sharpen your skills. {total} problems available.</p>
      </div>

      {/* Stats pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        <span className="badge-easy">{counts.Easy} Easy</span>
        <span className="badge-medium">{counts.Medium} Medium</span>
        <span className="badge-hard">{counts.Hard} Hard</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            className="input-field pl-9"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-1.5 bg-dark-700 p-1 rounded-lg border border-white/5">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                difficulty === d
                  ? 'bg-accent-purple text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Problems list */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-dark-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-16 card">
          <BookOpen size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">
            {search ? `No problems found for "${search}"` : 'No problems available yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {problems.map((problem, i) => (
            <ProblemCard key={problem._id} problem={problem} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
