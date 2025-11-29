// scripts/generate-phase-sync.ts
// Script pour générer la Phase 1 de manière SYNCHRONE (sans Inngest)
// Usage: npx tsx scripts/generate-phase-sync.ts <projectId>

// Charger les variables d'environnement depuis .env.local
import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()
const PROJECT_ID = process.argv[2] || 'f7f7f92f-731c-4fc6-984d-77dd2ac01fb4'

// Configuration
const PHASE_NUMBER = 1
const MODEL = 'claude-sonnet-4-20250514'

console.log('═══════════════════════════════════════════════════════════════')
console.log('🚀 GÉNÉRATION SYNCHRONE DE LA PHASE 1')
console.log('═══════════════════════════════════════════════════════════════')
console.log(`📁 Project ID: ${PROJECT_ID}`)
console.log(`🤖 Model: ${MODEL}`)
console.log('═══════════════════════════════════════════════════════════════')

async function main() {
  // 1. Charger le projet
  console.log('\n📋 [1/6] Chargement du projet...')
  const project = await prisma.project.findUnique({
    where: { id: PROJECT_ID },
    include: {
      phases: {
        orderBy: { phaseNumber: 'asc' },
      },
    },
  })

  if (!project) {
    console.error('❌ Projet non trouvé!')
    process.exit(1)
  }

  console.log(`   ✅ Projet trouvé: "${project.name}"`)
  console.log(`   📝 Type: ${project.appType}`)
  console.log(`   👥 Cible: ${project.targetUsers?.substring(0, 50)}...`)

  // 2. Charger le template de prompt
  console.log('\n📋 [2/6] Chargement du template de prompt...')
  const promptPath = path.join(process.cwd(), 'src', 'prompts', `phase-${PHASE_NUMBER}.txt`)
  
  let promptTemplate: string
  try {
    promptTemplate = fs.readFileSync(promptPath, 'utf-8')
    console.log(`   ✅ Template chargé: ${promptPath}`)
    console.log(`   📏 Taille: ${promptTemplate.length} caractères`)
  } catch (error) {
    console.error(`   ❌ Template non trouvé: ${promptPath}`)
    console.log('   💡 Utilisation d\'un prompt par défaut...')
    promptTemplate = getDefaultPrompt()
  }

  // 3. Injecter le contexte
  console.log('\n📋 [3/6] Injection du contexte projet...')
  const prompt = promptTemplate
    .replace(/\{\{PROJECT_NAME\}\}/g, project.name)
    .replace(/\{\{APP_TYPE\}\}/g, project.appType)
    .replace(/\{\{DESCRIPTION\}\}/g, project.description || project.ideaSummary)
    .replace(/\{\{TARGET_USERS\}\}/g, project.targetUsers || 'Non spécifié')
    .replace(/\{\{PROBLEM_SOLVED\}\}/g, project.ideaSummary || 'Non spécifié')
  
  console.log(`   ✅ Contexte injecté`)

  // 4. Appeler Claude API
  console.log('\n📋 [4/6] Appel à Claude API...')
  console.log('   ⏳ Génération en cours (30-60 secondes)...')
  
  const startTime = Date.now()
  
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('   ❌ ANTHROPIC_API_KEY non définie!')
    console.log('   💡 Ajoutez ANTHROPIC_API_KEY dans votre .env.local')
    process.exit(1)
  }

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(1)

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Réponse inattendue de Claude')
    }

    const generatedContent = content.text
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens

    console.log(`   ✅ Génération terminée en ${duration}s`)
    console.log(`   📊 Tokens utilisés: ${tokensUsed}`)
    console.log(`   📏 Contenu généré: ${generatedContent.length} caractères`)

    // 5. Parser et sauvegarder
    console.log('\n📋 [5/6] Sauvegarde en base de données...')
    
    const phase = project.phases.find(p => p.phaseNumber === PHASE_NUMBER)
    if (!phase) {
      console.error('   ❌ Phase 1 non trouvée!')
      process.exit(1)
    }

    // Parser les checklist items
    const checklistItems = parseChecklistItems(generatedContent)
    console.log(`   📝 ${checklistItems.length} checklist items extraits`)

    // Transaction pour sauvegarder
    await prisma.$transaction(async (tx) => {
      // Supprimer les anciens items
      await tx.checklistItem.deleteMany({
        where: { phaseId: phase.id },
      })

      // Mettre à jour la phase
      await tx.phase.update({
        where: { id: phase.id },
        data: {
          generatedContent: {
            markdown: generatedContent,
            generatedAt: new Date().toISOString(),
            tokensUsed,
            model: MODEL,
          },
          status: 'UNLOCKED',
          unlockedAt: new Date(),
        },
      })

      // Créer les checklist items
      if (checklistItems.length > 0) {
        await tx.checklistItem.createMany({
          data: checklistItems.map((item, index) => ({
            phaseId: phase.id,
            title: item.title,
            description: item.description,
            estimatedTime: item.estimatedTime || '1-2h',
            required: true,
            orderIndex: index,
            status: 'PENDING',
          })),
        })
      }

      // Mettre à jour le statut du projet
      await tx.project.update({
        where: { id: PROJECT_ID },
        data: { status: 'ACTIVE' },
      })
    })

    console.log('   ✅ Données sauvegardées!')

    // 6. Résumé
    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('✅ GÉNÉRATION TERMINÉE AVEC SUCCÈS!')
    console.log('═══════════════════════════════════════════════════════════════')
    console.log(`📁 Projet: ${project.name}`)
    console.log(`⏱️  Durée: ${duration}s`)
    console.log(`📊 Tokens: ${tokensUsed}`)
    console.log(`📝 Checklist items: ${checklistItems.length}`)
    console.log('═══════════════════════════════════════════════════════════════')
    console.log('\n🔗 Rafraîchissez la page du projet pour voir le résultat!')
    console.log(`   http://localhost:3000/dashboard/projects/${PROJECT_ID}`)

  } catch (error) {
    console.error('   ❌ Erreur lors de l\'appel à Claude:', error)
    process.exit(1)
  }
}

function parseChecklistItems(markdown: string): Array<{ title: string; description: string; estimatedTime?: string }> {
  const items: Array<{ title: string; description: string; estimatedTime?: string }> = []
  
  // Regex pour trouver les items de checklist: - [ ] ou - [x] ou * [ ]
  const checklistRegex = /^[-*]\s*\[[ x]\]\s*(.+?)(?:\s*\(([^)]+)\))?$/gm
  let match

  while ((match = checklistRegex.exec(markdown)) !== null) {
    const fullText = match[1].trim()
    const estimatedTime = match[2]?.trim()
    
    // Séparer titre et description si possible (par ":" ou "-")
    const separatorIndex = fullText.indexOf(':')
    let title: string
    let description: string
    
    if (separatorIndex > 0 && separatorIndex < 100) {
      title = fullText.substring(0, separatorIndex).trim()
      description = fullText.substring(separatorIndex + 1).trim()
    } else {
      title = fullText.substring(0, 80)
      description = fullText
    }
    
    items.push({ title, description, estimatedTime })
  }

  // Si pas d'items trouvés, créer des items par défaut
  if (items.length === 0) {
    console.log('   ⚠️ Aucun checklist item trouvé dans le markdown, création d\'items par défaut')
    items.push(
      { title: 'Définir le persona principal', description: 'Identifiez votre utilisateur cible idéal avec ses caractéristiques démographiques et comportementales', estimatedTime: '2h' },
      { title: 'Identifier les pain points', description: 'Listez les 3-5 problèmes principaux que votre solution résout', estimatedTime: '1h' },
      { title: 'Analyser la concurrence', description: 'Étudiez 3-5 concurrents directs et indirects', estimatedTime: '3h' },
      { title: 'Définir la proposition de valeur', description: 'Formulez votre USP (Unique Selling Proposition) en une phrase', estimatedTime: '1h' },
      { title: 'Valider avec des entretiens', description: 'Réalisez 5-10 entretiens utilisateurs avec la méthode Mom Test', estimatedTime: '8h' },
      { title: 'Créer une landing page', description: 'Créez une page de capture d\'emails pour valider l\'intérêt', estimatedTime: '4h' },
      { title: 'Définir les métriques de succès', description: 'Établissez vos KPIs de validation (ex: 100 emails collectés)', estimatedTime: '1h' },
      { title: 'Décision GO/NO-GO', description: 'Prenez la décision de continuer ou pivoter basée sur les données collectées', estimatedTime: '2h' },
    )
  }

  return items
}

function getDefaultPrompt(): string {
  return `Tu es un expert Product Manager et Technical Architect spécialisé dans le développement IA-native.

# CONTEXTE
Nom du projet: {{PROJECT_NAME}}
Type d'application: {{APP_TYPE}}
Description: {{DESCRIPTION}}
Utilisateurs cibles: {{TARGET_USERS}}
Problème résolu: {{PROBLEM_SOLVED}}

# TÂCHE
Génère le rapport complet de la Phase 1 (Validation de Marché) pour ce projet.

# FORMAT DE SORTIE
Retourne un document Markdown structuré avec ces sections:

## 1. Résumé Exécutif
[Résumé en 3-4 paragraphes]

## 2. Analyse du Problème
[Description détaillée du problème et de son impact]

## 3. Analyse des Personas
[3 personas détaillés avec démographie, pain points, goals]

## 4. Analyse Concurrentielle
[Tableau comparatif de 3-5 concurrents]

## 5. Proposition de Valeur Unique (USP)
[USP claire et différenciante]

## 6. Validation Économique
[TAM, SAM, SOM + projections]

## 7. Stratégie de Validation
[Plan d'action avec méthode Mom Test]

## 8. Checklist de Validation
[Liste de 8-10 items avec cases à cocher]
- [ ] Item 1 (temps estimé)
- [ ] Item 2 (temps estimé)
...

## 9. Ressources Complémentaires
[Templates et outils recommandés]

# EXIGENCES
- Sois spécifique au projet, pas générique
- Utilise des données de marché réalistes
- Fournis des templates actionnables
- La checklist doit avoir 8-10 items avec critères de validation clairs

Génère maintenant le rapport complet.`
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

