import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { battleService } from '../services/battleService'
import { Swords, AlertCircle, Copy, CheckCircle2 } from 'lucide-react'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const DURATIONS = [15, 30, 45, 60]

export default function CreateBattle() {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState('Medium')
  const [duration, setDuration] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)
  const [copied, setCopied] = useState(false)

  // Tab: create | join
  const [tab, setTab] = useState('create')
  const [roomCode, setRoomCode] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await battleService.createBattle(difficulty, duration)
      setCreated(data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create battle')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    setJoinLoading(true)
    setJoinError('')
    try {
      const data = await battleService.joinBattle(roomCode)
      navigate(`/battle/${data.data.matchId}`)
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Failed to join battle')
    } finally {
      setJoinLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(created.roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const difficultyColors = {
    Easy: 'border-green-500/40 bg-green-500/10 text-green-400',
    Medium: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
    Hard: 'border-red-500/40 bg-red-500/10 text-red-400',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-purple/20 rounded-2xl mb-4">
          <Swords size={28} className="text-accent-purple-light" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">Coding Battles</h1>
        <p className="text-gray-500">Create a room or join an existing one with a room code.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-700 p-1 rounded-xl mb-6 border border-white/5">
        {['create', 'join'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 capitalize ${
              tab === t ? 'bg-accent-purple text-white' : 'text-gray-500 hover:text-gray-300'
            }`}>
            {t === 'create' ? 'Create Battle' : 'Join Battle'}
          </button>
        ))}
      </div>

      {/* Create tab */}
      {tab === 'create' && (
        <div className="card">
          {created ? (
            /* Room created state */
            <div className="text-center py-4">
              <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Battle Room Created!</h2>
              <p className="text-gray-400 mb-6">Share this code with your opponent to start the battle.</p>

              <div className="bg-dark-700 border border-white/10 rounded-xl p-6 mb-6">
                <p className="text-xs text-gray-500 mb-2">Room Code</p>
                <p className="text-5xl font-bold font-mono tracking-widest text-accent-purple-light mb-4">
                  {created.roomCode}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                  <span className={`badge-${created.difficulty.toLowerCase()}`}>{created.difficulty}</span>
                  <span>•</span>
                  <span>{created.duration} minutes</span>
                </div>
                <button onClick={copyCode}
                  className={`flex items-center gap-2 mx-auto text-sm px-5 py-2.5 rounded-lg transition-all duration-200 ${
                    copied ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'btn-secondary'
                  }`}>
                  {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <button onClick={() => navigate(`/battle/${created.matchId}`)}
                className="btn-primary w-full py-3">
                Enter Battle Room
              </button>
            </div>
          ) : (
            /* Create form */
            <form onSubmit={handleCreate} className="space-y-6">
              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Difficulty</label>
                <div className="grid grid-cols-3 gap-3">
                  {DIFFICULTIES.map((d) => (
                    <button key={d} type="button" onClick={() => setDifficulty(d)}
                      className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                        difficulty === d
                          ? difficultyColors[d]
                          : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Battle Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {DURATIONS.map((d) => (
                    <button key={d} type="button" onClick={() => setDuration(d)}
                      className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                        duration === d
                          ? 'border-accent-purple bg-accent-purple/20 text-accent-purple-light'
                          : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                      }`}>
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Room...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Swords size={17} />
                    Create Battle Room
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Join tab */}
      {tab === 'join' && (
        <div className="card">
          <form onSubmit={handleJoin} className="space-y-5">
            {joinError && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                {joinError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Room Code</label>
              <input
                type="text"
                className="input-field text-center text-2xl font-mono tracking-widest uppercase py-4"
                placeholder="XXXXXX"
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                required
                autoFocus
              />
              <p className="text-xs text-gray-600 mt-1.5 text-center">Enter the 6-character code shared by the battle creator.</p>
            </div>

            <button type="submit" disabled={joinLoading || roomCode.length < 6} className="btn-primary w-full py-3.5">
              {joinLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Joining...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Swords size={17} />
                  Join Battle
                </span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
