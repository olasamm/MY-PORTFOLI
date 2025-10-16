import React, { useEffect, useState } from 'react';

const About = () => {
  const [profile, setProfile] = useState({ name: 'Gbadebo Samuel', title: '', bio: '', imageUrl: '/profile.jpg' })
  useEffect(() => { (async () => { try { const r = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/profile` : '/api/profile'); const d = await r.json(); if (d) setProfile({ name: d.name || profile.name, title: d.title || profile.title, bio: d.bio || profile.bio, imageUrl: d.imageUrl || profile.imageUrl }) } catch {} })() }, [])
  return (
    <section className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container" style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr' }}>
        <div>
          <h2 style={{ fontWeight: 800 }}>About Me</h2>
          <p style={{ maxWidth: 800 }}>
            {profile.bio || 'I am a passionate fullstack developer and graphics designer with a keen eye for detail and a love for creating seamless digital experiences.'}
          </p>
        </div>
        <div>
          <img alt="Profile" src={profile.imageUrl || '/profile.jpg'} style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: '50%', border: '4px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }} />
        </div>
      </div>
    </section>
  )
}

export default About;
