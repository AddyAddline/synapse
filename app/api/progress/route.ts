import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProgress, upsertProgress } from '@/lib/supabase/queries'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const progress = await getUserProgress(supabase, user.id)
    return NextResponse.json(progress)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch progress'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    lessonId: number
    completed?: boolean
    score?: number
    time_spent_seconds?: number
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.lessonId) {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })
  }

  try {
    const result = await upsertProgress(supabase, user.id, body.lessonId, {
      completed: body.completed,
      score: body.score,
      time_spent_seconds: body.time_spent_seconds,
    })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update progress'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
