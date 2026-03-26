"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  checkDomainAvailability,
  getDomainWhois,
  getDomainZones,
} from "@/lib/api/clients/domains";
import type { DomainAvailability, DomainWhois, DomainZone } from "@/lib/api/types/domains";
import {
  GlobeIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";

export default function DomainsPage() {
  const [domainInput, setDomainInput] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [zones, setZones] = useState<DomainZone[]>([]);
  const [availability, setAvailability] = useState<DomainAvailability | null>(null);
  const [whois, setWhois] = useState<DomainWhois | null>(null);
  const [loading, setLoading] = useState(false);
  const [whoisLoading, setWhoisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zonesLoading, setZonesLoading] = useState(true);

  useEffect(() => {
    async function fetchZones() {
      try {
        const res = await getDomainZones();
        if (res.success) {
          setZones(res.data);
          if (res.data.length > 0) {
            setSelectedZone(res.data[0].name);
          }
        }
      } catch {
        // zones will stay empty
      } finally {
        setZonesLoading(false);
      }
    }
    fetchZones();
  }, []);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!domainInput.trim()) return;

    const fqdn = domainInput.includes(".")
      ? domainInput.trim()
      : `${domainInput.trim()}${selectedZone}`;

    setLoading(true);
    setError(null);
    setAvailability(null);
    setWhois(null);

    try {
      const res = await checkDomainAvailability(fqdn);
      if (res.success) {
        setAvailability(res.data);

        if (!res.data.available) {
          setWhoisLoading(true);
          try {
            const whoisRes = await getDomainWhois(fqdn);
            if (whoisRes.success) {
              setWhois(whoisRes.data);
            }
          } catch {
            // WHOIS info not available
          } finally {
            setWhoisLoading(false);
          }
        }
      } else {
        setError(res.message || "Failed to check domain");
      }
    } catch {
      setError("Failed to check domain availability");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-4xl mt-30 space-y-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <GlobeIcon size={40} className="text-turquoise" />
              <h1 className="text-3xl md:text-4xl font-bold">
                .bw Domain Registry
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check the availability of your desired .bw domain name. Search
              below to see if your domain is available for registration.
            </p>
          </div>

          <form
            onSubmit={handleCheck}
            className="flex flex-col md:flex-row gap-3 items-stretch"
          >
            <div className="flex flex-1 border border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-turquoise">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Enter domain name (e.g. mybusiness)"
                className="flex-1 px-4 py-3 text-lg focus:outline-none"
              />
              {!zonesLoading && zones.length > 0 && (
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="border-l border-gray-300 px-3 py-3 bg-gray-50 text-sm font-medium focus:outline-none cursor-pointer"
                >
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.name}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !domainInput.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-turquoise text-white rounded font-medium hover:bg-turquoise/80 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <SpinnerIcon className="animate-spin" size={20} />
              ) : (
                <MagnifyingGlassIcon size={20} />
              )}
              Check Availability
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              {error}
            </div>
          )}

          {availability && (
            <div
              className={`border-2 rounded-lg p-6 space-y-4 ${
                availability.available
                  ? "border-green-400 bg-green-50"
                  : "border-red-300 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {availability.available ? (
                  <CheckCircleIcon
                    size={32}
                    weight="fill"
                    className="text-green-600"
                  />
                ) : (
                  <XCircleIcon
                    size={32}
                    weight="fill"
                    className="text-red-600"
                  />
                )}
                <div>
                  <h2 className="text-xl font-bold">
                    {availability.domain_name}
                  </h2>
                  <p
                    className={`text-sm font-medium ${
                      availability.available
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {availability.message}
                  </p>
                </div>
              </div>

              {availability.available && availability.zone && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white rounded p-4 space-y-1">
                    <p className="text-xs text-gray-400 uppercase">Zone</p>
                    <p className="font-semibold">{availability.zone.name}</p>
                  </div>
                  <div className="bg-white rounded p-4 space-y-1">
                    <p className="text-xs text-gray-400 uppercase">
                      Registration Fee
                    </p>
                    <p className="font-semibold">
                      {availability.zone.fee_currency}{" "}
                      {availability.zone.registration_fee}/yr
                    </p>
                  </div>
                  <div className="bg-white rounded p-4 space-y-1">
                    <p className="text-xs text-gray-400 uppercase">
                      Registration Period
                    </p>
                    <p className="font-semibold">
                      {availability.zone.min_registration_years} –{" "}
                      {availability.zone.max_registration_years} years
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {whoisLoading && (
            <div className="flex justify-center py-6">
              <SpinnerIcon className="animate-spin text-turquoise" size={30} />
            </div>
          )}

          {whois && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-800 text-white px-6 py-3">
                <h3 className="font-semibold">WHOIS Information</h3>
              </div>
              <div className="bg-gray-50 p-6 font-mono text-sm space-y-2">
                <Row label="Domain Name" value={whois.domain_name} />
                <Row label="Zone" value={whois.zone_name} />
                <Row label="Status" value={whois.status_display} />
                <Row label="Registrant" value={whois.registrant_name} />
                <Row label="Organisation" value={whois.organisation_name} />
                <Row
                  label="Registered"
                  value={
                    whois.registered_at
                      ? new Date(whois.registered_at).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "—"
                  }
                />
                <Row
                  label="Expires"
                  value={
                    whois.expires_at
                      ? new Date(whois.expires_at).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "—"
                  }
                />
                <Row label="Nameserver 1" value={whois.nameserver_1 || "—"} />
                <Row label="Nameserver 2" value={whois.nameserver_2 || "—"} />
              </div>
            </div>
          )}

          {!zonesLoading && zones.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Available Zones</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="border rounded p-4 bg-white hover:shadow-md transition-shadow space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-turquoise">
                        {zone.name}
                      </span>
                      <span className="text-sm font-medium bg-turquoise/10 text-turquoise px-2 py-1 rounded">
                        {zone.fee_currency} {zone.registration_fee}/yr
                      </span>
                    </div>
                    {zone.description && (
                      <p className="text-sm text-gray-600">
                        {zone.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>
                        {zone.min_registration_years}–
                        {zone.max_registration_years} year registration
                      </span>
                      {zone.is_restricted && (
                        <span className="text-orange-500 font-medium">
                          Restricted
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="text-gray-500 w-36 shrink-0">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
