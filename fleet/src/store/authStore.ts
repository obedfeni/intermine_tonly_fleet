import { create } from 'zustand'
import type { AuthUser } from '../types/auth'

interface AuthStore {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  clearUser: () => void
}

// Simple in-memory store (session handled by NextAuth, this is for UI state)
let _user: AuthUser | null = null
const _listeners: Array<() => void> = []

function notifyListeners() { _listeners.forEach(fn => fn()) }

export const authStore = {
  getUser: () => _user,
  setUser: (user: AuthUser | null) => { _user = user; notifyListeners() },
  clearUser: () => { _user = null; notifyListeners() },
  subscribe: (fn: () => void) => { _listeners.push(fn); return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1) } },
}
