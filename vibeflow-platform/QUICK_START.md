# ⚡ Quick Start - VibeFlow

## 📋 Checklist Rapide

- [ ] Configurer `.env.local` avec vos clés API
- [ ] Créer la base de données : `npx prisma migrate dev --name init`
- [ ] Lancer le serveur : `npm run dev`
- [ ] Ouvrir http://localhost:3000

---

## 🔑 Configuration .env.local

Copiez ces valeurs dans `.env.local` :

```env
# Clerk Auth (obligatoire)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Supabase (obligatoire)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
DATABASE_URL=postgresql://postgres:xxxxx@db.xxxxx.supabase.co:5432/postgres

# Anthropic (obligatoire pour génération IA)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Stripe (optionnel pour l'instant)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 🚀 Commandes Essentielles

### Développement

```bash
# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Lancer en production
npm run start

# Linter
npm run lint
```

### Base de Données (Prisma)

```bash
# Créer la première migration
npx prisma migrate dev --name init

# Générer le client Prisma (après chaque modif du schema)
npx prisma generate

# Ouvrir l'interface graphique de la DB
npx prisma studio

# Push le schema sans créer de migration (dev only)
npx prisma db push

# Reset la DB (ATTENTION : supprime toutes les données)
npx prisma migrate reset
```

### Shadcn UI

```bash
# Ajouter un nouveau composant
npx shadcn@latest add [component-name]

# Exemple : ajouter un badge
npx shadcn@latest add badge
```

### Formatage & Quality

```bash
# Formater le code
npx prettier --write .

# Vérifier les types TypeScript
npx tsc --noEmit
```

---

## 🏗️ Workflow de Développement Recommandé

### 1. Créer une nouvelle feature

```bash
# 1. Créer une branche
git checkout -b feature/nom-de-la-feature

# 2. Implémenter avec l'aide de Cursor
# Utilisez les prompts dans PROMPTS_IA.md

# 3. Tester localement
npm run dev

# 4. Commit
git add .
git commit -m "feat: description de la feature"

# 5. Push
git push origin feature/nom-de-la-feature
```

### 2. Modifier le schéma de base de données

```bash
# 1. Modifier prisma/schema.prisma
# Exemple : ajouter un champ à une table

# 2. Créer une migration
npx prisma migrate dev --name ajout_champ_description

# 3. Le client Prisma est auto-généré
# Si besoin manuel :
npx prisma generate

# 4. Vérifier dans Prisma Studio
npx prisma studio
```

### 3. Ajouter un nouveau composant UI

```bash
# 1. Ajouter le composant Shadcn si nécessaire
npx shadcn@latest add [component]

# 2. Créer votre composant custom
# src/components/custom/mon-composant.tsx

# 3. L'utiliser dans vos pages
# src/app/(dashboard)/ma-page/page.tsx
```

---

## 📁 Où Trouver Quoi ?

| Je veux... | Fichier |
|-----------|---------|
| Modifier la page d'accueil | `src/app/page.tsx` |
| Modifier le dashboard | `src/app/(dashboard)/page.tsx` |
| Ajouter une route API | `src/app/api/[nom]/route.ts` |
| Créer un composant UI | `src/components/custom/[nom].tsx` |
| Modifier le schéma DB | `prisma/schema.prisma` |
| Configurer l'auth Clerk | `src/middleware.ts`, `src/app/layout.tsx` |
| Ajouter des validations | `src/lib/validations/[nom].ts` |
| Créer des requêtes DB | `src/lib/db/queries/[nom].ts` |

---

## 🔍 Debugging

### Le serveur ne démarre pas

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# Vérifier les variables d'environnement
cat .env.local
```

### Erreur Prisma "Can't reach database"

```bash
# Vérifier DATABASE_URL dans .env.local
echo $DATABASE_URL

# Tester la connexion
npx prisma db pull
```

### Erreur TypeScript

```bash
# Vérifier les erreurs
npx tsc --noEmit

# Souvent résolu par :
npm run lint
```

### Page blanche / Erreur 404

```bash
# Vérifier la structure des dossiers
ls -R src/app

# Vérifier le middleware
cat src/middleware.ts
```

---

## 🎯 Prochaines Features à Implémenter

1. **Webhook Clerk** → `src/app/api/webhooks/clerk/route.ts`
2. **Création de projet** → `src/app/(dashboard)/projects/new/page.tsx`
3. **Génération IA** → `src/app/api/generate/route.ts`
4. **Liste des projets** → `src/app/(dashboard)/projects/page.tsx`
5. **Détail d'un projet** → `src/app/(dashboard)/projects/[id]/page.tsx`

Utilisez les prompts dans `PROMPTS_IA.md` pour chaque feature !

---

## 📞 Aide

- **Documentation complète :** `SETUP_COMPLETE.md`
- **Architecture technique :** `ARCHITECTURE.md`
- **Spécifications produit :** `PRD.md`
- **Prompts IA :** `PROMPTS_IA.md`
- **Standards de code :** `.cursorrules`

---

**Bon développement ! ⚡**

