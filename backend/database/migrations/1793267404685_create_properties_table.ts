import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'properties'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('organization_id')
        .unsigned()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE')
        .notNullable()
        .index()

      table.string('name', 200).notNullable()
      table.string('address_line1', 255).notNullable()
      table.string('address_line2', 255).nullable()
      table.string('city', 100).notNullable()
      table.string('state', 100).notNullable()
      table.string('postal_code', 30).notNullable()
      table.string('country', 100).notNullable().defaultTo('United States')
      table.string('property_type', 50).notNullable().defaultTo('residential')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
