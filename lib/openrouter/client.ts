import OpenAI from 'openai'

// Default: GPT-5.2 via OpenRouter (best quality for tutoring)
const DEFAULT_MODEL = 'openai/gpt-5.2'
// Free fallback models (when USE_FREE_TUTOR=true or on paid model failure)
const FREE_MODEL = 'deepseek/deepseek-chat:free'

// Env var: set USE_FREE_TUTOR=true to use free models instead of GPT-5.2
const useFreeModels = process.env.USE_FREE_TUTOR === 'true'

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
      'X-Title': 'Synapse - MATLAB for Neuroscience',
    },
  })
}

export interface TutorMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * Stream a chat completion from OpenRouter.
 * Defaults to GPT-5.2 with automatic fallback to free model on failure.
 */
export async function streamChat(
  messages: TutorMessage[],
  model?: string
) {
  const client = createOpenRouterClient()
  const primaryModel = model || (useFreeModels ? FREE_MODEL : DEFAULT_MODEL)

  try {
    return await client.chat.completions.create({
      model: primaryModel,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    })
  } catch (error) {
    // Fallback to free model if paid model fails
    if (primaryModel !== FREE_MODEL) {
      console.warn(`Model ${primaryModel} failed, falling back to ${FREE_MODEL}:`, error)
      return client.chat.completions.create({
        model: FREE_MODEL,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      })
    }
    throw error
  }
}
