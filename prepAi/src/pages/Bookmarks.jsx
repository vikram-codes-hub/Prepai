import { useState, useEffect } from 'react'
import { getBookmarks } from '../services/api'
import QuestionCard from '../components/QuestionCard'
import toast from 'react-hot-toast'

const FILTERS = ['All', 'DSA', 'Technical', 'HR', 'System Design']

const filterColors = {
  All:           '#ff6a00',
  DSA:           '#ff6a00',
  Technical:     '#4f8ef7',
  HR:            '#2ecc71',
  'System Design': '#b06ef5',
}

export default function Bookmarks() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('All')

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await getBookmarks()
        setQuestions(res.data.questions)
      } catch (err) {
        toast.error('Failed to load bookmarks')
      } finally {
        setLoading(false)
      }
    }
    fetchBookmarks()
  }, [])

  const filtered = filter === 'All' ? questions : questions.filter(q => q.category === filter)

  if (loading) {
    return (
      <div style={{ background: '#060608', minHeight: '100vh', padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '8px', letterSpacing: '-0.03em' }}>Bookmarks</h1>
            <p style={{ color: '#606070', fontFamily: 'Inter, sans-serif' }}>Loading saved questions...</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '120px' }} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#060608', minHeight: '100vh', padding: '80px 24px 60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: '8px', letterSpacing: '-0.03em' }}>
            My <span className="gradient-text">Bookmarks</span>
          </h1>
          <p style={{ color: '#606070', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
            {questions.length} saved question{questions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {questions.length === 0 ? (
          <div className="card" style={{ padding: '72px', textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '18px' }}>🔖</div>
            <h3 style={{ fontSize: '22px', marginBottom: '10px', letterSpacing: '-0.02em' }}>No bookmarks yet</h3>
            <p style={{ color: '#606070', fontFamily: 'Inter, sans-serif', marginBottom: '32px', fontSize: '14px', lineHeight: '1.65' }}>
              Hit the save button on any question to bookmark it
            </p>
            <a href="/generate" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ borderRadius: '10px' }}>Generate Questions</button>
            </a>
          </div>
        ) : (
          <>
            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {FILTERS.map(f => {
                const active = filter === f
                const color  = filterColors[f]
                const count  = f === 'All' ? questions.length : questions.filter(q => q.category === f).length
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '20px',
                      border: `1px solid ${active ? color + '50' : 'rgba(255,255,255,0.08)'}`,
                      background: active ? `${color}14` : 'rgba(255,255,255,0.03)',
                      color: active ? color : '#606070',
                      fontSize: '13px', fontWeight: '700',
                      fontFamily: 'Inter, sans-serif',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      boxShadow: active ? `0 0 16px ${color}20` : 'none',
                    }}
                  >
                    {f}
                    <span style={{
                      fontSize: '11px', opacity: active ? 0.9 : 0.5,
                      background: active ? `${color}20` : 'rgba(255,255,255,0.06)',
                      padding: '1px 6px', borderRadius: '10px',
                    }}>{count}</span>
                  </button>
                )
              })}
            </div>

            {/* No results for filter */}
            {filtered.length === 0 ? (
              <div className="card" style={{ padding: '56px', textAlign: 'center' }}>
                <div style={{ fontSize: '38px', marginBottom: '14px' }}>🔍</div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', letterSpacing: '-0.01em' }}>No {filter} bookmarks</h3>
                <p style={{ color: '#606070', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
                  You haven't saved any {filter} questions yet
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '12.5px', color: '#505060', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
                  Showing {filtered.length} of {questions.length} bookmarks
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {filtered.map(q => (
                    <div key={q.id}>
                      <QuestionCard question={q} showBookmark={true} />
                      {/* Session context */}
                      <div style={{
                        padding: '5px 14px',
                        fontSize: '11.5px', color: '#404050',
                        fontFamily: 'Inter, sans-serif',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}>
                        <span>from</span>
                        <span style={{ color: '#606070', fontWeight: '600' }}>{q.session.role}</span>
                        <span>@</span>
                        <span style={{ color: '#606070', fontWeight: '600' }}>{q.session.company}</span>
                        <span>·</span>
                        <span>{new Date(q.session.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  )
}