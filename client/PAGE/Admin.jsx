import React, { useState } from 'react'
import Modal from '../src/components/Modal'
import Toast from '../src/components/Toast'

export default function Admin() {
  const [form, setForm] = useState({ title: '', description: '', tags: '', link: '', imageUrl: '' })
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [toast, setToast] = useState({ message: '', type: 'info' })

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const token = localStorage.getItem('admin_token') || ''
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('tags', form.tags)
      fd.append('link', form.link)
      if (file) fd.append('image', file)
      else if (form.imageUrl) fd.append('imageUrl', form.imageUrl)

      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/projects` : '/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: fd
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data.error || 'Failed to create project') + (data.details ? ` - ${data.details}` : ''))
      }
      setMessage('Project created successfully')
      setToast({ message: 'Project created', type: 'success' })
      setForm({ title: '', description: '', tags: '', link: '', imageUrl: '' })
      setFile(null)
    } catch (err) {
      setMessage(err.message)
      setToast({ message: err.message || 'Failed to create', type: 'error' })
    }
  }

  const saveToken = () => setShowTokenModal(true)
  const confirmToken = () => { if (tokenInput) { localStorage.setItem('admin_token', tokenInput); setShowTokenModal(false); setTokenInput(''); setToast({ message: 'Admin token saved', type: 'success' }) } }

  return (
    <>
    <section className="section">
      <div className="container">
        <h2 style={{ fontWeight: 800 }}>Admin - Add Project</h2>
        <div style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
          <button onClick={saveToken}>Set Admin Token</button>
        </div>
        {message && <p style={{ color: message.includes('success') ? 'green' : 'tomato' }}>{message}</p>}
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
          <input name="title" value={form.title} onChange={onChange} placeholder="Title" required style={{ padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" rows={4} style={{ padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
          <input name="tags" value={form.tags} onChange={onChange} placeholder="Tags (comma separated)" style={{ padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
          <input name="link" value={form.link} onChange={onChange} placeholder="Link" style={{ padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="Or image URL" style={{ padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
          <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: '1px solid transparent' }}>Create</button>
        </form>
      </div>
    </section>
    <Modal open={showTokenModal} title="Set Admin Token" onClose={() => setShowTokenModal(false)} actions={(
      <>
        <button onClick={() => setShowTokenModal(false)}>Cancel</button>
        <button onClick={confirmToken} style={{ background: 'var(--color-accent)', color: '#fff', border: '1px solid transparent' }}>Save</button>
      </>
    )}>
      <input value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="Enter token" style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
    </Modal>
    <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: 'info' })} />
    </>
  )
}
