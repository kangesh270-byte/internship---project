/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Activity,
  User,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Layers,
  Save,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { SystemSettings, AuditLog, UserRole } from '../types';

interface SettingsProps {
  settings: SystemSettings;
  auditLogs: AuditLog[];
  onUpdateSettings: (settings: SystemSettings) => void;
}

export default function SettingsPage({
  settings,
  auditLogs,
  onUpdateSettings
}: SettingsProps) {
  // Local form state
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [companyEmail, setCompanyEmail] = useState(settings.companyEmail);
  const [currency, setCurrency] = useState(settings.currency);
  const [taxRate, setTaxRate] = useState(settings.taxRate);
  const [lowStockAlert, setLowStockAlert] = useState(settings.lowStockAlert);
  const [enableLogs, setEnableLogs] = useState(settings.enableRealtimeLogs || true);

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'roles' | 'audits'>('profile');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      companyName,
      companyEmail,
      currency,
      taxRate: parseFloat(taxRate.toString()),
      lowStockAlert,
      enableRealtimeLogs: enableLogs
    } as any);

    alert('Success: Platform operations saved securely.');
  };

  const rolesMatrix: { role: UserRole; desc: string; permissions: string[] }[] = [
    {
      role: 'Admin',
      desc: 'Full administrative access and terminal control permissions.',
      permissions: ['Manage Users', 'Configure System Pricing', 'Approve Invoices', 'Update Catalog', 'Refill stock', 'Inspect Logs']
    },
    {
      role: 'Manager',
      desc: 'Supervises business operations, directories, and staff target designations.',
      permissions: ['Configure System Pricing', 'Approve Invoices', 'Update Catalog', 'Refill stock', 'Inspect Logs']
    },
    {
      role: 'Sales Executive',
      desc: 'Authorized to execute POS trade checkouts and client management.',
      permissions: ['POS order creations', 'Customer management', 'Browse Catalog']
    },
    {
      role: 'Inventory Manager',
      desc: 'Maintains catalog records and restocking actions.',
      permissions: ['Update Catalog', 'Refill stock', 'Audit shipping lists']
    },
    {
      role: 'Viewer',
      desc: 'Read-only financial audit views.',
      permissions: ['Read Reports', 'Browse dashboard and business charts']
    }
  ];

  return (
    <div className="space-y-6 page-transition">
      {/* Sub tabs selectors */}
      <div className="flex border-b border-zinc-200 select-none">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeSubTab === 'profile'
              ? 'border-zinc-900 text-zinc-900 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          Company Profile Settings
        </button>
        <button
          onClick={() => setActiveSubTab('roles')}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeSubTab === 'roles'
              ? 'border-zinc-900 text-zinc-900 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          System Security & Role Matrix
        </button>
        <button
          onClick={() => setActiveSubTab('audits')}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeSubTab === 'audits'
              ? 'border-zinc-900 text-zinc-900 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          Dynamic Transaction Audit Trail
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Sub-tab 1: profile form config */}
        {activeSubTab === 'profile' && (
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm max-w-2xl">
            <div className="border-b border-zinc-150 pb-3.5 mb-5">
              <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-wider font-mono">Company Profile & Operations</h3>
              <p className="text-[10px] text-zinc-400">Configure brand tags and fiscal checkout factors</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1.5">
                    Authorized Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1.5">
                    Corporate operations email
                  </label>
                  <input
                    type="email"
                    required
                    value={companyEmail}
                    onChange={e => setCompanyEmail(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1.5">
                    Base Platform Currency Code
                  </label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 bg-white"
                  >
                    <option value="USD">USD ($) - United States Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="SGD">SGD ($) - Singapore Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1.5">
                    Invoice Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="50"
                    value={taxRate}
                    onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-mono text-zinc-700"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 space-y-3.5">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-zinc-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lowStockAlert}
                    onChange={e => setLowStockAlert(e.target.checked)}
                    className="h-4 w-4 rounded text-zinc-900 border-zinc-300 focus:ring-transparent accent-zinc-900"
                  />
                  Tigger automated notifications for low stock alert SKU counts
                </label>
                <label className="flex items-center gap-2.5 text-xs font-semibold text-zinc-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableLogs}
                    onChange={e => setEnableLogs(e.target.checked)}
                    className="h-4 w-4 rounded text-zinc-900 border-zinc-300 focus:ring-transparent accent-zinc-900"
                  />
                  Store real-time transactions in system audit files
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <button
                  type="submit"
                  className="px-4.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save Platform configuration
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sub-tab 2: Role Authorization descriptions */}
        {activeSubTab === 'roles' && (
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm max-w-3xl space-y-5">
            <div className="border-b border-zinc-150 pb-3">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Shield className="w-4.5 h-4.5 text-amber-500" />
                System Access Privileges Matrix
              </h3>
              <p className="text-[10px] text-zinc-400 font-medium">Verify system action bounds across hierarchical role levels</p>
            </div>

            <div className="space-y-4">
              {rolesMatrix.map((item, idx) => (
                <div key={idx} className="p-4 border border-zinc-100 rounded-xl bg-zinc-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-xs transition-shadow">
                  <div className="max-w-md">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-bold text-zinc-800 text-xs">{item.role}</span>
                    </div>
                    <p className="text-zinc-500 text-[11px] font-medium leading-normal mt-1">{item.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-w-xs md:justify-end">
                    {item.permissions.map((p, i) => (
                      <span key={i} className="bg-white border border-zinc-200 px-2 py-0.5 rounded text-[9px] font-semibold text-zinc-500 font-mono uppercase">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-tab 3: Audit Trails ledger */}
        {activeSubTab === 'audits' && (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/20 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Activity className="w-4.5 h-4.5 text-zinc-500" />
                  Dynamic System Action Logs
                </h3>
                <p className="text-[10px] text-zinc-400">Chronological logging ledger for regulatory and compliance audits</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-medium">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100 text-[9px] uppercase font-mono tracking-wider text-zinc-400 font-bold select-none">
                    <th className="py-2.5 px-4">Log ID</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Operator</th>
                    <th className="py-2.5 px-4">Action</th>
                    <th className="py-2.5 px-4">Security Record Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-400">No security audit logs captured.</td>
                    </tr>
                  ) : (
                    auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-zinc-50/50">
                        <td className="py-3.5 px-4 font-mono text-[10px] text-zinc-400">{log.id}</td>
                        <td className="py-3.5 px-4 text-zinc-500">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="py-3.5 px-4 font-bold text-zinc-700">{log.userName}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[10px] bg-zinc-100 border border-zinc-200 px-1.5 py-0.2 rounded text-zinc-600 uppercase font-semibold">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-600 pr-6 leading-relaxed">{log.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
