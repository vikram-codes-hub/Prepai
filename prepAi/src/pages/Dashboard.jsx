import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHistory } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getHistory()
        setSessions(res.data.sessions)
      } catch (err) {
        console.error('Failed to fetch history')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const totalQuestions = sessions.reduce((acc, s) => acc + s.questions.length, 0)
  const totalBookmarks = sessions.reduce((acc, s) => acc + s.questions.filter(q => q.bookmarked).length, 0)
  const recentSessions = sessions.slice(0, 5)

  const modelColor = {
    Claude: '#ff6a00',
    Gemini: '#4f8ef7',
    Groq:   '#b06ef5',
  }

  const stats = [
    { label: 'Total Sessions', value: sessions.length, icon: '🗂️', color: '#ff6a00' },
    { label: 'Total Questions', value: totalQuestions, icon: '❓', color: '#4f8ef7' },
    { label: 'Bookmarks',       value: totalBookmarks, icon: '🔖', color: '#b06ef5' },
  ]

  return (
    <div style={{ background: '#060608', minHeight: '100vh', padding: '80px 24px 60px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '40px', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: '6px', letterSpacing: '-0.03em' }}>
              Hey, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p style={{ color: '#606070', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
              Here's your prep overview
            </p>
          </div>
          <Link to="/generate" style={{ textDecoration: 'none' }}>
            <button className="btn-primary glow" style={{ padding: '12px 24px', borderRadius: '12px' }}>
              ⚡ Quick Generate
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px', marginBottom: '40px',
        }}>
          {stats.map(({ label, value, icon, color }) => (
            <div key={label} className="card stat-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{
                    fontSize: '38px', fontWeight: '800',
                    fontFamily: 'Space Grotesk, sans-serif',
                    color, lineHeight: '1', letterSpacing: '-0.02em',
                  }}>
                    {loading ? '—' : value}
                  </div>
                  <div style={{
                    fontSize: '13px', color: '#606070',
                    fontFamily: 'Inter, sans-serif', marginTop: '8px', fontWeight: '500',
                  }}>{label}</div>
                </div>
                <div style={{ fontSize: '26px', opacity: 0.8 }}>{icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <h2 style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>Recent Sessions</h2>
            {sessions.length > 5 && (
              <Link to="/history" style={{
                color: '#ff6a00', fontSize: '13px', fontWeight: '700',
                fontFamily: 'Inter, sans-serif', textDecoration: 'none',
              }}>View all →</Link>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: '76px' }} />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="card" style={{ padding: '56px', textAlign: 'center' }}>
              <div style={{ fontSize: '44px', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', letterSpacing: '-0.02em' }}>No sessions yet</h3>
              <p style={{ color: '#606070', fontFamily: 'Inter, sans-serif', marginBottom: '28px', fontSize: '14px' }}>
                Generate your first set of interview questions
              </p>
              <Link to="/generate" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ borderRadius: '10px' }}>Start Generating</button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentSessions.map((session, idx) => (
                <Link key={session.id} to="/history" style={{ textDecoration: 'none' }}
                  className="fade-in" style={{ animationDelay: `${idx * 0.05}s`, display: 'block', textDecoration: 'none' }}>
                  <div className="card" style={{
                    padding: '18px 22px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '12px', cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f6', fontFamily: 'Inter, sans-serif' }}>
                          {session.role}
                        </span>
                        <span style={{ color: '#363640', fontSize: '13px' }}>@</span>
                        <span style={{ fontSize: '14px', color: '#808090', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                          {session.company}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#505060', fontFamily: 'Inter, sans-serif' }}>
                          {new Date(session.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span style={{ color: '#2a2a35' }}>·</span>
                        <span style={{ fontSize: '12px', color: '#505060', fontFamily: 'Inter, sans-serif' }}>
                          {session.difficulty}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#606070', fontFamily: 'Inter, sans-serif' }}>
                        {session.questions.length} questions
                      </span>
                      <span style={{
                        fontSize: '11px', fontWeight: '700',
                        fontFamily: 'JetBrains Mono, monospace',
                        color: modelColor[session.modelUsed] || '#606070',
                        background: `${modelColor[session.modelUsed] || '#606070'}18`,
                        border: `1px solid ${modelColor[session.modelUsed] || '#606070'}30`,
                        padding: '2px 9px', borderRadius: '12px',
                      }}>
                        {session.modelUsed}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px', marginTop: '40px',
        }}>
          {[
            { to: '/history',   icon: '🗂️', label: 'View All History', desc: 'Browse past sessions',  color: '#4f8ef7' },
            { to: '/bookmarks', icon: '🔖', label: 'My Bookmarks',     desc: 'Saved questions',       color: '#b06ef5' },
          ].map(({ to, icon, label, desc, color }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '24px', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
                }} />
                <div style={{ fontSize: '26px', marginBottom: '12px' }}>{icon}</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f6', fontFamily: 'Inter, sans-serif', marginBottom: '4px', letterSpacing: '-0.01em' }}>{label}</div>
                <div style={{ fontSize: '13px', color: '#606070', fontFamily: 'Inter, sans-serif' }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}