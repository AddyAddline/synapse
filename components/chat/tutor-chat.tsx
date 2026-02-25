'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, BrainCircuit, Loader2 } from 'lucide-react'
import { ChatMessage } from './message'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function TutorChat({
  lessonId,
  lessonTitle,
}: {
  lessonId: number
  lessonTitle: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [hasHistory, setHasHistory] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load chat history on mount
  useEffect(() => {
    let cancelled = false
    async function loadHistory() {
      try {
        const res = await fetch(`/api/chat/history?lessonId=${lessonId}`)
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && data.messages && data.messages.length > 0) {
          setMessages(data.messages)
          setHasHistory(true)
        }
      } catch {
        // Silently fail — start fresh
      } finally {
        if (!cancelled) setIsLoadingHistory(false)
      }
    }
    loadHistory()
    return () => { cancelled = true }
  }, [lessonId])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Save messages after each assistant response
  const saveMessages = useCallback(
    (msgs: Message[]) => {
      fetch('/api/chat/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, messages: msgs }),
      }).catch(() => {
        // Fire and forget
      })
    },
    [lessonId]
  )

  const handleSend = useCallback(async () => {
    const message = input.trim()
    if (!message || isStreaming) return

    setInput('')
    setIsStreaming(true)

    const newMessages: Message[] = [...messages, { role: 'user', content: message }]
    setMessages(newMessages)

    // Add empty assistant message to stream into
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          lessonId,
          conversationHistory: messages.slice(-10),
        }),
      })

      if (!res.ok) {
        throw new Error('Chat request failed')
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader')

      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                accumulated += parsed.content
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: accumulated,
                  }
                  return updated
                })
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      // Save the full conversation after streaming is done
      const finalMessages: Message[] = [
        ...newMessages,
        { role: 'assistant', content: accumulated },
      ]
      saveMessages(finalMessages)
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content:
            "Sorry, I couldn't connect right now. Please check your connection and try again.",
        }
        return updated
      })
    }

    setIsStreaming(false)
  }, [input, isStreaming, messages, lessonId, saveMessages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-brand-500" />
          <span className="text-sm font-semibold">AI Tutor</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 truncate">
          Helping with: {lessonTitle}
        </p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="text-center py-12">
                <BrainCircuit className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  Ask me anything about this lesson!
                </p>
                <div className="mt-4 space-y-1.5">
                  {[
                    "What's a variable?",
                    'I got an error, help!',
                    "Explain this concept simply",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q)
                        inputRef.current?.focus()
                      }}
                      className="block mx-auto text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-brand-600 hover:border-brand-200 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Previous conversation divider */}
            {hasHistory && messages.length > 0 && (
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
                <span className="text-[10px] uppercase tracking-wider text-gray-400">
                  Previous conversation
                </span>
                <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
              </div>
            )}

            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Thinking...
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
