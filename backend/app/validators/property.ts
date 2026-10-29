import vine from '@vinejs/vine'

export const createPropertyValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(200),
    addressLine1: vine.string().trim().minLength(3).maxLength(255),
    addressLine2: vine.string().trim().maxLength(255).optional(),
    city: vine.string().trim().minLength(2).maxLength(100),
    state: vine.string().trim().minLength(2).maxLength(100),
    postalCode: vine.string().trim().minLength(2).maxLength(30),
    country: vine.string().trim().maxLength(100).optional(),
    propertyType: vine.enum(['residential', 'commercial', 'mixed']).optional(),
  })
)

export const updatePropertyValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(200).optional(),
    addressLine1: vine.string().trim().minLength(3).maxLength(255).optional(),
    addressLine2: vine.string().trim().maxLength(255).optional(),
    city: vine.string().trim().minLength(2).maxLength(100).optional(),
    state: vine.string().trim().minLength(2).maxLength(100).optional(),
    postalCode: vine.string().trim().minLength(2).maxLength(30).optional(),
    country: vine.string().trim().maxLength(100).optional(),
    propertyType: vine.enum(['residential', 'commercial', 'mixed']).optional(),
  })
)