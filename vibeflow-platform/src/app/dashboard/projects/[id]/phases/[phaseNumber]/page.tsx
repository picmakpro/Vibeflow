// src/app/dashboard/projects/[id]/phases/[phaseNumber]/page.tsx
// VF-045 : Page de détail d'une phase avec checklist complète
// Sprint 2 - AI Generation & Dashboard

import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getPhase, getPhaseContent } from '@/app/actions/phases'
import { 
  ArrowLeft,
  CheckCircle2,
  FileText,
  ListChecks,
  BookOpen,
  Loader2,
  Sparkles
} from 'lucide-react'
import { PhaseChecklist } from './PhaseChecklist'
import { PhaseReport } from './PhaseReport'

// ============================================
// TYPES
// ============================================

interface PhasePageProps {
  params: Promise<{ id: string; phaseNumber: string }>
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function PhasePage({ params }: PhasePageProps) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const { id: projectId, phaseNumber: phaseNumberStr } = await params
  const phaseNumber = parseInt(phaseNumberStr, 10)

  if (isNaN(phaseNumber) || phaseNumber < 1 || phaseNumber > 10) {
    notFound()
  }

  // Récupérer la phase
  const phaseResult = await getPhase(projectId, phaseNumber)

  if (!phaseResult.success || !phaseResult.data) {
    notFound()
  }

  const phase = phaseResult.data
  const project = phase.project

  // Récupérer le contenu généré
  const contentResult = await getPhaseContent(projectId, phaseNumber)
  const hasContent = contentResult.success && contentResult.data?.markdown

  // Calculer les stats
  const totalItems = phase.checklistItems.length
  const completedItems = phase.checklistItems.filter(i => i.status === 'COMPLETED').length

  return (
    <div className="container py-8 space-y-6">
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
        <Link href={`/dashboard/projects/${projectId}`} className="hover:text-foreground transition-colors">
          {project.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">Phase {phaseNumber}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/projects/${projectId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 font-bold dark:bg-violet-900/50">
                {phaseNumber}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{phase.phaseName}</h1>
                <p className="text-sm text-muted-foreground">
                  {project.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50">
                <ListChecks className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progression</p>
                <p className="text-2xl font-bold">{phase.progressPercentage}%</p>
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
                <p className="text-sm text-muted-foreground">Items complétés</p>
                <p className="text-2xl font-bold">{completedItems}/{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <p className="text-lg font-semibold">{formatPhaseStatus(phase.status)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contenu</p>
                <p className="text-lg font-semibold">
                  {hasContent ? 'Généré' : 'En attente'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content not generated yet */}
      {!hasContent && (
        <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Contenu en cours de génération...
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Le rapport et la checklist de cette phase sont en cours de génération par l&apos;IA.
                  Cela peut prendre 2-3 minutes. Rafraîchissez la page pour voir les mises à jour.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      {hasContent && (
        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList>
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Rapport
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <PhaseChecklist
              projectId={projectId}
              phaseNumber={phaseNumber}
              items={phase.checklistItems}
              progressPercentage={phase.progressPercentage}
            />
          </TabsContent>

          <TabsContent value="report">
            <PhaseReport
              markdown={contentResult.data?.markdown || ''}
              phaseName={phase.phaseName}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// ============================================
// HELPERS
// ============================================

function formatPhaseStatus(status: string): string {
  const labels: Record<string, string> = {
    LOCKED: 'Verrouillée',
    UNLOCKED: 'Débloquée',
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Complétée',
  }
  return labels[status] || status
}

