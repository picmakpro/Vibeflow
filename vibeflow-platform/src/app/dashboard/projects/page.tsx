// src/app/dashboard/projects/page.tsx
// Liste des projets

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function ProjectsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // TODO: Récupérer les projets depuis la DB
  // const projects = await prisma.project.findMany({ ... })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Projets</h1>
          <p className="text-muted-foreground">
            Gérez tous vos projets de développement IA-Native
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">Nouveau projet</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aucun projet pour le moment</CardTitle>
          <CardDescription>
            Créez votre premier projet pour commencer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/dashboard/projects/new">Créer mon premier projet</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

