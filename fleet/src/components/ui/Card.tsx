'use client'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  action?: ReactNode
  padding?: string
}

export function Card({ children, title, subtitle, action, padding = '1.25rem' }: CardProps) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden' }}>
      {(title || action) && (
        <div style={{ padding: `${padding} ${padding} 0`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            {title && <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '12px', color: '#475569', margin: '3px 0 0' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div style={{ padding: title || action ? `0 ${padding} ${padding}` : padding }}>
        {children}
      </div>
    </div>
  )
}

export function StatCard({ label, value, sub, icon, color = '#3b82f6' }: { label: string; value: any; sub?: string; icon?: string; color?: string }) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>{label}</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#f8fafc', margin: '6px 0 4px' }}>{value}</p>
          {sub && <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>{sub}</p>}
        </div>
        {icon && <span style={{ fontSize: '24px' }}>{icon}</span>}
      </div>
    </div>
  )
}
