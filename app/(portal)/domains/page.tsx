"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import {
  Globe,
  MagnifyingGlass,
  Spinner,
  Warning,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";

import { getMyDomains, getMyDomainApplications } from "@/lib/api/clients/domains";
import type { DomainListItem, DomainApplicationListItem } from "@/lib/api/types/domains";

type Tab = "domains" | "applications";

export default function DomainsPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState<Tab>("domains");
  const [domains, setDomains] = useState<DomainListItem[]>([]);
  const [applications, setApplications] = useState<DomainApplicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [domainsRes, appsRes] = await Promise.allSettled([
        getMyDomains(),
        getMyDomainApplications(),
      ]);

      if (domainsRes.status === "fulfilled" && domainsRes.value.success) {
        const data = domainsRes.value.data;
        const items = Array.isArray(data)
          ? data
          : (data as { results?: DomainListItem[] }).results ?? [];
        setDomains(items as DomainListItem[]);
      }

      if (appsRes.status === "fulfilled" && appsRes.value.success) {
        const data = appsRes.value.data;
        const items = Array.isArray(data)
          ? data
          : data.results ?? [];
        setApplications(items);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }

  const filteredDomains = domains.filter(
    (d) =>
      d.domain_name.toLowerCase().includes(search.toLowerCase()) ||
      d.zone_name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredApplications = applications.filter(
    (a) =>
      a.domain_name.toLowerCase().includes(search.toLowerCase()) ||
      a.reference_number.toLowerCase().includes(search.toLowerCase())
  );

  function getStatusBadge(status: string, statusDisplay: string) {
    let classes = "bg-slate-100 text-slate-700";
    switch (status) {
      case "ACTIVE":
        classes = "bg-green-100 text-green-700";
        break;
      case "EXPIRED":
        classes = "bg-red-100 text-red-700";
        break;
      case "SUSPENDED":
        classes = "bg-amber-100 text-amber-700";
        break;
      case "SUBMITTED":
      case "UNDER_REVIEW":
        classes = "bg-blue-100 text-blue-700";
        break;
      case "APPROVED":
        classes = "bg-green-100 text-green-700";
        break;
      case "REJECTED":
      case "CANCELLED":
        classes = "bg-red-100 text-red-700";
        break;
      case "INFO_REQUESTED":
        classes = "bg-amber-100 text-amber-700";
        break;
      case "DRAFT":
        classes = "bg-slate-100 text-slate-600";
        break;
    }
    return (
      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${classes}`}>
        {statusDisplay}
      </span>
    );
  }

  return (
    <div className="flex-1 pb-24 md:pb-0">
      <PortalHeader />

      <div className={`pt-24 md:pt-0 p-4 md:p-8 space-y-6 ${isDarkMode ? "bg-slate-50" : "bg-gray-50"}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Domains</h1>
            <p className="text-slate-500 mt-1">Manage your registered domains and applications</p>
          </div>
          <button
            onClick={() => router.push("/apply?type=domain")}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} weight="bold" />
            Register Domain
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab("domains")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              activeTab === "domains"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            My Domains ({domains.length})
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              activeTab === "applications"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            My Applications ({applications.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === "domains" ? "Search domains..." : "Search applications..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Spinner size={32} className="animate-spin" />
              <p>Loading...</p>
            </div>
          </div>
        ) : activeTab === "domains" ? (
          /* ==================== DOMAINS LIST ==================== */
          filteredDomains.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Globe size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 font-medium">No domains found</p>
              <p className="text-sm text-slate-400 mt-1">
                {domains.length === 0
                  ? "You haven't registered any domains yet"
                  : "No domains match your search"}
              </p>
              {domains.length === 0 && (
                <button
                  onClick={() => router.push("/apply?type=domain")}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} weight="bold" />
                  Register Your First Domain
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDomains.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => router.push(`/domains/${domain.id}`)}
                  className="w-full bg-white rounded-xl shadow-sm p-4 md:p-5 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe size={20} className="text-blue-600 flex-shrink-0" />
                        <h3 className="font-bold text-slate-900 truncate">{domain.domain_name}</h3>
                        {getStatusBadge(domain.status, domain.status_display)}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span>Zone: <strong className="text-slate-700">{domain.zone_name}</strong></span>
                        <span>Registrant: <strong className="text-slate-700">{domain.registrant_name}</strong></span>
                        {domain.expires_at && (
                          <span>
                            Expires:{" "}
                            <strong
                              className={
                                domain.is_expired
                                  ? "text-red-600"
                                  : domain.days_until_expiry !== null && domain.days_until_expiry <= 90
                                  ? "text-amber-600"
                                  : "text-slate-700"
                              }
                            >
                              {new Date(domain.expires_at).toLocaleDateString()}
                            </strong>
                          </span>
                        )}
                      </div>
                      {domain.is_expired && (
                        <div className="flex items-center gap-1.5 mt-2 text-red-600 text-sm font-semibold">
                          <Warning size={14} />
                          Domain expired
                        </div>
                      )}
                      {!domain.is_expired && domain.days_until_expiry !== null && domain.days_until_expiry <= 90 && (
                        <div className="flex items-center gap-1.5 mt-2 text-amber-600 text-sm font-semibold">
                          <Warning size={14} />
                          Expires in {domain.days_until_expiry} days
                        </div>
                      )}
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-slate-300 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-4"
                    />
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          /* ==================== APPLICATIONS LIST ==================== */
          filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Clock size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 font-medium">No applications found</p>
              <p className="text-sm text-slate-400 mt-1">
                {applications.length === 0
                  ? "You haven't submitted any domain applications yet"
                  : "No applications match your search"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => router.push(`/applications/${app.id}?type=domain`)}
                  className="w-full bg-white rounded-xl shadow-sm p-4 md:p-5 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs text-slate-400">{app.reference_number}</span>
                        {getStatusBadge(app.status, app.status_display)}
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1">{app.domain_name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span>Type: <strong className="text-slate-700">{app.application_type_display}</strong></span>
                        <span>Zone: <strong className="text-slate-700">{app.zone_name}</strong></span>
                        {app.submitted_at && (
                          <span>Submitted: {new Date(app.submitted_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-slate-300 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-4"
                    />
                  </div>
                </button>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
