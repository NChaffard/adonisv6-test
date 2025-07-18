import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import { authApiClient } from '@adonisjs/auth/plugins/api_client'
import type { Config } from '@japa/runner/types'
import testUtils from '@adonisjs/core/services/test_utils'
import app from '@adonisjs/core/services/app'

export const plugins: Config['plugins'] = [
  assert(),
  apiClient({
    baseURL: `http://localhost:3333`,
  }),
  pluginAdonisJS(app),
  authApiClient(app),
]

export const reporters: Config['reporters'] = {
  activated: ['spec'],
}

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [() => testUtils.db().migrate()],
  teardown: [() => testUtils.db().truncate()],
}
