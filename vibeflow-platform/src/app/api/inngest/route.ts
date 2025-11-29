// src/app/api/inngest/route.ts
// VF-023 : Route API pour Inngest
// Sprint 1 - Foundation & Wizard (corrigé Sprint 2)

import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { functions } from '@/lib/inngest/functions'

// Crée et exporte la route API pour Inngest
// Note: serve() de inngest/next gère automatiquement GET, POST, PUT
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
})

