// scripts/generate-mock.ts
// Script pour générer du contenu de TEST (sans appel API)
// Usage: npx tsx scripts/generate-mock.ts <projectId>

import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const PROJECT_ID = process.argv[2] || 'f7f7f92f-731c-4fc6-984d-77dd2ac01fb4'

console.log('═══════════════════════════════════════════════════════════════')
console.log('🎭 GÉNÉRATION DE CONTENU MOCK (TEST)')
console.log('═══════════════════════════════════════════════════════════════')
console.log(`📁 Project ID: ${PROJECT_ID}`)
console.log('⚠️  Ce script génère du contenu de test, pas de vraie IA!')
console.log('═══════════════════════════════════════════════════════════════')

async function main() {
  // 1. Charger le projet
  console.log('\n📋 [1/4] Chargement du projet...')
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

  // 2. Générer le contenu mock
  console.log('\n📋 [2/4] Génération du contenu mock...')
  
  const mockContent = generateMockContent(project.name, project.appType, project.targetUsers || '', project.ideaSummary || '')
  console.log(`   ✅ Contenu généré: ${mockContent.length} caractères`)

  // 3. Sauvegarder
  console.log('\n📋 [3/4] Sauvegarde en base de données...')
  
  const phase = project.phases.find(p => p.phaseNumber === 1)
  if (!phase) {
    console.error('   ❌ Phase 1 non trouvée!')
    process.exit(1)
  }

  const checklistItems = [
    { title: 'Définir le persona principal', description: 'Identifiez votre utilisateur cible idéal avec ses caractéristiques démographiques et comportementales', estimatedTime: '2h' },
    { title: 'Identifier les 3 pain points majeurs', description: 'Listez les problèmes principaux que votre solution résout', estimatedTime: '1h' },
    { title: 'Analyser 5 concurrents', description: 'Étudiez les forces et faiblesses des solutions existantes', estimatedTime: '3h' },
    { title: 'Définir la proposition de valeur unique', description: 'Formulez votre USP en une phrase claire et mémorable', estimatedTime: '1h' },
    { title: 'Réaliser 10 entretiens Mom Test', description: 'Validez vos hypothèses avec de vrais utilisateurs potentiels', estimatedTime: '8h' },
    { title: 'Créer une landing page de capture', description: 'Créez une page pour collecter des emails et valider l\'intérêt', estimatedTime: '4h' },
    { title: 'Collecter 50 emails minimum', description: 'Objectif de validation : 50 inscriptions = intérêt confirmé', estimatedTime: '1 semaine' },
    { title: 'Décision GO/NO-GO', description: 'Analysez les données et prenez la décision de continuer ou pivoter', estimatedTime: '2h' },
  ]

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
          markdown: mockContent,
          generatedAt: new Date().toISOString(),
          tokensUsed: 0,
          model: 'mock-test',
          isMock: true,
        },
        status: 'UNLOCKED',
        unlockedAt: new Date(),
      },
    })

    // Créer les checklist items
    await tx.checklistItem.createMany({
      data: checklistItems.map((item, index) => ({
        phaseId: phase.id,
        title: item.title,
        description: item.description,
        estimatedTime: item.estimatedTime,
        required: true,
        orderIndex: index,
        status: 'PENDING',
      })),
    })

    // Mettre à jour le statut du projet
    await tx.project.update({
      where: { id: PROJECT_ID },
      data: { status: 'ACTIVE' },
    })
  })

  console.log('   ✅ Données sauvegardées!')
  console.log(`   📝 ${checklistItems.length} checklist items créés`)

  // 4. Résumé
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('✅ GÉNÉRATION MOCK TERMINÉE!')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`📁 Projet: ${project.name}`)
  console.log(`📝 Checklist items: ${checklistItems.length}`)
  console.log('⚠️  Note: Ce contenu est généré pour TEST uniquement.')
  console.log('    Pour du vrai contenu, rechargez vos crédits Anthropic.')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('\n🔗 Rafraîchissez la page du projet pour voir le résultat!')
  console.log(`   http://localhost:3000/dashboard/projects/${PROJECT_ID}`)
}

function generateMockContent(name: string, appType: string, targetUsers: string, ideaSummary: string): string {
  return `# 📋 Phase 1 : Validation de Marché - ${name}

> **⚠️ CONTENU DE TEST** - Ce rapport a été généré automatiquement pour tester l'interface. Pour un vrai rapport, rechargez vos crédits Anthropic.

---

## 1. Résumé Exécutif

**${name}** est une application de type **${appType}** qui vise à résoudre un problème identifié pour ses utilisateurs cibles.

${ideaSummary || 'Cette application propose une solution innovante pour améliorer l\'expérience utilisateur dans son domaine.'}

### Points Clés
- **Marché cible** : ${targetUsers || 'Utilisateurs tech-savvy, 25-45 ans'}
- **Proposition de valeur** : Solution unique combinant technologie et simplicité d'usage
- **Différenciation** : Approche IA-native pour une expérience personnalisée

---

## 2. Analyse du Problème

### Le Problème Identifié

Les utilisateurs font face à plusieurs défis :

1. **Complexité des solutions existantes** - Les outils actuels sont trop complexes
2. **Manque de personnalisation** - Solutions génériques qui ne s'adaptent pas
3. **Temps perdu** - Processus inefficaces et chronophages

### Impact du Problème

- **Temps perdu** : 2-3 heures par semaine en moyenne
- **Frustration** : 78% des utilisateurs se disent insatisfaits
- **Coût** : Perte de productivité estimée à 500€/mois/utilisateur

---

## 3. Analyse des Personas

### Persona Principal : Thomas, 32 ans

**Profil :**
- Développeur Full-Stack Freelance
- Revenus : 65K€/an
- Utilise : Cursor, VS Code, GitHub

**Pain Points :**
- Perd 4-6h par projet à structurer
- Projets abandonnés par manque de méthodologie
- Hallucinations IA quand contexte mal préparé

**Citation :**
> "Je perds plus de temps à préparer qu'à coder"

### Persona Secondaire : Sarah, 38 ans

**Profil :**
- Product Manager
- Équipe de 5 personnes
- Non-technique

**Pain Points :**
- Specs techniques incomplètes
- Dépendance aux développeurs
- Communication difficile avec l'équipe tech

---

## 4. Analyse Concurrentielle

| Concurrent | Forces | Faiblesses | Prix |
|------------|--------|------------|------|
| **Concurrent A** | UX simple | Pas de personnalisation | 29€/mois |
| **Concurrent B** | Features complètes | Complexe | 99€/mois |
| **Concurrent C** | Prix bas | Support limité | 9€/mois |
| **${name}** | IA-native + Simple | Nouveau | 29€/mois |

### Notre Avantage Compétitif

1. **Approche IA-native** : Génération automatique vs configuration manuelle
2. **Simplicité** : 15 minutes vs 2-3 jours chez les concurrents
3. **Intégration Cursor** : Workflow natif pour les développeurs

---

## 5. Proposition de Valeur Unique (USP)

> **"${name} transforme votre idée en projet structuré complet en 15 minutes, pas en 2 jours."**

### Éléments Différenciateurs

1. ✅ Génération IA automatique
2. ✅ Exports natifs pour Cursor
3. ✅ Checklist interactives
4. ✅ Déblocage progressif

---

## 6. Validation Économique

### Taille du Marché

| Segment | Valeur | Croissance |
|---------|--------|------------|
| **TAM** (Total Addressable Market) | $4B | +24%/an |
| **SAM** (Serviceable Available Market) | $400M | +30%/an |
| **SOM** (Serviceable Obtainable Market) | $4M | +50%/an |

### Projections Financières (Année 1)

- **Utilisateurs cibles** : 2,000 payants
- **MRR cible** : 58,000€
- **ARR cible** : 696,000€
- **Prix moyen** : 29€/mois

---

## 7. Stratégie de Validation

### Phase 1 : Validation Qualitative (Semaines 1-2)

1. **Entretiens Mom Test** (10 minimum)
   - Questions ouvertes sur les problèmes actuels
   - Validation des pain points identifiés
   - Test de la proposition de valeur

2. **Analyse des réponses**
   - Patterns récurrents
   - Objections principales
   - Willingness to pay

### Phase 2 : Validation Quantitative (Semaines 3-4)

1. **Landing Page**
   - Proposition de valeur claire
   - Formulaire de capture email
   - Objectif : 100 inscriptions

2. **Métriques à suivre**
   - Taux de conversion (cible : 5%)
   - Source de trafic
   - Feedback qualitatif

---

## 8. Checklist de Validation

- [ ] Définir le persona principal (2h)
- [ ] Identifier les 3 pain points majeurs (1h)
- [ ] Analyser 5 concurrents (3h)
- [ ] Définir la proposition de valeur unique (1h)
- [ ] Réaliser 10 entretiens Mom Test (8h)
- [ ] Créer une landing page de capture (4h)
- [ ] Collecter 50 emails minimum (1 semaine)
- [ ] Décision GO/NO-GO (2h)

---

## 9. Ressources Complémentaires

### Templates Inclus

1. **Template Persona** - Structure pour documenter vos personas
2. **Questions Mom Test** - 20 questions pour vos entretiens
3. **Grille d'analyse concurrentielle** - Tableau comparatif
4. **Checklist Landing Page** - 15 éléments essentiels

### Outils Recommandés

- **Entretiens** : Calendly + Zoom
- **Landing Page** : Carrd, Framer, ou Webflow
- **Analytics** : Google Analytics + Hotjar
- **Email** : Mailchimp ou ConvertKit

---

*Rapport généré le ${new Date().toLocaleDateString('fr-FR')} - Mode TEST*
`
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

