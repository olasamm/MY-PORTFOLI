import React, { useEffect, useState } from 'react'
import Modal from '../src/components/Modal'
import Toast from '../src/components/Toast'

export default function AdminProfile() {
  const [form, setForm] = useState({ name: '', title: '', bio: '', imageUrl: '' })
  const [file, setFile] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'info' })

  const api = (p) => (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${p}` : p)
  const token = () => localStorage.getItem('admin_token') || ''

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(api('/api/profile'))
        const d = await r.json()
        setForm({
          name: d?.name || '',
          title: d?.title || '',
          bio: d?.bio || '',
          imageUrl: d?.imageUrl || ''
        })
      } catch {}
    })()
  }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('title', form.title)
      fd.append('bio', form.bio)
      if (file) fd.append('image', file)
      else if (form.imageUrl) fd.append('imageUrl', form.imageUrl)
      const r = await fetch(api('/api/profile'), { method: 'PUT', headers: { Authorization: `Bearer ${token()}` }, body: fd })
      if (!r.ok) throw new Error()
      setToast({ message: 'Profile updated', type: 'success' })
    } catch {
      setToast({ message: 'Failed to update profile', type: 'error' })
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h2 style={{ fontWeight: 800 }}>Admin - Profile</h2>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
          <input name="name" value={form.name} onChange={onChange} placeholder="Your name" />
          <input name="title" value={form.title} onChange={onChange} placeholder="Title (e.g., Fullstack Developer)" />
          <textarea name="bio" value={form.bio} onChange={onChange} rows={4} placeholder="Short bio" />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="Or image URL" />
          <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: '1px solid transparent' }}>Save</button>
        </form>
      </div>
      <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: 'info' })} />
    </section>
  )
}


