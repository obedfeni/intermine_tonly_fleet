'use client'
import { ReactNode } from 'react'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => ReactNode
  width?: string
}

interface TableProps {
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
  loading?: boolean
  emptyMessage?: string
}

export function Table({ columns, data, onRowClick, loading = false, emptyMessage = 'No data found' }: TableProps) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', width: col.width }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem', color: '#475569', fontSize: '13px' }}>Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem', color: '#475569', fontSize: '13px' }}>{emptyMessage}</td></tr>
            ) : data.map((row, i) => (
              <tr key={row.id || i}
                onClick={() => onRowClick?.(row)}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: onRowClick ? 'pointer' : 'default', transition: 'background 0.1s' }}
                onMouseEnter={e => onRowClick && (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '10px 14px', fontSize: '13px', color: '#f8fafc' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
