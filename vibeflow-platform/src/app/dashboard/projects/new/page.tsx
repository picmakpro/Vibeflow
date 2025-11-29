// src/app/dashboard/projects/new/page.tsx
// VF-015 : Page wizard de création de projet
// Sprint 1 - Foundation & Wizard

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ProjectCreationWizard } from './ProjectCreationWizard'

export default async function NewProjectPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="container max-w-4xl py-8">
      <ProjectCreationWizard />
    </div>
  )
}
