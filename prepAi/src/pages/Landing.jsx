import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const sampleQuestions = [
  { category: 'DSA', question: 'Given an array of integers, find the longest subarray with sum equal to k.', hint: 'Use sliding window or prefix sum technique.' },
  { category: 'System Design', question: 'Design a URL shortener like bit.ly that handles 100M requests/day.', hint: 'Think about hashing, load balancing, and caching strategies.' },
  { category: 'HR', question: 'Tell me about a time you disagreed with your manager. How did you handle it?', hint: 'Use the STAR method. Focus on communication and outcome.' },
  { category: 'Technical', question: 'Explain the difference between REST and GraphQL. When would you choose one over the other?', hint: 'Consider over-fetching, under-fetching, and use case complexity.' }
]

const categoryStyles = {
  DSA: 'badge-dsa',
  'System Design': 'badge-system',
  HR: 'badge-hr',
  Technical: 'badge-technical'
}

const categoryIcons = { DSA: '⚙️', 'System Design': '🏗️', HR: '🤝', Technical: '💻' }

const steps = [
  { number: '01', title: 'Enter Role & JD', desc: 'Paste the job description and select your target role and company.', icon: '📋' },
  { number: '02', title: 'Pick Categories', desc: 'Choose from DSA, Technical, HR, and System Design — mix and match.', icon: '🎯' },
  { number: '03', title: 'Generate & Practice', desc: 'Get tailored questions instantly with hints. Save the ones that matter.', icon: '⚡' },
]

const features = [
  { icon: '🤖', title: 'Multi-Model AI', desc: 'Powered by Claude, Gemini & Groq with automatic fallback.' },
  { icon: '🎯', title: 'Role-Specific', desc: 'Questions tailored to your exact role, company, and JD.' },
  { icon: '💡', title: 'Smart Hints', desc: 'Each question comes with a curated hint to guide your thinking.' },
  { icon: '🔖', title: 'Bookmark & Review', desc: 'Save important questions and revisit them anytime.' },
]

export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div style={{ background: '#060608', minHeight: '100vh', overflow: 'hidden' }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '100px 24px 80px',
        textAlign: 'center', position: 'relative',
      }}>

        {/* Ambient orbs */}
        <div style={{ position:'absolute', top:'8%', left:'50%', transform:'translate(-50%,0)',
          width:'900px', height:'900px',
          background:'radial-gradient(circle, rgba(255,106,0,0.06) 0%, transparent 65%)',
          pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'absolute', top:'45%', left:'5%',
          width:'420px', height:'420px',
          background:'radial-gradient(circle, rgba(79,142,247,0.04) 0%, transparent 70%)',
          pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'absolute', top:'15%', right:'3%',
          width:'360px', height:'360px',
          background:'radial-gradient(circle, rgba(176,110,245,0.04) 0%, transparent 70%)',
          pointerEvents:'none', zIndex:0 }} />

        {/* Grid lines */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize:'60px 60px', pointerEvents:'none', zIndex:0,
          maskImage:'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage:'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)',
        }} />

        <div style={{ maxWidth: '860px', position: 'relative', zIndex: 1 }} className="fade-in-up">

          {/* Status tag */}
          <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'center' }}>
            <div className="tag-pill">
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#ff6a00', display: 'inline-block', flexShrink: 0,
              }} className="pulse-orange" />
              AI-Powered Interview Prep · 3 Models
            </div>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(46px, 7.5vw, 84px)',
            marginBottom: '28px', lineHeight: '1.04',
            letterSpacing: '-0.04em', fontWeight: '800',
          }}>
            Ace Your Next
            <br />
            <span className="gradient-text">Tech Interview</span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: 'rgba(160,160,176,0.85)', lineHeight: '1.75',
            marginBottom: '48px', fontFamily: 'Inter, sans-serif',
            maxWidth: '580px', margin: '0 auto 48px', fontWeight: '400',
          }}>
            Paste a job description. Get tailored DSA, Technical, HR &amp; System Design
            questions — powered by Claude AI with multi-model fallback.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap', marginBottom:'28px' }}>
            <Link to={isAuthenticated ? '/generate' : '/signup'} style={{ textDecoration:'none' }}>
              <button className="btn-primary glow" style={{ padding:'15px 38px', fontSize:'16px', borderRadius:'12px' }}>
                Start Preparing Free →
              </button>
            </Link>
            <Link to="/login" style={{ textDecoration:'none' }}>
              <button className="btn-ghost" style={{ padding:'15px 38px', fontSize:'16px', borderRadius:'12px' }}>
                Sign In
              </button>
            </Link>
          </div>

          {/* Built for Digital Heroes button */}
          <div style={{ marginBottom:'44px', display:'flex', justifyContent:'center' }}>
            <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
              <button
                style={{
                  padding:'10px 28px',
                  background:'transparent',
                  border:'1px solid #ff6a00',
                  borderRadius:'8px',
                  color:'#ff6a00',
                  fontSize:'13px',
                  fontWeight:'600',
                  cursor:'pointer',
                  fontFamily:'Inter, sans-serif',
                  letterSpacing:'0.3px',
                  transition:'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,106,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                Built for Digital Heroes
              </button>
            </a>
          </div>

          {/* Stats pill */}
          <div style={{
            display:'inline-flex',
            background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:'16px', padding:'4px',
            backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
          }}>
            {[{ value:'3', label:'AI Models' }, { value:'4', label:'Categories' }, { value:'∞', label:'Questions' }]
              .map(({ value, label }, i) => (
              <div key={label} style={{
                textAlign:'center', padding:'16px 36px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div className="gradient-text" style={{ fontSize:'30px', fontWeight:'800', fontFamily:'Space Grotesk, sans-serif', letterSpacing:'-0.02em' }}>{value}</div>
                <div style={{ fontSize:'11.5px', color:'#606070', fontFamily:'Inter, sans-serif', marginTop:'3px', fontWeight:'500' }}>{label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Why PrepAI ── */}
      <section style={{ padding:'80px 24px', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px',
          background:'linear-gradient(90deg, transparent, rgba(255,106,0,0.3), rgba(79,142,247,0.2), transparent)' }} />
        <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'56px' }}>
            <div className="section-label" style={{ marginBottom:'12px' }}>Why PrepAI</div>
            <h2 style={{ fontSize:'clamp(28px, 4vw, 42px)', letterSpacing:'-0.03em' }}>Built Different</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'16px' }}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="card stat-card" style={{ padding:'28px 24px', overflow:'hidden' }}>
                <div style={{ fontSize:'28px', marginBottom:'14px' }}>{icon}</div>
                <h3 style={{ fontSize:'16px', marginBottom:'8px', fontFamily:'Space Grotesk, sans-serif', fontWeight:'700' }}>{title}</h3>
                <p style={{ color:'#606070', fontSize:'13.5px', lineHeight:'1.65', fontFamily:'Inter, sans-serif' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding:'80px 24px', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px',
          background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
        <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'56px' }}>
            <div className="section-label" style={{ marginBottom:'12px' }}>Simple Process</div>
            <h2 style={{ fontSize:'clamp(28px, 4vw, 42px)', letterSpacing:'-0.03em' }}>How It Works</h2>
            <p style={{ color:'#606070', fontFamily:'Inter, sans-serif', marginTop:'10px', fontSize:'15px' }}>Three steps to interview-ready</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px' }}>
            {steps.map(({ number, title, desc, icon }) => (
              <div key={number} className="card" style={{ padding:'36px 28px', overflow:'hidden', position:'relative' }}>
                {/* Ghost number */}
                <div style={{
                  position:'absolute', top:'-12px', right:'12px',
                  fontSize:'88px', fontWeight:'800', fontFamily:'Space Grotesk, sans-serif',
                  color:'rgba(255,106,0,0.04)', lineHeight:'1', userSelect:'none',
                }}>{number}</div>
                <div style={{ fontSize:'24px', marginBottom:'16px' }}>{icon}</div>
                <div style={{
                  fontSize:'11px', fontFamily:'JetBrains Mono, monospace',
                  color:'#ff6a00', fontWeight:'600', marginBottom:'10px', letterSpacing:'0.5px',
                }}>{number}</div>
                <h3 style={{ fontSize:'19px', marginBottom:'10px', fontFamily:'Space Grotesk, sans-serif', letterSpacing:'-0.02em' }}>{title}</h3>
                <p style={{ color:'#606070', fontSize:'14px', lineHeight:'1.65', fontFamily:'Inter, sans-serif' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Questions ── */}
      <section style={{ padding:'80px 24px', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px',
          background:'linear-gradient(90deg, transparent, rgba(79,142,247,0.25), rgba(176,110,245,0.15), transparent)' }} />
        <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'56px' }}>
            <div className="section-label" style={{ marginBottom:'12px' }}>Preview</div>
            <h2 style={{ fontSize:'clamp(28px, 4vw, 42px)', letterSpacing:'-0.03em' }}>Sample Questions</h2>
            <p style={{ color:'#606070', fontFamily:'Inter, sans-serif', marginTop:'10px', fontSize:'15px' }}>A taste of what PrepAI generates for you</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(440px, 1fr))', gap:'16px' }}>
            {sampleQuestions.map((q, i) => (
              <div key={i} className="card" style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:'14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <span style={{ fontSize:'18px' }}>{categoryIcons[q.category]}</span>
                  <span className={`badge ${categoryStyles[q.category]}`}>{q.category}</span>
                </div>
                <p style={{ fontSize:'15px', color:'#e8e8ee', lineHeight:'1.65', fontFamily:'Inter, sans-serif', fontWeight:'500' }}>{q.question}</p>
                <div style={{
                  padding:'10px 14px',
                  background:'rgba(255,106,0,0.05)',
                  border:'1px solid rgba(255,106,0,0.12)',
                  borderRadius:'8px',
                  fontSize:'13px', color:'#808090',
                  fontFamily:'Inter, sans-serif', lineHeight:'1.6',
                }}>💡 {q.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding:'100px 24px 120px', textAlign:'center', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px',
          background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%, -50%)', width:'600px', height:'400px',
          background:'radial-gradient(ellipse, rgba(255,106,0,0.07) 0%, transparent 70%)',
          pointerEvents:'none',
        }} />
        <div style={{ maxWidth:'580px', margin:'0 auto', position:'relative', zIndex:1 }}>
          <div className="section-label" style={{ marginBottom:'16px' }}>Get Started</div>
          <h2 style={{ fontSize:'clamp(34px, 5vw, 54px)', marginBottom:'20px', letterSpacing:'-0.04em' }}>
            Ready to Prep<br /><span className="gradient-text">Smarter?</span>
          </h2>
          <p style={{ color:'#606070', fontFamily:'Inter, sans-serif', marginBottom:'40px', fontSize:'16px', lineHeight:'1.7' }}>
            Free forever. No credit card. Just questions that get you hired.
          </p>
          <Link to={isAuthenticated ? '/generate' : '/signup'} style={{ textDecoration:'none' }}>
            <button className="btn-primary glow" style={{ padding:'17px 50px', fontSize:'17px', borderRadius:'14px' }}>
              Get Started Free →
            </button>
          </Link>
        </div>
      </section>

    </div>
  )
}