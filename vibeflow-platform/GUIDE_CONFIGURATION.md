# 🚀 GUIDE DE CONFIGURATION - VibeFlow Platform

**Date :** 28 Novembre 2025  
**Phase :** 1 - Setup & Context Engineering  
**Statut :** ✅ Fichiers créés, configuration requise

---

## ✅ CE QUI VIENT D'ÊTRE CRÉÉ

### Fichiers Créés (5 fichiers)

| Fichier | Description | Statut |
|---------|-------------|--------|
| `src/lib/db/prisma.ts` | Client Prisma singleton | ✅ Créé |
| `src/middleware.ts` | Protection routes Clerk | ✅ Créé |
| `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` | Page connexion | ✅ Créé |
| `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` | Page inscription | ✅ Créé |
| `src/app/api/webhooks/clerk/route.ts` | Webhook Clerk → Supabase | ✅ Créé |

### Dépendances Installées

- ✅ `svix` - Vérification signatures webhooks Clerk

---

## 🔑 ÉTAPE 1 : Configurer les Variables d'Environnement

### Créer le fichier `.env.local`

```bash
cd /Users/mak/Vibeflow/vibeflow-platform
touch .env.local
```

### Contenu du fichier `.env.local`

```env
# ============================================
# CLERK (Authentification)
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXX

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# ============================================
# SUPABASE (Base de données PostgreSQL)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://dybvzjqncaosqcwvzipg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XXXXXXXXXX
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XXXXXXXXXX

# Database URL pour Prisma
DATABASE_URL=postgresql://postgres:VOTRE_PASSWORD@db.dybvzjqncaosqcwvzipg.supabase.co:5432/postgres

# ============================================
# ANTHROPIC (Claude AI)
# ============================================
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXXXXXX

# ============================================
# NEXT.JS
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🔍 ÉTAPE 2 : Récupérer les Clés API

### 2.1 Clerk (Authentification)

**Dashboard :** https://dashboard.clerk.com

1. **Créer une application**
   - Cliquez sur "Add application"
   - Nom : "VibeFlow"
   - Framework : Next.js
   - Cochez "Organizations" (IMPORTANT !)

2. **Activer Organizations**
   - Settings → Organizations
   - Activez "Organizations" si pas déjà fait
   - Mode : "Public" (users peuvent créer des orgs)

3. **Récupérer les clés**
   - API Keys → Quick Copy
   - Copiez :
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`

4. **Configurer le Webhook**
   - Webhooks → Add Endpoint
   - Endpoint URL : `http://localhost:3000/api/webhooks/clerk` (temporaire)
   - Sélectionnez ces événements :
     - ✅ `organization.created`
     - ✅ `organization.updated`
     - ✅ `organization.deleted`
     - ✅ `user.created`
     - ✅ `organizationMembership.created`
     - ✅ `organizationMembership.deleted`
   - Copiez le `CLERK_WEBHOOK_SECRET` (commence par `whsec_`)

**Note :** Pour tester les webhooks en local, utilisez Clerk CLI :
```bash
npx clerk webhooks listen
```

---

### 2.2 Supabase (Base de données)

**Dashboard :** https://supabase.com/dashboard/project/dybvzjqncaosqcwvzipg

1. **Récupérer les clés API**
   - Settings → API
   - Copiez :
     - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

2. **Récupérer le Database Password**
   - Settings → Database
   - Database password (ou réinitialisez-le)
   - Construisez `DATABASE_URL` :
     ```
     postgresql://postgres:[VOTRE_PASSWORD]@db.dybvzjqncaosqcwvzipg.supabase.co:5432/postgres
     ```

**Votre projet Supabase :**
- ID : `dybvzjqncaosqcwvzipg`
- Région : `eu-central-1` (Frankfurt)
- Statut : ✅ ACTIVE_HEALTHY

---

### 2.3 Anthropic (Claude AI)

**Console :** https://console.anthropic.com

1. Créez un compte (si pas déjà fait)
2. Settings → API Keys
3. Créez une nouvelle clé
4. Copiez `ANTHROPIC_API_KEY`

**Note :** La clé commence par `sk-ant-`

---

## 🗄️ ÉTAPE 3 : Appliquer les Migrations Prisma

Une fois `.env.local` configuré :

```bash
cd /Users/mak/Vibeflow/vibeflow-platform

# Créer la migration initiale
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate

# Vérifier que les tables sont créées (ouvre une interface web)
npx prisma studio
```

**Résultat attendu :**
- ✅ Dossier `prisma/migrations/` créé
- ✅ 6 tables créées dans Supabase :
  - `organizations`
  - `users`
  - `projects`
  - `phases`
  - `checklist_items`
  - `exports`

---

## 🧪 ÉTAPE 4 : Tester l'Application

### 4.1 Démarrer le serveur de développement

```bash
npm run dev
```

Ouvrez http://localhost:3000

### 4.2 Tester l'authentification

1. **Page d'accueil**
   - ✅ La page s'affiche sans erreur

2. **Inscription**
   - Cliquez sur "Commencer gratuitement" (ou allez sur `/sign-up`)
   - Créez un compte avec votre email
   - ✅ Vous devriez être redirigé vers `/dashboard`

3. **Vérifier la synchronisation**
   - Ouvrez Prisma Studio : `npx prisma studio`
   - ✅ Vérifiez qu'une `Organization` a été créée
   - ✅ Vérifiez qu'un `User` a été créé et lié à l'organisation

4. **Dashboard**
   - ✅ Votre prénom s'affiche dans "Bienvenue, [Prénom] !"
   - ✅ Les 3 cartes sont visibles (Projets, Nouveau projet, Paramètres)

---

## 🐛 Troubleshooting

### Erreur : "CLERK_WEBHOOK_SECRET is not defined"

**Solution :** Ajoutez `CLERK_WEBHOOK_SECRET` dans `.env.local`

---

### Erreur : "Prisma Client did not initialize yet"

**Solution :**
```bash
npx prisma generate
```

---

### Erreur : Migration échoue

**Vérifiez :**
1. `DATABASE_URL` est correct dans `.env.local`
2. Le password Supabase est bon
3. Supabase est accessible :
   ```bash
   ping db.dybvzjqncaosqcwvzipg.supabase.co
   ```

---

### Les webhooks Clerk ne fonctionnent pas en local

**Solution temporaire :** Utilisez Clerk CLI
```bash
npx clerk webhooks listen --forward-to http://localhost:3000/api/webhooks/clerk
```

---

## ✅ Checklist de Validation

Avant de passer à la Phase 2, vérifiez :

- [ ] Le serveur démarre sans erreur (`npm run dev`)
- [ ] La page d'accueil s'affiche (http://localhost:3000)
- [ ] Je peux créer un compte et me connecter
- [ ] Je suis redirigé vers `/dashboard` après inscription
- [ ] Le dashboard affiche mon prénom
- [ ] Prisma Studio montre mes données (`npx prisma studio`)
- [ ] La table `organizations` contient mon organisation
- [ ] La table `users` contient mon utilisateur
- [ ] Les 6 tables sont bien créées dans Supabase

---

## 📊 ÉTAT PHASE 1

### Progression

| Prompt | Titre | Avant | Après |
|--------|-------|-------|-------|
| 1.1 | Initialiser Next.js 15 | 40% | **100%** ✅ |
| 1.2 | Créer Schéma Prisma | 60% | **100%** ✅ |
| 1.3 | Configurer Clerk + Supabase Sync | 0% | **100%** ✅ |

**Phase 1 : ✅ COMPLÉTÉE (à valider avec les tests ci-dessus)**

---

## 🚀 PROCHAINE ÉTAPE : Phase 2

Une fois tous les tests validés, passez à la **Phase 2 : Architecture & Planification**

**Prochain prompt :**
```
Phase 1 complétée avec succès ! Tous les tests passent.

Maintenant, implémente la Phase 2 selon PROMPTS_IA.md :

1. Générer le plan technique détaillé (Prompt 2.1 - Lead Agent)
2. Créer les diagrammes Mermaid supplémentaires si besoin

Référence :
- PROMPTS_IA.md (Phase 2)
- .cursorrules (standards)
- PRD.md (spécifications)
```

---

## 📝 Fichiers de Référence

- **`PROMPTS_IA.md`** : Templates de prompts pour chaque phase
- **`.cursorrules`** : Standards de développement
- **`PRD.md`** : Spécifications produit
- **`ARCHITECTURE.md`** : Diagrammes techniques
- **`CONTEXT.md`** : État du projet

---

**Guide créé le :** 28 Novembre 2025  
**Version :** 1.0  
**Prochaine mise à jour :** Après validation Phase 1

