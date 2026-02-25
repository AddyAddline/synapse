import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLesson, getLessonExercises } from '@/lib/supabase/queries'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const lessonId = parseInt(params.id, 10)

  if (isNaN(lessonId)) {
    return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 })
  }

  try {
    const [lesson, exercises] = await Promise.all([
      getLesson(supabase, lessonId),
      getLessonExercises(supabase, lessonId),
    ])

    return NextResponse.json({ lesson, exercises })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch lesson'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
