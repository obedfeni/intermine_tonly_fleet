interface DashboardState {
  stats: any | null
  lastUpdated: Date | null
  isLoading: boolean
}

let _state: DashboardState = { stats: null, lastUpdated: null, isLoading: false }
const _listeners: Array<() => void> = []

function notifyListeners() { _listeners.forEach(fn => fn()) }

export const dashboardStore = {
  getState: () => _state,

  setStats: (stats: any) => {
    _state = { stats, lastUpdated: new Date(), isLoading: false }
    notifyListeners()
  },

  setLoading: (isLoading: boolean) => {
    _state = { ..._state, isLoading }
    notifyListeners()
  },

  subscribe: (fn: () => void) => {
    _listeners.push(fn)
    return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1) }
  },

  isStale: () => {
    if (!_state.lastUpdated) return true
    return Date.now() - _state.lastUpdated.getTime() > 60000
  },
}
