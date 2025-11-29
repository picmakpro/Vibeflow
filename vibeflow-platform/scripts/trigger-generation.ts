// scripts/trigger-generation.ts
// Script pour déclencher la génération IA d'un projet via Inngest
// Usage: npx tsx scripts/trigger-generation.ts <projectId>

import { Inngest } from 'inngest'

const PROJECT_ID = process.argv[2] || 'f7f7f92f-731c-4fc6-984d-77dd2ac01fb4'

// Client Inngest pour envoyer des événements
const inngest = new Inngest({
  id: 'vibeflow-script',
  // En dev local, Inngest Dev Server écoute sur localhost:8288
  isDev: true,
})

async function main() {
  console.log(`🚀 Déclenchement de la génération pour le projet: ${PROJECT_ID}`)
  console.log('')
  
  try {
    // Envoyer l'événement à Inngest
    const result = await inngest.send({
      name: 'project/generate-phases',
      data: {
        projectId: PROJECT_ID,
        phasesToGenerate: [1], // Génère uniquement la Phase 1
      },
    })

    console.log('✅ Événement envoyé à Inngest!')
    console.log('📋 Résultat:', JSON.stringify(result, null, 2))
    console.log('')
    console.log('🔍 Surveillez la progression sur http://localhost:8288')
    console.log('')
    console.log('⏱️  La génération prend généralement 30-60 secondes')
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'événement:', error)
    console.log('')
    console.log('💡 Assurez-vous que:')
    console.log('   1. Le serveur Inngest Dev tourne: npx inngest-cli@latest dev')
    console.log('   2. Le serveur Next.js tourne: npm run dev')
    console.log('   3. L\'API Inngest est accessible: http://localhost:3000/api/inngest')
  }
}

main()

