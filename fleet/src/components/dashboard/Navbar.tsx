'use client'
import { useState, useEffect } from 'react'
import { type Locale } from '../../lib/i18n'

export function Navbar({ user }: { user: { name?: string; email?: string; role: string } }) {
  const [locale, setLocale] = useState<Locale>('en')
  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocale(saved)
  }, [])
  const switchLang = (l: Locale) => { setLocale(l); localStorage.setItem('tonly-locale', l); window.location.reload() }

  return (
    <nav style={{ height: '52px', background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>Tonly Fleet</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,0.05)', padding: '3px', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', padding: '0 4px' }}>🌐</span>
          {(['en', 'zh'] as Locale[]).map(l => (
            <button key={l} onClick={() => switchLang(l)} style={{ padding: '3px 9px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600, background: locale === l ? '#2563eb' : 'transparent', color: locale === l ? '#fff' : '#94a3b8' }}>
              {l === 'en' ? 'EN' : '中文'}
            </button>
          ))}
        </div>
        <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '12px' }}>
          {(user.name || user.email || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </nav>
  )
}
