// src/lib/validations/project.ts
// VF-010 : Schémas Zod pour validation projet
// Sprint 1 - Foundation & Wizard

import { z } from 'zod'

// ============================================
// ENUMS (correspondant aux enums Prisma)
// ============================================

export const AppTypeEnum = z.enum([
  'SAAS_B2B',
  'SAAS_B2C',
  'MOBILE_APP',
  'CHROME_EXTENSION',
  'API_BACKEND',
])

export type AppType = z.infer<typeof AppTypeEnum>

// Labels pour l'UI
export const APP_TYPE_LABELS: Record<AppType, string> = {
  SAAS_B2B: 'SaaS B2B (Business to Business)',
  SAAS_B2C: 'SaaS B2C (Business to Consumer)',
  MOBILE_APP: 'Application Mobile (iOS/Android)',
  CHROME_EXTENSION: 'Extension Chrome/Browser',
  API_BACKEND: 'API Backend / Service',
}

// ============================================
// STEP 1 : Idée de Base
// ============================================

export const projectStep1Schema = z.object({
  name: z
    .string()
    .min(3, { message: 'Le nom du projet doit contenir au moins 3 caractères' })
    .max(100, { message: 'Le nom du projet ne peut pas dépasser 100 caractères' })
    .regex(/^[a-zA-Z0-9\s\-_àâäéèêëïîôùûüç]+$/, {
      message: 'Le nom ne peut contenir que des lettres, chiffres, espaces, tirets et underscores',
    }),
  description: z
    .string()
    .min(100, { message: 'La description doit contenir au moins 100 caractères pour être pertinente' })
    .max(2000, { message: 'La description ne peut pas dépasser 2000 caractères' }),
  appType: AppTypeEnum,
})

export type ProjectStep1Data = z.infer<typeof projectStep1Schema>

// ============================================
// STEP 2 : Questions Intelligentes
// ============================================

export const projectStep2Schema = z.object({
  targetUsers: z
    .string()
    .min(50, { message: 'Décrivez vos utilisateurs cibles en au moins 50 caractères' })
    .max(1500, { message: 'La description ne peut pas dépasser 1500 caractères' }),
  problemSolved: z
    .string()
    .min(50, { message: 'Décrivez le problème résolu en au moins 50 caractères' })
    .max(1500, { message: 'La description ne peut pas dépasser 1500 caractères' }),
  competitors: z
    .string()
    .max(500, { message: 'La liste des concurrents ne peut pas dépasser 500 caractères' })
    .optional()
    .default(''),
  stackPreference: z
    .array(z.string())
    .min(1, { message: 'Sélectionnez au moins une technologie' })
    .max(10, { message: 'Vous ne pouvez pas sélectionner plus de 10 technologies' }),
})

export type ProjectStep2Data = z.infer<typeof projectStep2Schema>

// Options de stack disponibles
export const STACK_OPTIONS = [
  { value: 'nextjs', label: 'Next.js' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'svelte', label: 'Svelte/SvelteKit' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'prisma', label: 'Prisma ORM' },
  { value: 'drizzle', label: 'Drizzle ORM' },
  { value: 'supabase', label: 'Supabase' },
  { value: 'firebase', label: 'Firebase' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'redis', label: 'Redis' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'clerk', label: 'Clerk Auth' },
  { value: 'nextauth', label: 'NextAuth.js' },
  { value: 'vercel', label: 'Vercel' },
  { value: 'aws', label: 'AWS' },
  { value: 'docker', label: 'Docker' },
] as const

// ============================================
// STEP 3 : Confirmation (optionnel)
// ============================================

export const projectStep3Schema = z.object({
  confirmation: z.literal(true, {
    message: 'Vous devez confirmer les informations pour continuer',
  }),
})

export type ProjectStep3Data = z.infer<typeof projectStep3Schema>

// ============================================
// SCHEMA GLOBAL : Combinaison des 3 steps
// ============================================

export const createProjectSchema = z.object({
  // Step 1
  name: projectStep1Schema.shape.name,
  description: projectStep1Schema.shape.description,
  appType: projectStep1Schema.shape.appType,
  // Step 2
  targetUsers: projectStep2Schema.shape.targetUsers,
  problemSolved: projectStep2Schema.shape.problemSolved,
  competitors: projectStep2Schema.shape.competitors,
  stackPreference: projectStep2Schema.shape.stackPreference,
})

export type CreateProjectData = z.infer<typeof createProjectSchema>

// ============================================
// HELPERS
// ============================================

/**
 * Valide les données du Step 1
 */
export function validateStep1(data: unknown): {
  success: boolean
  data?: ProjectStep1Data
  errors?: z.ZodError
} {
  const result = projectStep1Schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Valide les données du Step 2
 */
export function validateStep2(data: unknown): {
  success: boolean
  data?: ProjectStep2Data
  errors?: z.ZodError
} {
  const result = projectStep2Schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Valide les données complètes du projet
 */
export function validateCreateProject(data: unknown): {
  success: boolean
  data?: CreateProjectData
  errors?: z.ZodError
} {
  const result = createProjectSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

// ============================================
// TYPES POUR LE WIZARD
// ============================================

// Type pour le formulaire du wizard (avec valeurs optionnelles initiales)
export type WizardFormData = {
  // Step 1
  name: string
  description: string
  appType: AppType | ''
  // Step 2
  targetUsers: string
  problemSolved: string
  competitors: string
  stackPreference: string[]
}

export const defaultWizardFormData: WizardFormData = {
  name: '',
  description: '',
  appType: '',
  targetUsers: '',
  problemSolved: '',
  competitors: '',
  stackPreference: [],
}

// Schéma pour le wizard (permet les valeurs vides pendant l'édition)
export const wizardFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  appType: z.union([AppTypeEnum, z.literal('')]),
  targetUsers: z.string(),
  problemSolved: z.string(),
  competitors: z.string(),
  stackPreference: z.array(z.string()),
})

// ============================================
// PHASE NAMES (pour la création des 3 phases MVP)
// ============================================

export const PHASE_NAMES = [
  { number: 1, name: 'Validation de Marché' },
  { number: 2, name: 'Setup & Context Engineering' },
  { number: 3, name: 'Architecture & Planification' },
] as const

