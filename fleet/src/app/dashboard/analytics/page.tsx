'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { type Locale } from '../../../lib/i18n'

const SC: Record<string,string> = { ACTIVE:'#22c55e', MAINTENANCE:'#f59e0b', CHARGING:'#3b82f6', FAULTY:'#ef4444', IDLE:'#6b7280' }

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [trucks, setTrucks] = useState<any[]>([])
  const [charging, setCharging] = useState<any[]>([])
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocale(saved)
    fetch('/api/dashboard').then(r => r.json()).then(setData)
    fetch('/api/trucks').then(r => r.json()).then(setTrucks)
    fetch('/api/charging').then(r => r.json()).then(setCharging)
  }, [])

  if (!data) return <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>Loading analytics...</div>

  const { stats, truckStatusDist } = data

  // Build 7-day charging trend
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    const dayLogs = charging.filter(l => new Date(l.startTime).toDateString() === d.toDateString())
    return { date: dateStr, kwh: dayLogs.reduce((s: number, l: any) => s + (l.kwhDelivered || 0), 0), sessions: dayLogs.length }
  })

  // Mileage by model
  const modelMileage: Record<string, { total: number; count: number }> = {}
  trucks.forEach(t => {
    if (!modelMileage[t.model]) modelMileage[t.model] = { total: 0, count: 0 }
    modelMileage[t.model].total += t.mileage
    modelMileage[t.model].count++
  })
  const mileageData = Object.entries(modelMileage).map(([model, v]) => ({ model: model.replace('Tonly ', ''), avgMileage: Math.round(v.total / v.count) }))

  const utilization = stats.totalTrucks > 0 ? Math.round((stats.activeTrucks / stats.totalTrucks) * 100) : 0

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>
        {locale === 'zh' ? '数据分析' : 'Fleet Analytics'}
      </h1>
      <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 1.25rem' }}>
        {locale === 'zh' ? '车队运营数据概览' : 'Operational insights and fleet performance'}
      </p>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: locale === 'zh' ? '车队利用率' : 'Fleet Utilization', value: `${utilization}%`, icon: '📊', color: '#3b82f6' },
          { label: locale === 'zh' ? '总充电量' : 'Total kWh Charged', value: `${charging.reduce((s,l) => s+(l.kwhDelivered||0),0).toFixed(0)} kWh`, icon: '⚡', color: '#22c55e' },
          { label: locale === 'zh' ? '故障率' : 'Fault Rate', value: `${stats.totalTrucks > 0 ? Math.round((stats.faultyTrucks / stats.totalTrucks) * 100) : 0}%`, icon: '⚠️', color: '#ef4444' },
          { label: locale === 'zh' ? '充电次数' : 'Charging Sessions', value: charging.length, icon: '🔋', color: '#f59e0b' },
        ].map(card => (
          <div key={card.label} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{card.label}</p>
                <p style={{ fontSize: '26px', fontWeight: 700, color: card.color, margin: '6px 0 0' }}>{card.value}</p>
              </div>
              <span style={{ fontSize: '22px' }}>{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* 7-day charging trend */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', margin: '0 0 1rem' }}>
            {locale === 'zh' ? '7天充电趋势' : '7-Day Charging Trend'}
          </h3>
          <div style={{ height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                <Bar dataKey="kwh" fill="#3b82f6" radius={[4,4,0,0]} name="kWh" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status distribution */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', margin: '0 0 1rem' }}>
            {locale === 'zh' ? '车辆状态分布' : 'Fleet Status Distribution'}
          </h3>
          <div style={{ height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={truckStatusDist} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {truckStatusDist.map((e: any, i: number) => <Cell key={i} fill={SC[e.name] || '#6b7280'} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {truckStatusDist.map((d: any) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#94a3b8' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: SC[d.name] }} />{d.name}({d.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Average mileage by model */}
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', margin: '0 0 1rem' }}>
          {locale === 'zh' ? '各型号平均里程' : 'Average Mileage by Model'}
        </h3>
        <div style={{ height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mileageData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="model" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} formatter={(v: any) => [`${v.toLocaleString()} km`, 'Avg Mileage']} />
              <Bar dataKey="avgMileage" fill="#8b5cf6" radius={[4,4,0,0]} name="Avg Mileage" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
