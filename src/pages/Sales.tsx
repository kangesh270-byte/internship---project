/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  User,
  Percent,
  CheckCircle2,
  X,
  CreditCard,
  Building,
  Tag,
  Boxes,
  AlertTriangle,
  Receipt,
  FileText,
  Coins
} from 'lucide-react';
import { Product, Customer, Employee, Sale } from '../types';

interface SalesProps {
  products: Product[];
  customers: Customer[];
  employees: Employee[];
  taxRate: number;
  onAddSale: (saleData: any) => Sale;
  onPrintInvoice: (sale: Sale) => void;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const CURRENCIES = {
  USD: { symbol: '$', rate: 1.00, label: 'US Dollar', bills: [1, 5, 10, 20, 50, 100], coins: [0.25, 0.10, 0.05, 0.01] },
  EUR: { symbol: '€', rate: 0.92, label: 'Euro Cash', bills: [5, 10, 20, 50, 100, 200], coins: [2, 1, 0.50, 0.20, 0.10, 0.05] },
  GBP: { symbol: '£', rate: 0.79, label: 'British Pound Cash', bills: [5, 10, 20, 50], coins: [2, 1, 0.50, 0.20, 0.10, 0.05] },
  INR: { symbol: '₹', rate: 83.50, label: 'Indian Rupee Cash', bills: [10, 20, 50, 100, 200, 500], coins: [10, 5, 2, 1] },
  JPY: { symbol: '¥', rate: 160.20, label: 'Japanese Yen Cash', bills: [1000, 2000, 5000, 10000], coins: [500, 100, 50, 10, 5, 1] },
  CAD: { symbol: 'C$', rate: 1.37, label: 'Canadian Cash', bills: [5, 10, 20, 50, 100], coins: [2, 1, 0.25, 0.10, 0.05] },
  AUD: { symbol: 'A$', rate: 1.50, label: 'Australian Cash', bills: [5, 10, 20, 50, 100], coins: [2, 1, 0.25, 0.10, 0.05] }
};

export default function Sales({
  products,
  customers,
  employees,
  taxRate,
  onAddSale,
  onPrintInvoice
}: SalesProps) {
  // POS States
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('emp-1'); // default to admin Kangesh
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit Card' | 'Bank Transfer' | 'PayPal'>('Credit Card');
  const [notes, setNotes] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD' | 'AUD'>('USD');
  const [cashTendered, setCashTendered] = useState<number>(0);

  const currentRate = CURRENCIES[selectedCurrency].rate;
  const currentSymbol = CURRENCIES[selectedCurrency].symbol;

  const formatVal = (amountInUSD: number) => {
    const converted = amountInUSD * currentRate;
    return `${currentSymbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Search filter
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || p.categoryId === selectedCategory;
      const isAvailable = p.stock > 0; // only show products that have stock to sell
      return matchesSearch && matchesCat && isAvailable;
    });
  }, [products, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    // Unique categories from products
    const uniqueIds = Array.from(new Set(products.map(p => p.categoryId)));
    return uniqueIds;
  }, [products]);

  // Cart operations
  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert(`Cannot add more. Available warehousing stock for ${product.name} is ${product.stock} units.`);
        return;
      }
      setCart(
        cart.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, val: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    const targetQty = item.quantity + val;
    if (targetQty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (targetQty > item.product.stock) {
      alert(`Cannot add more. Only ${item.product.stock} units available in stock.`);
      return;
    }

    setCart(
      cart.map(i => (i.product.id === productId ? { ...i, quantity: targetQty } : i))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // Pricing math
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const taxAmount = useMemo(() => {
    const base = Math.max(0, cartSubtotal - discount);
    return parseFloat((base * (taxRate / 100)).toFixed(2));
  }, [cartSubtotal, discount, taxRate]);

  const cartTotal = useMemo(() => {
    return parseFloat((cartSubtotal - discount + taxAmount).toFixed(2));
  }, [cartSubtotal, discount, taxAmount]);

  // Change breakdown calculation
  const totalInSelectedCurrency = cartTotal * currentRate;
  const changeInSelectedCurrency = Math.max(0, cashTendered - totalInSelectedCurrency);

  const changeBreakdown = useMemo(() => {
    if (changeInSelectedCurrency <= 0) return [];
    let rem = parseFloat(changeInSelectedCurrency.toFixed(2));
    const list: { denomination: number; count: number; isBill: boolean }[] = [];
    const curConfig = CURRENCIES[selectedCurrency];

    // Bills
    const sortedBills = [...curConfig.bills].sort((a, b) => b - a);
    for (const bill of sortedBills) {
      if (rem >= bill) {
        const count = Math.floor(rem / bill);
        list.push({ denomination: bill, count, isBill: true });
        rem = parseFloat((rem - count * bill).toFixed(2));
      }
    }

    // Coins
    const sortedCoins = [...curConfig.coins].sort((a, b) => b - a);
    for (const coin of sortedCoins) {
      if (rem >= coin) {
        const count = Math.floor(rem / coin);
        list.push({ denomination: coin, count, isBill: false });
        rem = parseFloat((rem - count * coin).toFixed(2));
      }
    }

    // Leftover pennies if any
    if (rem >= 0.01) {
      list.push({ denomination: rem, count: 1, isBill: false });
    }

    return list;
  }, [changeInSelectedCurrency, selectedCurrency]);

  // Submit Order transaction
  const handleProcessOrder = () => {
    if (!selectedCustomerId) {
      alert('Please specify a valid customer profile.');
      return;
    }
    if (cart.length === 0) {
      alert('Your operational order cart is empty.');
      return;
    }

    try {
      const items = cart.map(i => ({
        productId: i.product.id,
        quantity: i.quantity
      }));

      const newSale = onAddSale({
        customerId: selectedCustomerId,
        employeeId: selectedEmployeeId,
        items,
        discount,
        paymentMethod,
        notes
      });

      alert(`Success! Invoice ${newSale.invoiceNumber} processed successfully. Generating receipt...`);

      // Clear Cart POS terminal state
      setCart([]);
      setDiscount(0);
      setNotes('');

      // Open printable invoice view instantly
      onPrintInvoice(newSale);
    } catch (e: any) {
      alert(`Transaction Error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Dynamic Global Cash & Currency Converter Panel */}
      <div className="bg-white p-4.5 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Coins className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Live Global Cash Converter & POS Register</h3>
            <p className="text-[10px] text-zinc-400">Convert the sales register catalog and checkout calculations into cool local cash formats</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CURRENCIES).map(([code, cur]) => {
            const isActive = selectedCurrency === code;
            return (
              <button
                key={code}
                onClick={() => {
                  setSelectedCurrency(code as any);
                  setCashTendered(0); // Reset tender on currency switch
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-amber-400 border border-zinc-800 shadow-md scale-105'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-500 border border-zinc-200/60'
                }`}
              >
                <span className="text-[10px] opacity-70">{cur.symbol}</span>
                <span>{code}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Selection Catalog */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-5">
          <div className="border-b border-zinc-100 pb-3 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Sales Hardware Catalog</h3>
              <p className="text-[10px] text-zinc-400">Click to add available stock to active commercial cart</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Filter SKU / title..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-400 placeholder-zinc-400 font-medium"
              />
            </div>
          </div>

          {/* Catalog Selection List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-zinc-400 text-xs">
                No stockable products matches available.
              </div>
            ) : (
              filteredProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="p-3 border border-zinc-100 bg-zinc-50/30 hover:bg-zinc-50 hover:border-zinc-300 rounded-xl cursor-pointer transition-all flex gap-3.5 group relative"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-cover bg-zinc-100 border border-zinc-150"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 truncate group-hover:text-amber-600 transition-colors">
                        {p.name}
                      </h4>
                      <p className="font-mono text-[9px] text-zinc-400 mt-0.5">{p.sku}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono font-bold text-zinc-800 text-xs">{formatVal(p.price)}</span>
                      <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                        p.stock <= p.minStockThreshold ? 'bg-amber-50 text-amber-500' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {p.stock} units left
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Checkout Transaction Terminal */}
        <div className="lg:col-span-5 space-y-5">
          {/* Linked profiles card */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-zinc-500" />
              Order Profile Linking
            </h3>

            <div className="space-y-3.5">
              {/* Customer Selector */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400 mb-1">
                  Customer Profile *
                </label>
                <select
                  id="link-customer-select"
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 bg-white cursor-pointer"
                >
                  <option value="" disabled>-- Select customer account --</option>
                  {customers.filter(c => c.status === 'Active').map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                  ))}
                </select>
              </div>

              {/* Employee Selector */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400 mb-1">
                  Sales Agent Authorization
                </label>
                <select
                  id="sales-agent-select"
                  value={selectedEmployeeId}
                  onChange={e => setSelectedEmployeeId(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 bg-white cursor-pointer"
                >
                  {employees.filter(e => e.status === 'Active').map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Cart & Checkout Math */}
          <div className="bg-zinc-950 text-zinc-200 p-6 rounded-2xl border border-zinc-800 shadow-xl space-y-6">
            <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <ShoppingCart className="w-4.5 h-4.5 text-amber-400" />
                Active Sales Cart ({cart.length})
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-[10px] text-zinc-500 hover:text-zinc-200 font-mono"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Cart list */}
            <div className="space-y-3.5 max-h-52 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-xl">
                  Order checkout cart is empty.
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs border-b border-zinc-900 pb-3">
                    <div className="min-w-0 pr-3">
                      <p className="font-semibold text-zinc-200 truncate">{item.product.name}</p>
                      <p className="font-mono text-[9px] text-zinc-500 mt-0.5">{formatVal(item.product.price)} each</p>
                    </div>

                    <div className="flex items-center gap-3.5 flex-shrink-0">
                      <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-850 px-1 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 hover:text-white text-zinc-500 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-zinc-200 text-xs w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 hover:text-white text-zinc-500 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discounts and notes config */}
            <div className="pt-2 border-t border-zinc-850 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500 mb-1.5">
                  Applied Discount ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-600" />
                  <input
                    type="number"
                    min="0"
                    max={cartSubtotal}
                    value={discount}
                    onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-xs font-mono bg-zinc-900 border border-zinc-850 rounded-lg pl-7 pr-3 py-1.8 text-zinc-200 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500 mb-1.5">
                  Payment Instrument
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full text-xs bg-zinc-900 border border-zinc-850 rounded-lg px-3 py-1.8 text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>
            </div>

            {/* Interactive Cash Tender and Change Calculator Module */}
            {paymentMethod === 'Cash' && (
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-amber-400">
                    ⚡ CASH REGISTER COUNTER
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">
                    Admin: Kangesh
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {/* Cash Received Field */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-medium text-zinc-400 mb-1">
                      Cash Received ({currentSymbol})
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-xs font-mono font-bold text-zinc-500">
                        {currentSymbol}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={cashTendered || ''}
                        onChange={e => setCashTendered(Math.max(0, parseFloat(e.target.value) || 0))}
                        placeholder="0.00"
                        className="w-full text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-3 py-1.8 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Change Due Field */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-medium text-zinc-400 mb-1">
                      Change to Return
                    </label>
                    <div className={`text-xs font-mono font-bold px-3 py-1.8 rounded-lg border flex items-center justify-between ${
                      cashTendered >= totalInSelectedCurrency
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      <span>{currentSymbol}</span>
                      <span>{changeInSelectedCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Tender quick bill presets */}
                <div className="space-y-1.5">
                  <span className="block text-[9px] uppercase font-mono tracking-wider text-zinc-500 font-bold">
                    Quick Bill Tender Buttons (Tap to add cash)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {/* Exact Cash Button */}
                    <button
                      type="button"
                      onClick={() => setCashTendered(parseFloat(totalInSelectedCurrency.toFixed(2)))}
                      className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[10px] font-bold border border-zinc-700/50 cursor-pointer active:scale-95 transition-all"
                    >
                      Exact Total
                    </button>
                    {CURRENCIES[selectedCurrency].bills.map((bill) => (
                      <button
                        type="button"
                        key={bill}
                        onClick={() => setCashTendered(prev => parseFloat((prev + bill).toFixed(2)))}
                        className="px-2.5 py-1.5 rounded font-mono text-[10px] font-bold border border-zinc-850 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 cursor-pointer active:scale-95 transition-all"
                      >
                        +{currentSymbol}{bill}
                      </button>
                    ))}
                    {/* Clear Button */}
                    <button
                      type="button"
                      onClick={() => setCashTendered(0)}
                      className="px-2.5 py-1.5 rounded bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 font-mono text-[10px] font-bold border border-rose-900/30 cursor-pointer active:scale-95 transition-all ml-auto"
                    >
                      Reset Cash
                    </button>
                  </div>
                </div>

                {/* Return Denominations Breakdown visualizer */}
                {cashTendered >= totalInSelectedCurrency && changeInSelectedCurrency > 0 && (
                  <div className="pt-2 border-t border-zinc-850 space-y-2 animate-fadeIn">
                    <span className="block text-[9px] uppercase font-mono tracking-wider text-zinc-500 font-bold">
                      💴 Suggested Cash Drawer Return Breakdown
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {changeBreakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className={`px-2 py-1 rounded flex items-center gap-1.5 text-[10px] font-mono font-bold select-none border shadow-sm ${
                            item.isBill
                              ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-emerald-400 border-emerald-500/10'
                              : 'bg-gradient-to-br from-zinc-850 to-zinc-900 text-amber-400 border-amber-500/10'
                          }`}
                        >
                          <span className="text-[8px] opacity-60">
                            {item.isBill ? '💵' : '🪙'}
                          </span>
                          <span>
                            {currentSymbol}{item.denomination}
                          </span>
                          <span className="text-zinc-500 font-normal">x</span>
                          <span className="text-zinc-200 bg-zinc-950 px-1 rounded text-[9px]">
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes input */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500 mb-1">
                Internal Transaction Memo
              </label>
              <input
                type="text"
                placeholder="Enter order reference or delivery instructions..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full text-xs bg-zinc-900 border border-zinc-850 rounded-lg px-3 py-1.8 text-zinc-300 focus:outline-none focus:border-zinc-700"
              />
            </div>

            {/* Math Billing Summary block */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-850 text-xs font-mono select-none">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>{formatVal(cartSubtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Applied Discount</span>
                  <span>-{formatVal(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Sales Tax ({taxRate}%)</span>
                <span>{formatVal(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-zinc-100 font-bold text-sm pt-2 border-t border-zinc-900">
                <span className="uppercase font-sans tracking-wide">Grand Total</span>
                <span>{formatVal(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Confirmation trigger */}
            <button
              onClick={handleProcessOrder}
              disabled={cart.length === 0 || !selectedCustomerId}
              className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3.5 rounded-xl text-xs tracking-wider transition-all shadow-md disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5 uppercase select-none"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              Commit Transaction Invoices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
