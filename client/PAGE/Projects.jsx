import React, { useEffect, useState } from 'react';

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/projects` : '/api/projects')
        if (!res.ok) throw new Error('Failed to load projects')
        const data = await res.json()
        setProjects(Array.isArray(data) ? data : (data.projects || []))
      } catch (e) {
        setError('Could not fetch projects.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="projects" className="section" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <h2 style={{ fontWeight: 800 }}>Projects</h2>
        <p style={{ maxWidth: 720 }}>Explore selected work highlighting fullstack development and design.</p>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'tomato' }}>{error}</p>}
        <div className="grid grid-3" style={{ marginTop: 24 }}>
          {projects.map((p) => (
            <article className="card" key={p._id || p.id}>
              <h3 style={{ marginTop: 0 }}>{p.title || 'Untitled Project'}</h3>
              {p.imageUrl && (
                <img alt={p.title} src={p.imageUrl} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} />
              )}
              {p.description && <p style={{ marginTop: 12 }}>{p.description}</p>}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Array.isArray(p.tags) && p.tags.map((t) => (
                  <span key={t} style={{ border: '1px solid var(--color-border)', borderRadius: 999, padding: '4px 8px', fontSize: 12, color: 'var(--color-muted)' }}>{t}</span>
                ))}
              </div>
              {p.link && <a href={p.link} target="_blank" rel="noreferrer"><button style={{ marginTop: 12 }}>View</button></a>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
