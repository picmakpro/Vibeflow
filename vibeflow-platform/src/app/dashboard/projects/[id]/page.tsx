// src/app/dashboard/projects/[id]/page.tsx
// Page détail d'un projet
// Sprint 1 - Foundation & Wizard

import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getProject } from '@/app/actions/projects'
import { 
  ArrowLeft,
  CheckCircle2, 
  Clock, 
  Download,
  FileText,
  Lock,
  Unlock,
  Loader2,
  Sparkles,
  Target,
  Code
} from 'lucide-react'
import type { Phase, ChecklistItem } from '@prisma/client'

// Types locaux
interface PhaseWithChecklistItems extends Phase {
  checklistItems: ChecklistItem[]
}

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const { id } = await params
  const result = await getProject(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const project = result.data

  // Calculer les stats
  const completedPhases = project.phases.filter((p) => p.status === 'COMPLETED').length
  const totalProgress = project.phases.reduce((acc, p) => acc + p.progressPercentage, 0)
  const avgProgress = Math.round(totalProgress / project.phases.length)

  return (
    <div className="container py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/dashboard/projects" className="hover:text-foreground transition-colors">
          Projets
        </Link>
        <span>/</span>
        <span className="text-foreground">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {project.description || project.ideaSummary}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/projects/${project.id}/exports`}>
              <Download className="mr-2 h-4 w-4" />
              Exports
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50">
                <Target className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progression</p>
                <p className="text-2xl font-bold">{avgProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phases complétées</p>
                <p className="text-2xl font-bold">{completedPhases}/{project.phases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                <Code className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="text-lg font-semibold">{formatAppType(project.appType)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Créé le</p>
                <p className="text-lg font-semibold">{formatDate(project.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="phases">Phases</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Generating state */}
          {project.status === 'GENERATING' && (
            <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                      Génération en cours...
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      VibeFlow génère la Phase 1 de votre projet. Cela prend généralement 2-3 minutes.
                      Vous pouvez rester sur cette page ou revenir plus tard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Phase Cards Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {project.phases.map((phase) => (
              <PhaseCard key={phase.id} phase={phase} projectId={project.id} />
            ))}
          </div>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                Informations du projet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Utilisateurs cibles</h4>
                <p className="text-sm">{project.targetUsers}</p>
              </div>
              {project.description && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Description détaillée</h4>
                  <p className="text-sm">{project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases" className="space-y-6">
          {project.phases.map((phase) => (
            <PhaseDetailCard key={phase.id} phase={phase} projectId={project.id} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Composant pour les cartes de phase (vue grille)
function PhaseCard({ phase, projectId }: { phase: PhaseWithChecklistItems; projectId: string }) {
  const isLocked = phase.status === 'LOCKED'
  const isGenerating = phase.status === 'UNLOCKED' && !phase.generatedContent
  const hasContent = !!phase.generatedContent

  return (
    <Card className={`relative overflow-hidden ${isLocked ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold
              ${isLocked 
                ? 'bg-gray-100 text-gray-500 dark:bg-gray-800' 
                : phase.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50'
                  : 'bg-violet-100 text-violet-600 dark:bg-violet-900/50'
              }`}
            >
              {phase.phaseNumber}
            </div>
            <CardTitle className="text-base">{phase.phaseName}</CardTitle>
          </div>
          {isLocked ? (
            <Lock className="h-4 w-4 text-muted-foreground" />
          ) : hasContent ? (
            <Unlock className="h-4 w-4 text-emerald-500" />
          ) : (
            <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{phase.progressPercentage}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                phase.status === 'COMPLETED'
                  ? 'bg-emerald-500'
                  : 'bg-violet-500'
              }`}
              style={{ width: `${phase.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Action button */}
        {!isLocked && hasContent && (
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link href={`/dashboard/projects/${projectId}/phases/${phase.phaseNumber}`}>
              <FileText className="mr-2 h-4 w-4" />
              Voir la phase
            </Link>
          </Button>
        )}
        {isLocked && (
          <p className="text-xs text-center text-muted-foreground">
            Complétez la phase précédente à 80% pour débloquer
          </p>
        )}
        {isGenerating && (
          <p className="text-xs text-center text-amber-600 dark:text-amber-400">
            Génération en cours...
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Composant pour les cartes de phase détaillées (vue liste)
function PhaseDetailCard({ phase, projectId }: { phase: PhaseWithChecklistItems; projectId: string }) {
  const isLocked = phase.status === 'LOCKED'
  const checklistItems = phase.checklistItems || []
  const completedItems = checklistItems.filter((i: ChecklistItem) => i.status === 'COMPLETED').length

  return (
    <Card className={isLocked ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold
              ${isLocked 
                ? 'bg-gray-100 text-gray-500 dark:bg-gray-800' 
                : phase.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50'
                  : 'bg-violet-100 text-violet-600 dark:bg-violet-900/50'
              }`}
            >
              {phase.phaseNumber}
            </div>
            <div>
              <CardTitle>{phase.phaseName}</CardTitle>
              <CardDescription>
                {checklistItems.length > 0 
                  ? `${completedItems}/${checklistItems.length} items complétés`
                  : isLocked ? 'Phase verrouillée' : 'En attente de génération'
                }
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{phase.progressPercentage}%</span>
            {!isLocked && phase.generatedContent && (
              <Button asChild size="sm">
                <Link href={`/dashboard/projects/${projectId}/phases/${phase.phaseNumber}`}>
                  Ouvrir
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      {checklistItems.length > 0 && (
        <CardContent>
          <div className="space-y-2">
            {checklistItems.slice(0, 5).map((item: ChecklistItem) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                {item.status === 'COMPLETED' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                )}
                <span className={item.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''}>
                  {item.title}
                </span>
              </div>
            ))}
            {checklistItems.length > 5 && (
              <p className="text-xs text-muted-foreground">
                +{checklistItems.length - 5} autres items
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Composant pour le badge de statut
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    GENERATING: {
      label: 'Génération...',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    },
    ACTIVE: {
      label: 'Actif',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    },
    ARCHIVED: {
      label: 'Archivé',
      className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
  }

  const { label, className } = config[status] || config.ACTIVE

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}

// Helpers
function formatAppType(appType: string): string {
  const labels: Record<string, string> = {
    SAAS_B2B: 'SaaS B2B',
    SAAS_B2C: 'SaaS B2C',
    MOBILE_APP: 'Mobile',
    CHROME_EXTENSION: 'Extension',
    API_BACKEND: 'API',
  }
  return labels[appType] || appType
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

