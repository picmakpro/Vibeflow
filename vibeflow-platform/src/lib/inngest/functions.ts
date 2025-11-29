// src/lib/inngest/functions.ts
// VF-023 : Fonctions Inngest pour la génération de phases
// Sprint 1 - Foundation & Wizard

import { inngest } from './client'
import { prisma } from '@/lib/db/prisma'
import { generatePhaseReport, type ProjectContext } from '@/lib/services/anthropic'
import { parsePhaseReport, validatePhaseReport } from '@/lib/parsers/markdown'

// ============================================
// JOB : GÉNÉRATION DES PHASES
// ============================================

/**
 * Job principal pour générer les phases d'un projet
 * Appelé après la création d'un projet
 */
export const generateProjectPhases = inngest.createFunction(
  {
    id: 'generate-project-phases',
    name: 'Generate Project Phases',
    retries: 3,
    // Timeout de 10 minutes max
  },
  { event: 'project/generate-phases' },
  async ({ event, step }) => {
    const { projectId, phasesToGenerate } = event.data

    console.log(`[Inngest] Début génération phases pour projet ${projectId}`)

    // 1. Charger le projet depuis la DB
    const project = await step.run('load-project', async () => {
      const p = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          createdBy: {
            select: { email: true, name: true },
          },
          phases: true,
        },
      })

      if (!p) {
        throw new Error(`Projet ${projectId} non trouvé`)
      }

      return p
    })

    // 2. Préparer le contexte pour l'IA
    const context: ProjectContext = {
      projectName: project.name,
      appType: project.appType,
      description: project.description || project.ideaSummary,
      targetUsers: project.targetUsers,
      problemSolved: project.ideaSummary,
      competitors: '', // TODO: Ajouter ce champ au schéma
      stackPreference: [], // TODO: Ajouter ce champ au schéma
    }

    // 3. Générer chaque phase
    for (const phaseNumber of phasesToGenerate) {
      await step.run(`generate-phase-${phaseNumber}`, async () => {
        console.log(`[Inngest] Génération Phase ${phaseNumber}`)

        // Générer le rapport avec Claude
        const result = await generatePhaseReport(phaseNumber, context)

        if (!result.success || !result.content) {
          console.error(`[Inngest] Échec génération Phase ${phaseNumber}:`, result.error)
          throw new Error(result.error || 'Échec de génération')
        }

        // Parser le rapport
        const parsed = parsePhaseReport(result.content)
        
        // Valider le rapport
        const validation = validatePhaseReport(parsed, phaseNumber)
        if (!validation.valid) {
          console.warn(`[Inngest] Rapport Phase ${phaseNumber} invalide:`, validation.errors)
          // On continue quand même, le rapport peut être incomplet mais utilisable
        }

        // Trouver la phase en DB
        const phase = project.phases.find((p) => p.phaseNumber === phaseNumber)
        if (!phase) {
          throw new Error(`Phase ${phaseNumber} non trouvée pour le projet`)
        }

        // Sauvegarder le rapport en DB
        await prisma.$transaction(async (tx) => {
          // 1. Mettre à jour le contenu de la phase
          await tx.phase.update({
            where: { id: phase.id },
            data: {
              generatedContent: {
                markdown: result.content,
                sections: parsed.sections.map((s) => ({
                  title: s.title,
                  level: s.level,
                })),
                metadata: parsed.metadata,
                generatedAt: new Date().toISOString(),
                tokensUsed: result.tokensUsed,
                model: result.model,
              },
              status: phaseNumber === 1 ? 'UNLOCKED' : phase.status,
              unlockedAt: phaseNumber === 1 ? new Date() : phase.unlockedAt,
            },
          })

          // 2. Créer les items de checklist
          if (parsed.checklistItems.length > 0) {
            await tx.checklistItem.createMany({
              data: parsed.checklistItems.map((item) => ({
                phaseId: phase.id,
                title: item.title,
                description: item.description,
                estimatedTime: item.estimatedTime,
                required: item.required,
                orderIndex: item.orderIndex,
                status: 'PENDING',
              })),
            })
          }
        })

        console.log(`[Inngest] Phase ${phaseNumber} générée avec succès`)
        return { phaseNumber, success: true }
      })

      // Pause entre les générations pour éviter le rate limiting
      if (phaseNumber < Math.max(...phasesToGenerate)) {
        await step.sleep('wait-between-phases', '3s')
      }
    }

    // 4. Mettre à jour le statut du projet
    await step.run('update-project-status', async () => {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'ACTIVE' },
      })
    })

    // 5. Envoyer la notification email (optionnel)
    // TODO: Implémenter l'envoi d'email avec Resend
    // await step.sendEvent('send-notification', {
    //   name: 'notification/send-email',
    //   data: {
    //     to: project.createdBy.email,
    //     subject: `Votre projet "${project.name}" est prêt !`,
    //     template: 'project-ready',
    //     data: { projectName: project.name, projectId },
    //   },
    // })

    console.log(`[Inngest] Génération terminée pour projet ${projectId}`)

    return {
      projectId,
      phasesGenerated: phasesToGenerate,
      success: true,
    }
  }
)

// ============================================
// JOB : GÉNÉRATION D'UNE SEULE PHASE
// ============================================

/**
 * Job pour générer une seule phase (utilisé lors du déblocage progressif)
 */
export const generateSinglePhase = inngest.createFunction(
  {
    id: 'generate-single-phase',
    name: 'Generate Single Phase',
    retries: 3,
  },
  { event: 'project/generate-single-phase' },
  async ({ event, step }) => {
    const { projectId, phaseNumber } = event.data

    console.log(`[Inngest] Génération Phase ${phaseNumber} pour projet ${projectId}`)

    // Charger le projet
    const project = await step.run('load-project', async () => {
      const p = await prisma.project.findUnique({
        where: { id: projectId },
        include: { phases: true },
      })

      if (!p) {
        throw new Error(`Projet ${projectId} non trouvé`)
      }

      return p
    })

    // Préparer le contexte
    const context: ProjectContext = {
      projectName: project.name,
      appType: project.appType,
      description: project.description || project.ideaSummary,
      targetUsers: project.targetUsers,
      problemSolved: project.ideaSummary,
      competitors: '',
      stackPreference: [],
    }

    // Générer la phase
    const result = await step.run('generate-phase', async () => {
      const genResult = await generatePhaseReport(phaseNumber, context)

      if (!genResult.success || !genResult.content) {
        throw new Error(genResult.error || 'Échec de génération')
      }

      const parsed = parsePhaseReport(genResult.content)
      const phase = project.phases.find((p) => p.phaseNumber === phaseNumber)

      if (!phase) {
        throw new Error(`Phase ${phaseNumber} non trouvée`)
      }

      // Sauvegarder en DB
      await prisma.$transaction(async (tx) => {
        await tx.phase.update({
          where: { id: phase.id },
          data: {
            generatedContent: {
              markdown: genResult.content,
              sections: parsed.sections.map((s) => ({
                title: s.title,
                level: s.level,
              })),
              metadata: parsed.metadata,
              generatedAt: new Date().toISOString(),
              tokensUsed: genResult.tokensUsed,
              model: genResult.model,
            },
            status: 'UNLOCKED',
            unlockedAt: new Date(),
          },
        })

        if (parsed.checklistItems.length > 0) {
          await tx.checklistItem.createMany({
            data: parsed.checklistItems.map((item) => ({
              phaseId: phase.id,
              title: item.title,
              description: item.description,
              estimatedTime: item.estimatedTime,
              required: item.required,
              orderIndex: item.orderIndex,
              status: 'PENDING',
            })),
          })
        }
      })

      return { success: true }
    })

    return {
      projectId,
      phaseNumber,
      ...result,
    }
  }
)

// ============================================
// EXPORT DE TOUTES LES FONCTIONS
// ============================================

export const functions = [generateProjectPhases, generateSinglePhase]

