import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  Users,
  Package,
  ReceiptText,
  UserSquare2,
  FileBarChart2,
  LogOut,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/sales', label: 'Sales / POS', icon: ReceiptText },
  { to: '/employees', label: 'Employees', icon: UserSquare2 },
  { to: '/reports', label: 'Reports', icon: FileBarChart2 }
]

export function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside
      style={{
        borderRight: '1px solid var(--line)',
        background: 'var(--panel)',
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 28px' }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: 'linear-gradient(135deg, var(--signal), #c97e1d)',
            display: 'grid',
            placeItems: 'center'
          }}
        >
          <TrendingUp size={18} color="#17130A" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>
            Vantage
          </div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.06em' }}>
            SALES LEDGER
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '10px 12px',
              borderRadius: 9,
              fontSize: 13.5,
              fontWeight: 500,
              color: isActive ? 'var(--text)' : 'var(--muted)',
              background: isActive ? 'var(--panel-2)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--signal)' : '2px solid transparent'
            })}
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, marginTop: 14 }}>
        <div style={{ fontSize: 12.5, color: 'var(--text)', fontWeight: 600, marginBottom: 2 }}>
          {user?.user_metadata?.full_name || user?.email}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 12 }}>{user?.email}</div>
        <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={signOut}>
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  )
}
