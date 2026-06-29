/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Percent,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  Printer,
  ChevronRight,
  Layers,
  Users,
  Activity,
  Plus
} from 'lucide-react';
import { Sale, AuditLog } from '../types';

interface DashboardProps {
  stats: any;
  onNavigate: (tab: string) => void;
  onPrintInvoice: (sale: Sale) => void;
}

export default function Dashboard({ stats, onNavigate, onPrintInvoice }: DashboardProps) {
  const { metrics, topSellingProducts, topCustomers, recentSales, salesTrend, recentAuditLogs } = stats;

  // Render responsive customized SVG trend line
  const svgChart = useMemo(() => {
    if (!salesTrend || salesTrend.length === 0) return null;
    const maxVal = Math.max(...salesTrend.map((t: any) => t.amount), 6000);
    const minVal = 0;
    const padding = 40;
    const width = 500;
    const height = 160;

    const points = salesTrend.map((t: any, idx: number) => {
      const x = padding + (idx * (width - padding * 2)) / (salesTrend.length - 1);
      const y = height - padding - ((t.amount - minVal) * (height - padding * 2)) / (maxVal - minVal);
      return { x, y, ...t };
    });

    const pathD = points.reduce((acc: string, curr: any, idx: number) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');

    // Area path under line
    const areaD = points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : '';

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
        <line x1={padding} y1={(height) / 2} x2={width - padding} y2={(height) / 2} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e4e4e7" strokeWidth="1" />

        {/* Shaded Area */}
        {areaD && <path d={areaD} fill="url(#gradient)" />}

        {/* Trend Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Value Nodes */}
        {points.map((p: any, idx: number) => (
          <g key={idx} className="group/node">
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#ffffff"
              stroke="#f59e0b"
              strokeWidth="2.5"
              className="cursor-pointer transition-all duration-200 hover:r-6"
            />
            {/* Value Tooltip floating overlay */}
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              className="hidden group-hover/node:block text-[9px] font-mono font-semibold fill-zinc-700"
            >
              ${p.amount}
            </text>
            {/* X Axis labels */}
            <text
              x={p.x}
              y={height - 12}
              textAnchor="middle"
              className="text-[9px] font-mono fill-zinc-400 font-medium"
            >
              {p.date}
            </text>
          </g>
        ))}
      </svg>
    );
  }, [salesTrend]);

  return (
    <div className="space-y-6 page-transition">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-zinc-950 rounded-2xl border border-zinc-800 text-zinc-100 shadow-lg relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-xl font-bold tracking-tight">Welcome to Apex Command, Kangesh</h2>
          <p className="text-zinc-400 text-xs mt-1">
            Platform operations are fully active. All sales metrics and inventory synchronization services are online.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2.5 z-10">
          <button
            onClick={() => onNavigate('sales')}
            className="flex items-center gap-1.5 px-3.5 py-1.8 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg text-xs transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            New Order Entry
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-1.5 px-3.5 py-1.8 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-lg text-xs transition-all border border-zinc-700 cursor-pointer"
          >
            Report Engine
          </button>
        </div>
        {/* Subtle backing background decorative badge */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-5">
          <Layers className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* KPI Stats Widgets Bento Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">Monthly Revenue</span>
            <div className="p-2 bg-zinc-50 rounded-lg text-zinc-600 border border-zinc-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
              ${metrics.monthRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1 mt-1.5">
              {metrics.monthlyGrowth >= 0 ? (
                <div className="flex items-center text-emerald-600 text-xs font-semibold font-mono">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +{metrics.monthlyGrowth}%
                </div>
              ) : (
                <div className="flex items-center text-rose-600 text-xs font-semibold font-mono">
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  {metrics.monthlyGrowth}%
                </div>
              )}
              <span className="text-[10px] text-zinc-400 font-medium">vs. previous month target</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">Operating Expenses</span>
            <div className="p-2 bg-zinc-50 rounded-lg text-zinc-600 border border-zinc-100">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
              ${metrics.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
              <span className="text-[10px] text-zinc-400 font-semibold">Total Cost of Goods Sold (COGS)</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">Gross Margins</span>
            <div className="p-2 bg-zinc-50 rounded-lg text-zinc-600 border border-zinc-100">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
              ${metrics.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="text-[10px] text-emerald-600 font-bold font-mono bg-emerald-50 px-1 py-0.2 rounded">
                {metrics.monthRevenue > 0 ? ((metrics.profit / metrics.monthRevenue) * 100).toFixed(1) : 0}% Gross
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">Profit margin rating</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">Low Stock Alerts</span>
            <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
              <AlertTriangle className={`w-4 h-4 ${metrics.lowStockCount > 0 ? 'text-amber-500 animate-bounce' : 'text-zinc-400'}`} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
              {metrics.lowStockCount} <span className="text-xs text-zinc-400">SKUs</span>
            </h3>
            <div className="flex items-center gap-1 mt-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${metrics.lowStockCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="text-[10px] text-zinc-500 font-semibold">
                {metrics.lowStockCount > 0 ? 'Urgent restocking action required' : 'Product logs healthy'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Graph and Quick Analytics Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-500" />
                Live Revenue Trend
              </h3>
              <p className="text-[10px] text-zinc-400">Aggregated sales invoices from current fiscal cycle</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-[11px] text-zinc-500 hover:text-zinc-800 font-bold tracking-wide flex items-center gap-1 cursor-pointer"
            >
              Advanced BI
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-44 w-full mt-4 flex items-center justify-center">
            {svgChart}
          </div>
        </div>

        {/* Top selling catalog */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col justify-between">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Top Products by Qty</h3>
            <p className="text-[10px] text-zinc-400">Top selling equipment catalog metrics</p>
          </div>

          <div className="space-y-3.5 mt-4 flex-1 overflow-y-auto">
            {topSellingProducts.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-xs">No active products sales.</div>
            ) : (
              topSellingProducts.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-zinc-800 truncate">{p.name}</p>
                    <p className="font-mono text-[9px] text-zinc-400 font-semibold">{p.sku}</p>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono">
                    <span className="font-bold text-zinc-700">{p.qty} units</span>
                    <p className="text-[10px] text-zinc-400 font-semibold">${p.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders and Audit Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Logs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/40">
            <div>
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Recent Operations Invoices</h3>
              <p className="text-[10px] text-zinc-400">Real-time status of commercial trade bills</p>
            </div>
            <button
              onClick={() => onNavigate('sales')}
              className="text-[11px] text-zinc-500 hover:text-zinc-800 font-bold tracking-wide flex items-center gap-1 cursor-pointer"
            >
              Order Terminal
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">
                  <th className="py-2.5 px-4">Invoice</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Total</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {recentSales.map((sale: any) => (
                  <tr key={sale.id} className="hover:bg-zinc-50/60 text-xs transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-800">{sale.invoiceNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-800">{sale.customerName}</div>
                      {sale.customerCompany && (
                        <div className="text-[10px] text-zinc-400">{sale.customerCompany}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-800">
                      ${sale.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sale.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : sale.paymentStatus === 'Partially Paid'
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onPrintInvoice(sale)}
                        title="Print / View Invoice"
                        className="p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded transition-all cursor-pointer inline-flex"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time System Audit Feed */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/40">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Live Session Audit Trails</h3>
            <p className="text-[10px] text-zinc-400">Strict regulatory transaction security logging</p>
          </div>

          <div className="p-4 space-y-3.5 max-h-[220px] overflow-y-auto">
            {recentAuditLogs.map((log: AuditLog) => (
              <div key={log.id} className="text-[11px] flex items-start gap-2 border-l-2 border-zinc-100 pl-3">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-zinc-800">{log.userName}</span>
                    <span className="text-[9px] font-mono text-zinc-400 font-medium">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-zinc-500 mt-0.5">{log.details}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-zinc-50 border-t border-zinc-100 text-center">
            <button
              onClick={() => onNavigate('settings')}
              className="text-[10px] text-zinc-500 hover:text-zinc-800 font-bold uppercase tracking-wider cursor-pointer"
            >
              Inspect Audit Log Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
