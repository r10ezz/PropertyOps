import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class TenantMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be authenticated to access tenant data.',
        },
      })
    }

    if (!user.organizationId) {
      return ctx.response.forbidden({
        success: false,
        error: {
          code: 'NO_TENANT_ORGANIZATION',
          message: 'User does not belong to any active organization tenant.',
        },
      })
    }

    return next()
  }
}
