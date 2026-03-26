"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitComplaint, trackComplaint } from "@/lib/api/clients/complaints";
import type { ComplaintCreateRequest } from "@/lib/api/types/complaints";
import type { ComplaintTrack } from "@/lib/api/types/complaints";

const CATEGORIES = [
  { value: "SERVICE_QUALITY", label: "Service Quality" },
  { value: "BILLING", label: "Billing Dispute" },
  { value: "COVERAGE", label: "Network Coverage" },
  { value: "CONDUCT", label: "Operator Conduct" },
  { value: "INTERNET", label: "Internet Services" },
  { value: "BROADCASTING", label: "Broadcasting" },
  { value: "POSTAL", label: "Postal Services" },
  { value: "OTHER", label: "Other" },
];

const PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

const OPERATORS = [
  "Mascom",
  "Orange",
  "Botswana Telecommunications Corporation",
  "Jenny Internet",
  "Paratus",
  "Starlink",
  "Other",
];

export default function Complaints() {
  const searchParams = useSearchParams();
  const trackSectionRef = useRef<HTMLDivElement>(null);

  // ── File a Complaint state ──
  const [formData, setFormData] = useState({
    complainant_name: "",
    complainant_email: "",
    complainant_phone: "",
    subject: "",
    description: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  // ── Track a Complaint state ──
  const [trackRef, setTrackRef] = useState("");
  const [tracking, setTracking] = useState(false);
  const [trackError, setTrackError] = useState("");
  const [trackResult, setTrackResult] = useState<ComplaintTrack | null>(null);

  // Scroll to track section if #track hash
  useEffect(() => {
    if (window.location.hash === "#track" && trackSectionRef.current) {
      trackSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const payload: ComplaintCreateRequest = {
      complainant_name: formData.complainant_name,
      complainant_email: formData.complainant_email,
      complainant_phone: formData.complainant_phone || undefined,
      against_operator_name: selectedOperator,
      category: selectedCategory as ComplaintCreateRequest["category"],
      subject: formData.subject,
      description: formData.description,
      priority: selectedPriority as ComplaintCreateRequest["priority"] || undefined,
    };

    try {
      const res = await submitComplaint(payload);
      if (res.success) {
        setReferenceNumber(res.data.reference_number);
        // Reset form
        setFormData({
          complainant_name: "",
          complainant_email: "",
          complainant_phone: "",
          subject: "",
          description: "",
        });
        setSelectedCategory("");
        setSelectedPriority("");
        setSelectedOperator("");
      } else {
        const errors = res.errors;
        if (errors) {
          const messages = Object.values(errors).flat().join(". ");
          setSubmitError(messages || res.message);
        } else {
          setSubmitError(res.message || "Failed to submit complaint.");
        }
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackRef.trim()) return;
    setTracking(true);
    setTrackError("");
    setTrackResult(null);

    try {
      const res = await trackComplaint(trackRef.trim());
      if (res.success) {
        setTrackResult(res.data);
      } else {
        setTrackError(res.message || "Complaint not found.");
      }
    } catch {
      setTrackError("Network error. Please try again.");
    } finally {
      setTracking(false);
    }
  };

  // ── Success view after filing ──
  if (referenceNumber) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="max-w-lg w-full bg-green-50 border border-green-400 p-8 text-center space-y-4">
            <div className="text-green-600 text-5xl">&#10003;</div>
            <h1 className="text-2xl font-semibold text-green-800">
              Complaint Submitted Successfully
            </h1>
            <p className="text-gray-700">
              Your complaint has been received. Please save your reference number to track its progress.
            </p>
            <div className="bg-white border border-green-300 p-4">
              <p className="text-sm text-gray-500">Reference Number</p>
              <p className="text-2xl font-bold text-gray-900 tracking-wide">
                {referenceNumber}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <Button
                onClick={() => {
                  setTrackRef(referenceNumber);
                  setReferenceNumber("");
                  setTimeout(() => {
                    trackSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="bg-turquoise hover:bg-turquoise/90 text-white font-medium py-3"
              >
                Track This Complaint
              </Button>
              <Button
                variant="outline"
                onClick={() => setReferenceNumber("")}
                className="font-medium py-3"
              >
                File Another Complaint
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen md:justify-center md:items-center flex flex-col px-6">
        {/* ── File a Complaint ── */}
        <div className="flex flex-col space-y-4 mt-20 md:mt-30">
          <h1 className="text-3xl font-semibold">File a Complaint</h1>
          <p className="text-gray-600 max-w-2xl">
            Submit your complaint against a telecommunications service provider. All fields marked with <span className="text-pink">*</span> are required.
          </p>

          {submitError && (
            <div className="bg-red-50 border border-red-400 text-red-700 p-3 max-w-4xl">
              {submitError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-gray-50 border border-gray-400 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl"
          >
            <div>
              <label htmlFor="name" className="font-medium text-lg">
                Enter name <span className="text-pink">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Kitso Thebe..."
                autoComplete="name"
                required
                value={formData.complainant_name}
                onChange={(e) =>
                  handleInputChange("complainant_name", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor="email" className="font-medium text-lg">
                Enter email address <span className="text-pink">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                autoComplete="email"
                required
                value={formData.complainant_email}
                onChange={(e) =>
                  handleInputChange("complainant_email", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="font-medium text-lg">
                Enter phone number
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+26771234567"
                autoComplete="tel"
                value={formData.complainant_phone}
                onChange={(e) =>
                  handleInputChange("complainant_phone", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor="operatorAgainst" className="font-medium text-lg">
                Select service provider <span className="text-pink">*</span>
              </label>
              <Combobox
                value={selectedOperator}
                onValueChange={(v) => setSelectedOperator(v || "")}
              >
                <ComboboxInput
                  placeholder="Select operator..."
                  showClear={true}
                  required
                />
                <ComboboxContent>
                  <ComboboxList>
                    {OPERATORS.map((operator) => (
                      <ComboboxItem
                        key={operator}
                        value={operator}
                        className="hover:bg-turquoise hover:text-white"
                      >
                        {operator}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
            <div>
              <label htmlFor="category" className="font-medium text-lg">
                Select category <span className="text-pink">*</span>
              </label>
              <Combobox
                value={selectedCategory}
                onValueChange={(v) => setSelectedCategory(v || "")}
              >
                <ComboboxInput
                  placeholder="Select a category..."
                  showClear={true}
                  required
                />
                <ComboboxContent>
                  <ComboboxList>
                    {CATEGORIES.map((cat) => (
                      <ComboboxItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </ComboboxItem>
                    ))}
                    <ComboboxEmpty>No category found</ComboboxEmpty>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
            <div>
              <label htmlFor="priority" className="font-medium text-lg">
                Select priority <span className="text-pink">*</span>
              </label>
              <Combobox
                value={selectedPriority}
                onValueChange={(v) => setSelectedPriority(v || "")}
              >
                <ComboboxInput
                  placeholder="Select priority..."
                  showClear={true}
                  required
                />
                <ComboboxContent>
                  <ComboboxList>
                    {PRIORITIES.map((p) => (
                      <ComboboxItem key={p.value} value={p.value}>
                        {p.label}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="subject" className="font-medium text-lg">
                Subject <span className="text-pink">*</span>
              </label>
              <Input
                id="subject"
                type="text"
                placeholder="Brief description of your complaint..."
                required
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="font-medium text-lg">
                Detailed description <span className="text-pink">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information about your complaint..."
                className="border border-gray-400"
                rows={6}
                required
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full hover:bg-turquoise/90 hover:cursor-pointer bg-turquoise text-white text-lg font-medium py-5 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </Button>
            </div>
          </form>
        </div>

        {/* ── Track a Complaint ── */}
        <div ref={trackSectionRef} className="flex flex-col space-y-4 mt-16 mb-16 max-w-4xl w-full" id="track">
          <h2 className="text-3xl font-semibold">Track a Complaint</h2>
          <p className="text-gray-600">
            Enter your complaint reference number (e.g. CMP-2026-000001) to check its current status.
          </p>

          <form onSubmit={handleTrack} className="flex gap-3 items-end">
            <div className="flex-1">
              <label htmlFor="trackRef" className="font-medium text-lg">
                Reference Number
              </label>
              <Input
                id="trackRef"
                type="text"
                placeholder="CMP-2026-000001"
                required
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={tracking}
              className="bg-turquoise hover:bg-turquoise/90 text-white font-medium py-5 px-8 disabled:opacity-50"
            >
              {tracking ? "Searching..." : "Track"}
            </Button>
          </form>

          {trackError && (
            <div className="bg-red-50 border border-red-400 text-red-700 p-3">
              {trackError}
            </div>
          )}

          {trackResult && (
            <div className="bg-gray-50 border border-gray-400 p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Reference Number</p>
                  <p className="text-xl font-bold">{trackResult.reference_number}</p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium ${
                    trackResult.status === "RESOLVED" || trackResult.status === "CLOSED"
                      ? "bg-green-100 text-green-800"
                      : trackResult.is_overdue
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {trackResult.status_display}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-300">
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{trackResult.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service Provider</p>
                  <p className="font-medium">{trackResult.against_operator_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{trackResult.category_display}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <span
                    className={`px-2 py-1 text-xs font-medium ${
                      trackResult.priority === "HIGH" || trackResult.priority === "URGENT"
                        ? "bg-pink text-white"
                        : trackResult.priority === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {trackResult.priority_display}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium">
                    {new Date(trackResult.created_at).toLocaleDateString("en-BW", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">SLA Deadline</p>
                  <p className={`font-medium ${trackResult.is_overdue ? "text-red-600" : ""}`}>
                    {trackResult.sla_deadline
                      ? new Date(trackResult.sla_deadline).toLocaleDateString("en-BW", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                    {trackResult.is_overdue && " (Overdue)"}
                  </p>
                </div>
                {trackResult.resolved_at && (
                  <div>
                    <p className="text-sm text-gray-500">Resolved</p>
                    <p className="font-medium">
                      {new Date(trackResult.resolved_at).toLocaleDateString("en-BW", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
