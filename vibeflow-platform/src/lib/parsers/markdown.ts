// src/lib/parsers/markdown.ts
// VF-022 : Parser pour extraire les sections et checklist items du rapport généré
// Sprint 1 - Foundation & Wizard

// ============================================
// TYPES
// ============================================

export interface ParsedSection {
  title: string
  level: number // 1 = #, 2 = ##, 3 = ###
  content: string
  startIndex: number
  endIndex: number
}

export interface ParsedChecklistItem {
  title: string
  description: string
  estimatedTime: string
  required: boolean
  orderIndex: number
}

export interface ParsedPhaseReport {
  rawContent: string
  sections: ParsedSection[]
  checklistItems: ParsedChecklistItem[]
  metadata: {
    hasExecutiveSummary: boolean
    hasChecklist: boolean
    sectionCount: number
    checklistItemCount: number
  }
}

// ============================================
// MAIN PARSER
// ============================================

/**
 * Parse un rapport de phase complet
 */
export function parsePhaseReport(markdown: string): ParsedPhaseReport {
  const sections = extractSections(markdown)
  const checklistItems = extractChecklistItems(markdown)

  return {
    rawContent: markdown,
    sections,
    checklistItems,
    metadata: {
      hasExecutiveSummary: sections.some(
        (s) => s.title.toLowerCase().includes('résumé') || s.title.toLowerCase().includes('summary')
      ),
      hasChecklist: checklistItems.length > 0,
      sectionCount: sections.length,
      checklistItemCount: checklistItems.length,
    },
  }
}

// ============================================
// SECTION EXTRACTION
// ============================================

/**
 * Extrait toutes les sections du markdown (titres ## et ###)
 */
export function extractSections(markdown: string): ParsedSection[] {
  const sections: ParsedSection[] = []
  
  // Regex pour matcher les titres markdown (## ou ###)
  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  
  const lines = markdown.split('\n')
  let currentSection: ParsedSection | null = null
  let contentLines: string[] = []
  let lineIndex = 0

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/)

    if (match) {
      // Sauvegarder la section précédente si elle existe
      if (currentSection) {
        currentSection.content = contentLines.join('\n').trim()
        currentSection.endIndex = lineIndex - 1
        sections.push(currentSection)
      }

      // Démarrer une nouvelle section
      currentSection = {
        title: match[2].trim(),
        level: match[1].length,
        content: '',
        startIndex: lineIndex,
        endIndex: lineIndex,
      }
      contentLines = []
    } else if (currentSection) {
      contentLines.push(line)
    }

    lineIndex++
  }

  // Sauvegarder la dernière section
  if (currentSection) {
    currentSection.content = contentLines.join('\n').trim()
    currentSection.endIndex = lineIndex - 1
    sections.push(currentSection)
  }

  return sections
}

// ============================================
// CHECKLIST EXTRACTION
// ============================================

/**
 * Extrait les items de checklist du markdown
 * Format attendu: - [ ] **Titre** - Description | Temps estimé: X | Requis: true/false
 */
export function extractChecklistItems(markdown: string): ParsedChecklistItem[] {
  const items: ParsedChecklistItem[] = []
  
  // Regex pour matcher les checklist items
  // Format: - [ ] **Titre** - Description | Temps estimé: X | Requis: true/false
  const checklistRegex = /^-\s*\[\s*\]\s*\*\*(.+?)\*\*\s*-\s*(.+?)\s*\|\s*Temps estimé:\s*(.+?)\s*\|\s*Requis:\s*(true|false)/gm

  let match: RegExpExecArray | null
  let orderIndex = 0

  while ((match = checklistRegex.exec(markdown)) !== null) {
    items.push({
      title: match[1].trim(),
      description: match[2].trim(),
      estimatedTime: match[3].trim(),
      required: match[4].toLowerCase() === 'true',
      orderIndex: orderIndex++,
    })
  }

  // Si le format standard n'a pas fonctionné, essayer un format alternatif
  if (items.length === 0) {
    const altItems = extractChecklistItemsAlternative(markdown)
    return altItems
  }

  return items
}

/**
 * Parser alternatif pour les formats de checklist non-standards
 */
function extractChecklistItemsAlternative(markdown: string): ParsedChecklistItem[] {
  const items: ParsedChecklistItem[] = []
  
  // Format alternatif: - [ ] Titre - Description (temps estimé: X)
  const altRegex = /^-\s*\[\s*\]\s*\*?\*?(.+?)\*?\*?\s*[-–]\s*(.+?)(?:\s*\((?:temps|durée)[^)]*:\s*(.+?)\))?$/gim

  let match: RegExpExecArray | null
  let orderIndex = 0

  while ((match = altRegex.exec(markdown)) !== null) {
    items.push({
      title: match[1].trim().replace(/\*\*/g, ''),
      description: match[2].trim(),
      estimatedTime: match[3]?.trim() || '1h',
      required: true, // Par défaut requis
      orderIndex: orderIndex++,
    })
  }

  // Format très simple: - [ ] Item simple
  if (items.length === 0) {
    const simpleRegex = /^-\s*\[\s*\]\s*(.+)$/gm
    
    while ((match = simpleRegex.exec(markdown)) !== null) {
      const text = match[1].trim()
      items.push({
        title: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        description: text,
        estimatedTime: '1h',
        required: true,
        orderIndex: orderIndex++,
      })
    }
  }

  return items
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Extrait le contenu d'une section spécifique par son titre
 */
export function getSectionContent(
  sections: ParsedSection[],
  titlePattern: string | RegExp
): string | null {
  const pattern = typeof titlePattern === 'string' 
    ? new RegExp(titlePattern, 'i')
    : titlePattern

  const section = sections.find((s) => pattern.test(s.title))
  return section?.content || null
}

/**
 * Extrait tous les blocs de code du markdown
 */
export function extractCodeBlocks(markdown: string): { language: string; code: string }[] {
  const blocks: { language: string; code: string }[] = []
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g

  let match: RegExpExecArray | null
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    })
  }

  return blocks
}

/**
 * Extrait les tables markdown
 */
export function extractTables(markdown: string): string[][] {
  const tables: string[][] = []
  const lines = markdown.split('\n')
  
  let inTable = false
  let currentTable: string[] = []

  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Détection d'une ligne de table (commence et finit par |)
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      inTable = true
      currentTable.push(trimmedLine)
    } else if (inTable && trimmedLine === '') {
      // Fin de la table
      if (currentTable.length > 0) {
        tables.push(currentTable)
        currentTable = []
      }
      inTable = false
    } else if (inTable && !trimmedLine.startsWith('|')) {
      // Fin de la table (autre contenu)
      if (currentTable.length > 0) {
        tables.push(currentTable)
        currentTable = []
      }
      inTable = false
    }
  }

  // Dernière table si elle existe
  if (currentTable.length > 0) {
    tables.push(currentTable)
  }

  return tables
}

/**
 * Nettoie et normalise le markdown
 */
export function cleanMarkdown(markdown: string): string {
  return markdown
    // Supprimer les espaces multiples
    .replace(/  +/g, ' ')
    // Normaliser les sauts de ligne
    .replace(/\n{3,}/g, '\n\n')
    // Supprimer les espaces en fin de ligne
    .replace(/[ \t]+$/gm, '')
    .trim()
}

/**
 * Valide qu'un rapport contient les sections minimales requises
 */
export function validatePhaseReport(parsed: ParsedPhaseReport, phaseNumber: number): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Vérification du nombre de sections minimum
  if (parsed.sections.length < 3) {
    errors.push(`Le rapport ne contient que ${parsed.sections.length} sections (minimum 3 requis)`)
  }

  // Vérification de la présence d'un résumé exécutif
  if (!parsed.metadata.hasExecutiveSummary) {
    errors.push('Le rapport ne contient pas de résumé exécutif')
  }

  // Vérification des items de checklist
  if (parsed.checklistItems.length < 5) {
    errors.push(`Le rapport ne contient que ${parsed.checklistItems.length} items de checklist (minimum 5 requis)`)
  }

  // Vérification de la longueur minimale
  if (parsed.rawContent.length < 2000) {
    errors.push(`Le rapport est trop court (${parsed.rawContent.length} caractères, minimum 2000)`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

