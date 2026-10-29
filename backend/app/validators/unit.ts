import vine from '@vinejs/vine'

export const createUnitValidator = vine.compile(
  vine.object({
    propertyId: vine.number().positive(),
    unitNumber: vine.string().trim().minLength(1).maxLength(50),
    floor: vine.number().optional(),
    bedrooms: vine.number().min(0).max(20).optional(),
    bathrooms: vine.number().min(0).max(20).optional(),
    squareFeet: vine.number().positive().optional(),
    rentAmount: vine.number().min(0),
    status: vine.enum(['vacant', 'occupied', 'maintenance']).optional(),
  })
)

export const updateUnitValidator = vine.compile(
  vine.object({
    propertyId: vine.number().positive().optional(),
    unitNumber: vine.string().trim().minLength(1).maxLength(50).optional(),
    floor: vine.number().optional(),
    bedrooms: vine.number().min(0).max(20).optional(),
    bathrooms: vine.number().min(0).max(20).optional(),
    squareFeet: vine.number().positive().optional(),
    rentAmount: vine.number().min(0).optional(),
    status: vine.enum(['vacant', 'occupied', 'maintenance']).optional(),
  })
)
