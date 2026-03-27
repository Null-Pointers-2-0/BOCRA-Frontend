"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import {
  ArrowLeft,
  FileText,
  UploadSimple,
  Clock,
  CheckCircle,
  XCircle,
  WarningCircle,
  CircleNotch,
  Paperclip,
  CaretRight,
  Globe,
  Certificate,
  Briefcase,
  ArrowClockwise,
  Info,
} from "@phosphor-icons/react";
import {
  getMyApplication,
  cancelApplication,
  uploadApplicationDocument,
} from "@/lib/api/clients/licensing";
import {
  getMyDomainApplication,
  cancelDomainApplication,
  respondToInfoRequest,
} from "@/lib/api/clients/domains";
import type { ApplicationDetail } from "@/lib/api/types/licensing";
import type { DomainApplicationDetail } from "@/lib/api/types/domains";

type AppType = "licensing" | "tender" | "domain";

export default function ApplicationDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    }>
      <ApplicationDetailContent />
    </Suspense>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ApplicationDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode } = useTheme();

  const appId = params.id as string;
  const appType = (searchParams.get("type") as AppType) || "licensing";

  const [licApp, setLicApp] = useState<ApplicationDetail | null>(null);
  const [domApp, setDomApp] = useState<DomainApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Action state
  const [cancelling, setCancelling] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [respondMessage, setRespondMessage] = useState("");
  const [responding, setResponding] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (appType === "licensing") {
        const res = await getMyApplication(appId);
        if (res.success && res.data) {
          setLicApp(res.data);
        } else {
          setError(res.message || "Application not found.");
        }
      } else if (appType === "domain") {
        const res = await getMyDomainApplication(appId);
        if (res.success && res.data) {
          setDomApp(res.data);
        } else {
          setError(res.message || "Application not found.");
        }
      } else if (appType === "tender") {
        // Tenders don't have a detail endpoint for applicant, show basic info
        setError("Tender application details are not available for detailed view. Please check the tenders page.");
      }
    } catch {
      setError("Failed to load application details.");
    }
    setLoading(false);
  }, [appId, appType]);

  useEffect(() => {
    if (appId) void loadDetail();
  }, [appId, loadDetail]);

  // ── Common accessors ──
  const reference = licApp?.reference_number ?? domApp?.reference_number ?? "";
  const status = licApp?.status ?? domApp?.status ?? "";
  const statusDisplay = licApp?.status_display ?? domApp?.status_display ?? "";
  const canCancel = licApp?.can_cancel ?? domApp?.can_cancel ?? false;
  const infoMessage = licApp?.info_request_message ?? domApp?.info_request_message ?? "";
  const decisionReason = licApp?.decision_reason ?? domApp?.decision_reason ?? "";
  const documents = licApp?.documents ?? domApp?.documents ?? [];
  const timeline = licApp?.status_timeline ?? domApp?.status_timeline ?? [];
  const createdAt = licApp?.created_at ?? domApp?.created_at ?? "";
  const submittedAt = licApp?.submitted_at ?? domApp?.submitted_at ?? "";

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this application? This cannot be undone.")) return;
    setCancelling(true);
    setActionError("");
    try {
      if (appType === "licensing") {
        const res = await cancelApplication(appId);
        if (res.success) {
          setLicApp(res.data);
        } else {
          setActionError(res.message || "Failed to cancel.");
        }
      } else if (appType === "domain") {
        const res = await cancelDomainApplication(appId);
        if (res.success) {
          setDomApp(res.data);
        } else {
          setActionError(res.message || "Failed to cancel.");
        }
      }
    } catch {
      setActionError("Network error. Please try again.");
    }
    setCancelling(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || appType !== "licensing") return;
    setUploading(true);
    setUploadSuccess("");
    let uploaded = 0;
    for (const file of files) {
      try {
        const res = await uploadApplicationDocument(appId, { name: file.name, file });
        if (res.success) uploaded++;
      } catch { /* ignore */ }
    }
    setUploading(false);
    if (uploaded > 0) {
      setUploadSuccess(`${uploaded} file(s) uploaded successfully.`);
      loadDetail();
    }
  }

  async function handleRespond() {
    if (!respondMessage.trim()) return;
    setResponding(true);
    setActionError("");
    try {
      const res = await respondToInfoRequest(appId, { response_message: respondMessage });
      if (res.success) {
        setDomApp(res.data);
        setRespondMessage("");
      } else {
        setActionError(res.message || "Failed to send response.");
      }
    } catch {
      setActionError("Network error.");
    }
    setResponding(false);
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case "DRAFT": return "bg-slate-100 text-slate-700 border-slate-300";
      case "SUBMITTED": return "bg-blue-100 text-blue-700 border-blue-300";
      case "UNDER_REVIEW": return "bg-amber-100 text-amber-700 border-amber-300";
      case "INFO_REQUESTED": return "bg-orange-100 text-orange-700 border-orange-300";
      case "APPROVED": return "bg-green-100 text-green-700 border-green-300";
      case "REJECTED": return "bg-red-100 text-red-700 border-red-300";
      case "CANCELLED": return "bg-slate-100 text-slate-500 border-slate-300";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getTimelineIcon = (s: string) => {
    switch (s) {
      case "SUBMITTED": return <CheckCircle size={18} className="text-blue-500" weight="fill" />;
      case "UNDER_REVIEW": return <ArrowClockwise size={18} className="text-amber-500" />;
      case "INFO_REQUESTED": return <Info size={18} className="text-orange-500" />;
      case "APPROVED": return <CheckCircle size={18} className="text-green-500" weight="fill" />;
      case "REJECTED": return <XCircle size={18} className="text-red-500" weight="fill" />;
      case "CANCELLED": return <XCircle size={18} className="text-slate-400" weight="fill" />;
      default: return <Clock size={18} className="text-slate-400" />;
    }
  };

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-BW", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <PortalHeader title="Application Details" subtitle="Loading..." />
        <div className="flex items-center justify-center py-20">
          <CircleNotch size={32} className="animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <PortalHeader title="Application Details" subtitle="" />
        <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/applications")}
            className={`flex items-center gap-2 mb-6 text-sm font-medium transition-colors ${
              isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <ArrowLeft size={18} /> Back to Applications
          </button>
          <div className={`text-center py-16 rounded-xl border ${
            isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <WarningCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              {error}
            </h3>
            <button
              onClick={() => router.push("/applications")}
              className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
            >
              Back to Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PortalHeader title="Application Details" subtitle={`Reference: ${reference}`} />

      <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push("/applications")}
          className={`flex items-center gap-2 mb-6 text-sm font-medium transition-colors ${
            isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <ArrowLeft size={18} /> Back to Applications
        </button>

        {actionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {actionError}
          </div>
        )}
        {uploadSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {uploadSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className={`rounded-xl border p-5 ${
              isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                      appType === "licensing" ? "bg-teal-100 text-teal-700" :
                      appType === "domain" ? "bg-sky-100 text-sky-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {appType === "licensing" ? <Certificate size={14} /> :
                       appType === "domain" ? <Globe size={14} /> :
                       <Briefcase size={14} />}
                      {appType === "licensing" ? "Licence Application" :
                       appType === "domain" ? "Domain Application" :
                       "Tender Application"}
                    </span>
                    <span className={`font-mono text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                      {reference}
                    </span>
                  </div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {licApp?.licence_type?.name ?? domApp?.domain_name ?? "Application"}
                  </h2>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                  {statusDisplay}
                </span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {licApp && (
                  <>
                    <DetailField label="Organisation" value={licApp.organisation_name} isDarkMode={isDarkMode} />
                    <DetailField label="Contact Person" value={licApp.contact_person} isDarkMode={isDarkMode} />
                    <DetailField label="Contact Email" value={licApp.contact_email} isDarkMode={isDarkMode} />
                    <DetailField label="Contact Phone" value={licApp.contact_phone || "—"} isDarkMode={isDarkMode} />
                    <DetailField label="Licence Type" value={licApp.licence_type?.name || "—"} isDarkMode={isDarkMode} />
                    <DetailField label="Fee" value={licApp.licence_type ? `${licApp.licence_type.fee_currency} ${licApp.licence_type.fee_amount}` : "—"} isDarkMode={isDarkMode} />
                  </>
                )}
                {domApp && (
                  <>
                    <DetailField label="Domain Name" value={domApp.domain_name} isDarkMode={isDarkMode} />
                    <DetailField label="Zone" value={domApp.zone?.name || "—"} isDarkMode={isDarkMode} />
                    <DetailField label="Organisation" value={domApp.organisation_name} isDarkMode={isDarkMode} />
                    <DetailField label="Registrant" value={domApp.registrant_name} isDarkMode={isDarkMode} />
                    <DetailField label="Registrant Email" value={domApp.registrant_email} isDarkMode={isDarkMode} />
                    <DetailField label="Registration Period" value={`${domApp.registration_period_years} year(s)`} isDarkMode={isDarkMode} />
                    {domApp.nameserver_1 && <DetailField label="Nameserver 1" value={domApp.nameserver_1} isDarkMode={isDarkMode} />}
                    {domApp.nameserver_2 && <DetailField label="Nameserver 2" value={domApp.nameserver_2} isDarkMode={isDarkMode} />}
                  </>
                )}
              </div>

              {/* Description */}
              {licApp?.description && (
                <div className="mt-4">
                  <label className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    Description
                  </label>
                  <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {licApp.description}
                  </p>
                </div>
              )}
              {domApp?.justification && (
                <div className="mt-4">
                  <label className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    Justification
                  </label>
                  <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {domApp.justification}
                  </p>
                </div>
              )}
            </div>

            {/* Info Request Message */}
            {status === "INFO_REQUESTED" && infoMessage && (
              <div className={`rounded-xl border p-5 ${
                isDarkMode ? "bg-orange-900/20 border-orange-800" : "bg-orange-50 border-orange-200"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <WarningCircle size={20} className="text-orange-500" />
                  <h3 className={`font-semibold ${isDarkMode ? "text-orange-300" : "text-orange-800"}`}>
                    Additional Information Requested
                  </h3>
                </div>
                <p className={`text-sm mb-4 ${isDarkMode ? "text-orange-200" : "text-orange-700"}`}>
                  {infoMessage}
                </p>
                {appType === "domain" && (
                  <div className="space-y-3">
                    <textarea
                      value={respondMessage}
                      onChange={(e) => setRespondMessage(e.target.value)}
                      placeholder="Type your response..."
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                    <button
                      onClick={handleRespond}
                      disabled={responding || !respondMessage.trim()}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {responding && <CircleNotch size={16} className="animate-spin" />}
                      Send Response
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Decision Reason */}
            {(status === "APPROVED" || status === "REJECTED") && decisionReason && (
              <div className={`rounded-xl border p-5 ${
                status === "APPROVED"
                  ? isDarkMode ? "bg-green-900/20 border-green-800" : "bg-green-50 border-green-200"
                  : isDarkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {status === "APPROVED" ? (
                    <CheckCircle size={20} className="text-green-500" weight="fill" />
                  ) : (
                    <XCircle size={20} className="text-red-500" weight="fill" />
                  )}
                  <h3 className={`font-semibold ${
                    status === "APPROVED"
                      ? isDarkMode ? "text-green-300" : "text-green-800"
                      : isDarkMode ? "text-red-300" : "text-red-800"
                  }`}>
                    {status === "APPROVED" ? "Application Approved" : "Application Rejected"}
                  </h3>
                </div>
                <p className={`text-sm ${
                  status === "APPROVED"
                    ? isDarkMode ? "text-green-200" : "text-green-700"
                    : isDarkMode ? "text-red-200" : "text-red-700"
                }`}>
                  {decisionReason}
                </p>
                {status === "APPROVED" && licApp?.has_licence && licApp.licence_id && (
                  <button
                    onClick={() => router.push(`/licenses/${licApp.licence_id}`)}
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
                  >
                    <Certificate size={16} /> View Licence
                  </button>
                )}
              </div>
            )}

            {/* Documents */}
            <div className={`rounded-xl border p-5 ${
              isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Documents
                </h3>
                {appType === "licensing" && ["DRAFT", "SUBMITTED", "INFO_REQUESTED"].includes(status) && (
                  <label className="cursor-pointer px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 flex items-center gap-1.5">
                    <UploadSimple size={14} />
                    Upload
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
              {uploading && (
                <div className="flex items-center gap-2 mb-3 text-sm text-teal-600">
                  <CircleNotch size={16} className="animate-spin" /> Uploading...
                </div>
              )}
              {documents.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                  No documents uploaded yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isDarkMode
                          ? "border-slate-700 hover:bg-slate-700/50"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <Paperclip size={18} className={isDarkMode ? "text-slate-400" : "text-slate-500"} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          {doc.name}
                        </p>
                        <p className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                          {doc.uploaded_by_name} • {formatDate(doc.created_at)}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary card */}
            <div className={`rounded-xl border p-5 ${
              isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
            }`}>
              <h3 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Summary
              </h3>
              <div className="space-y-3">
                <SummaryRow label="Status" isDarkMode={isDarkMode}>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {statusDisplay}
                  </span>
                </SummaryRow>
                <SummaryRow label="Created" value={formatDate(createdAt)} isDarkMode={isDarkMode} />
                <SummaryRow label="Submitted" value={formatDate(submittedAt)} isDarkMode={isDarkMode} />
                {licApp?.decision_date && (
                  <SummaryRow label="Decision" value={formatDate(licApp.decision_date)} isDarkMode={isDarkMode} />
                )}
                {domApp?.decision_date && (
                  <SummaryRow label="Decision" value={formatDate(domApp.decision_date)} isDarkMode={isDarkMode} />
                )}
              </div>
            </div>

            {/* Actions card */}
            {canCancel && (
              <div className={`rounded-xl border p-5 ${
                isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
              }`}>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Actions
                </h3>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <CircleNotch size={16} className="animate-spin" />
                  ) : (
                    <XCircle size={16} />
                  )}
                  Cancel Application
                </button>
              </div>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <div className={`rounded-xl border p-5 ${
                isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
              }`}>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Status Timeline
                </h3>
                <div className="space-y-0">
                  {timeline.map((entry, i) => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="mt-0.5">{getTimelineIcon(entry.to_status)}</div>
                        {i < timeline.length - 1 && (
                          <div className={`w-px flex-1 my-1 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`} />
                        )}
                      </div>
                      <div className="pb-4 flex-1">
                        <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          {entry.to_status_display}
                        </p>
                        {entry.reason && (
                          <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {entry.reason}
                          </p>
                        )}
                        <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                          {entry.changed_by_name} • {formatDate(entry.changed_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, isDarkMode }: { label: string; value: string; isDarkMode: boolean }) {
  return (
    <div>
      <label className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
        {label}
      </label>
      <p className={`mt-0.5 text-sm ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>{value}</p>
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
