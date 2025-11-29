// src/app/api/admin/generate-phase/route.ts
// Route pour déclencher manuellement la génération d'une phase
// Usage: POST /api/admin/generate-phase?projectId=xxx&phaseNumber=2

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/prisma'
import { triggerSinglePhaseGeneration } from '@/lib/inngest/client'

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

    // 2. Récupérer les paramètres
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const phaseNumber = parseInt(searchParams.get('phaseNumber') || '0')

    if (!projectId || !phaseNumber) {
      return NextResponse.json(
        { error: 'projectId et phaseNumber requis' },
        { status: 400 }
      )
    }

    // 3. Vérifier que le projet et la phase existent
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

    const phase = await prisma.phase.findFirst({
      where: {
        projectId,
        phaseNumber,
        project: {
          organizationId: user.organizationId,
        },
      },
      include: {
        project: {
          select: { name: true },
        },
      },
    })

    if (!phase) {
      return NextResponse.json(
        { error: 'Phase non trouvée' },
        { status: 404 }
      )
    }

    // 4. Déclencher la génération
    await triggerSinglePhaseGeneration(projectId, phaseNumber)

    console.log(`[GeneratePhase] Job déclenché pour Phase ${phaseNumber} du projet ${projectId}`)

    return NextResponse.json({
      success: true,
      message: `Génération déclenchée pour Phase ${phaseNumber} - ${phase.phaseName}`,
      projectId,
      phaseNumber,
      phaseName: phase.phaseName,
    })
  } catch (error) {
    console.error('[GeneratePhase] Erreur:', error)
    
    return NextResponse.json(
      { 
        error: 'Erreur lors du déclenchement de la génération',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Utilisez POST /api/admin/generate-phase?projectId=xxx&phaseNumber=2',
    example: 'curl -X POST "http://localhost:3000/api/admin/generate-phase?projectId=f7f7f92f-731c-4fc6-984d-77dd2ac01fb4&phaseNumber=2"',
  })
}

