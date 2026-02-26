'use client'

import { useState, useCallback, useEffect } from 'react'
import { CodeEditor } from '@/components/code-editor/editor'
import { OutputPanel } from '@/components/code-editor/output-panel'
import { Play, Lightbulb, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface Exercise {
  id: number
  order_num: number
  title: string
  prompt: string
  starter_code: string
  hints: string[]
  test_cases: { expected_output: string }[]
  requires_plot: boolean
}

export function ExerciseCard({
  exercise,
  lessonId,
  exerciseIndex,
  isLastExercise,
  allExercisesDone,
  onCorrect,
}: {
  exercise: Exercise
  lessonId: number
  exerciseIndex: number
  isLastExercise: boolean
  allExercisesDone: boolean
  onCorrect?: (exerciseId: number) => void
}) {
  const [code, setCode] = useState(exercise.starter_code)
  const [output, setOutput] = useState<{
    stdout: string | null
    stderr: string | null
    compile_output: string | null
    time: string | null
    plotImage?: string | null
  } | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [hintLevel, setHintLevel] = useState(-1)
  const [currentHint, setCurrentHint] = useState<string | null>(null)

  // Notify parent when exercise is solved
  useEffect(() => {
    if (isCorrect === true && onCorrect) {
      onCorrect(exercise.id)
    }
  }, [isCorrect, exercise.id, onCorrect])

  const handleRun = useCallback(async () => {
    setIsRunning(true)
    setIsCorrect(null)

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          exerciseId: exercise.id,
          requiresPlot: exercise.requires_plot,
        }),
      })

      const data = await res.json()

      if (data.error && !data.stdout && !data.stderr) {
        setOutput({
          stdout: null,
          stderr: data.error,
          compile_output: null,
          time: null,
          plotImage: null,
        })
        setIsCorrect(false)
      } else {
        setOutput({
          stdout: data.stdout,
          stderr: data.stderr,
          compile_output: data.compile_output,
          time: data.time,
          plotImage: data.plotImage,
        })

        // Check correctness against test cases
        if (exercise.test_cases.length > 0 && data.stdout) {
          const normalize = (s: string) =>
            s.split('\n').map(line => line.trim()).filter(Boolean).join('\n')
          const expected = normalize(exercise.test_cases[0].expected_output)
          const actual = normalize(data.stdout)
          setIsCorrect(actual === expected)
        } else if (exercise.requires_plot) {
          // Plot exercise: correct ONLY if it ran AND produced a plot
          setIsCorrect(data.status?.id === 3 && !!data.plotImage)
        } else if (data.stderr || data.compile_output) {
          setIsCorrect(false)
        } else if (data.status?.id === 3) {
          setIsCorrect(true)
        }
      }
    } catch {
      setOutput({
        stdout: null,
        stderr: 'Failed to connect to code execution service',
        compile_output: null,
        time: null,
        plotImage: null,
      })
      setIsCorrect(false)
    }

    setIsRunning(false)
  }, [code, exercise.id, exercise.requires_plot, exercise.test_cases])

  const handleHint = () => {
    const nextLevel = hintLevel + 1
    if (nextLevel < exercise.hints.length) {
      setHintLevel(nextLevel)
      setCurrentHint(exercise.hints[nextLevel])
    }
  }

  const handleReset = () => {
    setCode(exercise.starter_code)
    setOutput(null)
    setIsCorrect(null)
    setHintLevel(-1)
    setCurrentHint(null)
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400">
            Ex {exercise.order_num}
          </span>
          <h3 className="text-sm font-semibold">{exercise.title}</h3>
          {isCorrect === true && (
            <span className="text-xs text-neuro-600 dark:text-neuro-400 font-medium">Solved</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {exercise.hints.length > 0 && (
            <button
              onClick={handleHint}
              disabled={hintLevel >= exercise.hints.length - 1}
              className="p-1.5 rounded-md text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition disabled:opacity-30"
              title={
                hintLevel >= exercise.hints.length - 1
                  ? 'No more hints'
                  : 'Get a hint'
              }
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Prompt */}
      <div className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-b border-gray-100 dark:border-gray-800 prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ol:my-1 prose-ul:my-1 prose-li:my-0.5 prose-code:text-brand-600 prose-code:bg-brand-50 dark:prose-code:bg-brand-950/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none">
        <ReactMarkdown>{exercise.prompt}</ReactMarkdown>
      </div>

      {/* Hint */}
      {currentHint && (
        <div className="px-5 py-3 bg-amber-50/60 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/30">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-medium">
                Hint {hintLevel + 1}/{exercise.hints.length}:
              </span>{' '}
              {currentHint}
            </p>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="p-4">
        <CodeEditor
          defaultValue={exercise.starter_code}
          onChange={setCode}
          onRun={handleRun}
          height="180px"
        />

        {/* Run button */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition',
              'bg-neuro-600 text-white hover:bg-neuro-700 disabled:opacity-50 shadow-sm'
            )}
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <span className="text-xs text-gray-400">
            or press Ctrl+Enter
          </span>
        </div>

        {/* Output */}
        <div className="mt-3">
          <OutputPanel
            stdout={output?.stdout ?? null}
            stderr={output?.stderr ?? null}
            compileOutput={output?.compile_output ?? null}
            isRunning={isRunning}
            isCorrect={isCorrect}
            time={output?.time}
            plotImage={output?.plotImage}
            isLastExercise={isLastExercise}
            allExercisesDone={allExercisesDone}
            exerciseIndex={exerciseIndex}
          />
        </div>
      </div>
    </div>
  )
}
