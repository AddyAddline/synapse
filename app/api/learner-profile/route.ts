import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLearnerProfile, getLearnerStats } from '@/lib/supabase/queries'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [profile, stats] = await Promise.all([
      getLearnerProfile(supabase, user.id),
      getLearnerStats(supabase, user.id),
    ])

    return NextResponse.json({
      profile: profile || {
        summary: '',
        comfort_level: 'beginner',
        exercises_attempted: 0,
        exercises_passed: 0,
      },
      stats,
    })
  } catch {
    return NextResponse.json({
      profile: {
        summary: '',
        comfort_level: 'beginner',
        exercises_attempted: 0,
        exercises_passed: 0,
      },
      stats: { attempted: 0, passed: 0, passRate: 0, recentStruggles: [] },
    })
  }
}
