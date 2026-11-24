import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBattleSocket } from '../hooks/useBattleSocket'
import { battleService } from '../services/battleService'
import { submissionService } from '../services/submissionService'
import CodeEditor, { DEFAULT_CODE } from '../components/CodeEditor'
import Timer from '../components/Timer'
import { useSkyrocket } from '../hooks/useSkyrocket'
import {
  Swords, Circle, CheckCircle2, XCircle, Loader2, Wifi, WifiOff,
  Send, User, AlertCircle
} from 'lucide-react'

export default function BattleRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()

  // Battle state
  const [match, setMatch] = useState(null)
  const [problem, setProblem] = useState(null)
  const [status, setStatus] = useState('loading') // loading|waiting|ready|active|finished
  const [players, setPlayers] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [result, setResult] = useState(null)

  // Editor state
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(DEFAULT_CODE['python'])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)

  // Error / messages
  const [error, setError] = useState('')
  const [notification, setNotification] = useState('')

  const isReady = useRef(false)
  const { fireWin, fireDraw } = useSkyrocket()

  // Socket event handlers
  const handlers = useCallback(() => ({
    room_joined: (data) => {
      setPlayers(data.players || [])
      setStatus(data.status)
    },
    player_connected: ({ username }) => {
      setNotification(`${username} connected`)
      setTimeout(() => setNotification(''), 3000)
    },
    player_disconnected: ({ username }) => {
      setNotification(`⚠️ ${username} disconnected`)
      setPlayers(prev => prev.map(p =>
        p.username === username ? { ...p, isConnected: false } : p
      ))
    },
    player_ready_update: ({ players: updatedPlayers }) => {
      setPlayers(updatedPlayers)
    },
    battle_started: ({ problem: p, timeRemaining: tr, players: pl }) => {
      setProblem(p)
      setTimeRemaining(tr)
      setPlayers(pl || [])
      setStatus('active')
    },
    timer_update: ({ timeRemaining: tr }) => {
      setTimeRemaining(tr)
    },
    battle_finished: (data) => {
      setStatus('finished')
      setResult(data)
      // 🚀 Skyrocket celebration
      if (data.result === 'draw') {
        fireDraw()
      } else if (data.winner) {
        const winnerId = data.winner?._id?.toString() || data.winner?.toString()
        if (winnerId === user?._id?.toString()) {
          fireWin()
        }
      }
      setTimeout(() => navigate(`/results/${id}`), 3000)
    },
    error: ({ message }) => {
      setError(message)
    },
    auth_error: () => {
      setError('Authentication error. Please log in again.')
    },
  }), [id, navigate, user, fireWin, fireDraw])

  const { joinRoom, setReady } = useBattleSocket(token, handlers())

  // Fetch match and join socket room on mount
  useEffect(() => {
    const init = async () => {
      try {
        const data = await battleService.getBattleById(id)
        setMatch(data.data)
        setStatus(data.data.status)
        setPlayers(data.data.players || [])

        // Join socket room
        joinRoom(data.data.roomCode)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load battle room.')
        setStatus('error')
      }
    }
    init()
  }, [id])

  const handleReady = () => {
    if (!match) return
    isReady.current = true
    setReady(match.roomCode)
  }

  const handleSubmit = async () => {
    if (!problem || submitLoading) return
    setSubmitLoading(true)
    setSubmitResult(null)
    try {
      const data = await submissionService.submitSolution({
        problemId: problem._id,
        sourceCode: code,
        language,
        matchId: id,
      })
      setSubmitResult(data.data)
      if (data.data.verdict === 'Accepted') {
        setNotification('✅ Solution accepted! You win!')
      } else {
        setNotification(`❌ ${data.data.verdict} — ${data.data.testCasesPassed}/${data.data.totalTestCases} passed`)
        setTimeout(() => setNotification(''), 4000)
      }
    } catch (err) {
      setSubmitResult({ verdict: 'Internal Error' })
    } finally {
      setSubmitLoading(false)
    }
  }

  const myPlayer = players.find(p => {
    const uid = p.user?._id || p.user
    return uid?.toString() === user?._id?.toString()
  })
  const opponent = players.find(p => {
    const uid = p.user?._id || p.user
    return uid?.toString() !== user?._id?.toString()
  })

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 size={36} className="text-accent-purple animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Connecting to battle room...</p>
        </div>
      </div>
    )
  }

  if (status === 'error' || error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="card max-w-md w-full text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-red-400 mb-4">{error || 'Something went wrong.'}</p>
          <button onClick={() => navigate('/battles/create')} className="btn-secondary">
            Back to Battles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Battle header */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-white/5 shrink-0">
        {/* Players */}
        <div className="flex items-center gap-6">
          <PlayerStatus player={myPlayer} label="You" isYou />
          <Swords size={18} className="text-accent-purple-light" />
          <PlayerStatus player={opponent} label={opponent?.username || 'Waiting...'} />
        </div>

        {/* Timer */}
        {status === 'active' && <Timer timeRemaining={timeRemaining} />}

        {/* Problem info */}
        {problem && (
          <div className="hidden md:block text-right">
            <p className="text-xs text-gray-500">Problem</p>
            <p className="text-sm font-semibold text-gray-200 max-w-[180px] truncate">{problem.title}</p>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className="bg-accent-purple/20 border-b border-accent-purple/30 text-accent-purple-light text-sm text-center py-2 px-4">
          {notification}
        </div>
      )}

      {/* Waiting / Ready screen */}
      {(status === 'waiting' || status === 'ready') && (
        <div className="flex-1 flex items-center justify-center">
          <div className="card max-w-md w-full text-center">
            <div className="mb-6">
              <Swords size={48} className="text-accent-purple-light mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {status === 'waiting' ? 'Waiting for opponent...' : 'Opponent joined!'}
              </h2>
              <p className="text-gray-400 text-sm">
                {status === 'waiting'
                  ? `Share room code: `
                  : 'Both players must click Ready to start the battle.'}
              </p>
              {status === 'waiting' && match && (
                <span className="inline-block font-mono text-2xl font-bold tracking-widest text-accent-purple-light mt-1">
                  {match.roomCode}
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {players.map((p) => {
                const isMe = (p.user?._id || p.user)?.toString() === user?._id?.toString()
                return (
                  <div key={p.username} className="flex items-center justify-between bg-dark-700 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-accent-purple/25 flex items-center justify-center text-xs font-bold text-accent-purple-light">
                        {p.username[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-200">
                        {p.username} {isMe && '(you)'}
                      </span>
                    </div>
                    {p.isReady
                      ? <span className="text-xs text-green-400 font-semibold flex items-center gap-1"><CheckCircle2 size={13} /> Ready</span>
                      : <span className="text-xs text-gray-500">Not ready</span>
                    }
                  </div>
                )
              })}
            </div>

            {!myPlayer?.isReady && status === 'ready' && (
              <button onClick={handleReady} className="btn-primary w-full py-3">
                I'm Ready!
              </button>
            )}

            {myPlayer?.isReady && (
              <p className="text-green-400 text-sm flex items-center justify-center gap-2">
                <CheckCircle2 size={15} /> Waiting for opponent to ready up...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Active battle */}
      {status === 'active' && problem && (
        <div className="flex flex-1 overflow-hidden">
          {/* Problem panel */}
          <div className="w-[42%] overflow-y-auto border-r border-white/5 p-5 bg-dark-800">
            <h2 className="text-lg font-bold text-white mb-3">{problem.title}</h2>
            <div className="flex gap-2 mb-4">
              <span className={`badge-${problem.difficulty?.toLowerCase()}`}>{problem.difficulty}</span>
              <span className="text-xs text-gray-500 bg-dark-700 px-2.5 py-1 rounded-full">{problem.category}</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">{problem.description}</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Input Format</p>
                <p className="text-xs text-gray-400 bg-dark-700 rounded-lg p-2.5 font-mono whitespace-pre-wrap">{problem.inputFormat}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Output Format</p>
                <p className="text-xs text-gray-400 bg-dark-700 rounded-lg p-2.5 font-mono whitespace-pre-wrap">{problem.outputFormat}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Constraints</p>
                <p className="text-xs text-gray-400 bg-dark-700 rounded-lg p-2.5 font-mono whitespace-pre-wrap">{problem.constraints}</p>
              </div>
              {problem.examples?.map((ex, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Example {i + 1}</p>
                  <div className="bg-dark-700 rounded-lg p-2.5 space-y-1">
                    <pre className="text-xs text-gray-300 font-mono">Input: {ex.input}</pre>
                    <pre className="text-xs text-gray-300 font-mono">Output: {ex.output}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0">
              <CodeEditor language={language} onLanguageChange={setLanguage} code={code} onCodeChange={setCode} />
            </div>

            {/* Submit bar */}
            <div className="border-t border-white/5 bg-dark-800 px-4 py-3 flex items-center gap-4">
              {submitResult && (
                <div className="flex items-center gap-2 text-sm">
                  {submitResult.verdict === 'Accepted'
                    ? <CheckCircle2 size={15} className="text-green-400" />
                    : <XCircle size={15} className="text-red-400" />}
                  <span className={submitResult.verdict === 'Accepted' ? 'text-green-400' : 'text-red-400'}>
                    {submitResult.verdict}
                  </span>
                  {submitResult.testCasesPassed !== undefined && (
                    <span className="text-gray-500 text-xs">
                      ({submitResult.testCasesPassed}/{submitResult.totalTestCases})
                    </span>
                  )}
                </div>
              )}
              <div className="flex-1" />
              <button
                onClick={handleSubmit}
                disabled={submitLoading || myPlayer?.hasSubmitted}
                className="btn-primary flex items-center gap-2 py-2.5"
              >
                {submitLoading
                  ? <><Loader2 size={15} className="animate-spin" /> Evaluating...</>
                  : myPlayer?.hasSubmitted
                  ? <><CheckCircle2 size={15} /> Submitted</>
                  : <><Send size={15} /> Submit Solution</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finished overlay */}
      {status === 'finished' && result && (
        <div className="flex-1 flex items-center justify-center bg-dark-900/80">
          <div className="card max-w-md w-full text-center">
            <Swords size={40} className="text-accent-purple-light mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Battle Finished!</h2>
            <p className="text-gray-400 mb-4">
              {result.result === 'draw' ? 'It\'s a draw!' : `Winner determined!`}
            </p>
            <p className="text-sm text-gray-500">Redirecting to results...</p>
          </div>
        </div>
      )}
    </div>
  )
}

function PlayerStatus({ player, label, isYou = false }) {
  if (!player) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-dark-600 border border-white/10 flex items-center justify-center">
          <User size={15} className="text-gray-600" />
        </div>
        <div>
          <p className="text-xs text-gray-600">{label}</p>
          <p className="text-sm text-gray-600">—</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-accent-purple/25 border border-accent-purple/30 flex items-center justify-center">
          <span className="text-sm font-bold text-accent-purple-light">
            {player.username[0].toUpperCase()}
          </span>
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-dark-800 ${
          player.isConnected ? 'bg-green-400' : 'bg-gray-600'
        }`} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{isYou ? 'You' : 'Opponent'}</p>
        <p className="text-sm font-semibold text-gray-200">
          {player.username}
          {player.hasSubmitted && player.submissionVerdict === 'Accepted' && (
            <CheckCircle2 size={12} className="inline ml-1 text-green-400" />
          )}
        </p>
      </div>
    </div>
  )
}
