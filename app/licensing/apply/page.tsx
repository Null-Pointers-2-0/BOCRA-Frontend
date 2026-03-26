"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getLicenceType } from "@/lib/api/clients/licensing";
import { createApplication } from "@/lib/api/clients/licensing";
import { checkDomainAvailability } from "@/lib/api/clients/domains";
import type { LicenceTypeDetail } from "@/lib/api/types/licensing";
import type { DomainAvailability } from "@/lib/api/types/domains";
import {
  ArrowLeftIcon,
  SpinnerIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

function ApplyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeId = searchParams.get("type");

  const [licenceType, setLicenceType] = useState<LicenceTypeDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form fields
  const [orgName, setOrgName] = useState("");
  const [orgRegistration, setOrgRegistration] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [description, setDescription] = useState("");

  // Domain fields (for domain-applicable licences)
  const [domainName, setDomainName] = useState("");
  const [domainCheck, setDomainCheck] = useState<DomainAvailability | null>(
    null
  );
  const [domainChecking, setDomainChecking] = useState(false);

  useEffect(() => {
    if (!typeId) {
      setError("No licence type specified");
      setLoading(false);
      return;
    }
    async function fetchType() {
      try {
        const res = await getLicenceType(typeId!);
        if (res.success) {
          setLicenceType(res.data);
        } else {
          setError(res.message || "Licence type not found");
        }
      } catch {
        setError("Failed to load licence type");
      } finally {
        setLoading(false);
      }
    }
    fetchType();
  }, [typeId]);

  async function handleDomainCheck() {
    if (!domainName.trim()) return;
    setDomainChecking(true);
    setDomainCheck(null);
    try {
      const res = await checkDomainAvailability(domainName.trim());
      if (res.success) {
        setDomainCheck(res.data);
      }
    } catch {
      // silently fail
    } finally {
      setDomainChecking(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!licenceType) return;

    // Validate domain for domain-applicable licences
    if (licenceType.is_domain_applicable) {
      if (!domainName.trim()) {
        setError("Please enter a domain name for this licence type");
        return;
      }
      if (!domainCheck || !domainCheck.available) {
        setError(
          "Please check domain availability — the domain must be available"
        );
        return;
      }
    }

    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const desc = licenceType.is_domain_applicable
        ? `${description}\n\n[Domain: ${domainName.trim()}]`
        : description;

      const res = await createApplication({
        licence_type: licenceType.id,
        organisation_name: orgName,
        organisation_registration: orgRegistration || undefined,
        contact_person: contactPerson,
        contact_email: contactEmail,
        contact_phone: contactPhone || undefined,
        description: desc,
        submit: true,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Failed to submit application");
        if (res.errors) {
          setFieldErrors(res.errors as Record<string, string[]>);
        }
      }
    } catch {
      setError("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <SpinnerIcon className="animate-spin text-turquoise" size={40} />
      </div>
    );
  }

  if (!licenceType) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error || "Licence type not found"}
        </div>
        <Link href="/licensing" className="text-turquoise hover:underline">
          Back to Licensing
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center space-y-3">
          <CheckCircleIcon size={48} className="text-green-600 mx-auto" />
          <h2 className="text-2xl font-bold text-green-800">
            Application Submitted
          </h2>
          <p className="text-green-700">
            Your application for{" "}
            <strong>{licenceType.name}</strong> has been submitted
            successfully. You will receive a confirmation email at{" "}
            <strong>{contactEmail}</strong>.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            href="/licensing"
            className="px-6 py-2 border border-turquoise text-turquoise rounded hover:bg-turquoise/5 transition-colors"
          >
            Back to Licensing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm text-turquoise font-medium uppercase tracking-wide">
          {licenceType.sector_name}
        </p>
        <h1 className="text-3xl font-bold">
          Apply for {licenceType.name}
        </h1>
        <p className="text-gray-600 text-sm">
          Application Fee: {licenceType.fee_currency} {licenceType.fee_amount}
          {" | "}
          Validity: {licenceType.validity_period_months} months
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organisation Details */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold border-b pb-2 w-full">
            Organisation Details
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Organisation Name <span className="text-pink">*</span>
              </label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise"
              />
              {fieldErrors.organisation_name && (
                <p className="text-pink text-xs">
                  {fieldErrors.organisation_name[0]}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                value={orgRegistration}
                onChange={(e) => setOrgRegistration(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise"
              />
            </div>
          </div>
        </fieldset>

        {/* Contact Details */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold border-b pb-2 w-full">
            Contact Details
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Contact Person <span className="text-pink">*</span>
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise"
              />
              {fieldErrors.contact_person && (
                <p className="text-pink text-xs">
                  {fieldErrors.contact_person[0]}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-pink">*</span>
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise"
              />
              {fieldErrors.contact_email && (
                <p className="text-pink text-xs">
                  {fieldErrors.contact_email[0]}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise"
              />
            </div>
          </div>
        </fieldset>

        {/* Domain section for domain-applicable licences */}
        {licenceType.is_domain_applicable && (
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold border-b pb-2 w-full">
              Domain Registration
            </legend>
            <p className="text-sm text-gray-600">
              This licence requires a .bw domain name. Enter your desired domain
              and check availability before submitting.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={domainName}
                onChange={(e) => {
                  setDomainName(e.target.value);
                  setDomainCheck(null);
                }}
                placeholder="e.g. mybusiness.co.bw"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise"
              />
              <button
                type="button"
                onClick={handleDomainCheck}
                disabled={domainChecking || !domainName.trim()}
                className="px-4 py-2 bg-turquoise text-white text-sm rounded hover:bg-turquoise/80 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {domainChecking ? "Checking..." : "Check"}
              </button>
            </div>

            {domainCheck && (
              <div
                className={`flex items-center gap-2 p-3 rounded text-sm ${
                  domainCheck.available
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {domainCheck.available ? (
                  <>
                    <CheckCircleIcon size={20} className="shrink-0" />
                    <span>
                      <strong>{domainCheck.domain_name}</strong> is available
                    </span>
                  </>
                ) : (
                  <>
                    <XCircleIcon size={20} className="shrink-0" />
                    <span>
                      <strong>{domainCheck.domain_name}</strong> is already
                      registered. Please choose a different domain.
                    </span>
                  </>
                )}
              </div>
            )}
          </fieldset>
        )}

        {/* Description */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold border-b pb-2 w-full">
            Application Details
          </legend>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description/Justification <span className="text-pink">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your organisation's activities and reason for applying..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise resize-y"
            />
            {fieldErrors.description && (
              <p className="text-pink text-xs">
                {fieldErrors.description[0]}
              </p>
            )}
          </div>
        </fieldset>

        {/* Required Documents notice */}
        {licenceType.required_documents &&
          licenceType.required_documents.length > 0 && (
            <div className="bg-gold/10 border border-gold/40 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-sm">
                Documents Required After Submission
              </p>
              <p className="text-xs text-gray-600">
                The following documents will be requested after your initial
                application is reviewed:
              </p>
              <ul className="text-xs text-gray-700 space-y-1">
                {licenceType.required_documents.map((doc, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span className={doc.required ? "text-pink" : ""}>
                      {doc.required ? "*" : "-"}
                    </span>
                    {doc.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-turquoise text-white rounded font-medium hover:bg-turquoise/80 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
          <Link
            href={`/licensing/${licenceType.id}`}
            className="text-sm text-gray-500 hover:text-turquoise"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-3xl mt-30 space-y-8">
          <Link
            href="/licensing"
            className="inline-flex items-center gap-2 text-turquoise hover:underline text-sm"
          >
            <ArrowLeftIcon size={16} />
            Back to Licensing
          </Link>

          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <SpinnerIcon
                  className="animate-spin text-turquoise"
                  size={40}
                />
              </div>
            }
          >
            <ApplyForm />
          </Suspense>
        </div>
        <Footer />
      </main>
    </>
  );
}
