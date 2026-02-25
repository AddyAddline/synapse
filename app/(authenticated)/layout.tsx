import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthHeader } from '@/components/layout/auth-header'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader user={user} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
