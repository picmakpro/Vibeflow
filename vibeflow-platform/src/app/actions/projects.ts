// src/app/actions/projects.ts
// VF-011 : Server Actions pour les projets
// Sprint 1 - Foundation & Wizard

'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import { createProjectSchema, CreateProjectData, PHASE_NAMES } from '@/lib/validations/project'
import { triggerPhaseGeneration } from '@/lib/inngest'
import type { Project, Phase } from '@prisma/client'

// ============================================
// TYPES
// ============================================

interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  details?: unknown
}

interface ProjectWithPhases extends Project {
  phases: Phase[]
}

// ============================================
// CREATE PROJECT
// ============================================

/**
 * Crée un nouveau projet avec ses 3 phases initiales
 * VF-011 : Server Action createProject()
 */
export async function createProject(
  formData: CreateProjectData
): Promise<ActionResponse<{ projectId: string }>> {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Vous devez être connecté pour créer un projet' }
    }

    // 2. Valider les données avec Zod
    const validationResult = createProjectSchema.safeParse(formData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Données invalides',
        details: validationResult.error.issues,
      }
    }

    const validatedData = validationResult.data

    // 3. Récupérer ou créer l'utilisateur et son organisation
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, organizationId: true },
    })

    // Si l'utilisateur n'existe pas, le créer (fallback pour dev local sans webhook)
    if (!user) {
      console.log('⚠️ User not found in DB, creating fallback user...')
      
      // Récupérer les infos de l'utilisateur depuis Clerk
      const { currentUser } = await import('@clerk/nextjs/server')
      const clerkUser = await currentUser()
      
      if (!clerkUser) {
        return { success: false, error: 'Session expirée. Veuillez vous reconnecter.' }
      }

      // Créer une organisation par défaut pour cet utilisateur
      const organization = await prisma.organization.create({
        data: {
          name: `${clerkUser.firstName || 'User'}'s Organization`,
          slug: `org-${userId.slice(0, 8)}`,
        },
      })

      // Créer l'utilisateur
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
          avatarUrl: clerkUser.imageUrl,
          role: 'OWNER', // Premier utilisateur = owner
          organizationId: organization.id,
        },
        select: { id: true, organizationId: true },
      })

      console.log('✅ Fallback user created:', user.id)
    }

    // 4. Créer le projet avec ses phases dans une transaction
    const project = await prisma.$transaction(async (tx) => {
      // 4a. Créer le projet
      const newProject = await tx.project.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          ideaSummary: validatedData.description, // Utilisé pour la génération IA
          appType: validatedData.appType,
          targetUsers: validatedData.targetUsers,
          status: 'GENERATING', // Le projet est en cours de génération
          organizationId: user.organizationId,
          createdById: user.id,
        },
      })

      // 4b. Créer les 3 phases du MVP
      const phasesData = PHASE_NAMES.map((phase, index) => ({
        projectId: newProject.id,
        phaseNumber: phase.number,
        phaseName: phase.name,
        status: index === 0 ? 'UNLOCKED' as const : 'LOCKED' as const, // Phase 1 débloquée par défaut
        progressPercentage: 0,
        unlockedAt: index === 0 ? new Date() : null,
      }))

      await tx.phase.createMany({
        data: phasesData,
      })

      return newProject
    })

    // 5. Revalider le cache
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/projects')

    // 6. Déclencher le background job pour la génération IA
    try {
      await triggerPhaseGeneration(project.id, [1]) // Génère Phase 1 uniquement au début
      console.log(`[createProject] Job de génération déclenché pour projet ${project.id}`)
    } catch (jobError) {
      console.error('[createProject] Erreur lors du déclenchement du job:', jobError)
      // On ne bloque pas la création du projet si le job échoue
    }

    return {
      success: true,
      data: { projectId: project.id },
    }
  } catch (error) {
    console.error('[createProject] Erreur:', error)

    // Gestion des erreurs Prisma spécifiques
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return { success: false, error: 'Un projet avec ce nom existe déjà' }
      }
    }

    return { success: false, error: 'Une erreur est survenue lors de la création du projet' }
  }
}

// ============================================
// GET PROJECTS (VF-031)
// ============================================

/**
 * Récupère tous les projets de l'utilisateur
 */
export async function getProjects(): Promise<ActionResponse<ProjectWithPhases[]>> {
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

    // 3. Récupérer les projets avec leurs phases
    const projects = await prisma.project.findMany({
      where: { organizationId: user.organizationId },
      include: {
        phases: {
          orderBy: { phaseNumber: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: projects }
  } catch (error) {
    console.error('[getProjects] Erreur:', error)
    return { success: false, error: 'Impossible de charger les projets' }
  }
}

// ============================================
// GET PROJECT BY ID (VF-033)
// ============================================

/**
 * Récupère un projet spécifique avec ses phases et checklist items
 */
export async function getProject(
  projectId: string
): Promise<ActionResponse<Project & { phases: (Phase & { checklistItems: unknown[] })[] }>> {
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

    // 3. Récupérer le projet avec vérification d'appartenance
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId: user.organizationId, // Isolation multi-tenant
      },
      include: {
        phases: {
          orderBy: { phaseNumber: 'asc' },
          include: {
            checklistItems: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    })

    if (!project) {
      return { success: false, error: 'Projet non trouvé' }
    }

    return { success: true, data: project }
  } catch (error) {
    console.error('[getProject] Erreur:', error)
    return { success: false, error: 'Impossible de charger le projet' }
  }
}

// ============================================
// DELETE PROJECT
// ============================================

/**
 * Supprime un projet (et toutes ses phases/items en cascade)
 */
export async function deleteProject(
  projectId: string
): Promise<ActionResponse<{ deleted: boolean }>> {
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

    // 3. Vérifier que le projet appartient à l'organisation
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId: user.organizationId,
      },
    })

    if (!project) {
      return { success: false, error: 'Projet non trouvé' }
    }

    // 4. Supprimer le projet (cascade supprime phases et items)
    await prisma.project.delete({
      where: { id: projectId },
    })

    // 5. Revalider le cache
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/projects')

    return { success: true, data: { deleted: true } }
  } catch (error) {
    console.error('[deleteProject] Erreur:', error)
    return { success: false, error: 'Impossible de supprimer le projet' }
  }
}

// ============================================
// UPDATE PROJECT STATUS
// ============================================

/**
 * Met à jour le statut d'un projet (GENERATING -> ACTIVE -> ARCHIVED)
 */
export async function updateProjectStatus(
  projectId: string,
  status: 'GENERATING' | 'ACTIVE' | 'ARCHIVED'
): Promise<ActionResponse<{ updated: boolean }>> {
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

    // 3. Mettre à jour le projet
    await prisma.project.updateMany({
      where: {
        id: projectId,
        organizationId: user.organizationId,
      },
      data: { status },
    })

    // 4. Revalider le cache
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/projects')
    revalidatePath(`/dashboard/projects/${projectId}`)

    return { success: true, data: { updated: true } }
  } catch (error) {
    console.error('[updateProjectStatus] Erreur:', error)
    return { success: false, error: 'Impossible de mettre à jour le projet' }
  }
}

