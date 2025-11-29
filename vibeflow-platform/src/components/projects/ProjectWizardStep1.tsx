// src/components/projects/ProjectWizardStep1.tsx
// VF-012 : Premier step du wizard (Idée de Base)
// Sprint 1 - Foundation & Wizard

'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APP_TYPE_LABELS, type AppType, type WizardFormData } from '@/lib/validations/project'
import { ArrowRight, Lightbulb, Rocket, Target } from 'lucide-react'

interface ProjectWizardStep1Props {
  onNext: () => void
}

const appTypeOptions: { value: AppType; label: string }[] = [
  { value: 'SAAS_B2B', label: APP_TYPE_LABELS.SAAS_B2B },
  { value: 'SAAS_B2C', label: APP_TYPE_LABELS.SAAS_B2C },
  { value: 'MOBILE_APP', label: APP_TYPE_LABELS.MOBILE_APP },
  { value: 'CHROME_EXTENSION', label: APP_TYPE_LABELS.CHROME_EXTENSION },
  { value: 'API_BACKEND', label: APP_TYPE_LABELS.API_BACKEND },
]

export function ProjectWizardStep1({ onNext }: ProjectWizardStep1Props) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext<WizardFormData>()

  const appType = watch('appType')

  const handleNext = async () => {
    // Valider uniquement les champs du step 1
    const isValid = await trigger(['name', 'description', 'appType'])
    if (isValid) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header avec icône */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
          <Lightbulb className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Étape 1 : Votre Idée</h2>
          <p className="text-muted-foreground">
            Décrivez votre projet en quelques mots
          </p>
        </div>
      </div>

      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-violet-500" />
            Informations de base
          </CardTitle>
          <CardDescription>
            Ces informations nous aideront à générer une structure adaptée à votre projet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nom du projet */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              Nom du projet <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="ex: VibeFlow, TaskMaster, DataSync..."
              className="h-11"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                {errors.name.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Choisissez un nom court et mémorable (3-100 caractères)
            </p>
          </div>

          {/* Type d'application */}
          <div className="space-y-2">
            <Label htmlFor="appType" className="text-base font-medium">
              Type d&apos;application <span className="text-red-500">*</span>
            </Label>
            <Select
              value={appType || undefined}
              onValueChange={(value: AppType) => setValue('appType', value, { shouldValidate: true })}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Sélectionnez le type de votre application" />
              </SelectTrigger>
              <SelectContent>
                {appTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.appType && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                {errors.appType.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description de votre idée <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre idée d'application en détail : quel problème résout-elle ? Quelles sont les fonctionnalités principales ? Qu'est-ce qui la rend unique ?

Exemple : 'Une plateforme SaaS qui permet aux développeurs de structurer leurs projets de développement IA-native. Elle génère automatiquement la documentation technique, les checklists de validation et les exports optimisés pour Cursor.'"
              className="min-h-[180px] resize-none"
              {...register('description')}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                {errors.description.message}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <p>Minimum 100 caractères pour une génération de qualité</p>
              <p className={watch('description')?.length >= 100 ? 'text-green-500' : ''}>
                {watch('description')?.length || 0}/2000
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips card */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-violet-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-violet-900 dark:text-violet-100">
                💡 Conseil pour une meilleure génération
              </p>
              <p className="text-sm text-violet-700 dark:text-violet-300">
                Plus votre description est détaillée, meilleure sera la structure générée. 
                Incluez les fonctionnalités clés, le public cible et ce qui différencie votre idée.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleNext}
          size="lg"
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
        >
          Continuer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

