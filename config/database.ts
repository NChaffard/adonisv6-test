import { defineConfig } from '@adonisjs/lucid'

const databaseConfig = defineConfig({
  prettyPrintDebugQueries: process.env.NODE_ENV === 'development',
  connection: process.env.DB_CONNECTION || 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: process.env.DB_FILENAME || './tmp/db.sqlite3',
      },
      useNullAsDefault: true,
      pool: {
        min: 0,
        max: 1, // SQLite doesn't support concurrent writes
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
        disableRollbacksInProduction: true,
      },
      debug: process.env.NODE_ENV === 'development',
    },
    postgres: {
      client: 'pg',
      connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'postgres',
        ssl: process.env.DB_SSL === 'true',
      },
      pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
        disableRollbacksInProduction: true,
      },
      debug: process.env.NODE_ENV === 'development',
    },
  },
})

export default databaseConfig
