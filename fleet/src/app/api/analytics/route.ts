import { NextResponse } from 'next/server'
import { auth } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [trucks, faults, tasks, charging] = await Promise.all([
    prisma.truck.findMany({ select: { status: true, mileage: true, model: true, batteryCapacity: true } }),
    prisma.fault.findMany({ select: { severity: true, status: true, createdAt: true } }),
    prisma.task.findMany({ select: { status: true, priority: true, createdAt: true, completedAt: true } }),
    prisma.chargingLog.findMany({ select: { kwhDelivered: true, cost: true, startTime: true, startBattery: true, endBattery: true } }),
  ])

  const totalMileage = trucks.reduce((s, t) => s + t.mileage, 0)
  const totalKwh = charging.reduce((s, c) => s + (c.kwhDelivered || 0), 0)
  const totalCost = charging.reduce((s, c) => s + (c.cost || 0), 0)

  const faultsBySeverity = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
  faults.forEach(f => { (faultsBySeverity as any)[f.severity]++ })

  const tasksByStatus = { PENDING: 0, ASSIGNED: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0 }
  tasks.forEach(t => { (tasksByStatus as any)[t.status]++ })

  return NextResponse.json({
    fleet: {
      totalMileage,
      avgMileage: trucks.length ? Math.round(totalMileage / trucks.length) : 0,
      utilization: trucks.length ? Math.round((trucks.filter(t => t.status === 'ACTIVE').length / trucks.length) * 100) : 0,
    },
    energy: {
      totalKwh: Math.round(totalKwh * 10) / 10,
      totalCost: Math.round(totalCost * 100) / 100,
      avgKwhPerSession: charging.length ? Math.round((totalKwh / charging.length) * 10) / 10 : 0,
      totalSessions: charging.length,
    },
    faultsBySeverity,
    tasksByStatus,
  })
}
