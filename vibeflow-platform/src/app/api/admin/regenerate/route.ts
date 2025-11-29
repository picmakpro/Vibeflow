// src/app/api/admin/regenerate/route.ts
// Route API pour relancer manuellement la génération d'un projet
// Usage: POST /api/admin/regenerate?projectId=xxx

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/prisma'
import { triggerPhaseGeneration } from '@/lib/inngest/client'
import { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // 2. Récupérer le projectId depuis les query params ou le body
    const { searchParams } = new URL(request.url)
    let projectId = searchParams.get('projectId')
    
    if (!projectId) {
      const body = await request.json().catch(() => ({}))
      projectId = body.projectId
    }

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId requis' },
        { status: 400 }
      )
    }

    // 3. Vérifier que le projet existe et appartient à l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { organizationId: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId: user.organizationId,
      },
      include: {
        phases: {
          orderBy: { phaseNumber: 'asc' },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      )
    }

    // 4. Remettre le projet en statut GENERATING
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'GENERATING' },
    })

    // 5. Supprimer les anciens checklist items (pour éviter les doublons)
    const phaseIds = project.phases.map((p) => p.id)
    await prisma.checklistItem.deleteMany({
      where: { phaseId: { in: phaseIds } },
    })

    // 6. Réinitialiser les phases
    await prisma.phase.updateMany({
      where: { projectId },
      data: {
        generatedContent: Prisma.JsonNull,
        progressPercentage: 0,
        status: 'LOCKED',
        completedAt: null,
      },
    })

    // Débloquer la Phase 1
    await prisma.phase.updateMany({
      where: {
        projectId,
        phaseNumber: 1,
      },
      data: {
        status: 'UNLOCKED',
        unlockedAt: new Date(),
      },
    })

    // 7. Déclencher le job de génération
    await triggerPhaseGeneration(projectId, [1])

    console.log(`[Regenerate] Job déclenché pour projet ${projectId}`)

    return NextResponse.json({
      success: true,
      message: `Génération relancée pour le projet "${project.name}"`,
      projectId,
    })
  } catch (error) {
    console.error('[Regenerate] Erreur:', error)
    
    return NextResponse.json(
      { 
        error: 'Erreur lors du déclenchement de la génération',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
}

// GET pour faciliter les tests
export async function GET() {
  return NextResponse.json({
    message: 'Utilisez POST /api/admin/regenerate?projectId=xxx pour relancer la génération',
    example: 'curl -X POST http://localhost:3000/api/admin/regenerate?projectId=f7f7f92f-731c-4fc6-984d-77dd2ac01fb4',
  })
}

