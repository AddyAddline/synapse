import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getChatSession } from '@/lib/supabase/queries'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const lessonId = request.nextUrl.searchParams.get('lessonId')
  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })
  }

  try {
    const session = await getChatSession(supabase, user.id, Number(lessonId))
    return NextResponse.json({
      messages: session?.messages ?? [],
    })
  } catch {
    return NextResponse.json({ messages: [] })
  }
}
