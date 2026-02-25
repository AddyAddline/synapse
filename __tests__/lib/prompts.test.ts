import { describe, it, expect } from 'vitest'
import {
  TUTOR_SYSTEM_PROMPT,
  buildLessonContext,
  buildTutorMessages,
} from '@/lib/prompts'

describe('Tutor Prompts', () => {
  describe('TUTOR_SYSTEM_PROMPT', () => {
    it('mentions neuroscience context', () => {
      expect(TUTOR_SYSTEM_PROMPT).toContain('neuroscience')
      expect(TUTOR_SYSTEM_PROMPT).toContain('meditation')
    })

    it('includes brain wave reference', () => {
      expect(TUTOR_SYSTEM_PROMPT).toContain('Alpha')
      expect(TUTOR_SYSTEM_PROMPT).toContain('Theta')
      expect(TUTOR_SYSTEM_PROMPT).toContain('Delta')
    })

    it('instructs not to give complete solutions', () => {
      expect(TUTOR_SYSTEM_PROMPT).toContain('NEVER give complete solutions')
    })
  })

  describe('buildLessonContext', () => {
    it('returns empty string when no lesson provided', () => {
      expect(buildLessonContext()).toBe('')
      expect(buildLessonContext(undefined)).toBe('')
    })

    it('includes lesson title and phase', () => {
      const ctx = buildLessonContext({
        title: 'Variables & Types',
        phase: 1,
        content_md: 'Learn about variables in MATLAB.',
      })
      expect(ctx).toContain('Variables & Types')
      expect(ctx).toContain('Phase 1')
    })

    it('truncates long lesson content', () => {
      const longContent = 'x'.repeat(2000)
      const ctx = buildLessonContext({
        title: 'Test',
        phase: 1,
        content_md: longContent,
      })
      expect(ctx).toContain('...')
      // Should contain at most 1500 chars of content
      expect(ctx.length).toBeLessThan(2000)
    })
  })

  describe('buildTutorMessages', () => {
    it('starts with system message', () => {
      const messages = buildTutorMessages('Hello', [])
      expect(messages[0].role).toBe('system')
      expect(messages[0].content).toContain('Synapse')
    })

    it('ends with user message', () => {
      const messages = buildTutorMessages('What is a variable?', [])
      const last = messages[messages.length - 1]
      expect(last.role).toBe('user')
      expect(last.content).toBe('What is a variable?')
    })

    it('includes conversation history', () => {
      const history = [
        { role: 'user' as const, content: 'Hi' },
        { role: 'assistant' as const, content: 'Hello! How can I help?' },
      ]
      const messages = buildTutorMessages('What is x?', history)
      expect(messages.length).toBe(4) // system + 2 history + 1 new
    })

    it('limits history to last 10 messages', () => {
      const history = Array.from({ length: 20 }, (_, i) => ({
        role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
        content: `Message ${i}`,
      }))
      const messages = buildTutorMessages('New question', history)
      // system + 10 history + 1 new = 12
      expect(messages.length).toBe(12)
    })

    it('includes lesson context when provided', () => {
      const lesson = {
        title: 'Filtering',
        phase: 3,
        content_md: 'Learn about signal filtering.',
      }
      const messages = buildTutorMessages('Help me', [], lesson)
      expect(messages[0].content).toContain('Filtering')
      expect(messages[0].content).toContain('Phase 3')
    })
  })
})
