'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const displayName =
    user.user_metadata?.display_name ||
    user.email?.split('@')[0] ||
    'User'

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium text-sm flex items-center justify-center hover:bg-brand-200 dark:hover:bg-brand-900/50 transition"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => {
              setOpen(false)
              router.push('/dashboard')
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Dashboard
          </button>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
