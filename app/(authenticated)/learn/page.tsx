import { createClient } from '@/lib/supabase/server'
import { getLessons, getUserProgress } from '@/lib/supabase/queries'
import { LessonGrid } from '@/components/lesson/lesson-grid'

export default async function LearnPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let lessons: Awaited<ReturnType<typeof getLessons>> = []
  let progress: Awaited<ReturnType<typeof getUserProgress>> = []

  try {
    lessons = await getLessons(supabase)
    if (user) {
      progress = await getUserProgress(supabase, user.id)
    }
  } catch {
    // Tables may not exist yet — show empty state
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight">
          Your Lessons
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Work through each phase at your own pace. Every lesson builds on the
          last.
        </p>
      </div>
      <LessonGrid lessons={lessons} progress={progress} />
    </div>
  )
}
