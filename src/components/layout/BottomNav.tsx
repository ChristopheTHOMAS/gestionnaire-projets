'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/projects', label: 'Projets', icon: '📋' },
  { href: '/lieux', label: 'Lieux', icon: '📍' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex">
        {links.map(l => (
          <Link
            key={l.href} href={l.href}
            className={`flex-1 flex flex-col items-center py-2 text-xs gap-1 transition ${pathname.startsWith(l.href) ? 'text-sky-600 font-semibold' : 'text-gray-500'}`}
          >
            <span className="text-xl">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
