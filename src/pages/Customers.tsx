/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Users,
  Building,
  Mail,
  Phone,
  ArrowUpDown,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  Clock,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Customer, CustomerAddress, Sale } from '../types';

interface CustomersProps {
  customers: Customer[];
  addresses: CustomerAddress[];
  sales: Sale[];
  onAddCustomer: (cust: any) => void;
  onUpdateCustomer: (cust: Customer) => void;
}

export default function Customers({
  customers,
  addresses,
  sales,
  onAddCustomer,
  onUpdateCustomer
}: CustomersProps) {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'spent' | 'sales'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new customer
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCompany, setNewCustCompany] = useState('');
  const [newCustStatus, setNewCustStatus] = useState<'Active' | 'Inactive'>('Active');

  // Computed Values
  const filteredCustomers = useMemo(() => {
    return customers
      .filter(c => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA: any = a.name;
        let valB: any = b.name;
        if (sortBy === 'spent') {
          valA = a.totalSpent;
          valB = b.totalSpent;
        } else if (sortBy === 'sales') {
          valA = a.salesCount;
          valB = b.salesCount;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [customers, searchTerm, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const selectedCustomerAddresses = useMemo(() => {
    if (!selectedCustomerId) return [];
    return addresses.filter(a => a.customerId === selectedCustomerId);
  }, [addresses, selectedCustomerId]);

  const selectedCustomerSales = useMemo(() => {
    if (!selectedCustomerId) return [];
    return sales.filter(s => s.customerId === selectedCustomerId);
  }, [sales, selectedCustomerId]);

  // Handlers
  const handleSort = (field: 'name' | 'spent' | 'sales') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc'); // default to descending for numbers
    }
  };

  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail) {
      alert('Please fill out customer name and contact email.');
      return;
    }
    onAddCustomer({
      name: newCustName,
      email: newCustEmail,
      phone: newCustPhone,
      company: newCustCompany,
      status: newCustStatus
    });

    // Reset Form
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustCompany('');
    setNewCustStatus('Active');
    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (cust: Customer) => {
    onUpdateCustomer({
      ...cust,
      status: cust.status === 'Active' ? 'Inactive' : 'Active'
    });
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Phone,Company,Status,TotalSpent,SalesCount\n';
    const rows = customers
      .map(c => `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.company || ''}","${c.status}",${c.totalSpent},${c.salesCount}`)
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ApexBI_Customer_Directory.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = () => {
    // Simulated CSV Import that adds a new high-value customer profile
    const nameList = ['Tesla Gigafactory', 'Initech Solutions LLC', 'Soylent Research Systems', 'Dunder Mifflin Paper Co'];
    const emails = ['procure@tesla.com', 'billings@initech.co', 'science@soylent.org', 'scranton@dm.com'];
    const companies = ['Tesla Inc.', 'Initech LLC', 'Soylent Biotech Corp', 'Dunder Mifflin Inc.'];

    const idx = Math.floor(Math.random() * nameList.length);

    onAddCustomer({
      name: nameList[idx],
      email: emails[idx],
      phone: '+1 (555) 777-100' + idx,
      company: companies[idx],
      status: 'Active'
    });

    alert(`Successfully imported dynamic catalog profile: ${nameList[idx]}`);
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            id="search-customers-input"
            type="text"
            placeholder="Search clients by name, email, or company..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-400 placeholder-zinc-400 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <select
            id="status-filter-select"
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-600 bg-white focus:outline-none font-medium cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Export button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-semibold text-zinc-600 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          {/* Import button */}
          <button
            onClick={handleImportCSV}
            className="flex items-center gap-1 px-3 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-semibold text-zinc-600 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Simulate Import
          </button>

          <button
            id="add-customer-button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Customer Directory Table */}
        <div className={`bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col justify-between ${
          selectedCustomerId ? 'lg:col-span-2' : 'lg:col-span-3'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold select-none">
                  <th className="py-3 px-5 cursor-pointer hover:bg-zinc-100/50" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Client Profile
                      <ArrowUpDown className="w-3 h-3 text-zinc-300" />
                    </div>
                  </th>
                  <th className="py-3 px-5">Contact Details</th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-zinc-100/50" onClick={() => handleSort('sales')}>
                    <div className="flex items-center gap-1">
                      Orders Count
                      <ArrowUpDown className="w-3 h-3 text-zinc-300" />
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-zinc-100/50" onClick={() => handleSort('spent')}>
                    <div className="flex items-center gap-1">
                      Total LTV
                      <ArrowUpDown className="w-3 h-3 text-zinc-300" />
                    </div>
                  </th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-400 text-xs">
                      No customer files match your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map(c => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCustomerId(selectedCustomerId === c.id ? null : c.id)}
                      className={`hover:bg-zinc-50/50 text-xs cursor-pointer transition-colors ${
                        selectedCustomerId === c.id ? 'bg-amber-500/[0.02]' : ''
                      }`}
                    >
                      <td className="py-4 px-5">
                        <div className="font-bold text-zinc-800 text-sm">{c.name}</div>
                        {c.company && (
                          <div className="text-[10px] text-zinc-400 font-medium flex items-center gap-1 mt-0.5 uppercase">
                            <Building className="w-3 h-3 text-zinc-300" />
                            {c.company}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5 space-y-0.5">
                        <div className="text-zinc-500 flex items-center gap-1.5 font-medium">
                          <Mail className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                          {c.email}
                        </div>
                        <div className="text-zinc-400 font-mono text-[10px] flex items-center gap-1.5 font-medium">
                          <Phone className="w-3 h-3 text-zinc-300 flex-shrink-0" />
                          {c.phone}
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono text-zinc-700 font-semibold">{c.salesCount} purchases</td>
                      <td className="py-4 px-5 font-mono font-bold text-zinc-800 text-sm">
                        ${c.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(c);
                          }}
                          className={`px-2.5 py-0.8 rounded text-[10px] font-bold cursor-pointer hover:opacity-85 select-none ${
                            c.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50/40 flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider font-mono">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-1 border border-zinc-200 hover:bg-zinc-50 text-zinc-500 rounded disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1 border border-zinc-200 hover:bg-zinc-50 text-zinc-500 rounded disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Customer Side Detailed Panel */}
        {selectedCustomerId && selectedCustomer && (
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-zinc-200 shadow-xl space-y-6 page-transition">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                  Client Profile
                </span>
                <h3 className="text-base font-bold text-zinc-100 mt-2">{selectedCustomer.name}</h3>
                <p className="text-zinc-500 text-xs flex items-center gap-1 mt-1">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-600" />
                  {selectedCustomer.company || 'Private Portfolio'}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="p-1 text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Address cards */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                Addresses
              </h4>
              {selectedCustomerAddresses.length === 0 ? (
                <div className="p-3 text-[11px] text-zinc-500 border border-dashed border-zinc-800 rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  No direct delivery address on file.
                </div>
              ) : (
                selectedCustomerAddresses.map(addr => (
                  <div key={addr.id} className="p-3 border border-zinc-800 bg-zinc-900/50 rounded-xl text-xs space-y-1 relative">
                    {addr.isDefault && (
                      <span className="absolute top-2.5 right-2.5 bg-rose-500/10 text-rose-400 text-[8px] font-mono px-1 py-0.2 rounded border border-rose-500/20 uppercase font-bold">
                        Default
                      </span>
                    )}
                    <p className="font-semibold text-zinc-300">{addr.street}</p>
                    <p className="text-zinc-400">
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p className="text-zinc-500 font-medium">{addr.country}</p>
                  </div>
                ))
              )}
            </div>

            {/* Sales Log for customer */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                Purchase Invoices ({selectedCustomerSales.length})
              </h4>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {selectedCustomerSales.length === 0 ? (
                  <div className="p-3 text-[11px] text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                    No historic orders recorded.
                  </div>
                ) : (
                  selectedCustomerSales.map(sale => (
                    <div key={sale.id} className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between text-xs hover:bg-zinc-900 transition-colors">
                      <div>
                        <p className="font-mono font-bold text-zinc-300">{sale.invoiceNumber}</p>
                        <p className="text-[10px] text-zinc-500">{sale.saleDate.substring(0, 10)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-zinc-300">${sale.total.toLocaleString()}</p>
                        <span className={`inline-block mt-1 text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                          sale.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {sale.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Customer Modal dialog */}
      {isAddModalOpen && (
        <div id="add-customer-modal-backdrop" className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div id="add-customer-modal-panel" className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden page-transition">
            <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider font-mono">
                Register Customer Portfolio
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleRegisterCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-zinc-400 mb-1">
                  Full Customer Name *
                </label>
                <input
                  id="new-customer-name"
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newCustName}
                  onChange={e => setNewCustName(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-zinc-400 mb-1">
                  Client Email Address *
                </label>
                <input
                  id="new-customer-email"
                  type="email"
                  required
                  placeholder="e.g. john@domain.com"
                  value={newCustEmail}
                  onChange={e => setNewCustEmail(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-zinc-400 mb-1">
                    Contact Phone
                  </label>
                  <input
                    id="new-customer-phone"
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newCustPhone}
                    onChange={e => setNewCustPhone(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-zinc-400 mb-1">
                    Corporate Company
                  </label>
                  <input
                    id="new-customer-company"
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={newCustCompany}
                    onChange={e => setNewCustCompany(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-zinc-400 mb-1">
                  Initial Status Profile
                </label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newCustStatus === 'Active'}
                      onChange={() => setNewCustStatus('Active')}
                      className="accent-zinc-800"
                    />
                    Active Portfolio
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newCustStatus === 'Inactive'}
                      onChange={() => setNewCustStatus('Inactive')}
                      className="accent-zinc-800"
                    />
                    Inactive Portfolio
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-50">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  Confirm Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
