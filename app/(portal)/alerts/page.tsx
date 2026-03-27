"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import {
  getAlertCategories,
  getMySubscriptions,
  updateSubscription,
  deleteSubscription,
  subscribe,
} from "@/lib/api/clients/alerts";
import type { AlertCategory, AlertSubscription } from "@/lib/api/types/alerts";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bell,
  CheckCircle,
  Warning,
  ShieldCheck,
  Trash,
  FloppyDisk,
  ArrowClockwise,
  Spinner,
} from "@phosphor-icons/react";

export default function AlertsPage() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const [categories, setCategories] = useState<AlertCategory[]>([]);
  const [subscriptions, setSubscriptions] = useState<AlertSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selected categories for editing
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [operatorFilter, setOperatorFilter] = useState("");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, subRes] = await Promise.all([
        getAlertCategories(),
        getMySubscriptions(),
      ]);

      if (catRes.success && catRes.data) {
        const cats = Array.isArray(catRes.data) ? catRes.data : [];
        setCategories(cats.filter((c) => c.is_active && c.is_public));
      }

      if (subRes.success && subRes.data) {
        const subs = Array.isArray(subRes.data) ? subRes.data : [];
        setSubscriptions(subs);
        if (subs.length > 0) {
          setHasSubscription(true);
          const first = subs[0];
          setSelectedCodes(new Set(first.categories.map((c) => c.code)));
          setOperatorFilter(first.operator_filter || "");
        }
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleCategory = (code: string) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    const codes = Array.from(selectedCodes);

    if (hasSubscription) {
      const res = await updateSubscription({
        categories: codes,
        operator_filter: operatorFilter || undefined,
      });
      if (res.success) {
        setSuccessMsg("Alert preferences updated successfully.");
        fetchData();
      } else {
        setErrorMsg(res.message || "Failed to update preferences.");
      }
    } else {
      const res = await subscribe({
        email: user?.email || "",
        categories: codes,
        operator_filter: operatorFilter || undefined,
      });
      if (res.success) {
        setSuccessMsg("Subscribed successfully! Check your email to confirm.");
        setHasSubscription(true);
        fetchData();
      } else {
        setErrorMsg(res.message || "Failed to subscribe.");
      }
    }
    setSaving(false);
  };

  const handleUnsubscribe = async () => {
    if (!confirm("Are you sure you want to unsubscribe from all alerts?")) return;
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    const res = await deleteSubscription();
    if (res.success) {
      setSuccessMsg("Unsubscribed from all alerts.");
      setHasSubscription(false);
      setSelectedCodes(new Set());
      setOperatorFilter("");
      setSubscriptions([]);
    } else {
      setErrorMsg(res.message || "Failed to unsubscribe.");
    }
    setSaving(false);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>
      <PortalHeader title="Alert Preferences" subtitle="Manage your alert subscriptions" />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size={32} className="animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current subscription status */}
            <div
              className={`rounded-xl border p-5 ${
                hasSubscription
                  ? isDarkMode
                    ? "border-green-700 bg-green-900/20"
                    : "border-green-200 bg-green-50"
                  : isDarkMode
                  ? "border-slate-700 bg-slate-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {hasSubscription ? (
                  <CheckCircle size={24} weight="fill" className="text-green-500" />
                ) : (
                  <Bell size={24} className={isDarkMode ? "text-slate-400" : "text-gray-400"} />
                )}
                <div>
                  <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {hasSubscription ? "You are subscribed to alerts" : "No active subscription"}
                  </p>
                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                    {hasSubscription
                      ? `Subscribed to ${subscriptions[0]?.categories.length || 0} categories`
                      : "Select categories below and subscribe to receive email alerts"}
                  </p>
                </div>
              </div>
            </div>

            {/* Categories selection */}
            <div
              className={`rounded-xl border p-5 ${
                isDarkMode ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"
              }`}
            >
              <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Alert Categories
              </h2>
              <p className={`text-sm mb-4 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                Choose the types of alerts you want to receive via email.
              </p>

              {categories.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>
                  No alert categories available at this time.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCodes.has(cat.code);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.code)}
                        className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                          isSelected
                            ? isDarkMode
                              ? "border-blue-500 bg-blue-900/20 ring-1 ring-blue-500"
                              : "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : isDarkMode
                            ? "border-slate-600 hover:border-slate-500 hover:bg-slate-700"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border ${
                            isSelected
                              ? "border-blue-500 bg-blue-500"
                              : isDarkMode
                              ? "border-slate-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle size={14} weight="bold" className="text-white" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isSelected
                                ? "text-blue-600"
                                : isDarkMode
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          >
                            {cat.name}
                          </p>
                          {cat.description && (
                            <p
                              className={`text-xs mt-0.5 ${
                                isDarkMode ? "text-slate-400" : "text-gray-500"
                              }`}
                            >
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Operator filter */}
            <div
              className={`rounded-xl border p-5 ${
                isDarkMode ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"
              }`}
            >
              <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Operator Filter (Optional)
              </h2>
              <p className={`text-sm mb-3 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                Only receive alerts related to a specific operator. Leave blank for all operators.
              </p>
              <input
                type="text"
                value={operatorFilter}
                onChange={(e) => setOperatorFilter(e.target.value)}
                placeholder="e.g. Mascom, BTC, Orange…"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isDarkMode
                    ? "border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>

            {/* Messages */}
            {successMsg && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={saving || selectedCodes.size === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Spinner size={16} className="animate-spin" />
                ) : (
                  <FloppyDisk size={16} weight="bold" />
                )}
                {hasSubscription ? "Update Preferences" : "Subscribe"}
              </button>

              {hasSubscription && (
                <button
                  onClick={handleUnsubscribe}
                  disabled={saving}
                  className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                    isDarkMode
                      ? "border-red-700 text-red-400 hover:bg-red-900/20"
                      : "border-red-200 text-red-600 hover:bg-red-50"
                  }`}
                >
                  <Trash size={16} />
                  Unsubscribe
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
