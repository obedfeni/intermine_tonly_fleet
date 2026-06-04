'use client'
const SVC: Record<string,string> = { LOW:'#3b82f6', MEDIUM:'#f59e0b', HIGH:'#f97316', CRITICAL:'#ef4444' }
const STC: Record<string,string> = { OPEN:'#ef4444', IN_PROGRESS:'#f59e0b', RESOLVED:'#22c55e' }

interface FaultTableProps {
  faults: any[]
  loading?: boolean
  onRowClick?: (fault: any) => void
  onStatusChange?: (id: string, status: string) => void
  canUpdate?: boolean
}

export function FaultTable({ faults, loading, onRowClick, onStatusChange, canUpdate }: FaultTableProps) {
  return (
    <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', overflow:'hidden' }}>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              {['Truck','Fault','Severity','Status','Reporter','Date', canUpdate ? 'Actions' : ''].filter(Boolean).map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'11px', color:'#475569', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'#475569', fontSize:'13px' }}>Loading...</td></tr>
            ) : faults.map(f => (
              <tr key={f.id} onClick={() => onRowClick?.(f)} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:onRowClick?'pointer':'default' }}
                onMouseEnter={e => onRowClick && (e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                <td style={{ padding:'10px 14px' }}>
                  <p style={{ fontSize:'12px', fontWeight:700, color:'#f8fafc', margin:0 }}>{f.truck.truckId}</p>
                  <p style={{ fontSize:'11px', color:'#475569', margin:0 }}>{f.truck.model}</p>
                </td>
                <td style={{ padding:'10px 14px', maxWidth:'180px' }}>
                  <p style={{ fontSize:'12px', color:'#f8fafc', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.title}</p>
                </td>
                <td style={{ padding:'10px 14px' }}>
                  <span style={{ fontSize:'10px', padding:'3px 8px', borderRadius:'5px', background:`${SVC[f.severity]}20`, color:SVC[f.severity], fontWeight:600 }}>{f.severity}</span>
                </td>
                <td style={{ padding:'10px 14px' }}>
                  <span style={{ fontSize:'10px', padding:'3px 8px', borderRadius:'5px', background:`${STC[f.status]}15`, color:STC[f.status] }}>{f.status.replace('_',' ')}</span>
                </td>
                <td style={{ padding:'10px 14px', fontSize:'12px', color:'#94a3b8' }}>{f.reporter?.name || f.reporter?.email}</td>
                <td style={{ padding:'10px 14px', fontSize:'11px', color:'#64748b' }}>{new Date(f.createdAt).toLocaleDateString()}</td>
                {canUpdate && (
                  <td style={{ padding:'10px 14px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display:'flex', gap:'4px' }}>
                      {f.status==='OPEN' && <button onClick={() => onStatusChange?.(f.id,'IN_PROGRESS')} style={{ fontSize:'10px', padding:'3px 8px', background:'rgba(245,158,11,0.1)', color:'#f59e0b', border:'none', borderRadius:'5px', cursor:'pointer' }}>Start</button>}
                      {f.status!=='RESOLVED' && <button onClick={() => onStatusChange?.(f.id,'RESOLVED')} style={{ fontSize:'10px', padding:'3px 8px', background:'rgba(34,197,94,0.1)', color:'#22c55e', border:'none', borderRadius:'5px', cursor:'pointer' }}>Resolve</button>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && faults.length===0 && <div style={{ textAlign:'center', padding:'3rem', color:'#475569', fontSize:'13px' }}>No faults found</div>}
      </div>
    </div>
  )
}
