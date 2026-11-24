import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { problemService } from '../services/problemService'
import { submissionService } from '../services/submissionService'
import CodeEditor, { DEFAULT_CODE } from '../components/CodeEditor'
import {
  Play, Send, ChevronDown, ChevronUp, CheckCircle2,
  XCircle, AlertCircle, Loader2, Clock, Cpu
} from 'lucide-react'

function VerdictBadge({ verdict }) {
  const styles = {
    'Accepted': 'bg-green-500/15 text-green-400 border-green-500/30',
    'Wrong Answer': 'bg-red-500/15 text-red-400 border-red-500/30',
    'Compilation Error': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    'Runtime Error': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    'Time Limit Exceeded': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    'Internal Error': 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border ${styles[verdict] || styles['Internal Error']}`}>
      {verdict === 'Accepted' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      {verdict}
    </span>
  )
}

export default function ProblemDetails() {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(DEFAULT_CODE['python'])
  const [stdin, setStdin] = useState('')
  const [showStdin, setShowStdin] = useState(false)

  const [runResult, setRunResult] = useState(null)
  const [submitResult, setSubmitResult] = useState(null)
  const [runLoading, setRunLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [activeTab, setActiveTab] = useState('description') // 'description' | 'submissions'

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await problemService.getProblemById(id)
        setProblem(data.data)
        // Set stdin to first sample test case input
        if (data.data.sampleTestCases?.[0]) {
          setStdin(data.data.sampleTestCases[0].input)
        }
      } catch (err) {
        setError('Problem not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchProblem()
  }, [id])

  const handleRun = async () => {
    setRunLoading(true)
    setRunResult(null)
    try {
      const data = await submissionService.runCode({ problemId: id, sourceCode: code, language, stdin })
      setRunResult(data.data)
    } catch (err) {
      setRunResult({ verdict: 'Internal Error', errorOutput: err.response?.data?.message || 'Server error' })
    } finally {
      setRunLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitLoading(true)
    setSubmitResult(null)
    try {
      const data = await submissionService.submitSolution({ problemId: id, sourceCode: code, language })
      setSubmitResult(data.data)
    } catch (err) {
      setSubmitResult({ verdict: 'Internal Error' })
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={32} className="text-accent-purple animate-spin" />
    </div>
  )

  if (error || !problem) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
      <p className="text-gray-400">{error || 'Problem not found.'}</p>
    </div>
  )

  const difficultyClass = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Left — Problem description */}
      <div className="lg:w-[45%] overflow-y-auto border-r border-white/5 bg-dark-800">
        <div className="p-6">
          {/* Problem header */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={difficultyClass[problem.difficulty]}>{problem.difficulty}</span>
            <span className="text-xs bg-dark-600 border border-white/10 text-gray-400 px-2.5 py-1 rounded-full">
              {problem.category}
            </span>
            <div className="flex items-center gap-3 ml-auto text-xs text-gray-500">
              <span className="flex items-center gap-1"><Clock size={11} /> {problem.timeLimit}ms</span>
              <span className="flex items-center gap-1"><Cpu size={11} /> {problem.memoryLimit}MB</span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-white mb-5">{problem.title}</h1>

          {/* Description */}
          <div className="prose prose-sm prose-invert max-w-none mb-6">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
          </div>

          {/* Input/Output format */}
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-1.5">Input Format</h3>
              <p className="text-sm text-gray-400 bg-dark-700 rounded-lg p-3 font-mono whitespace-pre-wrap">{problem.inputFormat}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-1.5">Output Format</h3>
              <p className="text-sm text-gray-400 bg-dark-700 rounded-lg p-3 font-mono whitespace-pre-wrap">{problem.outputFormat}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-1.5">Constraints</h3>
              <p className="text-sm text-gray-400 bg-dark-700 rounded-lg p-3 font-mono whitespace-pre-wrap">{problem.constraints}</p>
            </div>
          </div>

          {/* Examples */}
          {problem.examples?.map((ex, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Example {i + 1}</h3>
              <div className="bg-dark-700 rounded-lg p-4 space-y-2 border border-white/5">
                <div>
                  <span className="text-xs text-gray-500 font-semibold">Input:</span>
                  <pre className="text-sm text-gray-200 mt-1 font-mono">{ex.input}</pre>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold">Output:</span>
                  <pre className="text-sm text-gray-200 mt-1 font-mono">{ex.output}</pre>
                </div>
                {ex.explanation && (
                  <div>
                    <span className="text-xs text-gray-500 font-semibold">Explanation:</span>
                    <p className="text-sm text-gray-400 mt-1">{ex.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Editor + Output */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor */}
        <div className="flex-1 min-h-0">
          <CodeEditor
            language={language}
            onLanguageChange={setLanguage}
            code={code}
            onCodeChange={setCode}
          />
        </div>

        {/* Output panel */}
        <div className="border-t border-white/5 bg-dark-800">
          {/* Controls */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            {/* Custom stdin toggle */}
            <button
              onClick={() => setShowStdin(!showStdin)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showStdin ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              Custom Input
            </button>

            <div className="flex-1" />

            <button
              onClick={handleRun}
              disabled={runLoading || submitLoading}
              className="flex items-center gap-1.5 btn-secondary text-sm py-2 px-4"
            >
              {runLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              Run
            </button>
            <button
              onClick={handleSubmit}
              disabled={runLoading || submitLoading}
              className="flex items-center gap-1.5 btn-primary text-sm py-2 px-4"
            >
              {submitLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Submit
            </button>
          </div>

          {/* Custom stdin */}
          {showStdin && (
            <div className="px-4 py-3 border-b border-white/5">
              <label className="block text-xs text-gray-500 mb-1">Standard Input (stdin)</label>
              <textarea
                className="input-field text-xs font-mono resize-none h-20"
                placeholder="Enter custom input..."
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
              />
            </div>
          )}

          {/* Results */}
          <div className="px-4 py-4 max-h-48 overflow-y-auto">
            {/* Submit result */}
            {submitResult && (
              <div className="mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <VerdictBadge verdict={submitResult.verdict} />
                  {submitResult.testCasesPassed !== undefined && (
                    <span className="text-sm text-gray-400">
                      {submitResult.testCasesPassed}/{submitResult.totalTestCases} test cases passed
                    </span>
                  )}
                </div>
                {submitResult.verdict !== 'Accepted' && submitResult.submission?.errorOutput && (
                  <pre className="text-xs text-red-300 bg-red-500/10 rounded-lg p-3 overflow-x-auto font-mono">
                    {submitResult.submission.errorOutput}
                  </pre>
                )}
              </div>
            )}

            {/* Run result */}
            {runResult && !submitResult && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-400">Run Output</span>
                  {runResult.time && <span className="text-xs text-gray-600">{runResult.time}ms</span>}
                </div>
                {runResult.output ? (
                  <pre className="text-sm text-gray-200 bg-dark-700 rounded-lg p-3 overflow-x-auto font-mono">
                    {runResult.output}
                  </pre>
                ) : runResult.errorOutput ? (
                  <pre className="text-xs text-red-300 bg-red-500/10 rounded-lg p-3 overflow-x-auto font-mono">
                    {runResult.errorOutput}
                  </pre>
                ) : (
                  <p className="text-sm text-gray-500">No output</p>
                )}
              </div>
            )}

            {!runResult && !submitResult && !runLoading && !submitLoading && (
              <p className="text-sm text-gray-600">Run your code to see output here.</p>
            )}

            {(runLoading || submitLoading) && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 size={15} className="animate-spin text-accent-purple" />
                {submitLoading ? 'Evaluating all test cases...' : 'Running your code...'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
