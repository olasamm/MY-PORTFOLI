import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ color: 'var(--color-muted)' }}>© {year} Gbadebo Samuel</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {/* <a href="#" aria-label="Twitter">Twitter</a> */}
          <a href="https://github.com/olasamm" aria-label="GitHub">GitHub</a>
          <a href="https://www.linkedin.com/in/gbadebo-samuel-04597a27b/" aria-label="LinkedIn">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}


