# 🚀 PREMIER PROMPT POUR CURSOR

Copiez-collez ce prompt dans Cursor Chat **APRÈS avoir placé les fichiers .cursorrules, PRD.md, CONTEXT.md dans votre projet**.

---

## 📋 Prompt à Copier-Coller

```
Je commence le développement de VibeFlow, une plateforme SaaS qui génère automatiquement la structure complète de projets de développement IA-native.

# CONTEXTE PROJET

Lis attentivement ces fichiers pour comprendre le projet :
1. .cursorrules (instructions complètes)
2. PRD.md (Product Requirements Document)
3. CONTEXT.md (mémoire du projet)

# TASK IMMÉDIATE

Je veux initialiser le projet Next.js 15 avec toute la stack définie.

## Étape 1 : Initialiser le Projet Next.js

Crée un nouveau projet Next.js 15 avec cette commande :

```bash
npx create-next-app@latest vibeflow-platform \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

Confirme que toutes les options sont bien sélectionnées :
- TypeScript : Oui
- ESLint : Oui
- Tailwind CSS : Oui
- App Router : Oui
- src/ directory : Oui
- Import alias (@/*) : Oui

## Étape 2 : Installer les Dépendances Essentielles

Une fois le projet créé, installe toutes les dépendances nécessaires :

```bash
cd vibeflow-platform

# Auth & Database
npm install @clerk/nextjs @supabase/supabase-js @prisma/client prisma

# UI Components
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-checkbox
npm install lucide-react clsx tailwind-merge class-variance-authority

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# AI
npm install @anthropic-ai/sdk

# Payments
npm install stripe @stripe/stripe-js

# Dev Dependencies
npm install -D @types/node tsx vitest @vitejs/plugin-react
npm install -D prettier prettier-plugin-tailwindcss

# Shadcn UI
npx shadcn-ui@latest init
```

Lors de l'init Shadcn, choisis :
- Style : Default
- Base color : Slate
- CSS variables : Yes

Puis ajoute les composants Shadcn de base :

```bash
npx shadcn-ui@latest add button input card dialog dropdown-menu tabs checkbox select label textarea
```

## Étape 3 : Initialiser Prisma

```bash
npx prisma init
```

Cela va créer :
- prisma/schema.prisma
- .env (avec DATABASE_URL)

## Étape 4 : Créer la Structure de Dossiers

Crée cette structure complète dans le projet :

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── phases/
│   │   │       │   └── [phaseNumber]/
│   │   │       │       └── page.tsx
│   │   │       └── exports/
│   │   │           └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── projects/
│   │   │   └── route.ts
│   │   ├── generate/
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── clerk/
│   │           └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/           # Shadcn components (auto-generated)
│   └── custom/
│       ├── project-wizard.tsx
│       ├── phase-checklist.tsx
│       ├── project-card.tsx
│       └── navigation/
│           ├── sidebar.tsx
│           └── header.tsx
├── lib/
│   ├── db/
│   │   ├── prisma.ts
│   │   └── queries/
│   ├── auth/
│   │   └── clerk.ts
│   ├── ai/
│   │   └── claude.ts
│   ├── validations/
│   │   └── project.ts
│   └── utils.ts
└── prompts/
    ├── phase-1.txt
    ├── phase-2.txt
    ├── phase-3.txt
    └── cursorrules.txt
```

## Étape 5 : Configurer les Variables d'Environnement

Crée un fichier `.env.local` avec ces variables (je remplirai les valeurs plus tard) :

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# Anthropic API
ANTHROPIC_API_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Étape 6 : Configurer Tailwind CSS

Mets à jour `tailwind.config.ts` avec les couleurs et fonts :

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
```

## Étape 7 : Mettre à Jour les Fichiers de Config

Copie les fichiers suivants dans le projet (je les ai déjà préparés) :
- .cursorrules (à la racine)
- PRD.md (à la racine)
- CONTEXT.md (à la racine)

## Étape 8 : Premier Test

Lance le serveur de dev pour vérifier que tout fonctionne :

```bash
npm run dev
```

Ouvre http://localhost:3000 et vérifie que la page s'affiche.

# RÉSUMÉ

Une fois toutes ces étapes complétées, j'aurai :
✅ Projet Next.js 15 initialisé
✅ Toutes les dépendances installées
✅ Structure de dossiers créée
✅ Variables d'environnement préparées
✅ Tailwind configuré
✅ Shadcn UI installé
✅ Prisma initialisé

Je suis prêt à passer aux prochaines étapes :
- Configurer Clerk Auth
- Implémenter le Prisma schema
- Créer le layout dashboard

Confirme que tout est prêt et donne-moi la prochaine étape !
```

---

## 📝 Notes d'Utilisation

1. **Copiez le prompt complet** ci-dessus
2. **Ouvrez Cursor** dans un nouveau dossier
3. **Collez le prompt** dans Cursor Chat (Cmd+L ou Ctrl+L)
4. **Suivez les instructions** que Cursor vous donnera
5. **Vérifiez chaque étape** avant de passer à la suivante

---

## ✅ Checklist de Vérification Post-Setup

Après avoir exécuté le prompt, vérifiez :

- [ ] `npm run dev` lance le serveur sans erreur
- [ ] http://localhost:3000 affiche une page (même vide)
- [ ] Tous les dossiers sont créés dans `src/`
- [ ] `.env.local` existe (même avec valeurs vides)
- [ ] `prisma/schema.prisma` existe
- [ ] `tailwind.config.ts` est configuré
- [ ] Shadcn UI components sont installés dans `src/components/ui/`

---

## 🎯 Prochaine Étape Après Setup

Une fois le setup complet, lancez ce **deuxième prompt** dans Cursor :

```
Setup terminé ! Maintenant, je veux implémenter le schéma Prisma complet.

Référence le fichier PRD.md Section 5 (Database Schema) et crée le fichier prisma/schema.prisma avec :
- Toutes les tables (organizations, users, projects, phases, checklist_items, exports)
- Tous les enums
- Toutes les relations
- Les indexes pour performance

Ensuite, génère la migration initiale avec :
```bash
npx prisma migrate dev --name init
```

Confirme que la migration s'exécute sans erreur.
```

---

**Bon développement ! 🚀**
