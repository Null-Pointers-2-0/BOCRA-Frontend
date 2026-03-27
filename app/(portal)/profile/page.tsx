"use client";

import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile, changePassword } from "@/lib/api/clients/auth";
import PortalHeader from "@/components/PortalHeader";
import { 
  ShieldCheck as Security,
  User as Person,
  IdentificationCard as Badge,
  Camera,
  Pencil as Edit,
  Trash as DeleteForever,
  CaretRight as ChevronRight,
  BellRinging as NotificationsActive,
  Envelope as Mail,
  ChatsTeardrop as Sms,
  AppWindow as AppRegistration,
} from "@phosphor-icons/react";

export default function Profile() {
  const { isDarkMode } = useTheme();
  const { user, refreshUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Editable form fields
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [organisation, setOrganisation] = useState(user?.profile?.organisation || "");
  const [position, setPosition] = useState(user?.profile?.position || "");
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [address, setAddress] = useState(user?.profile?.address || "");
  const [city, setCity] = useState(user?.profile?.city || "");

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification prefs (client-side only for now)
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsMessages, setSmsMessages] = useState(true);
  const [inAppNotify, setInAppNotify] = useState(true);

  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`
    : "??";

  function startEditing() {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setPhone(user?.phone_number || "");
    setOrganisation(user?.profile?.organisation || "");
    setPosition(user?.profile?.position || "");
    setBio(user?.profile?.bio || "");
    setAddress(user?.profile?.address || "");
    setCity(user?.profile?.city || "");
    setIsEditing(true);
    setSaveMessage(null);
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        profile: {
          organisation,
          position,
          bio,
          address,
          city,
        },
      });
      if (res.success) {
        setSaveMessage({ type: "success", text: "Profile updated successfully." });
        setIsEditing(false);
        await refreshUser();
      } else {
        setSaveMessage({ type: "error", text: res.message || "Failed to update profile." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Network error — please try again." });
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setChangingPassword(true);
    setPasswordMessage(null);
    try {
      const res = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      if (res.success) {
        setPasswordMessage({ type: "success", text: "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
      } else {
        setPasswordMessage({ type: "error", text: res.message || "Failed to change password." });
      }
    } catch {
      setPasswordMessage({ type: "error", text: "Network error — please try again." });
    } finally {
      setChangingPassword(false);
    }
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
                {user?.full_name || "Loading…"}
              </h1>
              <p className="text-blue-600 font-medium">{user?.profile?.position || user?.role_display || "User"}</p>
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
            
            <button 
              onClick={isEditing ? handleSave : startEditing}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Edit size={16} />
              {saving ? "Saving…" : isEditing ? "Save Profile" : "Edit Profile"}
            </button>
          </div>
        </section>

        {/* Save/Error Message */}
        {saveMessage && (
          <div className={`p-4 rounded-lg text-sm font-medium ${
            saveMessage.type === "success"
              ? "bg-green-50 border border-green-300 text-green-700"
              : "bg-red-50 border border-red-300 text-red-700"
          }`}>
            {saveMessage.text}
          </div>
        )}

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
                    First Name
                  </label>
                  <input 
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border border-slate-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    } ${!isEditing ? 'opacity-75' : ''}`}
                    type="text" 
                    value={isEditing ? firstName : (user?.first_name || "")}
                    onChange={(e) => setFirstName(e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={`text-sm font-medium ml-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    Last Name
                  </label>
                  <input 
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border border-slate-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    } ${!isEditing ? 'opacity-75' : ''}`}
                    type="text" 
                    value={isEditing ? lastName : (user?.last_name || "")}
                    onChange={(e) => setLastName(e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={`text-sm font-medium ml-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    Email Address
                  </label>
                  <input 
                    className={`w-full px-4 py-3 rounded-lg opacity-75 ${
                      isDarkMode 
                        ? 'bg-slate-700 border border-slate-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                    type="email" 
                    value={user?.email || ""}
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
                    } ${!isEditing ? 'opacity-75' : ''}`}
                    type="tel" 
                    value={isEditing ? phone : (user?.phone_number || "")}
                    onChange={(e) => setPhone(e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ml-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    Organisation
                  </label>
                  <input 
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border border-slate-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    } ${!isEditing ? 'opacity-75' : ''}`}
                    type="text" 
                    value={isEditing ? organisation : (user?.profile?.organisation || "")}
                    onChange={(e) => setOrganisation(e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ml-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    Position
                  </label>
                  <input 
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border border-slate-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    } ${!isEditing ? 'opacity-75' : ''}`}
                    type="text" 
                    value={isEditing ? position : (user?.profile?.position || "")}
                    onChange={(e) => setPosition(e.target.value)}
                    readOnly={!isEditing}
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
                    {user?.role_display || user?.role || "User"}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg border-l-4 ${
                  isDarkMode 
                    ? 'bg-slate-700 border-l-green-600' 
                    : 'bg-white border-l-green-600'
                }`}>
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">
                    Member Since
                  </p>
                  <p className={`text-sm font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user?.date_joined ? new Date(user.date_joined).toLocaleDateString("en-BW", { year: "numeric", month: "long", day: "numeric" }) : "—"}
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
                {passwordMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    passwordMessage.type === "success"
                      ? "bg-green-50 border border-green-300 text-green-700"
                      : "bg-red-50 border border-red-300 text-red-700"
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}

                <div 
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-white hover:bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Change Password
                    </span>
                    <ChevronRight size={16} className={`transition-transform ${showPasswordForm ? 'rotate-90' : ''} ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    Update your account password
                  </p>
                </div>

                {showPasswordForm && (
                  <form onSubmit={handlePasswordChange} className={`p-4 rounded-lg space-y-3 ${
                    isDarkMode ? 'bg-slate-700' : 'bg-white'
                  }`}>
                    <input
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded-lg text-sm ${
                        isDarkMode 
                          ? 'bg-slate-600 border border-slate-500 text-white placeholder-slate-400' 
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className={`w-full px-3 py-2 rounded-lg text-sm ${
                        isDarkMode 
                          ? 'bg-slate-600 border border-slate-500 text-white placeholder-slate-400' 
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className={`w-full px-3 py-2 rounded-lg text-sm ${
                        isDarkMode 
                          ? 'bg-slate-600 border border-slate-500 text-white placeholder-slate-400' 
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {changingPassword ? "Changing…" : "Change Password"}
                    </button>
                  </form>
                )}
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
            <button 
              onClick={() => { setIsEditing(false); setSaveMessage(null); }}
              className={`px-6 py-2 font-semibold transition-colors rounded-full ${
              isDarkMode 
                ? 'text-slate-400 hover:bg-slate-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}>
              Cancel Changes
            </button>
            <button 
              onClick={isEditing ? handleSave : startEditing}
              disabled={saving}
              className="px-8 py-2 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? "Saving…" : isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
