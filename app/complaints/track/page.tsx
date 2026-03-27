"use client";

import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  MagnifyingGlass,
  CheckCircle,
  WarningCircle,
  Clock,
  CircleNotch,
} from "@phosphor-icons/react";
import { trackComplaint } from "@/lib/api/clients/complaints";
import type { ComplaintTrack } from "@/lib/api/types/complaints";

export default function TrackComplaintPage() {
  const { isDarkMode } = useTheme();

  const [referenceNumber, setReferenceNumber] = useState("");
  const [result, setResult] = useState<ComplaintTrack | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await trackComplaint(referenceNumber.trim());
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.message || "No complaint found with that reference number.");
      }
    } catch {
      setError("Failed to track complaint. Please try again.");
    }
    setLoading(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return <CheckCircle size={48} className="text-green-500" />;
      default:
        return <Clock size={48} className="text-blue-500" />;
    }
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-BW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Track Your Complaint</h1>
          <p className="text-blue-100 text-lg">Enter your complaint reference number to check the current status</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto -mt-8 px-4">
        <form onSubmit={handleTrack} className={`rounded-xl shadow-lg p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. CMP-2026-000001"
                className={`w-full rounded-lg border pl-12 pr-4 py-4 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? "border-slate-600 bg-slate-700 text-white placeholder-slate-400" : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"}`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-8 py-4 text-sm font-bold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <CircleNotch size={16} className="animate-spin" /> : <MagnifyingGlass size={16} />}
              Track
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className={`rounded-xl p-6 text-center ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}>
            <WarningCircle size={48} className="mx-auto text-red-400 mb-3" />
            <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>{error}</p>
          </div>
        )}

        {result && (
          <div className={`rounded-xl shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
            {/* Status Header */}
            <div className="p-6 text-center border-b border-gray-100">
              {getStatusIcon(result.status)}
              <h2 className={`text-xl font-bold mt-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{result.reference_number}</h2>
              <span className={`inline-block mt-2 rounded-full px-4 py-1 text-sm font-bold uppercase tracking-wider border ${getStatusColor(result.status)}`}>
                {result.status_display}
              </span>
              {result.is_overdue && (
                <p className="text-red-600 text-sm font-bold mt-2">⚠ This complaint is past its SLA deadline</p>
              )}
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Subject</span>
                  <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{result.subject}</p>
                </div>
                <div>
                  <span className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Category</span>
                  <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{result.category_display}</p>
                </div>
                <div>
                  <span className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Against</span>
                  <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{result.against_operator_name}</p>
                </div>
                <div>
                  <span className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Priority</span>
                  <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{result.priority_display}</p>
                </div>
                <div>
                  <span className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Filed On</span>
                  <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{formatDate(result.created_at)}</p>
                </div>
                {result.resolved_at && (
                  <div>
                    <span className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Resolved On</span>
                    <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{formatDate(result.resolved_at)}</p>
                  </div>
                )}
                {result.sla_deadline && (
                  <div>
                    <span className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>SLA Deadline</span>
                    <p className={`font-medium ${result.is_overdue ? "text-red-600" : isDarkMode ? "text-white" : "text-gray-900"}`}>{formatDate(result.sla_deadline)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
