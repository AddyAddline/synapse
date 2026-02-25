import { SupabaseClient } from '@supabase/supabase-js'

// ============================================
// Lessons
// ============================================

export async function getLessons(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, phase, order_num, title, description, difficulty, estimated_minutes')
    .order('phase')
    .order('order_num')

  if (error) throw error
  return data
}

export async function getLesson(supabase: SupabaseClient, lessonId: number) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()

  if (error) throw error
  return data
}

export async function getLessonExercises(
  supabase: SupabaseClient,
  lessonId: number
) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_num')

  if (error) throw error
  return data
}

// ============================================
// Progress
// ============================================

export async function getUserProgress(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('lesson_id, completed, score, time_spent_seconds, completed_at')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

export async function upsertProgress(
  supabase: SupabaseClient,
  userId: string,
  lessonId: number,
  updates: {
    completed?: boolean
    score?: number
    time_spent_seconds?: number
  }
) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        ...updates,
        completed_at: updates.completed ? new Date().toISOString() : undefined,
      },
      { onConflict: 'user_id,lesson_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================
// Attempts
// ============================================

export async function getUserAttempts(
  supabase: SupabaseClient,
  userId: string,
  exerciseId: number
) {
  const { data, error } = await supabase
    .from('user_attempts')
    .select('id, code, output, correct, attempted_at')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .order('attempted_at', { ascending: false })
    .limit(10)

  if (error) throw error
  return data
}

export async function insertAttempt(
  supabase: SupabaseClient,
  userId: string,
  exerciseId: number,
  code: string,
  output: string,
  correct: boolean
) {
  const { data, error } = await supabase
    .from('user_attempts')
    .insert({
      user_id: userId,
      exercise_id: exerciseId,
      code,
      output,
      correct,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================
// Chat Sessions
// ============================================

export async function getChatSession(
  supabase: SupabaseClient,
  userId: string,
  lessonId: number
) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id, messages, updated_at')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
  return data
}

export async function upsertChatSession(
  supabase: SupabaseClient,
  userId: string,
  lessonId: number,
  messages: { role: string; content: string }[]
) {
  // Check for existing session
  const existing = await getChatSession(supabase, userId, lessonId)

  if (existing) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({
        messages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      messages,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================
// Profile
// ============================================

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: {
    display_name?: string
    current_phase?: number
    current_lesson?: number
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
