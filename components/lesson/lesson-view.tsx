'use client'

import { useState, useCallback } from 'react'
import { LessonContent } from './lesson-content'
import { ExerciseCard } from './exercise-card'
import { TutorChat } from '@/components/chat/tutor-chat'
import { LessonNav } from './lesson-nav'
import { LessonComplete } from './lesson-complete'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Lesson {
  id: number
  phase: number
  order_num: number
  title: string
  content_md: string
}

interface Exercise {
  id: number
  lesson_id: number
  order_num: number
  title: string
  prompt: string
  starter_code: string
  hints: string[]
  test_cases: { expected_output: string }[]
  requires_plot: boolean
}

export function LessonView({
  lesson,
  exercises,
  userId,
  previouslyCorrect = [],
}: {
  lesson: Lesson
  exercises: Exercise[]
  userId: string
  previouslyCorrect?: number[]
}) {
  const [chatOpen, setChatOpen] = useState(false)
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    () => new Set(previouslyCorrect)
  )
  const [lessonMarkedComplete, setLessonMarkedComplete] = useState(
    () => previouslyCorrect.length > 0 && previouslyCorrect.length === exercises.length
  )

  const allExercisesDone = exercises.length > 0 && completedExercises.size === exercises.length

  const handleExerciseCorrect = useCallback((exerciseId: number) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev)
      next.add(exerciseId)

      // When all exercises are done, mark lesson as complete
      if (next.size === exercises.length && !lessonMarkedComplete) {
        setLessonMarkedComplete(true)
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId: lesson.id,
            completed: true,
            score: 100,
          }),
        }).catch(() => {
          // Silently fail — progress will be retried next time
        })
      }

      return next
    })
  }, [exercises.length, lesson.id, lessonMarkedComplete])

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Lesson header */}
          <div className="mb-8">
            <span className="text-xs font-mono text-gray-400 tracking-wider uppercase">
              Phase {lesson.phase} &middot; Lesson {lesson.order_num}
            </span>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl tracking-tight">
              {lesson.title}
            </h1>
          </div>

          {/* Lesson content (markdown) */}
          <LessonContent content={lesson.content_md} />

          {/* Exercises */}
          {exercises.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold mb-4">Exercises</h2>
              <div className="space-y-6">
                {exercises.map((ex, i) => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    lessonId={lesson.id}
                    exerciseIndex={i}
                    isLastExercise={i === exercises.length - 1}
                    allExercisesDone={allExercisesDone}
                    onCorrect={handleExerciseCorrect}
                    initialCorrect={completedExercises.has(ex.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Lesson complete banner */}
          {allExercisesDone && (
            <LessonComplete
              lessonTitle={lesson.title}
              exerciseCount={exercises.length}
              currentLessonId={lesson.id}
            />
          )}

          {/* Navigation */}
          <LessonNav currentLessonId={lesson.id} />
        </div>
      </div>

      {/* Chat panel */}
      <div
        className={cn(
          'border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300 flex flex-col',
          chatOpen ? 'w-96' : 'w-0'
        )}
      >
        {chatOpen && (
          <TutorChat lessonId={lesson.id} lessonTitle={lesson.title} />
        )}
      </div>

      {/* Chat toggle button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all',
          chatOpen
            ? 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-600/30'
        )}
      >
        {chatOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>
    </div>
  )
}
