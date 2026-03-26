"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChartLine,
  FileText,
  WarningCircle,
  IdentificationCard,
  Bell,
  Gear,
  SignOut,
  X,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { ProfileModal } from "./ProfileModal";

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isDarkMode: boolean;
}

export const PortalSidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  sidebarCollapsed,
  setSidebarCollapsed,
  isDarkMode,
}) => {
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const navItems = [
    { id: "overview", label: "Overview", icon: ChartLine },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "complaints", label: "My Complaints", icon: WarningCircle },
    { id: "licenses", label: "My Licenses", icon: IdentificationCard },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
  ];

  // Listen for mobile drawer toggle event
  useEffect(() => {
    const handleOpenMobileDrawer = () => {
      setIsMobileDrawerOpen(true);
    };

    window.addEventListener('openMobileDrawer', handleOpenMobileDrawer);
    
    return () => {
      window.removeEventListener('openMobileDrawer', handleOpenMobileDrawer);
    };
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex fixed left-0 top-0 ${sidebarCollapsed ? 'w-20' : 'w-64'} ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800' 
          : 'bg-white border-gray-200'
      } border-r flex flex-col h-screen transition-all duration-300 ease-in-out z-50`}>
      {/* Logo Section - BOCRA branding */}
      <div className={`p-6 flex items-center justify-between border-b ${
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
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`hidden md:flex p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
            isDarkMode 
              ? 'hover:bg-slate-800 text-slate-400' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <CaretRight size={16} /> : <CaretLeft size={16} />}
        </button>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                if (item.id === 'overview') router.push('/dashboard');
                if (item.id === 'applications') router.push('/applications');
                if (item.id === 'complaints') router.push('/complaints');
                if (item.id === 'licenses') router.push('/licenses');
                if (item.id === 'notifications') router.push('/notifications');
              }}
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
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Profile"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              TM
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className={`text-sm font-semibold truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Thabo Molapo</p>
                <p className={`text-xs truncate ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>Business User</p>
              </div>
            )}
          </button>
        </div>
        
        {/* Profile Modal */}
        <div className="relative z-[70]">
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            isDarkMode={isDarkMode}
          />
        </div>
      </aside>

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed inset-0 z-[60] ${isMobileDrawerOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileDrawerOpen(false)}
        />
        
        {/* Drawer */}
        <aside className={`absolute left-0 top-0 h-full w-80 max-w-[80vw] ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-gray-200'
        } border-r flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Drawer Header */}
          <div className={`p-6 flex items-center justify-between border-b ${
            isDarkMode ? 'border-slate-800' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <Image 
                src="/bocra-logo.png" 
                alt="BOCRA Logo" 
                width={32}
                height={32}
                className="object-contain"
              />
              <span className={`text-lg font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>BOCRA</span>
            </div>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'hover:bg-slate-800 text-slate-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setIsMobileDrawerOpen(false);
                    if (item.id === 'overview') router.push('/dashboard');
                    if (item.id === 'applications') router.push('/applications');
                    if (item.id === 'complaints') router.push('/complaints');
                    if (item.id === 'licenses') router.push('/licenses');
                    if (item.id === 'notifications') router.push('/notifications');
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

            {/* Bottom Navigation Actions */}
            <div className={`pt-6 mt-6 border-t space-y-2 ${
              isDarkMode ? 'border-slate-800' : 'border-gray-200'
            }`}>
              <button 
                className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full ${
                  isDarkMode 
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Settings (Coming Soon)"
              >
                <Gear size={20} />
                <span className="text-sm font-medium">Settings</span>
              </button>
              
              <button 
                className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full ${
                  isDarkMode 
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-red-400'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-red-600'
                }`}
                title="Logout (Coming Soon)"
              >
                <SignOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </nav>

          {/* Mobile User Profile Section */}
          <div className={`p-4 border-t ${
            isDarkMode ? 'border-slate-800' : 'border-gray-200'
          }`}>
            <button
              onClick={() => {
                setIsProfileModalOpen(true);
                setIsMobileDrawerOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                TM
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Thabo Molapo</p>
                <p className={`text-xs ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>Business User</p>
              </div>
            </button>
          </div>
        </aside>
      </div>

      {/* Profile Modal */}
      <div className="relative z-[70]">
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      </div>
    </>
  );
};
