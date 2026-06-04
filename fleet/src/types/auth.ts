export type UserRole = 'WORKER' | 'TECHNICIAN' | 'SUPERVISOR' | 'CHARGING_OPERATOR'

export interface AuthUser {
  id: string
  name?: string | null
  email?: string | null
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
}
