import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { executeCode } from '@/lib/judge0/client'

export async function POST(request: NextRequest) {
  // Verify authentication
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse request body
  let body: { code: string; exerciseId?: number; requiresPlot?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { code, exerciseId, requiresPlot } = body

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 })
  }

  try {
    const result = await executeCode(code, { requiresPlot })

    // Store the attempt if linked to an exercise
    if (exerciseId) {
      const isCorrect = result.status.id === 3 // Accepted
      await supabase.from('user_attempts').insert({
        user_id: user.id,
        exercise_id: exerciseId,
        code,
        output: result.stdout || result.stderr || result.compile_output || '',
        correct: isCorrect,
      })
    }

    return NextResponse.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      status: result.status,
      time: result.time,
      memory: result.memory,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Code execution failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
