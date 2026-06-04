'use client'

interface KPIProps {
  label: string
  value: string | number
  sub?: string
  icon?: string
  color?: string
  trend?: { value: string; up: boolean }
}

export function KPI({ label, value, sub, icon, color = '#3b82f6', trend }: KPIProps) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', transition: 'border-color 0.15s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>{label}</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#f8fafc', margin: '6px 0 4px' }}>{value}</p>
          {sub && <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>{sub}</p>}
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: trend.up ? '#22c55e' : '#ef4444' }}>{trend.up ? '↑' : '↓'} {trend.value}</span>
            </div>
          )}
        </div>
        {icon && <span style={{ fontSize: '26px', opacity: 0.8 }}>{icon}</span>}
      </div>
    </div>
  )
}

export function KPIGrid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>{children}</div>
}
