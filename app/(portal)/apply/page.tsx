"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { getLicenceTypes, createApplication } from "@/lib/api/clients/licensing";
import {
  getDomainZones,
  checkDomainAvailability,
  createDomainApplication,
} from "@/lib/api/clients/domains";
import type { LicenceType } from "@/lib/api/types/licensing";
import type { DomainZone, DomainAvailability } from "@/lib/api/types/domains";
import {
  MagnifyingGlass,
  CheckCircle,
  Globe,
  IdentificationCard,
  ArrowLeft,
  Spinner,
  Warning,
  FileText,
} from "@phosphor-icons/react";

// ── Inner component (needs useSearchParams → must be inside Suspense) ──────────

function ApplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode } = useTheme();

  // ?type=domain pre-filters to domain-applicable licence types
  const filterType = searchParams.get("type");

  const [searchTerm, setSearchTerm] = useState("");
  const [licenceTypes, setLicenceTypes] = useState<LicenceType[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState<LicenceType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successRef, setSuccessRef] = useState("");
  const [successIsDomain, setSuccessIsDomain] = useState(false);

  // ── Licensing form fields ──
  const [orgName, setOrgName] = useState("");
  const [orgReg, setOrgReg] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [description, setDescription] = useState("");

  // ── Domain-specific fields ──
  const [domainName, setDomainName] = useState("");
  const [zones, setZones] = useState<DomainZone[]>([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [registrantName, setRegistrantName] = useState("");
  const [registrantEmail, setRegistrantEmail] = useState("");
  const [registrantPhone, setRegistrantPhone] = useState("");
  const [registrantAddress, setRegistrantAddress] = useState("");
  const [nameserver1, setNameserver1] = useState("");
  const [nameserver2, setNameserver2] = useState("");
  const [regPeriod, setRegPeriod] = useState("1");
  const [justification, setJustification] = useState("");
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [domainAvailability, setDomainAvailability] = useState<DomainAvailability | null>(null);

  useEffect(() => {
    getLicenceTypes().then((res) => {
      if (res.success) setLicenceTypes(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedType?.is_domain_applicable) {
      getDomainZones().then((res) => {
        if (res.success) setZones(res.data);
      });
    }
  }, [selectedType]);

  const displayedTypes = licenceTypes.filter((lt) => {
    if (filterType === "domain" && !lt.is_domain_applicable) return false;
    if (searchTerm && !lt.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const resetForm = () => {
    setOrgName(""); setOrgReg(""); setContactPerson(""); setContactEmail("");
    setContactPhone(""); setDescription(""); setDomainName(""); setSelectedZone("");
    setRegistrantName(""); setRegistrantEmail(""); setRegistrantPhone("");
    setRegistrantAddress(""); setNameserver1(""); setNameserver2("");
    setRegPeriod("1"); setJustification(""); setDomainAvailability(null); setSubmitError("");
  };

  const handleCheckDomain = async () => {
    if (!domainName.trim()) return;
    setCheckingDomain(true);
    setDomainAvailability(null);
    try {
      const res = await checkDomainAvailability(domainName.trim().toLowerCase());
      if (res.success) {
        setDomainAvailability(res.data);
        if (res.data.zone) setSelectedZone(res.data.zone.id);
      }
    } catch { /* silently fail */ }
    finally { setCheckingDomain(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      if (selectedType.is_domain_applicable) {
        const res = await createDomainApplication({
          domain_name: domainName.trim().toLowerCase(),
          zone: selectedZone,
          registration_period_years: parseInt(regPeriod) || 1,
          organisation_name: orgName,
          organisation_registration_number: orgReg || undefined,
          registrant_name: registrantName,
          registrant_email: registrantEmail,
          registrant_phone: registrantPhone || undefined,
          registrant_address: registrantAddress || undefined,
          nameserver_1: nameserver1 || undefined,
          nameserver_2: nameserver2 || undefined,
          justification: justification || undefined,
          submit: true,
        });
        if (res.success) {
          setSuccessIsDomain(true);
          setSuccessRef(res.data.reference_number);
          resetForm();
        } else {
          const errors = res.errors;
          setSubmitError(errors ? Object.values(errors).flat().join(". ") : res.message || "Submission failed.");
        }
      } else {
        const res = await createApplication({
          licence_type: selectedType.id,
          organisation_name: orgName,
          organisation_registration: orgReg || undefined,
          contact_person: contactPerson,
          contact_email: contactEmail,
          contact_phone: contactPhone || undefined,
          description,
          submit: true,
        });
        if (res.success) {
          setSuccessIsDomain(false);
          setSuccessRef(res.data.reference_number);
          resetForm();
        } else {
          const errors = res.errors;
          setSubmitError(errors ? Object.values(errors).flat().join(". ") : res.message || "Submission failed.");
        }
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardClass = `rounded-2xl p-6 shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`;
  const labelClass = `block text-sm font-medium mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`;

  // ── Success view ──────────────────────────────────────────────────────────────
  if (successRef) {
    return (
      <div className="flex-1 pb-24 md:pb-0">
        <PortalHeader />
        <div className="pt-24 md:pt-0 p-4 md:p-8">
          <div className={`max-w-lg mx-auto mt-8 text-center ${cardClass}`}>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} weight="fill" className="text-green-600" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Application Submitted!
            </h2>
            <p className={`mb-6 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Your {successIsDomain ? "domain registration" : "licence"} application has been submitted for review.
              Track its progress in My Applications.
            </p>
            <div className={`rounded-xl p-4 mb-6 ${isDarkMode ? "bg-slate-700" : "bg-green-50 border border-green-200"}`}>
              <p className={`text-xs mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Reference Number</p>
              <p className={`text-2xl font-bold tracking-widest ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {successRef}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/applications")}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                View My Applications
              </button>
              <button
                onClick={() => { setSuccessRef(""); setSelectedType(null); }}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  isDarkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Application form view ─────────────────────────────────────────────────────
  if (selectedType) {
    const isDomain = selectedType.is_domain_applicable;
    const submitDisabled = submitting || (isDomain && domainAvailability !== null && !domainAvailability.available);

    return (
      <div className="flex-1 pb-24 md:pb-0">
        <PortalHeader />
        <div className={`pt-24 md:pt-0 p-4 md:p-8 min-h-screen ${isDarkMode ? "" : "bg-gray-50"}`}>
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Back */}
            <button
              onClick={() => { setSelectedType(null); resetForm(); }}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ArrowLeft size={16} /> Back to application types
            </button>

            {/* Type header card */}
            <div className={cardClass}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {isDomain
                    ? <Globe size={22} className="text-blue-600" />
                    : <IdentificationCard size={22} className="text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {selectedType.name}
                  </h2>
                  <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {selectedType.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-blue-50 text-blue-700"}`}>
                      Fee: {selectedType.fee_currency} {selectedType.fee_amount}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                      Validity: {selectedType.validity_period_months} months
                    </span>
                    {selectedType.sector_name && (
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                        {selectedType.sector_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {submitError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                <Warning size={18} weight="fill" className="flex-shrink-0 mt-0.5" />
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Domain Details */}
              {isDomain && (
                <div className={cardClass}>
                  <h3 className={`font-bold text-base mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Domain Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>
                        Domain Name <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="mycompany.co.bw"
                          required
                          value={domainName}
                          onChange={(e) => { setDomainName(e.target.value); setDomainAvailability(null); }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleCheckDomain}
                          disabled={checkingDomain || !domainName.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 whitespace-nowrap"
                        >
                          {checkingDomain
                            ? <><Spinner size={14} className="animate-spin mr-1.5 inline" />Checking…</>
                            : "Check Availability"}
                        </Button>
                      </div>
                      {domainAvailability && (
                        <div className={`mt-2 p-3 text-sm font-medium rounded-lg border ${
                          domainAvailability.available
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-red-50 text-red-700 border-red-300"
                        }`}>
                          {domainAvailability.available ? "✓" : "✗"} {domainAvailability.message}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>
                          Zone <span className="text-red-500">*</span>
                        </label>
                        <Combobox value={selectedZone} onValueChange={(v) => setSelectedZone(v || "")}>
                          <ComboboxInput placeholder="Select zone..." showClear required />
                          <ComboboxContent>
                            <ComboboxList>
                              {zones.map((z) => (
                                <ComboboxItem key={z.id} value={z.id}>
                                  {z.name} ({z.fee_currency} {z.registration_fee}/yr)
                                </ComboboxItem>
                              ))}
                              <ComboboxEmpty>No zones found</ComboboxEmpty>
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </div>
                      <div>
                        <label className={labelClass}>Registration Period (years)</label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={regPeriod}
                          onChange={(e) => setRegPeriod(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Organisation Details */}
              <div className={cardClass}>
                <h3 className={`font-bold text-base mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Organisation Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Organisation Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Company Name (Pty) Ltd"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Registration Number</label>
                    <Input
                      type="text"
                      placeholder="CIPA registration number"
                      value={orgReg}
                      onChange={(e) => setOrgReg(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Contact / Registrant Details */}
              <div className={cardClass}>
                <h3 className={`font-bold text-base mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {isDomain ? "Registrant Details" : "Contact Details"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      {isDomain ? "Registrant Name" : "Contact Person"} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Full name"
                      required
                      value={isDomain ? registrantName : contactPerson}
                      onChange={(e) => isDomain ? setRegistrantName(e.target.value) : setContactPerson(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      required
                      value={isDomain ? registrantEmail : contactEmail}
                      onChange={(e) => isDomain ? setRegistrantEmail(e.target.value) : setContactEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <Input
                      type="tel"
                      placeholder="+26771234567"
                      value={isDomain ? registrantPhone : contactPhone}
                      onChange={(e) => isDomain ? setRegistrantPhone(e.target.value) : setContactPhone(e.target.value)}
                    />
                  </div>
                  {isDomain && (
                    <div>
                      <label className={labelClass}>Address</label>
                      <Input
                        type="text"
                        placeholder="Physical address"
                        value={registrantAddress}
                        onChange={(e) => setRegistrantAddress(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Details (domain only) */}
              {isDomain && (
                <div className={cardClass}>
                  <h3 className={`font-bold text-base mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Technical Details{" "}
                    <span className={`text-xs font-normal ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                      (optional)
                    </span>
                  </h3>
                  <p className={`text-xs mb-4 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    Leave blank to use BOCRA&apos;s default nameservers.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Primary Nameserver</label>
                      <Input
                        type="text"
                        placeholder="ns1.example.co.bw"
                        value={nameserver1}
                        onChange={(e) => setNameserver1(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Secondary Nameserver</label>
                      <Input
                        type="text"
                        placeholder="ns2.example.co.bw"
                        value={nameserver2}
                        onChange={(e) => setNameserver2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Description / Justification */}
              <div className={cardClass}>
                <h3 className={`font-bold text-base mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {isDomain ? "Justification" : "Description"}
                </h3>
                <Textarea
                  placeholder={
                    isDomain
                      ? "Describe why you need this domain and how it will be used…"
                      : "Describe your business activities and why you require this licence…"
                  }
                  required={!isDomain}
                  value={isDomain ? justification : description}
                  onChange={(e) => isDomain ? setJustification(e.target.value) : setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitDisabled}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl disabled:opacity-50"
              >
                {submitting
                  ? <><Spinner size={18} className="animate-spin mr-2 inline" />Submitting…</>
                  : "Submit Application"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Type selection grid ───────────────────────────────────────────────────────
  const pageTitle = filterType === "domain" ? "Register a Domain" : "Apply for a Licence";
  const pageSubtitle = filterType === "domain"
    ? "Select the domain type to begin your registration"
    : "Select the licence type you wish to apply for";

  return (
    <div className="flex-1 pb-24 md:pb-0">
      <PortalHeader />
      <div className={`pt-24 md:pt-0 p-4 md:p-8 min-h-screen space-y-6 ${isDarkMode ? "" : "bg-gray-50"}`}>
        {/* Page header */}
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            {pageTitle}
          </h1>
          <p className={`mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{pageSubtitle}</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search application types…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size={32} className="animate-spin text-blue-600" />
          </div>
        ) : displayedTypes.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={48} className="mx-auto mb-4 text-slate-300" />
            <p className={`font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              No application types found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTypes.map((lt) => (
              <button
                key={lt.id}
                onClick={() => setSelectedType(lt)}
                className={`text-left p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all group ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 hover:border-blue-500"
                    : "bg-white border-slate-200 hover:border-blue-300"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                  {lt.is_domain_applicable
                    ? <Globe size={20} className="text-blue-600" />
                    : <IdentificationCard size={20} className="text-blue-600" />}
                </div>
                <h3 className={`font-bold text-sm mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {lt.name}
                </h3>
                <p className={`text-xs line-clamp-2 mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {lt.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                    {lt.fee_currency} {lt.fee_amount}
                  </span>
                  {lt.sector_name && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? "bg-blue-900/40 text-blue-300" : "bg-blue-50 text-blue-600"}`}>
                      {lt.sector_name}
                    </span>
                  )}
                  {lt.is_domain_applicable && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? "bg-teal-900/40 text-teal-300" : "bg-teal-50 text-teal-600"}`}>
                      Domain
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page export wrapped in Suspense for useSearchParams ───────────────────────

export default function PortalApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <Spinner size={32} className="animate-spin text-blue-600" />
        </div>
      }
    >
      <ApplyContent />
    </Suspense>
  );
}
