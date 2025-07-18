import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

// Global middleware
server.use([
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
  () => import('#middleware/security'),
])

// Router middleware - bodyparser enabled
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('#middleware/initialize_bouncer_middleware'),
])

// Named middleware
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
  security: () => import('#middleware/security'),
  requestLogger: () => import('#middleware/request_logger'),
})
