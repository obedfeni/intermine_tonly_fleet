'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { t, type Locale } from '../../../lib/i18n'

const inp = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }
const lbl = { display: 'block', fontSize: '13px', fontWeight: 500 as const, color: '#cbd5e1', marginBottom: '6px' }

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'WORKER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [locale, setLocale] = useState<Locale>('en')
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocale(saved)
  }, [])

  const switchLang = (l: Locale) => { setLocale(l); localStorage.setItem('tonly-locale', l) }

  const roles = [
    { value: 'WORKER', label: t(locale, 'worker'), desc: t(locale, 'roleDescWorker') },
    { value: 'TECHNICIAN', label: t(locale, 'technician'), desc: t(locale, 'roleDescTechnician') },
    { value: 'SUPERVISOR', label: t(locale, 'supervisor'), desc: t(locale, 'roleDescSupervisor') },
    { value: 'CHARGING_OPERATOR', label: t(locale, 'chargingOperator'), desc: t(locale, 'roleDescChargingOperator') },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError(t(locale, 'passwordMismatch')); return }
    if (form.password.length < 6) { setError(t(locale, 'passwordTooShort')); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return }
      router.push('/login')
    } catch { setError('Something went wrong'); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', marginRight: '4px' }}>🌐</span>
            {(['en', 'zh'] as Locale[]).map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{ padding: '4px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: locale === l ? '#2563eb' : 'transparent', color: locale === l ? '#fff' : '#94a3b8' }}>
                {l === 'en' ? 'EN' : '中文'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '24px' }}>🚛</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{t(locale, 'createAccount')}</h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{t(locale, 'joinTeam')}</p>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px', color: '#f87171', fontSize: '13px', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={lbl}>{t(locale, 'fullName')}</label>
            <input style={inp} type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
          </div>
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={lbl}>{t(locale, 'email')}</label>
            <input style={inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@tonly.com" required />
          </div>
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={lbl}>{t(locale, 'role')}</label>
            <select style={{ ...inp, appearance: 'none' as const }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              {roles.map(r => <option key={r.value} value={r.value} style={{ background: '#0f172a' }}>{r.label}</option>)}
            </select>
            <p style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>{roles.find(r => r.value === form.role)?.desc}</p>
          </div>
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={lbl}>{t(locale, 'password')}</label>
            <input style={inp} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={lbl}>{t(locale, 'confirmPassword')}</label>
            <input style={inp} type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? t(locale, 'creatingAccount') : t(locale, 'createAccount')}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', marginTop: '1.25rem' }}>
          {t(locale, 'alreadyHaveAccount')}{' '}
          <Link href="/login" style={{ color: '#60a5fa', fontWeight: 500, textDecoration: 'none' }}>{t(locale, 'signIn')}</Link>
        </p>
      </div>
    </div>
  )
}
