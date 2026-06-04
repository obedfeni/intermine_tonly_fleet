'use client'
import { useState } from 'react'

interface FaultFormProps {
  trucks: any[]
  onSuccess: () => void
  onCancel: () => void
}

const SVC: Record<string,string> = { LOW:'#3b82f6', MEDIUM:'#f59e0b', HIGH:'#f97316', CRITICAL:'#ef4444' }
const inp = { width:'100%', padding:'9px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#f8fafc', fontSize:'13px', outline:'none', boxSizing:'border-box' as const }
const lbl = { display:'block', fontSize:'12px', color:'#94a3b8', marginBottom:'5px', fontWeight:500 as const }

export function FaultForm({ trucks, onSuccess, onCancel }: FaultFormProps) {
  const [form, setForm] = useState({ truckId:'', title:'', description:'', severity:'MEDIUM' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const res = await fetch('/api/faults', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
    if (res.ok) onSuccess()
    else { const d = await res.json(); setError(d.error || 'Failed'); setLoading(false) }
  }

  return (
    <form onSubmit={submit}>
      {error && <div style={{ background:'rgba(239,68,68,0.1)', borderRadius:'8px', padding:'8px 12px', color:'#f87171', fontSize:'12px', marginBottom:'1rem' }}>{error}</div>}
      <div style={{ marginBottom:'0.875rem' }}>
        <label style={lbl}>Truck</label>
        <select style={{ ...inp, appearance:'none' as any }} value={form.truckId} onChange={e => setForm({...form,truckId:e.target.value})} required>
          <option value="">Select a truck</option>
          {trucks.map(tr => <option key={tr.id} value={tr.id} style={{background:'#1e293b'}}>{tr.truckId} — {tr.model}</option>)}
        </select>
      </div>
      <div style={{ marginBottom:'0.875rem' }}>
        <label style={lbl}>Fault Title</label>
        <input style={inp} value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="Brief description" required />
      </div>
      <div style={{ marginBottom:'0.875rem' }}>
        <label style={lbl}>Description</label>
        <textarea style={{ ...inp, height:'80px', resize:'none' }} value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Detailed fault description..." required />
      </div>
      <div style={{ marginBottom:'1.25rem' }}>
        <label style={lbl}>Severity</label>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'6px' }}>
          {['LOW','MEDIUM','HIGH','CRITICAL'].map(s => (
            <button key={s} type="button" onClick={() => setForm({...form,severity:s})}
              style={{ padding:'7px', borderRadius:'8px', border:`1px solid ${form.severity===s?SVC[s]+'50':'rgba(255,255,255,0.08)'}`, background:form.severity===s?`${SVC[s]}20`:'transparent', color:form.severity===s?SVC[s]:'#64748b', cursor:'pointer', fontSize:'11px', fontWeight:form.severity===s?600:400 }}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:'8px' }}>
        <button type="button" onClick={onCancel} style={{ flex:1, padding:'10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#94a3b8', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>Cancel</button>
        <button type="submit" disabled={loading} style={{ flex:1, padding:'10px', background:'#2563eb', border:'none', borderRadius:'9px', color:'#fff', cursor:loading?'not-allowed':'pointer', fontSize:'13px', fontWeight:600, opacity:loading?0.7:1 }}>
          {loading ? 'Submitting...' : 'Submit Fault Report'}
        </button>
      </div>
    </form>
  )
}
