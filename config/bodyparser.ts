import { defineConfig } from '@adonisjs/core/bodyparser'

export default defineConfig({
  allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],

  form: {
    encoding: 'utf-8',
    limit: '1mb',
    queryString: {},
    types: ['application/x-www-form-urlencoded'],
    convertEmptyStringsToNull: true,
  },

  json: {
    encoding: 'utf-8',
    limit: '1mb',
    strict: true,
    types: [
      'application/json',
      'application/json-patch+json',
      'application/vnd.api+json',
      'application/csp-report',
    ],
    convertEmptyStringsToNull: true,
  },

  multipart: {
    autoProcess: true,
    processManually: [],
    encoding: 'utf-8',
    fieldsLimit: '2mb',
    limit: '20mb',
    types: ['multipart/form-data'],
    convertEmptyStringsToNull: true,
  },

  raw: {
    encoding: 'utf-8',
    limit: '1mb',
    types: ['text/*'],
  },
})
