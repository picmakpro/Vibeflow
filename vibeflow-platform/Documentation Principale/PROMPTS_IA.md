# PROMPTS_IA.md - VibeFlow Platform

> **Templates de prompts structurés selon le format GRCP** (Goal, Rules, Context, Process)  
> Ces prompts sont conçus pour **Claude Opus 4.5**, **GPT-5.1 Codex-Max**, et **Gemini 3 Pro**

---

## 📖 TABLE DES MATIÈRES

1. [Phase 1 : Setup & Context Engineering](#phase-1--setup--context-engineering)
2. [Phase 2 : Architecture & Planification](#phase-2--architecture--planification)
3. [Phase 3 : Implémentation Itérative](#phase-3--implémentation-itérative)
4. [Phase 4 : Validation & Testing](#phase-4--validation--testing)
5. [Phase 5 : Double Review](#phase-5--double-review)
6. [Phase 6 : Déploiement](#phase-6--déploiement)
7. [Prompts Utilitaires](#prompts-utilitaires)

---

## Phase 1 : Setup & Context Engineering

### 🎯 Prompt 1.1 : Initialiser le Projet Next.js 15

**Modèle recommandé :** Cursor Composer 1 ou GPT-5.1 Codex-Max

```
🎯 GOAL (Objectif)
Initialiser un projet Next.js 15 avec la stack AI-Native complète, prêt pour le développement.

🚫 RULES (Règles)
- Utilise UNIQUEMENT les technologies listées dans le contexte
- Respecte la structure de dossiers imposée
- Configure TypeScript en mode strict
- Ajoute tous les fichiers de configuration (.env.example, .eslintrc, .prettierrc)
- Génère un .gitignore complet

📚 CONTEXT (Contexte)
Tu es un Senior DevOps Engineer spécialisé en setup de projets Next.js.
Ce projet est VibeFlow, une plateforme SaaS d'orchestration pour le développement IA-Native.

Stack imposée :
- Framework : Next.js 15 (App Router)
- Language : TypeScript 5.7+
- Styling : Tailwind CSS 4.0
- Components : Shadcn UI
- Icons : Lucide React
- ORM : Prisma 6.0+
- Database : Supabase (PostgreSQL)
- Auth : Clerk
- Hosting : Vercel

🔄 PROCESS (Processus)
1. Initialise Next.js 15 avec `npx create-next-app@latest vibeflow --typescript --tailwind --app --src-dir`
2. Installe les dépendances listées dans le contexte
3. Configure Shadcn UI via `npx shadcn-ui@latest init`
4. Crée la structure de dossiers suivante :
   /app
     /api
     /(auth)
     /(dashboard)
   /components
     /ui
     /forms
     /layouts
   /lib
     /db
     /validations
     /utils
   /prisma
   /public
5. Génère les fichiers de configuration :
   - .env.example (avec toutes les variables nécessaires)
   - .cursorrules (copie depuis la documentation)
   - tsconfig.json (mode strict)
   - .eslintrc.json
   - .prettierrc
   - .gitignore
6. Crée un README.md avec les commandes de base
7. Vérifie que `npm run build` fonctionne sans erreur

✅ EXPECTED OUTPUT (Sortie attendue)
- Projet Next.js 15 initialisé et prêt
- Structure de dossiers conforme
- Tous les fichiers de configuration présents
- Build réussi sans erreur
- README.md avec instructions de démarrage
```

---

### 🎯 Prompt 1.2 : Créer le Schéma Prisma Complet

**Modèle recommandé :** Claude Opus 4.5 (reasoning profond pour relations complexes)

```
🎯 GOAL (Objectif)
Créer le schéma Prisma complet pour VibeFlow avec toutes les tables, relations, indexes, et constraints.

🚫 RULES (Règles)
- Respecte EXACTEMENT le schéma défini dans PRD.md
- Ajoute des indexes sur toutes les colonnes fréquemment requêtées (Foreign Keys, dates, statuts)
- Utilise @default(cuid()) pour tous les ID
- Ajoute des timestamps (createdAt, updatedAt) sur toutes les tables
- Nomme les relations de manière explicite
- Ajoute des contraintes de cascade (onDelete: Cascade) où approprié
- Commente chaque model avec un résumé de son rôle

📚 CONTEXT (Contexte)
Tu es un Senior Database Architect spécialisé en PostgreSQL et Prisma.
Ce projet est VibeFlow, une plateforme SaaS multi-tenant avec isolation stricte par organisation.

Architecture Multi-Tenant :
- Shared Database avec Row-Level Security (RLS)
- Isolation par orgId dans toutes les tables enfants
- Relations cascadées pour éviter les orphelins

Tables principales (voir PRD.md pour détails) :
1. Organization (tenant racine)
2. User (membres de l'organisation)
3. Project (projets créés par les users)
4. Phase (10 phases par projet)
5. PhaseReport (rapports générés par phase)
6. MindMap (mind map interactif du projet)
7. Dashboard (données de tracking)
8. AIGeneration (historique des générations IA)

🔄 PROCESS (Processus)
1. Lis attentivement le schéma défini dans PRD.md section "Base de Données"
2. Crée le fichier prisma/schema.prisma
3. Définis le datasource (PostgreSQL via Supabase)
4. Définis le generator (Prisma Client JS)
5. Pour chaque model :
   a. Ajoute un commentaire décrivant son rôle
   b. Définis tous les champs avec leurs types
   c. Ajoute les relations (1-to-many, many-to-many)
   d. Ajoute les indexes (@index) sur les FK et colonnes recherchées
   e. Ajoute les constraints (@unique, onDelete)
6. Vérifie la cohérence des relations (pas de relation orpheline)
7. Génère une migration initiale : `npx prisma migrate dev --name init`
8. Vérifie que `npx prisma generate` fonctionne sans erreur

✅ EXPECTED OUTPUT (Sortie attendue)
- Fichier prisma/schema.prisma complet et valide
- Toutes les tables, relations, indexes définis
- Migration initiale générée
- Prisma Client généré sans erreur
- Résumé des models créés (nombre de tables, relations)
```

---

### 🎯 Prompt 1.3 : Configurer Clerk + Supabase Sync

**Modèle recommandé :** GPT-5.1 Codex-Max (setup rapide)

```
🎯 GOAL (Objectif)
Configurer l'authentification Clerk avec synchronisation automatique vers Supabase via webhooks.

🚫 RULES (Règles)
- Utilise le Middleware Clerk pour protéger les routes /dashboard et /api
- Configure les webhooks Clerk pour sync (organization.created, user.created, organizationMembership.created)
- Valide la signature des webhooks avec svix
- Gère les erreurs de manière granulaire (logs Sentry)
- Ne JAMAIS exposer CLERK_WEBHOOK_SECRET dans le code client

📚 CONTEXT (Contexte)
Tu es un Senior Backend Engineer spécialisé en Auth et Webhooks.
Ce projet utilise Clerk pour l'auth et Supabase pour la DB.

Architecture Auth :
- Clerk gère l'authentification (users, organizations, sessions)
- Supabase stocke les données métier (projects, phases, reports)
- Synchronisation via webhooks Clerk → Supabase

Événements à synchroniser :
1. organization.created → Créer Organization dans Supabase
2. user.created → Créer User dans Supabase
3. organizationMembership.created → Lier User à Organization

🔄 PROCESS (Processus)
1. Configure le Middleware Clerk dans middleware.ts
   - Protège /dashboard(.*) et /api(.*)
   - Autorise /(auth|sign-in|sign-up)
2. Crée l'API Route /api/webhooks/clerk/route.ts
   - Vérifie la signature avec svix
   - Parse les événements Clerk
   - Synchronise avec Supabase via Prisma
3. Ajoute les variables d'environnement :
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - CLERK_WEBHOOK_SECRET
4. Configure les webhooks dans Clerk Dashboard :
   - URL : https://[votre-domaine]/api/webhooks/clerk
   - Events : organization.*, user.*, organizationMembership.*
5. Teste avec Clerk CLI : `clerk webhooks simulate`
6. Vérifie les logs dans Clerk Dashboard

✅ EXPECTED OUTPUT (Sortie attendue)
- Middleware Clerk configuré et fonctionnel
- Route webhook /api/webhooks/clerk créée
- Synchronisation testée avec succès
- Logs détaillés en cas d'erreur
- Documentation des événements synchronisés
```

---

## Phase 2 : Architecture & Planification

### 🎯 Prompt 2.1 : Générer le Plan Technique Détaillé (Lead Agent)

**Modèle recommandé :** Claude Opus 4.5 (reasoning profond)

```
🎯 GOAL (Objectif)
En tant que Lead Agent, générer un plan technique détaillé pour l'implémentation de VibeFlow, avec breakdown en tickets granulaires.

🚫 RULES (Règles)
- Chaque ticket doit être implémentable en 1-3 heures maximum
- Respecte l'ordre des dépendances (pas de ticket dépendant d'un ticket non fait)
- Numérote les tickets (VF-001, VF-002, etc.)
- Chaque ticket a : Titre, Description, Critères d'acceptation, Temps estimé, Dépendances
- Groupe les tickets par Epic (Feature principale)

📚 CONTEXT (Contexte)
Tu es le Lead Agent (Claude Opus 4.5), responsable de l'architecture et de la planification.
Tu as accès aux documents :
- PRD.md (User Stories, schéma DB, contraintes)
- .cursorrules (standards de code, stack technique)
- CONTEXT.md (état du projet, décisions)

Objectif du MVP :
Permettre à un utilisateur de :
1. Créer un compte (avec Clerk)
2. Créer un projet en répondant à des questions
3. Générer la Phase 1 (validation marché) automatiquement
4. Visualiser le rapport Phase 1 et le mind map
5. Télécharger le rapport en Markdown

🔄 PROCESS (Processus)
1. Analyse le PRD.md pour identifier tous les Epics et User Stories
2. Pour chaque Epic :
   a. Liste toutes les User Stories associées
   b. Décompose chaque US en tickets granulaires (1-3h)
   c. Identifie les dépendances entre tickets
   d. Estime le temps total de l'Epic
3. Crée un diagramme de dépendances (format Mermaid)
4. Génère un roadmap en sprints :
   - Sprint 1 (Semaine 1) : Quels Epics ?
   - Sprint 2 (Semaine 2) : Quels Epics ?
   - Sprint 3 (Semaine 3) : Quels Epics ?
5. Pour chaque ticket, rédige :
   - ID (VF-XXX)
   - Titre (45 caractères max)
   - Description (contexte, objectif)
   - Critères d'acceptation (3-5 points vérifiables)
   - Temps estimé (1-3h)
   - Dépendances (liste des IDs de tickets prérequis)
   - Agent assigné (Backend, Frontend, Test, Review)

✅ EXPECTED OUTPUT (Sortie attendue)
- Liste complète des tickets (format Markdown ou JSON)
- Diagramme de dépendances (Mermaid)
- Roadmap 3 sprints
- Temps total estimé pour le MVP
- Recommandations de parallélisation (quels tickets peuvent être faits en simultané)

FORMAT DE SORTIE :
```markdown
## Epic 1 : Auth & Organizations

### VF-001 : Setup Clerk Middleware
**Description :** Configurer le middleware Clerk pour protéger les routes /dashboard et /api.
**Critères d'acceptation :**
- ✅ Routes /dashboard protégées (redirect vers /sign-in si non auth)
- ✅ Routes /api retournent 401 si non auth
- ✅ Routes /(auth|sign-in|sign-up) publiques
**Temps estimé :** 1h
**Dépendances :** Aucune
**Agent :** Backend Agent

### VF-002 : Créer le layout Dashboard
**Description :** Créer le layout du dashboard avec sidebar et header.
**Critères d'acceptation :**
- ✅ Sidebar avec navigation (Projects, Settings, Help)
- ✅ Header avec user menu (profile, logout)
- ✅ Responsive (mobile-first)
**Temps estimé :** 2h
**Dépendances :** VF-001
**Agent :** Frontend Agent

(...)
```
```

---

### 🎯 Prompt 2.2 : Créer les Diagrammes d'Architecture (Mermaid)

**Modèle recommandé :** Claude Opus 4.5 ou Gemini 3 Pro

```
🎯 GOAL (Objectif)
Créer 3 diagrammes d'architecture en format Mermaid pour documentation et communication.

🚫 RULES (Règles)
- Utilise la syntaxe Mermaid valide (testée sur mermaid.live)
- Code couleur cohérent (bleu=frontend, vert=backend, orange=externe, rouge=DB)
- Légendes explicites
- Orienté de haut en bas (top to bottom)

📚 CONTEXT (Contexte)
Tu es un Senior Solutions Architect.
Ces diagrammes serviront à :
1. Onboarding des nouveaux devs
2. Documentation technique
3. Présentation aux investisseurs

🔄 PROCESS (Processus)
Crée 3 diagrammes distincts :

1. **Diagramme Système (Architecture Globale)**
   - User → Next.js Frontend → Supabase DB
   - User → Next.js Frontend → Claude API (génération IA)
   - Clerk Auth (external) → Next.js
   - Vercel Hosting

2. **Diagramme Base de Données (Entity-Relationship)**
   - Toutes les tables Prisma
   - Relations (1-to-many, many-to-many)
   - Indexes importants

3. **Diagramme Flux Utilisateur (User Flow)**
   - Création de compte
   - Création de projet
   - Génération Phase 1
   - Visualisation rapport
   - Téléchargement Markdown

✅ EXPECTED OUTPUT (Sortie attendue)
Fichier ARCHITECTURE.md contenant les 3 diagrammes Mermaid encadrés par ```mermaid ... ```
```

---

## Phase 3 : Implémentation Itérative

### 🎯 Prompt 3.1 : Implémenter un Ticket (Backend Agent)

**Modèle recommandé :** GPT-5.1 Codex-Max ou Cursor Composer 1

```
🎯 GOAL (Objectif)
Implémenter le ticket [VF-XXX] : [Titre du ticket] selon les critères d'acceptation définis.

🚫 RULES (Règles)
- Respecte TOUTES les règles de .cursorrules
- Code en TypeScript strict (pas de any)
- Gère toutes les erreurs (try/catch + messages utilisateur)
- Valide les inputs avec Zod
- Ajoute des logs structurés (pas de console.log)
- Vérifie l'authentification Clerk dans toutes les Server Actions
- Isole par orgId (multi-tenant)

📚 CONTEXT (Contexte)
Tu es le Backend Agent (GPT-5.1 Codex-Max), responsable de l'implémentation des API Routes et Server Actions.
Tu as accès aux documents :
- PRD.md (spécifications)
- .cursorrules (standards)
- CONTEXT.md (état du projet)
- prisma/schema.prisma (structure DB)

Ticket à implémenter :
[Copier-coller ici la description complète du ticket depuis le plan technique]

🔄 PROCESS (Processus)
1. Lis attentivement le ticket (description + critères d'acceptation)
2. Identifie les fichiers à créer/modifier
3. Pour chaque fichier :
   a. Crée la structure de base (imports, types)
   b. Implémente la logique métier
   c. Ajoute la gestion d'erreurs
   d. Ajoute la validation des inputs (Zod)
   e. Ajoute les logs
4. Vérifie que le code respecte .cursorrules :
   - Pas de TODO/FIXME
   - Pas de console.log
   - Pas de any
   - Gestion d'erreurs complète
5. Teste manuellement (si possible) ou prépare les tests pour Test Agent
6. Fais un résumé de ce qui a été fait

✅ EXPECTED OUTPUT (Sortie attendue)
- Code implémenté dans les fichiers appropriés
- Tous les critères d'acceptation validés
- Pas d'erreur TypeScript (npm run build passe)
- Résumé des fichiers créés/modifiés
- Liste des prochaines étapes (si dépendances)

FORMAT DE SORTIE :
```markdown
## ✅ Ticket VF-XXX : [Titre] - IMPLÉMENTÉ

### Fichiers créés
- `/app/actions/projects.ts` : Server Actions pour CRUD projects
- `/lib/validations/project.ts` : Schémas Zod pour validation

### Fichiers modifiés
- Aucun

### Critères d'acceptation
- ✅ CA1 : [Description]
- ✅ CA2 : [Description]
- ✅ CA3 : [Description]

### Tests manuels effectués
- ✅ Création d'un projet avec nom valide
- ✅ Tentative de création sans auth → 401
- ✅ Tentative de création avec nom trop court → Erreur validation

### Prochaines étapes
- VF-XXX+1 : Implémenter l'affichage de la liste des projets (Frontend Agent)

### Temps réel
- Estimé : 2h
- Réel : 1h45min
```
```

---

### 🎯 Prompt 3.2 : Implémenter un Composant UI (Frontend Agent)

**Modèle recommandé :** Cursor Composer 1

```
🎯 GOAL (Objectif)
Implémenter le composant UI [NomComposant] selon les spécifications du ticket [VF-XXX].

🚫 RULES (Règles)
- Utilise UNIQUEMENT les composants Shadcn UI (pas de custom components sauf si nécessaire)
- Respecte les conventions Tailwind (ordre : layout → spacing → typography → visuals)
- Composants fonctionnels uniquement (pas de class components)
- Props destructurées + types explicites
- Early returns pour réduire la nesting
- Ajoute aria-labels pour l'accessibilité
- Responsive mobile-first
- Utilise 'use client' uniquement si nécessaire (hooks, events)

📚 CONTEXT (Contexte)
Tu es le Frontend Agent (Cursor Composer 1), responsable de l'implémentation des composants React et de l'UI.
Tu as accès aux documents :
- PRD.md (spécifications UI/UX)
- .cursorrules (standards React)
- Shadcn UI docs (https://ui.shadcn.com)

Ticket à implémenter :
[Copier-coller ici la description complète du ticket UI]

🔄 PROCESS (Processus)
1. Identifie les composants Shadcn UI à utiliser (Button, Card, Input, etc.)
2. Crée le fichier du composant dans /components/ (ou /components/ui/ si Shadcn)
3. Définis les types des props (interface ou type)
4. Implémente le composant :
   a. Destructure les props
   b. Ajoute les early returns (si !data, loading, error)
   c. Structure le JSX (semantic HTML)
   d. Applique les classes Tailwind (ordre logique)
   e. Ajoute les aria-labels
5. Teste le responsive (mobile, tablet, desktop)
6. Vérifie l'accessibilité (contraste, navigation clavier)
7. Prends un screenshot (si possible) pour validation visuelle

✅ EXPECTED OUTPUT (Sortie attendue)
- Composant React créé et fonctionnel
- Types TypeScript définis
- Accessible (WCAG AA)
- Responsive (mobile-first)
- Screenshot (si possible)

FORMAT DE SORTIE :
```markdown
## ✅ Composant [NomComposant] - IMPLÉMENTÉ

### Fichier créé
- `/components/ProjectCard.tsx`

### Props
```typescript
interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string
    status: ProjectStatus
    createdAt: Date
  }
  onEdit?: () => void
  onDelete?: () => void
}
```

### Composants Shadcn utilisés
- Card (card, card-header, card-title, card-description, card-content, card-footer)
- Button (primary, secondary, destructive)
- Badge (status indicator)

### Accessibilité
- ✅ aria-label sur les boutons d'action
- ✅ Contraste suffisant (WCAG AA)
- ✅ Navigation clavier (tab, enter)

### Responsive
- ✅ Mobile (320px+) : Stack vertical
- ✅ Tablet (768px+) : Grid 2 colonnes
- ✅ Desktop (1024px+) : Grid 3 colonnes

### Screenshot
[Si possible, ajouter un screenshot ou décrire visuellement]

### Prochaines étapes
- VF-XXX+1 : Intégrer ProjectCard dans la page /dashboard/projects
```
```

---

## Phase 4 : Validation & Testing

### 🎯 Prompt 4.1 : Générer les Tests Unitaires (Test Agent)

**Modèle recommandé :** Claude 3.5 Sonnet (rapport qualité/prix)

```
🎯 GOAL (Objectif)
Générer les tests unitaires pour le fichier [chemin/vers/fichier.ts] avec couverture de 80%+.

🚫 RULES (Règles)
- Utilise Vitest (pas Jest)
- Test les cas normaux ET les edge cases
- Mock les dépendances externes (DB, API, Auth)
- Nomme les tests de manière descriptive (describe + it)
- Vérifie les erreurs attendues (expect().toThrow())
- Couverture minimum : 80% (lignes, branches, fonctions)

📚 CONTEXT (Contexte)
Tu es le Test Agent (Claude 3.5 Sonnet), responsable de la qualité et des tests.
Ce projet utilise :
- Framework de test : Vitest
- Testing Library : @testing-library/react (pour composants)
- Mocking : vi.mock(), vi.fn()

🔄 PROCESS (Processus)
1. Analyse le fichier à tester (fonctions, composants, logique)
2. Identifie les cas de test :
   - Happy path (cas normal)
   - Edge cases (valeurs limites, nulls, undefined)
   - Error cases (erreurs attendues)
3. Pour chaque fonction/composant :
   a. Crée un describe('[NomFonction]')
   b. Liste tous les cas de test (it('should ...'))
   c. Mock les dépendances (DB, API, Auth)
   d. Écris les assertions (expect)
4. Lance les tests : `npm run test`
5. Vérifie la couverture : `npm run test:coverage`
6. Si couverture < 80%, ajoute des tests manquants

✅ EXPECTED OUTPUT (Sortie attendue)
- Fichier de test créé ([fichier].test.ts ou [fichier].spec.ts)
- Tous les tests passent (npm run test)
- Couverture ≥ 80%
- Résumé de la couverture

FORMAT DE SORTIE :
```markdown
## ✅ Tests pour [fichier.ts] - CRÉÉS

### Fichier de test
- `/app/actions/projects.test.ts`

### Cas de test couverts
#### createProject()
- ✅ should create a project with valid data
- ✅ should throw error if user not authenticated
- ✅ should throw error if name is too short
- ✅ should isolate by orgId (multi-tenant)

#### getProjects()
- ✅ should return all projects for authenticated user
- ✅ should return empty array if no projects
- ✅ should filter by orgId

### Couverture
- Lignes : 85% (34/40)
- Branches : 80% (8/10)
- Fonctions : 100% (4/4)

### Tests passés
- Total : 8/8 ✅
- Durée : 1.2s

### Améliorations possibles
- Ajouter tests E2E pour le flux complet (Playwright)
```
```

---

## Phase 5 : Double Review

### 🎯 Prompt 5.1 : Review Code Quality (Review Agent)

**Modèle recommandé :** Claude Opus 4.5 (détection fine des problèmes)

```
🎯 GOAL (Objectif)
Reviewer le code du ticket [VF-XXX] et identifier tous les problèmes (bugs, sécurité, performance, standards).

🚫 RULES (Règles)
- Vérifie TOUTES les règles de .cursorrules
- Identifie les problèmes de sécurité (injection, XSS, CSRF, clés API exposées)
- Détecte les problèmes de performance (N+1 queries, requêtes non optimisées)
- Vérifie l'isolation multi-tenant (filtrage par orgId)
- Signale les violations de standards (code style, nommage, structure)
- Propose des solutions concrètes (pas seulement pointer les problèmes)

📚 CONTEXT (Contexte)
Tu es le Review Agent (Claude Opus 4.5), responsable de la qualité et de la sécurité du code.
Tu as accès aux documents :
- .cursorrules (standards à respecter)
- PRD.md (spécifications)
- CONTEXT.md (décisions d'architecture)

Ticket à reviewer :
[VF-XXX] : [Titre]

Fichiers modifiés :
- /app/actions/projects.ts
- /components/ProjectCard.tsx
- (etc.)

🔄 PROCESS (Processus)
1. Lis chaque fichier modifié ligne par ligne
2. Pour chaque problème détecté :
   a. Catégorise (🔴 Critique, 🟠 Majeur, 🟡 Mineur, 🔵 Suggestion)
   b. Identifie la ligne exacte
   c. Explique le problème
   d. Propose une solution
3. Vérifie spécifiquement :
   - Sécurité : Clés API, injection SQL, XSS, CSRF, auth bypass
   - Performance : N+1 queries, indexes manquants, requêtes lourdes
   - Multi-tenant : Filtrage par orgId, isolation des données
   - Standards : Respect de .cursorrules, conventions de nommage
   - Tests : Couverture suffisante, edge cases
4. Génère un score de qualité (0-100)
5. Décide : APPROVE ou REQUEST CHANGES

✅ EXPECTED OUTPUT (Sortie attendue)
- Liste de tous les problèmes détectés (avec solutions)
- Score de qualité (0-100)
- Décision : APPROVE ou REQUEST CHANGES

FORMAT DE SORTIE :
```markdown
## 🔍 Review : Ticket [VF-XXX]

### Score de qualité : 85/100

### Problèmes détectés

#### 🔴 CRITIQUE : Clé API exposée dans le code client
**Fichier :** /app/actions/projects.ts:15
**Problème :** La variable `process.env.ANTHROPIC_API_KEY` est utilisée dans une Server Action, mais pourrait être exposée si le code est mal déployé.
**Solution :**
```typescript
// ❌ MAUVAIS
const apiKey = process.env.ANTHROPIC_API_KEY

// ✅ BON
const apiKey = process.env.ANTHROPIC_API_KEY
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY is not defined')
}
```

#### 🟠 MAJEUR : Requête N+1 dans getProjects()
**Fichier :** /app/actions/projects.ts:42
**Problème :** La fonction charge tous les projets puis itère pour charger les phases → N+1 queries
**Solution :**
```typescript
// ❌ MAUVAIS
const projects = await prisma.project.findMany()
for (const project of projects) {
  project.phases = await prisma.phase.findMany({ where: { projectId: project.id } })
}

// ✅ BON
const projects = await prisma.project.findMany({
  include: { phases: true }
})
```

#### 🟡 MINEUR : Pas de aria-label sur le bouton Delete
**Fichier :** /components/ProjectCard.tsx:67
**Problème :** Le bouton Delete n'a pas d'aria-label → mauvaise accessibilité
**Solution :**
```tsx
<Button 
  variant="destructive"
  aria-label={`Delete project ${project.name}`}
  onClick={onDelete}
>
  <TrashIcon />
</Button>
```

#### 🔵 SUGGESTION : Utiliser useMemo pour optimiser le rendu
**Fichier :** /components/ProjectCard.tsx:25
**Problème :** Le calcul de `progressPercentage` est refait à chaque render
**Solution :**
```typescript
const progressPercentage = useMemo(() => {
  return Math.round((completedPhases / totalPhases) * 100)
}, [completedPhases, totalPhases])
```

### Résumé
- 🔴 Critiques : 1
- 🟠 Majeurs : 1
- 🟡 Mineurs : 1
- 🔵 Suggestions : 1

### Décision : ❌ REQUEST CHANGES

**Raison :** Problèmes critiques et majeurs doivent être corrigés avant merge.

### Prochaines étapes
1. Corriger les problèmes 🔴 et 🟠
2. Re-submit pour review
3. Une fois approuvé → merge + déploiement
```
```

---

## Prompts Utilitaires

### 🔧 Prompt U.1 : Debug d'une Erreur

**Modèle recommandé :** Claude Opus 4.5

```
🎯 GOAL
Identifier la cause racine de l'erreur suivante et proposer un fix.

🚫 RULES
- Ne propose PAS de workaround (contournement) → fix la cause racine
- Explique POURQUOI l'erreur se produit (pas seulement comment la corriger)
- Propose un test pour éviter la régression

📚 CONTEXT
[Coller ici : stack trace complète, code concerné, contexte d'exécution]

🔄 PROCESS
1. Lis la stack trace (dernière ligne = cause probable)
2. Identifie le fichier et la ligne exacte
3. Analyse le code autour (10 lignes avant/après)
4. Identifie la cause racine (pas le symptôme)
5. Propose un fix + explique pourquoi
6. Propose un test pour éviter la régression

✅ OUTPUT
- Cause racine identifiée
- Fix proposé (code corrigé)
- Explication du pourquoi
- Test proposé
```

---

### 🔧 Prompt U.2 : Refactoring d'une Fonction Complexe

**Modèle recommandé :** Claude 3.5 Sonnet

```
🎯 GOAL
Refactoriser la fonction [nomFonction] pour améliorer la lisibilité et la maintenabilité.

🚫 RULES
- Respecte le principe de single responsibility (1 fonction = 1 tâche)
- Extrais les sous-fonctions logiques
- Améliore le nommage (variables, fonctions)
- Réduis la complexité cyclomatique (< 10)
- Conserve le comportement exact (pas de régression)

📚 CONTEXT
[Coller ici : code de la fonction à refactorer]

🔄 PROCESS
1. Analyse la fonction (que fait-elle ? combien de responsabilités ?)
2. Identifie les blocs logiques distincts
3. Extrais chaque bloc en sous-fonction
4. Renomme les variables pour plus de clarté
5. Réduis la nesting (early returns)
6. Ajoute des commentaires JSDoc si nécessaire
7. Vérifie que le comportement est identique

✅ OUTPUT
- Code refactorisé
- Liste des sous-fonctions créées
- Résumé des améliorations (lisibilité, complexité)
- Tests pour vérifier la non-régression
```

---

**Version :** 1.0  
**Dernière mise à jour :** 28 Novembre 2025  
**Prochaine révision :** Après Phase 3 (ajout de nouveaux templates)
