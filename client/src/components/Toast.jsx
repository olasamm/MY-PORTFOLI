import React, { useEffect } from 'react'

export default function Toast({ message, type = 'info', onDone, duration = 2500 }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => onDone && onDone(), duration)
    return () => clearTimeout(t)
  }, [message, duration, onDone])
  if (!message) return null
  const bg = type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : 'var(--color-accent)'
  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1000 }}>
      <div style={{ background: bg, color: '#fff', padding: '10px 14px', borderRadius: 8, boxShadow: 'var(--shadow-md)' }}>
        {message}
      </div>
    </div>
  )
}


