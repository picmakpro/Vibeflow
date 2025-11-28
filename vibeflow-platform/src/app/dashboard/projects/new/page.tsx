// src/app/dashboard/projects/new/page.tsx
// Formulaire de création de projet

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewProjectPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouveau Projet</h1>
        <p className="text-muted-foreground">
          Créez un nouveau projet de développement IA-Native
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wizard de création</CardTitle>
          <CardDescription>
            Cette fonctionnalité sera implémentée dans la Phase 2
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Le wizard de création de projet avec formulaire multi-étapes sera disponible prochainement.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            <strong>Prochaines étapes :</strong>
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
            <li>Formulaire multi-étapes (3 steps)</li>
            <li>Questions intelligentes sur votre projet</li>
            <li>Génération automatique des 10 phases</li>
            <li>Dashboard de suivi en temps réel</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

