// src/components/phases/PhaseProgress.tsx
// VF-044 : Barre de progression de phase
// Sprint 2 - AI Generation & Dashboard

'use client'

import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

interface PhaseProgressProps {
  completed: number
  total: number
  percentage: number
  showUnlockThreshold?: boolean
  className?: string
}

// ============================================
// COMPONENT
// ============================================

export function PhaseProgress({ 
  completed, 
  total, 
  percentage,
  showUnlockThreshold = true,
  className 
}: PhaseProgressProps) {
  // Déterminer la couleur basée sur le pourcentage
  const getProgressColor = () => {
    if (percentage >= 80) return 'bg-emerald-500'
    if (percentage >= 50) return 'bg-amber-500'
    return 'bg-violet-500'
  }

  const getProgressTextColor = () => {
    if (percentage >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (percentage >= 50) return 'text-amber-600 dark:text-amber-400'
    return 'text-violet-600 dark:text-violet-400'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {completed}/{total} items complétés
        </span>
        <span className={cn('font-semibold', getProgressTextColor())}>
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        {/* Progress fill */}
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            getProgressColor()
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />

        {/* 80% threshold marker */}
        {showUnlockThreshold && (
          <div
            className="absolute top-0 h-full w-0.5 bg-muted-foreground/30"
            style={{ left: '80%' }}
            title="Seuil de déblocage (80%)"
          />
        )}
      </div>

      {/* Unlock message */}
      {showUnlockThreshold && (
        <div className="text-xs text-muted-foreground">
          {percentage >= 80 ? (
            <span className="text-emerald-600 dark:text-emerald-400">
              ✓ Seuil de déblocage atteint ! Vous pouvez passer à la phase suivante.
            </span>
          ) : (
            <span>
              Complétez {Math.max(0, Math.ceil(total * 0.8) - completed)} items de plus pour débloquer la phase suivante.
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// COMPACT VARIANT
// ============================================

interface PhaseProgressCompactProps {
  percentage: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function PhaseProgressCompact({
  percentage,
  size = 'md',
  showLabel = true,
  className,
}: PhaseProgressCompactProps) {
  const getProgressColor = () => {
    if (percentage >= 80) return 'bg-emerald-500'
    if (percentage >= 50) return 'bg-amber-500'
    return 'bg-violet-500'
  }

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  }

  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progression</span>
          <span className="font-medium">{percentage}%</span>
        </div>
      )}
      <div className={cn('overflow-hidden rounded-full bg-muted', sizeClasses[size])}>
        <div
          className={cn('h-full transition-all duration-500', getProgressColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

