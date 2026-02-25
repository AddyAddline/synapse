import { describe, it, expect } from 'vitest'

describe('OpenRouter Client', () => {
  it('exports streamChat function', async () => {
    const mod = await import('@/lib/openrouter/client')
    expect(typeof mod.streamChat).toBe('function')
  })

  it('exports createOpenRouterClient function', async () => {
    const mod = await import('@/lib/openrouter/client')
    expect(typeof mod.createOpenRouterClient).toBe('function')
  })

  it('createOpenRouterClient throws when OPENROUTER_API_KEY is missing', async () => {
    const original = process.env.OPENROUTER_API_KEY
    delete process.env.OPENROUTER_API_KEY

    const { createOpenRouterClient } = await import('@/lib/openrouter/client')
    expect(() => createOpenRouterClient()).toThrow('Missing OPENROUTER_API_KEY')

    process.env.OPENROUTER_API_KEY = original
  })
})
