import { useState, useEffect } from 'react'
import { getHistory, deleteSession } from '../services/api'
import QuestionCard from '../components/QuestionCard'
import toast from 'react-hot-toast'

const modelColor = {
  Claude: '#ff6a00',
  Gemini: '#3b82f6',
  Groq: '#a855f7'
}

export default function History() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getHistory()
        setSessions(res.data.sessions)
      } catch (err) {
        toast.error('Failed to load history')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation()
    if (!window.confirm('Delete this session? This cannot be undone.')) return
    setDeleting(sessionId)
    try {
      await deleteSession(sessionId)
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (expanded === sessionId) setExpanded(null)
      toast.success('Session deleted')
    } catch (err) {
      toast.error('Failed to delete session')
    } finally {
      setDeleting(null)
    }
  }

  const toggleExpand = (id) => {
    setExpanded(prev => prev === id ? null : id)
  }

  if (loading) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>History</h1>
            <p style={{ color: '#666', fontFamily: 'Inter, sans-serif' }}>Loading your sessions...</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card" style={{ padding: '24px', height: '88px', opacity: 0.4 }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '80px 24px 60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>
            Session <span className="gradient-text">History</span>
          </h1>
          <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Empty State */}
        {sessions.length === 0 ? (
          <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗂️</div>
            <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>No history yet</h3>
            <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', marginBottom: '28px' }}>
              Your generated sessions will appear here
            </p>
            <a href="/generate">
              <button className="btn-primary">Generate Questions</button>
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sessions.map(session => (
              <div key={session.id} className="card" style={{ overflow: 'hidden' }}>

                {/* Session Header Row */}
                <div
                  onClick={() => toggleExpand(session.id)}
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  {/* Left — Role + Meta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#f0f0f0',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {session.role}
                      </span>
                      <span style={{ color: '#333' }}>@</span>
                      <span style={{
                        fontSize: '14px',
                        color: '#888',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {session.company}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        fontFamily: 'JetBrains Mono, monospace',
                        color: modelColor[session.modelUsed] || '#666',
                        background: `${modelColor[session.modelUsed]}15`,
                        border: `1px solid ${modelColor[session.modelUsed]}30`,
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        {session.modelUsed}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: '#555', fontFamily: 'Inter, sans-serif' }}>
                        📅 {new Date(session.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                      <span style={{ color: '#2a2a2a' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#555', fontFamily: 'Inter, sans-serif' }}>
                        {session.difficulty}
                      </span>
                      <span style={{ color: '#2a2a2a' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#555', fontFamily: 'Inter, sans-serif' }}>
                        {session.questions.length} questions
                      </span>
                      <span style={{ color: '#2a2a2a' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#555', fontFamily: 'Inter, sans-serif' }}>
                        {session.categories.join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Right — Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={(e) => handleDelete(e, session.id)}
                      disabled={deleting === session.id}
                      style={{
                        background: 'transparent',
                        border: '1px solid #1a1a1a',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        color: '#555',
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif',
                        cursor: deleting === session.id ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: deleting === session.id ? 0.5 : 1
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#ef4444'
                        e.currentTarget.style.color = '#ef4444'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#1a1a1a'
                        e.currentTarget.style.color = '#555'
                      }}
                    >
                      {deleting === session.id ? 'Deleting...' : '🗑️ Delete'}
                    </button>

                    <span style={{
                      color: '#555',
                      fontSize: '16px',
                      transition: 'transform 0.2s ease',
                      transform: expanded === session.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      display: 'inline-block'
                    }}>▼</span>
                  </div>
                </div>

                {/* Expanded Questions */}
                {expanded === session.id && (
                  <div className="fade-in" style={{
                    borderTop: '1px solid #1a1a1a',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {session.questions.map(q => (
                      <QuestionCard key={q.id} question={q} showBookmark={true} />
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}