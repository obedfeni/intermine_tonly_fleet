'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { hasPermission } from '../../../lib/roles'
import { t, type Locale } from '../../../lib/i18n'
import { formatDate, formatCurrency } from '../../../lib/utils'
import * as XLSX from 'xlsx'

const inp = { width:'100%', padding:'9px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#f8fafc', fontSize:'13px', outline:'none', boxSizing:'border-box' as const }
const lbl = { display:'block', fontSize:'12px', color:'#94a3b8', marginBottom:'5px', fontWeight:500 as const }

export default function ChargingPage() {
  const { data: session } = useSession()
  const [logs, setLogs] = useState<any[]>([])
  const [trucks, setTrucks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [upload, setUpload] = useState(false)
  const [filter, setFilter] = useState('')
  const [locale, setLocale] = useState<Locale>('en')
  const role = (session?.user as any)?.role || ''
  const canLog = hasPermission(role, 'charging:log')

  const load = () => fetch('/api/charging').then(r=>r.json()).then(d=>{setLogs(d);setLoading(false)})
  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocale(saved)
    load(); fetch('/api/trucks').then(r=>r.json()).then(setTrucks)
  }, [])

  const filtered = logs.filter(l => !filter || l.truck.truckId === filter)
  const totalKwh = logs.reduce((s,l) => s+(l.kwhDelivered||0), 0)
  const totalCost = logs.reduce((s,l) => s+(l.cost||0), 0)

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['truckId','startTime','endTime','startBattery','endBattery','kwhDelivered','stationId','cost','notes'],
      ['TNL-001','2025-01-15 08:00','2025-01-15 10:30',20,90,145.5,'CS-01',18.50,'Full charge'],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Charging Logs')
    XLSX.writeFile(wb, 'tonly_charging_template.xlsx')
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'#f8fafc', margin:'0 0 4px' }}>{t(locale,'chargingLogs')}</h1>
          <p style={{ fontSize:'13px', color:'#475569', margin:0 }}>{t(locale,'monitorCharging')}</p>
        </div>
        {canLog && (
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={()=>setUpload(true)} style={{ padding:'9px 14px', background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'#94a3b8', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>📊 {t(locale,'importExcel')}</button>
            <button onClick={()=>setModal(true)} style={{ padding:'9px 16px', background:'#2563eb', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>+ {t(locale,'logSession')}</button>
          </div>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.25rem' }}>
        {[[t(locale,'totalSessions'),logs.length,'⚡'],[t(locale,'totalEnergy'),`${totalKwh.toFixed(1)} kWh`,'🔋'],[t(locale,'totalCost'),formatCurrency(totalCost),'💰']].map(([label,value,icon])=>(
          <div key={label} style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.125rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div><p style={{ fontSize:'11px', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px', margin:0 }}>{label}</p><p style={{ fontSize:'24px', fontWeight:700, color:'#f8fafc', margin:'5px 0 0' }}>{value}</p></div>
              <span style={{ fontSize:'24px' }}>{icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:'10px', marginBottom:'1rem', alignItems:'center' }}>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{ padding:'7px 12px', background:'#1e293b', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#f8fafc', fontSize:'13px', outline:'none' }}>
          <option value="">{t(locale,'allTrucks')}</option>
          {trucks.map(tr=><option key={tr.id} value={tr.truckId}>{tr.truckId}</option>)}
        </select>
        <span style={{ fontSize:'12px', color:'#475569' }}>{t(locale,'sessionCount',{count:filtered.length})}</span>
      </div>

      <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              {[t(locale,'truck'),t(locale,'startTime'),t(locale,'endTime'),t(locale,'battery'),t(locale,'kWh'),t(locale,'station'),t(locale,'cost'),t(locale,'operator')].map(h=>(
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'11px', color:'#475569', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} style={{ textAlign:'center', padding:'3rem', color:'#475569', fontSize:'13px' }}>{t(locale,'loading')}</td></tr>
              : filtered.map(log=>(
                <tr key={log.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding:'10px 14px' }}><p style={{ fontSize:'12px', fontWeight:700, color:'#f8fafc', margin:0 }}>{log.truck.truckId}</p><p style={{ fontSize:'11px', color:'#475569', margin:0 }}>{log.truck.model}</p></td>
                  <td style={{ padding:'10px 14px', fontSize:'11px', color:'#94a3b8' }}>{formatDate(log.startTime)}</td>
                  <td style={{ padding:'10px 14px', fontSize:'11px', color:'#64748b' }}>{log.endTime ? formatDate(log.endTime) : <span style={{ fontSize:'10px', padding:'2px 7px', background:'rgba(59,130,246,0.1)', color:'#60a5fa', borderRadius:'5px' }}>{t(locale,'inProgress')}</span>}</td>
                  <td style={{ padding:'10px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <div style={{ width:'50px', height:'5px', background:'#1e293b', borderRadius:'3px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${log.endBattery||log.startBattery}%`, background:'#22c55e', borderRadius:'3px' }} />
                      </div>
                      <span style={{ fontSize:'11px', color:'#94a3b8' }}>{log.startBattery}%{log.endBattery?`→${log.endBattery}%`:''}</span>
                    </div>
                  </td>
                  <td style={{ padding:'10px 14px', fontSize:'12px', color:'#22c55e', fontWeight:600 }}>{log.kwhDelivered?`${log.kwhDelivered}`:'—'}</td>
                  <td style={{ padding:'10px 14px', fontSize:'12px', color:'#94a3b8' }}>{log.stationId}</td>
                  <td style={{ padding:'10px 14px', fontSize:'12px', color:'#f59e0b' }}>{log.cost?formatCurrency(log.cost):'—'}</td>
                  <td style={{ padding:'10px 14px', fontSize:'12px', color:'#94a3b8' }}>{log.operator.name||log.operator.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length===0 && <div style={{ textAlign:'center', padding:'3rem', color:'#475569', fontSize:'13px' }}>No charging logs found</div>}
        </div>
      </div>

      {modal && <LogModal trucks={trucks} locale={locale} onClose={()=>setModal(false)} onSuccess={()=>{setModal(false);load()}} />}
      {upload && <UploadModal trucks={trucks} locale={locale} onClose={()=>setUpload(false)} onSuccess={()=>{setUpload(false);load()}} onTemplate={downloadTemplate} />}
    </div>
  )
}

function LogModal({ trucks, locale, onClose, onSuccess }: any) {
  const [form, setForm] = useState({ truckId:'', startTime:'', endTime:'', startBattery:'', endBattery:'', kwhDelivered:'', stationId:'', cost:'', notes:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const payload = { truckId:form.truckId, startTime:form.startTime, endTime:form.endTime||null, startBattery:parseInt(form.startBattery), endBattery:form.endBattery?parseInt(form.endBattery):null, kwhDelivered:form.kwhDelivered?parseFloat(form.kwhDelivered):null, stationId:form.stationId, cost:form.cost?parseFloat(form.cost):null, notes:form.notes||null }
    const res = await fetch('/api/charging',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    if (res.ok) onSuccess(); else { const d=await res.json(); setError(d.error||'Failed'); setLoading(false) }
  }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' }}>
      <div style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', padding:'1.5rem', width:'100%', maxWidth:'480px', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.25rem' }}>
          <h2 style={{ fontSize:'16px', fontWeight:700, color:'#f8fafc', margin:0 }}>{t(locale,'logChargingSession')}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>
        {error && <div style={{ background:'rgba(239,68,68,0.1)', borderRadius:'8px', padding:'8px', color:'#f87171', fontSize:'12px', marginBottom:'1rem' }}>{error}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom:'0.875rem' }}>
            <label style={lbl}>{t(locale,'truck')}</label>
            <select style={{...inp,appearance:'none' as any}} value={form.truckId} onChange={e=>setForm({...form,truckId:e.target.value})} required>
              <option value="">{t(locale,'selectTruck')}</option>
              {trucks.map((tr:any)=><option key={tr.id} value={tr.id} style={{background:'#1e293b'}}>{tr.truckId} — {tr.model}</option>)}
            </select>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'0.875rem' }}>
            <div><label style={lbl}>{t(locale,'startTime')}</label><input style={inp} type="datetime-local" value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})} required /></div>
            <div><label style={lbl}>{t(locale,'endTime')}</label><input style={inp} type="datetime-local" value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})} /></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'0.875rem' }}>
            <div><label style={lbl}>{t(locale,'startBattery')}</label><input style={inp} type="number" min="0" max="100" value={form.startBattery} onChange={e=>setForm({...form,startBattery:e.target.value})} placeholder="20" required /></div>
            <div><label style={lbl}>{t(locale,'endBattery')}</label><input style={inp} type="number" min="0" max="100" value={form.endBattery} onChange={e=>setForm({...form,endBattery:e.target.value})} placeholder="90" /></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'0.875rem' }}>
            <div><label style={lbl}>{t(locale,'kwhDelivered')}</label><input style={inp} type="number" step="0.1" value={form.kwhDelivered} onChange={e=>setForm({...form,kwhDelivered:e.target.value})} placeholder="150" /></div>
            <div><label style={lbl}>{t(locale,'stationId')}</label><input style={inp} value={form.stationId} onChange={e=>setForm({...form,stationId:e.target.value})} placeholder="CS-01" required /></div>
            <div><label style={lbl}>{t(locale,'cost')} ($)</label><input style={inp} type="number" step="0.01" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} placeholder="0.00" /></div>
          </div>
          <div style={{ marginBottom:'1.25rem' }}><label style={lbl}>{t(locale,'notes')}</label><input style={inp} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} /></div>
          <button type="submit" disabled={loading} style={{ width:'100%', padding:'10px', background:'#2563eb', border:'none', borderRadius:'9px', color:'#fff', fontSize:'13px', fontWeight:600, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1 }}>
            {loading ? t(locale,'saving') : t(locale,'logSessionBtn')}
          </button>
        </form>
      </div>
    </div>
  )
}

function UploadModal({ trucks, locale, onClose, onSuccess, onTemplate }: any) {
  const [file, setFile] = useState<File|null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const truckMap = Object.fromEntries(trucks.map((tr:any) => [tr.truckId, tr.id]))

  const parseFile = (f: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer)
      const wb = XLSX.read(data, { type:'array', cellDates:true })
      const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { raw:false })
      const errs: string[] = []
      const parsed = rows.map((row, i) => {
        const tid = row.truckId || ''
        const dbId = truckMap[tid]
        if (!dbId) errs.push(`Row ${i+2}: Unknown truckId "${tid}"`)
        return { truckId:dbId||'', startTime:row.startTime||'', endTime:row.endTime||null, startBattery:parseInt(row.startBattery||'0')||0, endBattery:row.endBattery?parseInt(row.endBattery):null, kwhDelivered:row.kwhDelivered?parseFloat(row.kwhDelivered):null, stationId:row.stationId||'CS-00', cost:row.cost?parseFloat(row.cost):null, notes:row.notes||null, _tid:tid, _valid:!!dbId }
      })
      setPreview(parsed); setErrors(errs)
    }
    reader.readAsArrayBuffer(f)
  }

  const handleUpload = async () => {
    const valid = preview.filter(r => r._valid)
    if (!valid.length) return
    setLoading(true)
    const payload = valid.map(({ _tid, _valid, ...rest }) => rest)
    const res = await fetch('/api/charging',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    if (res.ok) { setDone(true); setTimeout(onSuccess, 1200) } else setLoading(false)
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' }}>
      <div style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', padding:'1.5rem', width:'100%', maxWidth:'560px', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.25rem' }}>
          <h2 style={{ fontSize:'16px', fontWeight:700, color:'#f8fafc', margin:0 }}>{t(locale,'importChargingData')}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>
        <button onClick={onTemplate} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'7px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'8px', color:'#94a3b8', fontSize:'12px', cursor:'pointer', marginBottom:'1rem' }}>
          ⬇ {t(locale,'downloadTemplate')}
        </button>

        {done ? (
          <div style={{ textAlign:'center', padding:'2rem' }}>
            <div style={{ fontSize:'40px', marginBottom:'0.75rem' }}>✅</div>
            <p style={{ fontSize:'15px', fontWeight:600, color:'#f8fafc' }}>{t(locale,'importSuccessful')}</p>
          </div>
        ) : !file ? (
          <div onClick={() => fileRef.current?.click()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f){setFile(f);parseFile(f)}}} onDragOver={e=>e.preventDefault()}
            style={{ border:'2px dashed rgba(255,255,255,0.08)', borderRadius:'12px', padding:'2.5rem', textAlign:'center', cursor:'pointer' }}>
            <div style={{ fontSize:'32px', marginBottom:'0.75rem' }}>📊</div>
            <p style={{ fontSize:'13px', color:'#64748b', margin:0 }}>{t(locale,'dropExcelHere')}</p>
            <p style={{ fontSize:'11px', color:'#334155', margin:'4px 0 0' }}>{t(locale,'xlsxFiles')}</p>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display:'none' }} onChange={e=>{const f=e.target.files?.[0];if(f){setFile(f);parseFile(f)}}} />
          </div>
        ) : (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.875rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontSize:'13px', color:'#f8fafc' }}>{file.name}</span>
                <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'5px', background:errors.length?'rgba(245,158,11,0.1)':'rgba(34,197,94,0.1)', color:errors.length?'#f59e0b':'#22c55e' }}>{t(locale,'validRows',{count:preview.filter(r=>r._valid).length})}</span>
              </div>
              <button onClick={()=>{setFile(null);setPreview([]);setErrors([])}} style={{ fontSize:'11px', color:'#64748b', background:'none', border:'none', cursor:'pointer' }}>{t(locale,'changeFile')}</button>
            </div>
            {errors.length>0 && <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'9px', padding:'10px', marginBottom:'0.875rem' }}>
              {errors.slice(0,3).map((e,i)=><p key={i} style={{ fontSize:'11px', color:'#f59e0b', margin:'2px 0' }}>{e}</p>)}
            </div>}
            <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'9px', overflow:'hidden', maxHeight:'180px', overflowY:'auto', marginBottom:'1rem' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'11px' }}>
                <thead><tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['Truck','Start','kWh','Station','✓'].map(h=><th key={h} style={{ padding:'6px 10px', textAlign:'left', color:'#475569' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {preview.map((row,i)=>(
                    <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', background:row._valid?'transparent':'rgba(239,68,68,0.05)' }}>
                      <td style={{ padding:'5px 10px', color:'#f8fafc' }}>{row._tid}</td>
                      <td style={{ padding:'5px 10px', color:'#94a3b8' }}>{String(row.startTime).slice(0,16)}</td>
                      <td style={{ padding:'5px 10px', color:'#22c55e' }}>{row.kwhDelivered||'—'}</td>
                      <td style={{ padding:'5px 10px', color:'#94a3b8' }}>{row.stationId}</td>
                      <td style={{ padding:'5px 10px' }}>{row._valid?'✅':'❌'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={handleUpload} disabled={loading||!preview.filter(r=>r._valid).length}
              style={{ width:'100%', padding:'10px', background:'#2563eb', border:'none', borderRadius:'9px', color:'#fff', fontSize:'13px', fontWeight:600, cursor:(loading||!preview.filter(r=>r._valid).length)?'not-allowed':'pointer', opacity:(loading||!preview.filter(r=>r._valid).length)?0.6:1 }}>
              {loading ? t(locale,'importing') : t(locale,'importRecords',{count:preview.filter(r=>r._valid).length})}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
