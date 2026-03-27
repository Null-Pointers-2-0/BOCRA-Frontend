"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import {
  FileText,
  MagnifyingGlass,
  Funnel,
  CaretRight,
  Clock,
  CheckCircle,
  XCircle,
  CircleNotch,
  Warning,
  Globe,
  Certificate,
  Briefcase,
} from "@phosphor-icons/react";
import { getMyApplications } from "@/lib/api/clients/licensing";
import { getMyTenderApplications } from "@/lib/api/clients/tenders";
import { getMyDomainApplications } from "@/lib/api/clients/domains";
import type { ApplicationListItem } from "@/lib/api/types/licensing";
import type { TenderApplicationListItem } from "@/lib/api/types/tenders";
import type { DomainApplicationListItem } from "@/lib/api/types/domains";

type UnifiedApplication = {
  id: string;
  type: "licensing" | "tender" | "domain";
  typeLabel: string;
  reference: string;
  name: string;
  organisation: string;
  status: string;
  statusDisplay: string;
  submittedAt: string | null;
  createdAt: string;
};

function normalizeApplications(
  licensing: ApplicationListItem[],
  tenders: TenderApplicationListItem[],
  domains: DomainApplicationListItem[]
): UnifiedApplication[] {
  const unified: UnifiedApplication[] = [];

  for (const app of licensing) {
    unified.push({
      id: app.id,
      type: "licensing",
      typeLabel: "Licence",
      reference: app.reference_number,
      name: app.licence_type_name,
      organisation: app.organisation_name,
      status: app.status,
      statusDisplay: app.status_display,
      submittedAt: app.submitted_at,
      createdAt: app.created_at,
    });
  }

  for (const app of tenders) {
    unified.push({
      id: app.id,
      type: "tender",
      typeLabel: "Tender",
      reference: app.reference_number,
      name: app.tender_title,
      organisation: app.company_name,
      status: app.status,
      statusDisplay: app.status_display,
      submittedAt: app.created_at,
      createdAt: app.created_at,
    });
  }

  for (const app of domains) {
    unified.push({
      id: app.id,
      type: "domain",
      typeLabel: "Domain",
      reference: app.reference_number,
      name: app.domain_name,
      organisation: app.organisation_name,
      status: app.status,
      statusDisplay: app.status_display,
      submittedAt: app.submitted_at,
      createdAt: app.created_at,
    });
  }

  // Sort by created date, newest first
  unified.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return unified;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [applications, setApplications] = useState<UnifiedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "licensing" | "tender" | "domain">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    try {
      const [licRes, tendRes, domRes] = await Promise.allSettled([
        getMyApplications(),
        getMyTenderApplications(),
        getMyDomainApplications(),
      ]);

      const licApps =
        licRes.status === "fulfilled" && licRes.value.success
          ? (licRes.value.data as any)?.results ?? (Array.isArray(licRes.value.data) ? licRes.value.data : [])
          : [];
      const tendApps =
        tendRes.status === "fulfilled" && tendRes.value.success
          ? Array.isArray(tendRes.value.data) ? tendRes.value.data : (tendRes.value.data as any)?.results ?? []
          : [];
      const domApps =
        domRes.status === "fulfilled" && domRes.value.success
          ? (domRes.value.data as any)?.results ?? (Array.isArray(domRes.value.data) ? domRes.value.data : [])
          : [];

      setApplications(normalizeApplications(licApps, tendApps, domApps));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }

  const filtered = applications.filter((app) => {
    if (activeTab !== "all" && app.type !== activeTab) return false;
    if (statusFilter && app.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        app.reference.toLowerCase().includes(q) ||
        app.name.toLowerCase().includes(q) ||
        app.organisation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-slate-100 text-slate-700 border-slate-200";
      case "SUBMITTED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "UNDER_REVIEW": return "bg-amber-100 text-amber-700 border-amber-200";
      case "INFO_REQUESTED": return "bg-orange-100 text-orange-700 border-orange-200";
      case "APPROVED": return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
      case "CANCELLED": return "bg-slate-100 text-slate-500 border-slate-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "licensing": return <Certificate size={16} weight="bold" />;
      case "tender": return <Briefcase size={16} weight="bold" />;
      case "domain": return <Globe size={16} weight="bold" />;
      default: return <FileText size={16} weight="bold" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "licensing": return "bg-teal-100 text-teal-700";
      case "tender": return "bg-purple-100 text-purple-700";
      case "domain": return "bg-sky-100 text-sky-700";
      default: return "bg-slate-100 text-slate-600";
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

  const handleRowClick = (app: UnifiedApplication) => {
    router.push(`/applications/${app.id}?type=${app.type}`);
  };

  const tabs = [
    { key: "all" as const, label: "All", count: applications.length },
    { key: "licensing" as const, label: "Licensing", count: applications.filter((a) => a.type === "licensing").length },
    { key: "tender" as const, label: "Tenders", count: applications.filter((a) => a.type === "tender").length },
    { key: "domain" as const, label: "Domains", count: applications.filter((a) => a.type === "domain").length },
  ];

  const statuses = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "INFO_REQUESTED", "APPROVED", "REJECTED", "CANCELLED"];

  return (
    <div className="min-h-screen">
      <PortalHeader title="My Applications" subtitle="Track all your licensing, tender, and domain applications" />

      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? isDarkMode
                    ? "bg-teal-600 text-white"
                    : "bg-teal-600 text-white"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.key
                  ? "bg-white/20 text-white"
                  : isDarkMode
                  ? "bg-slate-700 text-slate-400"
                  : "bg-slate-100 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
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
              placeholder="Search by reference, name, or organisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-colors ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>
          <div className="relative">
            <Funnel
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`pl-10 pr-8 py-2.5 rounded-lg border text-sm appearance-none transition-colors ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <CircleNotch size={32} className="animate-spin text-teal-600" />
            <span className={`ml-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Loading applications...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-20 rounded-xl border ${
            isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <FileText size={48} className={isDarkMode ? "text-slate-600 mx-auto mb-4" : "text-slate-300 mx-auto mb-4"} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              No applications found
            </h3>
            <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
              {searchTerm || statusFilter
                ? "Try adjusting your search or filters."
                : "You haven't submitted any applications yet."}
            </p>
            {!searchTerm && !statusFilter && (
              <button
                onClick={() => router.push("/apply-for-license")}
                className="mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Apply for a Licence
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <button
                key={`${app.type}-${app.id}`}
                onClick={() => handleRowClick(app)}
                className={`w-full text-left rounded-xl border p-4 md:p-5 transition-all hover:shadow-md group ${
                  isDarkMode
                    ? "bg-slate-800/60 border-slate-700 hover:bg-slate-800"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Top: Type badge + Reference */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${getTypeColor(app.type)}`}>
                        {getTypeIcon(app.type)}
                        {app.typeLabel}
                      </span>
                      <span className={`text-xs font-mono ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                        {app.reference}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className={`font-semibold truncate mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {app.name}
                    </h3>

                    {/* Organisation + Date */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {app.organisation}
                      </span>
                      <span className={`text-xs flex items-center gap-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                        <Clock size={12} />
                        {formatDate(app.submittedAt || app.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Status + Arrow */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.statusDisplay}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
