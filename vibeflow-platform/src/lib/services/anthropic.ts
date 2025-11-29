// src/lib/services/anthropic.ts
// VF-021 : Service pour appeler l'API Claude 3.5 Sonnet
// Sprint 1 - Foundation & Wizard

import Anthropic from '@anthropic-ai/sdk'
import { readFile } from 'fs/promises'
import path from 'path'

// ============================================
// TYPES
// ============================================

export interface ProjectContext {
  projectName: string
  appType: string
  description: string
  targetUsers: string
  problemSolved: string
  competitors: string
  stackPreference: string[]
}

export interface GenerationResult {
  success: boolean
  content?: string
  error?: string
  tokensUsed?: number
  model?: string
}

// ============================================
// CONFIGURATION
// ============================================

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

// Modèle à utiliser
const MODEL = 'claude-sonnet-4-20250514'

// Paramètres de génération
const DEFAULT_MAX_TOKENS = 8192
const DEFAULT_TEMPERATURE = 0.3 // Faible pour consistance

// ============================================
// CLIENT SINGLETON
// ============================================

let anthropicClient: Anthropic | null = null

function getClient(): Anthropic {
  if (!anthropicClient) {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }
    anthropicClient = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    })
  }
  return anthropicClient
}

// ============================================
// TEMPLATE LOADING
// ============================================

/**
 * Charge un template de prompt depuis le dossier /prompts
 */
async function loadPromptTemplate(phaseNumber: number): Promise<string> {
  const templatePath = path.join(process.cwd(), 'src', 'prompts', `phase-${phaseNumber}.txt`)
  
  try {
    const template = await readFile(templatePath, 'utf-8')
    return template
  } catch (error) {
    console.error(`[AnthropicService] Erreur chargement template phase-${phaseNumber}:`, error)
    throw new Error(`Template de prompt non trouvé pour la phase ${phaseNumber}`)
  }
}

/**
 * Injecte le contexte projet dans un template
 */
function injectContext(template: string, context: ProjectContext): string {
  return template
    .replace(/\{\{project_name\}\}/g, context.projectName)
    .replace(/\{\{app_type\}\}/g, formatAppType(context.appType))
    .replace(/\{\{description\}\}/g, context.description)
    .replace(/\{\{target_users\}\}/g, context.targetUsers)
    .replace(/\{\{problem_solved\}\}/g, context.problemSolved)
    .replace(/\{\{competitors\}\}/g, context.competitors || 'Non spécifiés')
    .replace(/\{\{stack_preference\}\}/g, context.stackPreference.join(', '))
}

/**
 * Formate le type d'app pour l'affichage
 */
function formatAppType(appType: string): string {
  const labels: Record<string, string> = {
    SAAS_B2B: 'SaaS B2B',
    SAAS_B2C: 'SaaS B2C',
    MOBILE_APP: 'Application Mobile',
    CHROME_EXTENSION: 'Extension Chrome',
    API_BACKEND: 'API Backend',
  }
  return labels[appType] || appType
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

/**
 * Génère le rapport d'une phase avec Claude 3.5 Sonnet
 */
export async function generatePhaseReport(
  phaseNumber: number,
  context: ProjectContext
): Promise<GenerationResult> {
  console.log(`[AnthropicService] Génération Phase ${phaseNumber} pour "${context.projectName}"`)

  try {
    // 1. Charger le template de prompt
    const template = await loadPromptTemplate(phaseNumber)

    // 2. Injecter le contexte
    const prompt = injectContext(template, context)

    // 3. Appeler l'API Claude
    const client = getClient()
    
    console.log(`[AnthropicService] Appel API Claude - Model: ${MODEL}`)
    const startTime = Date.now()

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: DEFAULT_MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const duration = Date.now() - startTime
    console.log(`[AnthropicService] Réponse reçue en ${duration}ms`)

    // 4. Extraire le contenu
    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return {
        success: false,
        error: 'Réponse invalide de Claude API - pas de contenu texte',
      }
    }

    // 5. Calculer les tokens utilisés
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens

    console.log(`[AnthropicService] Génération réussie - ${tokensUsed} tokens utilisés`)

    return {
      success: true,
      content: textBlock.text,
      tokensUsed,
      model: MODEL,
    }
  } catch (error) {
    console.error('[AnthropicService] Erreur:', error)

    // Gestion des erreurs spécifiques
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        return {
          success: false,
          error: 'Rate limit atteint. Veuillez réessayer dans quelques minutes.',
        }
      }
      if (error.status === 401) {
        return {
          success: false,
          error: 'Clé API Anthropic invalide.',
        }
      }
      if (error.status === 500) {
        return {
          success: false,
          error: 'Erreur serveur Anthropic. Veuillez réessayer.',
        }
      }
      return {
        success: false,
        error: `Erreur API Claude: ${error.message}`,
      }
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: 'Une erreur inattendue est survenue lors de la génération',
    }
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Vérifie si le service est correctement configuré
 */
export function isConfigured(): boolean {
  return !!ANTHROPIC_API_KEY
}

/**
 * Estime le coût d'une génération (approximatif)
 * Pricing Claude 3.5 Sonnet: $3/1M input, $15/1M output
 */
export function estimateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * 3
  const outputCost = (outputTokens / 1_000_000) * 15
  return inputCost + outputCost
}

/**
 * Génère toutes les phases d'un projet (utilisé par le background job)
 */
export async function generateAllPhases(
  context: ProjectContext,
  phasesToGenerate: number[] = [1, 2, 3]
): Promise<{ phaseNumber: number; result: GenerationResult }[]> {
  const results: { phaseNumber: number; result: GenerationResult }[] = []

  for (const phaseNumber of phasesToGenerate) {
    console.log(`[AnthropicService] Génération Phase ${phaseNumber}/${phasesToGenerate.length}`)
    
    const result = await generatePhaseReport(phaseNumber, context)
    results.push({ phaseNumber, result })

    // Pause entre les requêtes pour éviter le rate limiting
    if (phaseNumber < phasesToGenerate.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  return results
}

