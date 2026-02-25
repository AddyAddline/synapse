import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { upsertChatSession, getLearnerProfile, upsertLearnerProfile } from '@/lib/supabase/queries'
import { streamChat } from '@/lib/openrouter/client'

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
    messages: { role: 'user' | 'assistant'; content: string }[]
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { lessonId, messages } = body

  if (!lessonId || !messages) {
    return NextResponse.json({ error: 'lessonId and messages are required' }, { status: 400 })
  }

  try {
    // Save messages
    await upsertChatSession(supabase, user.id, lessonId, messages)

    // Every 6 messages (3 exchanges), update learner profile
    if (messages.length > 0 && messages.length % 6 === 0) {
      updateLearnerProfileAsync(supabase, user.id, messages).catch(() => {
        // Silently fail — profile update is best-effort
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save chat' }, { status: 500 })
  }
}

async function updateLearnerProfileAsync(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  messages: { role: string; content: string }[]
) {
  // Get current profile
  const currentProfile = await getLearnerProfile(supabase, userId)
  const currentSummary = currentProfile?.summary || 'No previous interactions.'

  // Build a prompt to summarize the learner
  const recentConversation = messages
    .slice(-10)
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n')

  const summaryPrompt = `You are analyzing a student's learning conversation to build a brief learner profile.

Current learner summary: ${currentSummary}

Recent conversation:
${recentConversation}

Based on this conversation, write a 2-3 sentence updated summary of this student. Include:
- Their apparent comfort level with programming (beginner/growing/comfortable)
- Topics they understand vs struggle with
- Their learning style preferences (if observable)

Respond with ONLY the summary text, nothing else.`

  try {
    const response = await streamChat(
      [{ role: 'user', content: summaryPrompt }],
      'deepseek/deepseek-chat:free'
    )

    let summary = ''
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || ''
      summary += content
    }

    if (summary.trim()) {
      // Determine comfort level from summary
      let comfortLevel: 'beginner' | 'growing' | 'comfortable' = 'beginner'
      const lower = summary.toLowerCase()
      if (lower.includes('comfortable') || lower.includes('confident') || lower.includes('proficient')) {
        comfortLevel = 'comfortable'
      } else if (lower.includes('growing') || lower.includes('improving') || lower.includes('intermediate')) {
        comfortLevel = 'growing'
      }

      await upsertLearnerProfile(supabase, userId, {
        summary: summary.trim(),
        comfort_level: comfortLevel,
      })
    }
  } catch {
    // Free model failed — skip profile update
  }
}
