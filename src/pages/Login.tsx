import { FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { session, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to="/" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)

    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password, fullName)

    setBusy(false)
    if (result.error) {
      setError(result.error)
    } else if (mode === 'signup') {
      setInfo('Account created. Check your inbox to confirm your email, then sign in.')
      setMode('signin')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 20,
        background:
          'radial-gradient(circle at 20% 10%, rgba(232,163,61,0.08), transparent 45%), radial-gradient(circle at 85% 90%, rgba(79,209,165,0.07), transparent 45%)'
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, justifyContent: 'center' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--signal), #c97e1d)',
              display: 'grid',
              placeItems: 'center'
            }}
          >
            <TrendingUp size={19} color="#17130A" strokeWidth={2.5} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19 }}>sales track</div>
        </div>

        <form onSubmit={handleSubmit} className="panel" style={{ padding: 30 }}>
          <div className="mono" style={{ color: 'var(--signal)', fontSize: 11, letterSpacing: '0.08em', marginBottom: 6 }}>
            {mode === 'signin' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </div>
          <h2 style={{ fontSize: 21, marginBottom: 22 }}>
            {mode === 'signin' ? 'Sign in to your ledger' : 'Set up your workspace'}
          </h2>

          {mode === 'signup' && (
            <div style={{ marginBottom: 16 }}>
              <label className="label">Full name</label>
              <input
                className="input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Kangeshwaran S"
                required
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {error && (
            <div
              className="mono"
              style={{ background: 'var(--coral-dim)', color: 'var(--coral)', padding: '10px 12px', borderRadius: 8, fontSize: 12.5, marginBottom: 16 }}
            >
              {error}
            </div>
          )}
          {info && (
            <div
              style={{ background: 'var(--mint-dim)', color: 'var(--mint)', padding: '10px 12px', borderRadius: 8, fontSize: 12.5, marginBottom: 16 }}
            >
              {info}
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={busy} style={{ width: '100%', justifyContent: 'center', padding: '11px 16px' }}>
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--muted)' }}>
            {mode === 'signin' ? (
              <>
                No workspace yet?{' '}
                <button type="button" onClick={() => setMode('signup')} className="mono" style={{ background: 'none', border: 'none', color: 'var(--signal)', cursor: 'pointer', fontWeight: 600 }}>
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('signin')} className="mono" style={{ background: 'none', border: 'none', color: 'var(--signal)', cursor: 'pointer', fontWeight: 600 }}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
