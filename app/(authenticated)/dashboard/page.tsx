import { createClient } from '@/lib/supabase/server'
import { getLessons, getUserProgress, getProfile } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import { DashboardView } from '@/components/dashboard/dashboard-view'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  let lessons: Awaited<ReturnType<typeof getLessons>> = []
  let progress: Awaited<ReturnType<typeof getUserProgress>> = []
  let profile: Awaited<ReturnType<typeof getProfile>> | null = null

  try {
    lessons = await getLessons(supabase)
    progress = await getUserProgress(supabase, user.id)
    profile = await getProfile(supabase, user.id)
  } catch {
    // Tables may not exist yet
  }

  return (
    <DashboardView
      lessons={lessons}
      progress={progress}
      profile={profile}
      userName={
        profile?.display_name ||
        user.user_metadata?.display_name ||
        user.email?.split('@')[0] ||
        'Learner'
      }
    />
  )
}
