// src/app/dashboard/projects/[id]/phases/[phaseNumber]/PhaseReport.tsx
// Composant pour afficher le rapport généré en Markdown
// Sprint 2 - AI Generation & Dashboard

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, Download, BookOpen } from 'lucide-react'
import { useState } from 'react'

// ============================================
// TYPES
// ============================================

interface PhaseReportProps {
  markdown: string
  phaseName: string
}

// ============================================
// COMPONENT
// ============================================

export function PhaseReport({ markdown, phaseName }: PhaseReportProps) {
  const [copied, setCopied] = useState(false)

  // Copier le markdown
  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Télécharger le markdown
  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${phaseName.toLowerCase().replace(/\s+/g, '-')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!markdown) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">Rapport non disponible</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Le rapport de cette phase n&apos;a pas encore été généré.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-500" />
            Rapport - {phaseName}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copier
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Rendu du Markdown */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <MarkdownRenderer content={markdown} />
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// MARKDOWN RENDERER
// ============================================

function MarkdownRenderer({ content }: { content: string }) {
  // Simple parsing du markdown pour l'affichage
  // En production, on utiliserait react-markdown avec remark-gfm
  
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let currentList: string[] = []
  let inCodeBlock = false
  let codeContent = ''
  let codeLanguage = ''

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-5 space-y-1">
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
      currentList = []
    }
  }

  const flushCode = () => {
    if (codeContent) {
      elements.push(
        <pre 
          key={`code-${elements.length}`} 
          className="bg-muted rounded-md p-4 overflow-x-auto text-sm"
        >
          <code className={codeLanguage ? `language-${codeLanguage}` : ''}>
            {codeContent.trim()}
          </code>
        </pre>
      )
      codeContent = ''
      codeLanguage = ''
    }
  }

  for (const line of lines) {
    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false
        flushCode()
      } else {
        flushList()
        inCodeBlock = true
        codeLanguage = line.slice(3).trim()
      }
      continue
    }

    if (inCodeBlock) {
      codeContent += line + '\n'
      continue
    }

    // Headers
    if (line.startsWith('# ')) {
      flushList()
      elements.push(
        <h1 key={`h1-${elements.length}`} className="text-2xl font-bold mt-6 mb-4">
          {line.slice(2)}
        </h1>
      )
      continue
    }
    if (line.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-xl font-semibold mt-5 mb-3">
          {line.slice(3)}
        </h2>
      )
      continue
    }
    if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-lg font-semibold mt-4 mb-2">
          {line.slice(4)}
        </h3>
      )
      continue
    }

    // Lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      currentList.push(line.slice(2))
      continue
    }
    if (/^\d+\.\s/.test(line)) {
      flushList()
      currentList.push(line.replace(/^\d+\.\s/, ''))
      continue
    }

    // Paragraphs
    if (line.trim() === '') {
      flushList()
      continue
    }

    flushList()
    
    // Parse inline formatting
    const formattedLine = formatInlineMarkdown(line)
    elements.push(
      <p key={`p-${elements.length}`} className="mb-3">
        {formattedLine}
      </p>
    )
  }

  flushList()
  flushCode()

  return <>{elements}</>
}

function formatInlineMarkdown(text: string): React.ReactNode {
  // Bold: **text**
  const boldRegex = /\*\*([^*]+)\*\*/g
  // Italic: *text* or _text_
  const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)|_([^_]+)_/g
  // Code: `text`
  const codeRegex = /`([^`]+)`/g

  // Simple replacement - in production use a proper parser
  let result = text
  
  // Replace bold
  result = result.replace(boldRegex, '<strong>$1</strong>')
  // Replace italic
  result = result.replace(italicRegex, '<em>$1$2</em>')
  // Replace inline code
  result = result.replace(codeRegex, '<code class="bg-muted px-1 rounded text-sm">$1</code>')

  return <span dangerouslySetInnerHTML={{ __html: result }} />
}

