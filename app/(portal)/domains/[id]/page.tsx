"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import {
  Globe,
  ArrowLeft,
  Spinner,
  Warning,
  CalendarBlank,
  User,
  EnvelopeSimple,
  Phone,
  MapPin,
  HardDrives,
  Copy,
  Check,
} from "@phosphor-icons/react";

import { getMyDomain } from "@/lib/api/clients/domains";
import type { DomainDetail } from "@/lib/api/types/domains";

export default function DomainDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isDarkMode } = useTheme();

  const [domain, setDomain] = useState<DomainDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;
    loadDomain();
  }, [id]);

  async function loadDomain() {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyDomain(id);
      if (res.success) {
        setDomain(res.data);
      } else {
        setError(res.message || "Failed to load domain");
      }
    } catch {
      setError("Failed to load domain details");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

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
    }
    return (
      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${classes}`}>
        {statusDisplay}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 pb-24 md:pb-0">
        <PortalHeader />
        <div className="pt-24 md:pt-0 p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Spinner size={32} className="animate-spin" />
            <p>Loading domain details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !domain) {
    return (
      <div className="flex-1 pb-24 md:pb-0">
        <PortalHeader />
        <div className="pt-24 md:pt-0 p-4 md:p-8">
          <button
            onClick={() => router.push("/domains")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Domains</span>
          </button>
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Warning size={48} className="mx-auto mb-4 text-red-400" />
            <p className="text-red-600 font-medium">{error || "Domain not found"}</p>
            <button
              onClick={() => router.push("/domains")}
              className="mt-4 text-blue-600 text-sm font-semibold hover:underline"
            >
              Return to Domains
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nameservers = [
    domain.nameserver_1,
    domain.nameserver_2,
    domain.nameserver_3,
    domain.nameserver_4,
  ].filter(Boolean);

  return (
    <div className="flex-1 pb-24 md:pb-0">
      <PortalHeader />

      <div className={`pt-24 md:pt-0 p-4 md:p-8 space-y-6 ${isDarkMode ? "bg-slate-50" : "bg-gray-50"}`}>
        {/* Back button */}
        <button
          onClick={() => router.push("/domains")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Domains</span>
        </button>

        {/* Domain Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Globe size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900">{domain.domain_name}</h1>
                  <button
                    onClick={() => copyToClipboard(domain.domain_name)}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Copy domain name"
                  >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-slate-500 text-sm mt-0.5">Zone: {domain.zone_name}</p>
              </div>
            </div>
            {getStatusBadge(domain.status, domain.status_display)}
          </div>

          {/* Expiry warning */}
          {domain.is_expired && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              <Warning size={18} />
              This domain has expired. Please renew to keep it active.
            </div>
          )}
          {!domain.is_expired && domain.days_until_expiry !== null && domain.days_until_expiry <= 90 && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
              <Warning size={18} />
              This domain expires in {domain.days_until_expiry} days. Consider renewing soon.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Registration Details</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CalendarBlank size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Registered</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {new Date(domain.registered_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarBlank size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Expires</p>
                  <p
                    className={`text-sm font-medium ${
                      domain.is_expired
                        ? "text-red-600"
                        : domain.days_until_expiry !== null && domain.days_until_expiry <= 90
                        ? "text-amber-600"
                        : "text-slate-900"
                    }`}
                  >
                    {new Date(domain.expires_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {domain.days_until_expiry !== null && !domain.is_expired && (
                      <span className="text-slate-400 ml-2">({domain.days_until_expiry} days)</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Organisation</p>
                  <p className="text-sm text-slate-900 font-medium">{domain.organisation_name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registrant Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Registrant Information</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Name</p>
                  <p className="text-sm text-slate-900 font-medium">{domain.registrant_name}</p>
                </div>
              </div>
              {domain.registrant_email && (
                <div className="flex items-start gap-3">
                  <EnvelopeSimple size={18} className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email</p>
                    <p className="text-sm text-slate-900 font-medium">{domain.registrant_email}</p>
                  </div>
                </div>
              )}
              {domain.registrant_phone && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Phone</p>
                    <p className="text-sm text-slate-900 font-medium">{domain.registrant_phone}</p>
                  </div>
                </div>
              )}
              {domain.registrant_address && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Address</p>
                    <p className="text-sm text-slate-900 font-medium">{domain.registrant_address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nameservers */}
          {nameservers.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-900">Nameservers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nameservers.map((ns, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <HardDrives size={18} className="text-slate-400" />
                    <span className="text-sm text-slate-900 font-mono">{ns}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
