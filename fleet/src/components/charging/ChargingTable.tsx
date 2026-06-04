'use client'
import { formatDate, formatCurrency } from '../../lib/utils'

interface ChargingTableProps { logs: any[]; loading?: boolean }

export function ChargingTable({ logs, loading }: ChargingTableProps) {
  return (
    <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', overflow:'hidden' }}>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            {['Truck','Start Time','End Time','Battery','kWh','Station','Cost','Operator'].map(h=>(
              <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'11px', color:'#475569', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={8} style={{ textAlign:'center', padding:'3rem', color:'#475569', fontSize:'13px' }}>Loading...</td></tr>
            : logs.map(log=>(
              <tr key={log.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding:'10px 14px' }}><p style={{ fontSize:'12px', fontWeight:700, color:'#f8fafc', margin:0 }}>{log.truck.truckId}</p><p style={{ fontSize:'11px', color:'#475569', margin:0 }}>{log.truck.model}</p></td>
                <td style={{ padding:'10px 14px', fontSize:'11px', color:'#94a3b8' }}>{formatDate(log.startTime)}</td>
                <td style={{ padding:'10px 14px', fontSize:'11px', color:'#64748b' }}>{log.endTime ? formatDate(log.endTime) : <span style={{ fontSize:'10px', padding:'2px 7px', background:'rgba(59,130,246,0.1)', color:'#60a5fa', borderRadius:'5px' }}>In Progress</span>}</td>
                <td style={{ padding:'10px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <div style={{ width:'40px', height:'5px', background:'#1e293b', borderRadius:'3px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${log.endBattery||log.startBattery}%`, background:'#22c55e' }} />
                    </div>
                    <span style={{ fontSize:'11px', color:'#94a3b8' }}>{log.startBattery}%{log.endBattery?`→${log.endBattery}%`:''}</span>
                  </div>
                </td>
                <td style={{ padding:'10px 14px', fontSize:'12px', color:'#22c55e', fontWeight:600 }}>{log.kwhDelivered || '—'}</td>
                <td style={{ padding:'10px 14px', fontSize:'12px', color:'#94a3b8' }}>{log.stationId}</td>
                <td style={{ padding:'10px 14px', fontSize:'12px', color:'#f59e0b' }}>{log.cost ? formatCurrency(log.cost) : '—'}</td>
                <td style={{ padding:'10px 14px', fontSize:'12px', color:'#94a3b8' }}>{log.operator?.name || log.operator?.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && logs.length===0 && <div style={{ textAlign:'center', padding:'3rem', color:'#475569', fontSize:'13px' }}>No charging logs found</div>}
      </div>
    </div>
  )
}
