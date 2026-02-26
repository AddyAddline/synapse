import { createClient } from '@/lib/supabase/server'
import { getLesson, getLessonExercises, getCorrectExerciseIds } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import { LessonView } from '@/components/lesson/lesson-view'

export default async function LessonPage({
  params,
}: {
  params: { lessonId: string }
}) {
  const lessonId = parseInt(params.lessonId, 10)
  if (isNaN(lessonId)) redirect('/learn')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  let lesson = null
  let exercises: Awaited<ReturnType<typeof getLessonExercises>> = []
  let previouslyCorrect: number[] = []

  try {
    lesson = await getLesson(supabase, lessonId)
    exercises = await getLessonExercises(supabase, lessonId)
    previouslyCorrect = await getCorrectExerciseIds(
      supabase,
      user.id,
      exercises.map((e) => e.id)
    )
  } catch {
    redirect('/learn')
  }

  if (!lesson) redirect('/learn')

  return (
    <LessonView
      lesson={lesson}
      exercises={exercises}
      userId={user.id}
      previouslyCorrect={previouslyCorrect}
    />
  )
}
