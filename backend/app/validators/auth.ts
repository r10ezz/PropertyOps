import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(6),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(150),
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(8),
    role: vine.enum(['admin', 'property_manager', 'resident']).optional(),
    phone: vine.string().trim().maxLength(30).optional(),
  })
)
