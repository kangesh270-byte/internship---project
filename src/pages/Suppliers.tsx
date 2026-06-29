/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Truck,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
  Package,
  CheckCircle,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Supplier, Product } from '../types';

interface SuppliersProps {
  suppliers: Supplier[];
  products: Product[];
  onAddSupplier: (sup: any) => void;
  onUpdateSupplier: (sup: Supplier) => void;
}

export default function Suppliers({
  suppliers,
  products,
  onAddSupplier,
  onUpdateSupplier
}: SuppliersProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  // Form states for new supplier
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const selectedSupplier = useMemo(() => {
    return suppliers.find(s => s.id === selectedSupplierId) || null;
  }, [suppliers, selectedSupplierId]);

  const selectedSupplierProducts = useMemo(() => {
    if (!selectedSupplierId) return [];
    return products.filter(p => p.supplierId === selectedSupplierId);
  }, [products, selectedSupplierId]);

  const handleRegisterSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactName || !email) {
      alert('Please fill out supplier name, contact person, and email.');
      return;
    }
    onAddSupplier({
      name,
      contactName,
      email,
      phone,
      address,
      status
    });

    // Reset Form
    setName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setStatus('Active');
    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (sup: Supplier) => {
    onUpdateSupplier({
      ...sup,
      status: sup.status === 'Active' ? 'Inactive' : 'Active'
    });
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Search and action header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm">
        <div>
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Supplier Directory</h3>
          <p className="text-[10px] text-zinc-400">Approved vendor listing and supply status directory</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-855 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Register Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Suppliers Grid cards list */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${
          selectedSupplierId ? 'lg:col-span-2' : 'lg:col-span-3'
        }`}>
          {suppliers.map(s => {
            const suppliedCount = products.filter(p => p.supplierId === s.id).length;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedSupplierId(selectedSupplierId === s.id ? null : s.id)}
                className={`bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedSupplierId === s.id ? 'border-amber-400 ring-1 ring-amber-400/20' : ''
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-zinc-800 tracking-tight">{s.name}</h4>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(s);
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold select-none cursor-pointer hover:opacity-85 ${
                        s.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <p className="text-zinc-500 text-xs mt-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                    Attn: {s.contactName}
                  </p>

                  <div className="mt-4 space-y-1 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                      {s.email}
                    </div>
                    {s.phone && (
                      <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                        <Phone className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                        {s.phone}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-50 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1 font-semibold">
                    <Package className="w-3.5 h-3.5" />
                    {suppliedCount} products supplied
                  </span>
                  <span className="text-[10px] text-zinc-300">{s.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Supplier Details Sidepanel */}
        {selectedSupplierId && selectedSupplier && (
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-zinc-200 shadow-xl space-y-6 page-transition">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                  Supplier File
                </span>
                <h3 className="text-base font-bold text-zinc-100 mt-2">{selectedSupplier.name}</h3>
                <p className="text-zinc-500 text-xs flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                  {selectedSupplier.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedSupplierId(null)}
                className="p-1 text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Products catalog list from this supplier */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-zinc-500" />
                Supplied SKUs ({selectedSupplierProducts.length})
              </h4>
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {selectedSupplierProducts.length === 0 ? (
                  <div className="p-3 text-[11px] text-zinc-500 border border-dashed border-zinc-800 rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    No registered hardware SKUs supplied by vendor.
                  </div>
                ) : (
                  selectedSupplierProducts.map(p => (
                    <div key={p.id} className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between text-xs hover:bg-zinc-900 transition-colors">
                      <div>
                        <p className="font-semibold text-zinc-300 truncate max-w-[150px]">{p.name}</p>
                        <p className="font-mono text-[9px] text-zinc-500 mt-0.5">{p.sku}</p>
                      </div>
                      <div className="text-right font-mono font-bold text-zinc-400">
                        {p.stock} units
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CRUD Modal: Add Supplier */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden page-transition">
            <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider font-mono">
                Register Vendor Supplier
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSupplier} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Supplier Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco International"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Miller"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Vendor Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. orders@cisco.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Operational Address
                  </label>
                  <input
                    type="text"
                    placeholder="City, State, Zip"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Vendor Status
                </label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600 cursor-pointer">
                    <input
                      type="radio"
                      name="vendor_status"
                      checked={status === 'Active'}
                      onChange={() => setStatus('Active')}
                      className="accent-zinc-800"
                    />
                    Active Vendor
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600 cursor-pointer">
                    <input
                      type="radio"
                      name="vendor_status"
                      checked={status === 'Inactive'}
                      onChange={() => setStatus('Inactive')}
                      className="accent-zinc-800"
                    />
                    Inactive Vendor
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-50">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-xs font-semibold shadow-md cursor-pointer"
                >
                  Confirm Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
