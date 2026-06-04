export const APP_NAME = 'Tonly Fleet'
export const APP_VERSION = '1.0.0'

export const TRUCK_STATUSES = ['ACTIVE', 'MAINTENANCE', 'CHARGING', 'FAULTY', 'IDLE'] as const
export const FAULT_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const
export const FAULT_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED'] as const
export const TASK_STATUSES = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const
export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const
export const USER_ROLES = ['WORKER', 'TECHNICIAN', 'SUPERVISOR', 'CHARGING_OPERATOR'] as const

export const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#22c55e',
  MAINTENANCE: '#f59e0b',
  CHARGING: '#3b82f6',
  FAULTY: '#ef4444',
  IDLE: '#6b7280',
  OPEN: '#ef4444',
  IN_PROGRESS: '#f59e0b',
  RESOLVED: '#22c55e',
  PENDING: '#6b7280',
  ASSIGNED: '#3b82f6',
  COMPLETED: '#22c55e',
  CANCELLED: '#ef4444',
  LOW: '#3b82f6',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
  URGENT: '#ef4444',
}

export const CHARGING_STATIONS = ['CS-01', 'CS-02', 'CS-03', 'CS-04', 'CS-05', 'CS-06', 'CS-07', 'CS-08']

export const DEFAULT_PAGE_SIZE = 20
