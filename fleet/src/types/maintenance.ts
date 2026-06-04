export type TaskStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type FaultSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type FaultStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  truckId: string
  truck: { truckId: string; model: string; licensePlate: string }
  assignedTo?: string | null
  assignee?: { name?: string | null; email?: string | null } | null
  createdBy: string
  creator: { name?: string | null; email?: string | null }
  scheduledAt?: string | null
  completedAt?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface Fault {
  id: string
  title: string
  description: string
  severity: FaultSeverity
  status: FaultStatus
  truckId: string
  truck: { truckId: string; model: string; licensePlate: string }
  reportedBy: string
  reporter: { name?: string | null; email?: string | null }
  assignedTo?: string | null
  resolution?: string | null
  images: string[]
  createdAt: string
  updatedAt: string
}
