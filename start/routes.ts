import router from '@adonisjs/core/services/router'
import { apiThrottle, loginThrottle } from '#start/limiter'
import { middleware } from '#start/kernel'

// Health check endpoint
router.get('/health', async ({ response }) => {
  return response.ok({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

// API v1 routes
router
  .group(() => {
    // Authentication routes (with specific rate limiting)
    router
      .group(() => {
        router.post('/register', '#controllers/auth_controller.register')
        // .use(registerThrottle) // Temporarily disabled for debugging

        router.post('/login', '#controllers/auth_controller.login').use(loginThrottle)

        // Future endpoints for password recovery
        // router.post('/forgot-password', '#controllers/auth_controller.forgotPassword')
        //   .use(forgotPasswordThrottle)

        // router.post('/reset-password', '#controllers/auth_controller.resetPassword')
        //   .use(forgotPasswordThrottle)
      })
      .prefix('/auth')

    // Protected routes
    router
      .group(() => {
        // Auth user routes
        router
          .group(() => {
            router.get('/me', '#controllers/auth_controller.me')
            router.post('/logout', '#controllers/auth_controller.logout')
            // router.put('/profile', '#controllers/auth_controller.updateProfile')
          })
          .prefix('/auth')

        // User management routes
        router
          .resource('users', '#controllers/users_controller')
          .only(['index', 'show', 'update', 'destroy'])

        // Post management routes
        router.resource('posts', '#controllers/posts_controller').use('*', apiThrottle)

        // Admin routes (protected by auth + admin check)
        router
          .group(() => {
            router.get('/stats', '#controllers/admin_controller.getStats')
            router.get('/users', '#controllers/admin_controller.getUsers')
            router.post('/users', '#controllers/admin_controller.createUser')
            router.put('/users/:id', '#controllers/admin_controller.updateUser')
            router.delete('/users/:id', '#controllers/admin_controller.deleteUser')
            router.patch('/users/:id/role', '#controllers/admin_controller.changeUserRole')
            router.get('/posts', '#controllers/admin_controller.getPosts')
          })
          .prefix('/admin')
          .use(apiThrottle)
      })
      .use(middleware.auth())
  })
  .prefix('/api')

// Catch-all route for SPA
router.get('*', async ({ response }) => {
  return response.ok({ message: 'AdonisJS API v1 - Frontend SPA should handle routing' })
})
