"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import HeaderSection from "@/components/HeaderSection";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { requestAudit } from "@/lib/api/clients/cybersecurity";
import type { AuditType } from "@/lib/api/types/cybersecurity";
import {
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Bug,
  FileSearch,
  Siren,
  HelpCircle,
} from "lucide-react";

const AUDIT_TYPE_OPTIONS: { value: AuditType; label: string; icon: typeof ShieldCheck; desc: string }[] = [
  { value: "VULNERABILITY_ASSESSMENT", label: "Vulnerability Assessment", icon: Bug, desc: "Identify security weaknesses" },
  { value: "PENETRATION_TEST", label: "Penetration Test", icon: ShieldCheck, desc: "Simulated cyberattack testing" },
  { value: "COMPLIANCE_AUDIT", label: "Compliance Audit", icon: FileSearch, desc: "Standards compliance evaluation" },
  { value: "INCIDENT_RESPONSE", label: "Incident Response", icon: Siren, desc: "Incident recovery assistance" },
  { value: "GENERAL", label: "General Inquiry", icon: HelpCircle, desc: "General cybersecurity consultation" },
];

export default function CybersecurityRequestPage() {
  const [form, setForm] = useState({
    requester_name: "",
    requester_email: "",
    requester_phone: "",
    organization: "",
    audit_type: "" as AuditType | "",
    description: "",
    preferred_date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.audit_type) {
      setError("Please select an audit type");
      return;
    }
    setError("");
    setIsSubmitting(true);

    const res = await requestAudit({
      requester_name: form.requester_name,
      requester_email: form.requester_email,
      requester_phone: form.requester_phone || undefined,
      organization: form.organization,
      audit_type: form.audit_type as AuditType,
      description: form.description,
      preferred_date: form.preferred_date || undefined,
    });

    if (res.success && res.data) {
      setReferenceNumber(res.data.reference_number);
      setSubmitted(true);
    } else {
      setError(res.message || "Failed to submit request. Please try again.");
    }
    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <main>
        <Navbar />
        <section className="min-h-screen flex flex-col justify-center items-center px-6 mt-20 md:mt-30">
          <div className="max-w-lg text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Request Submitted Successfully</h1>
            <p className="text-gray-600">
              Your cybersecurity audit request has been submitted. Our COMM-CIRT team
              will review your request and get back to you.
            </p>
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-700">Reference Number</p>
              <p className="text-xl font-bold text-green-800 font-mono">{referenceNumber}</p>
            </div>
            <p className="text-sm text-gray-500">
              Please save this reference number for your records.
              A confirmation email will be sent to your email address.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/cybersecurity"
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Cybersecurity
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="min-h-screen flex flex-col items-center px-6 mt-20 md:mt-30 pb-16">
        <div className="w-full max-w-2xl space-y-6">
          <div>
            <Link
              href="/cybersecurity"
              className="inline-flex items-center gap-1 text-sm text-[#0073ae] hover:underline mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cybersecurity
            </Link>
            <HeaderSection title="Request a Cybersecurity Audit" textSize="text-3xl" />
            <p className="mt-2 text-gray-600">
              Fill out the form below to request a cybersecurity audit from BOCRA&apos;s COMM-CIRT team.
              You do not need an account to submit a request.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <fieldset className="rounded-xl border p-5 space-y-4">
              <legend className="px-2 text-sm font-semibold text-gray-700">Contact Information</legend>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.requester_name}
                    onChange={(e) => handleChange("requester_name", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0073ae] focus:outline-none focus:ring-1 focus:ring-[#0073ae]"
                    placeholder="e.g. Thabo Molapo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.organization}
                    onChange={(e) => handleChange("organization", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0073ae] focus:outline-none focus:ring-1 focus:ring-[#0073ae]"
                    placeholder="e.g. Botswana Telecom"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.requester_email}
                    onChange={(e) => handleChange("requester_email", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0073ae] focus:outline-none focus:ring-1 focus:ring-[#0073ae]"
                    placeholder="email@company.co.bw"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.requester_phone}
                    onChange={(e) => handleChange("requester_phone", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0073ae] focus:outline-none focus:ring-1 focus:ring-[#0073ae]"
                    placeholder="+267 XXXX XXXX"
                  />
                </div>
              </div>
            </fieldset>

            {/* Audit Type */}
            <fieldset className="rounded-xl border p-5 space-y-4">
              <legend className="px-2 text-sm font-semibold text-gray-700">
                Audit Type <span className="text-red-500">*</span>
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {AUDIT_TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = form.audit_type === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChange("audit_type", opt.value)}
                      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                        selected
                          ? "border-[#0073ae] bg-[#0073ae]/5 ring-1 ring-[#0073ae]"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`h-5 w-5 mt-0.5 ${selected ? "text-[#0073ae]" : "text-gray-400"}`} />
                      <div>
                        <p className={`text-sm font-medium ${selected ? "text-[#0073ae]" : "text-gray-700"}`}>{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Details */}
            <fieldset className="rounded-xl border p-5 space-y-4">
              <legend className="px-2 text-sm font-semibold text-gray-700">Audit Details</legend>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0073ae] focus:outline-none focus:ring-1 focus:ring-[#0073ae]"
                  placeholder="Describe the systems/services to be audited and any specific concerns…"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Start Date
                </label>
                <input
                  type="date"
                  value={form.preferred_date}
                  onChange={(e) => handleChange("preferred_date", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0073ae] focus:outline-none focus:ring-1 focus:ring-[#0073ae]"
                />
              </div>
            </fieldset>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0073ae] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#005f8f] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Audit Request"
              )}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
