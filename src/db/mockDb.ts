/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Profile,
  Customer,
  CustomerAddress,
  Category,
  Supplier,
  Product,
  InventoryLog,
  Sale,
  SaleItem,
  Employee,
  Attendance,
  Target,
  Notification,
  AuditLog,
  SystemSettings
} from '../types';

// Helper to generate UUIDs if needed
const generateId = () => Math.random().toString(36).substring(2, 11);

// Standard date strings relative to current date (2026-06-29)
const TODAY = '2026-06-29';
const YESTERDAY = '2026-06-28';
const TWO_DAYS_AGO = '2026-06-27';
const THREE_DAYS_AGO = '2026-06-26';
const TEN_DAYS_AGO = '2026-06-19';
const MONTH_AGO = '2026-05-29';

// Default Profiles
const initialProfile: Profile = {
  id: 'p1',
  email: 'kangesh270@gmail.com',
  fullName: 'Kangesh',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  role: 'Admin',
  createdAt: '2025-01-15T08:00:00Z'
};

const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Enterprise Hardware', description: 'Rack servers, networking switches, and storage arrays', productCount: 3 },
  { id: 'cat-2', name: 'Workstations & Laptops', description: 'Professional office PCs, developer rigs, and designer tablets', productCount: 3 },
  { id: 'cat-3', name: 'Software Licenses', description: 'SaaS seats, security suites, and operating system keys', productCount: 2 },
  { id: 'cat-4', name: 'Office Accessories', description: 'Ergonomic chairs, monitors, and docks', productCount: 2 }
];

const initialSuppliers: Supplier[] = [
  { id: 'sup-1', name: 'Aether Systems Inc', contactName: 'Sarah Jenkins', email: 'orders@aethersystems.com', phone: '+1 (555) 123-4567', address: '450 Innovation Way, Austin, TX', status: 'Active', createdAt: '2025-01-20' },
  { id: 'sup-2', name: 'Apex Logistical Corp', contactName: 'David Miller', email: 'sales@apexlogistic.com', phone: '+1 (555) 987-6543', address: '12 Logistics Blvd, Seattle, WA', status: 'Active', createdAt: '2025-02-14' },
  { id: 'sup-3', name: 'Zenith Wholesale Ltd', contactName: 'Mei Lin', email: 'lin.m@zenithwholesale.com', phone: '+86 21 5432 1098', address: '88 Pudong High Rd, Shanghai, CN', status: 'Active', createdAt: '2025-03-01' },
  { id: 'sup-4', name: 'Novus Distributing', contactName: 'Marcus Aurelius', email: 'marcus@novusdist.com', phone: '+39 06 1234567', address: 'Via Roma 14, Rome, IT', status: 'Inactive', createdAt: '2025-04-10' }
];

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    sku: 'HW-SRV-R750',
    name: 'Aether PowerEdge R750 Rack Server',
    description: 'High-performance 2U rack server with Intel Xeon processors, 128GB ECC RAM, and redundant power.',
    categoryId: 'cat-1',
    supplierId: 'sup-1',
    price: 4999.00,
    cost: 3200.00,
    stock: 14,
    minStockThreshold: 5,
    barcode: '793573193404',
    qrCode: 'HW-SRV-R750-AETHER',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock'
  },
  {
    id: 'prod-2',
    sku: 'HW-SW-48P',
    name: 'Apex Core 48-Port PoE+ Switch',
    description: 'Managed layer 3 gigabit switch with 4x 10G SFP+ uplink ports, 370W total power budget.',
    categoryId: 'cat-1',
    supplierId: 'sup-2',
    price: 1250.00,
    cost: 750.00,
    stock: 4,
    minStockThreshold: 6,
    barcode: '640522109405',
    qrCode: 'HW-SW-48P-APEX',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80',
    status: 'Low Stock'
  },
  {
    id: 'prod-3',
    sku: 'WS-THK-P16',
    name: 'Novus ThinkPad P16 Gen 2 Rig',
    description: 'Mobile developer workstation with Core i9 processor, 64GB DDR5 RAM, 2TB NVMe SSD, and RTX 4000 GPU.',
    categoryId: 'cat-2',
    supplierId: 'sup-1',
    price: 2899.00,
    cost: 1950.00,
    stock: 8,
    minStockThreshold: 4,
    barcode: '889654123456',
    qrCode: 'WS-THK-P16-THINKPAD',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock'
  },
  {
    id: 'prod-4',
    sku: 'WS-MAC-STU',
    name: 'Zenith Mac Studio M2 Ultra',
    description: 'Apple Mac Studio powerhouse with 24-core CPU, 60-core GPU, 128GB unified memory, and 4TB SSD.',
    categoryId: 'cat-2',
    supplierId: 'sup-3',
    price: 4599.00,
    cost: 3400.00,
    stock: 2,
    minStockThreshold: 3,
    barcode: '190199456789',
    qrCode: 'WS-MAC-STU-APPLE',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80',
    status: 'Low Stock'
  },
  {
    id: 'prod-5',
    sku: 'SW-CLD-ENT',
    name: 'Aether Cloud Security Suite Enterprise',
    description: 'Annual volume license pack for 50 endpoints. Real-time scanning, network threat prevention, and MDM portal.',
    categoryId: 'cat-3',
    supplierId: 'sup-1',
    price: 1800.00,
    cost: 900.00,
    stock: 50,
    minStockThreshold: 10,
    barcode: '202353912304',
    qrCode: 'SW-CLD-ENT-LICENSE',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock'
  },
  {
    id: 'prod-6',
    sku: 'ACC-CH-ERGO',
    name: 'Apex Ergonomic Executive Mesh Chair',
    description: 'Pneumatic fully adjustable lumbar support, 3D armrests, dynamic recline and aluminum base.',
    categoryId: 'cat-4',
    supplierId: 'sup-2',
    price: 650.00,
    cost: 380.00,
    stock: 0,
    minStockThreshold: 5,
    barcode: '400511894212',
    qrCode: 'ACC-CH-ERGO-CHAIR',
    imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=400&auto=format&fit=crop&q=80',
    status: 'Out of Stock'
  },
  {
    id: 'prod-7',
    sku: 'HW-NAS-8BAY',
    name: 'Zenith 8-Bay Enterprise NAS Tower',
    description: 'High capacity network storage tower with dual 10GbE SFP+ ports and hardware RAID engine.',
    categoryId: 'cat-1',
    supplierId: 'sup-3',
    price: 1199.00,
    cost: 720.00,
    stock: 12,
    minStockThreshold: 3,
    barcode: '471114526312',
    qrCode: 'HW-NAS-8BAY-ZENITH',
    imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock'
  },
  {
    id: 'prod-8',
    sku: 'WS-DSK-MNTR',
    name: 'Aether 38" Curved UltraWide Display',
    description: '3840x1600 WQHD+ IPS professional panel with Thunderbolt 3 90W PD connectivity.',
    categoryId: 'cat-4',
    supplierId: 'sup-1',
    price: 1399.00,
    cost: 850.00,
    stock: 15,
    minStockThreshold: 4,
    barcode: '880609123456',
    qrCode: 'WS-DSK-MNTR-CURVED',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80',
    status: 'In Stock'
  }
];

const initialCustomers: Customer[] = [
  { id: 'cust-1', name: 'Vanguard Global Corp', email: 'billing@vanguardglobal.com', phone: '+1 (555) 720-3941', company: 'Vanguard Global Ltd', status: 'Active', createdAt: '2025-01-10', totalSpent: 16248.00, salesCount: 3 },
  { id: 'cust-2', name: 'Stellar Tech Labs', email: 'procurement@stellartech.io', phone: '+1 (555) 304-9214', company: 'Stellar Tech LLC', status: 'Active', createdAt: '2025-02-02', totalSpent: 9398.00, salesCount: 2 },
  { id: 'cust-3', name: 'Helix BioMed Research', email: 'accounting@helixbio.com', phone: '+1 (555) 833-2144', company: 'Helix BioMed', status: 'Active', createdAt: '2025-02-18', totalSpent: 2899.00, salesCount: 1 },
  { id: 'cust-4', name: 'Apex Design Collective', email: 'ops@apexdesign.co', phone: '+1 (555) 441-9922', company: 'Apex Design', status: 'Active', createdAt: '2025-03-12', totalSpent: 650.00, salesCount: 1 },
  { id: 'cust-5', name: 'Chronos Advisory', email: 'contact@chronos.net', phone: '+1 (555) 601-5500', company: 'Chronos Ltd', status: 'Inactive', createdAt: '2025-04-01', totalSpent: 0, salesCount: 0 },
  { id: 'cust-6', name: 'Nova Retail Holdings', email: 'nova@retailholdings.com', phone: '+1 (555) 231-1234', company: 'Nova Retail Group', status: 'Active', createdAt: '2025-05-15', totalSpent: 1250.00, salesCount: 1 },
  { id: 'cust-7', name: 'Elysian Software', email: 'finance@elysian.dev', phone: '+1 (555) 777-8888', company: 'Elysian Corp', status: 'Active', createdAt: '2025-06-01', totalSpent: 3600.00, salesCount: 2 }
];

const initialAddresses: CustomerAddress[] = [
  { id: 'addr-1', customerId: 'cust-1', street: '100 Financial District, Ste 400', city: 'New York', state: 'NY', postalCode: '10005', country: 'United States', isDefault: true },
  { id: 'addr-2', customerId: 'cust-2', street: '500 Technology Dr, Building B', city: 'San Jose', state: 'CA', postalCode: '95110', country: 'United States', isDefault: true },
  { id: 'addr-3', customerId: 'cust-3', street: '88 Science Park Dr, Suite 12', city: 'Cambridge', state: 'MA', postalCode: '02139', country: 'United States', isDefault: true },
  { id: 'addr-4', customerId: 'cust-4', street: '22 Creative Way', city: 'Portland', state: 'OR', postalCode: '97201', country: 'United States', isDefault: true }
];

const initialEmployees: Employee[] = [
  { id: 'emp-1', name: 'Kangesh', email: 'kangesh270@gmail.com', phone: '+1 (555) 123-0001', role: 'Admin', department: 'Executive', status: 'Active', hireDate: '2025-01-01' },
  { id: 'emp-2', name: 'Alicia Silverstone', email: 'alicia.s@saascorp.com', phone: '+1 (555) 444-2222', role: 'Manager', department: 'Sales Operations', status: 'Active', hireDate: '2025-02-15' },
  { id: 'emp-3', name: 'Bob Henderson', email: 'bob.h@saascorp.com', phone: '+1 (555) 555-3333', role: 'Sales Executive', department: 'Commercial Sales', status: 'Active', hireDate: '2025-03-01' },
  { id: 'emp-4', name: 'Clara Oswald', email: 'clara.o@saascorp.com', phone: '+1 (555) 666-4444', role: 'Inventory Manager', department: 'Supply Chain', status: 'Active', hireDate: '2025-03-10' },
  { id: 'emp-5', name: 'Derrick Rose', email: 'derrick.r@saascorp.com', phone: '+1 (555) 777-5555', role: 'Viewer', department: 'Financial Analysis', status: 'Active', hireDate: '2025-04-01' }
];

const initialSales: Sale[] = [
  // Past sales for year / month analytics
  {
    id: 'sale-1',
    invoiceNumber: 'INV-2026-0001',
    customerId: 'cust-1',
    employeeId: 'emp-3',
    subtotal: 9998.00,
    tax: 800.00,
    discount: 500.00,
    total: 10298.00,
    paymentStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    saleDate: '2026-05-15T14:30:00Z',
    notes: 'Volume order of enterprise R750 servers.'
  },
  {
    id: 'sale-2',
    invoiceNumber: 'INV-2026-0002',
    customerId: 'cust-2',
    employeeId: 'emp-3',
    subtotal: 4599.00,
    tax: 368.00,
    discount: 200.00,
    total: 4767.00,
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    saleDate: '2026-06-10T10:15:00Z',
    notes: 'Mac Studio workstation deployment.'
  },
  {
    id: 'sale-3',
    invoiceNumber: 'INV-2026-0003',
    customerId: 'cust-3',
    employeeId: 'emp-3',
    subtotal: 2899.00,
    tax: 231.92,
    discount: 100.00,
    total: 3030.92,
    paymentStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    saleDate: '2026-06-20T16:45:00Z',
    notes: 'Thinkpad high-performance workstation.'
  },
  {
    id: 'sale-4',
    invoiceNumber: 'INV-2026-0004',
    customerId: 'cust-1',
    employeeId: 'emp-1',
    subtotal: 4999.00,
    tax: 400.00,
    discount: 0.00,
    total: 5399.00,
    paymentStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    saleDate: '2026-06-25T11:00:00Z',
    notes: 'Aether Rack server.'
  },
  {
    id: 'sale-5',
    invoiceNumber: 'INV-2026-0005',
    customerId: 'cust-7',
    employeeId: 'emp-3',
    subtotal: 3600.00,
    tax: 288.00,
    discount: 300.00,
    total: 3588.00,
    paymentStatus: 'Partially Paid',
    paymentMethod: 'PayPal',
    saleDate: '2026-06-27T09:20:00Z',
    notes: '2 Enterprise security suites volume packs.'
  },
  {
    id: 'sale-6',
    invoiceNumber: 'INV-2026-0006',
    customerId: 'cust-2',
    employeeId: 'emp-3',
    subtotal: 4599.00,
    tax: 368.00,
    discount: 150.00,
    total: 4817.00,
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    saleDate: '2026-06-28T15:10:00Z',
    notes: 'Mac Studio delivery.'
  },
  // Sale TODAY
  {
    id: 'sale-7',
    invoiceNumber: 'INV-2026-0007',
    customerId: 'cust-1',
    employeeId: 'emp-3',
    subtotal: 1250.00,
    tax: 100.00,
    discount: 0.00,
    total: 1350.00,
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    saleDate: '2026-06-29T11:00:00Z',
    notes: 'Standard Switch addition for Vanguard.'
  }
];

const initialSaleItems: SaleItem[] = [
  { id: 'si-1', saleId: 'sale-1', productId: 'prod-1', quantity: 2, unitPrice: 4999.00, totalPrice: 9998.00 },
  { id: 'si-2', saleId: 'sale-2', productId: 'prod-4', quantity: 1, unitPrice: 4599.00, totalPrice: 4599.00 },
  { id: 'si-3', saleId: 'sale-3', productId: 'prod-3', quantity: 1, unitPrice: 2899.00, totalPrice: 2899.00 },
  { id: 'si-4', saleId: 'sale-4', productId: 'prod-1', quantity: 1, unitPrice: 4999.00, totalPrice: 4999.00 },
  { id: 'si-5', saleId: 'sale-5', productId: 'prod-5', quantity: 2, unitPrice: 1800.00, totalPrice: 3600.00 },
  { id: 'si-6', saleId: 'sale-6', productId: 'prod-4', quantity: 1, unitPrice: 4599.00, totalPrice: 4599.00 },
  { id: 'si-7', saleId: 'sale-7', productId: 'prod-2', quantity: 1, unitPrice: 1250.00, totalPrice: 1250.00 }
];

const initialAttendance: Attendance[] = [
  { id: 'att-1', employeeId: 'emp-1', date: TODAY, checkIn: '08:45 AM', checkOut: '06:05 PM', status: 'Present' },
  { id: 'att-2', employeeId: 'emp-2', date: TODAY, checkIn: '08:58 AM', checkOut: undefined, status: 'Present' },
  { id: 'att-3', employeeId: 'emp-3', date: TODAY, checkIn: '09:12 AM', checkOut: undefined, status: 'Late' },
  { id: 'att-4', employeeId: 'emp-4', date: TODAY, checkIn: '08:30 AM', checkOut: undefined, status: 'Present' },
  { id: 'att-5', employeeId: 'emp-5', date: TODAY, checkIn: '00:00 AM', checkOut: undefined, status: 'Absent' },
  // Yesterday logs
  { id: 'att-6', employeeId: 'emp-1', date: YESTERDAY, checkIn: '08:50 AM', checkOut: '06:15 PM', status: 'Present' },
  { id: 'att-7', employeeId: 'emp-2', date: YESTERDAY, checkIn: '08:42 AM', checkOut: '05:30 PM', status: 'Present' },
  { id: 'att-8', employeeId: 'emp-3', date: YESTERDAY, checkIn: '08:55 AM', checkOut: '05:00 PM', status: 'Present' },
  { id: 'att-9', employeeId: 'emp-4', date: YESTERDAY, checkIn: '08:45 AM', checkOut: '05:45 PM', status: 'Present' }
];

const initialTargets: Target[] = [
  { id: 't-1', employeeId: 'emp-3', month: '2026-06', targetAmount: 30000, achievedAmount: 26233, status: 'Pending' },
  { id: 't-2', employeeId: 'emp-1', month: '2026-06', targetAmount: 10000, achievedAmount: 5399, status: 'Pending' },
  { id: 't-3', employeeId: 'emp-3', month: '2026-05', targetAmount: 20000, achievedAmount: 10298, status: 'Failed' }
];

const initialNotifications: Notification[] = [
  { id: 'n-1', type: 'Warning', title: 'Low Stock Alert', message: 'Aether Mac Studio (WS-MAC-STU) stock level is at 2 units. Reorder soon.', read: false, createdAt: '2026-06-29T08:15:00Z' },
  { id: 'n-2', type: 'Alert', title: 'Out of Stock Alert', message: 'Apex Ergonomic Executive Mesh Chair (ACC-CH-ERGO) is completely out of stock!', read: false, createdAt: '2026-06-29T07:30:00Z' },
  { id: 'n-3', type: 'Success', title: 'Sales Target Approaching', message: 'Bob Henderson has achieved 87.4% of June sales target ($26,233 / $30,000).', read: true, createdAt: '2026-06-28T17:00:00Z' },
  { id: 'n-4', type: 'Info', title: 'Backup Successful', message: 'System cloud database backup completed successfully.', read: true, createdAt: '2026-06-28T03:00:00Z' }
];

const initialAuditLogs: AuditLog[] = [
  { id: 'al-1', userId: 'emp-1', userName: 'Kangesh', action: 'CREATE_SALE', entityType: 'Sale', entityId: 'sale-7', details: 'Created sale invoice INV-2026-0007 for Vanguard Global Corp ($1,350.00)', createdAt: '2026-06-29T11:00:00Z' },
  { id: 'al-2', userId: 'emp-1', userName: 'Kangesh', action: 'UPDATE_PRODUCT', entityType: 'Product', entityId: 'prod-2', details: 'Updated stock levels of Apex Core Switch after invoice sale', createdAt: '2026-06-29T11:00:05Z' },
  { id: 'al-3', userId: 'emp-1', userName: 'Kangesh', action: 'USER_LOGIN', entityType: 'Profile', entityId: 'p1', details: 'Admin logged into system from workspace control panel', createdAt: '2026-06-29T09:36:11Z' },
  { id: 'al-4', userId: 'emp-4', userName: 'Clara Oswald', action: 'UPDATE_INVENTORY', entityType: 'Product', entityId: 'prod-8', details: 'Adjusted quantity for Aether 38" Curved UltraWide Display (+5 stock)', createdAt: '2026-06-27T14:40:00Z' }
];

const defaultSettings: SystemSettings = {
  companyName: 'Apex Core Platform Solutions Inc.',
  companyEmail: 'operations@apexcore.io',
  currency: 'USD',
  taxRate: 8, // 8% tax
  lowStockAlert: true,
  enableRealtimeLogs: true
};

const initialInventoryLogs: InventoryLog[] = [
  { id: 'il-1', productId: 'prod-2', type: 'Sale', quantity: 1, previousStock: 5, newStock: 4, notes: 'Deducted 1 unit for Sale INV-2026-0007', performedBy: 'Kangesh', createdAt: '2026-06-29T11:00:00Z' },
  { id: 'il-2', productId: 'prod-8', type: 'Adjustment', quantity: 5, previousStock: 10, newStock: 15, notes: 'Restocked display panels from supplier', performedBy: 'Clara Oswald', createdAt: '2026-06-27T14:40:00Z' }
];

// Local DB Keys
const KEYS = {
  PROFILE: 'saas_profile',
  CATEGORIES: 'saas_categories',
  SUPPLIERS: 'saas_suppliers',
  PRODUCTS: 'saas_products',
  CUSTOMERS: 'saas_customers',
  ADDRESSES: 'saas_addresses',
  EMPLOYEES: 'saas_employees',
  SALES: 'saas_sales',
  SALE_ITEMS: 'saas_sale_items',
  ATTENDANCE: 'saas_attendance',
  TARGETS: 'saas_targets',
  NOTIFICATIONS: 'saas_notifications',
  AUDIT_LOGS: 'saas_audit_logs',
  SETTINGS: 'saas_settings',
  INVENTORY_LOGS: 'saas_inventory_logs'
};

// Database wrapper implementing localStorage caching
export class MockDatabase {
  public static get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }

  // Initialize DB on first load
  public static initialize(): void {
    if (!localStorage.getItem(KEYS.PROFILE)) {
      this.set(KEYS.PROFILE, initialProfile);
      this.set(KEYS.CATEGORIES, initialCategories);
      this.set(KEYS.SUPPLIERS, initialSuppliers);
      this.set(KEYS.PRODUCTS, initialProducts);
      this.set(KEYS.CUSTOMERS, initialCustomers);
      this.set(KEYS.ADDRESSES, initialAddresses);
      this.set(KEYS.EMPLOYEES, initialEmployees);
      this.set(KEYS.SALES, initialSales);
      this.set(KEYS.SALE_ITEMS, initialSaleItems);
      this.set(KEYS.ATTENDANCE, initialAttendance);
      this.set(KEYS.TARGETS, initialTargets);
      this.set(KEYS.NOTIFICATIONS, initialNotifications);
      this.set(KEYS.AUDIT_LOGS, initialAuditLogs);
      this.set(KEYS.SETTINGS, defaultSettings);
      this.set(KEYS.INVENTORY_LOGS, initialInventoryLogs);
    }
  }

  // General Profile
  public static getProfile(): Profile {
    return this.get<Profile>(KEYS.PROFILE, initialProfile);
  }
  public static updateProfile(profile: Profile): void {
    this.set(KEYS.PROFILE, profile);
    this.addAuditLog('p1', profile.fullName, 'UPDATE_PROFILE', 'Profile', 'p1', 'Updated user profile information');
  }

  // Settings
  public static getSettings(): SystemSettings {
    return this.get<SystemSettings>(KEYS.SETTINGS, defaultSettings);
  }
  public static updateSettings(settings: SystemSettings): void {
    this.set(KEYS.SETTINGS, settings);
    this.addAuditLog('p1', this.getProfile().fullName, 'UPDATE_SETTINGS', 'Settings', 'system', 'Updated platform operations configuration');
  }

  // Categories
  public static getCategories(): Category[] {
    return this.get<Category[]>(KEYS.CATEGORIES, initialCategories);
  }
  public static addCategory(cat: Omit<Category, 'id' | 'productCount'>): Category {
    const categories = this.getCategories();
    const newCat: Category = { ...cat, id: `cat-${generateId()}`, productCount: 0 };
    categories.push(newCat);
    this.set(KEYS.CATEGORIES, categories);
    this.addAuditLog('p1', this.getProfile().fullName, 'CREATE_CATEGORY', 'Category', newCat.id, `Created new category: ${newCat.name}`);
    return newCat;
  }

  // Suppliers
  public static getSuppliers(): Supplier[] {
    return this.get<Supplier[]>(KEYS.SUPPLIERS, initialSuppliers);
  }
  public static addSupplier(sup: Omit<Supplier, 'id' | 'createdAt'>): Supplier {
    const suppliers = this.getSuppliers();
    const newSup: Supplier = {
      ...sup,
      id: `sup-${generateId()}`,
      createdAt: TODAY
    };
    suppliers.push(newSup);
    this.set(KEYS.SUPPLIERS, suppliers);
    this.addAuditLog('p1', this.getProfile().fullName, 'CREATE_SUPPLIER', 'Supplier', newSup.id, `Registered supplier: ${newSup.name}`);
    return newSup;
  }
  public static updateSupplier(updated: Supplier): void {
    const suppliers = this.getSuppliers();
    const index = suppliers.findIndex(s => s.id === updated.id);
    if (index !== -1) {
      suppliers[index] = updated;
      this.set(KEYS.SUPPLIERS, suppliers);
      this.addAuditLog('p1', this.getProfile().fullName, 'UPDATE_SUPPLIER', 'Supplier', updated.id, `Updated supplier: ${updated.name}`);
    }
  }

  // Products
  public static getProducts(): Product[] {
    return this.get<Product[]>(KEYS.PRODUCTS, initialProducts);
  }
  public static addProduct(prod: Omit<Product, 'id' | 'status'>): Product {
    const products = this.getProducts();
    const newProd: Product = {
      ...prod,
      id: `prod-${generateId()}`,
      status: prod.stock === 0 ? 'Out of Stock' : prod.stock <= prod.minStockThreshold ? 'Low Stock' : 'In Stock'
    };
    products.push(newProd);
    this.set(KEYS.PRODUCTS, products);

    // Update productCount in Categories
    const categories = this.getCategories();
    const catIndex = categories.findIndex(c => c.id === prod.categoryId);
    if (catIndex !== -1) {
      categories[catIndex].productCount += 1;
      this.set(KEYS.CATEGORIES, categories);
    }

    this.addAuditLog('p1', this.getProfile().fullName, 'CREATE_PRODUCT', 'Product', newProd.id, `Added catalog product: ${newProd.name} (SKU: ${newProd.sku})`);
    return newProd;
  }
  public static updateProduct(updated: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      const oldProd = products[index];
      // Auto-status
      updated.status = updated.stock === 0 ? 'Out of Stock' : updated.stock <= updated.minStockThreshold ? 'Low Stock' : 'In Stock';

      // Log stock adjustment if changed manually
      if (oldProd.stock !== updated.stock) {
        this.addInventoryLog(
          updated.id,
          'Adjustment',
          updated.stock - oldProd.stock,
          oldProd.stock,
          updated.stock,
          `Manual stock override adjustment.`,
          this.getProfile().fullName
        );
      }

      // Check low stock triggers
      if (updated.status !== 'In Stock' && oldProd.status === 'In Stock') {
        this.addNotification('Warning', 'Low Stock Triggered', `Product ${updated.name} (SKU: ${updated.sku}) has reached low stock (${updated.stock} left).`);
      }

      products[index] = updated;
      this.set(KEYS.PRODUCTS, products);
      this.addAuditLog('p1', this.getProfile().fullName, 'UPDATE_PRODUCT', 'Product', updated.id, `Updated product: ${updated.name}`);
    }
  }

  public static restockProduct(productId: string, qty: number, notes: string): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      const oldProd = products[index];
      const previousStock = oldProd.stock;
      const newStock = previousStock + qty;

      const updated: Product = {
        ...oldProd,
        stock: newStock,
        status: newStock === 0 ? 'Out of Stock' : newStock <= oldProd.minStockThreshold ? 'Low Stock' : 'In Stock'
      };

      this.addInventoryLog(
        productId,
        'Stock In',
        qty,
        previousStock,
        newStock,
        notes,
        this.getProfile().fullName
      );

      products[index] = updated;
      this.set(KEYS.PRODUCTS, products);
      this.addAuditLog('p1', this.getProfile().fullName, 'RESTOCK_PRODUCT', 'Product', productId, `Restocked product: ${oldProd.name} (+${qty} units)`);
      this.addNotification('Success', 'Inventory Restocked', `Replenished ${qty} units of ${oldProd.name}. New level: ${newStock} units.`);
    }
  }
  public static deleteProduct(id: string): void {
    const products = this.getProducts();
    const prod = products.find(p => p.id === id);
    if (prod) {
      const filtered = products.filter(p => p.id !== id);
      this.set(KEYS.PRODUCTS, filtered);

      // Decrement categories productCount
      const categories = this.getCategories();
      const catIndex = categories.findIndex(c => c.id === prod.categoryId);
      if (catIndex !== -1) {
        categories[catIndex].productCount = Math.max(0, categories[catIndex].productCount - 1);
        this.set(KEYS.CATEGORIES, categories);
      }

      this.addAuditLog('p1', this.getProfile().fullName, 'DELETE_PRODUCT', 'Product', id, `Deleted product catalog item: ${prod.name}`);
    }
  }

  // Customers
  public static getCustomers(): Customer[] {
    return this.get<Customer[]>(KEYS.CUSTOMERS, initialCustomers);
  }
  public static addCustomer(cust: Omit<Customer, 'id' | 'totalSpent' | 'salesCount' | 'createdAt'>): Customer {
    const customers = this.getCustomers();
    const newCust: Customer = {
      ...cust,
      id: `cust-${generateId()}`,
      totalSpent: 0,
      salesCount: 0,
      createdAt: TODAY
    };
    customers.push(newCust);
    this.set(KEYS.CUSTOMERS, customers);
    this.addAuditLog('p1', this.getProfile().fullName, 'CREATE_CUSTOMER', 'Customer', newCust.id, `Registered client customer: ${newCust.name}`);
    return newCust;
  }
  public static updateCustomer(updated: Customer): void {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === updated.id);
    if (index !== -1) {
      customers[index] = updated;
      this.set(KEYS.CUSTOMERS, customers);
      this.addAuditLog('p1', this.getProfile().fullName, 'UPDATE_CUSTOMER', 'Customer', updated.id, `Updated customer file: ${updated.name}`);
    }
  }

  // Employees
  public static getEmployees(): Employee[] {
    return this.get<Employee[]>(KEYS.EMPLOYEES, initialEmployees);
  }
  public static addEmployee(emp: Omit<Employee, 'id' | 'hireDate'>): Employee {
    const employees = this.getEmployees();
    const newEmp: Employee = {
      ...emp,
      id: `emp-${generateId()}`,
      hireDate: TODAY
    };
    employees.push(newEmp);
    this.set(KEYS.EMPLOYEES, employees);
    this.addAuditLog('p1', this.getProfile().fullName, 'CREATE_EMPLOYEE', 'Employee', newEmp.id, `Onboarded employee: ${newEmp.name} (Department: ${newEmp.department})`);
    return newEmp;
  }
  public static updateEmployee(updated: Employee): void {
    const employees = this.getEmployees();
    const index = employees.findIndex(e => e.id === updated.id);
    if (index !== -1) {
      employees[index] = updated;
      this.set(KEYS.EMPLOYEES, employees);
      this.addAuditLog('p1', this.getProfile().fullName, 'UPDATE_EMPLOYEE', 'Employee', updated.id, `Updated staff profile: ${updated.name}`);
    }
  }

  // Attendance Check-in / Out
  public static getAttendance(): Attendance[] {
    return this.get<Attendance[]>(KEYS.ATTENDANCE, initialAttendance);
  }
  public static checkInEmployee(employeeId: string, time: string, status: 'Present' | 'Late'): Attendance {
    const attendance = this.getAttendance();
    const newAtt: Attendance = {
      id: `att-${generateId()}`,
      employeeId,
      date: TODAY,
      checkIn: time,
      status
    };
    attendance.push(newAtt);
    this.set(KEYS.ATTENDANCE, attendance);

    const emp = this.getEmployees().find(e => e.id === employeeId);
    this.addAuditLog('p1', this.getProfile().fullName, 'STAFF_CHECKIN', 'Attendance', employeeId, `Staff checked in: ${emp?.name || employeeId} at ${time}`);
    return newAtt;
  }
  public static checkOutEmployee(employeeId: string, time: string): void {
    const attendance = this.getAttendance();
    const log = attendance.find(a => a.employeeId === employeeId && a.date === TODAY);
    if (log) {
      log.checkOut = time;
      this.set(KEYS.ATTENDANCE, attendance);
      const emp = this.getEmployees().find(e => e.id === employeeId);
      this.addAuditLog('p1', this.getProfile().fullName, 'STAFF_CHECKOUT', 'Attendance', employeeId, `Staff checked out: ${emp?.name || employeeId} at ${time}`);
    }
  }

  // Inventory Logs
  public static getInventoryLogs(): InventoryLog[] {
    return this.get<InventoryLog[]>(KEYS.INVENTORY_LOGS, initialInventoryLogs);
  }
  public static addInventoryLog(productId: string, type: InventoryLog['type'], quantity: number, previousStock: number, newStock: number, notes: string, performedBy: string) {
    const logs = this.getInventoryLogs();
    const newLog: InventoryLog = {
      id: `il-${generateId()}`,
      productId,
      type,
      quantity,
      previousStock,
      newStock,
      notes,
      performedBy,
      createdAt: new Date().toISOString()
    };
    logs.push(newLog);
    this.set(KEYS.INVENTORY_LOGS, logs);
  }

  // Sales Order processing (Durable transaction)
  public static getSales(): Sale[] {
    return this.get<Sale[]>(KEYS.SALES, initialSales);
  }
  public static getSaleItems(): SaleItem[] {
    return this.get<SaleItem[]>(KEYS.SALE_ITEMS, initialSaleItems);
  }

  public static addSale(saleData: {
    customerId: string;
    employeeId: string;
    items: { productId: string; quantity: number }[];
    discount: number;
    paymentMethod: Sale['paymentMethod'];
    notes?: string;
  }): Sale {
    const products = this.getProducts();
    const customers = this.getCustomers();
    const sales = this.getSales();
    const saleItems = this.getSaleItems();
    const settings = this.getSettings();

    // 1. Calculate invoice totals and verify stock
    let subtotal = 0;
    const itemsToCreate: Omit<SaleItem, 'id' | 'saleId'>[] = [];

    for (const item of saleData.items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) throw new Error(`Product ID ${item.productId} not found`);
      if (prod.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${prod.name}. Available: ${prod.stock}, Requested: ${item.quantity}`);
      }

      const itemTotal = prod.price * item.quantity;
      subtotal += itemTotal;

      itemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: prod.price,
        totalPrice: itemTotal
      });
    }

    const taxAmount = parseFloat(((subtotal - saleData.discount) * (settings.taxRate / 100)).toFixed(2));
    const totalAmount = parseFloat((subtotal - saleData.discount + taxAmount).toFixed(2));

    // 2. Create the Sale record
    const invoiceNum = `INV-2026-${String(sales.length + 1).padStart(4, '0')}`;
    const newSale: Sale = {
      id: `sale-${generateId()}`,
      invoiceNumber: invoiceNum,
      customerId: saleData.customerId,
      employeeId: saleData.employeeId,
      subtotal,
      tax: taxAmount,
      discount: saleData.discount,
      total: totalAmount,
      paymentStatus: 'Paid',
      paymentMethod: saleData.paymentMethod,
      saleDate: new Date().toISOString(),
      notes: saleData.notes
    };

    sales.push(newSale);
    this.set(KEYS.SALES, sales);

    // 3. Create items, decrement stock, generate inventory logs
    for (const item of itemsToCreate) {
      const si: SaleItem = {
        ...item,
        id: `si-${generateId()}`,
        saleId: newSale.id
      };
      saleItems.push(si);

      // Decrement Product Stock
      const prodIndex = products.findIndex(p => p.id === item.productId);
      if (prodIndex !== -1) {
        const p = products[prodIndex];
        const oldStock = p.stock;
        p.stock -= item.quantity;
        // recalculate status
        p.status = p.stock === 0 ? 'Out of Stock' : p.stock <= p.minStockThreshold ? 'Low Stock' : 'In Stock';

        this.addInventoryLog(
          p.id,
          'Sale',
          item.quantity,
          oldStock,
          p.stock,
          `Deducted ${item.quantity} units for Order ${invoiceNum}`,
          'System Transaction'
        );

        // Low stock trigger notification
        if (p.status !== 'In Stock' && oldStock > p.minStockThreshold) {
          this.addNotification('Warning', 'Low Stock Warning', `Product ${p.name} (SKU: ${p.sku}) went below minimum threshold. Current stock: ${p.stock}`);
        }
      }
    }

    this.set(KEYS.SALE_ITEMS, saleItems);
    this.set(KEYS.PRODUCTS, products);

    // 4. Update Customer Spending Metrics
    const custIndex = customers.findIndex(c => c.id === saleData.customerId);
    if (custIndex !== -1) {
      customers[custIndex].totalSpent = parseFloat((customers[custIndex].totalSpent + totalAmount).toFixed(2));
      customers[custIndex].salesCount += 1;
      this.set(KEYS.CUSTOMERS, customers);
    }

    // 5. Update Employee Target metrics
    const targets = this.getTargets();
    const currentMonthStr = TODAY.substring(0, 7); // '2026-06'
    const targetIndex = targets.findIndex(t => t.employeeId === saleData.employeeId && t.month === currentMonthStr);
    if (targetIndex !== -1) {
      targets[targetIndex].achievedAmount = parseFloat((targets[targetIndex].achievedAmount + totalAmount).toFixed(2));
      if (targets[targetIndex].achievedAmount >= targets[targetIndex].targetAmount) {
        targets[targetIndex].status = 'Achieved';
        this.addNotification('Success', 'Sales Target Reached!', `Staff member has achieved their monthly sales goal of $${targets[targetIndex].targetAmount}!`);
      }
      this.set(KEYS.TARGETS, targets);
    }

    // 6. Record system audit trail and notify managers
    this.addNotification('Success', 'New Sale Complete', `Invoice ${invoiceNum} generated successfully for $${totalAmount.toLocaleString()}.`);
    const emp = this.getEmployees().find(e => e.id === saleData.employeeId);
    const cust = customers.find(c => c.id === saleData.customerId);
    this.addAuditLog(
      saleData.employeeId,
      emp?.name || 'System Operator',
      'CREATE_SALE',
      'Sale',
      newSale.id,
      `Authorized sale ${invoiceNum} to ${cust?.name || 'Walk-in'} for total value $${totalAmount}`
    );

    return newSale;
  }

  // Targets
  public static getTargets(): Target[] {
    return this.get<Target[]>(KEYS.TARGETS, initialTargets);
  }
  public static addTarget(target: Omit<Target, 'id' | 'achievedAmount' | 'status'>): Target {
    const targets = this.getTargets();
    const newTarget: Target = {
      ...target,
      id: `t-${generateId()}`,
      achievedAmount: 0,
      status: 'Pending'
    };
    targets.push(newTarget);
    this.set(KEYS.TARGETS, targets);
    return newTarget;
  }

  // Notifications
  public static getNotifications(): Notification[] {
    return this.get<Notification[]>(KEYS.NOTIFICATIONS, initialNotifications);
  }
  public static addNotification(type: Notification['type'], title: string, message: string): void {
    const notifications = this.getNotifications();
    const newN: Notification = {
      id: `n-${generateId()}`,
      type,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    notifications.unshift(newN); // newest first
    this.set(KEYS.NOTIFICATIONS, notifications);
  }
  public static markNotificationRead(id: string): void {
    const notifications = this.getNotifications();
    const n = notifications.find(x => x.id === id);
    if (n) {
      n.read = true;
      this.set(KEYS.NOTIFICATIONS, notifications);
    }
  }
  public static markAllNotificationsRead(): void {
    const notifications = this.getNotifications();
    notifications.forEach(n => n.read = true);
    this.set(KEYS.NOTIFICATIONS, notifications);
  }

  // Audit Logs
  public static getAuditLogs(): AuditLog[] {
    return this.get<AuditLog[]>(KEYS.AUDIT_LOGS, initialAuditLogs);
  }
  public static addAuditLog(userId: string, userName: string, action: string, entityType: string, entityId: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `al-${generateId()}`,
      userId,
      userName,
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString()
    };
    logs.unshift(newLog); // newest first
    this.set(KEYS.AUDIT_LOGS, logs);
  }

  // Advanced BI Dashboard Stats Generator
  public static getDashboardStats() {
    const sales = this.getSales();
    const products = this.getProducts();
    const customers = this.getCustomers();
    const logs = this.getAuditLogs();
    const notifications = this.getNotifications();

    // 1. Revenues
    let todayRevenue = 0;
    let monthRevenue = 0;
    let yearRevenue = 0;
    let totalSalesProfit = 0;
    let totalSalesCost = 0;

    const todayDateStr = TODAY; // 2026-06-29
    const currentMonthStr = '2026-06';
    const currentYearStr = '2026';

    const saleItems = this.getSaleItems();

    sales.forEach(sale => {
      const sDate = sale.saleDate.substring(0, 10);
      const sMonth = sale.saleDate.substring(0, 7);
      const sYear = sale.saleDate.substring(0, 4);

      if (sDate === todayDateStr) {
        todayRevenue += sale.total;
      }
      if (sMonth === currentMonthStr) {
        monthRevenue += sale.total;
      }
      if (sYear === currentYearStr) {
        yearRevenue += sale.total;
      }

      // Calculate cost & profit of individual sale
      const items = saleItems.filter(si => si.saleId === sale.id);
      let saleCost = 0;
      items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          saleCost += prod.cost * item.quantity;
        }
      });

      totalSalesCost += saleCost;
      totalSalesProfit += (sale.subtotal - saleCost - sale.discount);
    });

    // 2. Growth compare (simulated previous month)
    const prevMonthRevenue = 18500; // Mock comparison base
    const monthlyGrowth = parseFloat((((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100).toFixed(1));

    // 3. Top products (by units sold)
    const productSalesMap: Record<string, { name: string; sku: string; qty: number; revenue: number }> = {};
    saleItems.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = { name: prod.name, sku: prod.sku, qty: 0, revenue: 0 };
        }
        productSalesMap[item.productId].qty += item.quantity;
        productSalesMap[item.productId].revenue += item.totalPrice;
      }
    });

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // 4. Low Stock items
    const lowStockCount = products.filter(p => p.status !== 'In Stock').length;

    // 5. Customer rankings
    const topCustomers = [...customers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // 6. Recent sales (merged with customer name)
    const recentSales = sales
      .slice()
      .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
      .map(sale => {
        const cust = customers.find(c => c.id === sale.customerId);
        return {
          ...sale,
          customerName: cust?.name || 'Walk-in Client',
          customerCompany: cust?.company || ''
        };
      })
      .slice(0, 5);

    // 7. Sales trend weekly comparison points
    // Line chart coordinates for June sales
    const salesTrend = [
      { date: 'June 10', amount: 4767 },
      { date: 'June 20', amount: 3030 },
      { date: 'June 25', amount: 5399 },
      { date: 'June 27', amount: 3588 },
      { date: 'June 28', amount: 4817 },
      { date: 'June 29', amount: 1350 }
    ];

    return {
      metrics: {
        todayRevenue,
        monthRevenue,
        yearRevenue,
        ordersCount: sales.length,
        profit: totalSalesProfit,
        expenses: totalSalesCost,
        customersCount: customers.length,
        productsCount: products.length,
        lowStockCount,
        monthlyGrowth
      },
      topSellingProducts,
      topCustomers,
      recentSales,
      salesTrend,
      recentAuditLogs: logs.slice(0, 5),
      unreadNotificationsCount: notifications.filter(n => !n.read).length
    };
  }
}
