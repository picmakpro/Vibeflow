# 📘 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## VibeFlow - La Colonne Vertébrale du Développement IA-Native

**Version :** 1.0  
**Date :** 28 Novembre 2025  
**Statut :** Ready for Development  

---

## 🎯 1. VISION & POSITIONNEMENT

### 1.1 Vision Produit

**Vision à 3 ans :**
> Devenir la plateforme de référence pour structurer et orchestrer les projets de développement IA-native, utilisée par 100,000+ développeurs et équipes dans le monde.

**Mission :**
> Transformer le "vibe coding" chaotique en développement IA-native structuré, méthodique et professionnel, en éliminant les hallucinations et la dette technique à la source.

### 1.2 Le Problème (Validated by Market Data)

**Pain Points spécifiques :**

1. **Manque de préparation du contexte** (76% des devs affectés)
   - Ne savent pas quelles informations fournir à l'IA
   - Contexte incomplet → hallucinations
   - Prompts mal structurés → code incohérent

2. **Absence de méthodologie bout-en-bout** (66% des devs)
   - Commencent à coder sans validation
   - Pas de vision architecture claire
   - Perdent le fil en cours de projet

3. **Debugging du code IA chronophage** (45% des devs)
   - 45% disent que débugger l'IA prend plus de temps que coder

4. **Projets abandonnés faute de structure** (estimé 60%+)
   - Enthousiasme initial → chaos → abandon

**Sources :** Stack Overflow Survey 2025, Anthropic Research Nov 2025

### 1.3 La Solution

**VibeFlow génère automatiquement la structure complète d'un projet de développement IA-native, de l'idée à la production.**

**Ce que nous FAISONS :**
- ✅ Génération automatique de 10 phases structurées (Validation → Déploiement)
- ✅ Documentation technique (.cursorrules, PRD.md, CONTEXT.md, ARCHITECTURE.md)
- ✅ Checklists interactives avec déblocage progressif
- ✅ Dashboard de suivi projet en temps réel
- ✅ Mind Map interactive de l'architecture
- ✅ Exports optimisés pour Cursor/Windsurf

**Ce que nous NE FAISONS PAS :**
- ❌ Générer du code source
- ❌ Remplacer l'IDE
- ❌ Déployer l'application
- ❌ Gérer le versioning Git

**Analogie :** Si Cursor est le marteau et le tournevis, nous sommes le plan d'architecte.

### 1.4 USP (Unique Selling Proposition)

> "VibeFlow est le Notion du développement IA-native. Nous transformons votre idée d'app en projet structuré complet — validation, architecture, context engineering, checklists — que vous collez directement dans Cursor pour coder sans hallucinations. Nous ne générons pas le code, nous générons la colonne vertébrale du projet."

---

## 👥 2. PERSONAS UTILISATEURS

### 2.1 Persona Principal : Thomas - Solopreneur Tech ⭐

**Démographie :**
- Âge : 32 ans
- Profession : Développeur Full-Stack Freelance
- Revenus : 65K€/an
- Localisation : France (télétravail)

**Contexte Tech :**
- Stack : Next.js, TypeScript, Supabase, Tailwind
- Outils : Cursor (6 mois d'usage), VS Code, GitHub, Vercel, Notion
- Niveau IA : Intermédiaire-Avancé

**Pain Points :**
1. **Setup projet chronophage** (8/10 intensity)
   - 4-6 heures perdues à structurer chaque nouveau projet
   - Citation : *"Je perds plus de temps à préparer qu'à coder"*

2. **Projets abandonnés** (7/10)
   - 5 projets abandonnés sur 8 en 2024
   - Raison : Manque de structure, perte du fil après 2-3 semaines

3. **Hallucinations Cursor** (6/10)
   - Code incohérent quand contexte mal préparé
   - Citation : *"Si je ne prépare pas bien le contexte, Cursor part en vrille"*

**Jobs-to-be-Done :**
> "Quand j'ai une nouvelle idée de SaaS, je veux avoir toute la structure technique et documentaire générée automatiquement, afin de passer directement au développement dans Cursor sans perdre 2 jours de setup et sans risquer d'abandonner le projet."

**Willingness to Pay :** 29€/mois (si gain de temps démontré)

**Canaux d'Acquisition :**
- Twitter/X (#Cursor, #VibeFlow, #BuildInPublic)
- Reddit (r/Cursor, r/ChatGPTCoding)
- Discord Cursor
- YouTube (tutorials Cursor)

---

### 2.2 Persona Secondaire : Sarah - PM Non-Tech

**Démographie :**
- Âge : 38 ans
- Profession : Product Manager
- Revenus : 55K€/an

**Pain Points :**
1. **Specs techniques incomplètes** (9/10)
   - Les devs reprochent des specs floues
   - Citation : *"Je ne sais pas ce qu'il faut écrire dans un PRD technique"*

2. **Dépendance aux développeurs** (8/10)
   - Doit attendre les devs pour structurer le projet
   - Citation : *"J'aimerais avancer sans bloquer mes devs"*

**Willingness to Pay :** 79€/mois (Team plan)

---

### 2.3 Persona Tertiaire : Alex - Fondateur Agence Dev

**Démographie :**
- Âge : 45 ans
- Profession : CEO agence dev (12 développeurs)
- Revenus entreprise : 1.2M€/an

**Pain Points :**
1. **Hétérogénéité des pratiques** (10/10)
   - Chaque dev a sa méthode de setup
   - Citation : *"Je ne peux pas scaler si chaque dev fait à sa façon"*

2. **Temps de démarrage projet** (9/10)
   - 1 semaine perdue par projet = 240K€/an de coût

**Willingness to Pay :** 500€/mois (Enterprise plan)

---

## 🗺️ 3. USER JOURNEY

### 3.1 Onboarding (15 minutes)

**Étapes :**
1. **Sign Up** (2 min) : Google/GitHub/Email
2. **Welcome Quiz** (3 min) : 3 questions (profil, IDE, type d'app)
3. **Tutorial interactif** (5 min) : Guided tour du dashboard
4. **Premier projet guidé** (5 min) : Création simplifiée avec formulaire pré-rempli

**Métrique de succès :** 70% des users complètent leur premier projet en <15min

---

### 3.2 Création de Projet (10-15 minutes)

**Flow :**

```
[Page : /projects/new]
    │
    ▼
Wizard Multi-étapes (3 steps)
    │
    ├─ Step 1 : Idée de Base
    │  • Nom du projet
    │  • Description (500 caractères)
    │  • Type d'app (dropdown)
    │  [Suivant]
    │
    ├─ Step 2 : Questions Intelligentes
    │  • Pour qui est cette app ?
    │  • Quel problème résout-elle ?
    │  • Quels sont vos 3 concurrents principaux ?
    │  • Stack technique préférée ?
    │  [Suivant]
    │
    └─ Step 3 : Confirmation
       • Résumé des inputs
       • Temps de génération estimé : 2-3 min
       [Générer mon projet]
           │
           ▼
       [Background Job : AI Generation]
           │
           ▼
       [Email : "Votre projet est prêt !"]
           │
           ▼
       [Redirection : /projects/{id}]
```

---

### 3.3 Travail sur une Phase

**Page : `/projects/{id}/phases/1`**

**Éléments UI :**
- **Sidebar** : Liste des 10 phases (débloquées/bloquées)
- **Main Content** :
  - Tabs : Vue d'ensemble | Checklist | Rapport | Ressources
  - Progress bar : X/Y items complétés
  - Bouton : "Débloquer Phase 2" (actif si ≥80% complété)

**Interactions :**
- Cocher un item de checklist → Modal confirmation → Update DB
- Éditer un item complété → Modal édition → Regenerate si impact
- Télécharger rapport → Export Markdown

---

### 3.4 Export vers Cursor

**Page : `/projects/{id}/exports`**

**Contenu :**
1. **Package Complet** (.zip)
   - Bouton : "Télécharger Package Cursor"
   - Contenu : .cursorrules, PRD.md, CONTEXT.md, ARCHITECTURE.md, PHASES.md

2. **Exports Individuels**
   - Boutons pour chaque fichier séparément

3. **Premier Prompt Cursor**
   - Zone de texte pré-remplie avec prompt de démarrage
   - Bouton : "Copier le prompt"

**Métrique de succès :** 80% des users téléchargent le package après Phase 3

---

## 🏗️ 4. ARCHITECTURE FONCTIONNELLE

### 4.1 Les 10 Phases (Vue d'Ensemble)

| Phase | Nom | Objectif | Durée Estimée |
|---|---|---|---|
| 1 | Validation de Marché | Valider l'idée avant de coder | 1-2 semaines |
| 2 | Setup & Context Engineering | Préparer l'environnement dev | 3-5 jours |
| 3 | Architecture & Planification | Définir l'architecture technique | 3-5 jours |
| 4 | Prompt Engineering | Optimiser les prompts Cursor | 2-3 jours |
| 5 | Méthodologie Complète | Workflow bout-en-bout | 1 semaine |
| 6 | Testing & Qualité | Stratégie de tests | 1 semaine |
| 7 | Sécurité | Audit sécurité | 3-5 jours |
| 8 | Déploiement | CI/CD + Observabilité | 1 semaine |
| 9 | Maintenance | Amélioration continue | Ongoing |
| 10 | Métriques & Vision 2027 | KPIs + Roadmap long terme | 2-3 jours |

---

### 4.2 Phase 1 : Validation de Marché (Détail)

**Inputs Requis :**
- Description de l'idée (500+ caractères)
- Problème résolu (texte libre)
- Utilisateurs cibles (personas)
- Concurrents connus (liste)
- Budget/Timeline

**Outputs Générés :**

1. **Rapport de Validation (Markdown, ~15 pages)**
   - Résumé Exécutif
   - Analyse du Problème
   - Analyse des Personas (3 personas détaillés)
   - Analyse Concurrentielle (tableau comparatif)
   - USP (Unique Selling Proposition)
   - Validation Économique (TAM/SAM/SOM, projections)
   - Stratégie de Validation (RAT, Mom Test)

2. **Checklist Interactive (9 items)**
   - Définir persona principal
   - Identifier 3 pain points
   - Analyser 5 concurrents
   - Définir USP
   - Créer landing page
   - Réaliser 10 entretiens Mom Test
   - Construire no-code MVP
   - Collecter 20+ emails
   - Décision GO/NO-GO

3. **Ressources Complémentaires**
   - Template Persona (PDF)
   - Template Mom Test (Questions)
   - Calculateur TAM/SAM/SOM (Excel)
   - Checklist Landing Page (Markdown)

**Critère de Déblocage Phase 2 :** ≥7/9 items (80%) complétés

---

### 4.3 Système de Déblocage Progressif

**Règle :**
- Phase N+1 débloquée quand Phase N ≥ 80% complétée
- Calcul : `(items_completed / total_items) * 100 >= 80`

**Logic Backend :**
```typescript
// Après chaque update de checklist item
const phase = await prisma.phase.findUnique({
  where: { id: phaseId },
  include: { checklistItems: true }
})

const completedCount = phase.checklistItems.filter(
  item => item.status === 'completed'
).length
const progressPercentage = (completedCount / phase.checklistItems.length) * 100

await prisma.phase.update({
  where: { id: phaseId },
  data: { progress_percentage: progressPercentage }
})

// Débloquer phase suivante si ≥80%
if (progressPercentage >= 80 && phase.phase_number < 10) {
  await prisma.phase.updateMany({
    where: {
      project_id: phase.project_id,
      phase_number: phase.phase_number + 1
    },
    data: {
      status: 'unlocked',
      unlocked_at: new Date()
    }
  })
}
```

---

### 4.4 AI Generation Pipeline

**Workflow :**

```
User submits project form
    │
    ▼
Validate with Zod schema
    │
    ▼
Create project record (status: 'generating')
    │
    ▼
Queue Background Job (Vercel Queue / Inngest)
    │
    ▼
For each phase (1-3 in MVP):
    │
    ├─ Load prompt template (/prompts/phase-{n}.txt)
    ├─ Inject user context
    ├─ Call Claude 3.5 Sonnet API
    ├─ Parse response (Markdown sections)
    ├─ Extract checklist items
    ├─ Store in DB (phases.generated_content)
    └─ Create checklist_items records
    │
    ▼
Update project status to 'active'
    │
    ▼
Send email notification
    │
    ▼
User redirected to /projects/{id}
```

**Prompt Template Structure :**
```
You are an expert Product Manager and Technical Architect.

# CONTEXT
Project Name: {project_name}
App Type: {app_type}
Target Users: {target_users}
Idea Summary: {idea_summary}

# TASK
Generate Phase {phase_number} ({phase_name}) content.

# OUTPUT FORMAT
Return structured Markdown with these sections:
[List of required sections]

# REQUIREMENTS
- Be specific, not generic
- Use data when available
- Provide actionable templates
- Checklist must have 8-10 items

# EXAMPLE OUTPUT
[Include 1 example]

Now generate the report.
```

---

## 💾 5. DATABASE SCHEMA

### 5.1 Tables Overview

**Core Tables :**
- `organizations` : Multi-tenant isolation
- `users` : User accounts (linked to Clerk)
- `projects` : Core project entity
- `phases` : 10 phases per project
- `checklist_items` : Items for each phase
- `exports` : Generated files

**Relationships :**
```
organizations (1) ──< (N) users
organizations (1) ──< (N) projects
projects (1) ──< (10) phases
phases (1) ──< (N) checklist_items
projects (1) ──< (N) exports
```

---

### 5.2 Prisma Schema

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Organization {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users    User[]
  projects Project[]

  @@map("organizations")
}

enum UserRole {
  OWNER
  ADMIN
  MEMBER
}

model User {
  id             String   @id @default(uuid())
  clerkId        String   @unique
  email          String
  name           String
  avatarUrl      String?
  role           UserRole @default(MEMBER)
  organizationId String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdProjects Project[]  @relation("ProjectCreator")

  @@map("users")
}

enum AppType {
  SAAS_B2B
  SAAS_B2C
  MOBILE_APP
  CHROME_EXTENSION
  API_BACKEND
}

enum ProjectStatus {
  GENERATING
  ACTIVE
  ARCHIVED
}

model Project {
  id           String        @id @default(uuid())
  name         String
  description  String?
  ideaSummary  String
  appType      AppType
  targetUsers  String
  status       ProjectStatus @default(GENERATING)
  organizationId String
  createdById  String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdBy    User         @relation("ProjectCreator", fields: [createdById], references: [id])
  phases       Phase[]
  exports      Export[]

  @@map("projects")
}

enum PhaseStatus {
  LOCKED
  UNLOCKED
  IN_PROGRESS
  COMPLETED
}

model Phase {
  id                 String      @id @default(uuid())
  projectId          String
  phaseNumber        Int
  phaseName          String
  status             PhaseStatus @default(LOCKED)
  progressPercentage Int         @default(0)
  generatedContent   Json?
  unlockedAt         DateTime?
  completedAt        DateTime?
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  project        Project         @relation(fields: [projectId], references: [id], onDelete: Cascade)
  checklistItems ChecklistItem[]

  @@unique([projectId, phaseNumber])
  @@map("phases")
}

enum ChecklistItemStatus {
  PENDING
  COMPLETED
}

model ChecklistItem {
  id            String              @id @default(uuid())
  phaseId       String
  title         String
  description   String
  status        ChecklistItemStatus @default(PENDING)
  required      Boolean             @default(true)
  estimatedTime String
  userInput     Json?
  orderIndex    Int
  completedAt   DateTime?
  createdAt     DateTime            @default(now())

  phase Phase @relation(fields: [phaseId], references: [id], onDelete: Cascade)

  @@map("checklist_items")
}

enum ExportFileType {
  CURSORRULES
  PRD_MD
  CONTEXT_MD
  ARCHITECTURE_MD
  PHASES_MD
  MINDMAP_PNG
}

model Export {
  id          String         @id @default(uuid())
  projectId   String
  fileType    ExportFileType
  fileContent String         @db.Text
  fileUrl     String?
  generatedAt DateTime       @default(now())

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@map("exports")
}
```

---

## 💰 6. MONÉTISATION

### 6.1 Plans Tarifaires

```markdown
### PLAN FREE (0€)
- 1 projet (lifetime)
- Accès Phases 1-3 uniquement
- Dashboard basique
- Exports Markdown
- ❌ Mind Map interactive
- ❌ Phases 4-10
- ❌ Export PDF
- ❌ Support prioritaire

**Objectif :** Lead magnet + validation concept

---

### PLAN PRO (29€/mois) ⭐ Recommandé
- 10 projets actifs
- Accès toutes les phases (1-10)
- Mind Map interactive (read-only)
- Exports Markdown + PDF
- Intégration Cursor (copier-coller)
- Utilise VOS clés API Claude (budget contrôlé)
- Support email (48h response)

**Objectif :** Solopreneurs & freelances

---

### PLAN TEAM (79€/mois)
- Projets illimités
- Mind Map collaborative (édition)
- Templates personnalisés
- Workspace partagé (5 membres)
- Option BYOK (Bring Your Own API Key)
- Support prioritaire (24h response)
- Session onboarding (1h)

**Objectif :** PME & agences 3-10 personnes

---

### PLAN ENTERPRISE (Sur devis)
- Tout Team +
- SSO / SAML
- API access pour intégration custom
- SLA 99.9%
- Support dédié (Slack channel)
- Formation équipe (half-day)
- Custom branding (white-label)

**Objectif :** Grandes agences & entreprises
```

---

### 6.2 Gestion des Clés API

**Options :**

**Option A : Clés API gérées par nous (Default)**
- **Free :** Quota limité (5 projets total)
- **Pro :** Quota généreux (10 projets/mois)
- **Team :** Quota illimité

**Avantages :**
- UX frictionless (pas de config user)
- Contrôle qualité (on choisit le modèle)

**Inconvénients :**
- Coûts serveurs élevés (10-50€ par génération de projet)
- Nécessite un système de quotas

---

**Option B : BYOK (Bring Your Own Key) - Optionnel**
- Disponible en **Team plan** (option premium)
- User entre sa clé Anthropic API
- Projets illimités avec sa clé

**Avantages :**
- Coûts contrôlés pour nous
- Power users satisfaits

**Inconvénients :**
- Friction à l'onboarding
- Support complexe ("ma clé ne marche pas")

---

**Recommandation :** Hybrid Model
- Free/Pro : Nos clés avec quotas
- Team : Nos clés par défaut + option BYOK
- Enterprise : BYOK obligatoire (volumes élevés)

---

## 📊 7. MÉTRIQUES DE SUCCÈS

### 7.1 KPIs Primaires

| Métrique | Objectif 30j | Objectif 60j | Objectif 90j |
|---|---|---|---|
| **Users inscrits** | 100 | 500 | 2,000 |
| **Projets créés** | 50 | 250 | 1,000 |
| **Conversion Free → Pro** | 5% | 10% | 15% |
| **MRR** | 300€ | 2,000€ | 10,000€ |
| **Churn mensuel** | <10% | <8% | <5% |

---

### 7.2 KPIs Secondaires

**Engagement :**
- % users qui complètent Phase 1 (Target : 70%)
- % users qui débloquent Phase 2 (Target : 50%)
- % users qui téléchargent le package Cursor (Target : 80% des Phase 3+)

**Qualité :**
- Net Promoter Score (NPS) (Target : ≥40)
- Satisfaction Phase Generation (Target : ≥4/5 stars)

**Acquisition :**
- CAC (Customer Acquisition Cost) (Target : <50€)
- LTV (Lifetime Value) (Target : >200€)
- LTV/CAC Ratio (Target : >4)

---

## 🚀 8. ROADMAP MVP (3 Mois)

### Month 1 : Foundation
**Semaine 1-2 :**
- Setup projet (Next.js + Supabase + Clerk)
- Auth flow complet
- Dashboard layout responsive

**Semaine 3-4 :**
- Wizard création projet (multi-step form)
- Backend : AI generation pipeline (Phase 1)
- Database setup complet

---

### Month 2 : Core Features
**Semaine 5-6 :**
- Phase 1 generation (Market Validation)
- Checklist interactive
- Déblocage progressif (logique)

**Semaine 7-8 :**
- Phase 2-3 generation (Setup & Architecture)
- Export system (Markdown files)
- Dashboard projet avec progression

---

### Month 3 : Monetization & Launch
**Semaine 9-10 :**
- Stripe integration
- Plans Free/Pro/Team
- Paywall enforcement

**Semaine 11-12 :**
- Testing complet (E2E)
- Bug fixes
- Landing page + Launch prep
- Beta users recruitment (50 users)

---

**Launch Date Target :** 28 Février 2026

---

## ✅ 9. SUCCESS CRITERIA

**MVP est un succès si :**
- ✅ 50+ users payants (Pro/Team) en 90 jours
- ✅ 10K€ MRR en 90 jours
- ✅ NPS ≥ 40
- ✅ Churn mensuel < 5%
- ✅ 80% des users complètent Phase 1

**Pivot si :**
- ❌ <20 users payants en 90 jours
- ❌ <3K€ MRR en 90 jours
- ❌ Churn mensuel > 15%
- ❌ <50% des users complètent Phase 1

---

**Next Steps :** Voir CONTEXT.md et ARCHITECTURE.md pour détails techniques.

---

**Version :** 1.0  
**Auto-generated by :** VibeFlow (meta!)
