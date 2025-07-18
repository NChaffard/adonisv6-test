import limiter from '@adonisjs/limiter/services/main'

// Login attempts with progressive delays
export const loginThrottle = limiter.define('login', (ctx) => {
  const key = `login_${ctx.request.ip()}_${ctx.request.input('email', 'unknown')}`

  return limiter
    .allowRequests(3) // Reduced from 5
    .every('5 minutes') // Reduced window
    .usingKey(key)
    .blockFor('30 minutes') // Increased block time
    .limitExceeded((error) => {
      error
        .setStatus(429)
        .setMessage('Too many login attempts. Please try again later.')
        .setHeaders({
          'Retry-After': '1800', // 30 minutes
        })
    })
})

// Registration with IP-based limiting
export const registerThrottle = limiter.define('register', (ctx) => {
  const key = `register_${ctx.request.ip()}`

  return limiter
    .allowRequests(100) // Much higher for testing
    .every('1 minute') // Very short window for testing
    .usingKey(key)
    .blockFor('10 seconds') // Very short block for testing
    .limitExceeded((error) => {
      error.setStatus(429).setMessage('Registration limit exceeded. Please try again later.')
    })
})

// Password reset limiting
export const forgotPasswordThrottle = limiter.define('forgot-password', (ctx) => {
  const email = ctx.request.input('email')
  const key = `forgot_password_${email}_${ctx.request.ip()}`

  return limiter
    .allowRequests(3)
    .every('1 hour')
    .usingKey(key)
    .blockFor('1 hour')
    .limitExceeded((error) => {
      error.setStatus(429).setMessage('Password reset limit exceeded. Please try again later.')
    })
})

// API with user-based limiting
export const apiThrottle = limiter.define('api', (ctx) => {
  if (ctx.auth.user) {
    return limiter
      .allowRequests(200) // Increased for authenticated users
      .every('1 minute')
      .usingKey(`user_${ctx.auth.user.id}`)
  }

  return limiter
    .allowRequests(10) // Reduced for anonymous users
    .every('1 minute')
    .usingKey(`ip_${ctx.request.ip()}`)
    .limitExceeded((error) => {
      error.setStatus(429).setMessage('Rate limit exceeded. Please authenticate for higher limits.')
    })
})
