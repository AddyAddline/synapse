'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export function LessonContent({ content }: { content: string }) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-p:leading-relaxed prose-code:text-brand-600 dark:prose-code:text-brand-400 prose-code:bg-brand-50 dark:prose-code:bg-brand-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800/60 prose-pre:rounded-xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
