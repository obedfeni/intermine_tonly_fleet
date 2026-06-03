'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { t, type Locale } from '../../../lib/i18n'
import { formatDateShort } from '../../../lib/utils'

const STC: Record<string,string> = { PENDING:'#6b7280', ASSIGNED:'#3b82f6', IN_PROGRESS:'#f59e0b', COMPLETED:'#22c55e', CANCELLED:'#ef4444' }
const PRC: Record<string,string> = { LOW:'#6b7280', MEDIUM:'#3b82f6', HIGH:'#f97316', URGENT:'#ef4444' }
const COLS = ['PENDING','ASSIGNED','IN_PROGRESS','COMPLETED']
const inp = { width:'100%', padding:'9px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#f8fafc', fontSize:'13px', outline:'none', boxSizing:'border-box' as const }

export default function TasksPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<any[]>([])
  const [trucks, setTrucks] = useState<any[]>([])
  const [technicians, setTechnicians] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [locale, setLocale] = useState<Locale>('en')
  const role = (session?.user as any)?.role || ''
  const isSup = role === 'SUPERVISOR'
  const isTech = role === 'TECHNICIAN'

  const load = () => fetch('/api/tasks').then(r => r.json()).then(d => { setTasks(d); setLoading(false) })
  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocale(saved)
    load()
    fetch('/api/trucks').then(r=>r.json()).then(setTrucks)
    fetch('/api/users?role=TECHNICIAN').then(r=>r.json()).then(setTechnicians)
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/tasks',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})})
    load(); if(selected?.id===id) setSelected(null)
  }

  const filtered = tasks.filter(t => !filterStatus || t.status === filterStatus)

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'#f8fafc', margin:'0 0 4px' }}>{t(locale,'taskManagement')}</h1>
          <p style={{ fontSize:'13px', color:'#475569', margin:0 }}>{t(locale,'scheduleAssign')}</p>
        </div>
        {isSup && <button onClick={()=>setModal(true)} style={{ padding:'9px 16px', background:'#2563eb', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>+ {t(locale,'createTask')}</button>}
      </div>

      <div style={{ display:'flex', gap:'10px', marginBottom:'1.25rem', alignItems:'center' }}>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
          style={{ padding:'7px 12px', background:'#1e293b', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#f8fafc', fontSize:'13px', outline:'none' }}>
          <option value="">{t(locale,'allStatuses')}</option>
          {['PENDING','ASSIGNED','IN_PROGRESS','COMPLETED','CANCELLED'].map(s=><option key={s} value={s}>{t(locale,s as any)}</option>)}
        </select>
        <span style={{ fontSize:'12px', color:'#475569', marginLeft:'auto' }}>{t(locale,'tasksCount',{count:filtered.length})}</span>
      </div>

      {/* Kanban */}
      {!filterStatus ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
          {COLS.map(col => {
            const colTasks = tasks.filter(t => t.status === col)
            return (
              <div key={col}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                  <span style={{ fontSize:'11px', padding:'3px 9px', borderRadius:'6px', background:`${STC[col]}15`, color:STC[col], border:`1px solid ${STC[col]}30`, fontWeight:600 }}>{t(locale,col as any)}</span>
                  <span style={{ fontSize:'11px', color:'#475569', background:'#1e293b', padding:'2px 8px', borderRadius:'6px' }}>{colTasks.length}</span>
                </div>
                <div style={{ minHeight:'80px' }}>
                  {colTasks.map(task => (
                    <div key={task.id} onClick={()=>setSelected(task)} style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'10px', marginBottom:'8px', cursor:'pointer' }}
                      onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,0.12)')}
                      onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,0.06)')}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'4px' }}>
                        <p style={{ fontSize:'12px', fontWeight:600, color:'#f8fafc', margin:0, flex:1, marginRight:'6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{task.title}</p>
                        <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:PRC[task.priority], flexShrink:0, marginTop:'3px' }} title={task.priority} />
                      </div>
                      <p style={{ fontSize:'11px', color:'#475569', margin:0 }}>{task.truck.truckId}</p>
                      {task.assignee && <p style={{ fontSize:'11px', color:'#475569', margin:'2px 0 0' }}>→ {task.assignee.name}</p>}
                      {task.scheduledAt && <p style={{ fontSize:'10px', color:'#334155', margin:'2px 0 0' }}>{formatDateShort(task.scheduledAt)}</p>}
                    </div>
                  ))}
                  {colTasks.length===0 && <div style={{ height:'60px', border:'1px dashed rgba(255,255,255,0.06)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', color:'#1e293b' }}>{t(locale,'empty')}</div>}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              {['Task','Truck','Priority','Assignee','Scheduled','Status'].map(h=><th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'11px', color:'#475569', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map(task=>(
                <tr key={task.id} onClick={()=>setSelected(task)} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer' }}>
                  <td style={{ padding:'10px 14px', fontSize:'12px', color:'#f8fafc' }}>{task.title}</td>
                  <td style={{ padding:'10px 14px', fontSize:'12px', color:'#94a3b8' }}>{task.truck.truckId}</td>
                  <td style={{ padding:'10px 14px' }}><span style={{ fontSize:'10px', fontWeight:700, color:PRC[task.priority] }}>{t(locale,task.priority as any)}</span></td>
                  <td style={{ padding:'10px 14px', fontSize:'12px', color:'#94a3b8' }}>{task.assignee?.name||'—'}</td>
                  <td style={{ padding:'10px 14px', fontSize:'11px', color:'#475569' }}>{task.scheduledAt?formatDateShort(task.scheduledAt):'—'}</td>
                  <td style={{ padding:'10px 14px' }}><span style={{ fontSize:'10px', padding:'3px 8px', borderRadius:'5px', background:`${STC[task.status]}15`, color:STC[task.status], border:`1px solid ${STC[task.status]}30` }}>{t(locale,task.status as any)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{ textAlign:'center', padding:'3rem', color:'#475569', fontSize:'13px' }}>{t(locale,'noTasksFound')}</div>}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' }}>
          <div style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', padding:'1.5rem', width:'100%', maxWidth:'480px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.875rem' }}>
              <div><h2 style={{ fontSize:'16px', fontWeight:700, color:'#f8fafc', margin:0 }}>{selected.title}</h2><p style={{ fontSize:'12px', color:'#475569', margin:'3px 0 0' }}>{selected.truck.truckId} · {t(locale,'createdBy')} {selected.creator?.name}</p></div>
              <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'20px' }}>×</button>
            </div>
            <p style={{ fontSize:'13px', color:'#cbd5e1', marginBottom:'1rem' }}>{selected.description}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'1rem' }}>
              {[
                [t(locale,'priority'), <span style={{color:PRC[selected.priority],fontWeight:700}}>{t(locale,selected.priority)}</span>],
                [t(locale,'status'), <span style={{color:STC[selected.status]}}>{t(locale,selected.status)}</span>],
                [t(locale,'assignee'), selected.assignee?.name||t(locale,'unassigned')],
                [t(locale,'scheduled'), selected.scheduledAt?formatDateShort(selected.scheduledAt):'—'],
              ].map(([label,val]:any,i)=>(
                <div key={i} style={{ background:'rgba(255,255,255,0.03)', borderRadius:'9px', padding:'10px' }}>
                  <p style={{ fontSize:'11px', color:'#475569', margin:'0 0 3px' }}>{label}</p>
                  <div style={{ fontSize:'13px', color:'#f8fafc' }}>{val}</div>
                </div>
              ))}
            </div>
            {(isSup||isTech) && !['COMPLETED','CANCELLED'].includes(selected.status) && (
              <div style={{ display:'flex', gap:'8px' }}>
                {['PENDING','ASSIGNED'].includes(selected.status) && <button onClick={()=>updateStatus(selected.id,'IN_PROGRESS')} style={{ flex:1, padding:'9px', background:'rgba(245,158,11,0.15)', border:'none', borderRadius:'9px', color:'#f59e0b', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>{t(locale,'startTask')}</button>}
                {selected.status==='IN_PROGRESS' && <button onClick={()=>updateStatus(selected.id,'COMPLETED')} style={{ flex:1, padding:'9px', background:'rgba(34,197,94,0.15)', border:'none', borderRadius:'9px', color:'#22c55e', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>{t(locale,'markComplete')}</button>}
                {isSup && <button onClick={()=>updateStatus(selected.id,'CANCELLED')} style={{ flex:1, padding:'9px', background:'rgba(239,68,68,0.1)', border:'none', borderRadius:'9px', color:'#f87171', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>{t(locale,'cancel')}</button>}
              </div>
            )}
          </div>
        </div>
      )}

      {modal && <CreateTaskModal trucks={trucks} technicians={technicians} locale={locale} onClose={()=>setModal(false)} onSuccess={()=>{setModal(false);load()}} />}
    </div>
  )
}

function CreateTaskModal({ trucks, technicians, locale, onClose, onSuccess }: any) {
  const [form, setForm] = useState({ truckId:'', title:'', description:'', priority:'MEDIUM', assignedTo:'', scheduledAt:'', notes:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/tasks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    if (res.ok) onSuccess(); else { const d=await res.json(); setError(d.error||'Failed'); setLoading(false) }
  }
  const lbl = { display:'block', fontSize:'12px', color:'#94a3b8', marginBottom:'5px', fontWeight:500 as const }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' }}>
      <div style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', padding:'1.5rem', width:'100%', maxWidth:'480px', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.25rem' }}>
          <h2 style={{ fontSize:'16px', fontWeight:700, color:'#f8fafc', margin:0 }}>{t(locale,'createTask')}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>
        {error && <div style={{ background:'rgba(239,68,68,0.1)', borderRadius:'8px', padding:'8px 12px', color:'#f87171', fontSize:'12px', marginBottom:'1rem' }}>{error}</div>}
        <form onSubmit={submit}>
          {[
            ['truck', t(locale,'truck'), <select style={{...inp,appearance:'none' as any}} value={form.truckId} onChange={e=>setForm({...form,truckId:e.target.value})} required><option value="">{t(locale,'selectTruck')}</option>{trucks.map((tr:any)=><option key={tr.id} value={tr.id} style={{background:'#1e293b'}}>{tr.truckId} — {tr.model}</option>)}</select>],
            ['title', t(locale,'taskTitle'), <input style={inp} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder={t(locale,'taskTitlePlaceholder')} required />],
            ['desc', t(locale,'description'), <textarea style={{...inp,height:'70px',resize:'none'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder={t(locale,'taskDescPlaceholder')} required />],
          ].map(([k,label,el]:any) => <div key={k} style={{ marginBottom:'0.875rem' }}><label style={lbl}>{label}</label>{el}</div>)}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'0.875rem' }}>
            <div><label style={lbl}>{t(locale,'priority')}</label>
              <select style={{...inp,appearance:'none' as any}} value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                {['LOW','MEDIUM','HIGH','URGENT'].map(p=><option key={p} value={p} style={{background:'#1e293b'}}>{t(locale,p as any)}</option>)}
              </select>
            </div>
            <div><label style={lbl}>{t(locale,'assignTo')}</label>
              <select style={{...inp,appearance:'none' as any}} value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})}>
                <option value="">{t(locale,'unassigned')}</option>
                {technicians.map((tech:any)=><option key={tech.id} value={tech.id} style={{background:'#1e293b'}}>{tech.name||tech.email}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:'0.875rem' }}><label style={lbl}>{t(locale,'scheduledDate')}</label><input style={inp} type="datetime-local" value={form.scheduledAt} onChange={e=>setForm({...form,scheduledAt:e.target.value})} /></div>
          <div style={{ marginBottom:'1.25rem' }}><label style={lbl}>{t(locale,'notes')} <span style={{color:'#334155'}}>({t(locale,'optional')})</span></label><input style={inp} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder={t(locale,'notesPlaceholder')} /></div>
          <button type="submit" disabled={loading} style={{ width:'100%', padding:'10px', background:'#2563eb', border:'none', borderRadius:'9px', color:'#fff', fontSize:'13px', fontWeight:600, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1 }}>
            {loading ? t(locale,'creating') : t(locale,'createTaskBtn')}
          </button>
        </form>
      </div>
    </div>
  )
}
