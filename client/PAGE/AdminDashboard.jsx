import React, { useEffect, useState } from 'react'
import Modal from '../src/components/Modal'
import Toast from '../src/components/Toast'

export default function AdminDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [confirm, setConfirm] = useState({ open: false, id: null })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', tags: '', link: '', imageUrl: '', status: 'draft' })
  const [editFile, setEditFile] = useState(null)

  const token = () => localStorage.getItem('admin_token') || ''
  const api = (path) => (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${path}` : path)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(api('/api/projects/all'), { headers: { Authorization: `Bearer ${token()}` } })
      const data = await res.json()
      setItems(data.projects || [])
    } catch (e) {
      setMsg('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const toggleStatus = async (id, status) => {
    try {
      const res = await fetch(api(`/api/projects/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error()
      await load()
    } catch {
      setMsg('Failed to update status')
    }
  }

  const remove = async (id) => {
    try {
      const res = await fetch(api(`/api/projects/${id}`), { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
      if (!res.ok) throw new Error()
      setItems((s) => s.filter((x) => x._id !== id))
      setToast({ message: 'Deleted', type: 'success' })
    } catch {
      setToast({ message: 'Failed to delete', type: 'error' })
    }
  }

  const startEdit = (p) => {
    setEditingId(p._id)
    setEditForm({
      title: p.title || '',
      description: p.description || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
      link: p.link || '',
      imageUrl: p.imageUrl || '',
      status: p.status || 'draft'
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditFile(null)
  }

  const saveEdit = async (id) => {
    try {
      const res = await fetch(api(`/api/projects/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          tags: editForm.tags,
          link: editForm.link,
          imageUrl: editForm.imageUrl,
          status: editForm.status
        })
      })
      if (!res.ok) throw new Error()
      if (editFile) {
        const fd = new FormData()
        fd.append('image', editFile)
        const ir = await fetch(api(`/api/projects/${id}/image`), {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token()}` },
          body: fd
        })
        if (!ir.ok) throw new Error()
      }
      setEditingId(null)
      setEditFile(null)
      await load()
    } catch {
      setMsg('Failed to save changes')
    }
  }

  return (
    <>
    <section className="section">
      <div className="container">
        <h2 style={{ fontWeight: 800 }}>Admin Dashboard</h2>
        {msg && <p style={{ color: 'tomato' }}>{msg}</p>}
        {loading ? <p>Loading...</p> : (
          <div className="grid" style={{ gap: 16 }}>
            {items.map((p) => (
              <div key={p._id} className="card">
                {editingId !== p._id ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0 }}>{p.title}</h3>
                      <span style={{ color: 'var(--color-muted)' }}>{p.status}</span>
                    </div>
                    {p.imageUrl && <img alt="" src={p.imageUrl} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginTop: 8 }} />}
                    {p.description && <p style={{ marginTop: 8 }}>{p.description}</p>}
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={() => startEdit(p)}>Edit</button>
                      {p.status === 'draft' ? (
                        <button onClick={() => toggleStatus(p._id, 'published')}>Publish</button>
                      ) : (
                        <button onClick={() => toggleStatus(p._id, 'draft')}>Unpublish</button>
                      )}
                      <button onClick={() => setConfirm({ open: true, id: p._id })} style={{ borderColor: '#ef4444', color: '#ef4444' }}>Delete</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                      <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" />
                      <input value={editForm.tags} onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })} placeholder="Tags (comma separated)" />
                      <input value={editForm.link} onChange={(e) => setEditForm({ ...editForm, link: e.target.value })} placeholder="Link" />
                      <input value={editForm.imageUrl} onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })} placeholder="Image URL (optional if uploading file)" />
                      <input type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files?.[0] || null)} />
                      <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                        <option value="draft">draft</option>
                        <option value="published">published</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={() => saveEdit(p._id)} style={{ background: 'var(--color-accent)', color: '#fff', border: '1px solid transparent' }}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
    <Modal open={confirm.open} title="Confirm deletion" onClose={() => setConfirm({ open: false, id: null })} actions={(
      <>
        <button onClick={() => setConfirm({ open: false, id: null })}>Cancel</button>
        <button onClick={() => { const id = confirm.id; setConfirm({ open: false, id: null }); remove(id) }} style={{ borderColor: '#ef4444', color: '#ef4444' }}>Delete</button>
      </>
    )}>
      Are you sure you want to delete this project?
    </Modal>
    <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: 'info' })} />
    </>
  )
}


