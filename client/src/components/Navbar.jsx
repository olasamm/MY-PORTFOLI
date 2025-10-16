import React from 'react'
import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const linkClass = ({ isActive }) => ({
  color: isActive ? 'var(--color-text)' : 'var(--color-muted)',
  textDecoration: 'none',
  padding: '8px 0',
  borderBottom: isActive ? `2px solid var(--color-accent)` : '2px solid transparent',
  transition: 'color 150ms ease, border-color 150ms ease'
})

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div style={{ fontWeight: 800 }}>Gbadebo<span style={{ color: 'var(--color-accent)' }}>.</span></div>
        <nav className="nav-links">
          <NavLink to="/" style={linkClass} end>Home</NavLink>
          <NavLink to="/about" style={linkClass}>About</NavLink>
          <NavLink to="/projects" style={linkClass}>Projects</NavLink>
          <NavLink to="/skills" style={linkClass}>Skills</NavLink>
          <NavLink to="/contact" style={linkClass}>Contact</NavLink>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}


