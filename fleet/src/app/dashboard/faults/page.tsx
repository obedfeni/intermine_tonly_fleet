'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { hasPermission } from '../../../lib/roles'
import { t, type Locale } from '../../../lib/i18n'
import { formatDate } from '../../../lib/utils'

const SVC: Record<string,string> = { LOW:'#3b82f6', MEDIUM:'#f59e0b', HIGH:'#f97316', CRITICAL:'#ef4444' }
const STC: Record<string,string> = { OPEN:'#ef4444', IN_PROGRESS:'#f59e0b', RESOLVED:'#22c55e' }
const inp = { padding:'8px 12px', background:'#1e293b', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#f8fafc', fontSize:'13px', outline:'none' } as const

export default function FaultsPage() {
  const { data: session } = useSession()
  const [faults, setFaults] = useState<any[]>([])
  const [trucks, setTrucks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [filter, setFilter] = useState({ severity:'', status:'' })
  const [locale, setLocale] = useState<Locale>('en')
  const role = (session?.user as any)?.role || ''
  const canReport = hasPermission(role, 'faults:report')
  const canUpdate = ['SUPERVISOR','TECHNICIAN'].includes(role)

  const load = () => fetch('/api/faults').then(r => r.json()).then(d => { setFaults(d); setLoading(false) })
  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocale(saved)
    load()
    fetch('/api/trucks').then(r => r.json()).then(setTrucks)
  }, [])

  const filtered = faults.filter(f => (!filter.severity || f.severity === filter.severity) && (!filter.status || f.status === filter.status))
  const update = async (id: string, status: string) => { await fetch('/api/faults',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})}); load() }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'#f8fafc', margin:'0 0 4px' }}>{t(locale,'faultReports')}</h1>
          <p style={{ fontSize:'13px', color:'#475569', margin:0 }}>{t(locale,'trackFaults')}</p>
        </div>
        {canReport && <button onClick={() => setModal(true)} style={{ padding:'9px 16px', background:'#2563eb', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>+ {t(locale,'reportFault')}</button>}
      </div>

      <div style={{ display:'flex', gap:'10px', marginBottom:'1rem', alignItems:'center' }}>
        <span style={{ fontSize:'12px', color:'#475569' }}>{t(locale,'filter')}</span>
        <select value={filter.severity} onChange={e => setFilter({...filter,severity:e.target.value})} style={inp}>
          <option value="">{t(locale,'allSeverities')}</option>
          {['LOW','MEDIUM','HIGH','CRITICAL'].map(s=><option key={s} value={s}>{t(locale,s as any)}</option>)}
        </select>
        <select value={filter.status} onChange={e => setFilter({...filter,status:e.target.value})} style={inp}>
          <option value="">{t(locale,'allStatuses')}</option>
          {['OPEN','IN_PROGRESS','RESOLVED'].map(s=><option key={s} value={s}>{t(locale,s as any)}</option>)}
        </select>
        <span style={{ fontSize:'12px', color:'#475569', marginLeft:'auto' }}>{t(locale,'faultsCount',{count:filtered.length,total:faults.length})}</span>
      </div>

      <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                {[t(locale,'truck'),t(locale,'fault'),t(locale,'severity'),t(locale,'status'),t(locale,'reporter'),t(locale,'date'),canUpdate?t(locale,'actions'):''].filter(Boolean).map(h=>(
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'11px', color:'#475569', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'#475569', fontSize:'13px' }}>{t(locale,'loading')}</td></tr>
              : filtered.map(f => (
                <tr key={f.id} onClick={() => setSelected(f)} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer' }}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td style={{ padding:'10px 14px' }}>
                    <p style={{ fontSize:'12px', fontWeight:700, color:'#f8fafc', margin:0 }}>{f.truck.truckId}</p>
                    <p style={{ fontSize:'11px', color:'#475569', margin:0 }}>{f.truck.model}</p>
                  </td>
                  <td style={{ padding:'10px 14px', maxWidth:'200px' }}>
                    <p style={{ fontSize:'12px', color:'#f8fafc', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.title}</p>
                  </td>
                  <td style={{ padding:'10px 14px' }}><span style={{ fontSize:'10px', padding:'3px 8px', borderRadius:'5px', background:`${SVC[f.severity]}20`, color:SVC[f.severity], fontWeight:600 }}>{t(locale,f.severity as any)}</span></td>
                  <td style={{ padding:'10px 14px' }}><span style={{ fontSize:'10px', padding:'3px 8px', borderRadius:'5px', background:`${STC[f.status]}20`, color:STC[f.status] }}>{t(locale,f.status as any)}</span></td>
                  <td style={{ padding:'10px 14px', fontSize:'12px', color:'#94a3b8' }}>{f.reporter.name||f.reporter.email}</td>
                  <td style={{ padding:'10px 14px', fontSize:'11px', color:'#475569' }}>{new Date(f.createdAt).toLocaleDateString()}</td>
                  {canUpdate && <td style={{ padding:'10px 14px' }} onClick={e=>e.stopPropagation()}>
                    <div style={{ display:'flex', gap:'4px' }}>
                      {f.status==='OPEN'&&<button onClick={()=>update(f.id,'IN_PROGRESS')} style={{ fontSize:'10px', padding:'3px 8px', background:'rgba(245,158,11,0.1)', color:'#f59e0b', border:'none', borderRadius:'5px', cursor:'pointer' }}>{t(locale,'start')}</button>}
                      {f.status!=='RESOLVED'&&<button onClick={()=>update(f.id,'RESOLVED')} style={{ fontSize:'10px', padding:'3px 8px', background:'rgba(34,197,94,0.1)', color:'#22c55e', border:'none', borderRadius:'5px', cursor:'pointer' }}>{t(locale,'resolve')}</button>}
                    </div>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length===0 && <div style={{ textAlign:'center', padding:'3rem', color:'#475569', fontSize:'13px' }}>{t(locale,'noFaultsFound')}</div>}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' }}>
          <div style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', padding:'1.5rem', width:'100%', maxWidth:'480px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
              <div><h2 style={{ fontSize:'16px', fontWeight:700, color:'#f8fafc', margin:0 }}>{selected.title}</h2><p style={{ fontSize:'12px', color:'#475569', margin:'3px 0 0' }}>{selected.truck.truckId} · {selected.truck.model}</p></div>
              <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'20px' }}>×</button>
            </div>
            <p style={{ fontSize:'13px', color:'#cbd5e1', marginBottom:'1rem' }}>{selected.description}</p>
            <div style={{ display:'flex', gap:'8px', marginBottom:'1rem' }}>
              <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'6px', background:`${SVC[selected.severity]}20`, color:SVC[selected.severity], border:`1px solid ${SVC[selected.severity]}30` }}>{t(locale,selected.severity)}</span>
              <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'6px', background:`${STC[selected.status]}20`, color:STC[selected.status] }}>{t(locale,selected.status)}</span>
            </div>
            <p style={{ fontSize:'12px', color:'#475569', marginBottom:'4px' }}>{t(locale,'reportedBy')}: {selected.reporter.name||selected.reporter.email}</p>
            <p style={{ fontSize:'12px', color:'#475569', marginBottom:'1rem' }}>{t(locale,'date')}: {formatDate(selected.createdAt)}</p>
            {canUpdate && selected.status!=='RESOLVED' && (
              <div style={{ display:'flex', gap:'8px' }}>
                {selected.status==='OPEN'&&<button onClick={()=>{update(selected.id,'IN_PROGRESS');setSelected({...selected,status:'IN_PROGRESS'})}} style={{ flex:1, padding:'9px', background:'rgba(245,158,11,0.15)', border:'none', borderRadius:'9px', color:'#f59e0b', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>{t(locale,'markInProgress')}</button>}
                <button onClick={()=>{update(selected.id,'RESOLVED');setSelected(null)}} style={{ flex:1, padding:'9px', background:'rgba(34,197,94,0.15)', border:'none', borderRadius:'9px', color:'#22c55e', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>{t(locale,'markResolved')}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {modal && <ReportModal trucks={trucks} locale={locale} onClose={()=>setModal(false)} onSuccess={()=>{setModal(false);load()}} />}
    </div>
  )
}

function ReportModal({ trucks, locale, onClose, onSuccess }: any) {
  const [form, setForm] = useState({ truckId:'', title:'', description:'', severity:'MEDIUM' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const SVC: Record<string,string> = { LOW:'#3b82f6', MEDIUM:'#f59e0b', HIGH:'#f97316', CRITICAL:'#ef4444' }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const res = await fetch('/api/faults',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    if (res.ok) onSuccess(); else { const d=await res.json(); setError(d.error||'Failed'); setLoading(false) }
  }
  const inp2 = { width:'100%', padding:'9px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#f8fafc', fontSize:'13px', outline:'none', boxSizing:'border-box' as const }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' }}>
      <div style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', padding:'1.5rem', width:'100%', maxWidth:'480px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.25rem' }}>
          <h2 style={{ fontSize:'16px', fontWeight:700, color:'#f8fafc', margin:0 }}>{t(locale,'reportNewFault')}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>
        {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', padding:'8px 12px', color:'#f87171', fontSize:'12px', marginBottom:'1rem' }}>{error}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom:'0.875rem' }}>
            <label style={{ display:'block', fontSize:'12px', color:'#94a3b8', marginBottom:'5px', fontWeight:500 }}>{t(locale,'truck')}</label>
            <select value={form.truckId} onChange={e=>setForm({...form,truckId:e.target.value})} style={{ ...inp2, appearance:'none' as any }} required>
              <option value="">{t(locale,'selectTruck')}</option>
              {trucks.map((tr:any)=><option key={tr.id} value={tr.id} style={{background:'#1e293b'}}>{tr.truckId} — {tr.model}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:'0.875rem' }}>
            <label style={{ display:'block', fontSize:'12px', color:'#94a3b8', marginBottom:'5px', fontWeight:500 }}>{t(locale,'faultTitle')}</label>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inp2} placeholder={t(locale,'faultTitlePlaceholder')} required />
          </div>
          <div style={{ marginBottom:'0.875rem' }}>
            <label style={{ display:'block', fontSize:'12px', color:'#94a3b8', marginBottom:'5px', fontWeight:500 }}>{t(locale,'description')}</label>
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{ ...inp2, height:'80px', resize:'none' }} placeholder={t(locale,'faultDescPlaceholder')} required />
          </div>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={{ display:'block', fontSize:'12px', color:'#94a3b8', marginBottom:'8px', fontWeight:500 }}>{t(locale,'severity')}</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'6px' }}>
              {['LOW','MEDIUM','HIGH','CRITICAL'].map(s=>(
                <button key={s} type="button" onClick={()=>setForm({...form,severity:s})} style={{ padding:'7px', borderRadius:'8px', border:`1px solid ${form.severity===s?SVC[s]+'50':'rgba(255,255,255,0.08)'}`, background:form.severity===s?`${SVC[s]}20`:'rgba(255,255,255,0.02)', color:form.severity===s?SVC[s]:'#64748b', cursor:'pointer', fontSize:'11px', fontWeight:form.severity===s?600:400 }}>{t(locale,s as any)}</button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width:'100%', padding:'10px', background:'#2563eb', border:'none', borderRadius:'9px', color:'#fff', fontSize:'13px', fontWeight:600, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1 }}>
            {loading ? t(locale,'submitting') : t(locale,'submitFaultReport')}
          </button>
        </form>
      </div>
    </div>
  )
}
