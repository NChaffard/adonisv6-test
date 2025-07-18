import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { Exception } from '@adonisjs/core/exceptions'

export default class AuthMiddleware {
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards, {
        loginRoute: this.redirectTo,
      })

      // Add user context to logger
      ctx.logger = ctx.logger.child({
        userId: ctx.auth.user?.id,
        userEmail: ctx.auth.user?.email,
      })

      return await next()
    } catch (error) {
      // Log authentication attempts
      ctx.logger.warn('Authentication failed', {
        ip: ctx.request.ip(),
        userAgent: ctx.request.header('user-agent'),
        path: ctx.request.url(),
        error: error.message,
      })

      throw new Exception('Authentication required', {
        status: 401,
        code: 'E_UNAUTHORIZED',
      })
    }
  }
}
