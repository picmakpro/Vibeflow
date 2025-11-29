// src/app/dashboard/layout.tsx
// Layout pour toutes les pages dashboard

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Rocket, Folders, Settings } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-card lg:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="flex items-center gap-2 px-2 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                VibeFlow
              </span>
            </div>
            <nav className="flex flex-col gap-1 mt-4">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
              >
                <Rocket className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                href="/dashboard/projects" 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
              >
                <Folders className="h-4 w-4" />
                Projets
              </Link>
              <Link 
                href="/dashboard/settings" 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="container py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
