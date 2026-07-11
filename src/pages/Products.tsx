import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'
import { Layout } from '../components/Layout'
import { supabase } from '../lib/supabaseClient'
import type { Category, Product } from '../lib/types'

const empty = {
  name: '', category_id: '', price: '', cost: '', stock_quantity: '', reorder_level: '', supplier: ''
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const [p, c] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name')
    ])
    if (!p.error) setProducts(p.data ?? [])
    if (!c.error) setCategories(c.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.supplier ?? '').toLowerCase().includes(q))
  }, [products, query])

  function openNew() {
    setEditing(null)
    setForm(empty)
    setError(null)
    setModalOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      name: p.name,
      category_id: p.category_id ?? '',
      price: String(p.price),
      cost: String(p.cost),
      stock_quantity: String(p.stock_quantity),
      reorder_level: String(p.reorder_level),
      supplier: p.supplier ?? ''
    })
    setError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const payload = {
      name: form.name,
      category_id: form.category_id || null,
      price: Number(form.price),
      cost: Number(form.cost),
      stock_quantity: Number(form.stock_quantity),
      reorder_level: Number(form.reorder_level),
      supplier: form.supplier || null
    }
    if (editing) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id)
      if (error) return setError(error.message)
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) return setError(error.message)
    }
    setModalOpen(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) load()
  }

  return (
    <Layout
      eyebrow="INVENTORY"
      title="Products"
      action={
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={15} /> Add Product
        </button>
      }
    >
      <div className="panel" style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--muted)' }} />
          <input className="input" style={{ paddingLeft: 34 }} placeholder="Search products or suppliers…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="panel table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Product</th><th>Category</th><th>Price</th><th>Cost</th><th>Stock</th><th>Supplier</th><th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} style={{ color: 'var(--muted)' }}>Loading products…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={7} style={{ color: 'var(--muted)' }}>No products found.</td></tr>}
            {filtered.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{p.category?.name || '—'}</td>
                <td className="mono">₹{Number(p.price).toLocaleString('en-IN')}</td>
                <td className="mono">₹{Number(p.cost).toLocaleString('en-IN')}</td>
                <td>
                  <span className={`pill ${p.stock_quantity <= p.reorder_level ? 'pill-coral' : 'pill-mint'}`}>
                    {p.stock_quantity} units
                  </span>
                </td>
                <td>{p.supplier || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: 7 }} onClick={() => openEdit(p)}><Pencil size={13} /></button>
                    <button className="btn btn-danger" style={{ padding: 7 }} onClick={() => handleDelete(p.id)}><Trash2 size={13} /></button>
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
              <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button className="btn btn-ghost" style={{ padding: 6 }} onClick={() => setModalOpen(false)}><X size={15} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label className="label">Name</label>
                <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="label">Category</label>
                <select className="input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">Uncategorized</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label className="label">Price (₹)</label>
                  <input className="input" type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <label className="label">Cost (₹)</label>
                  <input className="input" type="number" step="0.01" required value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label className="label">Stock Qty</label>
                  <input className="input" type="number" required value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
                </div>
                <div>
                  <label className="label">Reorder Level</label>
                  <input className="input" type="number" required value={form.reorder_level} onChange={(e) => setForm({ ...form, reorder_level: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label className="label">Supplier</label>
                <input className="input" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
              </div>
              {error && <div style={{ color: 'var(--coral)', fontSize: 12.5, marginBottom: 14 }}>{error}</div>}
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} type="submit">
                {editing ? 'Save Changes' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
