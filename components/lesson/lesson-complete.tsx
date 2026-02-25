'use client'

import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export function LessonComplete({
  lessonTitle,
  exerciseCount,
  currentLessonId,
}: {
  lessonTitle: string
  exerciseCount: number
  currentLessonId: number
}) {
  const nextId = currentLessonId + 1

  return (
    <div className="mt-8 rounded-xl border-2 border-neuro-200 dark:border-neuro-800/50 bg-neuro-50/50 dark:bg-neuro-950/20 p-6 animate-fade-up">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-6 h-6 text-neuro-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neuro-800 dark:text-neuro-300">
            Lesson Complete!
          </h3>
          <p className="mt-1 text-sm text-neuro-700 dark:text-neuro-400">
            You finished &ldquo;{lessonTitle}&rdquo; &mdash; {exerciseCount}/{exerciseCount} exercises passed.
          </p>
          <Link
            href={`/learn/${nextId}`}
            className="group inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 rounded-lg bg-neuro-600 text-white text-sm font-medium hover:bg-neuro-700 transition shadow-sm"
          >
            Continue to next lesson
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
