'use client'
import { formatDateShort } from '../../lib/utils'

const STC: Record<string,string> = { PENDING:'#6b7280', ASSIGNED:'#3b82f6', IN_PROGRESS:'#f59e0b', COMPLETED:'#22c55e', CANCELLED:'#ef4444' }
const PRC: Record<string,string> = { LOW:'#6b7280', MEDIUM:'#3b82f6', HIGH:'#f97316', URGENT:'#ef4444' }

interface MaintenanceTableProps {
  tasks: any[]
  loading?: boolean
  onRowClick?: (task: any) => void
  onStatusChange?: (id: string, status: string) => void
  canUpdate?: boolean
}

export function MaintenanceTable({ tasks, loading, onRowClick, onStatusChange, canUpdate }: MaintenanceTableProps) {
  return (
    <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', overflow:'hidden' }}>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              {['Truck','Task','Priority','Assignee','Scheduled','Status', canUpdate?'Actions':''].filter(Boolean).map(h=>(
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'11px', color:'#475569', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'#475569', fontSize:'13px' }}>Loading...</td></tr>
            ) : tasks.map(task => (
              <tr key={task.id} onClick={()=>onRowClick?.(task)} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:onRowClick?'pointer':'default' }}
                onMouseEnter={e=>onRowClick&&(e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <td style={{ padding:'10px 14px' }}>
                  <p style={{ fontSize:'12px', fontWeight:700, color:'#f8fafc', margin:0 }}>{task.truck.truckId}</p>
                  <p style={{ fontSize:'11px', color:'#475569', margin:0 }}>{task.truck.model}</p>
                </td>
                <td style={{ padding:'10px 14px', maxWidth:'180px' }}>
                  <p style={{ fontSize:'12px', color:'#f8fafc', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{task.title}</p>
                </td>
                <td style={{ padding:'10px 14px' }}>
                  <span style={{ fontSize:'10px', fontWeight:700, color:PRC[task.priority] }}>{task.priority}</span>
                </td>
                <td style={{ padding:'10px 14px', fontSize:'12px', color:'#94a3b8' }}>{task.assignee?.name || '—'}</td>
                <td style={{ padding:'10px 14px', fontSize:'11px', color:'#64748b' }}>{task.scheduledAt ? formatDateShort(task.scheduledAt) : '—'}</td>
                <td style={{ padding:'10px 14px' }}>
                  <span style={{ fontSize:'10px', padding:'3px 8px', borderRadius:'5px', background:`${STC[task.status]}15`, color:STC[task.status], border:`1px solid ${STC[task.status]}30` }}>
                    {task.status.replace('_',' ')}
                  </span>
                </td>
                {canUpdate && (
                  <td style={{ padding:'10px 14px' }} onClick={e=>e.stopPropagation()}>
                    <div style={{ display:'flex', gap:'4px' }}>
                      {['PENDING','ASSIGNED'].includes(task.status) && <button onClick={()=>onStatusChange?.(task.id,'IN_PROGRESS')} style={{ fontSize:'10px', padding:'3px 8px', background:'rgba(245,158,11,0.1)', color:'#f59e0b', border:'none', borderRadius:'5px', cursor:'pointer' }}>Start</button>}
                      {task.status==='IN_PROGRESS' && <button onClick={()=>onStatusChange?.(task.id,'COMPLETED')} style={{ fontSize:'10px', padding:'3px 8px', background:'rgba(34,197,94,0.1)', color:'#22c55e', border:'none', borderRadius:'5px', cursor:'pointer' }}>Done</button>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && tasks.length===0 && <div style={{ textAlign:'center', padding:'3rem', color:'#475569', fontSize:'13px' }}>No maintenance tasks found</div>}
      </div>
    </div>
  )
}
