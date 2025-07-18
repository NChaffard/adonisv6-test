import env from '#start/env'

export const appKey = env.get('APP_KEY')
export const http = {
  allowMethodSpoofing: false,
  subdomainOffset: 2,
  generateRequestId: false,
  trustProxy: () => true,
}

export const assets = {
  publicPath: new URL('../public', import.meta.url).href,
}

export const logger = {
  default: env.get('LOG_LEVEL'),
  prettyPrint: env.get('NODE_ENV') === 'development',
}
