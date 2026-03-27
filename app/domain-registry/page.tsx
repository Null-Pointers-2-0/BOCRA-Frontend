"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  checkDomainAvailability,
  lookupDomainWhois,
} from "@/lib/api/clients/domains";
import type { DomainAvailability, DomainWhois } from "@/lib/api/types/domains";
import HeaderSection from "@/components/HeaderSection";

export default function DomainRegistry() {
  // ── Availability check state ──
  const [domainName, setDomainName] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");
  const [availability, setAvailability] = useState<DomainAvailability | null>(
    null,
  );

  // ── WHOIS lookup state ──
  const [whoisName, setWhoisName] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [whoisError, setWhoisError] = useState("");
  const [whoisResult, setWhoisResult] = useState<DomainWhois | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim()) return;
    setChecking(true);
    setCheckError("");
    setAvailability(null);

    try {
      const res = await checkDomainAvailability(
        domainName.trim().toLowerCase(),
      );
      if (res.success) {
        setAvailability(res.data);
      } else {
        setCheckError(res.message || "Failed to check domain.");
      }
    } catch {
      setCheckError("Network error. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleWhois = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whoisName.trim()) return;
    setLookingUp(true);
    setWhoisError("");
    setWhoisResult(null);

    try {
      const res = await lookupDomainWhois(whoisName.trim().toLowerCase());
      if (res.success) {
        setWhoisResult(res.data);
      } else {
        setWhoisError(res.message || "Domain not found.");
      }
    } catch {
      setWhoisError("Network error. Please try again.");
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen md:justify-center mt-20 md:items-center flex flex-col px-6">
        {/* ── Hero Section ── */}
        <div className="flex flex-col space-y-4 max-w-4xl">
          <HeaderSection
            title=".bw Domain"
            pinkText="Registry"
            textSize="text-3xl"
            description="Check if your desired .bw domain name is available for registration."
          />

          {/* ── Domain Availability Check ── */}
          <section className="w-full max-w-3xl mx-auto space-y-5">
            <h2 className="text-2xl font-semibold">
              Check Domain Availability
            </h2>

            <form onSubmit={handleCheck} className="flex gap-3 items-end">
              <div className="flex-1">
                <label htmlFor="domainCheck" className="font-medium text-lg">
                  Domain Name
                </label>
                <Input
                  id="domainCheck"
                  type="text"
                  placeholder="example.co.bw"
                  required
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={checking}
                className="bg-turquoise hover:bg-turquoise/90 text-md text-white font-medium py-5 px-8 disabled:opacity-50"
              >
                {checking ? "Checking..." : "Check"}
              </Button>
            </form>

            {checkError && (
              <div className="bg-red-50 border border-red-400 text-red-700 p-3">
                {checkError}
              </div>
            )}

            {availability && (
              <div
                className={`border p-6 space-y-3 ${
                  availability.available
                    ? "bg-green-50 border-green-400"
                    : "bg-red-50 border-red-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-3xl ${
                      availability.available ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {availability.available ? "\u2713" : "\u2717"}
                  </span>
                  <div>
                    <p className="text-xl font-bold">
                      {availability.domain_name}
                    </p>
                    <p
                      className={`font-medium ${
                        availability.available
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {availability.message}
                    </p>
                  </div>
                </div>

                {availability.zone && (
                  <div className="pt-3 border-t border-gray-300 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Zone</p>
                      <p className="font-medium">{availability.zone.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Fee</p>
                      <p className="font-medium">
                        {availability.zone.fee_currency}{" "}
                        {availability.zone.registration_fee}/year
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Renewal Fee</p>
                      <p className="font-medium">
                        {availability.zone.fee_currency}{" "}
                        {availability.zone.renewal_fee}/year
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Registration Period
                      </p>
                      <p className="font-medium">
                        {availability.zone.min_registration_years}–
                        {availability.zone.max_registration_years} years
                      </p>
                    </div>
                    {availability.zone.is_restricted && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">
                          Eligibility Criteria
                        </p>
                        <p className="font-medium text-yellow-700">
                          {availability.zone.eligibility_criteria}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ── WHOIS Lookup ── */}
          <section className="w-full max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-semibold">WHOIS Lookup</h2>
            <p className="text-gray-600">
              Look up registration details for an existing .bw domain.
            </p>

            <form onSubmit={handleWhois} className="flex gap-3 items-end">
              <div className="flex-1">
                <label htmlFor="whoisLookup" className="font-medium text-lg">
                  Domain Name
                </label>
                <Input
                  id="whoisLookup"
                  type="text"
                  placeholder="example.co.bw"
                  required
                  value={whoisName}
                  onChange={(e) => setWhoisName(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={lookingUp}
                className="bg-turquoise hover:bg-turquoise/90 text-md text-white font-medium py-5 px-8 disabled:opacity-50"
              >
                {lookingUp ? "Looking up..." : "Lookup"}
              </Button>
            </form>

            {whoisError && (
              <div className="bg-red-50 border border-red-400 text-red-700 p-3">
                {whoisError}
              </div>
            )}

            {whoisResult && (
              <div className="bg-gray-50 rounded-md border border-gray-400 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Domain</p>
                    <p className="text-xl font-bold">
                      {whoisResult.domain_name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium ${
                      whoisResult.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : whoisResult.status === "EXPIRED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {whoisResult.status_display}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-300">
                  <div>
                    <p className="text-sm text-gray-500">Zone</p>
                    <p className="font-medium">{whoisResult.zone_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registrant</p>
                    <p className="font-medium">{whoisResult.registrant_name}</p>
                  </div>
                  {whoisResult.organisation_name && (
                    <div>
                      <p className="text-sm text-gray-500">Organisation</p>
                      <p className="font-medium">
                        {whoisResult.organisation_name}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Registered</p>
                    <p className="font-medium">
                      {whoisResult.registered_at
                        ? new Date(
                            whoisResult.registered_at,
                          ).toLocaleDateString("en-BW", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expires</p>
                    <p className="font-medium">
                      {whoisResult.expires_at
                        ? new Date(whoisResult.expires_at).toLocaleDateString(
                            "en-BW",
                            { year: "numeric", month: "long", day: "numeric" },
                          )
                        : "—"}
                    </p>
                  </div>
                  {whoisResult.nameserver_1 && (
                    <div>
                      <p className="text-sm text-gray-500">Nameserver 1</p>
                      <p className="font-medium">{whoisResult.nameserver_1}</p>
                    </div>
                  )}
                  {whoisResult.nameserver_2 && (
                    <div>
                      <p className="text-sm text-gray-500">Nameserver 2</p>
                      <p className="font-medium">{whoisResult.nameserver_2}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
