"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTokens, clearTokens } from "@/lib/api/client";
import { adminAuth } from "@/lib/api/admin";
import { adminAnalytics } from "@/lib/api/admin";
import { adminNotifications } from "@/lib/api/admin";
import type { User } from "@/lib/api/types/auth";
import type { StaffDashboard } from "@/lib/api/types/analytics";
import type { UnreadCount } from "@/lib/api/types/notifications";

export default function TestDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<StaffDashboard | null>(null);
  const [unread, setUnread] = useState<UnreadCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const { accessToken } = getTokens();
    if (!accessToken) {
      router.push("/login");
      return;
    }
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const errs: string[] = [];

    // Profile
    try {
      const res = await adminAuth.getProfile();
      if (res.success) setUser(res.data);
      else errs.push(`Profile: ${res.message}`);
    } catch (e) {
      errs.push(`Profile: ${e instanceof Error ? e.message : "Network error"}`);
    }

    // Staff Dashboard
    try {
      const res = await adminAnalytics.getStaffDashboard();
      if (res.success) setDashboard(res.data);
      else errs.push(`Dashboard: ${res.message}`);
    } catch (e) {
      errs.push(`Dashboard: ${e instanceof Error ? e.message : "Network error"}`);
    }

    // Notifications
    try {
      const res = await adminNotifications.getUnreadCount();
      if (res.success) setUnread(res.data);
      else errs.push(`Notifications: ${res.message}`);
    } catch (e) {
      errs.push(`Notifications: ${e instanceof Error ? e.message : "Network error"}`);
    }

    setErrors(errs);
    setLoading(false);
  }

  function handleLogout() {
    clearTokens();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Test Dashboard</h1>
            <p className="text-sm text-gray-500">
              Backend: {process.env.NEXT_PUBLIC_API_URL}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded space-y-1">
            <p className="font-medium text-red-700">API Errors:</p>
            {errors.map((err, i) => (
              <p key={i} className="text-sm text-red-600">• {err}</p>
            ))}
          </div>
        )}

        {/* Connection Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-3">Connection Status</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <StatusCard
              label="Auth (Profile)"
              ok={!!user}
              detail={user ? `${user.full_name} (${user.role})` : "Failed"}
            />
            <StatusCard
              label="Staff Dashboard"
              ok={!!dashboard}
              detail={dashboard ? "Data received" : "Failed"}
            />
            <StatusCard
              label="Notifications"
              ok={!!unread}
              detail={unread ? `${unread.unread_count} unread` : "Failed"}
            />
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-3">Logged-in User</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Field label="Name" value={user.full_name} />
              <Field label="Email" value={user.email} />
              <Field label="Username" value={user.username} />
              <Field label="Role" value={`${user.role} (${user.role_display})`} />
              <Field label="Email Verified" value={user.email_verified ? "Yes" : "No"} />
              <Field label="Active" value={user.is_active ? "Yes" : "No"} />
              <Field label="Joined" value={user.date_joined} />
              <Field label="Last Login" value={user.last_login || "—"} />
            </div>
          </div>
        )}

        {/* Dashboard Data */}
        {dashboard && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-3">Staff Dashboard Data</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Total Users" value={dashboard.users?.total} />
              <Stat label="New (7d)" value={dashboard.users?.new_last_7_days} />
              <Stat label="Active Licences" value={dashboard.licensing?.active_licences} />
              <Stat label="Pending Apps" value={dashboard.licensing?.pending_applications} />
              <Stat label="Total Complaints" value={dashboard.complaints?.total} />
              <Stat label="Open Complaints" value={dashboard.complaints?.open} />
              <Stat label="Overdue" value={dashboard.complaints?.overdue} />
              <Stat label="Publications" value={dashboard.content?.publications?.total} />
              <Stat label="Tenders" value={dashboard.content?.tenders?.total} />
              <Stat label="News Articles" value={dashboard.content?.news?.total} />
            </div>
          </div>
        )}

        {/* Raw JSON dump */}
        {dashboard && (
          <details className="bg-gray-900 text-green-400 p-4 rounded text-xs">
            <summary className="cursor-pointer text-gray-400 font-medium">
              Raw Dashboard JSON
            </summary>
            <pre className="mt-2 overflow-auto max-h-96">
              {JSON.stringify(dashboard, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

function StatusCard({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <div className={`p-3 rounded border ${ok ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`} />
        <span className="font-medium">{label}</span>
      </div>
      <p className={`mt-1 text-xs ${ok ? "text-green-700" : "text-red-700"}`}>{detail}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>{" "}
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="text-center p-3 bg-gray-50 rounded">
      <p className="text-2xl font-bold">{value ?? "—"}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
