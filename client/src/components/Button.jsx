import React from 'react'

export default function Button({ children, variant = 'default', as = 'button', href, ...props }) {
  const Component = href ? 'a' : as
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    textDecoration: 'none',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    padding: '10px 14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 120ms ease, box-shadow 200ms ease, background 200ms ease, border-color 200ms ease'
  }

  const variants = {
    default: {
      background: 'var(--color-surface)',
      color: 'var(--color-text)'
    },
    primary: {
      background: 'var(--color-accent)',
      color: '#fff',
      border: '1px solid transparent'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text)'
    }
  }

  const style = { ...baseStyle, ...(variants[variant] || variants.default) }

  return (
    <Component href={href} style={style} {...props}>
      {children}
    </Component>
  )
}


