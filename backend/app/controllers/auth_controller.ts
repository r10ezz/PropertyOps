import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Authenticate user and issue an API access token
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)

      if (user.status !== 'active') {
        return response.forbidden({
          success: false,
          error: {
            code: 'ACCOUNT_INACTIVE',
            message: 'Your account has been deactivated or suspended. Contact an administrator.',
          },
        })
      }

      // Generate access token valid for 30 days
      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '30 days',
      })

      await user.load('organization')

      return response.ok({
        success: true,
        message: 'Authenticated successfully',
        data: {
          token: token.value!.release(),
          user: {
            id: user.id,
            organizationId: user.organizationId,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            status: user.status,
            organization: user.organization,
          },
        },
      })
    } catch {
      return response.unauthorized({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password. Please try again.',
        },
      })
    }
  }

  /**
   * Revoke currently active access token
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({
      success: true,
      message: 'Logged out successfully',
    })
  }

  /**
   * Return profile of currently authenticated user with organization
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('organization')

    return response.ok({
      success: true,
      data: {
        id: user.id,
        organizationId: user.organizationId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        organization: user.organization,
      },
    })
  }
}
