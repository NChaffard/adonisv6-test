import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, scope, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { markdownService } from '#services/markdown_service'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Query scopes
  static forUser = scope((query, userId: number) => {
    query.where('userId', userId)
  })

  static recent = scope((query, days: number = 7) => {
    query.where('createdAt', '>=', DateTime.now().minus({ days }).toSQL())
  })

  static search = scope((query, term: string) => {
    query.where((builder) => {
      builder.whereLike('title', `%${term}%`).orWhereLike('content', `%${term}%`)
    })
  })

  // Computed properties
  @computed()
  get excerpt() {
    return markdownService.generateExcerpt(this.content, 150)
  }

  @computed()
  get readingTime() {
    return markdownService.calculateReadingTime(this.content)
  }

  @computed()
  get contentHtml() {
    return markdownService.render(this.content)
  }

  @computed()
  get contentPlainText() {
    return markdownService.stripMarkdown(this.content)
  }

  // Custom serialization
  serialize(cherryPick?: any) {
    const data = super.serialize(cherryPick)

    // Ajouter les propriétés computées pour le rendu Markdown
    return {
      ...data,
      contentHtml: this.contentHtml,
      excerpt: this.excerpt,
      readingTime: this.readingTime,
      contentPlainText: this.contentPlainText,
    }
  }
}
