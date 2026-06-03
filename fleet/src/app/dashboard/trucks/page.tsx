'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { t, type Locale } from '../../../lib/i18n'

const SC: Record<string,string> = { ACTIVE:'#22c55e', MAINTENANCE:'#f59e0b', CHARGING:'#3b82f6', FAULTY:'#ef4444', IDLE:'#6b7280' }
const ALL = ['ACTIVE','MAINTENANCE','CHARGING','FAULTY','IDLE']

export default function TrucksPage() {
  const { data: session } = useSession()
  const [trucks, setTrucks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [editTruck, setEditTruck] = useState<any>(null)
  const [locale, setLocale] = useState<Locale>('en')
  const isSup = (session?.user as any)?.role === 'SUPERVISOR'

  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocale(saved)
    fetch('/api/trucks').then(r => r.json()).then(d => { setTrucks(d); setLoading(false) })
  }, [])

  const filtered = trucks.filter(tr => {
    if (filter && tr.status !== filter) return false
    if (search && !tr.truckId.toLowerCase().includes(search.toLowerCase()) && !tr.model.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/trucks', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, status }) })
    if (res.ok) setTrucks(prev => prev.map(tr => tr.id === id ? { ...tr, status } : tr))
    setEditTruck(null)
  }

  if (loading) return <div style={{ textAlign:'center', padding:'4rem', color:'#475569' }}>{t(locale,'loading')}</div>

  return (
    <div>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'#f8fafc', margin:'0 0 4px' }}>{t(locale,'fleetTrucks')}</h1>
      <p style={{ fontSize:'13px', color:'#475569', margin:'0 0 1.25rem' }}>{t(locale,'managingTrucks', { count: trucks.length })}</p>

      <div style={{ display:'flex', gap:'10px', marginBottom:'1rem', flexWrap:'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t(locale,'searchTrucks')}
          style={{ padding:'8px 12px', background:'#1e293b', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#f8fafc', fontSize:'13px', outline:'none', width:'200px' }} />
        <select value={filter} onChange={e => setFilter(e.target.value)}
          style={{ padding:'8px 12px', background:'#1e293b', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#f8fafc', fontSize:'13px', outline:'none' }}>
          <option value="">{t(locale,'allStatus')}</option>
          {ALL.map(s => <option key={s} value={s}>{t(locale, s as any)}</option>)}
        </select>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {ALL.map(s => (
            <button key={s} onClick={() => setFilter(filter === s ? '' : s)}
              style={{ padding:'6px 12px', borderRadius:'8px', border:`1px solid ${filter===s?SC[s]+'50':'rgba(255,255,255,0.08)'}`, background:filter===s?`${SC[s]}15`:'transparent', color:filter===s?SC[s]:'#64748b', fontSize:'12px', cursor:'pointer', fontWeight:filter===s?600:400 }}>
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:SC[s], display:'inline-block', marginRight:'5px' }} />{t(locale, s as any)} ({trucks.filter(tr=>tr.status===s).length})
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:'1rem' }}>
        {filtered.map(truck => (
          <div key={truck.id} style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.125rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.875rem' }}>
              <div>
                <h3 style={{ fontSize:'17px', fontWeight:700, color:'#f8fafc', margin:0 }}>{truck.truckId}</h3>
                <p style={{ fontSize:'11px', color:'#64748b', margin:'2px 0 0' }}>{truck.model} · {truck.year}</p>
              </div>
              <div>
                <span style={{ fontSize:'10px', padding:'3px 8px', borderRadius:'6px', background:`${SC[truck.status]}15`, color:SC[truck.status], border:`1px solid ${SC[truck.status]}30`, fontWeight:600, display:'flex', alignItems:'center', gap:'4px' }}>
                  <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:SC[truck.status] }} />{t(locale, truck.status as any)}
                </span>
                {isSup && <button onClick={() => setEditTruck(truck)} style={{ fontSize:'10px', color:'#3b82f6', background:'none', border:'none', cursor:'pointer', marginTop:'3px', padding:0 }}>{t(locale,'changeStatus')}</button>}
              </div>
            </div>
            <div style={{ fontSize:'12px', color:'#64748b', display:'flex', flexDirection:'column', gap:'4px' }}>
              <span>🔋 {truck.batteryCapacity} kWh · 📍 {truck.licensePlate}</span>
              <span>📏 {truck.mileage.toLocaleString()} {t(locale,'km')}</span>
              <span>⚠️ {truck._count.faults} faults · 📋 {truck._count.tasks} tasks</span>
              {truck.location && <span>📌 {truck.location}</span>}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div style={{ textAlign:'center', padding:'4rem', color:'#475569' }}><p style={{ fontSize:'16px' }}>{t(locale,'noTrucksFound')}</p><p style={{ fontSize:'13px' }}>{t(locale,'adjustFilters')}</p></div>}

      {editTruck && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', padding:'1.5rem', width:'280px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <h3 style={{ fontSize:'14px', fontWeight:700, color:'#f8fafc', margin:0 }}>{editTruck.truckId}</h3>
              <button onClick={() => setEditTruck(null)} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'18px' }}>×</button>
            </div>
            {ALL.map(s => (
              <button key={s} onClick={() => updateStatus(editTruck.id, s)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'10px', background:editTruck.status===s?`${SC[s]}15`:'rgba(255,255,255,0.02)', border:`1px solid ${editTruck.status===s?SC[s]+'40':'rgba(255,255,255,0.05)'}`, borderRadius:'9px', color:editTruck.status===s?SC[s]:'#94a3b8', cursor:'pointer', marginBottom:'6px', fontSize:'13px' }}>
                <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:SC[s] }} />{t(locale, s as any)}{editTruck.status===s&&<span style={{ marginLeft:'auto', fontSize:'10px', opacity:0.7 }}>{t(locale,'current')}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
