"use client";

import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
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
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { getLicenceTypes } from "@/lib/api/clients/licensing";
import { createApplication } from "@/lib/api/clients/licensing";
import {
  getDomainZones,
  checkDomainAvailability,
  createDomainApplication,
} from "@/lib/api/clients/domains";
import type { LicenceType } from "@/lib/api/types/licensing";
import type { DomainZone, DomainAvailability } from "@/lib/api/types/domains";
import HeaderSection from "@/components/HeaderSection";

export default function ApplyForLicensePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [licenceTypes, setLicenceTypes] = useState<LicenceType[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Selected licence & form state ──
  const [selectedType, setSelectedType] = useState<LicenceType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successRef, setSuccessRef] = useState("");

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

  // ── Domain availability check ──
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [domainAvailability, setDomainAvailability] =
    useState<DomainAvailability | null>(null);

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

  const filteredLicenses = licenceTypes.filter((lt) =>
    lt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setOrgName("");
    setOrgReg("");
    setContactPerson("");
    setContactEmail("");
    setContactPhone("");
    setDescription("");
    setDomainName("");
    setSelectedZone("");
    setRegistrantName("");
    setRegistrantEmail("");
    setRegistrantPhone("");
    setRegistrantAddress("");
    setNameserver1("");
    setNameserver2("");
    setRegPeriod("1");
    setJustification("");
    setDomainAvailability(null);
    setSubmitError("");
  };

  const handleCheckDomain = async () => {
    if (!domainName.trim()) return;
    setCheckingDomain(true);
    setDomainAvailability(null);
    try {
      const res = await checkDomainAvailability(domainName.trim().toLowerCase());
      if (res.success) {
        setDomainAvailability(res.data);
        // Auto-select zone from result
        if (res.data.zone) {
          setSelectedZone(res.data.zone.id);
        }
      }
    } catch {
      // Silently fail — user can still proceed
    } finally {
      setCheckingDomain(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      if (selectedType.is_domain_applicable) {
        // Domain application
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
          setSuccessRef(res.data.reference_number);
          resetForm();
        } else {
          const errors = res.errors;
          if (errors) {
            setSubmitError(Object.values(errors).flat().join(". "));
          } else {
            setSubmitError(res.message || "Submission failed.");
          }
        }
      } else {
        // Regular licensing application
        const res = await createApplication({
          licence_type: selectedType.id,
          organisation_name: orgName,
          organisation_registration: orgReg || undefined,
          contact_person: contactPerson,
          contact_email: contactEmail,
          contact_phone: contactPhone || undefined,
          description: description,
          submit: true,
        });
        if (res.success) {
          setSuccessRef(res.data.reference_number);
          resetForm();
        } else {
          const errors = res.errors;
          if (errors) {
            setSubmitError(Object.values(errors).flat().join(". "));
          } else {
            setSubmitError(res.message || "Submission failed.");
          }
        }
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success view ──
  if (successRef) {
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
              Your application has been submitted for review. Save your reference number to track progress.
            </p>
            <div className="bg-white border border-green-300 p-4">
              <p className="text-sm text-gray-500">Reference Number</p>
              <p className="text-2xl font-bold text-gray-900 tracking-wide">
                {successRef}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <Button
                onClick={() => {
                  setSuccessRef("");
                  setSelectedType(null);
                }}
                className="bg-turquoise hover:bg-turquoise/90 text-white font-medium py-3"
              >
                Apply for Another Licence
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ── Application form view ──
  if (selectedType) {
    const isDomain = selectedType.is_domain_applicable;

    return (
      <main>
        <Navbar />
        <div className="min-h-screen px-6 mt-20 md:mt-30 mb-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <button
                onClick={() => {
                  setSelectedType(null);
                  resetForm();
                }}
                className="text-turquoise hover:underline text-sm mb-2"
              >
                &larr; Back to all licences
              </button>
              <h1 className="text-3xl font-bold">{selectedType.name}</h1>
              <p className="text-gray-600 mt-1">{selectedType.description}</p>
              <div className="flex gap-4 mt-3 text-sm text-gray-500">
                <span>
                  Fee: {selectedType.fee_currency} {selectedType.fee_amount}
                </span>
                <span>
                  Validity: {selectedType.validity_period_months} months
                </span>
                {selectedType.sector_name && (
                  <span>Sector: {selectedType.sector_name}</span>
                )}
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-400 text-red-700 p-3">
                {submitError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-gray-50 border border-gray-400 p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* ── Domain-specific fields ── */}
              {isDomain && (
                <>
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-2">
                      Domain Details
                    </h2>
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-medium text-lg">
                      Domain Name <span className="text-pink">*</span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="mycompany.co.bw"
                        required
                        value={domainName}
                        onChange={(e) => {
                          setDomainName(e.target.value);
                          setDomainAvailability(null);
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleCheckDomain}
                        disabled={checkingDomain || !domainName.trim()}
                        className="bg-turquoise hover:bg-turquoise/90 text-white disabled:opacity-50"
                      >
                        {checkingDomain ? "Checking..." : "Check Availability"}
                      </Button>
                    </div>
                    {domainAvailability && (
                      <div
                        className={`mt-2 p-3 text-sm font-medium ${
                          domainAvailability.available
                            ? "bg-green-50 text-green-700 border border-green-300"
                            : "bg-red-50 text-red-700 border border-red-300"
                        }`}
                      >
                        {domainAvailability.available ? "\u2713" : "\u2717"}{" "}
                        {domainAvailability.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-medium text-lg">
                      Zone <span className="text-pink">*</span>
                    </label>
                    <Combobox
                      value={selectedZone}
                      onValueChange={(v) => setSelectedZone(v || "")}
                    >
                      <ComboboxInput
                        placeholder="Select zone..."
                        showClear={true}
                        required
                      />
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
                    <label className="font-medium text-lg">
                      Registration Period (years)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={regPeriod}
                      onChange={(e) => setRegPeriod(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* ── Organisation details ── */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-2">
                  Organisation Details
                </h2>
              </div>

              <div>
                <label className="font-medium text-lg">
                  Organisation Name <span className="text-pink">*</span>
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
                <label className="font-medium text-lg">
                  Registration Number
                </label>
                <Input
                  type="text"
                  placeholder="CIPA registration number"
                  value={orgReg}
                  onChange={(e) => setOrgReg(e.target.value)}
                />
              </div>

              {/* ── Contact / Registrant details ── */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-2">
                  {isDomain ? "Registrant Details" : "Contact Details"}
                </h2>
              </div>

              <div>
                <label className="font-medium text-lg">
                  {isDomain ? "Registrant Name" : "Contact Person"}{" "}
                  <span className="text-pink">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Full name"
                  required
                  value={isDomain ? registrantName : contactPerson}
                  onChange={(e) =>
                    isDomain
                      ? setRegistrantName(e.target.value)
                      : setContactPerson(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="font-medium text-lg">
                  Email <span className="text-pink">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={isDomain ? registrantEmail : contactEmail}
                  onChange={(e) =>
                    isDomain
                      ? setRegistrantEmail(e.target.value)
                      : setContactEmail(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="font-medium text-lg">Phone</label>
                <Input
                  type="tel"
                  placeholder="+26771234567"
                  value={isDomain ? registrantPhone : contactPhone}
                  onChange={(e) =>
                    isDomain
                      ? setRegistrantPhone(e.target.value)
                      : setContactPhone(e.target.value)
                  }
                />
              </div>

              {isDomain && (
                <div>
                  <label className="font-medium text-lg">Address</label>
                  <Input
                    type="text"
                    placeholder="Physical address"
                    value={registrantAddress}
                    onChange={(e) => setRegistrantAddress(e.target.value)}
                  />
                </div>
              )}

              {/* ── Domain technical details ── */}
              {isDomain && (
                <>
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-2">
                      Technical Details (Optional)
                    </h2>
                  </div>
                  <div>
                    <label className="font-medium text-lg">Nameserver 1</label>
                    <Input
                      type="text"
                      placeholder="ns1.example.co.bw"
                      value={nameserver1}
                      onChange={(e) => setNameserver1(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="font-medium text-lg">Nameserver 2</label>
                    <Input
                      type="text"
                      placeholder="ns2.example.co.bw"
                      value={nameserver2}
                      onChange={(e) => setNameserver2(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* ── Description / Justification ── */}
              <div className="md:col-span-2">
                <label className="font-medium text-lg">
                  {isDomain ? "Justification" : "Description"}{" "}
                  {!isDomain && <span className="text-pink">*</span>}
                </label>
                <Textarea
                  placeholder={
                    isDomain
                      ? "Why do you need this domain?"
                      : "Describe your business and purpose of the licence application..."
                  }
                  className="border border-gray-400"
                  rows={4}
                  required={!isDomain}
                  value={isDomain ? justification : description}
                  onChange={(e) =>
                    isDomain
                      ? setJustification(e.target.value)
                      : setDescription(e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  disabled={
                    submitting ||
                    (isDomain &&
                      domainAvailability !== null &&
                      !domainAvailability.available)
                  }
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

  // ── Licence types grid ──
  return (
    <main>
      <Navbar />
      <div className="min-h-screen px-6 mt-20 flex items-center justify-center">
        <div className="space-y-5 w-full max-w-4xl">
          <div className="flex flex-col gap-4">
            <HeaderSection title="License" pinkText="Portal" textSize="text-3xl" />
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                className="h-10 md:min-w-md max-w-md text-lg placeholder:text-gray-900 pl-10 w-full"
                placeholder="Search licenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-600">
              Loading licence types...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLicenses.length > 0 ? (
                filteredLicenses.map((lt) => (
                  <div
                    key={lt.id}
                    className="p-4 flex flex-col rounded-md justify-between border border-gray-300 bg-gray-50 space-y-2"
                  >
                    <div>
                      <h3 className="text-xl font-bold">{lt.name}</h3>
                      {lt.sector_name && (
                        <span className="text-xs bg-gray-200 px-2 py-0.5 inline-block mt-1">
                          {lt.sector_name}
                        </span>
                      )}
                      {lt.is_domain_applicable && (
                        <span className="text-xs bg-turquoise/20 text-turquoise px-2 py-0.5 inline-block mt-1 ml-1">
                          Domain
                        </span>
                      )}
                    </div>
                    <p className="text-md leading-relaxed line-clamp-3">
                      {lt.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      Fee: {lt.fee_currency} {lt.fee_amount}
                    </div>
                    <button
                      onClick={() => setSelectedType(lt)}
                      className="py-1 bg-turquoise rounded-md text-white text-md w-full cursor-pointer hover:bg-turquoise/90"
                    >
                      Apply
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-lg text-gray-600">
                    No licenses found matching &quot;{searchTerm}&quot;
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
