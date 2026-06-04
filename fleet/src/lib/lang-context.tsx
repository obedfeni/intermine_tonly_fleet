'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { type Locale } from './i18n'

interface LangContextType {
  locale: Locale
  setLocale: (l: Locale) => void
}

const LangContext = createContext<LangContextType>({ locale: 'en', setLocale: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('tonly-locale') as Locale
    if (saved === 'en' || saved === 'zh') setLocaleState(saved)
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('tonly-locale', l)
  }

  return <LangContext.Provider value={{ locale, setLocale }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
