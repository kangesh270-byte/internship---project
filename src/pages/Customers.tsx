import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'
import { Layout } from '../components/Layout'
import { supabase } from '../lib/supabaseClient'
import type { Customer } from '../lib/types'

const empty = { name: '', email: '', phone: '', billing_address: '' }

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
    if (!error) setCustomers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.email ?? '').toLowerCase().includes(q) || (c.phone ?? '').includes(q)
    )
  }, [customers, query])

  function openNew() {
    setEditing(null)
    setForm(empty)
    setError(null)
    setModalOpen(true)
  }

  function openEdit(c: Customer) {
    setEditing(c)
    setForm({ name: c.name, email: c.email ?? '', phone: c.phone ?? '', billing_address: c.billing_address ?? '' })
    setError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (editing) {
      const { error } = await supabase.from('customers').update(form).eq('id', editing.id)
      if (error) return setError(error.message)
    } else {
      const { error } = await supabase.from('customers').insert(form)
      if (error) return setError(error.message)
    }
    setModalOpen(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this customer? This cannot be undone.')) return
    const { error } = await supabase.from('customers').delete().eq('id', id)
    if (!error) load()
  }

  return (
    <Layout
      eyebrow="CRM"
      title="Customers"
      action={
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={15} /> Add Customer
        </button>
      }
    >
      <div className="panel" style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--muted)' }} />
          <input
            className="input"
            style={{ paddingLeft: 34 }}
            placeholder="Search by name, email, phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="panel table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Billing Address</th><th>Joined</th><th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{ color: 'var(--muted)' }}>Loading customers…</td></tr>}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} style={{ color: 'var(--muted)' }}>No customers found.</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>{c.email || '—'}</td>
                <td className="mono">{c.phone || '—'}</td>
                <td>{c.billing_address || '—'}</td>
                <td className="mono">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: 7 }} onClick={() => openEdit(c)}><Pencil size={13} /></button>
                    <button className="btn btn-danger" style={{ padding: 7 }} onClick={() => handleDelete(c.id)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3>{editing ? 'Edit Customer' : 'Add Customer'}</h3>
              <button className="btn btn-ghost" style={{ padding: 6 }} onClick={() => setModalOpen(false)}><X size={15} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label className="label">Name</label>
                <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="label">Email</label>
                <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="label">Phone</label>
                <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label className="label">Billing Address</label>
                <textarea className="input" rows={2} value={form.billing_address} onChange={(e) => setForm({ ...form, billing_address: e.target.value })} />
              </div>
              {error && <div style={{ color: 'var(--coral)', fontSize: 12.5, marginBottom: 14 }}>{error}</div>}
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} type="submit">
                {editing ? 'Save Changes' : 'Add Customer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
