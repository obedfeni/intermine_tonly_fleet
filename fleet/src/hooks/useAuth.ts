'use client'
import { useSession } from 'next-auth/react'
import { hasPermission } from '../lib/roles'

export function useAuth() {
  const { data: session, status } = useSession()
  const user = session?.user as any
  const role = user?.role || ''

  return {
    user,
    role,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isSupervisor: role === 'SUPERVISOR',
    isTechnician: role === 'TECHNICIAN',
    isWorker: role === 'WORKER',
    isChargingOperator: role === 'CHARGING_OPERATOR',
    can: (permission: string) => hasPermission(role, permission),
  }
}
