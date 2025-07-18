import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UserPolicy extends BasePolicy {
  /**
   * Hook before - Always allow admin users
   */
  async before(user: User | null): Promise<AuthorizerResponse | void> {
    // Always allow admin users without performing any check
    if (user && user.isAdmin) {
      return true
    }
  }

  /**
   * Users can view their own profile
   */
  async view(user: User, targetUser: User): Promise<AuthorizerResponse> {
    return user.id === targetUser.id
  }

  /**
   * Users can edit their own profile (unless admin)
   */
  async edit(user: User, targetUser: User): Promise<AuthorizerResponse> {
    return user.id === targetUser.id
  }

  /**
   * Users can delete their own profile (unless admin)
   */
  async delete(user: User, targetUser: User): Promise<AuthorizerResponse> {
    return user.id === targetUser.id
  }
}
