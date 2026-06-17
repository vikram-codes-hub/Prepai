import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginApi } from '../services/api'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('All fields are required'); return }
    setLoading(true)
    try {
      const res = await loginApi(form)
      login(res.data.user, res.data.token)
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      padding:'24px', background:'#060608', position:'relative', overflow:'hidden',
    }}>
      {/* Ambient */}
      <div style={{ position:'fixed', top:'30%', left:'50%', transform:'translate(-50%,-50%)',
        width:'700px', height:'700px',
        background:'radial-gradient(circle, rgba(255,106,0,0.07) 0%, transparent 65%)',
        pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'10%', right:'8%',
        width:'380px', height:'380px',
        background:'radial-gradient(circle, rgba(79,142,247,0.04) 0%, transparent 70%)',
        pointerEvents:'none' }} />
      {/* Grid */}
      <div style={{
        position:'fixed', inset:0,
        backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize:'60px 60px', pointerEvents:'none',
        maskImage:'radial-gradient(ellipse 70% 70% at 50% 40%, black 0%, transparent 100%)',
        WebkitMaskImage:'radial-gradient(ellipse 70% 70% at 50% 40%, black 0%, transparent 100%)',
      }} />

      <div style={{ width:'100%', maxWidth:'420px', position:'relative', zIndex:1 }} className="fade-in-up">

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <Link to="/" style={{ textDecoration:'none', display:'inline-block', marginBottom:'24px' }}>
            <div style={{
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              width:'56px', height:'56px',
              background:'linear-gradient(135deg, #ff6a00, #ff9500)',
              borderRadius:'16px', fontSize:'26px', fontWeight:'800', color:'#fff',
              fontFamily:'Space Grotesk, sans-serif',
              boxShadow:'0 8px 30px rgba(255,106,0,0.35)',
            }}>P</div>
          </Link>
          <h1 style={{ fontSize:'30px', marginBottom:'8px', letterSpacing:'-0.04em' }}>Welcome back</h1>
          <p style={{ color:'#606070', fontSize:'15px', fontFamily:'Inter, sans-serif' }}>Sign in to continue preparing</p>
        </div>

        {/* Glass Card */}
        <div style={{
          background:'rgba(255,255,255,0.03)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'20px', padding:'36px',
          backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
          boxShadow:'0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          position:'relative',
        }}>
          {/* Top accent line */}
          <div style={{
            position:'absolute', top:0, left:'20%', right:'20%', height:'1px',
            background:'linear-gradient(90deg, transparent, rgba(255,106,0,0.45), transparent)',
          }} />

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

            <div>
              <label style={{
                display:'block', fontSize:'11px', fontWeight:'700',
                color: focused === 'email' ? '#ff6a00' : '#606070',
                fontFamily:'Inter, sans-serif', marginBottom:'8px',
                textTransform:'uppercase', letterSpacing:'0.8px', transition:'color 0.2s ease',
              }}>Email</label>
              <input
                className="input" type="email" name="email"
                placeholder="you@example.com" value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
            </div>

            <div>
              <label style={{
                display:'block', fontSize:'11px', fontWeight:'700',
                color: focused === 'password' ? '#ff6a00' : '#606070',
                fontFamily:'Inter, sans-serif', marginBottom:'8px',
                textTransform:'uppercase', letterSpacing:'0.8px', transition:'color 0.2s ease',
              }}>Password</label>
              <input
                className="input" type="password" name="password"
                placeholder="••••••••" value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
            </div>

            <button
              type="submit" className="btn-primary" onClick={handleSubmit}
              disabled={loading}
              style={{
                width:'100%', padding:'14px', fontSize:'15px', borderRadius:'12px',
                marginTop:'4px', opacity: loading ? 0.75 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width:'16px', height:'16px',
                    border:'2px solid rgba(255,255,255,0.3)',
                    borderTop:'2px solid #fff',
                    borderRadius:'50%', animation:'spin 0.8s linear infinite',
                  }} />
                  Signing in...
                </>
              ) : 'Continue →'}
            </button>

          </form>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        <p style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'#606070', fontFamily:'Inter, sans-serif' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color:'#ff6a00', textDecoration:'none', fontWeight:'700' }}>Sign up free →</Link>
        </p>
      </div>
    </div>
  )
}