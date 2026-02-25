'use client'

import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, Loader2, Terminal } from 'lucide-react'
import { PlotViewer } from './plot-viewer'
import { friendlyError } from '@/lib/errors/octave-errors'

const SUCCESS_MESSAGES = [
  'You got it!',
  'Nice work!',
  'Brilliant!',
  'Nailed it!',
  'Correct!',
  'Well done!',
]

function getSuccessMessage(exerciseIndex?: number): string {
  const idx = (exerciseIndex ?? Math.floor(Math.random() * SUCCESS_MESSAGES.length)) % SUCCESS_MESSAGES.length
  return SUCCESS_MESSAGES[idx]
}

interface OutputPanelProps {
  stdout: string | null
  stderr: string | null
  compileOutput: string | null
  isRunning: boolean
  isCorrect?: boolean | null
  time?: string | null
  plotImage?: string | null
  isLastExercise?: boolean
  allExercisesDone?: boolean
  exerciseIndex?: number
}

export function OutputPanel({
  stdout,
  stderr,
  compileOutput,
  isRunning,
  isCorrect,
  time,
  plotImage,
  isLastExercise,
  allExercisesDone,
  exerciseIndex,
}: OutputPanelProps) {
  const hasOutput = stdout || stderr || compileOutput || plotImage
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

  // Build friendly error hint
  const errorText = stderr || compileOutput || ''
  const friendlyHint = errorText ? friendlyError(errorText) : null

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
              <CheckCircle2 className="w-5 h-5 text-neuro-500 animate-[pulse_0.5s_ease-in-out]" />
              <div>
                <span className="text-sm font-semibold text-neuro-700 dark:text-neuro-400">
                  {getSuccessMessage(exerciseIndex)}
                </span>
                {isLastExercise && allExercisesDone && (
                  <span className="ml-2 text-xs text-neuro-600 dark:text-neuro-500">
                    Lesson complete! Ready for the next one?
                  </span>
                )}
              </div>
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

      {/* Plot */}
      {plotImage && (
        <div className="mb-3">
          <PlotViewer src={plotImage} />
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

      {/* Friendly error hint */}
      {friendlyHint && friendlyHint !== errorText && (
        <div className="mt-3 pt-3 border-t border-red-200/60 dark:border-red-800/40">
          <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
            <span className="font-medium">Hint:</span> {friendlyHint}
          </p>
        </div>
      )}
    </div>
  )
}
