import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { exerciseId: number; hintLevel: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { exerciseId, hintLevel } = body

  if (!exerciseId || hintLevel === undefined) {
    return NextResponse.json(
      { error: 'exerciseId and hintLevel are required' },
      { status: 400 }
    )
  }

  try {
    const { data: exercise, error } = await supabase
      .from('exercises')
      .select('hints')
      .eq('id', exerciseId)
      .single()

    if (error) throw error
    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
    }

    const hints = (exercise.hints as string[]) || []
    const maxLevel = hints.length - 1

    if (hintLevel < 0 || hintLevel > maxLevel) {
      return NextResponse.json(
        { error: `Hint level must be between 0 and ${maxLevel}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      hint: hints[hintLevel],
      currentLevel: hintLevel,
      maxLevel,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch hint'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
