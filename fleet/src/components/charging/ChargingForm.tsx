'use client'
import { useState } from 'react'

interface ChargingFormProps { trucks: any[]; onSuccess: () => void; onCancel: () => void }
const inp = { width:'100%', padding:'9px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#f8fafc', fontSize:'13px', outline:'none', boxSizing:'border-box' as const }
const lbl = { display:'block', fontSize:'12px', color:'#94a3b8', marginBottom:'5px', fontWeight:500 as const }

export function ChargingForm({ trucks, onSuccess, onCancel }: ChargingFormProps) {
  const [form, setForm] = useState({ truckId:'', startTime:'', endTime:'', startBattery:'', endBattery:'', kwhDelivered:'', stationId:'', cost:'', notes:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const payload = { truckId:form.truckId, startTime:form.startTime, endTime:form.endTime||null, startBattery:parseInt(form.startBattery), endBattery:form.endBattery?parseInt(form.endBattery):null, kwhDelivered:form.kwhDelivered?parseFloat(form.kwhDelivered):null, stationId:form.stationId, cost:form.cost?parseFloat(form.cost):null, notes:form.notes||null }
    const res = await fetch('/api/charging', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
    if (res.ok) onSuccess()
    else { const d=await res.json(); setError(d.error||'Failed'); setLoading(false) }
  }

  return (
    <form onSubmit={submit}>
      {error && <div style={{ background:'rgba(239,68,68,0.1)', borderRadius:'8px', padding:'8px', color:'#f87171', fontSize:'12px', marginBottom:'1rem' }}>{error}</div>}
      <div style={{ marginBottom:'0.875rem' }}>
        <label style={lbl}>Truck</label>
        <select style={{ ...inp, appearance:'none' as any }} value={form.truckId} onChange={e=>setForm({...form,truckId:e.target.value})} required>
          <option value="">Select truck</option>
          {trucks.map(tr=><option key={tr.id} value={tr.id} style={{background:'#1e293b'}}>{tr.truckId} — {tr.model}</option>)}
        </select>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'0.875rem' }}>
        <div><label style={lbl}>Start Time</label><input style={inp} type="datetime-local" value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})} required /></div>
        <div><label style={lbl}>End Time</label><input style={inp} type="datetime-local" value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})} /></div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'0.875rem' }}>
        <div><label style={lbl}>Start Battery (%)</label><input style={inp} type="number" min="0" max="100" value={form.startBattery} onChange={e=>setForm({...form,startBattery:e.target.value})} placeholder="20" required /></div>
        <div><label style={lbl}>End Battery (%)</label><input style={inp} type="number" min="0" max="100" value={form.endBattery} onChange={e=>setForm({...form,endBattery:e.target.value})} placeholder="90" /></div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'0.875rem' }}>
        <div><label style={lbl}>kWh Delivered</label><input style={inp} type="number" step="0.1" value={form.kwhDelivered} onChange={e=>setForm({...form,kwhDelivered:e.target.value})} placeholder="150" /></div>
        <div><label style={lbl}>Station ID</label><input style={inp} value={form.stationId} onChange={e=>setForm({...form,stationId:e.target.value})} placeholder="CS-01" required /></div>
        <div><label style={lbl}>Cost ($)</label><input style={inp} type="number" step="0.01" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} placeholder="0.00" /></div>
      </div>
      <div style={{ marginBottom:'1.25rem' }}><label style={lbl}>Notes</label><input style={inp} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} /></div>
      <div style={{ display:'flex', gap:'8px' }}>
        <button type="button" onClick={onCancel} style={{ flex:1, padding:'10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', color:'#94a3b8', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>Cancel</button>
        <button type="submit" disabled={loading} style={{ flex:1, padding:'10px', background:'#2563eb', border:'none', borderRadius:'9px', color:'#fff', cursor:loading?'not-allowed':'pointer', fontSize:'13px', fontWeight:600, opacity:loading?0.7:1 }}>
          {loading ? 'Saving...' : 'Log Session'}
        </button>
      </div>
    </form>
  )
}
