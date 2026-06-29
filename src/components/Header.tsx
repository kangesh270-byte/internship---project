/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  Clock,
  User,
  Settings,
  LogOut,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Notification, UserRole } from '../types';

interface HeaderProps {
  activeTab: string;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  profile: { fullName: string; role: UserRole; avatarUrl?: string; email: string };
  onTabChange: (tab: string) => void;
}

export default function Header({
  activeTab,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  profile,
  onTabChange
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Command Center';
      case 'customers': return 'Customer Directory & Accounts';
      case 'products': return 'Enterprise Product Catalog';
      case 'inventory': return 'Inventory Logs & Stock control';
      case 'suppliers': return 'Approved Vendors & Suppliers';
      case 'sales': return 'Point of Sale (POS) Terminal';
      case 'employees': return 'Human Resources & Attendance';
      case 'analytics': return 'Business Intelligence & BI';
      case 'reports': return 'Financial Report Engine';
      case 'notifications': return 'System Notifications Feed';
      case 'settings': return 'Administrative System Settings';
      default: return 'Management Console';
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'Warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'Alert': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <header
      id="top-header"
      className="sticky top-0 z-10 w-full h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-6 select-none"
    >
      {/* Search and Title */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-zinc-900 tracking-tight">
            {getTabTitle(activeTab)}
          </h1>
          <p className="text-[11px] font-mono text-zinc-400 font-medium tracking-wide flex items-center gap-1.5 uppercase">
            <Calendar className="w-3 h-3 text-zinc-300" />
            Active Session • June 29, 2026 • 09:36 AM
          </p>
        </div>
      </div>

      {/* Quick Utilities */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="notification-trigger"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/80 transition-all border border-zinc-100 cursor-pointer relative"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-dropdown-panel"
              className="absolute right-0 mt-2.5 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden z-30"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 border-b border-zinc-100">
                <span className="text-xs font-semibold text-zinc-700">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      onClearNotifications();
                      setShowNotifications(false);
                    }}
                    className="text-[10px] text-zinc-500 hover:text-zinc-800 font-medium cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-zinc-400 text-xs">
                    No notifications at this time.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onMarkNotificationRead(n.id);
                      }}
                      className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-zinc-50 cursor-pointer ${
                        !n.read ? 'bg-amber-500/[0.02]' : ''
                      }`}
                    >
                      <div className="mt-0.5">{getNotificationIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-medium truncate ${!n.read ? 'text-zinc-900 font-semibold' : 'text-zinc-700'}`}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="h-1.5 w-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-zinc-100 bg-zinc-50 text-center">
                <button
                  onClick={() => {
                    onTabChange('notifications');
                    setShowNotifications(false);
                  }}
                  className="w-full text-center text-xs text-zinc-600 hover:text-zinc-900 font-medium py-1 cursor-pointer"
                >
                  View all alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            id="profile-dropdown-trigger"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pl-3 pr-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-all cursor-pointer text-left select-none"
          >
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-zinc-800">{profile.fullName}</span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider font-semibold uppercase">
                {profile.role}
              </span>
            </div>
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-7 h-7 rounded-full object-cover border border-zinc-200"
            />
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {showProfileMenu && (
            <div
              id="profile-dropdown-panel"
              className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden z-30"
            >
              <div className="p-3 border-b border-zinc-50 bg-zinc-50/50">
                <p className="text-xs font-semibold text-zinc-800">{profile.fullName}</p>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5">{profile.email}</p>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => {
                    onTabChange('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg cursor-pointer transition-all"
                >
                  <User className="w-4 h-4 text-zinc-400" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    onTabChange('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg cursor-pointer transition-all"
                >
                  <Settings className="w-4 h-4 text-zinc-400" />
                  Account Settings
                </button>
              </div>

              <div className="p-1.5 border-t border-zinc-50">
                <button
                  onClick={() => {
                    alert("Demo Session logouts are locked. This is the main admin workspace.");
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  Lock Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
