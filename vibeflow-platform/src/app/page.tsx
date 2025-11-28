import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth()

  // Si l'utilisateur est connecté, rediriger vers le dashboard
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="container flex max-w-5xl flex-col items-center gap-12 px-4 py-16 text-center">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            VibeFlow
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            La Colonne Vertébrale du Développement IA-Native
          </p>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Transformez votre idée d'app en projet Cursor structuré complet en 15 minutes.
            Génération automatique de documentation, architecture, et méthodologie complète.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/sign-up">Commencer gratuitement</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-in">Se connecter</Link>
          </Button>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">🎯 Validation Marché</h3>
            <p className="text-muted-foreground">
              Analyse automatique de votre idée, personas, concurrence et USP
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">🏗️ Architecture Complète</h3>
            <p className="text-muted-foreground">
              Diagrammes techniques, schéma DB, stack définie automatiquement
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">📋 Méthodologie Structurée</h3>
            <p className="text-muted-foreground">
              10 phases guidées avec checklists et déblocage progressif
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
