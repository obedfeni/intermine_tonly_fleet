'use client'
import { useState, useEffect } from 'react'
import { t, type Locale, type TKey } from '../lib/i18n'

export function useLanguage() {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocaleState(saved)
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('tonly-locale', l)
  }

  const translate = (key: TKey, vars?: Record<string, string | number>) => t(locale, key, vars)

  return { locale, setLocale, t: translate }
}
