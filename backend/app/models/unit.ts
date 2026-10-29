import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Property from '#models/property'

export default class Unit extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare propertyId: number

  @column()
  declare unitNumber: string

  @column()
  declare floor: number | null

  @column()
  declare bedrooms: number

  @column()
  declare bathrooms: number

  @column()
  declare squareFeet: number | null

  @column()
  declare rentAmount: number

  @column()
  declare status: 'vacant' | 'occupied' | 'maintenance'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Property)
  declare property: BelongsTo<typeof Property>
}
