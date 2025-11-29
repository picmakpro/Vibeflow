// src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
// Page d'inscription avec Clerk

import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">VibeFlow</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Créez votre compte gratuitement
          </p>
        </div>
        <SignUp 
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

