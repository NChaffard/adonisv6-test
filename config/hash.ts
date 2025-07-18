import { defineConfig, drivers } from '@adonisjs/core/hash'

export default defineConfig({
  default: 'scrypt', // Scrypt is more performant than bcrypt

  list: {
    scrypt: drivers.scrypt({
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      maxMemory: 33554432,
    }),
    // Keep bcrypt for backwards compatibility
    bcrypt: drivers.bcrypt({
      rounds: 12, // Increase security
    }),
  },
})
