'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS: Record<string, string> = {
  ACTIVE: '#22c55e', MAINTENANCE: '#f59e0b', CHARGING: '#3b82f6', FAULTY: '#ef4444', IDLE: '#6b7280',
}

const LABELS: Record<string, string> = {
  ACTIVE: 'Active', MAINTENANCE: 'Maintenance', CHARGING: 'Charging', FAULTY: 'Faulty', IDLE: 'Idle',
}

interface TruckStatusChartProps {
  data: { name: string; value: number }[]
  locale?: string
}

export function TruckStatusChart({ data, locale = 'en' }: TruckStatusChartProps) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' }}>
      <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', margin: '0 0 1rem' }}>
        {locale === 'zh' ? '车辆状态分布' : 'Truck Status Distribution'}
      </h3>
      <div style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
              {data.map((entry, i) => <Cell key={i} fill={COLORS[entry.name] || '#6b7280'} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
              formatter={(v: any, n: any) => [v, LABELS[n] || n]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
        {data.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#94a3b8' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[d.name] }} />
            {LABELS[d.name] || d.name} ({d.value})
          </div>
        ))}
      </div>
    </div>
  )
}
