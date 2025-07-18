import User from '#models/user'
import Post from '#models/post'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class PostPolicy extends BasePolicy {
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
   * Every logged-in user can create a post
   */
  async create(): Promise<AuthorizerResponse> {
    return true
  }

  /**
   * Only the post creator can edit the post (unless admin)
   */
  async edit(user: User, post: Post): Promise<AuthorizerResponse> {
    return user.id === post.userId
  }

  /**
   * Only the post creator can delete the post (unless admin)
   */
  async delete(user: User, post: Post): Promise<AuthorizerResponse> {
    return user.id === post.userId
  }

  /**
   * Users can view their own posts, admins can view all posts
   */
  async view(user: User, post: Post): Promise<AuthorizerResponse> {
    return user.id === post.userId
  }
}
