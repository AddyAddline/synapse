'use client'

import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, Loader2, Terminal } from 'lucide-react'

interface OutputPanelProps {
  stdout: string | null
  stderr: string | null
  compileOutput: string | null
  isRunning: boolean
  isCorrect?: boolean | null
  time?: string | null
}

export function OutputPanel({
  stdout,
  stderr,
  compileOutput,
  isRunning,
  isCorrect,
  time,
}: OutputPanelProps) {
  const hasOutput = stdout || stderr || compileOutput
  const hasError = stderr || compileOutput

  if (isRunning) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Running your code...
        </div>
      </div>
    )
  }

  if (!hasOutput) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Terminal className="w-4 h-4" />
          Output will appear here. Press Ctrl+Enter or click Run.
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        hasError
          ? 'border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20'
          : isCorrect
            ? 'border-neuro-200 dark:border-neuro-900/40 bg-neuro-50/50 dark:bg-neuro-950/20'
            : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'
      )}
    >
      {/* Status */}
      {isCorrect !== null && isCorrect !== undefined && (
        <div className="flex items-center gap-2 mb-3">
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-neuro-500" />
              <span className="text-sm font-medium text-neuro-700 dark:text-neuro-400">
                Correct!
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                Not quite — check the output and try again
              </span>
            </>
          )}
          {time && (
            <span className="ml-auto text-xs text-gray-400">
              {time}s
            </span>
          )}
        </div>
      )}

      {/* Output */}
      <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
        {compileOutput && (
          <span className="text-red-600 dark:text-red-400">
            {compileOutput}
          </span>
        )}
        {stderr && (
          <span className="text-red-600 dark:text-red-400">{stderr}</span>
        )}
        {stdout && (
          <span className="text-gray-800 dark:text-gray-200">{stdout}</span>
        )}
      </pre>
    </div>
  )
}
