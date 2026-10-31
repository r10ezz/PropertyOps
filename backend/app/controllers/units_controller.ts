import type { HttpContext } from '@adonisjs/core/http'
import Unit from '#models/unit'
import Property from '#models/property'
import { createUnitValidator, updateUnitValidator } from '#validators/unit'

export default class UnitsController {
  /**
   * Display a list of units with filters for property, status, or search
   * Scoped to the authenticated user's organization tenant
   */
  async index({ auth, request, response }: HttpContext) {
    const orgId = auth.user!.organizationId!
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)
    const propertyId = request.input('propertyId')
    const status = request.input('status')
    const search = request.input('search', '').trim()

    const query = Unit.query()
      .whereHas('property', (pq) => pq.where('organization_id', orgId))
      .preload('property')
      .orderBy('unit_number', 'asc')

    if (propertyId) {
      query.where('property_id', propertyId)
    }

    if (status) {
      query.where('status', status)
    }

    if (search) {
      query.whereILike('unit_number', `%${search}%`)
    }

    const paginated = await query.paginate(page, limit)

    return response.ok({
      success: true,
      data: paginated.all(),
      meta: paginated.getMeta(),
    })
  }

  /**
   * Create a new unit under a tenant property
   */
  async store({ auth, request, response }: HttpContext) {
    const orgId = auth.user!.organizationId!
    const payload = await request.validateUsing(createUnitValidator)

    // Verify property exists and belongs to the user's organization
    const property = await Property.query()
      .where('id', payload.propertyId)
      .where('organization_id', orgId)
      .first()

    if (!property) {
      return response.notFound({
        success: false,
        error: {
          code: 'PROPERTY_NOT_FOUND',
          message: `Parent property with ID ${payload.propertyId} does not exist in your organization.`,
        },
      })
    }

    // Verify unit number uniqueness within the property
    const existing = await Unit.query()
      .where('property_id', payload.propertyId)
      .where('unit_number', payload.unitNumber)
      .first()

    if (existing) {
      return response.conflict({
        success: false,
        error: {
          code: 'DUPLICATE_UNIT_NUMBER',
          message: `Unit "${payload.unitNumber}" already exists in ${property.name}.`,
        },
      })
    }

    const unit = await Unit.create(payload)
    await unit.load('property')

    return response.created({
      success: true,
      message: 'Unit created successfully',
      data: unit,
    })
  }

  /**
   * Show details of a single unit (Tenant scoped)
   */
  async show({ auth, params, response }: HttpContext) {
    const orgId = auth.user!.organizationId!
    const unit = await Unit.query()
      .where('id', params.id)
      .whereHas('property', (pq) => pq.where('organization_id', orgId))
      .preload('property')
      .first()

    if (!unit) {
      return response.notFound({
        success: false,
        error: {
          code: 'UNIT_NOT_FOUND',
          message: `Unit with ID ${params.id} does not exist in your organization.`,
        },
      })
    }

    return response.ok({
      success: true,
      data: unit,
    })
  }

  /**
   * Update an existing unit (Tenant scoped)
   */
  async update({ auth, params, request, response }: HttpContext) {
    const orgId = auth.user!.organizationId!
    const unit = await Unit.query()
      .where('id', params.id)
      .whereHas('property', (pq) => pq.where('organization_id', orgId))
      .first()

    if (!unit) {
      return response.notFound({
        success: false,
        error: {
          code: 'UNIT_NOT_FOUND',
          message: `Unit with ID ${params.id} does not exist in your organization.`,
        },
      })
    }

    const payload = await request.validateUsing(updateUnitValidator)

    // If unit number or property is being changed, verify uniqueness
    const targetPropertyId = payload.propertyId ?? unit.propertyId
    const targetUnitNumber = payload.unitNumber ?? unit.unitNumber

    if (payload.unitNumber || payload.propertyId) {
      // If property changed, verify target property also belongs to org
      if (payload.propertyId && payload.propertyId !== unit.propertyId) {
        const targetProperty = await Property.query()
          .where('id', payload.propertyId)
          .where('organization_id', orgId)
          .first()

        if (!targetProperty) {
          return response.notFound({
            success: false,
            error: {
              code: 'PROPERTY_NOT_FOUND',
              message: `Target property with ID ${payload.propertyId} does not exist in your organization.`,
            },
          })
        }
      }

      const duplicate = await Unit.query()
        .where('property_id', targetPropertyId)
        .where('unit_number', targetUnitNumber)
        .whereNot('id', unit.id)
        .first()

      if (duplicate) {
        return response.conflict({
          success: false,
          error: {
            code: 'DUPLICATE_UNIT_NUMBER',
            message: `Unit "${targetUnitNumber}" already exists in the target property.`,
          },
        })
      }
    }

    unit.merge(payload)
    await unit.save()
    await unit.load('property')

    return response.ok({
      success: true,
      message: 'Unit updated successfully',
      data: unit,
    })
  }

  /**
   * Delete a unit (Tenant scoped)
   */
  async destroy({ auth, params, response }: HttpContext) {
    const orgId = auth.user!.organizationId!
    const unit = await Unit.query()
      .where('id', params.id)
      .whereHas('property', (pq) => pq.where('organization_id', orgId))
      .first()

    if (!unit) {
      return response.notFound({
        success: false,
        error: {
          code: 'UNIT_NOT_FOUND',
          message: `Unit with ID ${params.id} does not exist in your organization.`,
        },
      })
    }

    await unit.delete()

    return response.ok({
      success: true,
      message: 'Unit deleted successfully',
    })
  }
}
