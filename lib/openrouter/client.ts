import OpenAI from 'openai'

// Free models available on OpenRouter (rate limited: 20 req/min, 200 req/day)
export const FREE_MODEL = 'deepseek/deepseek-chat:free'
// Paid model for complex queries (cheap and capable)
export const PAID_MODEL = 'deepseek/deepseek-chat'

export function createOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('Missing OPENROUTER_API_KEY environment variable')
  }

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'https://synapse-learn.vercel.app',
      'X-Title': 'Synapse — MATLAB for Neuroscience',
    },
  })
}

export interface TutorMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * Select the appropriate model based on query complexity.
 * Simple questions use the free model; complex ones use paid.
 */
export function selectModel(message: string): string {
  // Use paid model for code review, debugging, and complex explanations
  const complexPatterns = [
    /review\s+(my|this)\s+code/i,
    /debug/i,
    /what('s|\s+is)\s+wrong/i,
    /explain\s+(how|why|the\s+difference)/i,
    /step\s+by\s+step/i,
    /compare/i,
  ]

  const isComplex = complexPatterns.some((p) => p.test(message))
  return isComplex ? PAID_MODEL : FREE_MODEL
}

/**
 * Stream a chat completion from OpenRouter.
 */
export async function streamChat(
  messages: TutorMessage[],
  model?: string
) {
  const client = createOpenRouterClient()
  const selectedModel = model || selectModel(messages[messages.length - 1]?.content || '')

  return client.chat.completions.create({
    model: selectedModel,
    messages,
    stream: true,
    temperature: 0.7,
    max_tokens: 2000,
  })
}
