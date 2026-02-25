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

    // Extract plot image if present
    let plotImage: string | null = null
    if (result.stdout?.includes('__PLOT_BASE64_START__')) {
      const match = result.stdout.match(/__PLOT_BASE64_START__\n([\s\S]*?)\n__PLOT_BASE64_END__/)
      if (match) {
        plotImage = `data:image/png;base64,${match[1].replace(/\n/g, '')}`
        // Remove plot data from visible stdout
        result.stdout = result.stdout.replace(/__PLOT_BASE64_START__[\s\S]*__PLOT_BASE64_END__/, '').trim() || null
      }
    }

    // Store the attempt if linked to an exercise
    if (exerciseId) {
      // For plot exercises with no test cases, correct = ran successfully + produced a plot
      const isCorrect = requiresPlot && plotImage
        ? result.status.id === 3
        : result.status.id === 3
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
      plotImage,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Code execution failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
