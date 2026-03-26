"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getLicenceSectors } from "@/lib/api/clients/licensing";
import type { LicenceSectorDetail } from "@/lib/api/types/licensing";
import {
  SpinnerIcon,
  CertificateIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

export default function LicensingPage() {
  const [sectors, setSectors] = useState<LicenceSectorDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSectors() {
      setLoading(true);
      setError(null);
      try {
        // Fetch all sectors — the list endpoint returns basic info,
        // but we need licence_types nested so we fetch each sector detail
        const listRes = await getLicenceSectors();
        if (!listRes.success) {
          setError(listRes.message || "Failed to load sectors");
          return;
        }

        const { getLicenceSector } = await import(
          "@/lib/api/clients/licensing"
        );
        const details = await Promise.all(
          listRes.data.map((s) => getLicenceSector(s.id))
        );
        setSectors(
          details
            .filter((r) => r.success)
            .map((r) => r.data)
            .sort((a, b) => a.sort_order - b.sort_order)
        );
      } catch {
        setError("Failed to load licensing information");
      } finally {
        setLoading(false);
      }
    }
    fetchSectors();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-6xl mt-30 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CertificateIcon size={36} className="text-turquoise" />
              <h1 className="text-3xl md:text-4xl font-bold">Licensing</h1>
            </div>
            <p className="text-gray-600 max-w-3xl">
              BOCRA issues licences for telecommunications, broadcasting,
              postal, and internet services in Botswana. Browse available licence
              types below and apply online.
            </p>
          </div>

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

          {!loading && !error && sectors.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No licence types available at the moment.
            </div>
          )}

          {!loading &&
            !error &&
            sectors.map((sector) => (
              <section key={sector.id} className="space-y-4">
                <div className="border-b-2 border-turquoise pb-2">
                  <h2 className="text-2xl font-semibold">{sector.name}</h2>
                  {sector.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {sector.description}
                    </p>
                  )}
                </div>

                {sector.licence_types.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">
                    No licence types in this sector yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sector.licence_types
                      .filter((lt) => lt.is_active)
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((lt) => (
                        <Link
                          key={lt.id}
                          href={`/licensing/${lt.id}`}
                          className="border rounded-lg p-5 bg-white hover:shadow-lg transition-shadow group flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold group-hover:text-turquoise transition-colors">
                              {lt.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {lt.description}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm">
                              <span className="font-semibold text-turquoise">
                                {lt.fee_currency} {lt.fee_amount}
                              </span>
                              <span className="text-gray-400">
                                {" "}
                                / {lt.validity_period_months} months
                              </span>
                            </div>
                            <CaretRightIcon
                              size={18}
                              className="text-gray-400 group-hover:text-turquoise transition-colors"
                            />
                          </div>
                          {lt.is_domain_applicable && (
                            <span className="mt-2 inline-block text-xs bg-pink/10 text-pink px-2 py-0.5 rounded font-medium">
                              Requires Domain Registration
                            </span>
                          )}
                        </Link>
                      ))}
                  </div>
                )}
              </section>
            ))}

          <section className="bg-gray-50 border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Verify a Licence</h2>
            <p className="text-sm text-gray-600">
              Enter a licence number to verify its authenticity and status.
            </p>
            <LicenceVerifyForm />
          </section>
        </div>
        <Footer />
      </main>
    </>
  );
}

function LicenceVerifyForm() {
  const [licenceNumber, setLicenceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    data?: {
      licence_number: string;
      licence_type_name: string;
      organisation_name: string;
      issued_date: string;
      expiry_date: string;
      status_display: string;
      is_expired: boolean;
    };
    message?: string;
  } | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!licenceNumber.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { verifyLicence } = await import("@/lib/api/clients/licensing");
      const res = await verifyLicence(licenceNumber.trim());
      if (res.success) {
        setResult({ found: true, data: res.data });
      } else {
        setResult({ found: false, message: res.message || "Licence not found" });
      }
    } catch {
      setResult({ found: false, message: "Failed to verify licence" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleVerify} className="flex gap-3">
        <input
          type="text"
          value={licenceNumber}
          onChange={(e) => setLicenceNumber(e.target.value)}
          placeholder="e.g. LIC-ISP-2026-000001"
          className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise"
        />
        <button
          type="submit"
          disabled={loading || !licenceNumber.trim()}
          className="px-6 py-2 bg-turquoise text-white rounded text-sm font-medium hover:bg-turquoise/80 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {result && (
        <div
          className={`border rounded p-4 ${
            result.found
              ? "border-green-300 bg-green-50"
              : "border-red-300 bg-red-50"
          }`}
        >
          {result.found && result.data ? (
            <div className="space-y-2">
              <p className="font-semibold text-green-700">Licence Verified</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Licence Number:</span>
                <span className="font-medium">{result.data.licence_number}</span>
                <span className="text-gray-500">Type:</span>
                <span>{result.data.licence_type_name}</span>
                <span className="text-gray-500">Organisation:</span>
                <span>{result.data.organisation_name}</span>
                <span className="text-gray-500">Issued:</span>
                <span>
                  {new Date(result.data.issued_date).toLocaleDateString()}
                </span>
                <span className="text-gray-500">Expires:</span>
                <span>
                  {new Date(result.data.expiry_date).toLocaleDateString()}
                </span>
                <span className="text-gray-500">Status:</span>
                <span
                  className={
                    result.data.is_expired
                      ? "text-red-600 font-medium"
                      : "text-green-600 font-medium"
                  }
                >
                  {result.data.status_display}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-red-700">{result.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
