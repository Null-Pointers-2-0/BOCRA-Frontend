"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import { 
  User,
  Envelope,
  Phone,
  Building,
  Briefcase,
  Shield,
  Key,
  Bell,
  Envelope as Mail,
  ChatsTeardrop as Sms,
  AppWindow as AppRegistration,
  ShieldCheck as Security,
  User as Person,
  IdentificationCard as Badge,
  Camera,
  Pencil as Edit,
  Trash as DeleteForever,
  CaretRight as ChevronRight,
  BellRinging as NotificationsActive
} from "@phosphor-icons/react";

export default function Profile() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  const [isClient, setIsClient] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsMessages, setSmsMessages] = useState(true);
  const [inAppNotify, setInAppNotify] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const profileData = {
    name: "Thabo Molapo",
    email: "thabo.molapo@molapo-logistics.co.bw",
    phone: "+267 71 234 567",
    company: "Molapo Logistics Ltd.",
    position: "Business Administrator",
    role: "Portal Administrator (Commercial)",
    jurisdiction: "Cross-border Logistics & Licensing"
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
        title="Profile Settings"
        subtitle="Manage your personal information and account preferences."
        showNewApplicationButton={false}
      />
      
      <div className="pt-24 md:pt-0 p-4 md:p-8 space-y-8 max-w-5xl mx-auto animate-fadeIn">
        {/* Profile Header */}
        <section className={`relative overflow-hidden rounded-lg p-8 shadow-sm animate-slideUp ${
          isDarkMode 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20 blur-3xl ${
            isDarkMode ? 'bg-blue-900/20' : 'bg-blue-600/5'
          }`}></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-600/20">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  TM
                </div>
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                <Camera size={16} />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-1">
              <h1 className={`text-3xl font-bold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {profileData.name}
              </h1>
              <p className="text-blue-600 font-medium">{profileData.position}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                  isDarkMode 
                    ? 'bg-green-900/20 text-green-400' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Verified Profile
                </span>
              </div>
            </div>
            
            <button className="px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2">
              <Edit size={16} />
              Edit Profile
            </button>
          </div>
        </section>

        {/* Main Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <section className={`rounded-lg p-6 space-y-6 animate-fadeInUp ${
              isDarkMode 
                ? 'bg-slate-800 border border-slate-700' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <Person size={20} className="text-blue-600" />
                <h3 className={`text-lg font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Personal Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ml-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    Full Name
                  </label>
                  <input 
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border border-slate-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                    type="text" 
                    value={profileData.name}
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={`text-sm font-medium ml-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    Email Address
                  </label>
                  <input 
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border border-slate-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                    type="email" 
                    value={profileData.email}
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={`text-sm font-medium ml-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    Phone Number
                  </label>
                  <input 
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border border-slate-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                    type="tel" 
                    value={profileData.phone}
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={`text-sm font-medium ml-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    Company
                  </label>
                  <input 
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border border-slate-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                    type="text" 
                    value={profileData.company}
                    readOnly
                  />
                </div>
              </div>
            </section>

            {/* Professional Information */}
            <section className={`rounded-lg p-6 space-y-6 ${
              isDarkMode 
                ? 'bg-slate-800 border border-slate-700' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <Badge size={20} className="text-blue-600" />
                <h3 className={`text-lg font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Professional Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg border-l-4 ${
                  isDarkMode 
                    ? 'bg-slate-700 border-l-blue-600' 
                    : 'bg-white border-l-blue-600'
                }`}>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    Primary Role
                  </p>
                  <p className={`text-sm font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {profileData.role}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg border-l-4 ${
                  isDarkMode 
                    ? 'bg-slate-700 border-l-green-600' 
                    : 'bg-white border-l-green-600'
                }`}>
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">
                    Jurisdiction
                  </p>
                  <p className={`text-sm font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {profileData.jurisdiction}
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className={`text-sm font-bold mb-3 ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Permissions
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isDarkMode 
                      ? 'bg-blue-900/20 text-blue-400' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    Submit Applications
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isDarkMode 
                      ? 'bg-blue-900/20 text-blue-400' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    Review Status
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isDarkMode 
                      ? 'bg-blue-900/20 text-blue-400' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    Sign Legal Docs
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isDarkMode 
                      ? 'bg-blue-900/20 text-blue-400' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    Manage Team
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-8">
            {/* Account Security */}
            <section className={`rounded-lg p-6 space-y-6 ${
              isDarkMode 
                ? 'bg-slate-800 border border-slate-700' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <Security size={20} className="text-pink-600" />
                <h3 className={`text-lg font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Account Security
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-white hover:bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Password
                    </span>
                    <ChevronRight size={16} className={isDarkMode ? 'text-slate-400' : 'text-gray-400'} />
                  </div>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    Last changed 3 months ago
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg flex items-center justify-between ${
                  isDarkMode 
                    ? 'bg-slate-700' 
                    : 'bg-white'
                }`}>
                  <div className="space-y-1">
                    <span className={`text-sm font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      2-Factor Auth
                    </span>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Secure your login
                    </p>
                  </div>
                  <button 
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}></span>
                  </button>
                </div>
              </div>
            </section>

            {/* Notification Preferences */}
            <section className={`rounded-lg p-6 space-y-6 ${
              isDarkMode 
                ? 'bg-slate-800 border border-slate-700' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <NotificationsActive size={20} className="text-green-600" />
                <h3 className={`text-lg font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Notifications
                </h3>
              </div>
              
              <div className="space-y-4">
                <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-white hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className={isDarkMode ? 'text-slate-400' : 'text-gray-400'} />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Email Alerts
                    </span>
                  </div>
                  <input 
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 h-5 w-5" 
                    type="checkbox"
                  />
                </label>
                
                <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-white hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Sms size={16} className={isDarkMode ? 'text-slate-400' : 'text-gray-400'} />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      SMS Messages
                    </span>
                  </div>
                  <input 
                    checked={smsMessages}
                    onChange={(e) => setSmsMessages(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 h-5 w-5" 
                    type="checkbox"
                  />
                </label>
                
                <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-white hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <AppRegistration size={16} className={isDarkMode ? 'text-slate-400' : 'text-gray-400'} />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      In-app Notify
                    </span>
                  </div>
                  <input 
                    checked={inAppNotify}
                    onChange={(e) => setInAppNotify(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 h-5 w-5" 
                    type="checkbox"
                  />
                </label>
              </div>
            </section>
          </div>
        </div>

        {/* Danger Zone / Footer Actions */}
        <footer className={`flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t ${
          isDarkMode ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-red-600 hover:underline flex items-center gap-2">
              <DeleteForever size={16} />
              Deactivate Account
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button className={`px-6 py-2 font-semibold transition-colors rounded-full ${
              isDarkMode 
                ? 'text-slate-400 hover:bg-slate-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}>
              Cancel Changes
            </button>
            <button className="px-8 py-2 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">
              Save Preferences
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
