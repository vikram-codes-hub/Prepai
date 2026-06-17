import { useState } from 'react'
import { toggleBookmark } from '../services/api'
import toast from 'react-hot-toast'

const categoryStyles = {
  DSA: { label: 'DSA', className: 'badge-dsa', color: '#ff6a00' },
  Technical: { label: 'Technical', className: 'badge-technical', color: '#4f8ef7' },
  HR: { label: 'HR', className: 'badge-hr', color: '#2ecc71' },
  'System Design': { label: 'System Design', className: 'badge-system', color: '#b06ef5' },
}

export default function QuestionCard({ question, showBookmark = true }) {
  const [bookmarked, setBookmarked] = useState(question.bookmarked || false)
  const [hintOpen, setHintOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const style = categoryStyles[question.category] || categoryStyles['Technical']

  const handleBookmark = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await toggleBookmark(question.id)
      setBookmarked(res.data.bookmarked)
      toast.success(res.data.message)
    } catch (err) {
      toast.error('Failed to update bookmark')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(question.question)
    toast.success('Question copied!')
  }

  return (
    <div className="card fade-in" style={{
      padding: '22px 24px',
      display: 'flex', flexDirection: 'column', gap: '14px',
      borderLeft: `2px solid ${style.color}30`,
      transition: 'all 0.25s ease',
    }}>

      {/* Top Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className={`badge ${style.className}`}>{style.label}</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Copy */}
          <button
            onClick={handleCopy}
            title="Copy question"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '7px',
              padding: '5px 10px',
              cursor: 'pointer',
              color: '#606070',
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,106,0,0.4)'
              e.currentTarget.style.color = '#ff6a00'
              e.currentTarget.style.background = 'rgba(255,106,0,0.06)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = '#606070'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <span>📋</span> Copy
          </button>

          {/* Bookmark */}
          {showBookmark && (
            <button
              onClick={handleBookmark}
              disabled={loading}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
              style={{
                background: bookmarked ? 'rgba(255,106,0,0.1)' : 'transparent',
                border: `1px solid ${bookmarked ? 'rgba(255,106,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '7px',
                padding: '5px 10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                color: bookmarked ? '#ff6a00' : '#606070',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.6 : 1,
                display: 'flex', alignItems: 'center', gap: '5px',
              }}
              onMouseEnter={e => {
                if (!bookmarked) {
                  e.currentTarget.style.borderColor = 'rgba(255,106,0,0.4)'
                  e.currentTarget.style.color = '#ff6a00'
                  e.currentTarget.style.background = 'rgba(255,106,0,0.06)'
                }
              }}
              onMouseLeave={e => {
                if (!bookmarked) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = '#606070'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <span>🔖</span> {bookmarked ? 'Saved' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Question */}
      <p style={{
        fontSize: '15px', lineHeight: '1.68',
        color: '#e8e8ee', fontFamily: 'Inter, sans-serif', fontWeight: '500',
      }}>
        {question.question}
      </p>

      {/* Hint toggle */}
      <div>
        <button
          onClick={() => setHintOpen(!hintOpen)}
          style={{
            background: 'transparent', border: 'none',
            color: hintOpen ? '#ff6a00' : '#606070',
            fontSize: '12.5px', fontWeight: '700',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer', padding: '0',
            display: 'flex', alignItems: 'center', gap: '5px',
            transition: 'color 0.2s ease',
          }}
        >
          <span style={{
            display: 'inline-block',
            transform: hintOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            fontSize: '10px',
          }}>▶</span>
          {hintOpen ? 'Hide hint' : 'Show hint'}
        </button>

        {hintOpen && (
          <div className="fade-in" style={{
            marginTop: '10px', padding: '12px 16px',
            background: 'rgba(255,106,0,0.05)',
            border: '1px solid rgba(255,106,0,0.15)',
            borderRadius: '9px',
            fontSize: '13.5px', lineHeight: '1.65',
            color: '#a0a0b0', fontFamily: 'Inter, sans-serif',
          }}>
            💡 {question.hint}
          </div>
        )}
      </div>

    </div>
  )
}