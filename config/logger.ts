import { defineConfig, targets } from '@adonisjs/core/logger'

const loggerConfig = defineConfig({
  default: 'app',

  loggers: {
    app: targets.pretty({
      colorize: true,
    }),
  },
})

export default loggerConfig

declare module '@adonisjs/core/types' {
  interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}
