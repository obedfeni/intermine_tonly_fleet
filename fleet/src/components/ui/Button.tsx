'use client'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  fullWidth?: boolean
}

const variants: Record<string, any> = {
  primary: { background: '#2563eb', border: 'none', color: '#fff' },
  secondary: { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' },
  danger: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' },
  ghost: { background: 'transparent', border: 'none', color: '#64748b' },
}

const sizes: Record<string, any> = {
  sm: { padding: '5px 10px', fontSize: '12px', borderRadius: '7px' },
  md: { padding: '9px 16px', fontSize: '13px', borderRadius: '10px' },
  lg: { padding: '12px 20px', fontSize: '14px', borderRadius: '11px' },
}

export function Button({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled = false, fullWidth = false }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : 'auto',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'opacity 0.15s',
      }}
    >
      {children}
    </button>
  )
}
