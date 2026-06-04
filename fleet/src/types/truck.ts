export type TruckStatus = 'ACTIVE' | 'MAINTENANCE' | 'CHARGING' | 'FAULTY' | 'IDLE'

export interface Truck {
  id: string
  truckId: string
  model: string
  year: number
  licensePlate: string
  vin: string
  batteryCapacity: number
  status: TruckStatus
  mileage: number
  lastService?: string | null
  nextService?: string | null
  location?: string | null
  _count?: { faults: number; tasks: number; chargingLogs: number }
  createdAt: string
  updatedAt: string
}

export interface TruckStats {
  totalTrucks: number
  activeTrucks: number
  faultyTrucks: number
  maintenanceTrucks: number
  chargingTrucks: number
  idleTrucks: number
}
