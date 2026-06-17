import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signup as signupApi } from '../services/api'
import toast from 'react-hot-toast'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('All fields are required'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await signupApi(form)
      login(res.data.user, res.data.token)
      toast.success(`Welcome to PrepAI, ${res.data.user.name.split(' ')[0]}! 🚀`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = (field) => ({
    display: 'block', fontSize: '11px', fontWeight: '700',
    color: focused === field ? '#ff6a00' : '#606070',
    fontFamily: 'Inter, sans-serif', marginBottom: '8px',
    textTransform: 'uppercase', letterSpacing: '0.8px', transition: 'color 0.2s ease',
  })

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
      <div style={{ position:'fixed', bottom:'5%', left:'8%',
        width:'350px', height:'350px',
        background:'radial-gradient(circle, rgba(176,110,245,0.04) 0%, transparent 70%)',
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
              borderRadius:'16px', fontSize:'26px', fontWeight:'800',
              color:'#fff', fontFamily:'Space Grotesk, sans-serif',
              boxShadow:'0 8px 30px rgba(255,106,0,0.35)',
            }}>P</div>
          </Link>
          <h1 style={{ fontSize:'30px', marginBottom:'8px', letterSpacing:'-0.04em' }}>Create account</h1>
          <p style={{ color:'#606070', fontSize:'15px', fontFamily:'Inter, sans-serif' }}>
            Free forever. Start prepping in seconds.
          </p>
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
          <div style={{
            position:'absolute', top:0, left:'20%', right:'20%', height:'1px',
            background:'linear-gradient(90deg, transparent, rgba(255,106,0,0.45), transparent)',
          }} />

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

            <div>
              <label style={labelStyle('name')}>Full Name</label>
              <input className="input" type="text" name="name"
                placeholder="Your Name" value={form.name}
                onChange={handleChange}
                onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
            </div>

            <div>
              <label style={labelStyle('email')}>Email</label>
              <input className="input" type="email" name="email"
                placeholder="you@example.com" value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
            </div>

            <div>
              <label style={labelStyle('password')}>Password</label>
              <input className="input" type="password" name="password"
                placeholder="Min. 6 characters" value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} />
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
                  Creating account...
                </>
              ) : 'Create Account →'}
            </button>
          </form>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        <p style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'#606070', fontFamily:'Inter, sans-serif' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#ff6a00', textDecoration:'none', fontWeight:'700' }}>Sign in →</Link>
        </p>
      </div>
    </div>
  )
}