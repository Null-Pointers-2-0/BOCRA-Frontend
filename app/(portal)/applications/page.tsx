"use client";

/**
 * BOCRA Applications Component
 * 
 * This is the applications page for the BOCRA regulatory portal.
 * It provides a responsive layout with desktop sidebar and mobile drawer navigation.
 * 
 * Features:
 * - Responsive design (desktop sidebar, mobile drawer)
 * - Dark/light theme toggle
 * - Application tracking and management
 * - Status indicators and progress tracking
 * - Consistent with other pages
 * 
 * @author BOCRA Development Team
 * @version 1.0.0
 * @lastModified 2026-03-26
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import { 
  FileText,
  ClockCounterClockwise,
  Warning,
  ArrowUp,
  CheckCircle,
  Calendar,
  UserCheck,
  FileArrowUp,
  FilePlus,
  Archive,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react";

export default function Applications() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  // Applications page state
  const [isClient, setIsClient] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedApplications = JSON.parse(localStorage.getItem('bocra_applications') || '[]');
      const mockApplications = [
        {
          id: "APP-2024-001",
          type: "Broadcast License",
          status: "under_review",
          submittedDate: "2024-01-15",
          progress: 75,
          description: "Commercial broadcasting license for radio station"
        },
        {
          id: "APP-2024-002", 
          type: "Telecom License",
          status: "approved",
          submittedDate: "2024-01-10",
          progress: 100,
          description: "Mobile network operator license"
        },
        {
          id: "APP-2024-003",
          type: "Postal License",
          status: "pending",
          submittedDate: "2024-01-20",
          progress: 25,
          description: "Courier service license application"
        },
        {
          id: "APP-2024-004",
          type: "Internet License",
          status: "rejected",
          submittedDate: "2024-01-05",
          progress: 0,
          description: "ISP license application"
        }
      ];
      
      const allApplications = [...savedApplications, ...mockApplications];
      setApplications(allApplications);
    }
  }, [isClient]);

  const filteredApplications = applications.filter(app => {
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
    const matchesSearch = app.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "approved": return <CheckCircle size={16} className="text-green-600" />;
      case "pending": return <ClockCounterClockwise size={16} className="text-amber-600" />;
      case "under_review": return <MagnifyingGlass size={16} className="text-blue-600" />;
      case "rejected": return <Warning size={16} className="text-red-600" />;
      default: return <ClockCounterClockwise size={16} className="text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "approved": return isDarkMode ? "text-green-400" : "text-green-700";
      case "pending": return isDarkMode ? "text-amber-400" : "text-amber-700";
      case "under_review": return isDarkMode ? "text-blue-400" : "text-blue-700";
      case "rejected": return isDarkMode ? "text-red-400" : "text-red-700";
      default: return isDarkMode ? "text-slate-400" : "text-slate-700";
    }
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
        title="My Applications"
        subtitle="Track and manage all your regulatory applications in one place."
        showNewApplicationButton={false}
      />
      <div className="pt-24 md:pt-0 p-4 md:p-8 space-y-6 md:space-y-8 animate-fadeIn">
            {/* Page Header */}
            <div className={`rounded-xl bg-gradient-to-r from-blue-600/10 to-transparent p-8 border border-blue-600/5 animate-slideUp ${
              isDarkMode ? 'bg-blue-600/5' : ''
            }`}>
              <h2 className={`text-3xl font-black animate-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
                isDarkMode ? 'text-slate-900' : 'text-gray-900'
              } sm:text-4xl`}>My Applications</h2>
              <p className={`mt-2 max-w-2xl text-lg ${
                isDarkMode ? 'text-slate-600' : 'text-gray-600'
              }`}>
                Track and manage all your regulatory applications in one place.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlass size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 animate-fadeInUp ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`font-semibold text-lg ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {application.type}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        {application.id}
                      </p>
                    </div>
                    {getStatusIcon(application.status)}
                  </div>

                  <p className={`text-sm mb-4 ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    {application.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>
                        Status
                      </span>
                      <span className={`font-medium capitalize ${getStatusColor(application.status)}`}>
                        {application.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>
                        Submitted
                      </span>
                      <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                        {application.submittedDate}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>
                          Progress
                        </span>
                        <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                          {application.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${application.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredApplications.length === 0 && (
              <div className={`text-center py-12 rounded-xl border-2 border-dashed ${
                isDarkMode
                  ? 'border-slate-700 text-slate-400'
                  : 'border-gray-300 text-gray-500'
              }`}>
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No applications found</p>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className={`rounded-xl border p-6 ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isDarkMode
                    ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}>
                  <FilePlus size={20} />
                  <span className="font-medium">New Application</span>
                </button>
                <button className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isDarkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  <FileArrowUp size={20} />
                  <span className="font-medium">Upload Documents</span>
                </button>
                <button className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isDarkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  <UserCheck size={20} />
                  <span className="font-medium">Check Status</span>
                </button>
              </div>
          </div>
      </div>
    </div>
  );
}
