'use client'

import { BrainCircuit, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

interface MessageProps {
  message: {
    role: 'user' | 'assistant'
    content: string
  }
}

export function ChatMessage({ message }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-2.5', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
          isUser
            ? 'bg-brand-100 dark:bg-brand-900/30'
            : 'bg-neuro-100 dark:bg-neuro-900/30'
        )}
      >
        {isUser ? (
          <User className="w-3 h-3 text-brand-600" />
        ) : (
          <BrainCircuit className="w-3 h-3 text-neuro-600" />
        )}
      </div>
      <div
        className={cn(
          'max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm',
          isUser
            ? 'bg-brand-600 text-white rounded-tr-sm'
            : 'bg-gray-100 dark:bg-gray-800 rounded-tl-sm'
        )}
      >
        {isUser ? (
          <p className="leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-1.5 prose-code:text-xs prose-code:text-brand-700 dark:prose-code:text-brand-300 prose-code:bg-brand-50 dark:prose-code:bg-brand-950/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-800 dark:prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-md prose-pre:text-xs prose-pre:overflow-x-auto prose-pre:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
