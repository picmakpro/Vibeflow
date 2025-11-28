// src/app/dashboard/layout.tsx
// Layout pour toutes les pages dashboard

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  // Rediriger vers sign-in si non authentifié
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r lg:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <h2 className="text-lg font-semibold">VibeFlow</h2>
            <nav className="flex flex-col gap-2 mt-4">
              <Link 
                href="/dashboard" 
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/projects" 
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
              >
                Projets
              </Link>
              <Link 
                href="/dashboard/settings" 
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
              >
                Paramètres
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

