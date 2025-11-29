// src/app/dashboard/page.tsx
// VF-016 : Dashboard principal amélioré
// Sprint 1 - Foundation & Wizard

import { auth, currentUser } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { 
  FolderPlus, 
  Folders, 
  Settings, 
  Sparkles, 
  Rocket,
  CheckCircle2,
  ArrowRight,
  Zap,
  FileCode,
  Download
} from 'lucide-react'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  const user = await currentUser()

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Bonjour, {user?.firstName || 'Développeur'} ! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                  Prêt à structurer votre prochain projet IA-Native ?
                </p>
        </div>
        <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25">
          <Link href="/dashboard/projects/new" className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Créer un projet
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      {/* Hero CTA */}
      <Card className="border-2 border-dashed border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-violet-500/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <CardContent className="pt-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Powered by Claude 3.5 Sonnet
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Transformez votre idée en projet structuré
              </h2>
              <p className="text-muted-foreground max-w-xl">
                En quelques minutes, VibeFlow génère automatiquement la validation de marché, 
                l&apos;architecture technique et la documentation complète pour votre projet Cursor.
              </p>
              <Button asChild size="lg" className="mt-4">
                <Link href="/dashboard/projects/new" className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Commencer maintenant
                </Link>
              </Button>
            </div>
            <div className="hidden md:flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Génération en 2-3 minutes
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                3 phases complètes (MVP)
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Exports .cursorrules inclus
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Checklists interactives
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group hover:border-violet-200 dark:hover:border-violet-800 transition-colors cursor-pointer">
          <Link href="/dashboard/projects/new">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/50 text-violet-600 group-hover:bg-violet-200 dark:group-hover:bg-violet-900 transition-colors">
                  <FolderPlus className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Nouveau projet</CardTitle>
                  <CardDescription>Créez un projet structuré</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="group hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer">
          <Link href="/dashboard/projects">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors">
                  <Folders className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Mes projets</CardTitle>
                  <CardDescription>Gérez vos projets existants</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="group hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors cursor-pointer">
          <Link href="/dashboard/settings">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900 transition-colors">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Paramètres</CardTitle>
                  <CardDescription>Configurez votre compte</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-violet-500" />
            Comment ça marche ?
          </CardTitle>
          <CardDescription>
            3 étapes simples pour structurer votre projet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 font-bold">
                1
              </div>
              <h3 className="font-semibold">Décrivez votre idée</h3>
              <p className="text-sm text-muted-foreground">
                Répondez à quelques questions intelligentes sur votre projet
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 font-bold">
                2
              </div>
              <h3 className="font-semibold">Génération automatique</h3>
              <p className="text-sm text-muted-foreground">
                VibeFlow génère 3 phases complètes en 2-3 minutes
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 font-bold">
                3
              </div>
              <h3 className="font-semibold">Exportez vers Cursor</h3>
              <p className="text-sm text-muted-foreground">
                Téléchargez .cursorrules, PRD.md et commencez à coder
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features preview */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCode className="h-5 w-5 text-amber-500" />
              Ce que vous obtenez
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Phase 1 : Validation de Marché (personas, concurrence, USP)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Phase 2 : Setup & Context Engineering</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Phase 3 : Architecture & Planification</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Checklists interactives pour chaque phase</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="h-5 w-5 text-blue-500" />
              Exports disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>.cursorrules personnalisé pour votre projet</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>PRD.md (Product Requirements Document)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>CONTEXT.md pour votre équipe et l&apos;IA</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Premier Prompt Cursor prêt à l&apos;emploi</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
