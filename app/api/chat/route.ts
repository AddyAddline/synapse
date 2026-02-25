import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { streamChat } from '@/lib/openrouter/client'
import { buildTutorMessages, buildLearnerContext } from '@/lib/prompts'
import { getLearnerProfile, getLearnerStats } from '@/lib/supabase/queries'

export async function POST(request: NextRequest) {
  // Verify authentication
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Parse request
  let body: {
    message: string
    lessonId?: number
    conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
  }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { message, lessonId, conversationHistory = [] } = body

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: 'Message is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Fetch lesson context if a lesson ID is provided
  let lesson: { title: string; phase: number; content_md: string } | undefined
  if (lessonId) {
    const { data } = await supabase
      .from('lessons')
      .select('title, phase, content_md')
      .eq('id', lessonId)
      .single()
    if (data) {
      lesson = data
    }
  }

  // Fetch learner profile + stats for adaptive context
  let learnerContext = ''
  try {
    const [profile, stats] = await Promise.all([
      getLearnerProfile(supabase, user.id),
      getLearnerStats(supabase, user.id),
    ])
    learnerContext = buildLearnerContext(profile, stats)
  } catch {
    // Learner profile not available — proceed without it
  }

  // Build messages and stream response
  const messages = buildTutorMessages(message, conversationHistory, lesson, learnerContext)

  try {
    const stream = await streamChat(messages)

    // Convert OpenAI stream to ReadableStream for SSE
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              )
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Stream error'
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: errorMessage })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Chat failed'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
