import React, { useEffect, useState } from 'react';

const Home = () => {
  const [profile, setProfile] = useState({ name: 'Gbadebo Samuel', title: 'Fullstack Developer · Graphics Designer · Affiliate Marketer', bio: '', imageUrl: '/profile.jpg' })
  useEffect(() => {
    (async () => {
      try { const r = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/profile` : '/api/profile'); const d = await r.json(); if (d) setProfile({ name: d.name || profile.name, title: d.title || profile.title, bio: d.bio || profile.bio, imageUrl: d.imageUrl || profile.imageUrl }) } catch {}
    })()
  }, [])
  return (
    <section className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container" style={{ display: 'grid', alignItems: 'center', gap: '32px', gridTemplateColumns: '1fr' }}>
        <div>
          <h1 style={{ fontWeight: 800 }}>{profile.name}</h1>
          <h2 style={{ color: 'var(--color-muted)', fontWeight: 600 }}>{profile.title}</h2>
          <p style={{ maxWidth: 720 }}>
            {profile.bio || 'I craft beautiful, responsive web applications and stunning graphics with a focus on premium UI/UX design.'}
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <a href="#projects"><button>View Projects</button></a>
            <a href="#contact"><button style={{ background: 'var(--color-accent)', color: '#fff', borderColor: 'transparent' }}>Contact Me</button></a>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img alt="Profile" src={profile.imageUrl || '/profile.jpg'} style={{ width: 220, height: 220, objectFit: 'cover', borderRadius: '50%', border: '4px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }} />
        </div>
      </div>
    </section>
  )
}

export default Home;
