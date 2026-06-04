'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { hasPermission, ROLE_LABELS, ROLE_COLORS } from '../lib/roles'
import { t, type Locale } from '../lib/i18n'
import { useState, useEffect } from 'react'

const navItems = [
  { href:'/dashboard',            icon:'📊', key:'dashboard'       as const, perm:'dashboard:view', exact:true  },
  { href:'/dashboard/trucks',     icon:'🚛', key:'fleetTrucks'     as const, perm:'trucks:view',    exact:false },
  { href:'/dashboard/faults',     icon:'⚠️', key:'faultReports'   as const, perm:'faults:view',    exact:false },
  { href:'/dashboard/tasks',      icon:'📋', key:'taskManagement'  as const, perm:'tasks:view',     exact:false },
  { href:'/dashboard/maintenance',icon:'🔧', label:'Maintenance',            perm:'tasks:view',     exact:false },
  { href:'/dashboard/charging',   icon:'⚡', key:'chargingLogs'   as const, perm:'charging:view',  exact:false },
  { href:'/dashboard/analytics',  icon:'📈', label:'Analytics',              perm:'dashboard:view', exact:false },
  { href:'/dashboard/users',      icon:'👥', key:'teamMembers'    as const, perm:'*',              exact:false, supervisorOnly:true },
  { href:'/dashboard/settings',   icon:'⚙️', label:'Settings',               perm:'dashboard:view', exact:false },
]

export function Sidebar({ user }: { user: { name?: string; email?: string; role?: string } }) {
  const pathname = usePathname()
  const [locale, setLocale] = useState<Locale>('en')
  const role = user?.role || 'WORKER'

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tonly-locale') as Locale
      if (saved === 'en' || saved === 'zh') setLocale(saved)
    } catch {}
  }, [])

  const getLabel = (item: any) => {
    if (item.key) return t(locale, item.key)
    const zh: Record<string,string> = { Maintenance:'维护管理', Analytics:'数据分析', Settings:'设置' }
    return locale === 'zh' ? (zh[item.label] || item.label) : item.label
  }

  return (
    <aside style={{ position:'fixed', left:0, top:0, height:'100%', width:'240px', background:'#0f172a', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', zIndex:50 }}>
      <div style={{ padding:'1.25rem', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ width:'38px', height:'38px', background:'linear-gradient(135deg,#2563eb,#4f46e5)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>🚛</div>
        <div>
          <div style={{ fontSize:'14px', fontWeight:700, color:'#f8fafc' }}>{t(locale,'appName')}</div>
          <div style={{ fontSize:'10px', color:'#475569' }}>EV Management</div>
        </div>
      </div>

      <nav style={{ flex:1, padding:'0.75rem', overflowY:'auto' }}>
        <p style={{ fontSize:'10px', fontWeight:600, color:'#334155', textTransform:'uppercase', letterSpacing:'0.8px', padding:'0 8px', marginBottom:'6px', marginTop:'4px' }}>
          {t(locale,'navigation')}
        </p>
        {navItems.map(item => {
          if ((item as any).supervisorOnly && role !== 'SUPERVISOR') return null
          if (!hasPermission(role, item.perm)) return null
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}
              style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 10px', borderRadius:'10px', marginBottom:'2px', textDecoration:'none', background:isActive?'rgba(37,99,235,0.15)':'transparent', border:isActive?'1px solid rgba(37,99,235,0.2)':'1px solid transparent', color:isActive?'#60a5fa':'#94a3b8', fontSize:'13px', fontWeight:isActive?600:400, transition:'all 0.15s' }}>
              <span style={{ fontSize:'14px', flexShrink:0 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{getLabel(item)}</span>
              {isActive && <span style={{ fontSize:'10px', color:'#3b82f6' }}>›</span>}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding:'0.75rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', background:'rgba(255,255,255,0.03)', borderRadius:'10px', marginBottom:'6px' }}>
          <div style={{ width:'32px', height:'32px', background:'linear-gradient(135deg,#2563eb,#4f46e5)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'13px', flexShrink:0 }}>
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:'12px', fontWeight:600, color:'#f8fafc', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name || user?.email || 'User'}</p>
            <span style={{ fontSize:'10px', padding:'1px 6px', borderRadius:'4px', background:'rgba(37,99,235,0.2)', color:'#93c5fd' }}>{ROLE_LABELS[role] || role}</span>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl:'/login' })}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:'8px', padding:'8px 10px', background:'none', border:'none', cursor:'pointer', color:'#f87171', fontSize:'13px', borderRadius:'8px' }}
          onMouseEnter={e=>(e.currentTarget.style.background='rgba(239,68,68,0.1)')}
          onMouseLeave={e=>(e.currentTarget.style.background='none')}>
          <span>🚪</span>{t(locale,'signOut')}
        </button>
      </div>
    </aside>
  )
}
