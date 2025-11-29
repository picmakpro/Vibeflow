// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
// Page de connexion avec Clerk

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">VibeFlow</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            La Colonne Vertébrale du Développement IA-Native
          </p>
        </div>
        <SignIn 
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            },
          }}
        />
      </div>
    </div>
  )
}

