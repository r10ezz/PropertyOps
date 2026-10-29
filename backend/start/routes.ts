/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const PropertiesController = () => import('#controllers/properties_controller')
const UnitsController = () => import('#controllers/units_controller')

// Root System Status Handshake
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

// REST API v1 Group
router
  .group(() => {
    // Properties Endpoints
    router.get('/properties', [PropertiesController, 'index'])
    router.post('/properties', [PropertiesController, 'store'])
    router.get('/properties/:id', [PropertiesController, 'show'])
    router.put('/properties/:id', [PropertiesController, 'update'])
    router.delete('/properties/:id', [PropertiesController, 'destroy'])

    // Units Endpoints
    router.get('/units', [UnitsController, 'index'])
    router.post('/units', [UnitsController, 'store'])
    router.get('/units/:id', [UnitsController, 'show'])
    router.put('/units/:id', [UnitsController, 'update'])
    router.delete('/units/:id', [UnitsController, 'destroy'])
  })
  .prefix('/api/v1')
