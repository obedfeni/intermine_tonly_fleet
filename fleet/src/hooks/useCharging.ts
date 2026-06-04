'use client'
import { useState, useEffect, useCallback } from 'react'
import type { ChargingLog, ChargingStats } from '../types/charging'

export function useCharging() {
  const [logs, setLogs] = useState<ChargingLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/charging')
      if (!res.ok) throw new Error('Failed to fetch charging logs')
      const data = await res.json()
      setLogs(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const stats: ChargingStats = {
    totalSessions: logs.length,
    totalKwh: logs.reduce((s, l) => s + (l.kwhDelivered || 0), 0),
    totalCost: logs.reduce((s, l) => s + (l.cost || 0), 0),
    avgSessionDuration: 0,
    avgKwhPerSession: logs.length ? logs.reduce((s, l) => s + (l.kwhDelivered || 0), 0) / logs.length : 0,
  }

  return { logs, loading, error, stats, refetch: fetchLogs }
}
