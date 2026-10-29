import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'units'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('property_id')
        .unsigned()
        .references('id')
        .inTable('properties')
        .onDelete('CASCADE')
        .notNullable()
        .index()

      table.string('unit_number', 50).notNullable()
      table.integer('floor').nullable()
      table.integer('bedrooms').notNullable().defaultTo(1)
      table.decimal('bathrooms', 3, 1).notNullable().defaultTo(1.0)
      table.integer('square_feet').nullable()
      table.decimal('rent_amount', 12, 2).notNullable().defaultTo(0)
      table.string('status', 30).notNullable().defaultTo('vacant')

      table.unique(['property_id', 'unit_number'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
