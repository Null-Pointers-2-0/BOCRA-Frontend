"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  submitComplaint,
  trackComplaint,
  getCategories,
} from "@/lib/api/clients/complaints";
import type { ComplaintCategoryOption, ComplaintTrack, ComplaintCreateRequest } from "@/lib/api/types/complaints";
import type { ComplaintCategory } from "@/lib/api/types/common";
import {
  Spinner as SpinnerIcon,
  PaperPlaneTilt as PaperPlaneTiltIcon,
  MagnifyingGlass as MagnifyingGlassIcon,
  CheckCircle as CheckCircleIcon,
  WarningCircle as WarningCircleIcon,
  ClipboardText as ClipboardTextIcon,
  Clock as ClockIcon,
  Shield as ShieldIcon,
  Copy as CopyIcon,
} from "@phosphor-icons/react";

type Tab = "submit" | "track";

const OPERATORS = [
  { value: "Mascom", label: "Mascom Wireless" },
  { value: "Orange", label: "Orange Botswana" },
  { value: "beMobile", label: "beMobile (BTCL)" },
];

export default function ComplaintsPage() {
  const [tab, setTab] = useState<Tab>("submit");

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-3xl mt-30 space-y-8 pb-16">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">Complaints</h1>
            <p className="text-gray-600 max-w-3xl">
              Submit a complaint about a telecommunications service provider or track
              the status of an existing complaint using your reference number.
            </p>
          </div>

          <div className="flex items-center gap-1 border-b border-gray-200">
            {([
              { key: "submit" as const, label: "Submit Complaint", icon: <PaperPlaneTiltIcon size={16} /> },
              { key: "track" as const, label: "Track Complaint", icon: <MagnifyingGlassIcon size={16} /> },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  tab === t.key
                    ? "border-[#0073ae] text-[#0073ae]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {tab === "submit" && <SubmitForm />}
          {tab === "track" && <TrackForm />}
        </div>
        <Footer />
      </main>
    </>
  );
}

/* ── Submit Form ── */
function SubmitForm() {
  const [categories, setCategories] = useState<ComplaintCategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ reference: string; subject: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState({
    complainant_name: "",
    complainant_email: "",
    complainant_phone: "",
    against_operator_name: "",
    category: "" as string,
    subject: "",
    description: "",
  });

  useEffect(() => {
    setCategoriesLoading(true);
    getCategories()
      .then((res) => {
        if (res.success) setCategories(res.data);
      })
      .catch(() => {})
      .finally(() => setCategoriesLoading(false));
  }, []);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!form.complainant_name || !form.complainant_email || !form.against_operator_name || !form.category || !form.subject || !form.description) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: ComplaintCreateRequest = {
        complainant_name: form.complainant_name,
        complainant_email: form.complainant_email,
        complainant_phone: form.complainant_phone || undefined,
        against_operator_name: form.against_operator_name,
        category: form.category as ComplaintCategory,
        subject: form.subject,
        description: form.description,
      };

      const res = await submitComplaint(payload);

      if (res.success) {
        setSuccess({
          reference: res.data.reference_number,
          subject: res.data.subject,
        });
        setForm({
          complainant_name: "",
          complainant_email: "",
          complainant_phone: "",
          against_operator_name: "",
          category: "",
          subject: "",
          description: "",
        });
      } else {
        if (res.errors) {
          setFieldErrors(res.errors);
        }
        setError(res.message || "Failed to submit complaint. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-4">
        <CheckCircleIcon size={48} className="text-emerald-600 mx-auto" weight="fill" />
        <h3 className="text-xl font-bold text-emerald-800">Complaint Submitted!</h3>
        <p className="text-emerald-700">
          Your complaint about &ldquo;{success.subject}&rdquo; has been submitted successfully.
        </p>
        <div className="bg-white rounded-lg border border-emerald-200 p-4 inline-block">
          <p className="text-sm text-gray-600 mb-1">Reference Number</p>
          <div className="flex items-center gap-2 justify-center">
            <span className="text-2xl font-mono font-bold text-[#0073ae]">
              {success.reference}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(success.reference)}
              className="p-1 hover:bg-gray-100 rounded cursor-pointer"
              title="Copy"
            >
              <CopyIcon size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
        <p className="text-sm text-emerald-600">
          Save this reference number to track your complaint&apos;s progress.
        </p>
        <button
          onClick={() => setSuccess(null)}
          className="px-6 py-2 bg-[#0073ae] text-white rounded-lg font-medium hover:bg-[#005c8a] transition-colors cursor-pointer"
        >
          Submit Another Complaint
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <WarningCircleIcon size={20} className="flex-shrink-0 mt-0.5" weight="fill" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
        <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Full Name"
            required
            error={fieldErrors.complainant_name}
          >
            <input
              type="text"
              value={form.complainant_name}
              onChange={(e) => updateField("complainant_name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
              placeholder="e.g. John Doe"
            />
          </Field>

          <Field
            label="Email Address"
            required
            error={fieldErrors.complainant_email}
          >
            <input
              type="email"
              value={form.complainant_email}
              onChange={(e) => updateField("complainant_email", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
              placeholder="e.g. john@example.com"
            />
          </Field>
        </div>

        <Field
          label="Phone Number"
          hint="Botswana format: +267XXXXXXXX or 7XXXXXXX"
          error={fieldErrors.complainant_phone}
        >
          <input
            type="tel"
            value={form.complainant_phone}
            onChange={(e) => updateField("complainant_phone", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
            placeholder="e.g. +26771234567"
          />
        </Field>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
        <h3 className="text-lg font-semibold text-gray-900">Complaint Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Operator"
            required
            error={fieldErrors.against_operator_name}
          >
            <select
              value={form.against_operator_name}
              onChange={(e) => updateField("against_operator_name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
            >
              <option value="">Select operator...</option>
              {OPERATORS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Category"
            required
            error={fieldErrors.category}
          >
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading ? "Loading..." : "Select category..."}
              </option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label="Subject"
          required
          error={fieldErrors.subject}
        >
          <input
            type="text"
            value={form.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
            placeholder="Brief summary of your complaint"
          />
        </Field>

        <Field
          label="Description"
          required
          error={fieldErrors.description}
        >
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none resize-none"
            placeholder="Provide details about your complaint including dates, locations, and any relevant information..."
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0073ae] text-white rounded-lg font-medium hover:bg-[#005c8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? (
          <>
            <SpinnerIcon className="animate-spin" size={18} />
            Submitting...
          </>
        ) : (
          <>
            <PaperPlaneTiltIcon size={18} weight="fill" />
            Submit Complaint
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {error && error.length > 0 && (
        <p className="text-xs text-red-600">{error.join(", ")}</p>
      )}
    </div>
  );
}

/* ── Track Form ── */
function TrackForm() {
  const [reference, setReference] = useState("");
  const [tracking, setTracking] = useState(false);
  const [result, setResult] = useState<ComplaintTrack | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTrack(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reference.trim()) return;

    setTracking(true);
    setError(null);
    setResult(null);

    try {
      const res = await trackComplaint(reference.trim());
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.message || "Complaint not found. Please check your reference number.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setTracking(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleTrack} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MagnifyingGlassIcon size={20} />
          Track Your Complaint
        </h3>
        <p className="text-sm text-gray-500">
          Enter the reference number you received when you submitted your complaint.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
            placeholder="e.g. CMP-20250101-ABCD"
          />
          <button
            type="submit"
            disabled={tracking || !reference.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0073ae] text-white rounded-lg font-medium hover:bg-[#005c8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {tracking ? (
              <SpinnerIcon className="animate-spin" size={18} />
            ) : (
              <MagnifyingGlassIcon size={18} />
            )}
            Track
          </button>
        </div>
      </form>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <WarningCircleIcon size={20} className="flex-shrink-0 mt-0.5" weight="fill" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {result && <TrackResult result={result} />}
    </div>
  );
}

function TrackResult({ result }: { result: ComplaintTrack }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    SUBMITTED: { bg: "bg-blue-50", text: "text-blue-700" },
    ASSIGNED: { bg: "bg-indigo-50", text: "text-indigo-700" },
    INVESTIGATING: { bg: "bg-amber-50", text: "text-amber-700" },
    AWAITING_RESPONSE: { bg: "bg-orange-50", text: "text-orange-700" },
    RESOLVED: { bg: "bg-emerald-50", text: "text-emerald-700" },
    CLOSED: { bg: "bg-gray-100", text: "text-gray-700" },
    REOPENED: { bg: "bg-red-50", text: "text-red-700" },
  };

  const sc = statusColors[result.status] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 font-mono">{result.reference_number}</p>
            <h3 className="text-lg font-bold text-gray-900 mt-1">{result.subject}</h3>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
            <ShieldIcon size={12} weight="fill" />
            {result.status_display}
          </span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TrackField icon={<ClipboardTextIcon size={16} className="text-gray-400" />} label="Category" value={result.category_display} />
        <TrackField icon={<ShieldIcon size={16} className="text-gray-400" />} label="Against" value={result.against_operator_name} />
        <TrackField icon={<ClockIcon size={16} className="text-gray-400" />} label="Submitted" value={new Date(result.created_at).toLocaleDateString("en-BW", { year: "numeric", month: "long", day: "numeric" })} />
        <TrackField
          icon={<ClockIcon size={16} className="text-gray-400" />}
          label="Priority"
          value={result.priority_display}
        />
        {result.sla_deadline && (
          <TrackField
            icon={<ClockIcon size={16} className="text-gray-400" />}
            label="SLA Deadline"
            value={new Date(result.sla_deadline).toLocaleDateString("en-BW", { year: "numeric", month: "long", day: "numeric" })}
          />
        )}
        {result.resolved_at && (
          <TrackField
            icon={<CheckCircleIcon size={16} className="text-emerald-500" weight="fill" />}
            label="Resolved"
            value={new Date(result.resolved_at).toLocaleDateString("en-BW", { year: "numeric", month: "long", day: "numeric" })}
          />
        )}
      </div>

      {result.is_overdue && (
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
            <WarningCircleIcon size={16} weight="fill" />
            This complaint has exceeded the SLA deadline.
          </div>
        </div>
      )}
    </div>
  );
}

function TrackField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
