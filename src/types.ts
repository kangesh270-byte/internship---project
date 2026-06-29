/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Admin' | 'Manager' | 'Sales Executive' | 'Inventory Manager' | 'Viewer';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  totalSpent: number;
  salesCount: number;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  supplierId: string;
  price: number; // selling price
  cost: number;  // purchase price
  stock: number;
  minStockThreshold: number;
  barcode: string;
  qrCode: string;
  imageUrl?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface InventoryLog {
  id: string;
  productId: string;
  type: 'Stock In' | 'Stock Out' | 'Adjustment' | 'Sale';
  quantity: number;
  previousStock: number;
  newStock: number;
  notes: string;
  performedBy: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  employeeId: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Refunded';
  paymentMethod: 'Cash' | 'Credit Card' | 'Bank Transfer' | 'PayPal';
  saleDate: string;
  notes?: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'Inactive';
  hireDate: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
}

export interface Target {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM
  targetAmount: number;
  achievedAmount: number;
  status: 'Pending' | 'Achieved' | 'Failed';
}

export interface Notification {
  id: string;
  type: 'Info' | 'Warning' | 'Success' | 'Alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAt: string;
}

export interface SystemSettings {
  companyName: string;
  companyEmail: string;
  currency: string;
  taxRate: number;
  lowStockAlert: boolean;
  enableRealtimeLogs: boolean;
}
