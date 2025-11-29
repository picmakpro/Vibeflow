// scripts/trigger-phase-generation.ts
// Script pour déclencher manuellement la génération d'une phase
// Usage: npx tsx scripts/trigger-phase-generation.ts <projectId> <phaseNumber>

import { Inngest } from 'inngest'

const projectId = process.argv[2] || 'f7f7f92f-731c-4fc6-984d-77dd2ac01fb4'
const phaseNumber = parseInt(process.argv[3] || '2')

async function main() {
  console.log(`🚀 Déclenchement de la génération pour:`)
  console.log(`   - Projet: ${projectId}`)
  console.log(`   - Phase: ${phaseNumber}`)

  // Créer un client Inngest
  const inngest = new Inngest({
    id: 'vibeflow-script',
    eventKey: process.env.INNGEST_EVENT_KEY || 'local-dev-key',
  })

  // Envoyer l'événement
  await inngest.send({
    name: 'project/generate-single-phase',
    data: {
      projectId,
      phaseNumber,
    },
  })

  console.log(`✅ Événement envoyé à Inngest`)
  console.log(``)
  console.log(`📊 Vérifiez dans Inngest Dev Server: http://localhost:8288`)
  console.log(`   - Onglet "Runs" pour voir l'exécution`)
  console.log(`   - Onglet "Events" pour voir l'événement`)
}

main()
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })

