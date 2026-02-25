'use client'

import { ProgressBar } from '@/components/ui/progress-bar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Brain,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const PHASE_LABELS: Record<number, { label: string; color: 'brand' | 'neuro' | 'amber' }> = {
  1: { label: 'Fundamentals', color: 'brand' },
  2: { label: 'Data & Plotting', color: 'neuro' },
  3: { label: 'Signal Processing', color: 'amber' },
  4: { label: 'Neuroscience', color: 'brand' },
  5: { label: 'Real Data', color: 'brand' },
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

interface Profile {
  display_name: string | null
  current_phase: number
  current_lesson: number
}

export function DashboardView({
  lessons,
  progress,
  profile,
  userName,
}: {
  lessons: Lesson[]
  progress: Progress[]
  profile: Profile | null
  userName: string
}) {
  const completedLessons = progress.filter((p) => p.completed).length
  const totalLessons = lessons.length
  const completionPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const totalTimeSeconds = progress.reduce(
    (sum, p) => sum + (p.time_spent_seconds || 0),
    0
  )
  const totalTimeMinutes = Math.round(totalTimeSeconds / 60)

  // Group lessons by phase
  const progressMap = new Map(progress.map((p) => [p.lesson_id, p]))
  const phaseGroups = new Map<number, { total: number; completed: number }>()
  for (const lesson of lessons) {
    const group = phaseGroups.get(lesson.phase) || { total: 0, completed: 0 }
    group.total++
    if (progressMap.get(lesson.id)?.completed) group.completed++
    phaseGroups.set(lesson.phase, group)
  }

  // Find next lesson to work on
  const completedIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.lesson_id)
  )
  const nextLesson = lessons
    .sort((a, b) => a.phase - b.phase || a.order_num - b.order_num)
    .find((l) => !completedIds.has(l.id))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {completedLessons === 0
            ? "You're just getting started — exciting!"
            : completionPercent === 100
              ? 'Congratulations! You have completed all lessons.'
              : `You've completed ${completedLessons} of ${totalLessons} lessons. Keep going!`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="py-4 text-center">
            <BookOpen className="w-5 h-5 mx-auto mb-2 text-brand-500" />
            <p className="text-2xl font-bold">{completedLessons}</p>
            <p className="text-xs text-gray-500">Lessons done</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-neuro-500" />
            <p className="text-2xl font-bold">{completionPercent}%</p>
            <p className="text-xs text-gray-500">Complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">{totalTimeMinutes}</p>
            <p className="text-xs text-gray-500">Minutes spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <Brain className="w-5 h-5 mx-auto mb-2 text-rose-500" />
            <p className="text-2xl font-bold">
              {profile?.current_phase || 1}
            </p>
            <p className="text-xs text-gray-500">Current phase</p>
          </CardContent>
        </Card>
      </div>

      {/* Continue learning card */}
      {nextLesson && (
        <Card className="mb-8 border-brand-200 dark:border-brand-800/40">
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Continue learning
                </p>
                <h3 className="mt-1 text-lg font-semibold">
                  {nextLesson.title}
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  Phase {nextLesson.phase} &middot; Lesson{' '}
                  {nextLesson.order_num}
                </p>
              </div>
              <Link
                href={`/learn/${nextLesson.id}`}
                className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition shadow-sm"
              >
                Open lesson
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phase progress */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold">Progress by Phase</h2>
        </CardHeader>
        <CardContent className="space-y-5">
          {Array.from(phaseGroups.entries())
            .sort(([a], [b]) => a - b)
            .map(([phase, { total, completed }]) => {
              const meta = PHASE_LABELS[phase] || PHASE_LABELS[1]
              return (
                <div key={phase}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">
                      Phase {phase}: {meta.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {completed}/{total}
                    </span>
                  </div>
                  <ProgressBar
                    value={completed}
                    max={total}
                    color={meta.color}
                  />
                </div>
              )
            })}

          {phaseGroups.size === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No lessons available yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Lesson grid */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-sm font-semibold">All Lessons</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {lessons
              .sort((a, b) => a.phase - b.phase || a.order_num - b.order_num)
              .map((lesson) => {
                const completed = progressMap.get(lesson.id)?.completed
                return (
                  <Link
                    key={lesson.id}
                    href={`/learn/${lesson.id}`}
                    className={cn(
                      'aspect-square rounded-lg flex items-center justify-center text-xs font-mono font-medium transition',
                      completed
                        ? 'bg-neuro-100 text-neuro-700 dark:bg-neuro-900/30 dark:text-neuro-400'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                    )}
                    title={lesson.title}
                  >
                    {lesson.phase}.{lesson.order_num}
                  </Link>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
