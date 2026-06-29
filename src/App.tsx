/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import InvoiceModal from './components/InvoiceModal';

import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import Sales from './pages/Sales';
import Employees from './pages/Employees';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import SettingsPage from './pages/Settings';

import { MockDatabase } from './db/mockDb';
import {
  Product,
  Category,
  Supplier,
  Customer,
  Employee,
  Sale,
  SaleItem,
  Attendance,
  Target,
  Notification,
  AuditLog,
  SystemSettings,
  InventoryLog
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  // React local states synced from MockDatabase
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // Print Invoice state
  const [activeInvoiceSale, setActiveInvoiceSale] = useState<Sale | null>(null);

  // First boot initialization
  useEffect(() => {
    MockDatabase.initialize();
    reloadDatabaseState();
  }, []);

  const reloadDatabaseState = () => {
    setProducts(MockDatabase.getProducts());
    setCategories(MockDatabase.getCategories());
    setSuppliers(MockDatabase.getSuppliers());
    setCustomers(MockDatabase.getCustomers());
    setEmployees(MockDatabase.getEmployees());
    setSales(MockDatabase.getSales());
    setSaleItems(MockDatabase.getSaleItems());
    setAttendance(MockDatabase.getAttendance());
    setTargets(MockDatabase.getTargets());
    setNotifications(MockDatabase.getNotifications());
    setAuditLogs(MockDatabase.getAuditLogs());
    setSettings(MockDatabase.getSettings());
    setInventoryLogs(MockDatabase.getInventoryLogs());
    setDashboardStats(MockDatabase.getDashboardStats());
  };

  // State trigger callbacks
  const handleAddCustomer = (cust: any) => {
    MockDatabase.addCustomer(cust);
    reloadDatabaseState();
  };

  const handleUpdateCustomer = (cust: Customer) => {
    MockDatabase.updateCustomer(cust);
    reloadDatabaseState();
  };

  const handleAddProduct = (prod: any) => {
    MockDatabase.addProduct(prod);
    reloadDatabaseState();
  };

  const handleUpdateProduct = (prod: Product) => {
    MockDatabase.updateProduct(prod);
    reloadDatabaseState();
  };

  const handleDeleteProduct = (id: string) => {
    MockDatabase.deleteProduct(id);
    reloadDatabaseState();
  };

  const handleRestockProduct = (productId: string, qty: number, notes: string) => {
    MockDatabase.restockProduct(productId, qty, notes);
    reloadDatabaseState();
  };

  const handleAddSupplier = (sup: any) => {
    MockDatabase.addSupplier(sup);
    reloadDatabaseState();
  };

  const handleUpdateSupplier = (sup: Supplier) => {
    MockDatabase.updateSupplier(sup);
    reloadDatabaseState();
  };

  const handleAddSale = (saleData: any) => {
    const sale = MockDatabase.addSale(saleData);
    reloadDatabaseState();
    return sale;
  };

  const handleAddEmployee = (emp: any) => {
    MockDatabase.addEmployee(emp);
    reloadDatabaseState();
  };

  const handleUpdateEmployee = (emp: Employee) => {
    MockDatabase.updateEmployee(emp);
    reloadDatabaseState();
  };

  const handleCheckIn = (employeeId: string, time: string, status: 'Present' | 'Late') => {
    MockDatabase.checkInEmployee(employeeId, time, status);
    reloadDatabaseState();
  };

  const handleCheckOut = (employeeId: string, time: string) => {
    MockDatabase.checkOutEmployee(employeeId, time);
    reloadDatabaseState();
  };

  const handleAddTarget = (target: any) => {
    MockDatabase.addTarget(target);
    reloadDatabaseState();
  };

  const handleMarkRead = (id: string) => {
    MockDatabase.markNotificationRead(id);
    reloadDatabaseState();
  };

  const handleMarkAllRead = () => {
    MockDatabase.markAllNotificationsRead();
    reloadDatabaseState();
  };

  const handleUpdateSettings = (updated: SystemSettings) => {
    MockDatabase.updateSettings(updated);
    reloadDatabaseState();
  };

  const handlePrintInvoiceTrigger = (sale: Sale) => {
    setActiveInvoiceSale(sale);
  };

  // Custom User profile for the application session header & sidebar views
  const userProfile = {
    fullName: 'Kangesh',
    email: 'kangesh270@gmail.com',
    role: 'Admin' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  };

  if (!settings || !dashboardStats) {
    return (
      <div className="h-screen w-screen bg-zinc-50 flex flex-col items-center justify-center text-xs font-mono text-zinc-500">
        <div className="h-5 w-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mb-3" />
        LOADING ENTERPRISE PLATFORM ENVIRONMENT...
      </div>
    );
  }

  // Router dispatcher based on activeTab
  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            stats={dashboardStats}
            onNavigate={setActiveTab}
            onPrintInvoice={handlePrintInvoiceTrigger}
          />
        );
      case 'customers':
        return (
          <Customers
            customers={customers}
            addresses={MockDatabase.get<any[]>('saas_addresses', [])}
            sales={sales}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
          />
        );
      case 'products':
        return (
          <Products
            products={products}
            categories={categories}
            suppliers={suppliers}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'inventory':
        return (
          <Inventory
            products={products}
            inventoryLogs={inventoryLogs}
            suppliers={suppliers}
            onRestockProduct={handleRestockProduct}
          />
        );
      case 'suppliers':
        return (
          <Suppliers
            suppliers={suppliers}
            products={products}
            onAddSupplier={handleAddSupplier}
            onUpdateSupplier={handleUpdateSupplier}
          />
        );
      case 'sales':
        return (
          <Sales
            products={products}
            customers={customers}
            employees={employees}
            taxRate={settings.taxRate}
            onAddSale={handleAddSale}
            onPrintInvoice={handlePrintInvoiceTrigger}
          />
        );
      case 'employees':
        return (
          <Employees
            employees={employees}
            attendance={attendance}
            targets={targets}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onAddTarget={handleAddTarget}
          />
        );
      case 'analytics':
        return (
          <Analytics
            sales={sales}
            products={products}
            categories={categories}
            customers={customers}
          />
        );
      case 'reports':
        return (
          <Reports
            sales={sales}
            customers={customers}
            products={products}
            inventoryLogs={inventoryLogs}
          />
        );
      case 'notifications':
        return (
          <Notifications
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            settings={settings}
            auditLogs={auditLogs}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      default:
        return <div className="text-xs p-8 text-zinc-400">Section not implemented.</div>;
    }
  };

  const lowStockCount = products.filter(p => p.status !== 'In Stock').length;

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        profile={userProfile}
        lowStockCount={lowStockCount}
      />

      {/* Main viewport Container */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'pl-16' : 'pl-64'}`}>
        <Header
          activeTab={activeTab}
          notifications={notifications}
          onMarkNotificationRead={handleMarkRead}
          onClearNotifications={handleMarkAllRead}
          profile={userProfile}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto pb-16">
          {renderPage()}
        </main>
      </div>

      {/* Corporate printable Invoicing Receipt Modal */}
      {activeInvoiceSale && (
        <InvoiceModal
          sale={activeInvoiceSale}
          customers={customers}
          employees={employees}
          products={products}
          saleItems={saleItems}
          settings={settings}
          onClose={() => setActiveInvoiceSale(null)}
        />
      )}
    </div>
  );
}
