import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
import 'highlight.js/styles/github-dark.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Synapse — Learn MATLAB for Neuroscience',
  description:
    'An interactive platform to learn MATLAB programming for neuroscience research. AI-powered tutor, in-browser code execution, and a curriculum designed for beginners.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className={dmSans.className}>{children}</body>
    </html>
  )
}
