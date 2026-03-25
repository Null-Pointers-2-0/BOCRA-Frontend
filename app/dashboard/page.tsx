"use client";

/**
 * BOCRA Dashboard Component
 * 
 * This is the main dashboard page for the BOCRA regulatory portal.
 * It provides a responsive layout with desktop sidebar and mobile drawer navigation.
 * 
 * Features:
 * - Responsive design (desktop sidebar, mobile drawer)
 * - Dark/light theme toggle
 * - Navigation to different sections
 * - Statistics cards with original desktop design
 * - Mobile-optimized quick actions
 * - Recent activity tracking
 * 
 * @author BOCRA Development Team
 * @version 1.0.0
 * @lastModified 2024-03-25
 */

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  // Navigation Icons - Used in sidebar navigation
  ChartLine, 
  FileText, 
  WarningCircle, 
  IdentificationCard, 
  Bell, 
  Gear, 
  SignOut,
  
  // Action Icons - Used in quick actions and interactions
  MagnifyingGlass, 
  Plus, 
  ClockCounterClockwise, 
  ChatsCircle, 
  Warning, 
  ArrowUp, 
  CaretUp, 
  FilePlus, 
  Megaphone, 
  ClipboardText,
  List,
  CaretRight,
  CaretLeft,
  
  // UI Icons - Used for theme toggle and mobile navigation
  Sun,
  Moon,
  Headset,
  House,
  User
} from "@phosphor-icons/react";

export default function Dashboard() {
  // Router for navigation between pages
  const router = useRouter();
  
  // State management for UI interactions
  const [activeNav, setActiveNav] = useState("overview"); // Current active navigation item
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop sidebar collapse state
  const [isDarkMode, setIsDarkMode] = useState(true); // Theme mode (dark/light)
  const [isClient, setIsClient] = useState(false); // Client-side rendering flag for hydration fix
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Mobile drawer open state

  /**
   * Fix hydration mismatch between server and client rendering
   * This prevents React hydration errors by ensuring client-only components
   * only render after the component has mounted on the client
   */
  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * Toggle mobile sidebar drawer open/closed
   * Used when user clicks the hamburger menu on mobile
   */
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  /**
   * Close mobile sidebar drawer
   * Called when user clicks overlay or navigation item
   */
  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  /**
   * Desktop sidebar navigation items
   * These appear in the desktop sidebar navigation
   */
  const navItems = [
    { id: "overview", label: "Overview", icon: ChartLine },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "complaints", label: "My Complaints", icon: WarningCircle },
    { id: "licenses", label: "My Licenses", icon: IdentificationCard },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
  ];

  /**
   * Mobile bottom navigation items
   * These appear in the mobile bottom navigation bar
   */
  const mobileNavItems = [
    { id: "overview", label: "Home", icon: House, href: "/dashboard" },
    { id: "applications", label: "Applications", icon: FileText, href: "/applications" },
    { id: "complaints", label: "Complaints", icon: WarningCircle, href: "/complaints" },
    { id: "notifications", label: "Alerts", icon: Bell, badge: 3, href: "/notifications" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ];

  /**
   * Recent activity data structure
   * Currently empty - will be populated with actual user activity data
   */
  const recentActivity: Array<{
    type: string;
    title: string;
    id: string;
    status: string;
    statusColor: string;
    date: string;
    icon: any;
  }> = [];

  /**
   * Quick action buttons for desktop sidebar
   * These provide easy access to common user actions
   */
  const quickActions = [
    { 
      id: "new-app", 
      title: "New Application", 
      description: "Submit a new application", 
      icon: FilePlus, 
      bgColor: "bg-blue-100", 
      iconColor: "text-blue-600", 
      hoverBg: "hover:bg-blue-50" 
    },
    { 
      id: "file-complaint", 
      title: "File Complaint", 
      description: "Submit a complaint", 
      icon: Megaphone, 
      bgColor: "bg-amber-100", 
      iconColor: "text-amber-600", 
      hoverBg: "hover:bg-amber-50", 
      link: "/complaints" 
    }
  ];

  /**
   * Get status color classes for activity items
   * Returns appropriate Tailwind classes based on status type
   * @param color - Status color identifier
   * @returns Tailwind CSS classes for styling
   */
  const getStatusColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      green: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
      slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    };
    return colors[color as keyof typeof colors] || colors.slate;
  };

  return (
    // Main dashboard container with responsive layout
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-50' : 'bg-gray-50'} pb-0 md:pb-0`}>
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      {/* Hidden on mobile, visible on desktop (md: breakpoint) */}
      <aside className={`hidden md:flex ${sidebarCollapsed ? 'w-20' : 'w-64'} ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800' 
          : 'bg-white border-gray-200'
      } border-r flex flex-col transition-all duration-300 ease-in-out`}>
        {/* Logo Section - BOCRA branding */}
        <div className={`p-6 flex items-center justify-center border-b ${
          isDarkMode ? 'border-slate-800' : 'border-gray-200'
        }`}>
          <div className="relative">
            <Image 
              src="/bocra-logo.png" 
              alt="BOCRA Logo" 
              width={sidebarCollapsed ? 32 : 48}
              height={sidebarCollapsed ? 32 : 48}
              className="object-contain transition-all duration-300"
            />
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {/* Navigation Items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-all duration-200 w-full ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isDarkMode 
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={20} weight={isActive ? "fill" : "regular"} />
                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            );
          })}

          {/* Bottom Navigation Actions */}
          <div className={`pt-6 mt-6 border-t space-y-2 ${
          isDarkMode ? 'border-slate-800' : 'border-gray-200'
        }`}>
            {/* TODO: Add Settings functionality */}
            <button 
              className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors w-full ${
                isDarkMode 
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="Settings (Coming Soon)"
            >
              <Gear size={20} />
              {!sidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
            </button>
            
            {/* TODO: Implement logout functionality */}
            <button 
              className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors w-full ${
                isDarkMode 
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-red-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-red-600'
              }`}
              title="Logout (Coming Soon)"
            >
              <SignOut size={20} />
              {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className={`p-4 border-t ${
          isDarkMode ? 'border-slate-800' : 'border-gray-200'
        }`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg ${
            isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
          }`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              TM
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Thabo Molapo</p>
                <p className={`text-xs truncate ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>Business User</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ==================== MOBILE DRAWER SIDEBAR ==================== */}
      {/* Overlay for mobile sidebar - only renders on client to prevent hydration issues */}
      {isClient && isMobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Mobile Sidebar Drawer - slides in from left */}
      {isClient && (
        <aside className={`md:hidden fixed left-0 top-0 h-full w-64 ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-gray-200'
        } border-r flex flex-col transition-all duration-300 ease-in-out z-50 transform ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Mobile Sidebar Header with logo and close button */}
          <div className={`p-6 flex items-center justify-between border-b ${
            isDarkMode ? 'border-slate-800' : 'border-gray-200'
          }`}>
            <div className="relative">
              <Image 
                src="/bocra-logo.png" 
                alt="BOCRA Logo" 
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <button
              onClick={closeMobileSidebar}
              className={`p-2 rounded-lg transition-all ${
                isDarkMode 
                  ? 'hover:bg-slate-800 text-slate-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Close sidebar"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
          </div>

          {/* Mobile Navigation Items */}
          <nav className="flex-1 px-3 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.id === 'complaints') {
                      router.push('/complaints');
                    }
                    closeMobileSidebar();
                  }}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 w-full ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isDarkMode 
                        ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon size={20} weight={isActive ? "fill" : "regular"} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className={`pt-6 mt-6 border-t space-y-2 ${
            isDarkMode ? 'border-slate-800' : 'border-gray-200'
          }`}>
              <button className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full ${
                isDarkMode 
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
                <Gear size={20} />
                <span className="text-sm font-medium">Settings</span>
              </button>
              <button className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full ${
                isDarkMode 
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-red-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-red-600'
              }`}>
                <SignOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </nav>

          {/* Mobile User Profile Section */}
          <div className={`p-4 border-t ${
            isDarkMode ? 'border-slate-800' : 'border-gray-200'
          }`}>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                TM
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Thabo Molapo</p>
                <p className={`text-xs truncate ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>Business User</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <main className={`flex-1 pb-24 md:pb-0 ${
        isDarkMode ? 'bg-slate-50' : 'bg-gray-50'
      }`}>
        {/* Mobile Header - Fixed top bar with user info and controls */}
        <header className={`md:hidden fixed top-0 left-0 right-0 z-40 backdrop-blur-xl shadow-sm px-6 py-4 ${
          isDarkMode 
            ? 'bg-white/80 border-slate-200' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle - Hamburger menu for drawer */}
              <button
                onClick={toggleMobileSidebar}
                className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                  isDarkMode 
                    ? 'hover:bg-slate-700 text-slate-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Open menu"
              >
                <List size={20} weight="bold" />
              </button>
              
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-600">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  TM
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-500' : 'text-gray-500'
                }`}>Welcome back,</span>
                <span className="text-lg font-bold text-blue-900 leading-none">Thabo</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className={`p-2 rounded-full transition-all ${
                isDarkMode 
                  ? 'hover:bg-slate-100/50' 
                  : 'hover:bg-gray-100/50'
              }`}>
                <Bell size={20} className="text-blue-700" />
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
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
              {/* Desktop Sidebar Toggle Button */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`hidden md:block p-2 rounded-lg transition-all duration-200 transform hover:scale-110 cursor-pointer ${
                  isDarkMode 
                    ? 'hover:bg-slate-700 text-slate-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                type="button"
              >
                {sidebarCollapsed ? (
                  <CaretRight size={24} weight="bold" className="transition-transform duration-200" />
                ) : (
                  <CaretLeft size={24} weight="bold" className="transition-transform duration-200" />
                )}
              </button>
              
              <div className="min-w-0">
                <h2 className={`text-lg md:text-2xl font-black tracking-tight truncate ${
                  isDarkMode ? 'text-slate-900' : 'text-gray-900'
                }`}>
                  Welcome back, Thabo
                </h2>
                <p className={`text-xs md:text-sm ${
                  isDarkMode ? 'text-slate-500' : 'text-gray-500'
                } hidden sm:block`}>
                  Here is what's happening with your account today.
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
              <button className={`p-2 rounded-lg relative transition-all duration-200 transform hover:scale-110 ${
                isDarkMode 
                  ? 'bg-slate-700 text-slate-300' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <Bell size={18} className="transition-transform duration-200" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white animate-pulse"></span>
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
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
              <div className={`hidden md:block h-8 w-[1px] mx-2 ${
                isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
              }`}></div>
              <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200">
                <Plus size={16} className="transition-transform duration-200" />
                New Application
              </button>
              <button className="md:hidden p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <Plus size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <div className={`pt-24 md:pt-0 p-4 md:p-8 space-y-8 md:space-y-8`}>
          {/* ==================== STATISTICS CARDS ==================== */}
          {/* Responsive grid: 1 column on mobile, 3 columns on desktop */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ==================== DESKTOP CARDS (Original Design) ==================== */}
            <div className={`hidden md:block p-6 rounded-xl shadow-sm ${
              isDarkMode 
                ? 'bg-white border-slate-200' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`font-medium text-sm ${
                  isDarkMode ? 'text-slate-500' : 'text-gray-500'
                }`}>Active Applications</span>
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <ClockCounterClockwise size={20} />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black">4</p>
                <span className="text-green-600 text-sm font-bold pb-1 flex items-center tracking-tight">
                  <ArrowUp size={16} className="mr-1" /> 1 this month
                </span>
              </div>
            </div>

            <div className={`hidden md:block p-6 rounded-xl shadow-sm ${
              isDarkMode 
                ? 'bg-white border-slate-200' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`font-medium text-sm ${
                  isDarkMode ? 'text-slate-500' : 'text-gray-500'
                }`}>Pending Complaints</span>
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                  <ChatsCircle size={20} />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black">2</p>
                <span className={`text-sm font-bold pb-1 ${
                  isDarkMode ? 'text-slate-500' : 'text-gray-500'
                }`}>No change</span>
              </div>
            </div>

            <div className={`hidden md:block p-6 rounded-xl shadow-sm ${
              isDarkMode 
                ? 'bg-white border-slate-200' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`font-medium text-sm ${
                  isDarkMode ? 'text-slate-500' : 'text-gray-500'
                }`}>Critical Alerts</span>
                <div className="bg-red-100 p-2 rounded-lg text-red-600">
                  <Warning size={20} />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black">1</p>
                <span className="text-red-600 text-sm font-bold pb-1 flex items-center tracking-tight">
                  <CaretUp size={16} className="mr-1" /> Action required
                </span>
              </div>
            </div>

            {/* ==================== MOBILE CARDS (Mobile-Optimized Design) ==================== */}
            <div className={`md:hidden md:col-span-3 p-6 rounded-lg shadow-sm flex flex-col justify-between min-h-[140px] relative overflow-hidden group ${
              isDarkMode 
                ? 'bg-white border-slate-200' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div>
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-slate-500' : 'text-gray-500'
                }`}>Active Applications</span>
                <h2 className="text-4xl font-extrabold text-blue-600 tracking-tight mt-1">4</h2>
              </div>
              <div className="flex items-center gap-1 text-blue-600 font-semibold text-sm">
                <span>Manage all</span>
                <CaretRight size={16} weight="bold" />
              </div>
            </div>

            <div className={`md:hidden p-5 rounded-lg flex flex-col justify-between min-h-[120px] ${
              isDarkMode 
                ? 'bg-slate-100 border-slate-200' 
                : 'bg-gray-100 border-gray-200'
            }`}>
              <span className={`text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-slate-600' : 'text-gray-600'
              }`}>Pending</span>
              <div>
                <h3 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-slate-900' : 'text-gray-900'
                }`}>2</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-500' : 'text-gray-500'
                }`}>Complaints</p>
              </div>
            </div>

            <div className={`md:hidden p-5 rounded-lg flex flex-col justify-between min-h-[120px] bg-pink-100 ${
              isDarkMode ? '' : ''
            }`}>
              <span className="text-xs font-semibold text-pink-700 uppercase tracking-wider">Critical</span>
              <div>
                <h3 className="text-2xl font-bold text-pink-900">1</h3>
                <p className="text-sm text-pink-700">Alert</p>
              </div>
            </div>
          </section>

          {/* ==================== MOBILE QUICK ACTIONS ==================== */}
          <section className="md:hidden space-y-4">
            <h3 className="text-xl font-bold tracking-tight px-1">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm active:scale-95 transition-all space-y-2 border border-transparent hover:border-blue-600/20">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                  <FilePlus size={24} weight="fill" className="text-blue-600" />
                </div>
                <span className="text-[11px] font-bold text-center leading-tight text-slate-700">New License</span>
              </button>
              <a href="/complaints" className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm active:scale-95 transition-all space-y-2 border border-transparent hover:border-amber-600/20">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/10 flex items-center justify-center">
                  <Megaphone size={24} weight="fill" className="text-amber-600" />
                </div>
                <span className="text-[11px] font-bold text-center leading-tight text-slate-700">Submit Complaint</span>
              </a>
              <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm active:scale-95 transition-all space-y-2 border border-transparent hover:border-blue-600/20">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                  <FileText size={24} weight="fill" className="text-blue-600" />
                </div>
                <span className="text-[11px] font-bold text-center leading-tight text-slate-700">Policy Docs</span>
              </button>
            </div>
          </section>

          {/* ==================== ACTIVITY & QUICK ACTIONS ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* ==================== RECENT ACTIVITY LIST ==================== */}
            <section className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xl font-bold tracking-tight">Recent Activity</h3>
                <button className="text-sm font-semibold text-blue-600">View All</button>
              </div>
              <div className={`rounded-xl overflow-hidden shadow-sm ${
                isDarkMode 
                  ? 'bg-white border-slate-200' 
                  : 'bg-white border-gray-200'
              }`}>
                {recentActivity.length === 0 ? (
                  <div className="p-8 text-center">
                    <ClipboardText size={48} className={`mx-auto mb-4 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                    <p className={isDarkMode ? 'text-slate-500' : 'text-gray-500'}>
                      No recent activity
                    </p>
                    <p className={`text-sm mt-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-400'
                    }`}>Your activities will appear here</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${
                        isDarkMode 
                          ? 'bg-slate-50 border-slate-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${
                          isDarkMode ? 'text-slate-500' : 'text-gray-500'
                        }`}>Activity</th>
                        <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${
                          isDarkMode ? 'text-slate-500' : 'text-gray-500'
                        }`}>ID / Reference</th>
                        <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${
                          isDarkMode ? 'text-slate-500' : 'text-gray-500'
                        }`}>Status</th>
                        <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${
                          isDarkMode ? 'text-slate-500' : 'text-gray-500'
                        }`}>Date</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${
                      isDarkMode ? 'divide-slate-100' : 'divide-gray-100'
                    }`}>
                      {recentActivity.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <tr key={index} className={`transition-colors ${
                            isDarkMode ? 'hover:bg-slate-50' : 'hover:bg-gray-50'
                          }`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Icon size={20} className="text-blue-600" />
                                <span className="text-sm font-medium">{activity.title}</span>
                              </div>
                            </td>
                            <td className={`px-6 py-4 text-sm ${
                              isDarkMode ? 'text-slate-600' : 'text-gray-600'
                            }`}>{activity.id}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${getStatusColor(activity.statusColor)}`}>
                                {activity.status}
                              </span>
                            </td>
                            <td className={`px-6 py-4 text-sm ${
                              isDarkMode ? 'text-slate-500' : 'text-gray-500'
                            }`}>{activity.date}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* ==================== DESKTOP QUICK ACTIONS ==================== */}
            <section className="hidden md:block space-y-4">
              <h3 className="text-lg font-bold tracking-tight">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  
                  if (action.link) {
                    return (
                      <a
                        key={index}
                        href={action.link}
                        className={`flex items-center gap-4 p-4 rounded-xl hover:shadow-md transition-all group text-left ${
                          isDarkMode 
                            ? 'bg-white border-slate-200' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className={`${action.bgColor} ${action.iconColor} p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{action.title}</p>
                          <p className={`text-xs ${
                            isDarkMode ? 'text-slate-500' : 'text-gray-500'
                          }`}>{action.description}</p>
                        </div>
                      </a>
                    );
                  }
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`flex items-center gap-4 p-4 rounded-xl hover:shadow-md transition-all group text-left ${
                        isDarkMode 
                          ? 'bg-white border-slate-200' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className={`${action.bgColor} ${action.iconColor} p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{action.title}</p>
                        <p className={`text-xs ${
                          isDarkMode ? 'text-slate-500' : 'text-gray-500'
                        }`}>{action.description}</p>
                      </div>
                    </button>
                  );
                })}

                {/* Information Card */}
                <div className="mt-4 p-6 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 rounded-xl text-white relative overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                  <div className="relative z-10">
                    <h4 className="font-bold mb-2 text-lg">Need help?</h4>
                    <p className="text-sm opacity-90 mb-4">
                      Our support team is available Mon-Fri, 8am - 5pm to assist with your applications.
                    </p>
                    <button className="bg-white text-blue-800 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-slate-100 transform hover:scale-105 transition-all duration-200">
                      Contact Support
                    </button>
                  </div>
                  {/* Abstract Pattern Overlay */}
                  <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                    <Headset size={120} />
                  </div>
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ==================== MOBILE BOTTOM NAVIGATION ==================== */}
      {/* Fixed bottom navigation bar - always visible on mobile */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 pt-3 pb-8 backdrop-blur-2xl rounded-t-[32px] shadow-[0_-8px_24px_rgba(24,28,32,0.06)] ${
        isDarkMode 
          ? 'bg-white/80' 
          : 'bg-white/80'
      }`}>
        {/* Mobile Navigation Items */}
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                if (item.href) {
                  router.push(item.href);
                }
              }}
              className={`flex flex-col items-center justify-center rounded-[20px] px-5 py-2 transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-slate-500'
              }`}
            >
              <Icon 
                size={24} 
                weight={isActive ? "fill" : "regular"}
                className={isActive ? 'text-blue-700' : ''}
              />
              <span className="text-[11px] font-medium leading-tight mt-1">{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ==================== FLOATING ACTION BUTTON ==================== */}
      {/* Mobile FAB for quick access to new applications */}
      <div className={`md:hidden fixed bottom-28 right-6 z-40`}>
        <button 
          onClick={() => router.push('/applications/new')}
          className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center active:scale-90 transition-transform"
          title="New Application"
        >
          <Plus size={24} weight="bold" />
        </button>
      </div>
    </div>
  );
}
