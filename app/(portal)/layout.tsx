"use client";

import React, { useState, useEffect } from "react";
import { PortalSidebar } from "@/components/PortalSidebar";
import BottomNavigation from "@/components/BottomNavigation";
import { useTheme } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

function PortalContent({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useTheme();
  const { isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Determine active nav based on current path
  const getActiveNav = () => {
    if (pathname?.includes("/dashboard")) return "overview";
    if (pathname?.includes("/applications")) return "applications";
    if (pathname?.includes("/complaints")) return "complaints";
    if (pathname?.includes("/licenses")) return "licenses";
    if (pathname?.includes("/licensing")) return "licensing";
    if (pathname?.includes("/domains")) return "domains";
    if (pathname?.includes("/alerts")) return "alerts";
    if (pathname?.includes("/notifications")) return "notifications";
    return "overview";
  };

  const [activeNav, setActiveNav] = useState(getActiveNav());

  useEffect(() => {
    setActiveNav(getActiveNav());
  }, [pathname]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <PortalSidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          isDarkMode={isDarkMode}
        />

        {/* Main content area with sidebar offset */}
        <main
          className={`flex-1 pb-24 md:pb-20 ${
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          } transition-all duration-300`}
        >
          {children}
        </main>
        
        {/* Bottom Navigation - Always visible */}
        <BottomNavigation />
      </div>
    </div>
  );
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <PortalContent>{children}</PortalContent>
    </AuthProvider>
  );
}
