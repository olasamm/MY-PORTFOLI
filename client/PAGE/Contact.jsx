import React, { useState } from 'react';
import Toast from '../src/components/Toast'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/contact` : '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error()
      setToast({ message: 'Message sent', type: 'success' })
      setForm({ name: '', email: '', message: '' })
    } catch {
      setToast({ message: 'Failed to send message', type: 'error' })
    }
  }

  return (
    <section id="contact" className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <h2 style={{ fontWeight: 800 }}>Contact</h2>
        <p style={{ maxWidth: 720 }}>Interested in working together or have a question? Reach out below!</p>
        <form style={{ display: 'grid', gap: 12, maxWidth: 560 }} onSubmit={onSubmit}>
          <input name="name" required placeholder="Your name" value={form.name} onChange={onChange} style={{ padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)', color: 'var(--color-text)' }} />
          <input name="email" required type="email" placeholder="Your email" value={form.email} onChange={onChange} style={{ padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)', color: 'var(--color-text)' }} />
          <textarea name="message" required placeholder="Your message" rows={5} value={form.message} onChange={onChange} style={{ padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)', color: 'var(--color-text)', resize: 'vertical' }} />
          <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: '1px solid transparent' }}>Send</button>
        </form>
      </div>
      <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: 'info' })} />
    </section>
  )
}

export default Contact;
