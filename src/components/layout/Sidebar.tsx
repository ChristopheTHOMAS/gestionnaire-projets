'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/projects', label: 'Projets', icon: '📋' },
  { href: '/lieux', label: 'Lieux', icon: '📍' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-slate-900 text-white py-6 px-4 shrink-0">
      <div className="text-lg font-bold mb-8 text-sky-400">Mes Projets</div>
      <nav className="flex flex-col gap-1">
        {links.map(l => (
          <Link
            key={l.href} href={l.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${pathname.startsWith(l.href) ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <span>{l.icon}</span>{l.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
