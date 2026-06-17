import { useState } from 'react'
import { generateQuestions } from '../services/api'
import QuestionCard from '../components/QuestionCard'
import toast from 'react-hot-toast'

const CATEGORIES = ['DSA', 'Technical', 'HR', 'System Design']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const COUNTS = [5, 10, 15]

const categoryColors = {
  DSA:           { active: '#ff6a00', bg: 'rgba(255,106,0,0.1)',    border: 'rgba(255,106,0,0.3)'    },
  Technical:     { active: '#4f8ef7', bg: 'rgba(79,142,247,0.1)',   border: 'rgba(79,142,247,0.3)'   },
  HR:            { active: '#2ecc71', bg: 'rgba(46,204,113,0.1)',   border: 'rgba(46,204,113,0.3)'   },
  'System Design':{ active: '#b06ef5', bg: 'rgba(176,110,245,0.1)', border: 'rgba(176,110,245,0.3)' },
}

const labelStyle = {
  display: 'block', fontSize: '11px', fontWeight: '700',
  color: '#606070', fontFamily: 'Inter, sans-serif',
  marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.8px',
}

export default function Generator() {
  const [form, setForm] = useState({
    role: '', company: '', jd: '',
    categories: [], difficulty: 'Medium', count: 10,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const toggleCategory = (cat) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }))
  }

  const handleGenerate = async () => {
    if (!form.role.trim())    return toast.error('Job role is required')
    if (!form.company.trim()) return toast.error('Company name is required')
    if (form.categories.length === 0) return toast.error('Select at least one category')
    setLoading(true); setResult(null)
    try {
      const res = await generateQuestions(form)
      setResult(res.data)
      toast.success(`${res.data.questions.length} questions generated via ${res.data.modelUsed}!`)
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Generation failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAll = () => {
    const text = result.questions.map((q, i) => `${i + 1}. [${q.category}] ${q.question}\nHint: ${q.hint}`).join('\n\n')
    navigator.clipboard.writeText(text)
    toast.success('All questions copied!')
  }

  return (
    <div style={{ background: '#060608', minHeight: '100vh', padding: '80px 24px 60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: '8px', letterSpacing: '-0.03em' }}>
            Generate <span className="gradient-text">Questions</span>
          </h1>
          <p style={{ color: '#606070', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
            Fill in the details below and let AI do the rest
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: '36px',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', gap: '28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative',
        }}>
          {/* Top gradient line */}
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,106,0,0.4), transparent)',
          }} />

          {/* Role + Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Job Role *</label>
              <input className="input" type="text" placeholder="e.g. Frontend Engineer"
                value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Company *</label>
              <input className="input" type="text" placeholder="e.g. Google"
                value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>

          {/* JD */}
          <div>
            <label style={labelStyle}>
              Job Description{' '}
              <span style={{ color: '#363640', fontWeight: '500', textTransform: 'none', letterSpacing: '0' }}>(optional)</span>
            </label>
            <textarea
              className="input"
              placeholder="Paste the job description here for more tailored questions..."
              value={form.jd}
              onChange={e => setForm({ ...form, jd: e.target.value })}
              rows={5}
              style={{ resize: 'vertical', lineHeight: '1.65' }}
            />
          </div>

          {/* Categories */}
          <div>
            <label style={labelStyle}>Categories *</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => {
                const active = form.categories.includes(cat)
                const colors = categoryColors[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    style={{
                      padding: '9px 18px', borderRadius: '10px',
                      border: `1px solid ${active ? colors.border : 'rgba(255,255,255,0.08)'}`,
                      background: active ? colors.bg : 'rgba(255,255,255,0.03)',
                      color: active ? colors.active : '#606070',
                      fontSize: '14px', fontWeight: '700',
                      fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: active ? `0 0 16px ${colors.active}25` : 'none',
                    }}
                  >{cat}</button>
                )
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label style={labelStyle}>Difficulty</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setForm({ ...form, difficulty: d })}
                  style={{
                    padding: '9px 22px', borderRadius: '10px',
                    border: `1px solid ${form.difficulty === d ? 'rgba(255,106,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    background: form.difficulty === d ? 'rgba(255,106,0,0.1)' : 'rgba(255,255,255,0.03)',
                    color: form.difficulty === d ? '#ff6a00' : '#606070',
                    fontSize: '14px', fontWeight: '700',
                    fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: form.difficulty === d ? '0 0 16px rgba(255,106,0,0.2)' : 'none',
                  }}
                >{d}</button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <label style={labelStyle}>Number of Questions</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {COUNTS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, count: c })}
                  style={{
                    padding: '9px 22px', borderRadius: '10px',
                    border: `1px solid ${form.count === c ? 'rgba(255,106,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    background: form.count === c ? 'rgba(255,106,0,0.1)' : 'rgba(255,255,255,0.03)',
                    color: form.count === c ? '#ff6a00' : '#606070',
                    fontSize: '14px', fontWeight: '700',
                    fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: form.count === c ? '0 0 16px rgba(255,106,0,0.2)' : 'none',
                  }}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            className="btn-primary glow"
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: '100%', padding: '16px', fontSize: '16px', borderRadius: '12px',
              opacity: loading ? 0.85 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                }} />
                Generating questions...
              </>
            ) : '⚡ Generate Questions'}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        </div>

        {/* Results */}
        {result && (
          <div id="results" style={{ marginTop: '48px' }} className="fade-in-up">

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ fontSize: '22px', letterSpacing: '-0.02em' }}>
                  {result.questions.length} Questions Generated
                </h2>
                <span className="model-badge">{result.modelUsed}</span>
              </div>
              <button
                className="btn-ghost"
                onClick={handleCopyAll}
                style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '9px' }}
              >
                📋 Copy All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {result.questions.map((q) => (
                <QuestionCard key={q.id} question={q} showBookmark={true} />
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}