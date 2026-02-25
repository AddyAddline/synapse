import { describe, it, expect } from 'vitest'
import { selectModel, FREE_MODEL, PAID_MODEL } from '@/lib/openrouter/client'

describe('OpenRouter Client', () => {
  describe('selectModel', () => {
    it('uses free model for simple questions', () => {
      expect(selectModel('What is a variable?')).toBe(FREE_MODEL)
      expect(selectModel('How do I create an array?')).toBe(FREE_MODEL)
      expect(selectModel('What does disp do?')).toBe(FREE_MODEL)
    })

    it('uses paid model for code review requests', () => {
      expect(selectModel('Can you review my code?')).toBe(PAID_MODEL)
      expect(selectModel('Review this code please')).toBe(PAID_MODEL)
    })

    it('uses paid model for debugging requests', () => {
      expect(selectModel('Help me debug this')).toBe(PAID_MODEL)
      expect(selectModel('I need to debug my function')).toBe(PAID_MODEL)
    })

    it('uses paid model for "what is wrong" questions', () => {
      expect(selectModel("What's wrong with my code?")).toBe(PAID_MODEL)
      expect(selectModel('What is wrong here?')).toBe(PAID_MODEL)
    })

    it('uses paid model for detailed explanations', () => {
      expect(selectModel('Explain how FFT works step by step')).toBe(PAID_MODEL)
      expect(selectModel('Explain the difference between plot and stem')).toBe(PAID_MODEL)
    })

    it('uses paid model for comparisons', () => {
      expect(selectModel('Compare cell arrays and matrices')).toBe(PAID_MODEL)
    })
  })
})
