'use client'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { translations, t, type Locale } from '../../../lib/i18n'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [locale, setLocale] = useState<Locale>('en')
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocale(saved)
  }, [])

  const switchLang = (l: Locale) => { setLocale(l); localStorage.setItem('tonly-locale', l) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) { setError(t(locale, 'invalidCredentials')); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

        {/* Language switcher */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', marginRight: '4px' }}>🌐</span>
            {(['en', 'zh'] as Locale[]).map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{ padding: '4px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: locale === l ? '#2563eb' : 'transparent', color: locale === l ? '#fff' : '#94a3b8', transition: 'all 0.15s' }}>
                {l === 'en' ? 'EN' : '中文'}
              </button>
            ))}
          </div>
        </div>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '28px' }}>🚛</div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{t(locale, 'appName')}</h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{t(locale, 'appSubtitle')}</p>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px', color: '#f87171', fontSize: '13px', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '6px' }}>{t(locale, 'email')}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@tonly.com" required
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '6px' }}>{t(locale, 'password')}</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width: '100%', padding: '10px 40px 10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '16px' }}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
            {loading ? t(locale, 'signingIn') : t(locale, 'signIn')}
          </button>
        </form>

        {/* Demo accounts */}
        <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '12px' }}>
          <p style={{ fontSize: '11px', color: '#475569', textAlign: 'center', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t(locale, 'demoAccounts')}</p>
          {[['supervisor@tonly.com', 'Supervisor'], ['tech@tonly.com', 'Technician'], ['worker@tonly.com', 'Worker'], ['charger@tonly.com', 'Charging Op']].map(([em, role]) => (
            <div key={em} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', padding: '2px 0' }}>
              <span style={{ color: '#94a3b8' }}>{em}</span><span>password123</span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', marginTop: '1.25rem' }}>
          {t(locale, 'noAccount')}{' '}
          <Link href="/register" style={{ color: '#60a5fa', fontWeight: 500, textDecoration: 'none' }}>{t(locale, 'registerHere')}</Link>
        </p>
      </div>
    </div>
  )
}
