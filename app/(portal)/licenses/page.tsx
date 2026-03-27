"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import {
  Certificate,
  MagnifyingGlass,
  CaretRight,
  Clock,
  CheckCircle,
  Warning,
  CircleNotch,
  ShieldCheck,
  CalendarBlank,
} from "@phosphor-icons/react";
import { getMyLicences } from "@/lib/api/clients/licensing";
import type { LicenceListItem } from "@/lib/api/types/licensing";

export default function LicencesPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [licences, setLicences] = useState<LicenceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadLicences();
  }, []);

  async function loadLicences() {
    setLoading(true);
    try {
      const res = await getMyLicences();
      if (res.success) {
        const items = (res.data as any)?.results ?? (Array.isArray(res.data) ? res.data : []);
        setLicences(items);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  const filtered = licences.filter((lic) => {
    if (statusFilter && lic.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        lic.licence_number.toLowerCase().includes(q) ||
        lic.licence_type_name.toLowerCase().includes(q) ||
        lic.organisation_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-700 border-green-200";
      case "SUSPENDED": return "bg-amber-100 text-amber-700 border-amber-200";
      case "EXPIRED": return "bg-red-100 text-red-700 border-red-200";
      case "REVOKED": return "bg-slate-100 text-slate-600 border-slate-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE": return <CheckCircle size={16} weight="fill" className="text-green-500" />;
      case "SUSPENDED": return <Warning size={16} weight="fill" className="text-amber-500" />;
      case "EXPIRED": return <Clock size={16} weight="fill" className="text-red-500" />;
      default: return <ShieldCheck size={16} className="text-slate-400" />;
    }
  };

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-BW", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getExpiryInfo(lic: LicenceListItem) {
    if (lic.is_expired) return { text: "Expired", color: "text-red-500" };
    if (lic.days_until_expiry !== null && lic.days_until_expiry <= 30) {
      return { text: `Expires in ${lic.days_until_expiry} days`, color: "text-amber-500" };
    }
    if (lic.days_until_expiry !== null && lic.days_until_expiry <= 90) {
      return { text: `Expires in ${lic.days_until_expiry} days`, color: "text-orange-400" };
    }
    return null;
  }

  const activeCount = licences.filter((l) => l.status === "ACTIVE").length;
  const expiringCount = licences.filter(
    (l) => l.days_until_expiry !== null && l.days_until_expiry <= 90 && !l.is_expired
  ).length;
  const expiredCount = licences.filter((l) => l.is_expired).length;

  return (
    <div className="min-h-screen">
      <PortalHeader title="My Licences" subtitle="View and manage your active licences" />

      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Total"
            value={licences.length}
            icon={<Certificate size={20} />}
            color="teal"
            isDarkMode={isDarkMode}
          />
          <StatCard
            label="Active"
            value={activeCount}
            icon={<CheckCircle size={20} weight="fill" />}
            color="green"
            isDarkMode={isDarkMode}
          />
          <StatCard
            label="Expiring Soon"
            value={expiringCount}
            icon={<Warning size={20} weight="fill" />}
            color="amber"
            isDarkMode={isDarkMode}
          />
          <StatCard
            label="Expired"
            value={expiredCount}
            icon={<Clock size={20} weight="fill" />}
            color="red"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            />
            <input
              type="text"
              placeholder="Search by licence number, type, or organisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-colors ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2.5 rounded-lg border text-sm appearance-none transition-colors ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="EXPIRED">Expired</option>
            <option value="REVOKED">Revoked</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <CircleNotch size={32} className="animate-spin text-teal-600" />
            <span className={`ml-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Loading licences...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-20 rounded-xl border ${
            isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <Certificate size={48} className={isDarkMode ? "text-slate-600 mx-auto mb-4" : "text-slate-300 mx-auto mb-4"} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              No licences found
            </h3>
            <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
              {searchTerm || statusFilter
                ? "Try adjusting your search or filters."
                : "You don't have any licences yet."}
            </p>
            {!searchTerm && !statusFilter && (
              <button
                onClick={() => router.push("/apply")}
                className="mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Apply for a Licence
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((lic) => {
              const expiryInfo = getExpiryInfo(lic);
              return (
                <button
                  key={lic.id}
                  onClick={() => router.push(`/licenses/${lic.id}`)}
                  className={`w-full text-left rounded-xl border p-4 md:p-5 transition-all hover:shadow-md group ${
                    isDarkMode
                      ? "bg-slate-800/60 border-slate-700 hover:bg-slate-800"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(lic.status)}
                        <span className={`text-sm font-mono ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {lic.licence_number}
                        </span>
                      </div>
                      <h3 className={`font-semibold truncate mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        {lic.licence_type_name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {lic.organisation_name}
                        </span>
                        <span className={`text-xs flex items-center gap-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                          <CalendarBlank size={12} />
                          Issued: {formatDate(lic.issued_date)}
                        </span>
                        <span className={`text-xs flex items-center gap-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                          <Clock size={12} />
                          Expires: {formatDate(lic.expiry_date)}
                        </span>
                      </div>
                      {expiryInfo && (
                        <span className={`inline-flex items-center gap-1 mt-2 text-xs font-medium ${expiryInfo.color}`}>
                          <Warning size={12} weight="fill" />
                          {expiryInfo.text}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(lic.status)}`}>
                        {lic.status_display}
                      </span>
                      <CaretRight
                        size={18}
                        className={`transition-transform group-hover:translate-x-0.5 ${
                          isDarkMode ? "text-slate-600" : "text-slate-300"
                        }`}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  isDarkMode,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  isDarkMode: boolean;
}) {
  const colorClasses: Record<string, string> = {
    teal: isDarkMode ? "text-teal-400" : "text-teal-600",
    green: isDarkMode ? "text-green-400" : "text-green-600",
    amber: isDarkMode ? "text-amber-400" : "text-amber-600",
    red: isDarkMode ? "text-red-400" : "text-red-600",
  };

  return (
    <div className={`rounded-xl border p-4 ${
      isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
    }`}>
      <div className={`mb-2 ${colorClasses[color] || ""}`}>{icon}</div>
      <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{value}</p>
      <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
    </div>
  );
}
