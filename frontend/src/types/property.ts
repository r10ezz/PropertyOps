import type { Unit } from './unit'

export type PropertyType = 'residential' | 'commercial' | 'mixed'

export interface PropertyStats {
  totalUnits: number
  occupiedUnits: number
  vacantUnits: number
  maintenanceUnits: number
  occupancyRate: number
}

export interface Property {
  id: number
  organizationId: number
  name: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  propertyType: PropertyType
  createdAt: string
  updatedAt: string | null
  units?: Unit[]
  stats?: PropertyStats
}

export interface CreatePropertyInput {
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country?: string
  propertyType?: PropertyType
}

export type UpdatePropertyInput = Partial<CreatePropertyInput>
