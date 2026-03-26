"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  House, 
  FileText, 
  Warning, 
  Bell, 
  User 
} from "@phosphor-icons/react";

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDarkMode } = useTheme();

  const navItems = [
    { id: "home", label: "Home", icon: House, path: "/dashboard" },
    { id: "applications", label: "Applications", icon: FileText, path: "/applications" },
    { id: "complaints", label: "Complaints", icon: Warning, path: "/complaints" },
    { id: "alerts", label: "Alerts", icon: Bell, path: "/notifications" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <nav className={`fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 ${
      isDarkMode 
        ? 'bg-slate-900/80' 
        : 'bg-white/80'
    } backdrop-blur-2xl rounded-t-[32px] shadow-[0_-8px_24px_rgba(24,28,32,0.06)]`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center px-5 py-2 transition-transform duration-200 active:scale-90 ${
              active
                ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-100 rounded-[20px]'
                : 'text-slate-500 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-900/20'
            }`}
          >
            <Icon 
              size={24} 
              weight={active ? "fill" : "regular"}
              className={active ? "text-sky-700" : ""}
            />
            <span className="text-[11px] font-medium leading-tight mt-1">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
