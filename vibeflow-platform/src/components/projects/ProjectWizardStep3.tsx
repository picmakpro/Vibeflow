// src/components/projects/ProjectWizardStep3.tsx
// VF-014 : Troisième step du wizard (Confirmation)
// Sprint 1 - Foundation & Wizard

'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { APP_TYPE_LABELS, STACK_OPTIONS, type WizardFormData } from '@/lib/validations/project'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Rocket, 
  Sparkles,
  FileText,
  Code,
  Target,
  Users,
  Zap,
  Wrench
} from 'lucide-react'

interface ProjectWizardStep3Props {
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function ProjectWizardStep3({ onBack, onSubmit, isSubmitting }: ProjectWizardStep3Props) {
  const { watch } = useFormContext<WizardFormData>()

  const formData = watch()

  const getStackLabels = (values: string[]) => {
    return values
      .map((v) => STACK_OPTIONS.find((o) => o.value === v)?.label || v)
      .join(', ')
  }

  return (
    <div className="space-y-6">
      {/* Header avec icône */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Étape 3 : Confirmation</h2>
          <p className="text-muted-foreground">
            Vérifiez les informations avant de lancer la génération
          </p>
        </div>
      </div>

      {/* Récapitulatif */}
      <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            Récapitulatif de votre projet
          </CardTitle>
          <CardDescription>
            Voici les informations que vous avez saisies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nom et type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Rocket className="h-4 w-4" />
                Nom du projet
              </div>
              <p className="text-lg font-semibold">{formData.name || 'Non renseigné'}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Code className="h-4 w-4" />
                Type d&apos;application
              </div>
              <p className="text-lg font-semibold">
                {formData.appType ? APP_TYPE_LABELS[formData.appType] : 'Non sélectionné'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Target className="h-4 w-4" />
              Description
            </div>
            <p className="text-sm leading-relaxed bg-white/50 dark:bg-black/20 rounded-lg p-3 border">
              {formData.description || 'Non renseigné'}
            </p>
          </div>

          {/* Utilisateurs cibles */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4" />
              Utilisateurs cibles
            </div>
            <p className="text-sm leading-relaxed bg-white/50 dark:bg-black/20 rounded-lg p-3 border">
              {formData.targetUsers || 'Non renseigné'}
            </p>
          </div>

          {/* Problème résolu */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Zap className="h-4 w-4" />
              Problème résolu
            </div>
            <p className="text-sm leading-relaxed bg-white/50 dark:bg-black/20 rounded-lg p-3 border">
              {formData.problemSolved || 'Non renseigné'}
            </p>
          </div>

          {/* Concurrents */}
          {formData.competitors && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Target className="h-4 w-4" />
                Concurrents identifiés
              </div>
              <p className="text-sm">{formData.competitors}</p>
            </div>
          )}

          {/* Stack technique */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Wrench className="h-4 w-4" />
              Stack technique
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.stackPreference?.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200"
                >
                  {STACK_OPTIONS.find((o) => o.value === tech)?.label || tech}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ce qui va être généré */}
      <Card className="border-2 border-dashed border-violet-200 dark:border-violet-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            Ce qui va être généré
          </CardTitle>
          <CardDescription>
            VibeFlow va créer automatiquement ces éléments pour votre projet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Phase 1</p>
                <p className="text-sm text-muted-foreground">Validation de Marché</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">Phase 2</p>
                <p className="text-sm text-muted-foreground">Setup & Context Engineering</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">Phase 3</p>
                <p className="text-sm text-muted-foreground">Architecture & Planification</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temps estimé */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-100">
                Temps de génération estimé : 2-3 minutes
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Vous recevrez un email quand votre projet sera prêt, ou vous pouvez attendre sur cette page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button 
          onClick={onSubmit}
          size="lg"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Générer mon projet
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

