import type { HttpContext } from '@adonisjs/core/http'
import Property from '#models/property'
import { createPropertyValidator, updatePropertyValidator } from '#validators/property'

export default class PropertiesController {
  /**
   * Display a list of properties with unit rollups and optional search
   * Scoped to the authenticated user's organization tenant
   */
  async index({ auth, request, response }: HttpContext) {
    const orgId = auth.user!.organizationId!
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '').trim()

    const query = Property.query()
      .where('organization_id', orgId)
      .preload('units')
      .orderBy('created_at', 'desc')

    if (search) {
      query.where((q) => {
        q.whereILike('name', `%${search}%`)
          .orWhereILike('city', `%${search}%`)
          .orWhereILike('state', `%${search}%`)
      })
    }

    const paginated = await query.paginate(page, limit)
    const serialized = paginated.serialize()

    // Enrich each property with occupancy stats for the frontend dashboard
    const data = serialized.data.map((prop: any) => {
      const units = prop.units || []
      const totalUnits = units.length
      const occupiedUnits = units.filter((u: any) => u.status === 'occupied').length
      const vacantUnits = units.filter((u: any) => u.status === 'vacant').length
      const maintenanceUnits = units.filter((u: any) => u.status === 'maintenance').length
      const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0

      return {
        ...prop,
        stats: {
          totalUnits,
          occupiedUnits,
          vacantUnits,
          maintenanceUnits,
          occupancyRate,
        },
      }
    })

    return response.ok({
      success: true,
      data,
      meta: serialized.meta,
    })
  }

  /**
   * Create a new property scoped to the authenticated user's organization
   */
  async store({ auth, request, response }: HttpContext) {
    const orgId = auth.user!.organizationId!
    const payload = await request.validateUsing(createPropertyValidator)

    const property = await Property.create({
      ...payload,
      organizationId: orgId,
    })

    await property.load('units')

    return response.created({
      success: true,
      message: 'Property created successfully',
      data: property,
    })
  }

  /**
   * Show details of a single property with units (Tenant scoped)
   */
  async show({ auth, params, response }: HttpContext) {
    const orgId = auth.user!.organizationId!
    const property = await Property.query()
      .where('id', params.id)
      .where('organization_id', orgId)
      .preload('units', (q) => q.orderBy('unit_number', 'asc'))
      .first()

    if (!property) {
      return response.notFound({
        success: false,
        error: {
          code: 'PROPERTY_NOT_FOUND',
          message: `Property with ID ${params.id} does not exist in your organization.`,
        },
      })
    }

    const units = property.units || []
    const totalUnits = units.length
    const occupiedUnits = units.filter((u) => u.status === 'occupied').length
    const vacantUnits = units.filter((u) => u.status === 'vacant').length
    const maintenanceUnits = units.filter((u) => u.status === 'maintenance').length
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0

    return response.ok({
      success: true,
      data: {
        ...property.serialize(),
        stats: {
          totalUnits,
          occupiedUnits,
          vacantUnits,
          maintenanceUnits,
          occupancyRate,
        },
      },
    })
  }

  /**
   * Update an existing property (Tenant scoped)
   */
  async update({ auth, params, request, response }: HttpContext) {
    const orgId = auth.user!.organizationId!
    const property = await Property.query()
      .where('id', params.id)
      .where('organization_id', orgId)
      .first()

    if (!property) {
      return response.notFound({
        success: false,
        error: {
          code: 'PROPERTY_NOT_FOUND',
          message: `Property with ID ${params.id} does not exist in your organization.`,
        },
      })
    }

    const payload = await request.validateUsing(updatePropertyValidator)
    property.merge(payload)
    await property.save()
    await property.load('units')

    return response.ok({
      success: true,
      message: 'Property updated successfully',
      data: property,
    })
  }

  /**
   * Delete a property (Tenant scoped)
   */
  async destroy({ auth, params, response }: HttpContext) {
    const orgId = auth.user!.organizationId!
    const property = await Property.query()
      .where('id', params.id)
      .where('organization_id', orgId)
      .first()

    if (!property) {
      return response.notFound({
        success: false,
        error: {
          code: 'PROPERTY_NOT_FOUND',
          message: `Property with ID ${params.id} does not exist in your organization.`,
        },
      })
    }

    await property.delete()

    return response.ok({
      success: true,
      message: 'Property deleted successfully',
    })
  }
}