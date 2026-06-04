'use client'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { t, type Locale } from '../../lib/i18n'

const SC: Record<string, string> = { ACTIVE:'#22c55e', MAINTENANCE:'#f59e0b', CHARGING:'#3b82f6', FAULTY:'#ef4444', IDLE:'#6b7280' }
const SEV: Record<string, string> = { LOW:'#3b82f6', MEDIUM:'#f59e0b', HIGH:'#f97316', CRITICAL:'#ef4444' }
const TSC: Record<string, string> = { PENDING:'#6b7280', ASSIGNED:'#3b82f6', IN_PROGRESS:'#f59e0b', COMPLETED:'#22c55e', CANCELLED:'#ef4444' }

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tonly-locale') as Locale
      if (saved === 'en' || saved === 'zh') setLocale(saved)
    } catch {}
    fetch('/api/dashboard')
      .then(r => { if (!r.ok) throw new Error('API error'); return r.json() })
      .then(setData)
      .catch(e => setError(e.message))
  }, [])

  if (error) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:'12px' }}>
      <span style={{ fontSize:'32px' }}>⚠️</span>
      <p style={{ color:'#f87171', fontSize:'14px' }}>Failed to load dashboard: {error}</p>
      <p style={{ color:'#475569', fontSize:'12px' }}>Check your DATABASE_URL environment variable on Vercel</p>
      <button onClick={() => window.location.reload()} style={{ padding:'8px 16px', background:'#2563eb', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px' }}>Retry</button>
    </div>
  )

  if (!data) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', gap:'12px' }}>
      <div style={{ width:'20px', height:'20px', border:'2px solid rgba(59,130,246,0.3)', borderTopColor:'#3b82f6', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
      <p style={{ color:'#475569', fontSize:'14px' }}>{t(locale, 'loadingFleetData')}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const stats = data?.stats || {}
  const recentFaults = data?.recentFaults || []
  const recentTasks = data?.recentTasks || []
  const truckStatusDist = data?.truckStatusDist || []

  return (
    <div style={{ maxWidth:'1400px' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'#f8fafc', margin:'0 0 4px' }}>{t(locale,'fleetDashboard')}</h1>
      <p style={{ fontSize:'13px', color:'#475569', margin:'0 0 1.5rem' }}>{t(locale,'realtimeOverview')}</p>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.25rem' }}>
        {[
          { label: t(locale,'totalFleet'), value: stats.totalTrucks ?? 0, sub: `${stats.activeTrucks ?? 0} ${t(locale,'active')}` },
          { label: t(locale,'openFaults'), value: stats.openFaults ?? 0, sub: `${stats.criticalFaults ?? 0} ${t(locale,'critical')}` },
          { label: t(locale,'activeTasks'), value: stats.pendingTasks ?? 0, sub: t(locale,'inQueue') },
          { label: t(locale,'energyToday'), value: `${(stats.totalKwhToday ?? 0).toFixed(1)} kWh`, sub: `${stats.todayChargingSessions ?? 0} ${t(locale,'sessions')}` },
        ].map(card => (
          <div key={card.label} style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.25rem' }}>
            <p style={{ fontSize:'11px', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.6px', margin:0 }}>{card.label}</p>
            <p style={{ fontSize:'28px', fontWeight:700, color:'#f8fafc', margin:'6px 0 4px' }}>{card.value}</p>
            <p style={{ fontSize:'12px', color:'#475569', margin:0 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
        {[
          ['ACTIVE', stats.activeTrucks ?? 0],
          ['CHARGING', stats.chargingTrucks ?? 0],
          ['MAINTENANCE', stats.maintenanceTrucks ?? 0],
          ['FAULTY', stats.faultyTrucks ?? 0],
          ['IDLE', stats.idleTrucks ?? 0],
        ].map(([s, v]) => (
          <div key={s} style={{ background:`${SC[s as string]}15`, border:`1px solid ${SC[s as string]}30`, borderRadius:'12px', padding:'0.875rem', textAlign:'center' }}>
            <p style={{ fontSize:'22px', fontWeight:700, color:SC[s as string], margin:0 }}>{v}</p>
            <p style={{ fontSize:'11px', color:'#64748b', margin:'3px 0 0' }}>{t(locale, s as any)}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
        {/* Pie chart */}
        <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.25rem' }}>
          <h3 style={{ fontSize:'13px', fontWeight:600, color:'#f8fafc', margin:'0 0 1rem' }}>{t(locale,'truckStatusDist')}</h3>
          {truckStatusDist.length > 0 ? (
            <>
              <div style={{ height:'200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={truckStatusDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {truckStatusDist.map((e: any, i: number) => <Cell key={i} fill={SC[e.name] || '#6b7280'} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background:'#1e293b', border:'1px solid #334155', borderRadius:'8px', fontSize:'12px' }} formatter={(v:any, n:any) => [v, t(locale, n as any)]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'8px' }}>
                {truckStatusDist.map((d: any) => (
                  <div key={d.name} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', color:'#94a3b8' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:SC[d.name] }} />{t(locale, d.name as any)} ({d.value})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height:'200px', display:'flex', alignItems:'center', justifyContent:'center', color:'#334155', fontSize:'13px' }}>No truck data</div>
          )}
        </div>

        {/* Recent faults */}
        <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.25rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h3 style={{ fontSize:'13px', fontWeight:600, color:'#f8fafc', margin:0 }}>{t(locale,'recentFaults')}</h3>
            <a href="/dashboard/faults" style={{ fontSize:'11px', color:'#60a5fa', textDecoration:'none' }}>{t(locale,'viewAll')}</a>
          </div>
          {recentFaults.length === 0
            ? <p style={{ fontSize:'13px', color:'#334155', textAlign:'center', padding:'2rem 0' }}>{t(locale,'noFaultsReported')}</p>
            : recentFaults.slice(0,5).map((f: any) => (
              <div key={f.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px', background:'rgba(255,255,255,0.02)', borderRadius:'8px', marginBottom:'6px' }}>
                <span style={{ fontSize:'14px' }}>⚠️</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:'12px', color:'#f8fafc', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.title}</p>
                  <p style={{ fontSize:'11px', color:'#475569', margin:0 }}>{f.truck?.truckId} · {f.reporter?.name}</p>
                </div>
                <span style={{ fontSize:'10px', padding:'2px 7px', borderRadius:'5px', background:`${SEV[f.severity] || '#6b7280'}20`, color:SEV[f.severity] || '#6b7280', fontWeight:600 }}>{t(locale, f.severity as any)}</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Recent tasks */}
      <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.25rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
          <h3 style={{ fontSize:'13px', fontWeight:600, color:'#f8fafc', margin:0 }}>{t(locale,'activeTasks')}</h3>
          <a href="/dashboard/tasks" style={{ fontSize:'11px', color:'#60a5fa', textDecoration:'none' }}>{t(locale,'viewAll')}</a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem' }}>
          {recentTasks.length === 0
            ? <p style={{ fontSize:'13px', color:'#334155', gridColumn:'1/-1', textAlign:'center', padding:'1.5rem 0' }}>{t(locale,'noActiveTasks')}</p>
            : recentTasks.slice(0,6).map((task: any) => (
              <div key={task.id} style={{ padding:'10px', background:'rgba(255,255,255,0.02)', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'4px' }}>
                  <p style={{ fontSize:'12px', fontWeight:600, color:'#f8fafc', margin:0, flex:1, marginRight:'6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{task.title}</p>
                  <span style={{ fontSize:'9px', padding:'2px 6px', borderRadius:'4px', background:`${TSC[task.status] || '#6b7280'}20`, color:TSC[task.status] || '#6b7280', fontWeight:600, flexShrink:0 }}>{t(locale, task.status as any)}</span>
                </div>
                <p style={{ fontSize:'11px', color:'#475569', margin:0 }}>{task.truck?.truckId}{task.assignee ? ` · ${task.assignee.name}` : ''}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
