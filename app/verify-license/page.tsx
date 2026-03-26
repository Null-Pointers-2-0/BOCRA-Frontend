"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { verifyLicence } from "@/lib/api/clients/licensing";
import type { LicenceVerify } from "@/lib/api/types/licensing";

export default function VerifyLicensePage() {
  const [searchType, setSearchType] = useState<"licence_no" | "company">(
    "licence_no"
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LicenceVerify[] | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const params =
        searchType === "licence_no"
          ? { licence_no: query.trim() }
          : { company: query.trim() };
      const res = await verifyLicence(params);
      if (res.success) {
        setResults(res.data);
      } else {
        setError(res.message || "No licence found.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700 border-green-300",
    SUSPENDED: "bg-yellow-100 text-yellow-700 border-yellow-300",
    EXPIRED: "bg-red-100 text-red-700 border-red-300",
    REVOKED: "bg-gray-200 text-gray-600 border-gray-400",
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen px-6 mt-20 md:mt-30 mb-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">License Verification</h1>
            <p className="text-gray-600 mt-2">
              Verify the validity of a BOCRA licence by entering a licence
              number or company name.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="bg-gray-50 border border-gray-400 p-6 space-y-4"
          >
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  checked={searchType === "licence_no"}
                  onChange={() => {
                    setSearchType("licence_no");
                    setQuery("");
                    setResults(null);
                    setError("");
                  }}
                  className="accent-turquoise"
                />
                <span className="font-medium">Licence Number</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  checked={searchType === "company"}
                  onChange={() => {
                    setSearchType("company");
                    setQuery("");
                    setResults(null);
                    setError("");
                  }}
                  className="accent-turquoise"
                />
                <span className="font-medium">Company Name</span>
              </label>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder={
                    searchType === "licence_no"
                      ? "e.g. LIC-ISP-2026-000001"
                      : "e.g. Botswana Telecom"
                  }
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-12 border-gray-400 text-lg"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-turquoise hover:bg-turquoise/90 text-white h-12 px-8 text-lg disabled:opacity-50"
              >
                {loading ? "Searching..." : "Verify"}
              </Button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 p-4 text-center">
              {error}
            </div>
          )}

          {results && results.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 text-center">
              No licences found matching your search.
            </div>
          )}

          {results && results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {results.length} licence{results.length > 1 ? "s" : ""} found
              </h2>
              {results.map((licence) => (
                <div
                  key={licence.licence_number}
                  className={`border p-5 space-y-3 ${
                    statusColors[licence.status] || "border-gray-400 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Licence Number</p>
                      <p className="text-xl font-bold tracking-wide">
                        {licence.licence_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-semibold ${
                          statusColors[licence.status] || "bg-gray-200"
                        }`}
                      >
                        {licence.status_display}
                        {licence.is_expired && " (Expired)"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Organisation</p>
                      <p className="font-medium">
                        {licence.organisation_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Licence Type</p>
                      <p className="font-medium">
                        {licence.licence_type_name}{" "}
                        <span className="text-xs text-gray-400">
                          ({licence.licence_type_code})
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Issued Date</p>
                      <p className="font-medium">
                        {new Date(licence.issued_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expiry Date</p>
                      <p className="font-medium">
                        {new Date(licence.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
