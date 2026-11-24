import Editor from '@monaco-editor/react'
import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

const DEFAULT_CODE = {
  python: `# Write your solution here
import sys
input = sys.stdin.readline

def solve():
    pass

solve()
`,
  javascript: `// Write your solution here
const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
let idx = 0;

function solve() {
    // your code here
}

solve();
`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
    }
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Write your solution here
    
    return 0;
}
`,
}

const LANGUAGE_OPTIONS = [
  { value: 'python', label: 'Python 3' },
  { value: 'javascript', label: 'JavaScript (Node.js)' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
]

const MONACO_LANG = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'cpp',
}

export default function CodeEditor({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  readOnly = false,
}) {
  const handleReset = () => {
    if (window.confirm('Reset code to default template?')) {
      onCodeChange(DEFAULT_CODE[language])
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-dark-700 border-b border-white/5">
        <select
          value={language}
          onChange={(e) => {
            onLanguageChange(e.target.value)
            onCodeChange(DEFAULT_CODE[e.target.value])
          }}
          disabled={readOnly}
          className="bg-dark-600 border border-white/10 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent-purple cursor-pointer disabled:opacity-60"
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {!readOnly && (
          <button
            onClick={handleReset}
            title="Reset to default"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-white/5"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={MONACO_LANG[language]}
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            tabSize: 4,
            wordWrap: 'on',
            readOnly,
            padding: { top: 12, bottom: 12 },
            smoothScrolling: true,
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </div>
    </div>
  )
}

// Export defaults so other components can initialize code
export { DEFAULT_CODE, LANGUAGE_OPTIONS }
