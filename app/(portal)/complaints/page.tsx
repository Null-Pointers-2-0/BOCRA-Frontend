"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import {
  FileText,
  MagnifyingGlass,
  UploadSimple,
  Warning,
  CheckCircle,
  ShieldCheck,
  Ruler,
  Phone,
  Envelope,
  CaretRight,
  Clock,
  CircleNotch,
} from "@phosphor-icons/react";
import {
  getCategories,
  submitComplaint,
  trackComplaint,
  getMyComplaints,
  uploadComplaintDocument,
} from "@/lib/api/clients/complaints";
import type {
  ComplaintCategoryOption,
  ComplaintListItem,
  ComplaintTrack,
} from "@/lib/api/types/complaints";
import type { ComplaintCategory, ComplaintPriority } from "@/lib/api/types/common";
import { useAuth } from "@/contexts/AuthContext";

export default function Complaints() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  // ── Categories from API ──
  const [categories, setCategories] = useState<ComplaintCategoryOption[]>([]);

  // ── My complaints from API ──
  const [myComplaints, setMyComplaints] = useState<ComplaintListItem[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);

  // ── Form state (matches backend ComplaintCreateRequest) ──
  const [formData, setFormData] = useState({
    against_operator_name: "",
    category: "" as ComplaintCategory | "",
    subject: "",
    description: "",
    priority: "MEDIUM" as ComplaintPriority,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{ reference: string } | null>(null);
  const [submitError, setSubmitError] = useState("");

  // ── Track complaint ──
  const [trackRef, setTrackRef] = useState("");
  const [trackResult, setTrackResult] = useState<ComplaintTrack | null>(null);
  const [trackError, setTrackError] = useState("");
  const [tracking, setTracking] = useState(false);

  // ── Load categories + my complaints on mount ──
  useEffect(() => {
    getCategories().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    }).catch(() => {});

    loadMyComplaints();
  }, []);

  async function loadMyComplaints() {
    setComplaintsLoading(true);
    try {
      const res = await getMyComplaints();
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : (res.data as any).results ?? [];
        setMyComplaints(list);
      }
    } catch { /* ignore */ }
    setComplaintsLoading(false);
  }

  // ── Form handlers ──
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.subject || !formData.description || !formData.against_operator_name) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(null);

    try {
      const res = await submitComplaint({
        complainant_name: user?.full_name || "",
        complainant_email: user?.email || "",
        complainant_phone: user?.phone_number || "",
        against_operator_name: formData.against_operator_name,
        category: formData.category as ComplaintCategory,
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
      });

      if (res.success && res.data) {
        const complaintId = res.data.id;

        // Upload files if any
        for (const file of uploadedFiles) {
          try {
            await uploadComplaintDocument(complaintId, { name: file.name, file });
          } catch { /* best effort */ }
        }

        setSubmitSuccess({ reference: res.data.reference_number });
        setFormData({ against_operator_name: "", category: "", subject: "", description: "", priority: "MEDIUM" });
        setUploadedFiles([]);
        setCurrentStep(1);
        loadMyComplaints(); // refresh list
      } else {
        setSubmitError(res.message || "Submission failed. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  // ── Track handler ──
  const handleTrack = async () => {
    if (!trackRef.trim()) return;
    setTracking(true);
    setTrackError("");
    setTrackResult(null);
    try {
      const res = await trackComplaint(trackRef.trim());
      if (res.success && res.data) {
        setTrackResult(res.data);
      } else {
        setTrackError(res.message || "Complaint not found.");
      }
    } catch {
      setTrackError("Failed to track complaint.");
    }
    setTracking(false);
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

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  return (
    <div className="flex-1 pb-24 md:pb-0">
      <PortalHeader
        title="Complaints"
        subtitle="File and track your regulatory complaints"
        showNewApplicationButton={false}
      />
      <div className="pt-24 md:pt-0 p-4 md:p-8 space-y-8">
        {/* Success Banner */}
        {submitSuccess && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-6">
            <div className="flex items-start gap-3">
              <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-green-900">Complaint Submitted Successfully</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your reference number is <strong>{submitSuccess.reference}</strong>. You can use this to track the status of your complaint.
                </p>
                <button
                  onClick={() => setSubmitSuccess(null)}
                  className="mt-3 text-sm font-semibold text-green-700 hover:text-green-900"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Status Check */}
            <section className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-4">
                <MagnifyingGlass size={20} className="text-blue-600" />
                <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Track a Complaint</h3>
              </div>
              <div className="flex gap-2">
                <input
                  className={`w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? "border-slate-600 bg-slate-700 text-white placeholder-slate-400" : "border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400"}`}
                  placeholder="Enter reference number (e.g., CMP-2026-000001)"
                  type="text"
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                />
                <button
                  onClick={handleTrack}
                  disabled={tracking}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {tracking ? "..." : "Track"}
                </button>
              </div>
              {trackError && <p className="mt-2 text-sm text-red-600">{trackError}</p>}
              {trackResult && (
                <div className={`mt-4 p-4 rounded-lg border ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{trackResult.reference_number}</span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(trackResult.status)}`}>
                      {trackResult.status_display}
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>{trackResult.subject}</p>
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    <span>Category: {trackResult.category_display}</span>
                    <span>Against: {trackResult.against_operator_name}</span>
                    {trackResult.is_overdue && <span className="text-red-600 font-bold">⚠ Overdue</span>}
                  </div>
                </div>
              )}
            </section>

            {/* Submit New Complaint Form */}
            <section className={`rounded-xl p-8 shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={24} className="text-blue-600" />
                  <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Submit a New Complaint</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">Step {currentStep} of {totalSteps}</span>
                  <div className="flex gap-1">
                    {[...Array(totalSteps)].map((_, index) => (
                      <div key={index} className={`w-2 h-2 rounded-full ${index < currentStep ? "bg-blue-600" : "bg-slate-300"}`} />
                    ))}
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{submitError}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? "border-slate-600 bg-slate-700 text-white" : "border-gray-200 bg-gray-50 text-gray-700"}`}
                          value={formData.category}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                          required
                        >
                          <option value="">Select a category...</option>
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                          Operator / Company <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? "border-slate-600 bg-slate-700 text-white placeholder-slate-400" : "border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400"}`}
                          placeholder="e.g. Orange Botswana, BTC, Botswana Post"
                          value={formData.against_operator_name}
                          onChange={(e) => handleInputChange("against_operator_name", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? "border-slate-600 bg-slate-700 text-white placeholder-slate-400" : "border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400"}`}
                        placeholder="Brief summary of your complaint"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                        Detailed Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? "border-slate-600 bg-slate-700 text-white placeholder-slate-400" : "border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400"}`}
                        placeholder="Please describe the issue in detail, including dates and any prior communication with the provider..."
                        rows={5}
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>Priority</label>
                      <select
                        className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? "border-slate-600 bg-slate-700 text-white" : "border-gray-200 bg-gray-50 text-gray-700"}`}
                        value={formData.priority}
                        onChange={(e) => handleInputChange("priority", e.target.value)}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h4 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-slate-700"}`}>Upload Supporting Documents</h4>
                      <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Provide evidence to support your complaint (optional)</p>
                    </div>

                    <div>
                      <div className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors hover:border-blue-600 ${isDarkMode ? "border-slate-600" : "border-gray-200"}`}>
                        <UploadSimple size={40} className="mb-2 text-slate-400" />
                        <p className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                          Drag & drop files here, or <span className="text-blue-600 cursor-pointer">browse</span>
                        </p>
                        <p className="mt-1 text-xs text-slate-400">PDF, DOC, DOCX, JPG, PNG up to 50MB</p>
                        <input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                          Choose Files
                        </label>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className={`flex items-center justify-between rounded-lg border p-3 ${isDarkMode ? "border-slate-600 bg-slate-700" : "border-gray-200 bg-gray-50"}`}>
                              <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{file.name}</span>
                              <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 text-sm">✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Important Information */}
                <div className={`rounded-xl border-2 p-6 ${isDarkMode ? "bg-amber-900/30 border-amber-600 text-amber-200" : "bg-amber-50 border-amber-400 text-amber-900"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 ${isDarkMode ? "bg-amber-800" : "bg-amber-200"}`}>
                      <Warning size={20} className={isDarkMode ? "text-amber-300" : "text-amber-700"} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold mb-2 ${isDarkMode ? "text-amber-100" : "text-amber-900"}`}>Before Submitting</h4>
                      <div className={`space-y-2 text-sm ${isDarkMode ? "text-amber-200" : "text-amber-800"}`}>
                        <p>• Try to resolve the issue directly with your provider first.</p>
                        <p>• By submitting, you agree that BOCRA may share details with the relevant service provider.</p>
                        <p>• Keep copies of bills, contracts, and correspondence as evidence.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    className={`rounded-lg px-6 py-3 font-bold transition-colors ${currentStep === 1 ? "bg-slate-200 text-slate-400 cursor-not-allowed" : isDarkMode ? "bg-slate-600 text-white hover:bg-slate-500" : "bg-slate-600 text-white hover:bg-slate-700"}`}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>
                  {currentStep < totalSteps ? (
                    <button type="button" onClick={() => setCurrentStep(currentStep + 1)} className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-lg bg-green-600 px-8 py-3 font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting && <CircleNotch size={16} className="animate-spin" />}
                      {submitting ? "Submitting..." : "Submit Complaint"}
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* My Complaints */}
            <section className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
              <div className="mb-6 flex items-center justify-between">
                <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>My Complaints</h3>
                <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>{myComplaints.length} total</span>
              </div>

              {complaintsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <CircleNotch size={24} className="animate-spin text-blue-600" />
                </div>
              ) : myComplaints.length === 0 ? (
                <p className={`text-sm text-center py-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>No complaints filed yet.</p>
              ) : (
                <div className="space-y-3">
                  {myComplaints.map((complaint) => (
                    <button
                      key={complaint.id}
                      onClick={() => router.push(`/complaints/${complaint.id}`)}
                      className={`w-full flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${isDarkMode ? "border-slate-600 hover:bg-slate-700" : "border-gray-100 hover:bg-gray-50"}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{complaint.reference_number}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(complaint.status)}`}>
                            {complaint.status_display}
                          </span>
                          {complaint.is_overdue && <span className="text-[10px] font-bold text-red-600">OVERDUE</span>}
                        </div>
                        <p className={`text-sm truncate ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>{complaint.subject}</p>
                        <div className="flex gap-3 mt-1 text-xs text-slate-400">
                          <span>{complaint.category_display}</span>
                          <span>vs {complaint.against_operator_name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority_display}
                          </span>
                          <span>{timeAgo(complaint.created_at)}</span>
                        </div>
                      </div>
                      <CaretRight size={16} className={isDarkMode ? "text-slate-500" : "text-gray-400"} />
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-8">
            {/* Knowledge Center */}
            <section className="rounded-xl bg-blue-700 p-6 text-white">
              <h3 className="mb-4 text-xl font-bold">Knowledge Center</h3>
              <div className="space-y-4">
                <div className="group cursor-pointer rounded-lg bg-white/10 p-4 transition-colors hover:bg-white/20">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-amber-300" />
                    <h4 className="font-bold">Know Your Rights</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-blue-100">Understand what you are entitled to as a consumer under Botswana laws.</p>
                </div>
                <div className="group cursor-pointer rounded-lg bg-white/10 p-4 transition-colors hover:bg-white/20">
                  <div className="flex items-center gap-3">
                    <Ruler size={20} className="text-green-300" />
                    <h4 className="font-bold">Before You Lodge</h4>
                  </div>
                  <ul className="mt-2 space-y-2 text-xs text-blue-100">
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="text-amber-300 flex-shrink-0 mt-0.5" /><span>Contact provider customer support first.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="text-amber-300 flex-shrink-0 mt-0.5" /><span>Keep your reference number.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="text-amber-300 flex-shrink-0 mt-0.5" /><span>Allow 14 days for provider&apos;s resolution.</span></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact */}
            <div className="relative overflow-hidden rounded-xl bg-slate-900 p-6 text-white shadow-xl">
              <div className="relative z-10">
                <h4 className="text-lg font-bold">Need direct help?</h4>
                <p className="mt-1 text-sm text-slate-400">Our agents are online Mon-Fri.</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm"><Phone size={16} className="text-amber-300" /><span>Toll Free: 0800 600 000</span></div>
                  <div className="flex items-center gap-2 text-sm"><Envelope size={16} className="text-blue-300" /><span>consumers@bocra.org.bw</span></div>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-600/20 blur-2xl"></div>
              <div className="absolute left-1/2 -bottom-4 h-16 w-16 rounded-full bg-rose-600/10 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
