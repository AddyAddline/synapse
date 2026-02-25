'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, Lock, Clock, ChevronRight } from 'lucide-react'

const PHASE_META: Record<
  number,
  { label: string; color: string; bg: string; border: string }
> = {
  1: {
    label: 'Fundamentals',
    color: 'text-brand-600',
    bg: 'bg-brand-50 dark:bg-brand-950/30',
    border: 'border-brand-200 dark:border-brand-800',
  },
  2: {
    label: 'Data & Plotting',
    color: 'text-neuro-600',
    bg: 'bg-neuro-50 dark:bg-neuro-950/30',
    border: 'border-neuro-200 dark:border-neuro-800',
  },
  3: {
    label: 'Signal Processing',
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
  },
  4: {
    label: 'Neuroscience',
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
  },
}

interface Lesson {
  id: number
  phase: number
  order_num: number
  title: string
  description: string | null
  difficulty: string
  estimated_minutes: number | null
}

interface Progress {
  lesson_id: number
  completed: boolean
  score: number
  time_spent_seconds: number
  completed_at: string | null
}

export function LessonGrid({
  lessons,
  progress,
}: {
  lessons: Lesson[]
  progress: Progress[]
}) {
  const progressMap = new Map(progress.map((p) => [p.lesson_id, p]))

  // Group by phase
  const phases = new Map<number, Lesson[]>()
  for (const lesson of lessons) {
    const group = phases.get(lesson.phase) || []
    group.push(lesson)
    phases.set(lesson.phase, group)
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Lock className="w-7 h-7 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold">No lessons yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Lessons will appear here once the curriculum is set up in the database.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {Array.from(phases.entries())
        .sort(([a], [b]) => a - b)
        .map(([phase, phaseLessons]) => {
          const meta = PHASE_META[phase] || PHASE_META[1]
          return (
            <section key={phase}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={cn(
                    'text-xs font-mono font-medium tracking-wider uppercase px-2.5 py-1 rounded-md',
                    meta.bg,
                    meta.color
                  )}
                >
                  Phase {String(phase).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {meta.label}
                </span>
              </div>

              <div className="space-y-2">
                {phaseLessons
                  .sort((a, b) => a.order_num - b.order_num)
                  .map((lesson) => {
                    const prog = progressMap.get(lesson.id)
                    const completed = prog?.completed ?? false

                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${lesson.id}`}
                        className={cn(
                          'group flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all',
                          completed
                            ? 'border-neuro-200 dark:border-neuro-900/40 bg-neuro-50/50 dark:bg-neuro-950/20'
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm bg-white dark:bg-gray-900/50'
                        )}
                      >
                        <div className="shrink-0">
                          {completed ? (
                            <CheckCircle2 className="w-5 h-5 text-neuro-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-400">
                              {String(lesson.phase)}.{String(lesson.order_num)}
                            </span>
                            <h3 className="text-sm font-semibold truncate">
                              {lesson.title}
                            </h3>
                          </div>
                          {lesson.description && (
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                        {lesson.estimated_minutes && (
                          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400 shrink-0">
                            <Clock className="w-3 h-3" />
                            {lesson.estimated_minutes}m
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 transition shrink-0" />
                      </Link>
                    )
                  })}
              </div>
            </section>
          )
        })}
    </div>
  )
}
