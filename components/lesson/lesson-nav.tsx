'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function LessonNav({ currentLessonId }: { currentLessonId: number }) {
  const prevId = currentLessonId > 1 ? currentLessonId - 1 : null
  const nextId = currentLessonId + 1

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
      {prevId ? (
        <Link
          href={`/learn/${prevId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous lesson
        </Link>
      ) : (
        <div />
      )}
      <Link
        href={`/learn/${nextId}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition"
      >
        Next lesson
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
