'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { t, type Locale } from '../../../lib/i18n'
import { ROLE_LABELS } from '../../../lib/roles'
import { formatDateShort } from '../../../lib/utils'

const ROLE_ICONS: Record<string,string> = { WORKER:'👷', TECHNICIAN:'🔧', SUPERVISOR:'👔', CHARGING_OPERATOR:'⚡' }
const ROLE_COLORS: Record<string,string> = { WORKER:'#6b7280', TECHNICIAN:'#3b82f6', SUPERVISOR:'#8b5cf6', CHARGING_OPERATOR:'#22c55e' }

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocale(saved)
    if ((session?.user as any)?.role !== 'SUPERVISOR') { window.location.href = '/dashboard'; return }
    fetch('/api/users').then(r => r.json()).then(d => { setUsers(d); setLoading(false) })
  }, [session])

  const filtered = users.filter(u => !filter || u.role === filter)
  const counts = Object.entries(ROLE_LABELS).map(([key, label]) => ({ key, label, count: users.filter(u => u.role === key).length }))

  return (
    <div>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'#f8fafc', margin:'0 0 4px' }}>{t(locale,'teamMembers')}</h1>
      <p style={{ fontSize:'13px', color:'#475569', margin:'0 0 1.25rem' }}>{t(locale,'allRegisteredUsers')}</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.875rem', marginBottom:'1.25rem' }}>
        {counts.map(({ key, label, count }) => (
          <button key={key} onClick={() => setFilter(filter === key ? '' : key)}
            style={{ background:filter===key?`${ROLE_COLORS[key]}15`:'#0f172a', border:`1px solid ${filter===key?ROLE_COLORS[key]+'40':'rgba(255,255,255,0.06)'}`, borderRadius:'12px', padding:'1rem', textAlign:'left', cursor:'pointer', transition:'all 0.15s' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}>
              <span style={{ fontSize:'18px' }}>{ROLE_ICONS[key]}</span>
              <span style={{ fontSize:'22px', fontWeight:700, color:'#f8fafc' }}>{count}</span>
            </div>
            <p style={{ fontSize:'12px', color:'#64748b', margin:0 }}>{label}s</p>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem', color:'#475569' }}>{t(locale,'loading')}</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'0.875rem' }}>
          {filtered.map(user => (
            <div key={user.id} style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.125rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'0.875rem' }}>
                <div style={{ width:'40px', height:'40px', background:`linear-gradient(135deg, ${ROLE_COLORS[user.role]}60, ${ROLE_COLORS[user.role]}30)`, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'15px', flexShrink:0 }}>
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:'13px', fontWeight:600, color:'#f8fafc', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name || '—'}</p>
                  <p style={{ fontSize:'11px', color:'#475569', margin:'2px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</p>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'11px', padding:'3px 9px', borderRadius:'6px', background:`${ROLE_COLORS[user.role]}15`, color:ROLE_COLORS[user.role], fontWeight:600, display:'flex', alignItems:'center', gap:'4px' }}>
                  {ROLE_ICONS[user.role]} {ROLE_LABELS[user.role]}
                </span>
                <span style={{ fontSize:'11px', color:'#334155' }}>{formatDateShort(user.createdAt)}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ color:'#475569', fontSize:'13px', gridColumn:'1/-1', textAlign:'center', padding:'3rem 0' }}>{t(locale,'noUsersFound')}</p>}
        </div>
      )}
    </div>
  )
}
