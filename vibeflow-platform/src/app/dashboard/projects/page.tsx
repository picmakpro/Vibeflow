// src/app/dashboard/projects/page.tsx
// Page liste des projets
// Sprint 1 - Foundation & Wizard

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getProjects } from '@/app/actions/projects'
import { 
  FolderPlus, 
  Folders, 
  Clock, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  Calendar
} from 'lucide-react'

export default async function ProjectsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const result = await getProjects()
  const projects = result.success ? result.data || [] : []

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Folders className="h-8 w-8 text-violet-500" />
            Mes Projets
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos projets de développement IA-Native
          </p>
        </div>
        <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
          <Link href="/dashboard/projects/new" className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Nouveau projet
          </Link>
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 mb-4">
              <FolderPlus className="h-8 w-8 text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun projet pour le moment</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Créez votre premier projet et laissez VibeFlow générer automatiquement 
              la structure complète pour votre développement IA-Native.
            </p>
            <Button asChild>
              <Link href="/dashboard/projects/new" className="flex items-center gap-2">
                <FolderPlus className="h-4 w-4" />
                Créer mon premier projet
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            // Calculer la progression globale
            const totalProgress = project.phases.reduce(
              (acc, phase) => acc + phase.progressPercentage,
              0
            )
            const avgProgress = Math.round(totalProgress / project.phases.length)
            const completedPhases = project.phases.filter(
              (p) => p.status === 'COMPLETED'
            ).length

            return (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <Card className="h-full hover:border-violet-300 dark:hover:border-violet-700 transition-colors cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="group-hover:text-violet-600 transition-colors line-clamp-1">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description || project.ideaSummary}
                        </CardDescription>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">{avgProgress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${avgProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{completedPhases}/{project.phases.length} phases</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                    </div>

                    {/* View button */}
                    <div className="pt-2">
                      <Button variant="ghost" className="w-full group-hover:bg-violet-50 dark:group-hover:bg-violet-950/30">
                        Voir le projet
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Composant pour le badge de statut
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    GENERATING: {
      label: 'Génération...',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
    },
    ACTIVE: {
      label: 'Actif',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    ARCHIVED: {
      label: 'Archivé',
      className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      icon: <Clock className="h-3 w-3" />,
    },
  }

  const { label, className, icon } = config[status] || config.ACTIVE

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {icon}
      {label}
    </span>
  )
}

// Fonction pour formater la date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date))
}
