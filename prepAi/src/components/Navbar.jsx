import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/generate',  label: 'Generate'  },
    { path: '/history',   label: 'History'   },
    { path: '/bookmarks', label: 'Bookmarks' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      background: scrolled ? 'rgba(6,6,8,0.92)' : 'rgba(6,6,8,0.65)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)'}`,
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.45)' : 'none',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #ff6a00, #ff9500)',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '800', color: '#fff',
            fontFamily: 'Space Grotesk, sans-serif',
            boxShadow: '0 4px 15px rgba(255,106,0,0.35)',
          }}>P</div>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: '800', fontSize: '18px', color: '#f4f4f6',
            letterSpacing: '-0.03em',
          }}>
            Prep<span style={{ color: '#ff6a00' }}>AI</span>
          </span>
        </Link>

        {/* Nav Links */}
        {isAuthenticated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={{
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em',
                  color: isActive(path) ? '#ff6a00' : 'rgba(160,160,176,0.85)',
                  background: isActive(path) ? 'rgba(255,106,0,0.1)' : 'transparent',
                  border: `1px solid ${isActive(path) ? 'rgba(255,106,0,0.2)' : 'transparent'}`,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!isActive(path)) {
                    e.currentTarget.style.color = '#f4f4f6'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(path)) {
                    e.currentTarget.style.color = 'rgba(160,160,176,0.85)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >{label}</Link>
            ))}
          </div>
        )}

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAuthenticated ? (
            <>
              {/* User pill */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 12px 5px 5px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff6a00, #ff9500)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '800', color: '#fff',
                  fontFamily: 'Space Grotesk, sans-serif', flexShrink: 0,
                }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', color: '#a0a0b0', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-ghost" style={{ padding: '6px 14px', fontSize: '13px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-ghost" style={{ padding: '6px 16px', fontSize: '13px' }}>Login</button>
              </Link>
              <Link to="/signup">
                <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Sign Up</button>
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}