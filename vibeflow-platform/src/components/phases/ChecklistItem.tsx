// src/components/phases/ChecklistItem.tsx
// VF-042 : Composant ChecklistItem avec checkbox et notes
// Sprint 2 - AI Generation & Dashboard

'use client'

import { useState, useTransition } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateChecklistItem } from '@/app/actions/phases'
import { Clock, ChevronDown, ChevronUp, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import type { ChecklistItem as ChecklistItemType } from '@prisma/client'

// ============================================
// TYPES
// ============================================

interface ChecklistItemProps {
  item: ChecklistItemType
  onUpdate?: (result: {
    item: ChecklistItemType
    phaseProgress: number
    phaseUnlocked?: { phaseNumber: number; phaseName: string }
  }) => void
}

// ============================================
// COMPONENT
// ============================================

export function ChecklistItem({ item, onUpdate }: ChecklistItemProps) {
  const [isPending, startTransition] = useTransition()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<'complete' | 'uncomplete' | null>(null)
  const [notes, setNotes] = useState((item.userInput as { notes?: string } | null)?.notes || '')
  const [error, setError] = useState<string | null>(null)

  const isCompleted = item.status === 'COMPLETED'

  // Gérer le clic sur la checkbox
  const handleCheckboxClick = () => {
    setPendingAction(isCompleted ? 'uncomplete' : 'complete')
    setShowConfirmDialog(true)
  }

  // Confirmer l'action
  const handleConfirm = () => {
    setShowConfirmDialog(false)
    setError(null)

    startTransition(async () => {
      const result = await updateChecklistItem({
        itemId: item.id,
        status: pendingAction === 'complete' ? 'COMPLETED' : 'PENDING',
      })

      if (result.success && result.data) {
        onUpdate?.(result.data)
      } else {
        setError(result.error || 'Une erreur est survenue')
      }
      
      setPendingAction(null)
    })
  }

  // Sauvegarder les notes
  const handleSaveNotes = () => {
    setError(null)

    startTransition(async () => {
      const result = await updateChecklistItem({
        itemId: item.id,
        userInput: notes,
      })

      if (result.success && result.data) {
        onUpdate?.(result.data)
      } else {
        setError(result.error || 'Une erreur est survenue')
      }
    })
  }

  return (
    <div className={`group rounded-lg border bg-card p-4 transition-all ${
      isCompleted 
        ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20' 
        : 'hover:border-violet-200 dark:hover:border-violet-800'
    }`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-0.5">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleCheckboxClick}
            disabled={isPending}
            className={`${isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' : ''}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {/* Title */}
              <h4 className={`font-medium leading-tight ${
                isCompleted ? 'line-through text-muted-foreground' : ''
              }`}>
                {item.title}
              </h4>

              {/* Badges */}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {item.required && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                    Requis
                  </span>
                )}
                {item.estimatedTime && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.estimatedTime}
                  </span>
                )}
              </div>
            </div>

            {/* Expand button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Description (collapsed) */}
          {!isExpanded && item.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Loading indicator */}
        {isPending && (
          <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 ml-7 space-y-4">
          {/* Full description */}
          {item.description && (
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-sm">{item.description}</p>
            </div>
          )}

          {/* Notes section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes personnelles</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez vos notes, liens, ou résultats..."
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveNotes}
                disabled={isPending || notes === ((item.userInput as { notes?: string } | null)?.notes || '')}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les notes'
                )}
              </Button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pendingAction === 'complete' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Marquer comme complété ?
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Marquer comme non complété ?
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === 'complete' ? (
                <>
                  Vous êtes sur le point de marquer &quot;{item.title}&quot; comme complété.
                  Assurez-vous d&apos;avoir bien terminé cette tâche.
                </>
              ) : (
                <>
                  Vous êtes sur le point de marquer &quot;{item.title}&quot; comme non complété.
                  La progression de la phase sera mise à jour.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false)
                setPendingAction(null)
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirm}
              className={pendingAction === 'complete' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

