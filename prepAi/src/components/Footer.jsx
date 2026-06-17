export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #1a1a1a',
      padding: '32px 24px',
      marginTop: 'auto',
      background: '#0a0a0a'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>

        {/* Left — Name + Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: '700',
            fontSize: '16px',
            color: '#f0f0f0'
          }}>
            Prep<span style={{ color: '#ff6a00' }}>AI</span>
          </span>
          <span style={{ fontSize: '13px', color: '#666', fontFamily: 'Inter, sans-serif' }}>
            Vikram singh gangwar • vikramsingh9475889367@gmail.com
          </span>
        </div>

        {/* Center — Built for Digital Heroes */}
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <button style={{
            background: 'transparent',
            border: '1px solid #ff6a00',
            color: '#ff6a00',
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={e => {
            e.target.style.background = '#ff6a00'
            e.target.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.target.style.background = 'transparent'
            e.target.style.color = '#ff6a00'
          }}>
            ⚡ Built for Digital Heroes
          </button>
        </a>

        {/* Right — Copyright */}
        <span style={{ fontSize: '13px', color: '#444', fontFamily: 'Inter, sans-serif' }}>
          © 2025 PrepAI. All rights reserved.
        </span>

      </div>
    </footer>
  )
}