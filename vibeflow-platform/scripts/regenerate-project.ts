// scripts/regenerate-project.ts
// Script pour relancer la génération d'un projet
// Usage: npx tsx scripts/regenerate-project.ts <projectId>

import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PROJECT_ID = process.argv[2] || 'f7f7f92f-731c-4fc6-984d-77dd2ac01fb4'

async function main() {
  console.log(`🔄 Relancement de la génération pour le projet: ${PROJECT_ID}`)

  // 1. Vérifier que le projet existe
  const project = await prisma.project.findUnique({
    where: { id: PROJECT_ID },
    include: {
      phases: {
        orderBy: { phaseNumber: 'asc' },
      },
    },
  })

  if (!project) {
    console.error('❌ Projet non trouvé')
    process.exit(1)
  }

  console.log(`📁 Projet trouvé: ${project.name}`)

  // 2. Supprimer les anciens checklist items
  const phaseIds = project.phases.map((p) => p.id)
  const deletedItems = await prisma.checklistItem.deleteMany({
    where: { phaseId: { in: phaseIds } },
  })
  console.log(`🗑️  ${deletedItems.count} checklist items supprimés`)

  // 3. Réinitialiser les phases
  await prisma.phase.updateMany({
    where: { projectId: PROJECT_ID },
    data: {
      generatedContent: Prisma.JsonNull,
      progressPercentage: 0,
      status: 'LOCKED',
      completedAt: null,
    },
  })

  // 4. Débloquer la Phase 1
  await prisma.phase.updateMany({
    where: {
      projectId: PROJECT_ID,
      phaseNumber: 1,
    },
    data: {
      status: 'UNLOCKED',
      unlockedAt: new Date(),
    },
  })

  // 5. Mettre le projet en statut GENERATING
  await prisma.project.update({
    where: { id: PROJECT_ID },
    data: { status: 'GENERATING' },
  })

  console.log('✅ Projet réinitialisé et prêt pour la génération')
  console.log('')
  console.log('📋 Pour déclencher la génération, vous avez 2 options:')
  console.log('')
  console.log('Option 1: Via l\'API (si le serveur Next.js tourne)')
  console.log(`  curl -X POST "http://localhost:3000/api/admin/regenerate?projectId=${PROJECT_ID}"`)
  console.log('')
  console.log('Option 2: Créer un nouveau projet via l\'interface')
  console.log('  Le job Inngest sera déclenché automatiquement')
  console.log('')
  console.log('🔍 Surveillez les logs Inngest sur http://localhost:8288')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

