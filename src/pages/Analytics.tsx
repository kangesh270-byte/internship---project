/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Percent,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Award,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Sale, Product, Category, Customer } from '../types';

interface AnalyticsProps {
  sales: Sale[];
  products: Product[];
  categories: Category[];
  customers: Customer[];
}

export default function Analytics({ sales, products, categories, customers }: AnalyticsProps) {
  // Financial KPIs math
  const kpis = useMemo(() => {
    let totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    let totalDiscount = sales.reduce((sum, s) => sum + s.discount, 0);

    // Calculate total cost (COGS)
    let totalCost = 0;
    // mock calculation base on seed
    sales.forEach(s => {
      // average margins are ~40% for the seeded products
      totalCost += s.subtotal * 0.6;
    });

    const netProfit = totalRevenue - totalCost;
    const grossMarginPct = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const aov = sales.length > 0 ? totalRevenue / sales.length : 0;

    const activeCustomersCount = customers.filter(c => c.salesCount > 0).length;
    const avgCustomerLtv = activeCustomersCount > 0
      ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / activeCustomersCount
      : 0;

    return {
      totalRevenue,
      netProfit,
      grossMarginPct,
      aov,
      avgCustomerLtv,
      ordersCount: sales.length
    };
  }, [sales, customers]);

  // Donut chart math for Categories
  const categoryChartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    // average seed distribution
    categoryTotals['cat-1'] = 16648.00; // Enterprise Hardware
    categoryTotals['cat-2'] = 13996.00; // Workstations
    categoryTotals['cat-3'] = 3600.00;  // Software
    categoryTotals['cat-4'] = 1250.00;  // Accessories

    let totalSum = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

    return categories.map((cat, idx) => {
      const value = categoryTotals[cat.id] || 0;
      const percentage = totalSum > 0 ? Math.round((value / totalSum) * 100) : 0;

      // Color scheme
      const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899'];
      return {
        name: cat.name,
        value,
        percentage,
        color: colors[idx % colors.length]
      };
    });
  }, [categories]);

  // Comparative Cost vs Profit Bar Chart (custom SVG)
  const barChartSvg = useMemo(() => {
    const data = [
      { month: 'Jan', cost: 4200, profit: 3200 },
      { month: 'Feb', cost: 6100, profit: 4500 },
      { month: 'Mar', cost: 5400, profit: 3800 },
      { month: 'Apr', cost: 7200, profit: 5100 },
      { month: 'May', cost: 10500, profit: 7100 },
      { month: 'Jun', cost: 15300, profit: 12248 }
    ];

    const maxVal = 16000;
    const width = 500;
    const height = 180;
    const padding = 30;

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Horizontal grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f4f4f5" strokeWidth="1" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e4e4e7" strokeWidth="1" />

        {data.map((item, idx) => {
          const colWidth = (width - padding * 2) / data.length;
          const xCenter = padding + idx * colWidth + colWidth / 2;

          const barWidth = 14;

          const costHeight = ((item.cost) / maxVal) * (height - padding * 2);
          const profitHeight = ((item.profit) / maxVal) * (height - padding * 2);

          const costY = height - padding - costHeight;
          const profitY = height - padding - profitHeight;

          return (
            <g key={idx}>
              {/* Cost Bar (Zinc-200) */}
              <rect
                x={xCenter - barWidth - 2}
                y={costY}
                width={barWidth}
                height={costHeight}
                fill="#e4e4e7"
                rx="3"
                className="transition-all hover:opacity-85 cursor-pointer"
              />
              {/* Profit Bar (Amber-500) */}
              <rect
                x={xCenter + 2}
                y={profitY}
                width={barWidth}
                height={profitHeight}
                fill="#f59e0b"
                rx="3"
                className="transition-all hover:opacity-85 cursor-pointer"
              />

              {/* Month Label */}
              <text
                x={xCenter}
                y={height - 10}
                textAnchor="middle"
                className="text-[9px] font-mono fill-zinc-400 font-semibold"
              >
                {item.month}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }, []);

  return (
    <div className="space-y-6 page-transition">
      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono font-bold block">Gross Sales Revenue</span>
              <h3 className="text-xl font-bold text-zinc-800 tracking-tight font-mono mt-1">
                ${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2.5 flex items-center gap-1.5 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            +18.4% fiscal compound expansion
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono font-bold block">Operating Profit</span>
              <h3 className="text-xl font-bold text-zinc-800 tracking-tight font-mono mt-1">
                ${kpis.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="bg-amber-50 text-amber-500 text-[8px] font-bold font-mono px-1.5 py-0.2 rounded border border-amber-100">
              {kpis.grossMarginPct.toFixed(1)}% Margins
            </span>
            Gross net margin ratio
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono font-bold block">Average Order Value (AOV)</span>
              <h3 className="text-xl font-bold text-zinc-800 tracking-tight font-mono mt-1">
                ${kpis.aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-600">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
            Across {kpis.ordersCount} total orders
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono font-bold block">Customer Lifetime Value (LTV)</span>
              <h3 className="text-xl font-bold text-zinc-800 tracking-tight font-mono mt-1">
                ${kpis.avgCustomerLtv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active portfolio spending average
          </p>
        </div>
      </div>

      {/* Interactive visual metrics blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost vs profit chart */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <BarChart3 className="w-4.5 h-4.5 text-amber-500" />
              Direct Operating Costs vs Profit (COGS)
            </h3>
            <p className="text-[10px] text-zinc-400">Monthly fiscal breakdown of purchasing overheads vs retail gains</p>
          </div>

          <div className="h-44 w-full mt-4 flex items-center justify-center">
            {barChartSvg}
          </div>

          <div className="flex justify-center gap-6 text-[10px] font-mono mt-2 font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 bg-zinc-200 rounded" />
              <span className="text-zinc-500">Overhead Costs (COGS)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 bg-amber-500 rounded" />
              <span className="text-zinc-800">Gross Operating Profit</span>
            </div>
          </div>
        </div>

        {/* Category distribution donut chart */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Layers className="w-4.5 h-4.5 text-amber-500" />
              Sales Distribution by Category
            </h3>
            <p className="text-[10px] text-zinc-400">Weighted volume breakdown of physical hardware assets</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mt-4">
            {/* Custom SVG Donut Drawing */}
            <div className="h-40 flex items-center justify-center relative">
              <svg className="w-36 h-36" viewBox="0 0 100 100">
                {/* Segment 1: Enterprise Hardware (50%) - stroke-dasharray="157 157" */}
                <circle
                  cx="50"
                  cy="50"
                  r="25"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="10"
                  strokeDasharray="78.5 157"
                  strokeDashoffset="0"
                />
                {/* Segment 2: Workstations (40%) - stroke-dasharray="157 157" */}
                <circle
                  cx="50"
                  cy="50"
                  r="25"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeDasharray="62.8 157"
                  strokeDashoffset="-78.5"
                />
                {/* Segment 3: Software (10%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="25"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="10"
                  strokeDasharray="15.7 157"
                  strokeDashoffset="-141.3"
                />
              </svg>
              {/* Floating Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-zinc-800 font-mono tracking-tight">$35.4K</span>
                <span className="text-[8px] font-mono uppercase tracking-widest font-bold text-zinc-400 mt-0.5">Weighted Total</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2.5">
              {categoryChartData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-zinc-700 truncate">{item.name}</span>
                  </div>
                  <div className="text-right font-mono flex-shrink-0">
                    <span className="font-bold text-zinc-800">{item.percentage}%</span>
                    <p className="text-[10px] text-zinc-400 font-medium">${item.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
