// src/lib/inngest/client.ts
// VF-023 : Configuration du client Inngest
// Sprint 1 - Foundation & Wizard (corrigé Sprint 2)

import { Inngest } from 'inngest'

// ============================================
// CLIENT INNGEST
// ============================================

/**
 * Client Inngest pour VibeFlow
 * Utilisé pour définir et envoyer des événements
 * 
 * En mode développement : utilise le Dev Server Inngest (localhost:8288)
 * En mode production : utilise Inngest Cloud avec les clés API
 */
export const inngest = new Inngest({
  id: 'vibeflow',
  name: 'VibeFlow Platform',
  // Configuration pour le mode développement
  ...(process.env.NODE_ENV === 'development'
    ? {
        // En dev, utiliser le Dev Server local
        eventKey: process.env.INNGEST_EVENT_KEY || 'local-dev-key',
      }
    : {
        // En production, utiliser les clés Inngest Cloud
        eventKey: process.env.INNGEST_EVENT_KEY,
        signingKey: process.env.INNGEST_SIGNING_KEY,
      }),
})

// ============================================
// TYPES D'ÉVÉNEMENTS
// ============================================

export type Events = {
  // Événement pour générer les phases d'un projet
  'project/generate-phases': {
    data: {
      projectId: string
      phasesToGenerate: number[] // [1, 2, 3] par défaut
    }
  }
  
  // Événement pour générer une seule phase
  'project/generate-single-phase': {
    data: {
      projectId: string
      phaseNumber: number
    }
  }
  
  // Événement pour envoyer une notification email
  'notification/send-email': {
    data: {
      to: string
      subject: string
      template: 'project-ready' | 'phase-unlocked' | 'welcome'
      data: Record<string, unknown>
    }
  }
}

// ============================================
// HELPERS
// ============================================

/**
 * Envoie un événement pour générer les phases d'un projet
 */
export async function triggerPhaseGeneration(
  projectId: string,
  phasesToGenerate: number[] = [1]
) {
  await inngest.send({
    name: 'project/generate-phases',
    data: {
      projectId,
      phasesToGenerate,
    },
  })
}

/**
 * Envoie un événement pour générer une seule phase
 */
export async function triggerSinglePhaseGeneration(
  projectId: string,
  phaseNumber: number
) {
  await inngest.send({
    name: 'project/generate-single-phase',
    data: {
      projectId,
      phaseNumber,
    },
  })
}

/**
 * Envoie une notification par email
 */
export async function triggerEmailNotification(
  to: string,
  subject: string,
  template: 'project-ready' | 'phase-unlocked' | 'welcome',
  data: Record<string, unknown>
) {
  await inngest.send({
    name: 'notification/send-email',
    data: {
      to,
      subject,
      template,
      data,
    },
  })
}

