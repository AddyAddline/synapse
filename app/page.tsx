'use client'

import Link from 'next/link'
import {
  Code2,
  BrainCircuit,
  BookOpen,
  BarChart3,
  ArrowRight,
  Zap,
} from 'lucide-react'
import { useEffect, useRef } from 'react'

function SynapseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let nodes: { x: number; y: number; vx: number; vy: number; r: number }[] =
      []

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }

    function initNodes() {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 25000)
      nodes = Array.from({ length: Math.min(count, 60) }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
      }))
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.12
            ctx!.beginPath()
            ctx!.strokeStyle = `rgba(0, 112, 199, ${alpha})`
            ctx!.lineWidth = 0.5
            ctx!.moveTo(nodes[i].x, nodes[i].y)
            ctx!.lineTo(nodes[j].x, nodes[j].y)
            ctx!.stroke()
          }
        }
      }

      // Draw & move nodes
      for (const node of nodes) {
        ctx!.beginPath()
        ctx!.fillStyle = 'rgba(0, 112, 199, 0.2)'
        ctx!.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx!.fill()

        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > canvas!.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas!.height) node.vy *= -1
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    initNodes()
    draw()
    window.addEventListener('resize', () => {
      resize()
      initNodes()
    })

    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
    />
  )
}

const features = [
  {
    icon: Code2,
    title: 'Interactive Code Editor',
    desc: 'Write and run MATLAB-compatible code right in your browser. See results instantly — no installation needed.',
    accent: 'text-brand-500',
    bg: 'bg-brand-50 dark:bg-brand-950/30',
  },
  {
    icon: BrainCircuit,
    title: 'AI Tutor',
    desc: 'A patient, encouraging AI assistant that adapts to your level. It remembers your struggles and explains at your pace.',
    accent: 'text-neuro-500',
    bg: 'bg-neuro-50 dark:bg-neuro-950/30',
  },
  {
    icon: BookOpen,
    title: 'Neuroscience Curriculum',
    desc: 'From "Hello World" to analyzing real brain data. Twenty-eight lessons across five phases, all using neuroscience examples.',
    accent: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    desc: 'See what you\'ve learned, where you\'re stuck, and what comes next. Your learning journey, visualized.',
    accent: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
  },
]

const phases = [
  {
    num: '01',
    title: 'Fundamentals',
    desc: 'Variables, arrays, loops, functions — the building blocks.',
    color: 'border-brand-400',
    dot: 'bg-brand-400',
  },
  {
    num: '02',
    title: 'Data & Plotting',
    desc: 'Load data, crunch numbers, and create beautiful visualizations.',
    color: 'border-neuro-400',
    dot: 'bg-neuro-400',
  },
  {
    num: '03',
    title: 'Signal Processing',
    desc: 'Filtering, Fourier transforms, and spectral analysis of brain waves.',
    color: 'border-amber-400',
    dot: 'bg-amber-400',
  },
  {
    num: '04',
    title: 'Neuroscience',
    desc: 'EEG analysis, spike trains, statistics, and your own meditation study.',
    color: 'border-rose-400',
    dot: 'bg-rose-400',
  },
  {
    num: '05',
    title: 'Real Data',
    desc: 'Work with real spike, EEG, fMRI, and calcium imaging datasets.',
    color: 'border-violet-400',
    dot: 'bg-violet-400',
  },
]

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <SynapseBackground />

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-500" strokeWidth={2.5} />
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-brand-600">Syn</span>apse
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition shadow-sm shadow-brand-600/20"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-20 sm:pt-32 pb-24">
        <div className="max-w-3xl">
          <div
            className="opacity-0 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-3 py-1.5 rounded-full border border-brand-200/60 dark:border-brand-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-neuro-400 animate-pulse" />
              Interactive learning platform
            </span>
          </div>

          <h1
            className="mt-8 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.25s' }}
          >
            <span className="block font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.9]">
              Learn{' '}
              <span className="text-brand-600 inline-block relative">
                MATLAB
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-brand-400/40 rounded-full" />
              </span>
            </span>
            <span className="block font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.9] mt-2">
              for{' '}
              <span className="text-neuro-600 italic">Neuroscience</span>
            </span>
          </h1>

          <p
            className="mt-8 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed opacity-0 animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            An interactive platform designed for complete beginners. Write code
            in your browser, learn from an AI tutor that adapts to you, and go
            from zero to analyzing real brain data — at your own pace.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-4 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.55s' }}
          >
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30"
            >
              Start learning
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
            >
              I have an account
            </Link>
          </div>

          {/* Code preview snippet */}
          <div
            className="mt-16 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.7s' }}
          >
            <div className="relative max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/10 to-neuro-500/10 rounded-2xl blur-xl" />
              <div className="relative bg-gray-950 rounded-xl p-5 shadow-2xl border border-gray-800/60">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neuro-400/80" />
                  <span className="ml-3 text-xs text-gray-500 font-mono">
                    lesson_01.m
                  </span>
                </div>
                <pre className="font-mono text-sm leading-relaxed">
                  <code>
                    <span className="text-gray-500">% My first MATLAB program</span>
                    {'\n'}
                    <span className="text-brand-400">disp</span>
                    <span className="text-gray-300">(</span>
                    <span className="text-neuro-400">
                      &apos;Hello, Neuroscience!&apos;
                    </span>
                    <span className="text-gray-300">)</span>
                    {'\n\n'}
                    <span className="text-gray-500">
                      % Brain wave frequencies (Hz)
                    </span>
                    {'\n'}
                    <span className="text-gray-300">alpha = </span>
                    <span className="text-amber-400">[8 9 10 11 12 13]</span>
                    <span className="text-gray-300">;</span>
                    {'\n'}
                    <span className="text-brand-400">mean</span>
                    <span className="text-gray-300">(alpha)</span>
                  </code>
                </pre>
                <div className="mt-3 pt-3 border-t border-gray-800/60 font-mono text-sm">
                  <span className="text-gray-500">&gt;&gt; </span>
                  <span className="text-neuro-300">Hello, Neuroscience!</span>
                  {'\n'}
                  <span className="text-gray-500">&gt;&gt; </span>
                  <span className="text-gray-300">ans = 10.500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
            Everything you need to learn
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            No setup, no prerequisites, no frustration. Just open your browser
            and start writing code.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm p-7 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-gray-200/30 dark:hover:shadow-gray-900/30"
              style={{
                animationDelay: `${0.1 * i}s`,
              }}
            >
              <div
                className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}
              >
                <f.icon className={`w-5 h-5 ${f.accent}`} />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Phases */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
            Your learning path
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            From your first line of code to analyzing real brain data. Five
            phases, twenty-eight lessons, one journey.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-brand-300 via-neuro-300 via-amber-300 via-rose-300 to-violet-300 opacity-40" />

          <div className="space-y-10">
            {phases.map((phase) => (
              <div key={phase.num} className="relative flex gap-6 items-start">
                <div
                  className={`relative z-10 w-10 h-10 rounded-full border-2 ${phase.color} bg-white dark:bg-gray-950 flex items-center justify-center shrink-0`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${phase.dot}`}
                  />
                </div>
                <div className="pt-1.5">
                  <span className="text-xs font-mono text-gray-400 tracking-wider uppercase">
                    Phase {phase.num}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight">
                    {phase.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neuro-400 to-transparent" />
          <div className="relative px-8 sm:px-14 py-16 text-center">
            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-tight">
              Ready to begin?
            </h2>
            <p className="mt-4 text-brand-200 max-w-md mx-auto">
              No math background needed. No coding experience needed. Just
              curiosity about the brain and a willingness to learn.
            </p>
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-xl bg-white text-brand-900 font-semibold hover:bg-brand-50 transition shadow-lg"
            >
              Create your free account
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-10 border-t border-gray-200/60 dark:border-gray-800/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Zap className="w-4 h-4 text-brand-400" />
            <span>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Synapse
              </span>{' '}
              — Built with care for neuroscience beginners
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/auth/login" className="hover:text-gray-600 transition">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="hover:text-gray-600 transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
