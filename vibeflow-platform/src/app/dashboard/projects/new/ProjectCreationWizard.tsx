// src/app/dashboard/projects/new/ProjectCreationWizard.tsx
// VF-015 : Composant client du wizard de création de projet
// Sprint 1 - Foundation & Wizard

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import {
  ProjectWizardStep1,
  ProjectWizardStep2,
  ProjectWizardStep3,
  WizardProgressIndicator,
  WIZARD_STEPS,
} from '@/components/projects'
import {
  wizardFormSchema,
  type WizardFormData,
  defaultWizardFormData,
} from '@/lib/validations/project'
import { createProject } from '@/app/actions/projects'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function ProjectCreationWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const methods = useForm<WizardFormData>({
    resolver: zodResolver(wizardFormSchema),
    defaultValues: defaultWizardFormData,
    mode: 'onBlur',
  })

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    setError(null)
    
    startTransition(async () => {
      try {
        const formData = methods.getValues()
        
        // Préparer les données pour le serveur
        const projectData = {
          name: formData.name,
          description: formData.description,
          appType: formData.appType as 'SAAS_B2B' | 'SAAS_B2C' | 'MOBILE_APP' | 'CHROME_EXTENSION' | 'API_BACKEND',
          targetUsers: formData.targetUsers,
          problemSolved: formData.problemSolved,
          competitors: formData.competitors || '',
          stackPreference: formData.stackPreference,
        }

        const result = await createProject(projectData)

        if (result.success && result.data?.projectId) {
          // Rediriger vers la page du projet
          router.push(`/dashboard/projects/${result.data.projectId}`)
        } else {
          setError(result.error || 'Une erreur est survenue lors de la création du projet')
        }
      } catch (err) {
        console.error('Erreur lors de la création du projet:', err)
        setError('Une erreur inattendue est survenue. Veuillez réessayer.')
      }
    })
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/projects"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux projets
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <span>Powered by Claude 3.5 Sonnet</span>
          </div>
        </div>

        {/* Titre */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Créer un nouveau projet
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Répondez à quelques questions et VibeFlow générera automatiquement la structure complète 
            de votre projet avec checklists, documentation et exports Cursor.
          </p>
        </div>

        {/* Progress indicator */}
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="pt-6">
            <WizardProgressIndicator currentStep={currentStep} steps={WIZARD_STEPS} />
          </CardContent>
        </Card>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Step content */}
        <div className="min-h-[500px]">
          {currentStep === 1 && (
            <ProjectWizardStep1 onNext={goToNextStep} />
          )}
          {currentStep === 2 && (
            <ProjectWizardStep2 onNext={goToNextStep} onBack={goToPreviousStep} />
          )}
          {currentStep === 3 && (
            <ProjectWizardStep3
              onBack={goToPreviousStep}
              onSubmit={handleSubmit}
              isSubmitting={isPending}
            />
          )}
        </div>
      </div>
    </FormProvider>
  )
}

