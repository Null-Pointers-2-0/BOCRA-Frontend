"use client";

/**
 * Portal Header Component
 * 
 * Shared header component for all portal pages.
 * Provides responsive navigation with mobile header and desktop header.
 * 
 * Features:
 * - Mobile header with hamburger menu and user info
 * - Desktop header with search, notifications, and theme toggle
 * - Dark/light theme toggle via ThemeContext
 * - Responsive design
 * 
 * @author BOCRA Development Team
 * @version 1.0.0
 * @lastModified 2024-03-25
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { getUnreadCount } from "@/lib/api/clients/notifications";
import { 
  MagnifyingGlass, 
  Plus, 
  Bell, 
  Sun,
  Moon,
  List
} from "@phosphor-icons/react";

interface PortalHeaderProps {
  title?: string;
  subtitle?: string;
  showNewApplicationButton?: boolean;
}

export default function PortalHeader({ 
  title,
  subtitle = "Here is what's happening with your account today.",
  showNewApplicationButton = true,
}: PortalHeaderProps) {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const firstName = user?.first_name || "there";
  const userInitials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`
    : "??";
  const displayTitle = title || `Welcome back, ${firstName}`;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await getUnreadCount();
        if (res.success && res.data) {
          setUnreadCount(res.data.unread_count ?? 0);
        }
      } catch { /* ignore */ }
    }
    fetchUnread();
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Mobile Header - Fixed top bar with user info and controls */}
      <header className={`fixed top-0 left-0 right-0 z-50 shadow-lg px-6 py-4 border-b md:hidden block ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle - Hamburger menu for drawer */}
            <button
              className={`p-3 rounded-lg transition-all duration-200 transform hover:scale-110 border ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700' 
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              title="Open menu"
              onClick={() => {
                // Dispatch custom event to open mobile drawer
                window.dispatchEvent(new CustomEvent('openMobileDrawer'));
              }}
            >
              <List size={24} weight="bold" />
            </button>
            
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-600">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {userInitials}
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${
                isDarkMode ? 'text-slate-500' : 'text-gray-500'
              }`}>Welcome back,</span>
              <span className="text-lg font-bold text-blue-900 leading-none">{firstName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push("/notifications")}
              className={`p-2 rounded-full relative transition-all ${
              isDarkMode 
                ? 'hover:bg-slate-100/50' 
                : 'hover:bg-gray-100/50'
            }`}>
              <Bell size={20} className="text-blue-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${
                isDarkMode 
                  ? 'hover:bg-slate-100/50' 
                  : 'hover:bg-gray-100/50'
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-blue-700" />
              ) : (
                <Moon size={20} className="text-blue-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Header - Hidden on mobile, visible on desktop */}
      <header className={`hidden md:block border-b px-4 md:px-8 py-4 ${
        isDarkMode 
          ? 'bg-white border-slate-200' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="min-w-0">
              <h2 className={`text-lg md:text-2xl font-black tracking-tight truncate ${
                isDarkMode ? 'text-slate-900' : 'text-gray-900'
              }`}>
                {displayTitle}
              </h2>
              <p className={`text-xs md:text-sm ${
                isDarkMode ? 'text-slate-500' : 'text-gray-500'
              } hidden sm:block`}>
                {subtitle}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
              isDarkMode 
                ? 'bg-slate-700 text-slate-300' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <MagnifyingGlass size={18} className="transition-transform duration-200" />
            </button>
            <button 
              onClick={() => router.push("/notifications")}
              className={`p-2 rounded-lg relative transition-all duration-200 transform hover:scale-110 ${
              isDarkMode 
                ? 'bg-slate-700 text-slate-300' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <Bell size={18} className="transition-transform duration-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-700 text-slate-300' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              type="button"
            >
              {isDarkMode ? (
                <Sun size={18} className="transition-transform duration-200 hover:rotate-180" />
              ) : (
                <Moon size={18} className="transition-transform duration-200 hover:rotate-12" />
              )}
            </button>
            {showNewApplicationButton && (
              <>
                <div className={`hidden md:block h-8 w-[1px] mx-2 ${
                  isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                }`}></div>
                <button 
                  onClick={() => router.push("/applications")}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200"
                >
                  <Plus size={16} className="transition-transform duration-200" />
                  New Application
                </button>
                <button 
                  onClick={() => router.push("/applications")}
                  className="md:hidden p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                >
                  <Plus size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
