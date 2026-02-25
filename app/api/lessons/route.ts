import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLessons } from '@/lib/supabase/queries'

export async function GET() {
  const supabase = await createClient()

  try {
    const lessons = await getLessons(supabase)
    return NextResponse.json(lessons)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch lessons'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
