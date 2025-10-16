import React from 'react';

const Skills = () => (
  <section className="section" style={{ background: 'var(--color-surface)' }}>
    <div className="container">
      <h2 style={{ fontWeight: 800 }}>Skills</h2>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {['React','Node.js','Express','MongoDB','UI/UX Design','Graphics Design','Affiliate Marketing'].map((s) => (
          <li key={s} style={{ border: '1px solid var(--color-border)', borderRadius: 999, padding: '8px 12px', color: 'var(--color-muted)' }}>{s}</li>
        ))}
      </ul>
    </div>
  </section>
);

export default Skills;
