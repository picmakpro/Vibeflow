import { auth, currentUser } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function DashboardPage() {
  const { userId } = await auth()
  const user = await currentUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenue, {user?.firstName || 'Utilisateur'} !
        </h1>
        <p className="text-muted-foreground">
          Gérez vos projets de développement IA-Native
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Projets</CardTitle>
            <CardDescription>Gérez vos projets en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/projects">Voir les projets</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nouveau projet</CardTitle>
            <CardDescription>Créez un nouveau projet</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/projects/new">Créer un projet</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paramètres</CardTitle>
            <CardDescription>Configurez votre compte</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/settings">Paramètres</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Premiers pas</CardTitle>
          <CardDescription>Commencez votre premier projet en quelques minutes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            1. Créez un nouveau projet en répondant à quelques questions
          </p>
          <p className="text-sm text-muted-foreground">
            2. Générez automatiquement la structure complète du projet
          </p>
          <p className="text-sm text-muted-foreground">
            3. Téléchargez les fichiers et commencez à coder dans Cursor
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

