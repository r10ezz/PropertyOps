/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
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
    /*
    |--------------------------------------------------------------------------
    | Authentication Endpoints (Public & Protected)
    |--------------------------------------------------------------------------
    */
    router.post('/auth/login', [AuthController, 'login'])

    router
      .group(() => {
        router.post('/auth/logout', [AuthController, 'logout'])
        router.get('/auth/me', [AuthController, 'me'])
      })
      .use(middleware.auth())

    /*
    |--------------------------------------------------------------------------
    | Property Management Endpoints (Tenant Scoped & Role Protected)
    |--------------------------------------------------------------------------
    */
    router
      .group(() => {
        // Properties CRUD
        router.get('/properties', [PropertiesController, 'index'])
        router.post('/properties', [PropertiesController, 'store']).use(
          middleware.role(['admin', 'property_manager'])
        )
        router.get('/properties/:id', [PropertiesController, 'show'])
        router.put('/properties/:id', [PropertiesController, 'update']).use(
          middleware.role(['admin', 'property_manager'])
        )
        // Only Admin can delete properties
        router.delete('/properties/:id', [PropertiesController, 'destroy']).use(
          middleware.role(['admin'])
        )

        // Units CRUD
        router.get('/units', [UnitsController, 'index'])
        router.post('/units', [UnitsController, 'store']).use(
          middleware.role(['admin', 'property_manager'])
        )
        router.get('/units/:id', [UnitsController, 'show'])
        router.put('/units/:id', [UnitsController, 'update']).use(
          middleware.role(['admin', 'property_manager'])
        )
        // Only Admin can delete units
        router.delete('/units/:id', [UnitsController, 'destroy']).use(
          middleware.role(['admin'])
        )
      })
      .use([middleware.auth(), middleware.tenant()])
  })
  .prefix('/api/v1')
