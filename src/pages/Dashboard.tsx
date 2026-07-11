import { useEffect, useMemo, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { DollarSign, ShoppingCart, Users, AlertTriangle } from 'lucide-react'
import { Layout } from '../components/Layout'
import { StatCard } from '../components/StatCard'
import { supabase } from '../lib/supabaseClient'
import type { Sale, SaleItem, Product, Customer } from '../lib/types'

const CHART_COLORS = ['#E8A33D', '#4FD1A5', '#6E8EF0', '#E8615A', '#B98CE0', '#5CC8E8']

function currency(n: number) {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export function Dashboard() {
  const [sales, setSales] = useState<Sale[]>([])
  const [items, setItems] = useState<(SaleItem & { product?: Product })[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [salesRes, itemsRes, customersRes, productsRes] = await Promise.all([
        supabase.from('sales').select('*').order('sale_date', { ascending: true }),
        supabase.from('sale_items').select('*, product:products(*)'),
        supabase.from('customers').select('*'),
        supabase.from('products').select('*')
      ])
      setSales(salesRes.data ?? [])
      setItems((itemsRes.data as any) ?? [])
      setCustomers(customersRes.data ?? [])
      setProducts(productsRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const totalRevenue = useMemo(() => sales.reduce((sum, s) => sum + Number(s.total), 0), [sales])
  const totalOrders = sales.length
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0
  const lowStock = products.filter((p) => p.stock_quantity <= p.reorder_level)

  const revenueByDay = useMemo(() => {
    const map = new Map<string, number>()
    sales.forEach((s) => {
      const day = s.sale_date
      map.set(day, (map.get(day) ?? 0) + Number(s.total))
    })
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        revenue: Math.round(revenue)
      }))
  }, [sales])

  const topProducts = useMemo(() => {
    const map = new Map<string, number>()
    items.forEach((it) => {
      const name = it.product?.name ?? 'Unknown'
      map.set(name, (map.get(name) ?? 0) + it.quantity)
    })
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, qty]) => ({ name, qty }))
  }, [items])

  const paymentSplit = useMemo(() => {
    const map = new Map<string, number>()
    sales.forEach((s) => map.set(s.payment_status, (map.get(s.payment_status) ?? 0) + 1))
    return Array.from(map.entries()).map(([status, count]) => ({ name: status, value: count }))
  }, [sales])

  return (
    <Layout eyebrow={`AS OF ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`} title="Command Center">
      {loading ? (
        <div style={{ color: 'var(--muted)' }}>Loading ledger data…</div>
      ) : sales.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
            <StatCard label="Total Revenue" value={currency(totalRevenue)} icon={<DollarSign size={16} />} accent="signal" />
            <StatCard label="Orders" value={totalOrders.toLocaleString('en-IN')} icon={<ShoppingCart size={16} />} accent="mint" />
            <StatCard label="Avg Order Value" value={currency(Math.round(avgOrderValue))} icon={<Users size={16} />} accent="signal" />
            <StatCard label="Low Stock Alerts" value={String(lowStock.length)} icon={<AlertTriangle size={16} />} accent="coral" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="panel" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
                <span className="label" style={{ marginBottom: 0 }}>Revenue Trend</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueByDay}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E8A33D" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#E8A33D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--line-soft)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#8A93AC', fontSize: 11 }} axisLine={{ stroke: 'var(--line)' }} tickLine={false} />
                  <YAxis tick={{ fill: '#8A93AC', fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip contentStyle={{ background: '#1A2438', border: '1px solid #262F45', borderRadius: 8, fontSize: 12.5 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#E8A33D" fill="url(#rev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="panel" style={{ padding: '20px 22px' }}>
              <span className="label">Payment Status</span>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={paymentSplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {paymentSplit.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1A2438', border: '1px solid #262F45', borderRadius: 8, fontSize: 12.5 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="panel" style={{ padding: '20px 22px' }}>
              <span className="label">Top Products by Quantity</span>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topProducts} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid stroke="var(--line-soft)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#8A93AC', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fill: '#ECEEF3', fontSize: 11.5 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1A2438', border: '1px solid #262F45', borderRadius: 8, fontSize: 12.5 }} />
                  <Bar dataKey="qty" fill="#4FD1A5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="panel" style={{ padding: '20px 22px' }}>
              <span className="label">Low Stock Watchlist</span>
              <div className="table-wrap" style={{ marginTop: 6 }}>
                <table className="data">
                  <thead>
                    <tr><th>Product</th><th>Stock</th><th>Reorder At</th></tr>
                  </thead>
                  <tbody>
                    {lowStock.length === 0 && (
                      <tr><td colSpan={3} style={{ color: 'var(--muted)' }}>All products above reorder level.</td></tr>
                    )}
                    {lowStock.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td className="mono">{p.stock_quantity}</td>
                        <td className="mono">{p.reorder_level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--muted-2)' }}>
            {customers.length} customers · {products.length} products tracked
          </div>
        </>
      )}
    </Layout>
  )
}

function EmptyState() {
  return (
    <div className="panel" style={{ padding: 40, textAlign: 'center' }}>
      <h3 style={{ marginBottom: 8 }}>No sales recorded yet</h3>
      <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>
        Run the seed script in <span className="mono">supabase/seed.sql</span>, or record your first sale from
        the Sales / POS page.
      </p>
    </div>
  )
}
