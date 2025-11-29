// src/components/projects/WizardProgressIndicator.tsx
// Indicateur de progression du wizard
// Sprint 1 - Foundation & Wizard

'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  number: number
  title: string
  description: string
}

interface WizardProgressIndicatorProps {
  currentStep: number
  steps: Step[]
}

export function WizardProgressIndicator({ currentStep, steps }: WizardProgressIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop version */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number
          const isCurrent = currentStep === step.number
          const isUpcoming = currentStep < step.number

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isCompleted && 'bg-emerald-500 border-emerald-500 text-white',
                    isCurrent && 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/30',
                    isUpcoming && 'bg-muted border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isCurrent && 'text-violet-600 dark:text-violet-400',
                      isCompleted && 'text-emerald-600 dark:text-emerald-400',
                      isUpcoming && 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden lg:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-all duration-300',
                    currentStep > step.number + 1 && 'bg-emerald-500',
                    currentStep === step.number + 1 && 'bg-gradient-to-r from-emerald-500 to-violet-500',
                    currentStep <= step.number && 'bg-muted-foreground/20'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile version */}
      <div className="md:hidden">
        <div className="flex items-center justify-center gap-2 mb-4">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number
            const isCurrent = currentStep === step.number

            return (
              <div
                key={step.number}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  isCurrent && 'w-8 bg-violet-600',
                  isCompleted && 'w-8 bg-emerald-500',
                  !isCurrent && !isCompleted && 'w-2 bg-muted-foreground/30'
                )}
              />
            )
          })}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
            Étape {currentStep} sur {steps.length}
          </p>
          <p className="text-xs text-muted-foreground">
            {steps[currentStep - 1]?.title}
          </p>
        </div>
      </div>
    </div>
  )
}

// Configuration des steps par défaut
export const WIZARD_STEPS: Step[] = [
  {
    number: 1,
    title: 'Votre Idée',
    description: 'Décrivez votre projet',
  },
  {
    number: 2,
    title: 'Contexte',
    description: 'Questions intelligentes',
  },
  {
    number: 3,
    title: 'Confirmation',
    description: 'Vérifiez et lancez',
  },
]

