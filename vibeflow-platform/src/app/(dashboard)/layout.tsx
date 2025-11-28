import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar - à implémenter */}
        <aside className="hidden w-64 border-r lg:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <h2 className="text-lg font-semibold">VibeFlow</h2>
            {/* Navigation à implémenter */}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

