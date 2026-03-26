"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import { 
  Bell,
  CheckCircle,
  Warning,
  Info,
  X,
  ClockCounterClockwise
} from "@phosphor-icons/react";

export default function Notifications() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  const [isClient, setIsClient] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Application Approved",
      message: "Your broadcasting license application has been approved.",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "warning",
      title: "License Renewal Due",
      message: "Your telecommunications license expires in 30 days.",
      time: "5 hours ago",
      read: false
    },
    {
      id: 3,
      type: "info",
      title: "New Regulation Published",
      message: "Updated guidelines for postal services are now available.",
      time: "1 day ago",
      read: true
    },
    {
      id: 4,
      type: "success",
      title: "Payment Confirmed",
      message: "Your license fee payment has been processed successfully.",
      time: "2 days ago",
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "success": return <CheckCircle size={24} className="text-green-600" />;
      case "warning": return <Warning size={24} className="text-amber-600" />;
      case "info": return <Info size={24} className="text-blue-600" />;
      default: return <Bell size={24} className="text-slate-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch(type) {
      case "success": return "bg-green-50 border-green-200";
      case "warning": return "bg-amber-50 border-amber-200";
      case "info": return "bg-blue-50 border-blue-200";
      default: return "bg-slate-50 border-slate-200";
    }
  };

  const filteredNotifications = filter === "all" 
    ? notifications 
    : filter === "unread" 
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.read);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
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
          All
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
          Unread ({notifications.filter(n => !n.read).length})
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

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-xl border p-6 transition-all ${
              notification.read ? 'opacity-60' : ''
            } ${getNotificationColor(notification.type)} ${
              isDarkMode ? 'bg-white border-slate-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold ${isDarkMode ? 'text-slate-900' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-600' : 'text-gray-600'}`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <ClockCounterClockwise size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-400'} />
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
              <button className={`p-2 rounded-lg transition-all ${
                isDarkMode
                  ? 'hover:bg-slate-100 text-slate-400'
                  : 'hover:bg-gray-100 text-gray-400'
              }`}>
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
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
