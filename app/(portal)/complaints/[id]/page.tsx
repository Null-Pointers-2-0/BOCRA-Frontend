"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import {
  ArrowLeft,
  FileText,
  UploadSimple,
  Clock,
  CheckCircle,
  WarningCircle,
  CircleNotch,
  CaretRight,
  Paperclip,
} from "@phosphor-icons/react";
import { getMyComplaint, uploadComplaintDocument } from "@/lib/api/clients/complaints";
import type { ComplaintDetail } from "@/lib/api/types/complaints";

export default function ComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const complaintId = params.id as string;

  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");

  const loadComplaint = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyComplaint(complaintId);
      if (res.success && res.data) {
        setComplaint(res.data);
      } else {
        setError(res.message || "Complaint not found.");
      }
    } catch {
      setError("Failed to load complaint details.");
    }
    setLoading(false);
  }, [complaintId]);

  useEffect(() => {
    if (!complaintId) return;
    void loadComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaintId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadSuccess("");
    let uploaded = 0;
    for (const file of files) {
      try {
        const res = await uploadComplaintDocument(complaintId, { name: file.name, file });
        if (res.success) uploaded++;
      } catch { /* ignore */ }
    }
    setUploading(false);
    if (uploaded > 0) {
      setUploadSuccess(`${uploaded} file(s) uploaded successfully.`);
      loadComplaint(); // refresh to show new docs
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "ASSIGNED": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "INVESTIGATING": return "bg-amber-100 text-amber-700 border-amber-200";
      case "AWAITING_RESPONSE": return "bg-orange-100 text-orange-700 border-orange-200";
      case "RESOLVED": return "bg-green-100 text-green-700 border-green-200";
      case "CLOSED": return "bg-slate-100 text-slate-700 border-slate-200";
      case "REOPENED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-700";
      case "HIGH": return "bg-orange-100 text-orange-700";
      case "MEDIUM": return "bg-amber-100 text-amber-700";
      case "LOW": return "bg-green-100 text-green-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-BW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <CircleNotch size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex-1 pb-24 md:pb-0">
        <PortalHeader title="Complaint Details" />
        <div className="pt-24 md:pt-0 p-4 md:p-8">
          <button onClick={() => router.push("/complaints")} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft size={16} /> Back to Complaints
          </button>
          <div className={`rounded-xl p-8 text-center ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
            <WarningCircle size={48} className="mx-auto text-red-400 mb-4" />
            <p className={isDarkMode ? "text-slate-300" : "text-gray-600"}>{error || "Complaint not found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-24 md:pb-0">
      <PortalHeader title="Complaint Details" />
      <div className="pt-24 md:pt-0 p-4 md:p-8 space-y-6">
        {/* Back button */}
        <button onClick={() => router.push("/complaints")} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Complaints
        </button>

        {/* Header Card */}
        <div className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{complaint.reference_number}</h1>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getStatusColor(complaint.status)}`}>
                  {complaint.status_display}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority_display}
                </span>
                {complaint.is_overdue && (
                  <span className="rounded-full px-3 py-1 text-xs font-bold bg-red-100 text-red-700">OVERDUE</span>
                )}
              </div>
              <h2 className={`text-lg ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>{complaint.subject}</h2>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                <span>Category: <strong>{complaint.category_display}</strong></span>
                <span>Against: <strong>{complaint.against_operator_name}</strong></span>
                <span>Filed: <strong>{formatDate(complaint.created_at)}</strong></span>
                {complaint.assigned_to_name && <span>Assigned to: <strong>{complaint.assigned_to_name}</strong></span>}
                {complaint.days_until_sla !== null && (
                  <span className={complaint.days_until_sla < 0 ? "text-red-600 font-bold" : ""}>
                    SLA: {complaint.days_until_sla < 0 ? `${Math.abs(complaint.days_until_sla)} days overdue` : `${complaint.days_until_sla} days remaining`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Description</h3>
              <p className={`text-sm whitespace-pre-wrap leading-relaxed ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                {complaint.description}
              </p>
            </section>

            {/* Resolution (if resolved) */}
            {complaint.resolution && (
              <section className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? "bg-green-900/20 border-green-800" : "bg-green-50 border-green-200"}`}>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={20} className="text-green-600" />
                  <h3 className={`text-lg font-bold ${isDarkMode ? "text-green-300" : "text-green-800"}`}>Resolution</h3>
                </div>
                <p className={`text-sm whitespace-pre-wrap leading-relaxed ${isDarkMode ? "text-green-200" : "text-green-700"}`}>
                  {complaint.resolution}
                </p>
                {complaint.resolved_at && (
                  <p className="text-xs text-green-500 mt-3">Resolved on {formatDate(complaint.resolved_at)}</p>
                )}
              </section>
            )}

            {/* Documents */}
            <section className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Paperclip size={20} className="text-blue-600" />
                  <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Documents ({complaint.documents.length})</h3>
                </div>
                {complaint.status !== "CLOSED" && (
                  <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
                    {uploading ? <CircleNotch size={14} className="animate-spin" /> : <UploadSimple size={14} />}
                    {uploading ? "Uploading..." : "Upload"}
                    <input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                  </label>
                )}
              </div>

              {uploadSuccess && <p className="text-sm text-green-600 mb-3">{uploadSuccess}</p>}

              {complaint.documents.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>No documents uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {complaint.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDarkMode ? "border-slate-600 hover:bg-slate-700" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-blue-600" />
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{doc.name}</p>
                          <p className="text-xs text-slate-400">
                            {doc.file_type || "Document"} • {(doc.file_size / 1024).toFixed(0)} KB
                            {doc.uploaded_by_name && ` • by ${doc.uploaded_by_name}`}
                          </p>
                        </div>
                      </div>
                      <CaretRight size={14} className="text-slate-400" />
                    </a>
                  ))}
                </div>
              )}
            </section>

            {/* Case Notes (non-internal only for complainant) */}
            {complaint.case_notes && complaint.case_notes.length > 0 && (
              <section className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Notes</h3>
                <div className="space-y-4">
                  {complaint.case_notes.map((note) => (
                    <div key={note.id} className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}>
                      <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{note.content}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {note.author_name} • {formatDate(note.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column — Status Timeline */}
          <div className="space-y-6">
            <section className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-blue-600" />
                <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Status Timeline</h3>
              </div>

              {complaint.status_timeline.length === 0 ? (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Submitted</p>
                      <p className="text-xs text-slate-400">{formatDate(complaint.created_at)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {complaint.status_timeline.map((log, i) => (
                    <div key={log.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${i === complaint.status_timeline.length - 1 ? "bg-blue-600" : "bg-slate-300"}`}></div>
                        {i < complaint.status_timeline.length - 1 && (
                          <div className={`w-0.5 h-10 ${isDarkMode ? "bg-slate-600" : "bg-gray-200"}`}></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {log.from_status_display} → {log.to_status_display}
                        </p>
                        {log.reason && <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>{log.reason}</p>}
                        <p className="text-xs text-slate-400 mt-0.5">
                          {log.changed_by_name} • {formatDate(log.changed_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Complaint Info Summary */}
            <section className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>Reference</span>
                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{complaint.reference_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>Category</span>
                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{complaint.category_display}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>Priority</span>
                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{complaint.priority_display}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>Against</span>
                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{complaint.against_operator_name}</span>
                </div>
                {complaint.sla_deadline && (
                  <div className="flex justify-between">
                    <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>SLA Deadline</span>
                    <span className={`font-medium ${complaint.is_overdue ? "text-red-600" : isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {formatDate(complaint.sla_deadline)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>Filed</span>
                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{formatDate(complaint.created_at)}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
