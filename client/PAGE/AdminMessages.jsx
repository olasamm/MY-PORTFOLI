import React, { useEffect, useState } from 'react'
import Toast from '../src/components/Toast'

export default function AdminMessages() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ message: '', type: 'info' })

  const api = (p) => (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${p}` : p)
  const token = () => localStorage.getItem('admin_token') || ''

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch(api('/api/contact'), { headers: { Authorization: `Bearer ${token()}` } })
      const d = await r.json()
      setItems(d.items || [])
    } catch {
      setToast({ message: 'Failed to load messages', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    try {
      const r = await fetch(api(`/api/contact/${id}/read`), { method: 'PUT', headers: { Authorization: `Bearer ${token()}` } })
      if (!r.ok) throw new Error()
      setItems((s) => s.map((x) => x._id === id ? { ...x, read: true } : x))
    } catch {
      setToast({ message: 'Failed to update', type: 'error' })
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h2 style={{ fontWeight: 800 }}>Admin - Messages</h2>
        {loading ? <p>Loading...</p> : (
          <div className="grid" style={{ gap: 12 }}>
            {items.map((m) => (
              <div key={m._id} className="card" style={{ opacity: m.read ? 0.7 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{m.name} · {m.email}</strong>
                  {!m.read && <button onClick={() => markRead(m._id)}>Mark read</button>}
                </div>
                <p style={{ marginTop: 8 }}>{m.message}</p>
                <div style={{ color: 'var(--color-muted)', fontSize: 12 }}>{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: 'info' })} />
    </section>
  )
}


