import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Organization from '#models/organization'
import User from '#models/user'
import Property from '#models/property'
import Unit from '#models/unit'

export default class extends BaseSeeder {
  async run() {
    // 1. Create Organization
    const organization = await Organization.firstOrCreate(
      { slug: 'skyline-living' },
      {
        name: 'Skyline Living Residences',
        slug: 'skyline-living',
      }
    )

    // 2. Create Users
    await User.firstOrCreate(
      { email: 'admin@propertyops.com' },
      {
        organizationId: organization.id,
        fullName: 'Alex Morgan',
        email: 'admin@propertyops.com',
        password: 'password123',
        role: 'admin',
        phone: '+1 (555) 234-5678',
        status: 'active',
      }
    )

    await User.firstOrCreate(
      { email: 'manager@propertyops.com' },
      {
        organizationId: organization.id,
        fullName: 'Sarah Jenkins',
        email: 'manager@propertyops.com',
        password: 'password123',
        role: 'property_manager',
        phone: '+1 (555) 876-5432',
        status: 'active',
      }
    )

    // 3. Create Properties
    const prop1 = await Property.firstOrCreate(
      { name: 'Oakwood Heights Apartments', organizationId: organization.id },
      {
        organizationId: organization.id,
        name: 'Oakwood Heights Apartments',
        addressLine1: '1200 West End Ave',
        addressLine2: 'Building A & B',
        city: 'Nashville',
        state: 'TN',
        postalCode: '37203',
        country: 'United States',
        propertyType: 'residential',
      }
    )

    const prop2 = await Property.firstOrCreate(
      { name: 'Harborview Modern Lofts', organizationId: organization.id },
      {
        organizationId: organization.id,
        name: 'Harborview Modern Lofts',
        addressLine1: '450 Waterfront Blvd',
        addressLine2: null,
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'United States',
        propertyType: 'mixed',
      }
    )

    // 4. Create Units for Property 1
    const prop1Units = [
      { unitNumber: '101', floor: 1, bedrooms: 1, bathrooms: 1.0, squareFeet: 750, rentAmount: 1650.0, status: 'occupied' as const },
      { unitNumber: '102', floor: 1, bedrooms: 2, bathrooms: 2.0, squareFeet: 1050, rentAmount: 2100.0, status: 'occupied' as const },
      { unitNumber: '201', floor: 2, bedrooms: 1, bathrooms: 1.0, squareFeet: 780, rentAmount: 1700.0, status: 'vacant' as const },
      { unitNumber: '202', floor: 2, bedrooms: 2, bathrooms: 2.0, squareFeet: 1100, rentAmount: 2250.0, status: 'maintenance' as const },
      { unitNumber: '301', floor: 3, bedrooms: 3, bathrooms: 2.5, squareFeet: 1450, rentAmount: 2800.0, status: 'occupied' as const },
    ]

    for (const u of prop1Units) {
      await Unit.firstOrCreate(
        { propertyId: prop1.id, unitNumber: u.unitNumber },
        { ...u, propertyId: prop1.id }
      )
    }

    // 5. Create Units for Property 2
    const prop2Units = [
      { unitNumber: 'Loft A', floor: 2, bedrooms: 1, bathrooms: 1.5, squareFeet: 920, rentAmount: 2400.0, status: 'occupied' as const },
      { unitNumber: 'Loft B', floor: 2, bedrooms: 1, bathrooms: 1.5, squareFeet: 920, rentAmount: 2400.0, status: 'vacant' as const },
      { unitNumber: 'Penthouse 1', floor: 5, bedrooms: 2, bathrooms: 2.5, squareFeet: 1800, rentAmount: 4500.0, status: 'vacant' as const },
      { unitNumber: 'Studio 12', floor: 1, bedrooms: 0, bathrooms: 1.0, squareFeet: 520, rentAmount: 1550.0, status: 'occupied' as const },
    ]

    for (const u of prop2Units) {
      await Unit.firstOrCreate(
        { propertyId: prop2.id, unitNumber: u.unitNumber },
        { ...u, propertyId: prop2.id }
      )
    }
  }
}