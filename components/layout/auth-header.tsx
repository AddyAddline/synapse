'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Zap, BookOpen, BarChart3, Moon, Sun } from 'lucide-react'
import { UserMenu } from '@/components/auth/user-menu'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}

const navItems = [
  { href: '/learn', label: 'Lessons', icon: BookOpen },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
]

export function AuthHeader({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 h-14">
        <div className="flex items-center gap-6">
          <Link href="/learn" className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-500" strokeWidth={2.5} />
            <span className="text-sm font-semibold tracking-tight">
              <span className="text-brand-600">Syn</span>apse
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                  )}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}
