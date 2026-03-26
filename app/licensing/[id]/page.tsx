"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getLicenceType } from "@/lib/api/clients/licensing";
import type { LicenceTypeDetail } from "@/lib/api/types/licensing";
import {
  ArrowLeftIcon,
  SpinnerIcon,
  CheckCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

export default function LicenceTypeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [licenceType, setLicenceType] = useState<LicenceTypeDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await getLicenceType(id);
        if (res.success) {
          setLicenceType(res.data);
        } else {
          setError(res.message || "Licence type not found");
        }
      } catch {
        setError("Failed to load licence type details");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-4xl mt-30 space-y-8">
          <Link
            href="/licensing"
            className="inline-flex items-center gap-2 text-turquoise hover:underline text-sm"
          >
            <ArrowLeftIcon size={16} />
            Back to Licensing
          </Link>

          {loading && (
            <div className="flex justify-center py-20">
              <SpinnerIcon className="animate-spin text-turquoise" size={40} />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              {error}
            </div>
          )}

          {!loading && !error && licenceType && (
            <>
              <div className="space-y-2">
                <p className="text-sm text-turquoise font-medium uppercase tracking-wide">
                  {licenceType.sector_name}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {licenceType.name}
                </h1>
                <p className="text-gray-600">{licenceType.description}</p>
              </div>

              {/* Fee summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Application Fee</p>
                  <p className="text-xl font-bold text-turquoise">
                    {licenceType.fee_currency} {licenceType.fee_amount}
                  </p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Annual Fee</p>
                  <p className="text-xl font-bold text-turquoise">
                    {licenceType.fee_currency} {licenceType.annual_fee}
                  </p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Validity</p>
                  <p className="text-xl font-bold text-turquoise">
                    {licenceType.validity_period_months} months
                  </p>
                </div>
              </div>

              {licenceType.is_domain_applicable && (
                <div className="bg-pink/5 border border-pink/30 rounded-lg p-4 flex items-start gap-3">
                  <WarningCircleIcon
                    size={24}
                    className="text-pink mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-pink">
                      Domain Registration Required
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      This licence requires a .bw domain name. You will need to
                      provide and verify your domain during the application
                      process.
                    </p>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {licenceType.requirements && (
                <section className="space-y-3">
                  <h2 className="text-xl font-semibold border-b pb-2">
                    Requirements
                  </h2>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                    {licenceType.requirements}
                  </div>
                </section>
              )}

              {/* Eligibility */}
              {licenceType.eligibility_criteria && (
                <section className="space-y-3">
                  <h2 className="text-xl font-semibold border-b pb-2">
                    Eligibility Criteria
                  </h2>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                    {licenceType.eligibility_criteria}
                  </div>
                </section>
              )}

              {/* Required Documents */}
              {licenceType.required_documents &&
                licenceType.required_documents.length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-xl font-semibold border-b pb-2">
                      Required Documents
                    </h2>
                    <ul className="space-y-2">
                      {licenceType.required_documents.map((doc, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircleIcon
                            size={18}
                            className={
                              doc.required
                                ? "text-pink shrink-0"
                                : "text-gray-400 shrink-0"
                            }
                          />
                          <span>
                            {doc.name}
                            {doc.required && (
                              <span className="text-pink ml-1 text-xs font-medium">
                                (Required)
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

              {/* Apply button */}
              <div className="pt-4 pb-8">
                <Link
                  href={`/licensing/apply?type=${licenceType.id}`}
                  className="inline-block px-8 py-3 bg-turquoise text-white rounded font-medium hover:bg-turquoise/80 transition-colors"
                >
                  Apply for this Licence
                </Link>
              </div>
            </>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}
