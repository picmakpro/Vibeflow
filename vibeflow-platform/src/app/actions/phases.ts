// src/app/actions/phases.ts
// VF-040 & VF-041 : Server Actions pour les phases et checklist items
// Sprint 2 - AI Generation & Dashboard

'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import type { Phase, ChecklistItem, Project } from '@prisma/client'
import { triggerSinglePhaseGeneration } from '@/lib/inngest/client'

// ============================================
// TYPES
// ============================================

interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

interface PhaseWithDetails extends Phase {
  checklistItems: ChecklistItem[]
  project: Pick<Project, 'id' | 'name' | 'status'>
}

// ============================================
// VF-040: GET PHASE
// ============================================

/**
 * Récupère une phase spécifique avec ses checklist items
 * Vérifie l'authentification et l'ownership via le projet
 */
export async function getPhase(
  projectId: string,
  phaseNumber: number
): Promise<ActionResponse<PhaseWithDetails>> {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Vous devez être connecté' }
    }

    // 2. Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { organizationId: true },
    })

    if (!user) {
      return { success: false, error: 'Utilisateur non trouvé' }
    }

    // 3. Récupérer la phase avec vérification d'appartenance
    const phase = await prisma.phase.findFirst({
      where: {
        projectId,
        phaseNumber,
        project: {
          organizationId: user.organizationId, // Isolation multi-tenant
        },
      },
      include: {
        checklistItems: {
          orderBy: { orderIndex: 'asc' },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    })

    if (!phase) {
      return { success: false, error: 'Phase non trouvée' }
    }

    // 4. Vérifier si la phase est accessible
    if (phase.status === 'LOCKED') {
      return { success: false, error: 'Cette phase est encore verrouillée' }
    }

    return { success: true, data: phase }
  } catch (error) {
    console.error('[getPhase] Erreur:', error)
    return { success: false, error: 'Impossible de charger la phase' }
  }
}

// ============================================
// VF-041: UPDATE CHECKLIST ITEM
// ============================================

interface UpdateChecklistItemInput {
  itemId: string
  status?: 'PENDING' | 'COMPLETED'
  userInput?: string
}

interface UpdateChecklistItemResult {
  item: ChecklistItem
  phaseProgress: number
  phaseUnlocked?: {
    phaseNumber: number
    phaseName: string
  }
}

/**
 * Met à jour un item de checklist (cocher/décocher, ajouter notes)
 * Recalcule automatiquement la progression de la phase
 * Déclenche le déblocage de la phase suivante si ≥80%
 */
export async function updateChecklistItem(
  input: UpdateChecklistItemInput
): Promise<ActionResponse<UpdateChecklistItemResult>> {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Vous devez être connecté' }
    }

    // 2. Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { organizationId: true },
    })

    if (!user) {
      return { success: false, error: 'Utilisateur non trouvé' }
    }

    // 3. Récupérer l'item avec sa phase et le projet
    const item = await prisma.checklistItem.findUnique({
      where: { id: input.itemId },
      include: {
        phase: {
          include: {
            project: {
              select: {
                id: true,
                organizationId: true,
              },
            },
            checklistItems: true,
          },
        },
      },
    })

    if (!item) {
      return { success: false, error: 'Item non trouvé' }
    }

    // 4. Vérifier l'ownership (multi-tenant)
    if (item.phase.project.organizationId !== user.organizationId) {
      return { success: false, error: 'Accès non autorisé' }
    }

    // 5. Vérifier que la phase n'est pas verrouillée
    if (item.phase.status === 'LOCKED') {
      return { success: false, error: 'Cette phase est verrouillée' }
    }

    // 6. Préparer les données de mise à jour
    const updateData: {
      status?: 'PENDING' | 'COMPLETED'
      completedAt?: Date | null
      userInput?: { notes: string }
    } = {}

    if (input.status !== undefined) {
      updateData.status = input.status
      updateData.completedAt = input.status === 'COMPLETED' ? new Date() : null
    }

    if (input.userInput !== undefined) {
      updateData.userInput = { notes: input.userInput }
    }

    // 7. Mettre à jour l'item
    const updatedItem = await prisma.checklistItem.update({
      where: { id: input.itemId },
      data: updateData,
    })

    // 8. Recalculer la progression de la phase
    const allItems = item.phase.checklistItems
    const completedCount = allItems.filter((i) => {
      if (i.id === input.itemId) {
        return input.status === 'COMPLETED'
      }
      return i.status === 'COMPLETED'
    }).length

    const progressPercentage = Math.round((completedCount / allItems.length) * 100)

    // 9. Mettre à jour la phase
    const phaseStatus = progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS'
    
    await prisma.phase.update({
      where: { id: item.phase.id },
      data: {
        progressPercentage,
        status: item.phase.status === 'UNLOCKED' || item.phase.status === 'IN_PROGRESS' 
          ? phaseStatus 
          : item.phase.status,
        completedAt: progressPercentage >= 100 ? new Date() : null,
      },
    })

    // 10. Vérifier si on doit débloquer la phase suivante (≥80%)
    let phaseUnlocked: { phaseNumber: number; phaseName: string } | undefined

    if (progressPercentage >= 80) {
      // Chercher la phase suivante
      const nextPhase = await prisma.phase.findFirst({
        where: {
          projectId: item.phase.project.id,
          phaseNumber: item.phase.phaseNumber + 1,
          status: 'LOCKED',
        },
      })

      if (nextPhase) {
        // Débloquer la phase suivante
        await prisma.phase.update({
          where: { id: nextPhase.id },
          data: {
            status: 'UNLOCKED',
            unlockedAt: new Date(),
          },
        })

        phaseUnlocked = {
          phaseNumber: nextPhase.phaseNumber,
          phaseName: nextPhase.phaseName,
        }

        console.log(`[updateChecklistItem] Phase ${nextPhase.phaseNumber} débloquée`)

        // Déclencher la génération du contenu via Inngest
        try {
          await triggerSinglePhaseGeneration(item.phase.project.id, nextPhase.phaseNumber)
          console.log(`[updateChecklistItem] Génération Phase ${nextPhase.phaseNumber} déclenchée via Inngest`)
        } catch (inngestError) {
          console.error(`[updateChecklistItem] Erreur déclenchement Inngest:`, inngestError)
          // On ne fail pas la requête, la phase est débloquée mais sans contenu généré
        }
      }
    }

    // 11. Revalider le cache
    revalidatePath(`/dashboard/projects/${item.phase.project.id}`)
    revalidatePath(`/dashboard/projects/${item.phase.project.id}/phases/${item.phase.phaseNumber}`)

    return {
      success: true,
      data: {
        item: updatedItem,
        phaseProgress: progressPercentage,
        phaseUnlocked,
      },
    }
  } catch (error) {
    console.error('[updateChecklistItem] Erreur:', error)
    return { success: false, error: 'Impossible de mettre à jour l\'item' }
  }
}

// ============================================
// VF-051: UNLOCK NEXT PHASE (Manual)
// ============================================

/**
 * Débloque manuellement la phase suivante
 * Requiert que la phase courante soit ≥80% complétée
 */
export async function unlockNextPhase(
  projectId: string,
  currentPhaseNumber: number
): Promise<ActionResponse<{ unlockedPhase: Pick<Phase, 'id' | 'phaseNumber' | 'phaseName'> }>> {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Vous devez être connecté' }
    }

    // 2. Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { organizationId: true },
    })

    if (!user) {
      return { success: false, error: 'Utilisateur non trouvé' }
    }

    // 3. Récupérer la phase courante
    const currentPhase = await prisma.phase.findFirst({
      where: {
        projectId,
        phaseNumber: currentPhaseNumber,
        project: {
          organizationId: user.organizationId,
        },
      },
    })

    if (!currentPhase) {
      return { success: false, error: 'Phase non trouvée' }
    }

    // 4. Vérifier que la phase courante est ≥80%
    if (currentPhase.progressPercentage < 80) {
      return { 
        success: false, 
        error: `La phase ${currentPhaseNumber} doit être complétée à au moins 80% (actuellement ${currentPhase.progressPercentage}%)` 
      }
    }

    // 5. Récupérer la phase suivante
    const nextPhase = await prisma.phase.findFirst({
      where: {
        projectId,
        phaseNumber: currentPhaseNumber + 1,
      },
    })

    if (!nextPhase) {
      return { success: false, error: 'Aucune phase suivante disponible' }
    }

    if (nextPhase.status !== 'LOCKED') {
      return { success: false, error: 'La phase suivante est déjà débloquée' }
    }

    // 6. Débloquer la phase suivante
    const unlockedPhase = await prisma.phase.update({
      where: { id: nextPhase.id },
      data: {
        status: 'UNLOCKED',
        unlockedAt: new Date(),
      },
      select: {
        id: true,
        phaseNumber: true,
        phaseName: true,
      },
    })

    // 7. Déclencher la génération du contenu via Inngest
    try {
      await triggerSinglePhaseGeneration(projectId, unlockedPhase.phaseNumber)
      console.log(`[unlockNextPhase] Génération Phase ${unlockedPhase.phaseNumber} déclenchée via Inngest`)
    } catch (inngestError) {
      console.error(`[unlockNextPhase] Erreur déclenchement Inngest:`, inngestError)
      // On ne fail pas, la phase est débloquée mais devra être re-générée manuellement
    }

    // 8. Revalider le cache
    revalidatePath(`/dashboard/projects/${projectId}`)

    return {
      success: true,
      data: { unlockedPhase },
    }
  } catch (error) {
    console.error('[unlockNextPhase] Erreur:', error)
    return { success: false, error: 'Impossible de débloquer la phase suivante' }
  }
}

// ============================================
// GET PHASE CONTENT (for rendering)
// ============================================

/**
 * Récupère le contenu généré d'une phase (markdown)
 */
export async function getPhaseContent(
  projectId: string,
  phaseNumber: number
): Promise<ActionResponse<{ markdown: string; metadata?: Record<string, unknown> }>> {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Vous devez être connecté' }
    }

    // 2. Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { organizationId: true },
    })

    if (!user) {
      return { success: false, error: 'Utilisateur non trouvé' }
    }

    // 3. Récupérer la phase
    const phase = await prisma.phase.findFirst({
      where: {
        projectId,
        phaseNumber,
        project: {
          organizationId: user.organizationId,
        },
      },
      select: {
        status: true,
        generatedContent: true,
      },
    })

    if (!phase) {
      return { success: false, error: 'Phase non trouvée' }
    }

    if (phase.status === 'LOCKED') {
      return { success: false, error: 'Cette phase est verrouillée' }
    }

    if (!phase.generatedContent) {
      return { success: false, error: 'Le contenu de cette phase n\'a pas encore été généré' }
    }

    // Le contenu est stocké en JSON
    const content = phase.generatedContent as { markdown?: string; metadata?: Record<string, unknown> }

    return {
      success: true,
      data: {
        markdown: content.markdown || '',
        metadata: content.metadata,
      },
    }
  } catch (error) {
    console.error('[getPhaseContent] Erreur:', error)
    return { success: false, error: 'Impossible de charger le contenu de la phase' }
  }
}

