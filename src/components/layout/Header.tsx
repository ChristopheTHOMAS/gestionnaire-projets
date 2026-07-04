'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const router = useRouter()

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <span className="font-bold text-sky-400">Mes Projets</span>
      <button onClick={logout} className="text-slate-300 text-sm hover:text-white">Déconnexion</button>
    </header>
  )
}
