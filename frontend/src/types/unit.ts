import type { Property } from './property'

export type UnitStatus = 'vacant' | 'occupied' | 'maintenance'

export interface Unit {
  id: number
  propertyId: number
  unitNumber: string
  floor: number | null
  bedrooms: number
  bathrooms: number | string
  squareFeet: number | null
  rentAmount: number | string
  status: UnitStatus
  createdAt: string
  updatedAt: string | null
  property?: Property
}

export interface CreateUnitInput {
  propertyId: number
  unitNumber: string
  floor?: number
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  rentAmount: number
  status?: UnitStatus
}

export type UpdateUnitInput = Partial<CreateUnitInput>
