"use client";

import React from "react";
import { 
  User,
  Envelope,
  Phone,
  Building,
  Briefcase,
  ShieldCheck as Security,
  User as Person,
  IdentificationCard as Badge,
  Camera,
  Pencil as Edit,
  X,
  Envelope as Mail,
  ChatsTeardrop as Sms,
  AppWindow as AppRegistration,
  BellRinging as NotificationsActive,
  CaretRight as ChevronRight
} from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [smsMessages, setSmsMessages] = React.useState(true);
  const [inAppNotify, setInAppNotify] = React.useState(true);

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() || user.username : "";
  const initials = user ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || user.username?.[0]?.toUpperCase() || "U" : "U";

  const profileData = {
    name: fullName,
    email: user?.email ?? "",
    phone: user?.phone_number ?? "",
    company: user?.profile?.organisation ?? "",
    position: user?.profile?.position ?? "",
    role: user?.role_display ?? user?.role ?? "",
    jurisdiction: ""
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* Modal Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'
        }`}>
          <h2 className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-slate-700 text-slate-400' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8 animate-fadeIn">
          {/* Profile Header */}
          <section className={`relative overflow-hidden rounded-lg p-8 shadow-sm animate-slideUp ${
            isDarkMode 
              ? 'bg-slate-700 border border-slate-600' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20 blur-3xl ${
              isDarkMode ? 'bg-blue-900/20' : 'bg-blue-600/5'
            }`}></div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-600/20">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                    {initials}
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
              <section className={`rounded-lg p-6 space-y-6 ${
                isDarkMode 
                  ? 'bg-slate-700 border border-slate-600' 
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
                          ? 'bg-slate-600 border border-slate-500 text-white' 
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
                          ? 'bg-slate-600 border border-slate-500 text-white' 
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
                          ? 'bg-slate-600 border border-slate-500 text-white' 
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
                          ? 'bg-slate-600 border border-slate-500 text-white' 
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
                  ? 'bg-slate-700 border border-slate-600' 
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
                      ? 'bg-slate-600 border-l-blue-600' 
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
                      ? 'bg-slate-600 border-l-green-600' 
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
                  ? 'bg-slate-700 border border-slate-600' 
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
                      ? 'bg-slate-600 hover:bg-slate-500' 
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
                      ? 'bg-slate-600' 
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
                  ? 'bg-slate-700 border border-slate-600' 
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
                      ? 'bg-slate-600 hover:bg-slate-500' 
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
                      ? 'bg-slate-600 hover:bg-slate-500' 
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
                      ? 'bg-slate-600 hover:bg-slate-500' 
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

          {/* Footer Actions */}
          <div className={`flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t ${
            isDarkMode ? 'border-slate-600' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-4">
              <button className="text-sm font-semibold text-red-600 hover:underline flex items-center gap-2">
                Deactivate Account
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <button className={`px-6 py-2 font-semibold transition-colors rounded-full ${
                isDarkMode 
                  ? 'text-slate-400 hover:bg-slate-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
                Cancel Changes
              </button>
              <button className="px-8 py-2 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
