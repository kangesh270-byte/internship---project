/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Download,
  Search,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Boxes,
  Users
} from 'lucide-react';
import { Sale, Customer, Product, InventoryLog } from '../types';

interface ReportsProps {
  sales: Sale[];
  customers: Customer[];
  products: Product[];
  inventoryLogs: InventoryLog[];
}

export default function Reports({ sales, customers, products, inventoryLogs }: ReportsProps) {
  // States
  const [reportType, setReportType] = useState<'revenue' | 'customers' | 'inventory'>('revenue');
  const [dateRange, setDateRange] = useState<'today' | 'month' | 'year' | 'all'>('all');
  const [reportFormat, setReportFormat] = useState<'csv' | 'xlsx' | 'pdf'>('csv');

  const [generatedReport, setGeneratedReport] = useState<any | null>(null);

  // Math totals for the dynamic assemblies
  const assembledReportData = useMemo(() => {
    let title = '';
    let description = '';
    let summaryCards: { label: string; value: string; extra?: string }[] = [];
    let rows: any[] = [];
    let headers: string[] = [];

    const TODAY_STR = '2026-06-29';
    const CURRENT_MONTH = '2026-06';
    const CURRENT_YEAR = '2026';

    if (reportType === 'revenue') {
      title = 'Core Trade Revenues Operational Audit';
      description = `Aggregated transactions report for selected span: Date constraints: ${dateRange.toUpperCase()}`;
      headers = ['Invoice No', 'Client Account', 'Date & Time', 'Method', 'Gross Total'];

      // filter sales
      let filteredSales = sales;
      if (dateRange === 'today') {
        filteredSales = sales.filter(s => s.saleDate.startsWith(TODAY_STR));
      } else if (dateRange === 'month') {
        filteredSales = sales.filter(s => s.saleDate.startsWith(CURRENT_MONTH));
      } else if (dateRange === 'year') {
        filteredSales = sales.filter(s => s.saleDate.startsWith(CURRENT_YEAR));
      }

      const totalValue = filteredSales.reduce((sum, s) => sum + s.total, 0);
      const avgOrder = filteredSales.length > 0 ? totalValue / filteredSales.length : 0;

      summaryCards = [
        { label: 'Total Invoiced Gross', value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
        { label: 'Invoices Counted', value: `${filteredSales.length} Invoices` },
        { label: 'Average Ticket Value', value: `$${avgOrder.toLocaleString(undefined, { minimumFractionDigits: 2 })}` }
      ];

      rows = filteredSales.map(s => {
        const custName = customers.find(c => c.id === s.customerId)?.name || 'Private Portfolio';
        return {
          c1: s.invoiceNumber,
          c2: custName,
          c3: s.saleDate.substring(0, 16).replace('T', ' '),
          c4: s.paymentMethod,
          c5: `$${s.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        };
      });
    } else if (reportType === 'customers') {
      title = 'Corporate Accounts & CRM Portfolios Report';
      description = 'Strategic list of customer spending behaviors, active portfolios, and lifetime valuations.';
      headers = ['Client Name', 'Company Name', 'Contact Email', 'Purchases count', 'LTV Total Spent'];

      let filteredCust = customers;
      if (dateRange === 'today') {
        filteredCust = customers.filter(c => c.createdAt === TODAY_STR);
      }

      const activeProfiles = filteredCust.filter(c => c.salesCount > 0).length;
      const totalSpendAll = filteredCust.reduce((sum, c) => sum + c.totalSpent, 0);

      summaryCards = [
        { label: 'Total CRM Portfolios', value: `${filteredCust.length} Accounts` },
        { label: 'Active Buying Accounts', value: `${activeProfiles} Active` },
        { label: 'Combined Lifetime Value', value: `$${totalSpendAll.toLocaleString(undefined, { minimumFractionDigits: 2 })}` }
      ];

      rows = filteredCust.map(c => ({
        c1: c.name,
        c2: c.company || 'Private Client',
        c3: c.email,
        c4: `${c.salesCount} purchases`,
        c5: `$${c.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      }));
    } else {
      title = 'Warehouse Stock taking & Logistics Report';
      description = 'Complete ledger of warehouse stock quantities, low stock levels, and audit warning SKU metrics.';
      headers = ['SKU Code', 'Product Title', 'Available Stock', 'Low stock alert threshold', 'Warehouse Status'];

      const totalSkuCount = products.length;
      const lowStockCount = products.filter(p => p.status !== 'In Stock').length;
      const totalQty = products.reduce((sum, p) => sum + p.stock, 0);

      summaryCards = [
        { label: 'Total Catalog SKUs', value: `${totalSkuCount} Items` },
        { label: 'Safety alerts Triggered', value: `${lowStockCount} SKUs` },
        { label: 'Total Physical Items', value: `${totalQty.toLocaleString()} Units` }
      ];

      rows = products.map(p => ({
        c1: p.sku,
        c2: p.name,
        c3: `${p.stock} units`,
        c4: `${p.minStockThreshold} units`,
        c5: p.status
      }));
    }

    return { title, description, summaryCards, headers, rows };
  }, [reportType, dateRange, sales, customers, products]);

  // Handlers
  const handleAssembleReport = () => {
    setGeneratedReport(assembledReportData);
  };

  const handleExportDocument = () => {
    const report = generatedReport || assembledReportData;

    if (reportFormat === 'pdf') {
      alert("Print Layout triggered. Use your browser's PDF Print dialog to export.");
      window.print();
      return;
    }

    // Assemble CSV format
    let csvContent = `APEX_BI_SYSTEM_REPORT - ${report.title}\n`;
    csvContent += `${report.description}\n\n`;

    // Headers
    csvContent += report.headers.join(',') + '\n';

    // Rows
    report.rows.forEach((row: any) => {
      const line = [row.c1, row.c2, row.c3, row.c4, row.c5]
        .map((cell: string) => `"${cell.replace(/"/g, '""')}"`)
        .join(',');
      csvContent += line + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexBI_Report_${reportType}_${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Parameter Selection panel */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-5 select-none print:hidden">
        <div>
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Report Generator parameter Cockpit</h3>
          <p className="text-[10px] text-zinc-400 font-medium">Configure filters and export options to assemble system reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
          {/* Parameter 1: report segments */}
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1.5">
              Operations Segment
            </label>
            <select
              value={reportType}
              onChange={e => {
                setReportType(e.target.value as any);
                setGeneratedReport(null);
              }}
              className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-zinc-400 font-semibold text-zinc-700 bg-white cursor-pointer"
            >
              <option value="revenue">Revenues & Invoices</option>
              <option value="customers">Customer CRM Directory</option>
              <option value="inventory">Warehouse Inventory levels</option>
            </select>
          </div>

          {/* Parameter 2: date range */}
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1.5">
              Temporal Cycle
            </label>
            <select
              value={dateRange}
              onChange={e => {
                setDateRange(e.target.value as any);
                setGeneratedReport(null);
              }}
              className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-zinc-400 font-semibold text-zinc-700 bg-white cursor-pointer"
            >
              <option value="all">Complete System Ledger</option>
              <option value="today">Today (June 29, 2026)</option>
              <option value="month">Current Month (June 2026)</option>
              <option value="year">Current Year (2026)</option>
            </select>
          </div>

          {/* Parameter 3: format */}
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1.5">
              Export format
            </label>
            <select
              value={reportFormat}
              onChange={e => setReportFormat(e.target.value as any)}
              className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-zinc-400 font-semibold text-zinc-700 bg-white cursor-pointer"
            >
              <option value="csv">Excel CSV Spreadsheet (.csv)</option>
              <option value="xlsx">Structured Excel XML (.xlsx)</option>
              <option value="pdf">Print Document / PDF (.pdf)</option>
            </select>
          </div>

          <button
            onClick={handleAssembleReport}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 uppercase"
          >
            <FileText className="w-4.5 h-4.5" />
            Assemble Report
          </button>
        </div>
      </div>

      {/* Assembly Document Render */}
      {(generatedReport || assembledReportData) && (
        <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-md space-y-6 page-transition">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-zinc-100 pb-5">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                Apex Corporate Solutions Inc. • System Operations File
              </span>
              <h2 className="text-lg font-bold text-zinc-800 tracking-tight mt-1">
                {(generatedReport || assembledReportData).title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-semibold leading-normal">
                {(generatedReport || assembledReportData).description}
              </p>
            </div>
            <button
              onClick={handleExportDocument}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg text-xs transition-all shadow-sm cursor-pointer select-none print:hidden"
            >
              <Download className="w-4 h-4" />
              Download Document
            </button>
          </div>

          {/* Totals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {(generatedReport || assembledReportData).summaryCards.map((card: any, idx: number) => (
              <div key={idx} className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl">
                <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono font-bold block">
                  {card.label}
                </span>
                <span className="text-lg font-bold text-zinc-800 font-mono tracking-tight block mt-1">
                  {card.value}
                </span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-[9px] uppercase font-mono tracking-wider text-zinc-400 font-bold select-none">
                  {(generatedReport || assembledReportData).headers.map((h: string, idx: number) => (
                    <th key={idx} className="py-2.5 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 font-medium">
                {(generatedReport || assembledReportData).rows.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-50/40">
                    <td className="py-3 px-4 font-mono font-semibold text-zinc-800">{row.c1}</td>
                    <td className="py-3 px-4 font-semibold text-zinc-700">{row.c2}</td>
                    <td className="py-3 px-4 text-zinc-500">{row.c3}</td>
                    <td className="py-3 px-4 text-zinc-500 font-mono">{row.c4}</td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-800">{row.c5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
