// src/components/projects/ProjectWizardStep2.tsx
// VF-013 : Deuxième step du wizard (Questions Intelligentes)
// Sprint 1 - Foundation & Wizard

'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { STACK_OPTIONS, type WizardFormData } from '@/lib/validations/project'
import { ArrowLeft, ArrowRight, Users, Wrench, Zap, Shield } from 'lucide-react'

interface ProjectWizardStep2Props {
  onNext: () => void
  onBack: () => void
}

export function ProjectWizardStep2({ onNext, onBack }: ProjectWizardStep2Props) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext<WizardFormData>()

  const stackPreference = watch('stackPreference') || []

  const handleStackToggle = (value: string) => {
    const currentStack = stackPreference || []
    const newStack = currentStack.includes(value)
      ? currentStack.filter((v) => v !== value)
      : [...currentStack, value]
    setValue('stackPreference', newStack, { shouldValidate: true })
  }

  const handleNext = async () => {
    const isValid = await trigger(['targetUsers', 'problemSolved', 'competitors', 'stackPreference'])
    if (isValid) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header avec icône */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Étape 2 : Contexte Projet</h2>
          <p className="text-muted-foreground">
            Aidez-nous à mieux comprendre votre projet
          </p>
        </div>
      </div>

      {/* Utilisateurs cibles */}
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Utilisateurs cibles
          </CardTitle>
          <CardDescription>
            Décrivez qui utilisera votre application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetUsers" className="text-base font-medium">
              Pour qui est cette application ? <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="targetUsers"
              placeholder="Exemple : 'Développeurs freelance et solopreneurs tech qui veulent structurer leurs projets de développement avec des outils IA comme Cursor. Ils ont entre 25-45 ans, sont autonomes et cherchent à gagner du temps sur la préparation de leurs projets.'"
              className="min-h-[120px] resize-none"
              {...register('targetUsers')}
              aria-invalid={!!errors.targetUsers}
            />
            {errors.targetUsers && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                {errors.targetUsers.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Décrivez leurs profils, besoins et comportements (min. 50 caractères)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Problème résolu */}
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Problème résolu
          </CardTitle>
          <CardDescription>
            Quel est le principal problème que votre application résout ?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="problemSolved" className="text-base font-medium">
              Quel problème résolvez-vous ? <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="problemSolved"
              placeholder="Exemple : 'Les développeurs perdent 4-6 heures à structurer chaque nouveau projet. Sans méthodologie claire, ils abandonnent souvent leurs projets après quelques semaines. Le code généré par l'IA est souvent incohérent car le contexte est mal préparé.'"
              className="min-h-[120px] resize-none"
              {...register('problemSolved')}
              aria-invalid={!!errors.problemSolved}
            />
            {errors.problemSolved && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                {errors.problemSolved.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Soyez spécifique sur les douleurs de vos utilisateurs (min. 50 caractères)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Concurrents */}
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Concurrents (optionnel)
          </CardTitle>
          <CardDescription>
            Listez vos principaux concurrents ou alternatives existantes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="competitors" className="text-base font-medium">
              Concurrents connus
            </Label>
            <Input
              id="competitors"
              placeholder="ex: Notion, Linear, Trello, CodeGuide.dev..."
              className="h-11"
              {...register('competitors')}
              aria-invalid={!!errors.competitors}
            />
            {errors.competitors && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                {errors.competitors.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Séparez les noms par des virgules (optionnel mais recommandé)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stack technique */}
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-violet-500" />
            Stack technique préférée
          </CardTitle>
          <CardDescription>
            Sélectionnez les technologies que vous souhaitez utiliser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Technologies <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {STACK_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    stackPreference.includes(option.value)
                      ? 'bg-violet-50 border-violet-300 dark:bg-violet-950/30 dark:border-violet-700'
                      : 'hover:bg-muted/50 border-muted-foreground/20'
                  }`}
                  onClick={() => handleStackToggle(option.value)}
                >
                  <Checkbox
                    id={`stack-${option.value}`}
                    checked={stackPreference.includes(option.value)}
                    onCheckedChange={() => handleStackToggle(option.value)}
                  />
                  <Label
                    htmlFor={`stack-${option.value}`}
                    className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {errors.stackPreference && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                {errors.stackPreference.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Sélectionnez au moins une technologie (max. 10)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button 
          onClick={handleNext}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          Continuer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

