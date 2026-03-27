"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ClockIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import {
  getTenders,
  getTender,
  getTenderCategories,
  applyForTender,
} from "@/lib/api/clients/tenders";
import type {
  TenderListItem,
  TenderDetail,
} from "@/lib/api/types/tenders";
import { getTokens } from "@/lib/api/client";
import { config } from "@/lib/config";
import HeaderSection from "@/components/HeaderSection";

type View = "list" | "detail" | "apply" | "success";

export default function TendersPage() {
  const router = useRouter();
  const [tenders, setTenders] = useState<TenderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);

  // Detail + apply
  const [view, setView] = useState<View>("list");
  const [selectedTender, setSelectedTender] = useState<TenderDetail | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Apply form
  const [companyName, setCompanyName] = useState("");
  const [companyReg, setCompanyReg] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [proposalSummary, setProposalSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successRef, setSuccessRef] = useState("");

  useEffect(() => {
    getTenderCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number | boolean | undefined> = {};
    if (searchTerm) params.search = searchTerm;
    if (categoryFilter) params.category = categoryFilter;
    if (statusFilter) params.status = statusFilter;
    getTenders(params as never).then((res) => {
      if (res.success) setTenders(res.data);
      setLoading(false);
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  const handleViewDetail = async (id: string) => {
    setLoadingDetail(true);
    const res = await getTender(id);
    if (res.success) {
      setSelectedTender(res.data);
      setView("detail");
    }
    setLoadingDetail(false);
  };

  const resetForm = () => {
    setCompanyName("");
    setCompanyReg("");
    setContactPerson("");
    setContactEmail("");
    setContactPhone("");
    setProposalSummary("");
    setSubmitError("");
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTender) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await applyForTender({
        tender: selectedTender.id,
        company_name: companyName,
        company_registration: companyReg || undefined,
        contact_person: contactPerson,
        contact_email: contactEmail,
        contact_phone: contactPhone || undefined,
        proposal_summary: proposalSummary,
      });
      if (res.success) {
        setSuccessRef(res.data.reference_number);
        resetForm();
        setView("success");
      } else {
        const errors = res.errors;
        if (errors) {
          setSubmitError(Object.values(errors).flat().join(". "));
        } else {
          setSubmitError(res.message || "Submission failed.");
        }
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    OPEN: "bg-green-100 text-green-700",
    CLOSING_SOON: "bg-yellow-100 text-yellow-700",
    CLOSED: "bg-gray-200 text-gray-600",
    AWARDED: "bg-blue-100 text-blue-700",
  };

  // ── Success view ──
  if (view === "success") {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="max-w-lg w-full bg-green-50 border border-green-400 p-8 text-center space-y-4">
            <div className="text-green-600 text-5xl">&#10003;</div>
            <h1 className="text-2xl font-semibold text-green-800">
              Application Submitted
            </h1>
            <p className="text-gray-700">
              Your tender application has been submitted. Save your reference
              number.
            </p>
            <div className="bg-white border border-green-300 p-4">
              <p className="text-sm text-gray-500">Reference Number</p>
              <p className="text-2xl font-bold text-gray-900 tracking-wide">
                {successRef}
              </p>
            </div>
            <Button
              onClick={() => {
                setView("list");
                setSelectedTender(null);
                setSuccessRef("");
              }}
              className="bg-turquoise hover:bg-turquoise/90 text-white font-medium py-3 w-full"
            >
              Back to Tenders
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ── Apply form ──
  if (view === "apply" && selectedTender) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen px-6 mt-20 md:mt-30">
          <div className="max-w-4xl mx-auto space-y-5">
            <button
              onClick={() => setView("detail")}
              className="text-turquoise hover:underline text-sm flex items-center gap-1"
            >
              <ArrowLeftIcon size={16} /> Back to tender details
            </button>

            <div>
              <h1 className="text-3xl font-bold">
                Apply: {selectedTender.title}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Ref: {selectedTender.reference_number}
              </p>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-400 text-red-700 p-3">
                {submitError}
              </div>
            )}

            <form
              onSubmit={handleApply}
              className="bg-gray-50 border border-gray-300 rounded-md p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-2">
                  Company Details
                </h2>
              </div>

              <div>
                <label className="font-medium text-lg">
                  Company Name <span className="text-pink">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Company Name (Pty) Ltd"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium text-lg">
                  Registration Number
                </label>
                <Input
                  type="text"
                  placeholder="Company registration number"
                  value={companyReg}
                  onChange={(e) => setCompanyReg(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-2">
                  Contact Details
                </h2>
              </div>

              <div>
                <label className="font-medium text-lg">
                  Contact Person <span className="text-pink">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Full name"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium text-lg">
                  Email <span className="text-pink">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="email@company.co.bw"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium text-lg">Phone</label>
                <Input
                  type="tel"
                  placeholder="+26771234567"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-2">
                  Proposal
                </h2>
              </div>

              <div className="md:col-span-2">
                <label className="font-medium text-lg">
                  Proposal Summary <span className="text-pink">*</span>
                </label>
                <Textarea
                  placeholder="Provide a summary of your proposal / bid for this tender..."
                  className="border border-gray-300"
                  rows={6}
                  required
                  value={proposalSummary}
                  onChange={(e) => setProposalSummary(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-turquoise hover:bg-turquoise/90 text-white text-lg font-medium py-5 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ── Detail view ──
  if (view === "detail" && selectedTender) {
    const isOpen =
      selectedTender.status === "OPEN" ||
      selectedTender.status === "CLOSING_SOON";

    return (
      <main>
        <Navbar />
        <div className="min-h-screen px-6 mt-20 md:mt-30">
          <div className="max-w-4xl mx-auto space-y-5">
            <button
              onClick={() => {
                setView("list");
                setSelectedTender(null);
              }}
              className="text-turquoise hover:underline text-sm flex items-center gap-1"
            >
              <ArrowLeftIcon size={16} /> Back to Tenders
            </button>

            <div>
              <div className="flex gap-2 items-center mb-2">
                <span
                  className={`text-xs px-2 rounded-sm py-0.5 font-medium ${
                    statusColors[selectedTender.status] || "bg-gray-200"
                  }`}
                >
                  {selectedTender.status_display}
                </span>
                <span className="text-xs bg-gray-200 rounded-sm px-2 py-0.5 font-medium">
                  {selectedTender.category_display}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{selectedTender.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Ref: {selectedTender.reference_number}
              </p>
            </div>

            {/* Key dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedTender.opening_date && (
                <div className="border rounded-md border-gray-300 p-4 bg-gray-50">
                  <p className="text-md text-gray-900">Opening Date</p>
                  <p className="font-semibold">
                    {new Date(
                      selectedTender.opening_date
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
              {selectedTender.closing_date && (
                <div className="border rounded-md border-gray-300 p-4 bg-gray-50">
                  <p className="text-md text-gray-900">Closing Date</p>
                  <p className="font-semibold">
                    {new Date(
                      selectedTender.closing_date
                    ).toLocaleDateString()}
                  </p>
                  {selectedTender.days_until_closing !== null &&
                    selectedTender.days_until_closing > 0 && (
                      <p className="text-sm text-yellow-600 flex items-center gap-1 mt-1">
                        <ClockIcon size={14} />{" "}
                        {selectedTender.days_until_closing} days remaining
                      </p>
                    )}
                </div>
              )}
              {selectedTender.budget_range && (
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <p className="text-md text-gray-900">Budget Range</p>
                  <p className="font-semibold">
                    {selectedTender.budget_range}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-md border border-gray-300 p-4">
              <h2 className="text-2xl font-semibold mb-3">Description</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedTender.description}
              </div>
            </div>

            {/* Contact */}
            {(selectedTender.contact_name ||
              selectedTender.contact_email) && (
              <div className="border rounded-md bg-gray-50 border-gray-300 p-4">
                <h2 className="text-xl font-semibold mb-2">
                  Contact Information
                </h2>
                {selectedTender.contact_name && (
                  <p>{selectedTender.contact_name}</p>
                )}
                {selectedTender.contact_email && (
                  <p>
                    <a
                      href={`mailto:${selectedTender.contact_email}`}
                      className="text-turquoise hover:underline"
                    >
                      {selectedTender.contact_email}
                    </a>
                  </p>
                )}
                {selectedTender.contact_phone && (
                  <p>{selectedTender.contact_phone}</p>
                )}
              </div>
            )}

            {/* Documents */}
            {selectedTender.documents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Tender Documents
                </h2>
                <div className="space-y-2">
                  {selectedTender.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={`${config.apiUrl}/tenders/${selectedTender.id}/documents/${doc.id}/download/`}
                      className="flex items-center gap-2 p-3 border border-gray-300 hover:bg-gray-50"
                    >
                      <DownloadSimpleIcon
                        size={18}
                        className="text-turquoise"
                      />
                      {doc.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Addenda */}
            {selectedTender.addenda.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">Addenda</h2>
                <div className="space-y-3">
                  {selectedTender.addenda.map((add) => (
                    <div
                      key={add.id}
                      className="border border-gray-300 p-4 rounded-md bg-gray-50"
                    >
                      <h3 className="font-semibold">{add.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {add.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(add.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Award info */}
            {selectedTender.award && (
              <div className="bg-blue-50 rounded-md border border-blue-300 p-4">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">
                  Award Information
                </h2>
                <p>
                  <strong>Awarded to:</strong>{" "}
                  {selectedTender.award.awardee_name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    selectedTender.award.award_date
                  ).toLocaleDateString()}
                </p>
                {selectedTender.award.award_amount && (
                  <p>
                    <strong>Amount:</strong>{" "}
                    P {selectedTender.award.award_amount}
                  </p>
                )}
                {selectedTender.award.summary && (
                  <p className="mt-2 text-sm text-gray-700">
                    {selectedTender.award.summary}
                  </p>
                )}
              </div>
            )}

            {/* Apply button */}
            {isOpen && (
              <Button
                onClick={() => {
                  const { accessToken } = getTokens();
                  if (!accessToken) {
                    router.push(
                      `/login?redirect=${encodeURIComponent(`/tenders`)}&tenderId=${selectedTender.id}`
                    );
                    return;
                  }
                  resetForm();
                  setView("apply");
                }}
                className="w-full bg-turquoise hover:bg-turquoise/90 text-white text-lg font-medium py-5"
              >
                Apply for this Tender
              </Button>
            )}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ── List view ──
  return (
    <main>
      <Navbar />
      <div className="min-h-screen px-6 mt-20">
        <div className="space-y-5 w-full max-w-4xl mx-auto">
          <div className="flex flex-col justify-between gap-4">
            <HeaderSection title="Tenders"/>
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 rounded-md border border-gray-300 px-3 text-sm bg-white w-full"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-gray-300 px-3 text-sm bg-white w-full"
              >
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="CLOSING_SOON">Closing Soon</option>
                <option value="CLOSED">Closed</option>
                <option value="AWARDED">Awarded</option>
              </select>
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  className="h-10 md:min-w-72 text-lg border-gray-300 placeholder:text-gray-900 pl-10"
                  placeholder="Search tenders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-600">
              Loading tenders...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tenders.length > 0 ? (
                tenders.map((tender) => (
                  <div
                    key={tender.id}
                    className="p-4 flex flex-col rounded-md justify-between border border-gray-300 bg-gray-50 space-y-2"
                  >
                    <div>
                      <div className="flex gap-2 flex-wrap">
                        <span
                          className={`text-xs px-2 rounded-sm py-0.5 font-medium ${
                            statusColors[tender.status] || "bg-gray-200"
                          }`}
                        >
                          {tender.status_display}
                        </span>
                        <span className="text-xs bg-gray-200 rounded-sm px-2 py-0.5 font-medium">
                          {tender.category_display}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mt-2 line-clamp-2">
                        {tender.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Ref: {tender.reference_number}
                      </p>
                    </div>

                    <div className="text-sm text-gray-500 space-y-1">
                      {tender.closing_date && (
                        <p className="flex items-center gap-1">
                          <ClockIcon size={14} />
                          Closes:{" "}
                          {new Date(
                            tender.closing_date
                          ).toLocaleDateString()}
                          {tender.days_until_closing !== null &&
                            tender.days_until_closing > 0 &&
                            ` (${tender.days_until_closing}d left)`}
                        </p>
                      )}
                      {tender.budget_range && (
                        <p>Budget: {tender.budget_range}</p>
                      )}
                    </div>

                    <Button
                      onClick={() => handleViewDetail(tender.id)}
                      disabled={loadingDetail}
                      className="w-full bg-turquoise text-md hover:bg-turquoise/90 py-5 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-lg text-gray-600">
                    No tenders found.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
