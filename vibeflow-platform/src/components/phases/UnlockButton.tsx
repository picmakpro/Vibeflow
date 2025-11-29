// src/components/phases/UnlockButton.tsx
// VF-052 : Bouton pour débloquer manuellement la phase suivante
// Sprint 2 - AI Generation & Dashboard

'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { unlockNextPhase } from '@/app/actions/phases'
import { Lock, Unlock, Loader2, Sparkles } from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface UnlockButtonProps {
  projectId: string
  currentPhaseNumber: number
  progressPercentage: number
  nextPhaseName?: string
  onUnlock?: (unlockedPhase: { phaseNumber: number; phaseName: string }) => void
}

// ============================================
// COMPONENT
// ============================================

export function UnlockButton({
  projectId,
  currentPhaseNumber,
  progressPercentage,
  nextPhaseName,
  onUnlock,
}: UnlockButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canUnlock = progressPercentage >= 80
  const nextPhaseNumber = currentPhaseNumber + 1

  // Maximum phase dans le MVP est 3
  if (currentPhaseNumber >= 3) {
    return null
  }

  const handleUnlock = () => {
    setError(null)

    startTransition(async () => {
      const result = await unlockNextPhase(projectId, currentPhaseNumber)

      if (result.success && result.data) {
        setShowDialog(false)
        onUnlock?.({
          phaseNumber: result.data.unlockedPhase.phaseNumber,
          phaseName: result.data.unlockedPhase.phaseName,
        })
      } else {
        setError(result.error || 'Une erreur est survenue')
      }
    })
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        disabled={!canUnlock || isPending}
        className={`${
          canUnlock
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
            : ''
        }`}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Déblocage...
          </>
        ) : canUnlock ? (
          <>
            <Unlock className="mr-2 h-4 w-4" />
            Débloquer la Phase {nextPhaseNumber}
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Phase {nextPhaseNumber} verrouillée
          </>
        )}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              Débloquer la Phase {nextPhaseNumber} ?
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Félicitations ! Vous avez atteint {progressPercentage}% de progression
                  sur la Phase {currentPhaseNumber}.
                </p>
                <p>
                  Vous pouvez maintenant débloquer{' '}
                  <strong className="text-foreground">Phase {nextPhaseNumber}{nextPhaseName ? ` - ${nextPhaseName}` : ''}</strong>.
                </p>
                {nextPhaseNumber <= 3 && (
                  <p className="text-muted-foreground/80">
                    La génération du contenu de cette phase sera lancée automatiquement.
                  </p>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              onClick={handleUnlock}
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Déblocage...
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Confirmer le déblocage
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

