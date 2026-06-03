'use client'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { t, type Locale } from '../../lib/i18n'

const SC: Record<string, string> = { ACTIVE:'#22c55e', MAINTENANCE:'#f59e0b', CHARGING:'#3b82f6', FAULTY:'#ef4444', IDLE:'#6b7280' }
const SEV: Record<string, string> = { LOW:'#3b82f6', MEDIUM:'#f59e0b', HIGH:'#f97316', CRITICAL:'#ef4444' }
const TSC: Record<string, string> = { PENDING:'#6b7280', ASSIGNED:'#3b82f6', IN_PROGRESS:'#f59e0b', COMPLETED:'#22c55e', CANCELLED:'#ef4444' }

function card(label: string, value: any, sub: string, color: string) {
  return (
    <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.25rem' }}>
      <p style={{ fontSize:'11px', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.6px', margin:0 }}>{label}</p>
      <p style={{ fontSize:'28px', fontWeight:700, color:'#f8fafc', margin:'6px 0 4px' }}>{value}</p>
      <p style={{ fontSize:'12px', color:'#475569', margin:0 }}>{sub}</p>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [locale, setLocale] = useState<Locale>('en')
  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocale(saved)
    fetch('/api/dashboard').then(r => r.json()).then(setData)
  }, [])

  if (!data) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color:'#475569' }}>{t(locale,'loadingFleetData')}</div>

  const { stats, recentFaults, recentTasks, truckStatusDist } = data
  return (
    <div style={{ maxWidth:'1400px' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'#f8fafc', margin:'0 0 4px' }}>{t(locale,'fleetDashboard')}</h1>
      <p style={{ fontSize:'13px', color:'#475569', margin:'0 0 1.5rem' }}>{t(locale,'realtimeOverview')}</p>

      {/* KPI */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.25rem' }}>
        {card(t(locale,'totalFleet'), stats.totalTrucks, `${stats.activeTrucks} ${t(locale,'active')}`, '#3b82f6')}
        {card(t(locale,'openFaults'), stats.openFaults, `${stats.criticalFaults} ${t(locale,'critical')}`, '#ef4444')}
        {card(t(locale,'activeTasks'), stats.pendingTasks, t(locale,'inQueue'), '#8b5cf6')}
        {card(t(locale,'energyToday'), `${stats.totalKwhToday.toFixed(1)} kWh`, `${stats.todayChargingSessions} ${t(locale,'sessions')}`, '#22c55e')}
      </div>

      {/* Status bar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
        {[['ACTIVE',stats.activeTrucks],['CHARGING',stats.chargingTrucks],['MAINTENANCE',stats.maintenanceTrucks],['FAULTY',stats.faultyTrucks],['IDLE',stats.idleTrucks]].map(([s,v])=>(
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
          <div style={{ height:'200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={truckStatusDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {truckStatusDist.map((e: any, i: number) => <Cell key={i} fill={SC[e.name] || '#6b7280'} />)}
                </Pie>
                <Tooltip contentStyle={{ background:'#1e293b', border:'1px solid #334155', borderRadius:'8px', fontSize:'12px' }} formatter={(v:any,n:any)=>[v,t(locale,n)]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'8px' }}>
            {truckStatusDist.map((d: any) => (
              <div key={d.name} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', color:'#94a3b8' }}>
                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:SC[d.name] }} />{t(locale,d.name)}({d.value})
              </div>
            ))}
          </div>
        </div>

        {/* Recent faults */}
        <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.25rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h3 style={{ fontSize:'13px', fontWeight:600, color:'#f8fafc', margin:0 }}>{t(locale,'recentFaults')}</h3>
            <a href="/dashboard/faults" style={{ fontSize:'11px', color:'#60a5fa', textDecoration:'none' }}>{t(locale,'viewAll')}</a>
          </div>
          {recentFaults.length === 0 ? <p style={{ fontSize:'13px', color:'#475569', textAlign:'center', padding:'2rem 0' }}>{t(locale,'noFaultsReported')}</p>
          : recentFaults.slice(0,5).map((f: any) => (
            <div key={f.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px', background:'rgba(255,255,255,0.02)', borderRadius:'8px', marginBottom:'6px' }}>
              <span style={{ fontSize:'14px' }}>⚠️</span>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:'12px', color:'#f8fafc', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.title}</p>
                <p style={{ fontSize:'11px', color:'#475569', margin:0 }}>{f.truck.truckId} · {f.reporter.name}</p>
              </div>
              <span style={{ fontSize:'10px', padding:'2px 7px', borderRadius:'5px', background:`${SEV[f.severity]}20`, color:SEV[f.severity], fontWeight:600 }}>{t(locale,f.severity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent tasks */}
      <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.25rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
          <h3 style={{ fontSize:'13px', fontWeight:600, color:'#f8fafc', margin:0 }}>{t(locale,'activeTasks')}</h3>
          <a href="/dashboard/tasks" style={{ fontSize:'11px', color:'#60a5fa', textDecoration:'none' }}>{t(locale,'viewAll')}</a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem' }}>
          {recentTasks.length === 0 ? <p style={{ fontSize:'13px', color:'#475569', gridColumn:'1/-1', textAlign:'center', padding:'1.5rem 0' }}>{t(locale,'noActiveTasks')}</p>
          : recentTasks.map((task: any) => (
            <div key={task.id} style={{ padding:'10px', background:'rgba(255,255,255,0.02)', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'4px' }}>
                <p style={{ fontSize:'12px', fontWeight:600, color:'#f8fafc', margin:0, flex:1, marginRight:'6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{task.title}</p>
                <span style={{ fontSize:'9px', padding:'2px 6px', borderRadius:'4px', background:`${TSC[task.status]}20`, color:TSC[task.status], fontWeight:600, flexShrink:0 }}>{t(locale,task.status)}</span>
              </div>
              <p style={{ fontSize:'11px', color:'#475569', margin:0 }}>{task.truck.truckId}{task.assignee ? ` · ${task.assignee.name}` : ''}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
