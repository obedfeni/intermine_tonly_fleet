export const ROLE_PERMISSIONS: Record<string, string[]> = {
  WORKER: ['dashboard:view', 'trucks:view', 'faults:view', 'tasks:view', 'charging:view'],
  TECHNICIAN: ['dashboard:view', 'trucks:view', 'faults:report', 'faults:view', 'tasks:view', 'tasks:update'],
  SUPERVISOR: ['*'],
  CHARGING_OPERATOR: ['dashboard:view', 'trucks:view', 'charging:log', 'charging:view', 'faults:view', 'tasks:view'],
}

export function hasPermission(role: string, perm: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || []
  return perms.includes('*') || perms.includes(perm)
}

export const ROLE_LABELS: Record<string, string> = {
  WORKER: 'Worker',
  TECHNICIAN: 'Technician',
  SUPERVISOR: 'Supervisor',
  CHARGING_OPERATOR: 'Charging Operator',
}

export const ROLE_COLORS: Record<string, string> = {
  WORKER: 'bg-slate-700 text-slate-300',
  TECHNICIAN: 'bg-blue-900 text-blue-300',
  SUPERVISOR: 'bg-purple-900 text-purple-300',
  CHARGING_OPERATOR: 'bg-green-900 text-green-300',
}
