import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'
import { Layout } from '../components/Layout'
import { supabase } from '../lib/supabaseClient'
import type { Customer, Employee, PaymentStatus, Product, Sale } from '../lib/types'

interface LineDraft {
  product_id: string
  quantity: number
}

function currency(n: number) {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

function nextInvoiceNo(existing: Sale[]) {
  const year = new Date().getFullYear()
  const count = existing.length + 1
  return `INV-${year}-${String(count).padStart(4, '0')}`
}

export function Sales() {
  const [sales, setSales] = useState<(Sale & { customer?: Customer; employee?: Employee })[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [customerId, setCustomerId] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid')
  const [discountPct, setDiscountPct] = useState('0')
  const [taxPct, setTaxPct] = useState('18')
  const [lines, setLines] = useState<LineDraft[]>([{ product_id: '', quantity: 1 }])

  async function load() {
    setLoading(true)
    const [s, c, e, p] = await Promise.all([
      supabase.from('sales').select('*, customer:customers(*), employee:employees(*)').order('sale_date', { ascending: false }),
      supabase.from('customers').select('*').order('name'),
      supabase.from('employees').select('*').order('full_name'),
      supabase.from('products').select('*').order('name')
    ])
    if (!s.error) setSales((s.data as any) ?? [])
    if (!c.error) setCustomers(c.data ?? [])
    if (!e.error) setEmployees(e.data ?? [])
    if (!p.error) setProducts(p.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function resetForm() {
    setCustomerId('')
    setEmployeeId('')
    setPaymentStatus('paid')
    setDiscountPct('0')
    setTaxPct('18')
    setLines([{ product_id: '', quantity: 1 }])
    setError(null)
  }

  function openNew() {
    resetForm()
    setModalOpen(true)
  }

  function updateLine(i: number, patch: Partial<LineDraft>) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))
  }

  const subtotal = useMemo(() => {
    return lines.reduce((sum, l) => {
      const p = products.find((pr) => pr.id === l.product_id)
      return sum + (p ? Number(p.price) * l.quantity : 0)
    }, 0)
  }, [lines, products])

  const discount = subtotal * (Number(discountPct || 0) / 100)
  const tax = (subtotal - discount) * (Number(taxPct || 0) / 100)
  const total = subtotal - discount + tax

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const validLines = lines.filter((l) => l.product_id && l.quantity > 0)
    if (validLines.length === 0) return setError('Add at least one product line.')

    setSaving(true)
    const invoice_no = nextInvoiceNo(sales)

    const { data: saleRow, error: saleErr } = await supabase
      .from('sales')
      .insert({
        invoice_no,
        customer_id: customerId || null,
        employee_id: employeeId || null,
        sale_date: new Date().toISOString().slice(0, 10),
        subtotal,
        discount,
        tax,
        total,
        payment_status: paymentStatus
      })
      .select()
      .single()

    if (saleErr || !saleRow) {
      setSaving(false)
      return setError(saleErr?.message ?? 'Could not create sale.')
    }

    const itemRows = validLines.map((l) => {
      const p = products.find((pr) => pr.id === l.product_id)!
      return {
        sale_id: saleRow.id,
        product_id: l.product_id,
        quantity: l.quantity,
        unit_price: p.price,
        line_total: Number(p.price) * l.quantity
      }
    })

    const { error: itemsErr } = await supabase.from('sale_items').insert(itemRows)
    if (itemsErr) {
      setSaving(false)
      return setError(itemsErr.message)
    }

    // Decrement stock for each line
    await Promise.all(
      validLines.map((l) => {
        const p = products.find((pr) => pr.id === l.product_id)!
        return supabase.from('products').update({ stock_quantity: Math.max(0, p.stock_quantity - l.quantity) }).eq('id', l.product_id)
      })
    )

    setSaving(false)
    setModalOpen(false)
    load()
  }

  async function updateStatus(id: string, status: PaymentStatus) {
    await supabase.from('sales').update({ payment_status: status }).eq('id', id)
    load()
  }

  return (
    <Layout
      eyebrow="POS"
      title="Sales & Invoicing"
      action={<button className="btn btn-primary" onClick={openNew}><Plus size={15} /> New Sale</button>}
    >
      <div className="panel table-wrap">
        <table className="data">
          <thead>
            <tr><th>Invoice</th><th>Customer</th><th>Employee</th><th>Date</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{ color: 'var(--muted)' }}>Loading transactions…</td></tr>}
            {!loading && sales.length === 0 && <tr><td colSpan={6} style={{ color: 'var(--muted)' }}>No sales recorded yet.</td></tr>}
            {sales.map((s) => (
              <tr key={s.id}>
                <td className="mono" style={{ fontWeight: 600 }}>{s.invoice_no}</td>
                <td>{s.customer?.name || 'Walk-in'}</td>
                <td>{s.employee?.full_name || '—'}</td>
                <td className="mono">{new Date(s.sale_date).toLocaleDateString('en-IN')}</td>
                <td className="mono">{currency(Number(s.total))}</td>
                <td>
                  <select
                    className="input"
                    style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}
                    value={s.payment_status}
                    onChange={(e) => updateStatus(s.id, e.target.value as PaymentStatus)}
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3>New Sale Entry</h3>
              <button className="btn btn-ghost" style={{ padding: 6 }} onClick={() => setModalOpen(false)}><X size={15} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label className="label">Customer</label>
                  <select className="input" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                    <option value="">Walk-in customer</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Sales Employee</label>
                  <select className="input" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                    <option value="">Unassigned</option>
                    {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                  </select>
                </div>
              </div>

              <label className="label">Line Items</label>
              {lines.map((l, i) => {
                const p = products.find((pr) => pr.id === l.product_id)
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 90px 32px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <select className="input" value={l.product_id} onChange={(e) => updateLine(i, { product_id: e.target.value })}>
                      <option value="">Select product</option>
                      {products.map((pr) => <option key={pr.id} value={pr.id}>{pr.name} — {currency(Number(pr.price))}</option>)}
                    </select>
                    <input className="input" type="number" min={1} value={l.quantity} onChange={(e) => updateLine(i, { quantity: Number(e.target.value) })} />
                    <div className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                      {p ? currency(Number(p.price) * l.quantity) : '—'}
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ padding: 6 }}
                      onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )
              })}
              <button
                type="button"
                className="btn btn-ghost"
                style={{ marginBottom: 18, fontSize: 12.5 }}
                onClick={() => setLines((prev) => [...prev, { product_id: '', quantity: 1 }])}
              >
                <Plus size={13} /> Add line
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label className="label">Discount %</label>
                  <input className="input" type="number" value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} />
                </div>
                <div>
                  <label className="label">Tax %</label>
                  <input className="input" type="number" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} />
                </div>
                <div>
                  <label className="label">Payment Status</label>
                  <select className="input" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="panel" style={{ padding: 14, marginBottom: 18, background: 'var(--ink)' }}>
                <Row label="Subtotal" value={currency(subtotal)} />
                <Row label={`Discount (${discountPct || 0}%)`} value={`− ${currency(discount)}`} />
                <Row label={`Tax (${taxPct || 0}%)`} value={`+ ${currency(tax)}`} />
                <div style={{ borderTop: '1px solid var(--line)', marginTop: 8, paddingTop: 8 }}>
                  <Row label="Total" value={currency(total)} bold />
                </div>
              </div>

              {error && <div style={{ color: 'var(--coral)', fontSize: 12.5, marginBottom: 14 }}>{error}</div>}
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} type="submit" disabled={saving}>
                {saving ? 'Recording sale…' : 'Record Sale & Generate Invoice'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: bold ? 15 : 13, fontWeight: bold ? 700 : 500, marginBottom: 4 }}>
      <span style={{ color: bold ? 'var(--text)' : 'var(--muted)' }}>{label}</span>
      <span className="mono">{value}</span>
    </div>
  )
}
