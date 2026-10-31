export type UserRole = 'admin' | 'property_manager' | 'resident'

export interface UserOrganization {
  id: number
  name: string
  slug: string
}

export interface User {
  id: number
  organizationId: number
  fullName: string
  email: string
  role: UserRole
  phone: string | null
  status: 'active' | 'inactive' | 'suspended'
  organization?: UserOrganization
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthData {
  token: string
  user: User
}
