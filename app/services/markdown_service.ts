import MarkdownIt from 'markdown-it'

/**
 * Service pour gérer le rendu Markdown
 */
export class MarkdownService {
  private md: MarkdownIt

  constructor() {
    this.md = new MarkdownIt({
      // Activer le HTML dans le source
      html: true,

      // Convertir les URLs en liens automatiquement
      linkify: true,

      // Activer les améliorations typographiques
      typographer: true,

      // Convertir les saut de ligne en <br>
      breaks: false,

      // Préfixe CSS pour les blocs de code
      langPrefix: 'language-',

      // Guillemets pour la typographie
      quotes: '""\'\'',
    })
  }

  /**
   * Convertir du Markdown en HTML
   */
  render(markdown: string): string {
    if (!markdown || typeof markdown !== 'string') {
      return ''
    }

    return this.md.render(markdown)
  }

  /**
   * Convertir du Markdown en HTML inline (sans paragraphe)
   */
  renderInline(markdown: string): string {
    if (!markdown || typeof markdown !== 'string') {
      return ''
    }

    return this.md.renderInline(markdown)
  }

  /**
   * Nettoyer le contenu Markdown pour l'affichage en texte brut
   */
  stripMarkdown(markdown: string): string {
    if (!markdown || typeof markdown !== 'string') {
      return ''
    }

    // Convertir en HTML puis supprimer les balises
    const html = this.md.render(markdown)
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * Générer un extrait depuis du contenu Markdown
   */
  generateExcerpt(markdown: string, maxLength: number = 150): string {
    const plainText = this.stripMarkdown(markdown)

    if (plainText.length <= maxLength) {
      return plainText
    }

    // Couper au dernier espace avant la limite
    const truncated = plainText.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')

    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...'
    }

    return truncated + '...'
  }

  /**
   * Calculer le temps de lecture estimé
   */
  calculateReadingTime(markdown: string, wordsPerMinute: number = 200): number {
    const plainText = this.stripMarkdown(markdown)
    const wordCount = plainText.split(/\s+/).filter((word) => word.length > 0).length
    return Math.ceil(wordCount / wordsPerMinute)
  }
}

// Export d'une instance singleton
export const markdownService = new MarkdownService()
