/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  X,
  Printer,
  FileText,
  Mail,
  Building,
  User,
  CreditCard,
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Sale, Customer, Employee, Product, SaleItem, SystemSettings } from '../types';

interface InvoiceModalProps {
  sale: Sale | null;
  customers: Customer[];
  employees: Employee[];
  products: Product[];
  saleItems: SaleItem[];
  settings: SystemSettings;
  onClose: () => void;
}

export default function InvoiceModal({
  sale,
  customers,
  employees,
  products,
  saleItems,
  settings,
  onClose
}: InvoiceModalProps) {
  if (!sale) return null;

  const customer = useMemo(() => {
    return customers.find(c => c.id === sale.customerId) || null;
  }, [customers, sale]);

  const employee = useMemo(() => {
    return employees.find(e => e.id === sale.employeeId) || null;
  }, [employees, sale]);

  const activeItems = useMemo(() => {
    return saleItems.filter(si => si.saleId === sale.id).map(si => {
      const prod = products.find(p => p.id === si.productId);
      return {
        ...si,
        productName: prod?.name || 'Deleted Hardware SKU',
        sku: prod?.sku || 'UNKNOWN'
      };
    });
  }, [saleItems, sale, products]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 print:p-0 print:static print:bg-white">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden page-transition print:border-none print:shadow-none print:rounded-none">
        {/* Header Controls (Hidden during print) */}
        <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <FileText className="w-4.5 h-4.5 text-zinc-500" />
            Trade Invoice Viewer
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Invoices
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Invoice Main Body Layout */}
        <div className="p-8 space-y-6 print:p-4 print:text-zinc-950">
          {/* Brand & Invoice Identifiers */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black text-sm tracking-widest text-zinc-950 uppercase">
                  APEX<span className="text-amber-500">BI</span>
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 font-semibold uppercase font-mono leading-none tracking-wide">
                Apex Corporate Solutions Inc. • operations@apexcore.io
              </p>
              <p className="text-[9px] text-zinc-400 mt-0.5 leading-none font-medium">
                HQ: 500 Technology Dr, Building B, San Jose, CA
              </p>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Invoice {sale.paymentStatus}
              </span>
              <h2 className="text-xl font-bold font-mono text-zinc-800 tracking-tight mt-2.5">
                {sale.invoiceNumber}
              </h2>
              <p className="text-[10px] text-zinc-400 font-medium font-mono uppercase mt-0.5 flex items-center gap-1 justify-end">
                <Calendar className="w-3 h-3 text-zinc-300" />
                {sale.saleDate.substring(0, 10)} {sale.saleDate.substring(11, 16)}
              </p>
            </div>
          </div>

          {/* Billing & staff authorizations */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-zinc-50 border border-zinc-100 rounded-xl print:bg-white print:border-none print:p-0">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-zinc-400 block mb-1">
                Billed To (Client Account)
              </span>
              <p className="text-xs font-bold text-zinc-800">{customer?.name}</p>
              {customer?.company && (
                <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
                  <Building className="w-3 h-3 text-zinc-400" />
                  {customer.company}
                </p>
              )}
              <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                <Mail className="w-3 h-3 text-zinc-300" />
                {customer?.email}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-zinc-400 block mb-1">
                Authorized Sales Agent
              </span>
              <p className="text-xs font-bold text-zinc-700">{employee?.name}</p>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5 flex items-center gap-1 justify-end">
                <User className="w-3 h-3 text-zinc-400" />
                {employee?.department}
              </p>
              <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1 justify-end">
                <CreditCard className="w-3 h-3 text-zinc-300" />
                {sale.paymentMethod} Payment Method
              </p>
            </div>
          </div>

          {/* Line itemizations */}
          <div className="space-y-2">
            <table className="w-full text-left border-collapse text-xs font-medium">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-[9px] uppercase font-mono tracking-wider text-zinc-400 font-bold select-none">
                  <th className="py-2 px-3">Item Catalog SKU</th>
                  <th className="py-2 px-3">Hardware description</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Unit Price</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {activeItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/20">
                    <td className="py-2.5 px-3 font-mono text-[10px] text-zinc-400">{item.sku}</td>
                    <td className="py-2.5 px-3 font-semibold text-zinc-800">{item.productName}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-zinc-700">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-500">${item.unitPrice.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-800">${item.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Totals Block */}
          <div className="flex justify-end pt-4 border-t border-zinc-100 select-none">
            <div className="w-64 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400 font-semibold">
                <span>Subtotal</span>
                <span>${sale.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-rose-500 font-semibold">
                  <span>Applied Discount</span>
                  <span>-${sale.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400 font-semibold">
                <span>Sales Tax ({settings.taxRate}%)</span>
                <span>${sale.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-zinc-800 font-bold text-sm pt-2 border-t border-zinc-100">
                <span className="font-sans uppercase tracking-wider text-[11px] text-zinc-500">Gross total bill</span>
                <span>${sale.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Internal memos / payment status confirmation */}
          <div className="p-4 border border-zinc-100 rounded-xl flex items-center justify-between text-xs font-medium bg-zinc-50/20">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-zinc-400 block">
                Billing Transaction Memo
              </span>
              <p className="text-zinc-600 mt-1">
                {sale.notes || 'Standard terms, thank you for choosing Apex BI solutions.'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold uppercase font-sans tracking-wide">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Paid Confirmed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
