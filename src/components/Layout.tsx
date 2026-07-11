import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

export function Layout({
  title,
  eyebrow,
  action,
  children
}: {
  title: string
  eyebrow?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main style={{ padding: '28px 36px 60px', maxWidth: 1320 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 26,
            gap: 16,
            flexWrap: 'wrap'
          }}
        >
          <div>
            {eyebrow && (
              <div
                className="mono"
                style={{ color: 'var(--signal)', fontSize: 11.5, letterSpacing: '0.08em', marginBottom: 6 }}
              >
                {eyebrow}
              </div>
            )}
            <h1 style={{ fontSize: 26, fontWeight: 700 }}>{title}</h1>
          </div>
          {action}
        </div>
        {children}
      </main>
    </div>
  )
}
