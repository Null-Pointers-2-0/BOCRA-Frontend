"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import {
  ArrowLeft,
  Certificate,
  DownloadSimple,
  ArrowClockwise,
  Clock,
  CheckCircle,
  Warning,
  CircleNotch,
  WarningCircle,
  CalendarBlank,
  Buildings,
  IdentificationCard,
  ShieldCheck,
} from "@phosphor-icons/react";
import {
  getMyLicence,
  renewLicence,
  downloadCertificate,
} from "@/lib/api/clients/licensing";
import type { LicenceDetail } from "@/lib/api/types/licensing";

export default function LicenceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const licenceId = params.id as string;

  const [licence, setLicence] = useState<LicenceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [renewing, setRenewing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [renewSuccess, setRenewSuccess] = useState("");

  const loadLicence = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyLicence(licenceId);
      if (res.success && res.data) {
        setLicence(res.data);
      } else {
        setError(res.message || "Licence not found.");
      }
    } catch {
      setError("Failed to load licence details.");
    }
    setLoading(false);
  }, [licenceId]);

  useEffect(() => {
    if (licenceId) void loadLicence();
  }, [licenceId, loadLicence]);

  async function handleRenew() {
    if (!confirm("Are you sure you want to submit a renewal application for this licence?")) return;
    setRenewing(true);
    setActionError("");
    setRenewSuccess("");
    try {
      const res = await renewLicence(licenceId);
      if (res.success && res.data) {
        setRenewSuccess(`Renewal application created: ${res.data.reference_number}. You can track it in Applications.`);
      } else {
        setActionError(res.message || "Failed to create renewal.");
      }
    } catch {
      setActionError("Network error. Please try again.");
    }
    setRenewing(false);
  }

  async function handleDownloadCertificate() {
    setDownloading(true);
    setActionError("");
    try {
      const blob = await downloadCertificate(licenceId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `licence-${licence?.licence_number || licenceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setActionError("Failed to download certificate.");
    }
    setDownloading(false);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-700 border-green-300";
      case "SUSPENDED": return "bg-amber-100 text-amber-700 border-amber-300";
      case "EXPIRED": return "bg-red-100 text-red-700 border-red-300";
      case "REVOKED": return "bg-slate-100 text-slate-600 border-slate-300";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <PortalHeader title="Licence Details" subtitle="Loading..." />
        <div className="flex items-center justify-center py-20">
          <CircleNotch size={32} className="animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  if (error || !licence) {
    return (
      <div className="min-h-screen">
        <PortalHeader title="Licence Details" subtitle="" />
        <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/licenses")}
            className={`flex items-center gap-2 mb-6 text-sm font-medium transition-colors ${
              isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <ArrowLeft size={18} /> Back to Licences
          </button>
          <div className={`text-center py-16 rounded-xl border ${
            isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <WarningCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              {error || "Licence not found"}
            </h3>
            <button
              onClick={() => router.push("/licenses")}
              className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
            >
              Back to Licences
            </button>
          </div>
        </div>
      </div>
    );
  }

  const expiryWarning =
    licence.is_expired
      ? { text: "This licence has expired", color: "red" as const }
      : licence.days_until_expiry !== null && licence.days_until_expiry <= 30
      ? { text: `Expires in ${licence.days_until_expiry} days`, color: "amber" as const }
      : licence.days_until_expiry !== null && licence.days_until_expiry <= 90
      ? { text: `Expires in ${licence.days_until_expiry} days`, color: "orange" as const }
      : null;

  return (
    <div className="min-h-screen">
      <PortalHeader title="Licence Details" subtitle={`Licence: ${licence.licence_number}`} />

      <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push("/licenses")}
          className={`flex items-center gap-2 mb-6 text-sm font-medium transition-colors ${
            isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <ArrowLeft size={18} /> Back to Licences
        </button>

        {actionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {actionError}
          </div>
        )}
        {renewSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {renewSuccess}
          </div>
        )}

        {/* Expiry warning banner */}
        {expiryWarning && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
            expiryWarning.color === "red"
              ? isDarkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
              : expiryWarning.color === "amber"
              ? isDarkMode ? "bg-amber-900/20 border-amber-800" : "bg-amber-50 border-amber-200"
              : isDarkMode ? "bg-orange-900/20 border-orange-800" : "bg-orange-50 border-orange-200"
          }`}>
            <Warning size={24} weight="fill" className={
              expiryWarning.color === "red" ? "text-red-500" :
              expiryWarning.color === "amber" ? "text-amber-500" : "text-orange-500"
            } />
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                expiryWarning.color === "red"
                  ? isDarkMode ? "text-red-300" : "text-red-800"
                  : expiryWarning.color === "amber"
                  ? isDarkMode ? "text-amber-300" : "text-amber-800"
                  : isDarkMode ? "text-orange-300" : "text-orange-800"
              }`}>
                {expiryWarning.text}
              </p>
              {!licence.is_expired && (
                <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Consider renewing your licence before it expires.
                </p>
              )}
            </div>
            {(licence.is_expired || (licence.days_until_expiry !== null && licence.days_until_expiry <= 90)) && (
              <button
                onClick={handleRenew}
                disabled={renewing}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {renewing ? <CircleNotch size={16} className="animate-spin" /> : <ArrowClockwise size={16} />}
                Renew
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Licence info card */}
            <div className={`rounded-xl border p-5 ${
              isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Certificate size={20} className="text-teal-600" />
                    <span className={`font-mono text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {licence.licence_number}
                    </span>
                  </div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {licence.licence_type?.name || "Licence"}
                  </h2>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(licence.status)}`}>
                  {licence.status_display}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailField
                  icon={<Buildings size={16} />}
                  label="Organisation"
                  value={licence.organisation_name}
                  isDarkMode={isDarkMode}
                />
                <DetailField
                  icon={<IdentificationCard size={16} />}
                  label="Holder"
                  value={licence.holder}
                  isDarkMode={isDarkMode}
                />
                <DetailField
                  icon={<ShieldCheck size={16} />}
                  label="Licence Type"
                  value={licence.licence_type?.name || "—"}
                  isDarkMode={isDarkMode}
                />
                <DetailField
                  icon={<Certificate size={16} />}
                  label="Application Reference"
                  value={licence.application_reference || "—"}
                  isDarkMode={isDarkMode}
                />
                <DetailField
                  icon={<CalendarBlank size={16} />}
                  label="Issued Date"
                  value={formatDate(licence.issued_date)}
                  isDarkMode={isDarkMode}
                />
                <DetailField
                  icon={<Clock size={16} />}
                  label="Expiry Date"
                  value={formatDate(licence.expiry_date)}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>

            {/* Conditions */}
            {licence.conditions && (
              <div className={`rounded-xl border p-5 ${
                isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
              }`}>
                <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Licence Conditions
                </h3>
                <div className={`text-sm whitespace-pre-wrap ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {licence.conditions}
                </div>
              </div>
            )}

            {/* Licence type info */}
            {licence.licence_type && (
              <div className={`rounded-xl border p-5 ${
                isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
              }`}>
                <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Licence Type Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                      Type Code
                    </label>
                    <p className={`mt-0.5 text-sm font-mono ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                      {licence.licence_type.code}
                    </p>
                  </div>
                  <div>
                    <label className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                      Validity Period
                    </label>
                    <p className={`mt-0.5 text-sm ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                      {licence.licence_type.validity_period_months} months
                    </p>
                  </div>
                  <div>
                    <label className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                      Annual Fee
                    </label>
                    <p className={`mt-0.5 text-sm ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                      {licence.licence_type.annual_fee
                        ? `${licence.licence_type.fee_currency} ${licence.licence_type.annual_fee}`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <label className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                      Renewal Fee
                    </label>
                    <p className={`mt-0.5 text-sm ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                      {licence.licence_type.renewal_fee
                        ? `${licence.licence_type.fee_currency} ${licence.licence_type.renewal_fee}`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions card */}
            <div className={`rounded-xl border p-5 ${
              isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
            }`}>
              <h3 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Actions
              </h3>
              <div className="space-y-3">
                {licence.has_certificate && (
                  <button
                    onClick={handleDownloadCertificate}
                    disabled={downloading}
                    className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {downloading ? (
                      <CircleNotch size={16} className="animate-spin" />
                    ) : (
                      <DownloadSimple size={16} />
                    )}
                    Download Certificate
                  </button>
                )}
                <button
                  onClick={handleRenew}
                  disabled={renewing}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 border ${
                    isDarkMode
                      ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {renewing ? (
                    <CircleNotch size={16} className="animate-spin" />
                  ) : (
                    <ArrowClockwise size={16} />
                  )}
                  Renew Licence
                </button>
              </div>
            </div>

            {/* Summary card */}
            <div className={`rounded-xl border p-5 ${
              isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
            }`}>
              <h3 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Summary
              </h3>
              <div className="space-y-3">
                <SummaryRow label="Status" isDarkMode={isDarkMode}>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(licence.status)}`}>
                    {licence.status_display}
                  </span>
                </SummaryRow>
                <SummaryRow label="Issued" value={formatDate(licence.issued_date)} isDarkMode={isDarkMode} />
                <SummaryRow label="Expires" value={formatDate(licence.expiry_date)} isDarkMode={isDarkMode} />
                {licence.days_until_expiry !== null && !licence.is_expired && (
                  <SummaryRow
                    label="Days Left"
                    value={`${licence.days_until_expiry} days`}
                    isDarkMode={isDarkMode}
                  />
                )}
                <SummaryRow label="Has Certificate" value={licence.has_certificate ? "Yes" : "No"} isDarkMode={isDarkMode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({
  icon,
  label,
  value,
  isDarkMode,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isDarkMode: boolean;
}) {
  return (
    <div>
      <div className={`flex items-center gap-1.5 mb-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
        {icon}
        <label className="text-xs font-medium uppercase tracking-wide">{label}</label>
      </div>
      <p className={`text-sm ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>{value}</p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  children,
  isDarkMode,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
  isDarkMode: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
      {children || (
        <span className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
          {value}
        </span>
      )}
    </div>
  );
}
