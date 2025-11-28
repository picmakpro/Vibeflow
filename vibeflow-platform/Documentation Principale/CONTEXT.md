# CONTEXT.md - VibeFlow

## 📅 PROJECT TIMELINE

- **Started:** 28 Nov 2025
- **Current Phase:** Phase 2 - Setup & Context Engineering
- **Target MVP Launch:** 28 Feb 2026 (12 weeks)
- **Target Beta:** 31 Jan 2026 (10 weeks)

---

## 🎯 PROJECT VISION

**One-Liner:**
> La plateforme qui transforme une idée d'app en projet Cursor structuré complet, en 15 minutes.

**Core Value Proposition:**
- Pas de génération de code → Génération de MÉTHODOLOGIE
- Pas de remplacement IDE → Préparation AVANT l'IDE
- Colonne vertébrale du projet IA-native

---

## 🔑 KEY DECISIONS MADE

### 1. Stack Technique (28 Nov 2025)

**Decision:** Next.js 15 + Supabase + Clerk + Claude 3.5 Sonnet

**Rationale:**
- **Next.js 15:** App Router mature, Server Actions, meilleure doc IA
- **Supabase:** PostgreSQL + RLS natif, pgvector ready, excellent DX
- **Clerk:** Multi-tenant built-in, Organizations native, meilleur auth DX
- **Claude 3.5 Sonnet:** Meilleur modèle pour génération de docs structurées (vs GPT-4o)

**Rejected Alternatives:**
- Firebase (NoSQL complexe pour IA, pas de RLS natif)
- NextAuth (pas de multi-tenant natif)
- GPT-4o (hallucinations plus fréquentes sur docs longues)

---

### 2. Scope MVP : Phases 1-3 Seulement (28 Nov 2025)

**Decision:** MVP génère UNIQUEMENT les Phases 1-3 (Validation, Setup, Architecture)

**Rationale:**
- 80% de la valeur dans ces 3 premières phases
- Validation rapide du concept (3 mois vs 6 mois pour 10 phases)
- Phases 4-10 ajoutées en V2 post-validation marché

**Impact:** Pricing Free donne accès aux 3 phases (valeur perçue élevée)

---

### 3. Déblocage Progressif Obligatoire (28 Nov 2025)

**Decision:** Phase N+1 débloquée UNIQUEMENT si Phase N ≥ 80% complétée

**Rationale:**
- Force l'utilisateur à suivre la méthodologie (pas de "skip")
- Réduit les hallucinations (contexte toujours à jour)
- Différenciateur vs Notion/Linear (pas de liberté = guidage fort)

**Rejected:** Déblocage manuel par l'utilisateur (trop permissif)

---

### 4. Gestion API Keys : Hybrid Model (28 Nov 2025)

**Decision:**
- **Free/Pro:** Nos clés Claude avec quotas
- **Team:** Nos clés par défaut + option BYOK (Bring Your Own Key)
- **Enterprise:** BYOK obligatoire

**Rationale:**
- UX frictionless pour Free/Pro (pas de config)
- Coûts contrôlés pour Team/Enterprise (volumes élevés)
- Power users satisfaits (option BYOK)

**Impact sur Pricing:**
- Free : 1 projet total (coût pour nous : ~20€ one-time)
- Pro : 10 projets/mois (coût pour nous : ~200€/mois max)
- Team : Illimité avec BYOK (coût pour nous : 0€ si BYOK activé)

---

### 5. Exports : Markdown Priority, PDF Secondary (28 Nov 2025)

**Decision:** MVP exporte UNIQUEMENT en Markdown, PDF en V2

**Rationale:**
- Markdown = format natif pour Cursor/.cursorrules
- PDF = nice-to-have mais pas bloquant MVP
- Simplification technique (pas de librairie PDF complex)

**Impact:** PDF devient feature premium (Pro+) en V2

---

### 6. Mind Map : V2 Feature (28 Nov 2025)

**Decision:** Mind Map interactive NON incluse dans MVP

**Rationale:**
- Complexité technique élevée (React Flow, layout algorithms)
- Valeur perçue faible vs effort (80h de dev estimé)
- Peut être mockée avec image statique en V1

**Alternative MVP:** Export Mermaid diagram (texte) que l'user peut visualiser ailleurs

**V2:** React Flow interactive avec collaboration

---

### 7. Pricing : 29€ Pro / 79€ Team (28 Nov 2025)

**Decision:** Prix fixés à 29€/mois (Pro) et 79€/mois (Team)

**Benchmark:**
- Cursor Pro : 20€/mois
- Windsurf : 15€/mois
- Notion AI : 10€/user/mois
- Linear : 8-16€/user/mois

**Positioning:** Entre Cursor (20€) et Replit (35€)

**Validation:** 12 early users interrogés, 10/12 disent "acceptable" pour 29€

---

## 📋 FEATURES VALIDATED IN PHASE 1

✅ **Auth & Multi-tenant** (Clerk Organizations)
✅ **Project Creation Wizard** (3-step form)
✅ **Phase 1-3 Generation** (Claude 3.5 Sonnet)
✅ **Checklist Interactive** (avec DB persistence)
✅ **Dashboard Projet** (progression + phases)
✅ **Export Markdown** (.cursorrules, PRD.md, CONTEXT.md, ARCHITECTURE.md)
✅ **Déblocage Progressif** (≥80% règle)
✅ **Plans Free/Pro/Team** (Stripe integration)

---

## ❌ FEATURES DEFERRED TO V2

❌ Mind Map interactive (React Flow)
❌ Export PDF (librairie PDF)
❌ Phases 4-10 generation (Testing, Sécurité, Déploiement, etc.)
❌ Collaboration temps réel (Team plan)
❌ Templates marketplace (user-generated)
❌ MCP integration (sync bidirectionnel Cursor)
❌ Multi-IDE support (Windsurf, VS Code, Zed)
❌ Mobile app
❌ Public API

**Rationale V2:** Valider market-fit avec MVP minimaliste avant d'investir dans ces features complexes.

---

## 🏗️ CURRENT STATUS

### Phase Completion

- **Phase 0 : Idéation & Research** : ✅ Completed (Nov 20-27)
  - Market research (Stack Overflow, Anthropic, competitors)
  - Personas validés (10 entretiens)
  - Pricing défini

- **Phase 1 : MVP Scoping** : ✅ Completed (Nov 28)
  - PRD rédigé (ce document + PRD.md)
  - .cursorrules créé
  - Database schema défini

- **Phase 2 : Setup & Context Engineering** : ✅ Completed (Nov 28)
  - [x] Repository GitHub créé
  - [x] Next.js 15 project initialized
  - [x] Supabase project setup
  - [x] Clerk auth configured
  - [x] Prisma schema implemented
  - [x] All critical files created (prisma.ts, middleware.ts, webhook, auth pages)
  - [ ] Database migrations run (requires user .env.local configuration)
  - [ ] First deploy on Vercel (preview)

- **Phase 3 : Development Sprint 1** : 🔒 Locked (Dec 3 - Dec 16)
- **Phase 4 : Development Sprint 2** : 🔒 Locked (Dec 17 - Dec 30)
- **Phase 5 : Development Sprint 3** : 🔒 Locked (Dec 31 - Jan 13)
- **Phase 6 : Beta Testing** : 🔒 Locked (Jan 14 - Jan 31)
- **Phase 7 : Launch Prep** : 🔒 Locked (Feb 1 - Feb 21)
- **Phase 8 : Launch** : 🔒 Locked (Feb 28, 2026)

---

## 👥 TEAM

**Solo Founder:**
- Vous (Full-Stack Dev)

**Outils Utilisés:**
- Development : Cursor
- Design : Figma (mockups)
- Project Management : Notion
- Version Control : GitHub
- Communication : Email + Discord (beta users)

---

## 🔗 IMPORTANT LINKS

### Development
- **GitHub Repo:** [À créer]
- **Vercel Project:** [À créer]
- **Supabase Project:** [À créer]
- **Clerk App:** [À créer]

### Research & Design
- **Market Research Doc:** [Interne]
- **Figma Mockups:** [À créer]
- **Personas Doc:** [Interne]

### Marketing
- **Landing Page:** [À créer - Carrd/Framer]
- **Beta Waitlist:** [À créer - Typeform]
- **Twitter Account:** [À créer]

---

## 📊 CURRENT METRICS

### Development Progress
- **Code Written:** 0 lines (starting now!)
- **Tests Written:** 0
- **Components Built:** 0

### User Metrics
- **Waitlist Signups:** 0 (landing page not live yet)
- **Beta Testers:** 0 (recruiting starts Jan 2026)
- **Paying Customers:** 0

**Target 90 Days:**
- 50+ paying customers (Pro/Team)
- 10K€ MRR
- 2,000+ users inscrits

---

## 🚧 KNOWN TECHNICAL DEBT

**None yet** (greenfield project)

**Anticipated Debt:**
- AI generation peut être lente (>3 min parfois) → Besoin queue system (Inngest/Vercel Queue)
- RLS policies complexes à tester → Besoin test suite Supabase
- Mind Map export (V2) nécessitera refactor du modèle data

---

## 🐛 KNOWN BUGS

**None yet** (no code written!)

---

## 💡 IDEAS BACKLOG (Post-MVP)

### V2 Features (Validated)
1. **Mind Map Interactive** (React Flow) - Demandé par 8/10 beta users
2. **Phases 4-10 Generation** - Completion du workflow
3. **Export PDF** - Demandé par personas PM non-tech
4. **Templates Marketplace** - Community-driven
5. **MCP Integration** - Sync bidirectionnel avec Cursor

### V3 Features (Exploratory)
6. **Multi-IDE Support** (Windsurf, Zed, VS Code) - Élargir la TAM
7. **Collaboration Temps Réel** (Team plan) - Google Docs-like
8. **AI Chat Assistant** - Chatbot dans l'app pour guider l'user
9. **Mobile App** (iOS/Android) - Consultation en déplacement
10. **Public API** - Pour intégrations externes (Zapier, etc.)

### Crazy Ideas (Moonshots)
11. **AI Code Generation** - Passer de structure → code complet (concurrent Replit)
12. **No-Code MVP Builder** - Générer un Bubble/Webflow prototype
13. **White-Label for Agencies** - Branding custom pour agences dev

---

## 🎓 LESSONS LEARNED

### Validation Phase (Nov 20-27)

**Lesson #1:** "Les développeurs VEULENT de la structure"
- 10/10 early users interrogés ont dit "oui, c'est mon problème"
- Pain point #1 : "Je perds 4-6h à setup chaque projet"
- **Action:** Focus MVP sur gain de temps mesurable (vs features cool)

**Lesson #2:** "Pricing 29€ est dans la comfort zone"
- 10/12 users disent "acceptable"
- 2/12 users disent "trop cher, je paierais max 19€"
- **Action:** Garder 29€, mais créer un plan Free généreux pour conversion

**Lesson #3:** "Mind Map = nice-to-have, pas must-have"
- 3/10 users la mentionnent spontanément
- 8/10 users demandent exports Markdown en priorité
- **Action:** Déprioriser Mind Map vers V2

---

## 🔄 CHANGE LOG

### 2025-11-28
- ✅ Project created
- ✅ .cursorrules written
- ✅ PRD.md written
- ✅ CONTEXT.md written (this file)
- 📝 Next: Setup Supabase + Clerk

---

## 📌 NEXT STEPS (Immediate)

**Today (Nov 28) :**
1. [x] Finalize .cursorrules, PRD.md, CONTEXT.md
2. [ ] Create GitHub repository
3. [ ] Initialize Next.js 15 project locally
4. [ ] Create Supabase project
5. [ ] Create Clerk application

**Tomorrow (Nov 29) :**
1. [ ] Setup Prisma schema
2. [ ] Run database migrations
3. [ ] Implement auth flow (sign-in, sign-up)
4. [ ] Create dashboard layout (empty)
5. [ ] Deploy to Vercel (preview environment)

**This Week (Nov 29 - Dec 2) :**
1. [ ] Complete auth flow with Clerk
2. [ ] Implement project creation wizard (UI only)
3. [ ] Setup API route structure
4. [ ] Implement Phase 1 generation (backend)
5. [ ] Create checklist component (UI)

---

## 🎯 SUCCESS DEFINITION

**MVP Success Criteria (90 days post-launch) :**
1. ✅ 50+ paying customers (Pro/Team)
2. ✅ 10K€ MRR
3. ✅ NPS ≥ 40
4. ✅ Churn < 5%/month
5. ✅ 80% users complete Phase 1

**If NOT met → Pivot or Shutdown**

**Potential Pivots:**
- Target agencies only (Enterprise focus)
- Become a Cursor plugin (vs standalone platform)
- Focus on PM non-tech personas (vs dev personas)
- Open-source + consulting model

---

## 📧 CONTACTS

**Founder Email:** [À définir]
**Support Email:** support@vibeflow.com (À créer)
**Twitter/X:** @vibeflow (À créer)

---

**Last Updated:** 28 Nov 2025  
**Next Update:** Weekly (every Monday)

**Auto-generated by:** VibeFlow (meta!)
