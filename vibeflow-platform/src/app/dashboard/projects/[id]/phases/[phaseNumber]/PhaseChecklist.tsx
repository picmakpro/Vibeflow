// src/app/dashboard/projects/[id]/phases/[phaseNumber]/PhaseChecklist.tsx
// Composant client pour la checklist interactive
// Sprint 2 - AI Generation & Dashboard

'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChecklistItem, PhaseProgress, UnlockButton } from '@/components/phases'
import { useRouter } from 'next/navigation'
import type { ChecklistItem as ChecklistItemType } from '@prisma/client'
import { Sparkles } from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface PhaseChecklistProps {
  projectId: string
  phaseNumber: number
  items: ChecklistItemType[]
  progressPercentage: number
}

// ============================================
// COMPONENT
// ============================================

export function PhaseChecklist({
  projectId,
  phaseNumber,
  items: initialItems,
  progressPercentage: initialProgress,
}: PhaseChecklistProps) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [progress, setProgress] = useState(initialProgress)
  const [unlockedPhase, setUnlockedPhase] = useState<{
    phaseNumber: number
    phaseName: string
  } | null>(null)

  // Calculer les stats
  const totalItems = items.length
  const completedItems = items.filter(i => i.status === 'COMPLETED').length

  // Callback pour la mise à jour d'un item
  const handleItemUpdate = useCallback((result: {
    item: ChecklistItemType
    phaseProgress: number
    phaseUnlocked?: { phaseNumber: number; phaseName: string }
  }) => {
    // Mettre à jour l'item dans la liste locale
    setItems(prev => prev.map(item => 
      item.id === result.item.id ? result.item : item
    ))

    // Mettre à jour la progression
    setProgress(result.phaseProgress)

    // Notifier si une phase a été débloquée
    if (result.phaseUnlocked) {
      setUnlockedPhase(result.phaseUnlocked)
    }
  }, [])

  // Callback pour le déblocage manuel
  const handleUnlock = useCallback((unlocked: { phaseNumber: number; phaseName: string }) => {
    setUnlockedPhase(unlocked)
    // Rafraîchir la page pour voir les changements
    router.refresh()
  }, [router])

  // Noms des phases pour l'affichage
  const phaseNames: Record<number, string> = {
    1: 'Validation de Marché',
    2: 'Setup & Context Engineering',
    3: 'Architecture & Planification',
  }

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progression</span>
            {phaseNumber < 3 && (
              <UnlockButton
                projectId={projectId}
                currentPhaseNumber={phaseNumber}
                progressPercentage={progress}
                nextPhaseName={phaseNames[phaseNumber + 1]}
                onUnlock={handleUnlock}
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PhaseProgress
            completed={completedItems}
            total={totalItems}
            percentage={progress}
            showUnlockThreshold={phaseNumber < 3}
          />
        </CardContent>
      </Card>

      {/* Unlocked Phase Notification */}
      {unlockedPhase && (
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:border-emerald-800 dark:from-emerald-950/30 dark:to-teal-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <Sparkles className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                  🎉 Phase {unlockedPhase.phaseNumber} débloquée !
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {unlockedPhase.phaseName} est maintenant accessible.
                  La génération du contenu va démarrer automatiquement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checklist Items */}
      <Card>
        <CardHeader>
          <CardTitle>Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.length > 0 ? (
              items.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  onUpdate={handleItemUpdate}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Aucun item de checklist pour cette phase.
                La génération est peut-être encore en cours.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

