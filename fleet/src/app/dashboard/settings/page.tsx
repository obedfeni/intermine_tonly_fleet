'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { type Locale } from '../../../lib/i18n'
import { ROLE_LABELS } from '../../../lib/roles'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [locale, setLocale] = useState<Locale>('en')
  const [saved, setSaved] = useState(false)
  const user = session?.user as any

  useEffect(() => {
    const s = localStorage.getItem('tonly-locale') as Locale
    if (s === 'en' || s === 'zh') setLocale(s)
  }, [])

  const saveLanguage = (l: Locale) => {
    setLocale(l)
    localStorage.setItem('tonly-locale', l)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const label = (en: string, zh: string) => locale === 'zh' ? zh : en

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>
        {label('Settings', '设置')}
      </h1>
      <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 2rem' }}>
        {label('Manage your account and preferences', '管理账户和偏好设置')}
      </p>

      {/* Account info */}
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', margin: '0 0 1.25rem' }}>{label('Account', '账户信息')}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '20px' }}>
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>{user?.name || '—'}</p>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>{user?.email}</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            [label('Role', '角色'), ROLE_LABELS[user?.role] || user?.role],
            [label('Email', '邮箱'), user?.email || '—'],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px' }}>
              <p style={{ fontSize: '11px', color: '#475569', margin: '0 0 3px' }}>{k}</p>
              <p style={{ fontSize: '13px', color: '#f8fafc', margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', margin: '0 0 1rem' }}>{label('Language', '语言')}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[{ value: 'en' as Locale, label: 'English', flag: '🇬🇧' }, { value: 'zh' as Locale, label: '中文 (Chinese)', flag: '🇨🇳' }].map(opt => (
            <button key={opt.value} onClick={() => saveLanguage(opt.value)}
              style={{ flex: 1, padding: '12px', background: locale === opt.value ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${locale === opt.value ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', color: locale === opt.value ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: locale === opt.value ? 600 : 400, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{opt.flag}</span>{opt.label}
              {locale === opt.value && <span style={{ marginLeft: 'auto', fontSize: '11px' }}>✓</span>}
            </button>
          ))}
        </div>
        {saved && <p style={{ fontSize: '12px', color: '#22c55e', margin: '10px 0 0' }}>✓ {label('Language saved', '语言已保存')}</p>}
      </div>

      {/* System info */}
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', margin: '0 0 1rem' }}>{label('System', '系统信息')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '12px' }}>
          {[
            [label('Application', '应用'), 'Tonly Fleet v1.0.0'],
            [label('Framework', '框架'), 'Next.js 14'],
            [label('Database', '数据库'), 'PostgreSQL (Supabase)'],
            [label('Fleet Size', '车队规模'), '20 EV Trucks'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ color: '#64748b' }}>{k}</span>
              <span style={{ color: '#94a3b8' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
