/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  History,
  PlusCircle,
  X,
  Search,
  Filter,
  CheckCircle,
  Truck
} from 'lucide-react';
import { Product, InventoryLog, Supplier } from '../types';

interface InventoryProps {
  products: Product[];
  inventoryLogs: InventoryLog[];
  suppliers: Supplier[];
  onRestockProduct: (productId: string, qty: number, notes: string) => void;
}

export default function Inventory({
  products,
  inventoryLogs,
  suppliers,
  onRestockProduct
}: InventoryProps) {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  // Form states for restocking
  const [restockProductId, setRestockProductId] = useState('');
  const [restockQty, setRestockQty] = useState(10);
  const [restockNotes, setRestockNotes] = useState('Quarterly supply replenishment');

  // Filter logs list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLowStock = !showLowStockOnly || p.status !== 'In Stock';
      return matchesSearch && matchesLowStock;
    });
  }, [products, searchTerm, showLowStockOnly]);

  const sortedLogs = useMemo(() => {
    return [...inventoryLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [inventoryLogs]);

  // Handlers
  const handleOpenRestockModal = (productId?: string) => {
    if (productId) {
      setRestockProductId(productId);
    } else if (products.length > 0) {
      setRestockProductId(products[0].id);
    }
    setIsRestockModalOpen(true);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProductId || restockQty <= 0) {
      alert('Please specify a valid product and positive restocking volume.');
      return;
    }
    onRestockProduct(restockProductId, parseInt(restockQty.toString()), restockNotes);

    // Reset Form
    setRestockQty(10);
    setRestockNotes('Quarterly supply replenishment');
    setIsRestockModalOpen(false);
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Top Warning Banner if low stocks exist */}
      {products.some(p => p.status !== 'In Stock') && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-800 text-xs leading-normal">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="font-bold">System Warning: Deficient Warehousing Stock Identified</p>
            <p className="text-amber-700 font-medium mt-1">
              One or more items in the hardware catalog have depleted below safety thresholds. Restocking actions are recommended to prevent order fulfillment disruption.
            </p>
          </div>
        </div>
      )}

      {/* Primary KPI overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-zinc-50 rounded-xl text-zinc-700 border border-zinc-100">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono font-bold block">Total Catalog Items</span>
            <span className="text-xl font-bold text-zinc-800 font-mono">{products.length} SKUs</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono font-bold block">Deficient Alerts</span>
            <span className="text-xl font-bold text-zinc-800 font-mono">
              {products.filter(p => p.status !== 'In Stock').length} products
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono font-bold block">Sufficient Stock</span>
            <span className="text-xl font-bold text-zinc-800 font-mono">
              {products.filter(p => p.status === 'In Stock').length} products
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Stock Taking Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-zinc-50/25">
            <div>
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Live Inventory Audit</h3>
              <p className="text-[10px] text-zinc-400">Manage supply levels and verify physical count levels</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Search SKU/name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-400 placeholder-zinc-400 font-medium"
              />
              <button
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                  showLowStockOnly
                    ? 'bg-amber-50 text-amber-600 border-amber-250'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                Alerts
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold select-none">
                  <th className="py-2.5 px-4">Item SKU</th>
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4 font-mono text-center">Available Stock</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-center">Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-50/50 text-xs transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-500">{p.sku}</td>
                    <td className="py-3 px-4 font-semibold text-zinc-800">{p.name}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-zinc-700">{p.stock} units</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : p.status === 'Low Stock'
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenRestockModal(p.id)}
                        className="p-1 px-2.5 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 text-[10px] font-bold rounded-md transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-zinc-500" />
                        Refill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Inventory Audit Logs Log ledger */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/25">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <History className="w-4 h-4 text-zinc-500" />
              Stock Operations Ledger
            </h3>
            <p className="text-[10px] text-zinc-400">Audit logs of all shipping & logistics movements</p>
          </div>

          <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto">
            {sortedLogs.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 text-xs">No stock log transactions recorded.</div>
            ) : (
              sortedLogs.map((log: any) => {
                const prod = products.find(p => p.id === log.productId);
                return (
                  <div key={log.id} className="text-xs flex items-start gap-2.5 border-l-2 border-zinc-100 pl-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-zinc-800 truncate block max-w-[140px]" title={prod?.name}>
                          {prod?.name || 'Deleted Product'}
                        </span>
                        <span className={`px-1 rounded text-[8px] font-mono font-bold uppercase ${
                          log.type === 'Stock In' || log.type === 'Adjustment' && log.quantity > 0
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {log.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 mt-1">
                        <span>Qty: {log.quantity > 0 ? `+${log.quantity}` : log.quantity}</span>
                        <span>•</span>
                        <span>{log.previousStock} <ArrowRight className="w-2.5 h-2.5 inline-block" /> {log.newStock}</span>
                      </div>
                      <p className="text-zinc-500 text-[11px] leading-normal mt-1">{log.notes}</p>
                      <p className="text-[9px] font-mono text-zinc-400 mt-1 font-semibold uppercase">By: {log.performedBy}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Restocking adjustment form modal */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden page-transition">
            <div className="px-5 py-3.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">
                Logistics Replenishment File
              </span>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Product SKU to Restock
                </label>
                <select
                  value={restockProductId}
                  onChange={e => setRestockProductId(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 bg-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Quantity to Replenish
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={restockQty}
                  onChange={e => setRestockQty(parseInt(e.target.value) || 0)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-mono text-zinc-700"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Transaction Notes
                </label>
                <textarea
                  required
                  rows={2}
                  value={restockNotes}
                  onChange={e => setRestockNotes(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-50">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-xs font-semibold shadow-md cursor-pointer flex items-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" />
                  Apply Replenishment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
