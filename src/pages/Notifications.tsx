/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  Clock,
  Check,
  RotateCw,
  SlidersHorizontal
} from 'lucide-react';
import { Notification } from '../types';

interface NotificationsProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function Notifications({
  notifications,
  onMarkRead,
  onMarkAllRead
}: NotificationsProps) {
  const [filter, setFilter] = useState<'All' | 'Warning' | 'Success' | 'Info'>('All');

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => filter === 'All' || n.type === filter);
  }, [notifications, filter]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'Alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getFormatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Search and filters bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto select-none">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              filter === 'All'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('Warning')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              filter === 'Warning'
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            Warnings & Alerts
          </button>
          <button
            onClick={() => setFilter('Success')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              filter === 'Success'
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            Success logs
          </button>
          <button
            onClick={() => setFilter('Info')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              filter === 'Info'
                ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            System Info
          </button>
        </div>

        <button
          onClick={onMarkAllRead}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-lg text-xs font-semibold cursor-pointer transition-all select-none"
        >
          <Check className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      {/* Notifications listings container */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="divide-y divide-zinc-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-16 text-center text-zinc-400 text-xs">
              No notifications on file match your filter category.
            </div>
          ) : (
            filteredNotifications.map(n => (
              <div
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`p-5 flex items-start gap-4 transition-all hover:bg-zinc-50/50 cursor-pointer ${
                  !n.read ? 'bg-amber-500/[0.015]' : ''
                }`}
              >
                <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex-shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className={`text-sm font-bold truncate ${!n.read ? 'text-zinc-900 font-semibold' : 'text-zinc-700'}`}>
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="h-1.5 w-1.5 bg-amber-500 rounded-full flex-shrink-0 animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 leading-normal font-medium">{n.message}</p>
                  <p className="text-[9px] text-zinc-400 font-mono flex items-center gap-1 mt-2 font-semibold">
                    <Clock className="w-3 h-3 text-zinc-300" />
                    {getFormatTime(n.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
