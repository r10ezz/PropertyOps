import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    allowedRoles: string[]
  ) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to access this resource.',
        },
      })
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return ctx.response.forbidden({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `Action denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${user.role}.`,
        },
      })
    }

    return next()
  }
}
