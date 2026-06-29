/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  Truck,
  ShoppingCart,
  UserCheck,
  BarChart3,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Menu,
  Shield
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  profile: { fullName: string; email: string; role: UserRole; avatarUrl?: string };
  lowStockCount: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  profile,
  lowStockCount
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Sales Executive', 'Inventory Manager', 'Viewer'] },
    { id: 'customers', name: 'Customers', icon: Users, roles: ['Admin', 'Manager', 'Sales Executive', 'Viewer'] },
    { id: 'products', name: 'Products Catalog', icon: Package, roles: ['Admin', 'Manager', 'Inventory Manager', 'Sales Executive', 'Viewer'] },
    { id: 'inventory', name: 'Inventory & Stock', icon: Boxes, roles: ['Admin', 'Manager', 'Inventory Manager', 'Viewer'] },
    { id: 'suppliers', name: 'Suppliers', icon: Truck, roles: ['Admin', 'Manager', 'Inventory Manager', 'Viewer'] },
    { id: 'sales', name: 'Sales Order (POS)', icon: ShoppingCart, roles: ['Admin', 'Manager', 'Sales Executive'] },
    { id: 'employees', name: 'Employee Roster', icon: UserCheck, roles: ['Admin', 'Manager', 'Viewer'] },
    { id: 'analytics', name: 'Business Intelligence', icon: BarChart3, roles: ['Admin', 'Manager', 'Viewer'] },
    { id: 'reports', name: 'Report Generator', icon: FileText, roles: ['Admin', 'Manager', 'Viewer'] },
    { id: 'notifications', name: 'Notifications', icon: Bell, roles: ['Admin', 'Manager', 'Sales Executive', 'Inventory Manager', 'Viewer'] },
    { id: 'settings', name: 'System Settings', icon: Settings, roles: ['Admin', 'Manager'] }
  ];

  // Filter items based on role
  const allowedItems = menuItems.filter(item => item.roles.includes(profile.role));

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Admin': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      case 'Manager': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Sales Executive': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Inventory Manager': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    }
  };

  return (
    <div
      id="main-sidebar"
      className={`fixed top-0 left-0 h-screen z-20 flex flex-col justify-between transition-all duration-300 ease-in-out border-r bg-zinc-950 text-zinc-100 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Brand Logo */}
      <div>
        <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-800 text-amber-400 border border-zinc-700">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="font-mono font-bold text-xs tracking-widest text-zinc-100 uppercase">
                SALES <span className="text-amber-400">ANALIST</span>
              </span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          )}

          <button
            id="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Menu Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {allowedItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`sidebar-item-${item.id}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
                }`}
              >
                <div className={`${isActive ? 'text-amber-400' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </div>
                {!collapsed && <span className="truncate">{item.name}</span>}

                {/* Badges / Counters */}
                {!collapsed && item.id === 'inventory' && lowStockCount > 0 && (
                  <span className="ml-auto bg-amber-500/10 text-amber-400 border border-amber-500/25 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                    {lowStockCount} ALERT
                  </span>
                )}

                {/* Collapsed Tooltip */}
                {collapsed && (
                  <div className="absolute left-14 scale-0 group-hover:scale-100 bg-zinc-900 border border-zinc-800 text-zinc-100 px-3 py-1.5 rounded-md text-xs font-medium z-30 transition-all shadow-xl origin-left pointer-events-none whitespace-nowrap">
                    {item.name}
                    {item.id === 'inventory' && lowStockCount > 0 && ` (${lowStockCount} Low Stock)`}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/40">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-9 h-9 rounded-full object-cover border border-zinc-700 bg-zinc-800"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-100 truncate">{profile.fullName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3 h-3 text-zinc-500" />
                <span className={`px-1 py-0.2 rounded text-[9px] uppercase font-bold tracking-wider ${getRoleBadgeColor(profile.role)}`}>
                  {profile.role}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
