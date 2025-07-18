import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RequestLoggerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (process.env.NODE_ENV === 'production') {
      return await next() // Skip detailed logging in production
    }

    const start = Date.now()

    // Log incoming request
    ctx.logger.info('Request started', {
      method: ctx.request.method(),
      url: ctx.request.url(),
      ip: ctx.request.ip(),
      userAgent: ctx.request.header('user-agent'),
    })

    try {
      await next()

      // Log successful request
      ctx.logger.info('Request completed', {
        method: ctx.request.method(),
        url: ctx.request.url(),
        status: ctx.response.getStatus(),
        duration: Date.now() - start,
      })
    } catch (error) {
      // Log error
      ctx.logger.error('Request failed', {
        method: ctx.request.method(),
        url: ctx.request.url(),
        error: error.message,
        status: error.status || 500,
        duration: Date.now() - start,
      })

      throw error
    }
  }
}
