"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import {
  getNotifications,
  markRead,
  markAllRead,
  dismissNotification,
} from "@/lib/api/clients/notifications";
import type { Notification } from "@/lib/api/types/notifications";
import { 
  Bell,
  CheckCircle,
  Warning,
  Info,
  X,
  ClockCounterClockwise,
  Checks,
} from "@phosphor-icons/react";

export default function Notifications() {
  const { isDarkMode } = useTheme();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getNotifications();
      if (res.success && res.data) {
        // Handle both paginated and flat array responses
        const items = Array.isArray(res.data)
          ? res.data
          : (res.data as any).results ?? [];
        setNotifications(items);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  async function handleMarkRead(id: string) {
    const res = await markRead(id);
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
    }
  }

  async function handleMarkAllRead() {
    const res = await markAllRead();
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: n.read_at || new Date().toISOString() }))
      );
    }
  }

  async function handleDismiss(id: string) {
    const res = await dismissNotification(id);
    if (res.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  }

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "IN_APP": return <Info size={24} className="text-blue-600" />;
      case "EMAIL": return <CheckCircle size={24} className="text-green-600" />;
      case "SMS": return <Warning size={24} className="text-amber-600" />;
      default: return <Bell size={24} className="text-slate-600" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = filter === "all" 
    ? notifications 
    : filter === "unread" 
      ? notifications.filter(n => !n.is_read)
      : notifications.filter(n => n.is_read);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="flex-1 pb-24 md:pb-0">
      <PortalHeader 
        title="Notifications"
        subtitle="Stay updated with important alerts and messages."
        showNewApplicationButton={false}
      />
      <div className="pt-24 md:pt-0 p-4 md:p-8 space-y-6">
        <section className={`rounded-xl bg-gradient-to-r from-blue-600/10 to-transparent p-8 border border-blue-600/5 ${isDarkMode ? 'bg-blue-600/5' : ''}`}>
          <h2 className={`text-3xl font-black ${isDarkMode ? 'text-slate-900' : 'text-gray-900'} sm:text-4xl`}>Notifications</h2>
          <p className={`mt-2 max-w-2xl text-lg ${isDarkMode ? 'text-slate-600' : 'text-gray-600'}`}>
            Stay updated with important alerts and messages.
          </p>
        </section>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === "all"
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === "unread"
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === "read"
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Read
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Checks size={16} />
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className={`text-lg ${isDarkMode ? 'text-slate-600' : 'text-gray-600'}`}>Loading notifications…</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border p-6 transition-all ${
                  notification.is_read ? 'opacity-60' : ''
                } ${
                  isDarkMode ? 'bg-white border-slate-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div 
                    className="flex items-start gap-4 flex-1 cursor-pointer"
                    onClick={() => !notification.is_read && handleMarkRead(notification.id)}
                  >
                    <div className="mt-1">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold ${isDarkMode ? 'text-slate-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        )}
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-600' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <ClockCounterClockwise size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-400'} />
                        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                          {timeAgo(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDismiss(notification.id)}
                    className={`p-2 rounded-lg transition-all ${
                      isDarkMode
                        ? 'hover:bg-slate-100 text-slate-400'
                        : 'hover:bg-gray-100 text-gray-400'
                    }`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDarkMode ? 'text-slate-600' : 'text-gray-600'}`}>
              No notifications to display.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
