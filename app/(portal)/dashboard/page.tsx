"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import PortalHeader from "@/components/PortalHeader";
import {
  ChatsCircle,
  Warning,
  FilePlus,
  Megaphone,
  ClipboardText,
  Headset,
  Globe,
  IdentificationCard,
  FileText,
  MagnifyingGlass,
  ArrowRight,
  Spinner,
} from "@phosphor-icons/react";

import { getMyApplications, getMyLicences } from "@/lib/api/clients/licensing";
import { getMyComplaints } from "@/lib/api/clients/complaints";
import { getMyDomains } from "@/lib/api/clients/domains";
import { getUnreadCount } from "@/lib/api/clients/notifications";

import type { ApplicationListItem, LicenceListItem } from "@/lib/api/types/licensing";
import type { ComplaintListItem } from "@/lib/api/types/complaints";
import type { DomainListItem } from "@/lib/api/types/domains";

type DashboardStats = {
  applications: { total: number; pending: number; approved: number; rejected: number };
  licences: { total: number; active: number; expiring: number };
  complaints: { total: number; open: number; resolved: number };
  domains: { total: number; active: number; expiring: number };
  unreadNotifications: number;
};

type RecentItem = {
  type: "application" | "licence" | "complaint" | "domain";
  title: string;
  id: string;
  status: string;
  statusColor: string;
  date: string;
  href: string;
};

export default function Dashboard() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    applications: { total: 0, pending: 0, approved: 0, rejected: 0 },
    licences: { total: 0, active: 0, expiring: 0 },
    complaints: { total: 0, open: 0, resolved: 0 },
    domains: { total: 0, active: 0, expiring: 0 },
    unreadNotifications: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentItem[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [appsRes, licencesRes, complaintsRes, domainsRes, unreadRes] =
        await Promise.allSettled([
          getMyApplications(),
          getMyLicences(),
          getMyComplaints(),
          getMyDomains(),
          getUnreadCount(),
        ]);

      // Applications
      const applications = { total: 0, pending: 0, approved: 0, rejected: 0 };
      let appItems: ApplicationListItem[] = [];
      if (appsRes.status === "fulfilled" && appsRes.value.success) {
        const data = appsRes.value.data;
        const items = Array.isArray(data) ? data : data.results ?? [];
        appItems = items as ApplicationListItem[];
        applications.total = appItems.length;
        applications.pending = appItems.filter(
          (a) => a.status === "SUBMITTED" || a.status === "UNDER_REVIEW" || a.status === "INFO_REQUESTED"
        ).length;
        applications.approved = appItems.filter((a) => a.status === "APPROVED").length;
        applications.rejected = appItems.filter((a) => a.status === "REJECTED").length;
      }

      // Licences
      const licences = { total: 0, active: 0, expiring: 0 };
      let licenceItems: LicenceListItem[] = [];
      if (licencesRes.status === "fulfilled" && licencesRes.value.success) {
        const data = licencesRes.value.data;
        const items = Array.isArray(data) ? data : data.results ?? [];
        licenceItems = items as LicenceListItem[];
        licences.total = licenceItems.length;
        licences.active = licenceItems.filter((l) => l.status === "ACTIVE").length;
        licences.expiring = licenceItems.filter(
          (l) => l.days_until_expiry !== null && l.days_until_expiry <= 90 && l.days_until_expiry > 0
        ).length;
      }

      // Complaints
      const complaints = { total: 0, open: 0, resolved: 0 };
      let complaintItems: ComplaintListItem[] = [];
      if (complaintsRes.status === "fulfilled" && complaintsRes.value.success) {
        const data = complaintsRes.value.data;
        complaintItems = Array.isArray(data) ? data : [];
        complaints.total = complaintItems.length;
        complaints.open = complaintItems.filter(
          (c) =>
            c.status === "SUBMITTED" ||
            c.status === "ASSIGNED" ||
            c.status === "INVESTIGATING" ||
            c.status === "AWAITING_RESPONSE" ||
            c.status === "REOPENED"
        ).length;
        complaints.resolved = complaintItems.filter(
          (c) => c.status === "RESOLVED" || c.status === "CLOSED"
        ).length;
      }

      // Domains
      const domains = { total: 0, active: 0, expiring: 0 };
      let domainItems: DomainListItem[] = [];
      if (domainsRes.status === "fulfilled" && domainsRes.value.success) {
        const data = domainsRes.value.data;
        const items = Array.isArray(data) ? data : (data as { results?: DomainListItem[] }).results ?? [];
        domainItems = items as DomainListItem[];
        domains.total = domainItems.length;
        domains.active = domainItems.filter((d) => d.status === "ACTIVE").length;
        domains.expiring = domainItems.filter(
          (d) => d.days_until_expiry !== null && d.days_until_expiry <= 90 && d.days_until_expiry > 0
        ).length;
      }

      // Unread notifications
      let unreadNotifications = 0;
      if (unreadRes.status === "fulfilled" && unreadRes.value.success) {
        unreadNotifications = unreadRes.value.data.unread_count ?? 0;
      }

      setStats({ applications, licences, complaints, domains, unreadNotifications });

      // Build recent activity from the most recent items across all categories
      const recent: RecentItem[] = [];

      appItems.slice(0, 3).forEach((a) => {
        recent.push({
          type: "application",
          title: `Application: ${a.licence_type_name}`,
          id: a.reference_number,
          status: a.status_display,
          statusColor: getAppStatusColor(a.status),
          date: a.submitted_at
            ? new Date(a.submitted_at).toLocaleDateString()
            : new Date(a.created_at).toLocaleDateString(),
          href: `/applications/${a.id}?type=licensing`,
        });
      });

      complaintItems.slice(0, 3).forEach((c) => {
        recent.push({
          type: "complaint",
          title: `Complaint: ${c.subject}`,
          id: c.reference_number,
          status: c.status_display,
          statusColor: getComplaintStatusColor(c.status),
          date: new Date(c.created_at).toLocaleDateString(),
          href: `/complaints/${c.id}`,
        });
      });

      domainItems.slice(0, 2).forEach((d) => {
        recent.push({
          type: "domain",
          title: `Domain: ${d.domain_name}`,
          id: d.domain_name,
          status: d.status_display,
          statusColor: d.status === "ACTIVE" ? "green" : "amber",
          date: new Date(d.registered_at).toLocaleDateString(),
          href: `/domains/${d.id}`,
        });
      });

      // Sort by date descending
      recent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivity(recent.slice(0, 6));
    } catch {
      // Silently handle — dashboard still shows zeroes
    } finally {
      setLoading(false);
    }
  }

  function getAppStatusColor(status: string): string {
    switch (status) {
      case "SUBMITTED":
      case "UNDER_REVIEW":
        return "blue";
      case "APPROVED":
        return "green";
      case "REJECTED":
      case "CANCELLED":
        return "red";
      case "INFO_REQUESTED":
        return "amber";
      default:
        return "slate";
    }
  }

  function getComplaintStatusColor(status: string): string {
    switch (status) {
      case "SUBMITTED":
      case "ASSIGNED":
      case "INVESTIGATING":
        return "blue";
      case "RESOLVED":
      case "CLOSED":
        return "green";
      case "AWAITING_RESPONSE":
      case "REOPENED":
        return "amber";
      default:
        return "slate";
    }
  }

  const getStatusClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      green: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
      slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    };
    return colors[color] || colors.slate;
  };

  const quickActions = [
    {
      title: "Apply for Licence",
      description: "Submit a new licence application",
      icon: FilePlus,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      href: "/apply-for-license",
    },
    {
      title: "File Complaint",
      description: "Submit a complaint",
      icon: Megaphone,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      href: "/complaints",
    },
    {
      title: "Check Domain",
      description: "Search domain availability",
      icon: Globe,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
      href: "/domain-registry",
    },
    {
      title: "Track Complaint",
      description: "Track by reference number",
      icon: MagnifyingGlass,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      href: "/track-complaint",
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 pb-24 md:pb-0">
        <PortalHeader />
        <div className="pt-24 md:pt-0 p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
            <Spinner size={32} className="animate-spin" />
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-24 md:pb-0">
      <PortalHeader />

      <div
        className={`pt-24 md:pt-0 p-4 md:p-8 space-y-8 ${
          isDarkMode ? "bg-slate-50" : "bg-gray-50"
        }`}
      >
        {/* Welcome Message */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.first_name || "User"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here&apos;s an overview of your regulatory activities
          </p>
        </div>

        {/* ==================== STATISTICS CARDS ==================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Applications Card */}
          <button
            onClick={() => router.push("/applications")}
            className={`p-6 rounded-xl shadow-sm text-left transition-all hover:shadow-md ${
              isDarkMode ? "bg-white border-slate-200" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-sm text-gray-500">Applications</span>
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <FileText size={20} />
              </div>
            </div>
            <p className="text-3xl font-black">{stats.applications.total}</p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              {stats.applications.pending > 0 && (
                <span className="text-amber-600 font-semibold">
                  {stats.applications.pending} pending
                </span>
              )}
              {stats.applications.approved > 0 && (
                <span className="text-green-600 font-semibold">
                  {stats.applications.approved} approved
                </span>
              )}
            </div>
          </button>

          {/* Licences Card */}
          <button
            onClick={() => router.push("/licenses")}
            className={`p-6 rounded-xl shadow-sm text-left transition-all hover:shadow-md ${
              isDarkMode ? "bg-white border-slate-200" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-sm text-gray-500">Licences</span>
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <IdentificationCard size={20} />
              </div>
            </div>
            <p className="text-3xl font-black">{stats.licences.active}</p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="text-slate-500">{stats.licences.total} total</span>
              {stats.licences.expiring > 0 && (
                <span className="text-amber-600 font-semibold flex items-center">
                  <Warning size={14} className="mr-1" />
                  {stats.licences.expiring} expiring
                </span>
              )}
            </div>
          </button>

          {/* Complaints Card */}
          <button
            onClick={() => router.push("/complaints")}
            className={`p-6 rounded-xl shadow-sm text-left transition-all hover:shadow-md ${
              isDarkMode ? "bg-white border-slate-200" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-sm text-gray-500">Complaints</span>
              <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                <ChatsCircle size={20} />
              </div>
            </div>
            <p className="text-3xl font-black">{stats.complaints.open}</p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="text-slate-500">{stats.complaints.total} total</span>
              {stats.complaints.resolved > 0 && (
                <span className="text-green-600 font-semibold">
                  {stats.complaints.resolved} resolved
                </span>
              )}
            </div>
          </button>

          {/* Domains Card */}
          <button
            onClick={() => router.push("/domains")}
            className={`p-6 rounded-xl shadow-sm text-left transition-all hover:shadow-md ${
              isDarkMode ? "bg-white border-slate-200" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-sm text-gray-500">Domains</span>
              <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                <Globe size={20} />
              </div>
            </div>
            <p className="text-3xl font-black">{stats.domains.active}</p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="text-slate-500">{stats.domains.total} total</span>
              {stats.domains.expiring > 0 && (
                <span className="text-amber-600 font-semibold flex items-center">
                  <Warning size={14} className="mr-1" />
                  {stats.domains.expiring} expiring
                </span>
              )}
            </div>
          </button>
        </section>

        {/* ==================== MOBILE QUICK ACTIONS ==================== */}
        <section className="md:hidden space-y-4">
          <h3 className="text-xl font-bold tracking-tight px-1">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() => router.push(action.href)}
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm active:scale-95 transition-all space-y-2 border border-transparent hover:border-blue-600/20"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${action.bgColor} flex items-center justify-center`}
                  >
                    <Icon size={24} weight="fill" className={action.iconColor} />
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight text-slate-700">
                    {action.title}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ==================== ACTIVITY & QUICK ACTIONS ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Recent Activity */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xl font-bold tracking-tight">Recent Activity</h3>
              <button
                onClick={() => router.push("/applications")}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>
            <div
              className={`rounded-xl overflow-hidden shadow-sm ${
                isDarkMode ? "bg-white border-slate-200" : "bg-white border-gray-200"
              }`}
            >
              {recentActivity.length === 0 ? (
                <div className="p-8 text-center">
                  <ClipboardText
                    size={48}
                    className={`mx-auto mb-4 ${
                      isDarkMode ? "text-slate-400" : "text-gray-400"
                    }`}
                  />
                  <p className={isDarkMode ? "text-slate-500" : "text-gray-500"}>
                    No recent activity
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      isDarkMode ? "text-slate-400" : "text-gray-400"
                    }`}
                  >
                    Your activities will appear here once you start using the portal
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <table className="hidden md:table w-full text-left border-collapse">
                    <thead>
                      <tr
                        className={`border-b ${
                          isDarkMode
                            ? "bg-slate-50 border-slate-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Activity
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Reference
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentActivity.map((item, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => router.push(item.href)}
                        >
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium">{item.title}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.id}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${getStatusClasses(
                                item.statusColor
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Mobile list */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {recentActivity.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => router.push(item.href)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.id} · {item.date}
                          </p>
                        </div>
                        <span
                          className={`ml-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded whitespace-nowrap ${getStatusClasses(
                            item.statusColor
                          )}`}
                        >
                          {item.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Desktop Quick Actions */}
          <section className="hidden md:block space-y-4">
            <h3 className="text-lg font-bold tracking-tight">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    onClick={() => router.push(action.href)}
                    className={`flex items-center gap-4 p-4 rounded-xl hover:shadow-md transition-all group text-left ${
                      isDarkMode ? "bg-white border-slate-200" : "bg-white border-gray-200"
                    }`}
                  >
                    <div
                      className={`${action.bgColor} ${action.iconColor} p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{action.title}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </button>
                );
              })}

              {/* Notification alert */}
              {stats.unreadNotifications > 0 && (
                <button
                  onClick={() => router.push("/notifications")}
                  className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-left"
                >
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <Warning size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-blue-900">
                      {stats.unreadNotifications} Unread Notification{stats.unreadNotifications !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-blue-700">Tap to view</p>
                  </div>
                </button>
              )}

              {/* Help Card */}
              <div className="mt-4 p-6 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 rounded-xl text-white relative overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="relative z-10">
                  <h4 className="font-bold mb-2 text-lg">Need help?</h4>
                  <p className="text-sm opacity-90 mb-4">
                    Our support team is available Mon-Fri, 8am - 5pm to assist with your
                    applications.
                  </p>
                  <button
                    onClick={() => router.push("/contact")}
                    className="bg-white text-blue-800 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-slate-100 transform hover:scale-105 transition-all duration-200"
                  >
                    Contact Support
                  </button>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                  <Headset size={120} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
