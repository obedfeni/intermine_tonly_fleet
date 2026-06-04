'use client'
import { ReactNode, useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: string
}

export function Modal({ open, onClose, title, children, maxWidth = '480px' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.5rem', width: '100%', maxWidth, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '22px', lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
