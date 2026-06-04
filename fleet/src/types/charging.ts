export interface ChargingLog {
  id: string
  truckId: string
  truck: { truckId: string; model: string; licensePlate: string }
  operatorId: string
  operator: { name?: string | null; email?: string | null }
  startTime: string
  endTime?: string | null
  startBattery: number
  endBattery?: number | null
  kwhDelivered?: number | null
  stationId: string
  cost?: number | null
  notes?: string | null
  createdAt: string
}

export interface ChargingStats {
  totalSessions: number
  totalKwh: number
  totalCost: number
  avgSessionDuration: number
  avgKwhPerSession: number
}

export interface ChargingFormData {
  truckId: string
  startTime: string
  endTime?: string
  startBattery: number
  endBattery?: number
  kwhDelivered?: number
  stationId: string
  cost?: number
  notes?: string
}
