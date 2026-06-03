'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { t, type Locale } from '../../../lib/i18n'
import { formatDateShort } from '../../../lib/utils'

const STC: Record<string,string> = { PENDING:'#6b7280', ASSIGNED:'#3b82f6', IN_PROGRESS:'#f59e0b', COMPLETED:'#22c55e', CANCELLED:'#ef4444' }
const PRC: Record<string,string> = { LOW:'#6b7280', MEDIUM:'#3b82f6', HIGH:'#f97316', URGENT:'#ef4444' }

export default function MaintenancePage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocale(saved)
    fetch('/api/tasks').then(r => r.json()).then(d => { setTasks(d); setLoading(false) })
  }, [])

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  const counts = {
    all: tasks.length,
    PENDING: tasks.filter(t => t.status === 'PENDING').length,
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    COMPLETED: tasks.filter(t => t.status === 'COMPLETED').length,
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/tasks', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    fetch('/api/tasks').then(r => r.json()).then(setTasks)
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>
        {locale === 'zh' ? '维护管理' : 'Maintenance Management'}
      </h1>
      <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 1.25rem' }}>
        {locale === 'zh' ? '跟踪所有车辆维护任务' : 'Track all vehicle maintenance tasks'}
      </p>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.875rem', marginBottom: '1.25rem' }}>
        {[
          { key: 'all', label: locale === 'zh' ? '全部' : 'All Tasks', color: '#64748b' },
          { key: 'PENDING', label: locale === 'zh' ? '待处理' : 'Pending', color: STC.PENDING },
          { key: 'IN_PROGRESS', label: locale === 'zh' ? '进行中' : 'In Progress', color: STC.IN_PROGRESS },
          { key: 'COMPLETED', label: locale === 'zh' ? '已完成' : 'Completed', color: STC.COMPLETED },
        ].map(s => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            style={{ background: filter === s.key ? `${s.color}15` : '#0f172a', border: `1px solid ${filter === s.key ? s.color + '40' : 'rgba(255,255,255,0.06)'}`, borderRadius: '12px', padding: '1rem', textAlign: 'left', cursor: 'pointer' }}>
            <p style={{ fontSize: '22px', fontWeight: 700, color: s.color, margin: 0 }}>{(counts as any)[s.key]}</p>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>{s.label}</p>
          </button>
        ))}
      </div>

      {/* Tasks table */}
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Truck', 'Task', 'Priority', 'Assigned To', 'Scheduled', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#475569', fontSize: '13px' }}>Loading...</td></tr>
              ) : filtered.map(task => (
                <tr key={task.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{task.truck.truckId}</p>
                    <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>{task.truck.model}</p>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <p style={{ fontSize: '12px', color: '#f8fafc', margin: 0 }}>{task.title}</p>
                    <p style={{ fontSize: '11px', color: '#475569', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{task.description}</p>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: PRC[task.priority] }}>{task.priority}</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', color: '#94a3b8' }}>
                    {task.assignee?.name || '—'}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '11px', color: '#64748b' }}>
                    {task.scheduledAt ? formatDateShort(task.scheduledAt) : '—'}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '5px', background: `${STC[task.status]}15`, color: STC[task.status], border: `1px solid ${STC[task.status]}30` }}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {['PENDING', 'ASSIGNED'].includes(task.status) && (
                        <button onClick={() => updateStatus(task.id, 'IN_PROGRESS')}
                          style={{ fontSize: '10px', padding: '3px 8px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                          Start
                        </button>
                      )}
                      {task.status === 'IN_PROGRESS' && (
                        <button onClick={() => updateStatus(task.id, 'COMPLETED')}
                          style={{ fontSize: '10px', padding: '3px 8px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                          Done
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#475569', fontSize: '13px' }}>No maintenance tasks found</div>
          )}
        </div>
      </div>
    </div>
  )
}
