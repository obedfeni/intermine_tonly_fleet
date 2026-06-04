'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChargingChartProps {
  data: { date: string; kwh: number; sessions: number }[]
  locale?: string
}

export function ChargingChart({ data, locale = 'en' }: ChargingChartProps) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' }}>
      <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', margin: '0 0 1rem' }}>
        {locale === 'zh' ? '充电趋势（7天）' : '7-Day Charging Trend'}
      </h3>
      <div style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
            <Bar dataKey="kwh" fill="#3b82f6" radius={[4, 4, 0, 0]} name="kWh" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
