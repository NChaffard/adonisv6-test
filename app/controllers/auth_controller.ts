import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import logger from '@adonisjs/core/services/logger'
import { Exception } from '@adonisjs/core/exceptions'

export default class AuthController {
  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)

      // Check if user already exists (more efficient than catching DB constraint)
      const existingUser = await User.query().where('email', payload.email).select('id').first()

      if (existingUser) {
        return response.badRequest({
          message: 'Email already exists',
          errors: { email: ['This email is already registered'] },
        })
      }

      const user = await User.create(payload)
      const token = await User.accessTokens.create(user)

      logger.info('User registered successfully', {
        userId: user.id,
        email: user.email,
        ip: request.ip(),
      })

      // Set security headers
      response.header('X-Content-Type-Options', 'nosniff')
      response.header('X-Frame-Options', 'DENY')

      return response.created({
        message: 'User registered successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token: {
          type: 'bearer',
          value: token.value!.release(),
        },
      })
    } catch (error) {
      logger.error('Registration failed', {
        error: error.message,
        email: request.input('email'),
        ip: request.ip(),
      })

      if (error.status === 422) {
        return response.badRequest({
          message: 'Validation failed',
          errors: error.messages,
        })
      }

      throw new Exception('Registration failed', {
        status: 500,
        code: 'E_REGISTRATION_FAILED',
      })
    }
  }

  /**
   * Login user
   */
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)

      logger.info('Login successful', {
        userId: user.id,
        email: user.email,
        ip: request.ip(),
      })

      return response.ok({
        message: 'Login successful',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token: {
          type: 'bearer',
          value: token.value!.release(),
        },
      })
    } catch (error) {
      logger.warn('Login failed', {
        email: request.input('email'),
        ip: request.ip(),
        error: error.message,
      })

      return response.badRequest({
        message: 'Invalid credentials',
        errors: { email: ['Invalid email or password'] },
      })
    }
  }

  /**
   * Logout user
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = auth.user!.currentAccessToken

    await User.accessTokens.delete(user, token.identifier)

    logger.info('User logged out', {
      userId: user.id,
      tokenId: token.identifier,
    })

    return response.ok({ message: 'Logout successful' })
  }

  /**
   * Get current user profile
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    // Set cache headers for user profile
    response.header('Cache-Control', 'private, max-age=300') // 5 minutes

    return response.ok({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }
}
