'use client'
import { formatCurrency } from '../../lib/utils'

interface ChargingStatsProps {
  totalSessions: number
  totalKwh: number
  totalCost: number
}

export function ChargingStats({ totalSessions, totalKwh, totalCost }: ChargingStatsProps) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
      {[
        { label:'Total Sessions', value: totalSessions, icon:'⚡' },
        { label:'Total Energy', value:`${totalKwh.toFixed(1)} kWh`, icon:'🔋' },
        { label:'Total Cost', value: formatCurrency(totalCost), icon:'💰' },
      ].map(c=>(
        <div key={c.label} style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.125rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <p style={{ fontSize:'11px', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px', margin:0 }}>{c.label}</p>
              <p style={{ fontSize:'24px', fontWeight:700, color:'#f8fafc', margin:'5px 0 0' }}>{c.value}</p>
            </div>
            <span style={{ fontSize:'24px' }}>{c.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
