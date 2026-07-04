import type { Metadata, Viewport } from 'next'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import ServiceWorkerRegistrar from '@/components/layout/ServiceWorkerRegistrar'

export const metadata: Metadata = {
  title: 'Mes Projets',
  description: 'Gestionnaire de projets maison et bricolage',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Mes Projets' },
}

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isApp = !!user

  return (
    <html lang="fr">
      <body className="antialiased bg-gray-50 text-gray-900">
        <ServiceWorkerRegistrar />
        {isApp ? (
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
              <Header />
              <main className="flex-1 p-4 pb-20 md:pb-4 md:p-6">
                {children}
              </main>
            </div>
          </div>
        ) : (
          children
        )}
        {isApp && <BottomNav />}
      </body>
    </html>
  )
}
