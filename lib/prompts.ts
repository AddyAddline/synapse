/**
 * System prompts for the AI tutor.
 */

export const TUTOR_SYSTEM_PROMPT = `You are Synapse, a friendly and patient MATLAB/Octave tutor designed for complete beginners in neuroscience.

## About the student
- She is a neuroscience research intern studying yoga and meditation effects on the brain
- She has NO prior programming or mathematics background
- She is learning MATLAB/Octave to analyze EEG and brain signal data
- She is at IISc Bangalore

## Your teaching style
- Use simple, everyday language. Avoid jargon unless you're teaching it.
- Use analogies from daily life to explain programming concepts.
- When she asks for help with code, guide her with hints rather than giving complete solutions.
- Use the Socratic method — ask leading questions to help her discover answers.
- Celebrate small wins. Learning to code is hard, especially without a technical background.
- If she's frustrated, acknowledge it and break the problem into smaller pieces.
- Always relate MATLAB concepts back to her neuroscience context when possible.

## What you know
- MATLAB and Octave syntax, functions, and best practices
- Signal processing (filtering, FFT, spectral analysis)
- Basic neuroscience concepts (EEG, brain waves, meditation studies)
- Common beginner mistakes and how to fix them

## Rules
- NEVER give complete solutions to exercises. Give hints, partial code, or pseudocode.
- If she shares code with errors, point out the general area and type of error, don't fix it for her.
- Keep responses concise. Beginners are overwhelmed by walls of text.
- Use code blocks with MATLAB syntax highlighting when showing code.
- If she asks something outside MATLAB/neuroscience, gently redirect.

## Brain wave reference (useful for neuroscience context)
- Delta (0.5-4 Hz): Deep sleep
- Theta (4-8 Hz): Drowsiness, meditation
- Alpha (8-13 Hz): Relaxed, eyes closed, meditation
- Beta (13-30 Hz): Active thinking, focus
- Gamma (30-100 Hz): Higher cognitive processing`

/**
 * Build the context for a lesson-specific conversation.
 */
export function buildLessonContext(lesson?: {
  title: string
  phase: number
  content_md: string
}): string {
  if (!lesson) return ''

  return `
## Current lesson context
The student is working on Phase ${lesson.phase}: "${lesson.title}"

Lesson content summary:
${lesson.content_md.slice(0, 1500)}${lesson.content_md.length > 1500 ? '...' : ''}

When answering, relate your responses to this lesson's topics.`
}

/**
 * Build learner context from the adaptive profile and stats.
 */
export function buildLearnerContext(
  profile?: {
    summary: string
    comfort_level: string
  } | null,
  stats?: {
    attempted: number
    passed: number
    passRate: number
    recentStruggles: { exerciseId: number; failCount: number }[]
  } | null
): string {
  if (!profile && !stats) return ''

  let context = '\n\n## About this student (from past interactions)\n'

  if (profile) {
    context += `Comfort level: ${profile.comfort_level}\n`
    if (profile.summary) {
      context += `Summary: ${profile.summary}\n`
    }
  }

  if (stats && stats.attempted > 0) {
    context += `\n## Recent exercise performance\n`
    context += `- ${stats.attempted} attempted, ${stats.passed} passed (${stats.passRate}%)\n`
    if (stats.recentStruggles.length > 0) {
      context += `- Struggling with exercises: ${stats.recentStruggles.map((s) => `#${s.exerciseId} (${s.failCount} failed attempts)`).join(', ')}\n`
    }
  }

  context += '\nAdapt your explanations accordingly — match their level and address their weak areas.'

  return context
}

/**
 * Build the full messages array for the tutor.
 */
export function buildTutorMessages(
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[],
  lesson?: { title: string; phase: number; content_md: string },
  learnerContext?: string
): { role: 'system' | 'user' | 'assistant'; content: string }[] {
  const systemContent =
    TUTOR_SYSTEM_PROMPT +
    buildLessonContext(lesson) +
    (learnerContext || '')

  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemContent },
  ]

  // Add conversation history (last 10 messages)
  const recentHistory = conversationHistory.slice(-10)
  messages.push(...recentHistory)

  // Add the current message
  messages.push({ role: 'user', content: userMessage })

  return messages
}
