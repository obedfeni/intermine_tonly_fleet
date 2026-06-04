'use client'
import { useState } from 'react'

interface MaintenanceFormProps {
  trucks: any[]
  technicians: any[]
  onSuccess: () => void
  onCancel: () => void
}

const inp = { width:'100%', padding:'9px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#f8fafc', fontSize:'13px', outline:'none', boxSizing:'border-box' as const }
const lbl = { display:'block', fontSize:'12px', color:'#94a3b8', marginBottom:'5px', fontWeight:500 as const }

export function MaintenanceForm({ trucks, technicians, onSuccess, onCancel }: MaintenanceFormProps) {
  const [form, setForm] = useState({ truckId:'', title:'', description:'', priority:'MEDIUM', assignedTo:'', scheduledAt:'', notes:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const res = await fetch('/api/tasks', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
    if (res.ok) onSuccess()
    else { const d = await res.json(); setError(d.error || 'Failed'); setLoading(false) }
  }

  return (
    <form onSubmit={submit}>
      {error && <div style={{ background:'rgba(239,68,68,0.1)', borderRadius:'8px', padding:'8px 12px', color:'#f87171', fontSize:'12px', marginBottom:'1rem' }}>{error}</div>}
      <div style={{ marginBottom:'0.875rem' }}>
        <label style={lbl}>Truck</label>
        <select style={{ ...inp, appearance:'none' as any }} value={form.truckId} onChange={e=>setForm({...form,truckId:e.target.value})} required>
          <option value="">Select truck</option>
          {trucks.map(tr=><option key={tr.id} value={tr.id} style={{background:'#1e293b'}}>{tr.truckId} — {tr.model}</option>)}
        </select>
      </div>
      <div style={{ marginBottom:'0.875rem' }}>
        <label style={lbl}>Task Title</label>
        <input style={inp} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Battery inspection" required />
      </div>
      <div style={{ marginBottom:'0.875rem' }}>
        <label style={lbl}>Description</label>
        <textarea style={{ ...inp, height:'70px', resize:'none' }} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Task details..." required />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'0.875rem' }}>
        <div>
          <label style={lbl}>Priority</label>
          <select style={{ ...inp, appearance:'none' as any }} value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
            {['LOW','MEDIUM','HIGH','URGENT'].map(p=><option key={p} value={p} style={{background:'#1e293b'}}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Assign to</label>
          <select style={{ ...inp, appearance:'none' as any }} value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})}>
            <option value="">Unassigned</option>
            {technicians.map(t=><option key={t.id} value={t.id} style={{background:'#1e293b'}}>{t.name||t.email}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom:'0.875rem' }}>
        <label style={lbl}>Scheduled Date</label>
        <input style={inp} type="datetime-local" value={form.scheduledAt} onChange={e=>setForm({...form,scheduledAt:e.target.value})} />
      </div>
      <div style={{ marginBottom:'1.25rem' }}>
        <label style={lbl}>Notes <span style={{color:'#334155'}}>(optional)</span></label>
        <input style={inp} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Additional notes..." />
      </div>
      <div style={{ display:'flex', gap:'8px' }}>
        <button type="button" onClick={onCancel} style={{ flex:1, padding:'10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#94a3b8', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>Cancel</button>
        <button type="submit" disabled={loading} style={{ flex:1, padding:'10px', background:'#2563eb', border:'none', borderRadius:'9px', color:'#fff', cursor:loading?'not-allowed':'pointer', fontSize:'13px', fontWeight:600, opacity:loading?0.7:1 }}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
