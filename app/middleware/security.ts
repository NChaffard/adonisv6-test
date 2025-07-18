import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SecurityMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Generate request ID for tracing
    const requestId = crypto.randomUUID()
    ctx.response.header('X-Request-ID', requestId)

    // Add request ID to logger context
    ctx.logger = ctx.logger.child({ requestId })

    // Security headers
    ctx.response.header('X-Content-Type-Options', 'nosniff')
    ctx.response.header('X-Frame-Options', 'DENY')
    ctx.response.header('X-XSS-Protection', '1; mode=block')
    ctx.response.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    ctx.response.header('Content-Security-Policy', "default-src 'self'")

    // Remove server information
    ctx.response.removeHeader('X-Powered-By')

    return next()
  }
}
