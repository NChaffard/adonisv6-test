import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, scope, computed } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider, AccessToken } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'full_name' })
  declare fullName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  currentAccessToken?: AccessToken

  // Query scopes
  static active = scope((query) => {
    query.whereNull('deletedAt')
  })

  static withPostsCount = scope((_query) => {
    // Will be implemented when needed
  })

  static recentlyCreated = scope((query) => {
    query.where('createdAt', '>=', DateTime.now().minus({ days: 7 }).toSQL())
  })

  // Computed properties
  @computed()
  get isRecent() {
    return this.createdAt > DateTime.now().minus({ days: 7 })
  }

  @computed()
  get isAdmin() {
    return this.role === 'admin'
  }

  // Custom serialization
  serialize(cherryPick?: any) {
    return super.serialize(
      cherryPick || {
        fields: ['id', 'fullName', 'email', 'role', 'createdAt', 'updatedAt'],
      }
    )
  }

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '7 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
  })
}
