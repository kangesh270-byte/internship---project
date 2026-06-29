/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Package,
  QrCode,
  Tag,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  X,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Layers,
  Truck
} from 'lucide-react';
import { Product, Category, Supplier } from '../types';

interface ProductsProps {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  onAddProduct: (prod: any) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export default function Products({
  products,
  categories,
  suppliers,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}: ProductsProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [barcodeProduct, setBarcodeProduct] = useState<Product | null>(null);

  // Form states for new product
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(5);
  const [barcode, setBarcode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Computed lists
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.includes(searchTerm);
      const matchesCat = selectedCategory === 'All' || p.categoryId === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleOpenAddModal = () => {
    // pre-fill defaults
    if (categories.length > 0) setCategoryId(categories[0].id);
    if (suppliers.length > 0) setSupplierId(suppliers[0].id);
    setSku(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
    setBarcode(`${Math.floor(100000000000 + Math.random() * 900000000000)}`);
    setQrCode(`QR-CODE-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsAddModalOpen(true);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !price || !cost) {
      alert('Please fill out all mandatory numeric parameters.');
      return;
    }
    onAddProduct({
      sku,
      name,
      description,
      categoryId,
      supplierId,
      price: parseFloat(price.toString()),
      cost: parseFloat(cost.toString()),
      stock: parseInt(stock.toString()),
      minStockThreshold: parseInt(minStock.toString()),
      barcode,
      qrCode,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80'
    });

    // Reset fields
    setName('');
    setDescription('');
    setPrice(0);
    setCost(0);
    setStock(0);
    setMinStock(5);
    setImageUrl('');
    setIsAddModalOpen(false);
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you absolutely sure you want to delete this catalog hardware listing?')) {
      onDeleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Search and Advanced filter panel */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            id="search-catalog-input"
            type="text"
            placeholder="Search catalog by product name, SKU or serial barcode..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-400 placeholder-zinc-400 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            id="cat-filter-select"
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-600 bg-white focus:outline-none font-medium cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="status-filter-select-prod"
            value={selectedStatus}
            onChange={e => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-600 bg-white focus:outline-none font-medium cursor-pointer"
          >
            <option value="All">All Stocks</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <button
            id="register-hardware-btn"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Hardware Item
          </button>
        </div>
      </div>

      {/* Grid of Products catalog cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center text-zinc-400 border border-zinc-200/80 rounded-2xl">
            No system products match your query filters.
          </div>
        ) : (
          paginatedProducts.map(p => {
            const catName = categories.find(c => c.id === p.categoryId)?.name || 'Unassigned';
            const supName = suppliers.find(s => s.id === p.supplierId)?.name || 'Unknown';
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all relative group"
              >
                {/* Image & Status Overlay */}
                <div className="relative h-44 bg-zinc-100 overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-3.5 right-3.5 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm select-none ${
                    p.status === 'In Stock'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : p.status === 'Low Stock'
                      ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
                      : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {p.status} ({p.stock})
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase font-mono font-bold tracking-wider">
                      <Tag className="w-3.5 h-3.5" />
                      {catName}
                    </div>
                    <h4 className="text-sm font-bold text-zinc-800 tracking-tight mt-1 truncate" title={p.name}>
                      {p.name}
                    </h4>
                    <p className="text-zinc-500 text-[11px] font-medium leading-normal mt-1 line-clamp-2 h-8">
                      {p.description}
                    </p>
                  </div>

                  {/* Pricing metrics */}
                  <div className="mt-4 pt-4 border-t border-zinc-50 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block">Retail Sale</span>
                      <span className="font-bold text-zinc-800 text-sm">${p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block">Unit Cost (COGS)</span>
                      <span className="font-semibold text-zinc-500">${p.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Card bottom actions panel */}
                  <div className="mt-4 pt-3.5 border-t border-zinc-50 flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono font-semibold text-[10px] text-zinc-400">{p.sku}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setBarcodeProduct(p)}
                        title="Display barcode and QR code"
                        className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingProduct(p)}
                        title="Modify catalog hardware specs"
                        className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        title="Deregister catalog listing"
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-5 py-3 border border-zinc-200/80 rounded-xl shadow-sm">
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

      {/* Barcode/QR Drawer Overlay Modal */}
      {barcodeProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden page-transition">
            <div className="px-5 py-3.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">
                Logistics & Scanning Codes
              </span>
              <button
                onClick={() => setBarcodeProduct(null)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-center space-y-6 select-none">
              <p className="text-xs font-semibold text-zinc-800 tracking-tight">{barcodeProduct.name}</p>

              {/* Barcode Visualizer */}
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col items-center">
                <div className="h-14 w-52 flex items-stretch gap-[2.5px] bg-white border border-zinc-200 px-3 py-2.5 rounded shadow-sm">
                  {/* Faux Barcode bars lines generation */}
                  {Array.from({ length: 28 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-950 flex-1"
                      style={{
                        opacity: idx % 3 === 0 ? 0.9 : idx % 5 === 0 ? 0 : idx % 7 === 0 ? 0.3 : 0.8,
                        width: idx % 4 === 0 ? '4px' : '1px'
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 tracking-widest font-semibold mt-2">
                  {barcodeProduct.barcode}
                </span>
              </div>

              {/* QR Code Visualizer */}
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col items-center">
                <div className="h-32 w-32 bg-white border border-zinc-200 rounded-lg p-2.5 flex flex-wrap gap-0.5 shadow-sm justify-between">
                  {/* Faux QR pixels pixelation block */}
                  {Array.from({ length: 144 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-[7.5px] w-[7.5px]"
                      style={{
                        backgroundColor:
                          (idx < 18 && idx % 3 === 0) || (idx > 125 && idx % 2 === 0) || (idx % 7 === 0 && idx % 3 !== 0)
                            ? '#18181b'
                            : 'transparent',
                        borderRadius: idx % 19 === 0 ? '1px' : '0'
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 tracking-wide font-semibold mt-2.5 uppercase">
                  {barcodeProduct.qrCode}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CRUD Modal: Add Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden page-transition">
            <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider font-mono">
                Add Catalog Hardware Item
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    System SKU code
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cisco Switche"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Catalog Description
                </label>
                <textarea
                  placeholder="Enter details, metrics, and capacity parameters..."
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Operating Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Primary Supplier
                  </label>
                  <select
                    value={supplierId}
                    onChange={e => setSupplierId(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 bg-white"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-mono text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Cost COGS ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={cost}
                    onChange={e => setCost(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-mono text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Stock count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={e => setStock(parseInt(e.target.value) || 0)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-mono text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minStock}
                    onChange={e => setMinStock(parseInt(e.target.value) || 0)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-mono text-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Reference Image URL
                </label>
                <input
                  type="text"
                  placeholder="Paste visual illustration URL..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                />
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
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold shadow-md cursor-pointer"
                >
                  Create Hardware SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD Modal: Edit Product */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden page-transition">
            <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider font-mono">
                Edit Product Configuration
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    System SKU code
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Catalog Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Operating Category
                  </label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={e => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Primary Supplier
                  </label>
                  <select
                    value={editingProduct.supplierId}
                    onChange={e => setEditingProduct({ ...editingProduct, supplierId: e.target.value })}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 bg-white"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-mono text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Cost ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={editingProduct.cost}
                    onChange={e => setEditingProduct({ ...editingProduct, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-mono text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Stock Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-mono text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Min Alert
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.minStockThreshold}
                    onChange={e => setEditingProduct({ ...editingProduct, minStockThreshold: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-mono text-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingProduct.imageUrl}
                  onChange={e => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-50">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold shadow-md cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
