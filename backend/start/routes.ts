/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    app: 'PropertyOps API',
    status: 'online',
    version: '1.0.0',
    database: 'connected (PostgreSQL)',
    environment: 'development',
    timestamp: new Date().toISOString(),
  }
})
