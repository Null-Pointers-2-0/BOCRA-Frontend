"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import ApplicationDialog from "../../../components/ApplicationDialog";
import { 
  MagnifyingGlass,
  Plus,
  CheckCircle,
  CaretRight,
  CaretLeft,
  Buildings,
  FileText,
  CellTower,
  Broadcast,
  Envelope,
  Network,
  Radio,
  Package
} from "@phosphor-icons/react";

export default function Licenses() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<{ title: string; category: string } | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation classes
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const licenses = [
    {
      id: 1,
      title: "Aircraft Radio License",
      category: "telecommunications",
      description: "License for aircraft radio communication equipment and operations",
      requirements: [
        "Aircraft registration",
        "Radio equipment specifications",
        "Operator certification"
      ],
      icon: Radio,
      color: "telecom"
    },
    {
      id: 2,
      title: "Amateur Radio License",
      category: "broadcasting",
      description: "License for amateur radio operators and hobby radio communications",
      requirements: [
        "Technical examination",
        "Equipment approval",
        "Station location"
      ],
      icon: Radio,
      color: "broadcasting"
    },
    {
      id: 3,
      title: "Broadcasting License",
      category: "broadcasting",
      description: "License for radio and television broadcasting services",
      requirements: [
        "Content plan approval",
        "Technical infrastructure",
        "Broadcast frequency allocation"
      ],
      icon: Broadcast,
      color: "broadcasting"
    },
    {
      id: 4,
      title: "Cellular License",
      category: "telecommunications",
      description: "License for mobile cellular network operations",
      requirements: [
        "Network coverage plan",
        "Spectrum allocation",
        "Technical capability"
      ],
      icon: CellTower,
      color: "telecom"
    },
    {
      id: 5,
      title: "Citizen Band Radio License",
      category: "broadcasting",
      description: "License for citizen band radio communication services",
      requirements: [
        "Equipment specifications",
        "Operating frequency",
        "User registration"
      ],
      icon: Radio,
      color: "broadcasting"
    },
    {
      id: 6,
      title: "Point-to-Multipoint License",
      category: "telecommunications",
      description: "License for point-to-multipoint wireless communication systems",
      requirements: [
        "Network topology",
        "Frequency planning",
        "Technical specifications"
      ],
      icon: Network,
      color: "telecom"
    },
    {
      id: 7,
      title: "Point-to-Point License",
      category: "telecommunications",
      description: "License for point-to-point wireless communication links",
      requirements: [
        "Link budget analysis",
        "Frequency coordination",
        "Equipment certification"
      ],
      icon: Network,
      color: "telecom"
    },
    {
      id: 8,
      title: "Private Radio Communication License",
      category: "telecommunications",
      description: "License for private radio communication networks",
      requirements: [
        "Network design",
        "Frequency allocation",
        "User organization details"
      ],
      icon: Radio,
      color: "telecom"
    },
    {
      id: 9,
      title: "Radio Dealers License",
      category: "telecommunications",
      description: "License for dealing in radio communication equipment",
      requirements: [
        "Business registration",
        "Technical expertise",
        "Premises approval"
      ],
      icon: Package,
      color: "telecom"
    },
    {
      id: 10,
      title: "Radio Frequency License",
      category: "telecommunications",
      description: "License for specific radio frequency usage",
      requirements: [
        "Frequency application",
        "Technical parameters",
        "Interference analysis"
      ],
      icon: Radio,
      color: "telecom"
    },
    {
      id: 11,
      title: "Satellite Service License",
      category: "telecommunications",
      description: "License for satellite communication services",
      requirements: [
        "Satellite specifications",
        "Orbital coordination",
        "Ground station details"
      ],
      icon: Network,
      color: "telecom"
    },
    {
      id: 12,
      title: "Type Approval License",
      category: "telecommunications",
      description: "License for telecommunications equipment type approval",
      requirements: [
        "Equipment testing",
        "Technical documentation",
        "Compliance certification"
      ],
      icon: Package,
      color: "telecom"
    },
    {
      id: 13,
      title: "VANS License",
      category: "internet",
      description: "License for Value Added Network Services",
      requirements: [
        "Service description",
        "Network infrastructure",
        "Financial capability"
      ],
      icon: Network,
      color: "internet"
    }
  ];

  const categories = [
    { id: "all", label: "All Categories", icon: MagnifyingGlass },
    { id: "telecommunications", label: "Telecommunications", icon: CellTower },
    { id: "broadcasting", label: "Broadcasting", icon: Broadcast },
    { id: "postal", label: "Postal Services", icon: Package },
    { id: "internet", label: "Internet Services", icon: Network }
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case "telecom":
        return {
          bg: "bg-blue-600",
          lightBg: "bg-blue-100",
          text: "text-blue-600",
          border: "border-blue-600",
          hoverBorder: "hover:border-blue-600/50"
        };
      case "broadcasting":
        return {
          bg: "bg-green-600",
          lightBg: "bg-green-100",
          text: "text-green-600",
          border: "border-green-600",
          hoverBorder: "hover:border-green-600/50"
        };
      case "postal":
        return {
          bg: "bg-pink-600",
          lightBg: "bg-pink-100",
          text: "text-pink-600",
          border: "border-pink-600",
          hoverBorder: "hover:border-pink-600/50"
        };
      case "internet":
        return {
          bg: "bg-yellow-500",
          lightBg: "bg-yellow-100",
          text: "text-yellow-600",
          border: "border-yellow-500",
          hoverBorder: "hover:border-yellow-500/50"
        };
      default:
        return {
          bg: "bg-blue-600",
          lightBg: "bg-blue-100",
          text: "text-blue-600",
          border: "border-blue-600",
          hoverBorder: "hover:border-blue-600/50"
        };
    }
  };

  const handleApplyClick = (license: { title: string; category: string }) => {
    setSelectedLicense(license);
    setIsApplicationDialogOpen(true);
  };

  const filteredLicenses = licenses.filter(license => {
    const matchesCategory = selectedCategory === "all" || license.category === selectedCategory;
    const matchesSearch = license.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         license.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredLicenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLicenses = filteredLicenses.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
        title="License Catalog"
        subtitle="Browse available regulatory licenses and start your application process today. Ensure you have all required documentation ready."
        showNewApplicationButton={false}
      />
      
      <div className="pt-24 md:pt-0 p-4 md:p-8 space-y-6 md:space-y-8 animate-fadeIn">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 animate-slideDown">
          <button className="hover:text-blue-600 transition-all duration-300 hover:scale-105">Home</button>
          <CaretRight size={16} className="text-slate-400" />
          <span className="font-medium text-slate-900 dark:text-slate-200">Licensing & Applications</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-slideUp">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3 animate-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">License Catalog</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Browse available regulatory licenses and start your application process today. Ensure you have all required documentation ready.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:-translate-y-1">
            <FileText size={20} />
            View My Applications
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            {/* Categories Filter */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  const colorClasses = getColorClasses(category.id);
                  
                  return (
                    <label
                      key={category.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        isSelected
                          ? `${colorClasses.lightBg} ${colorClasses.text}`
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={isSelected}
                        onChange={() => setSelectedCategory(category.id)}
                        className="hidden"
                      />
                      <Icon size={16} className={
                      isSelected 
                        ? colorClasses.text 
                        : category.id === 'telecommunications'
                          ? 'text-blue-600'
                          : category.id === 'broadcasting'
                            ? 'text-green-600'
                            : category.id === 'postal'
                              ? 'text-pink-600'
                              : category.id === 'internet'
                                ? 'text-yellow-600'
                                : isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    } />
                      <span className={`text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                        {category.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Application Process */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Application Process</h3>
              <div className="space-y-6 relative">
                <div className="absolute left-4 top-1 h-[calc(100%-12px)] w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                {['Details', 'Documents', 'Review', 'Payment'].map((step, index) => (
                  <div key={step} className="relative flex items-center gap-4">
                    <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-sm ${index === 0 ? 'font-semibold' : 'font-medium text-slate-500'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpful Links */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">Helpful Links</h3>
              <p className="mb-4 text-xs text-slate-500">Resources to assist you</p>
              <div className="space-y-3">
                <button className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm font-medium hover:text-blue-600 transition-colors w-full text-left">
                  <MagnifyingGlass size={16} className="text-blue-600" />
                  Licensing FAQs
                </button>
                <button className="flex items-center gap-3 p-3 text-sm font-medium hover:text-blue-600 transition-colors w-full text-left">
                  <FileText size={16} className="text-slate-400" />
                  Fee Schedule
                </button>
                <button className="flex items-center gap-3 p-3 text-sm font-medium hover:text-blue-600 transition-colors w-full text-left">
                  <Package size={16} className="text-slate-400" />
                  Download Guide
                </button>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-9">
            {/* Search Bar */}
            <div className="relative group mb-8">
              <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search licenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 hover:border-blue-300 hover:shadow-lg focus:scale-[1.02] animate-slideUp"
              />
            </div>

            {/* License Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentLicenses.map((license) => {
                const Icon = license.icon;
                const colorClasses = getColorClasses(license.color);
                
                return (
                  <div
                    key={license.id}
                    className={`group flex flex-col rounded-2xl border p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border-t-4 hover:-translate-y-2 hover:scale-105 animate-fadeInUp ${
                    isDarkMode
                      ? `bg-slate-800 border-slate-700 hover:border-slate-600 ${colorClasses.border}`
                      : `bg-white border-gray-200 hover:border-gray-300 ${colorClasses.border}`
                  }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses.lightBg} ${colorClasses.text}`}>
                        <Icon size={24} />
                      </div>
                      <span className={`rounded-full ${colorClasses.lightBg} px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${colorClasses.text}`}>
                        {license.category}
                      </span>
                    </div>
                    
                    <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                      {license.title}
                    </h3>
                    
                    <p className="mb-6 flex-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {license.description}
                    </p>
                    
                    <div className="mb-6 space-y-3">
                      {license.requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <CheckCircle size={14} className={colorClasses.text} />
                          {req}
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => handleApplyClick({ title: license.title, category: license.category })}
                      className={`w-full rounded-xl ${colorClasses.bg} py-4 font-bold text-white transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.05] group-hover:-translate-y-1 active:scale-95 hover:animate-pulse ${
                        license.color === 'internet' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      Apply Now
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 ${
                    currentPage === 1 
                      ? isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                        : 'bg-white border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                      : isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-600 hover:text-blue-600 hover:border-slate-600 hover:scale-110 hover:shadow-lg hover:-translate-y-1'
                        : 'bg-white border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 hover:scale-110 hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  <CaretLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`h-10 w-10 rounded-lg font-bold transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white scale-110 shadow-lg animate-pulse'
                        : isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-600 hover:text-blue-600 hover:border-slate-600 hover:scale-110 hover:shadow-lg hover:-translate-y-1'
                          : 'bg-white border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 hover:scale-110 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 ${
                    currentPage === totalPages 
                      ? isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                        : 'bg-white border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                      : isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-600 hover:text-blue-600 hover:border-slate-600 hover:scale-110 hover:shadow-lg hover:-translate-y-1'
                        : 'bg-white border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 hover:scale-110 hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  <CaretRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Dialog */}
      <ApplicationDialog
        isOpen={isApplicationDialogOpen}
        onClose={() => {
          setIsApplicationDialogOpen(false);
          setSelectedLicense(null);
        }}
        licenseTitle={selectedLicense?.title || ""}
        licenseCategory={selectedLicense?.category || ""}
      />
    </div>
  );
}
