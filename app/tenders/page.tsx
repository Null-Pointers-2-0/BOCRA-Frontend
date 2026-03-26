"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getTenders } from "@/lib/api/clients/tenders";
import type { TenderListItem } from "@/lib/api/types/tenders";
import { SpinnerIcon, ClockIcon } from "@phosphor-icons/react";

function statusColor(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-green-600";
    case "CLOSED":
      return "bg-red-600";
    case "AWARDED":
      return "bg-turquoise";
    case "CANCELLED":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<TenderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTenders() {
      setLoading(true);
      setError(null);
      try {
        const res = await getTenders({
          search: search || undefined,
        });
        if (res.success) {
          setTenders(res.data);
        } else {
          setError(res.message || "Failed to load tenders");
        }
      } catch {
        setError("Failed to load tenders");
      } finally {
        setLoading(false);
      }
    }
    fetchTenders();
  }, [search]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-6xl mt-30 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-semibold">Tenders</h1>
            <input
              type="text"
              placeholder="Search tenders..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-turquoise"
            />
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

          {!loading && !error && tenders.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No tenders found.
            </div>
          )}

          {!loading && !error && tenders.length > 0 && (
            <div className="space-y-4">
              {tenders.map((tender) => (
                <Link
                  key={tender.id}
                  href={`/tenders/${tender.id}`}
                  className="block border rounded p-5 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-medium text-white px-2 py-0.5 rounded ${statusColor(tender.status)}`}
                        >
                          {tender.status_display}
                        </span>
                        <span className="text-xs font-medium text-white bg-pink px-2 py-0.5 rounded">
                          {tender.category_display}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold">
                        {tender.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Ref: {tender.reference_number}
                      </p>
                    </div>
                    <div className="flex flex-col items-end text-sm text-gray-500 space-y-1 whitespace-nowrap">
                      {tender.opening_date && (
                        <span>
                          Opens:{" "}
                          {new Date(tender.opening_date).toLocaleDateString()}
                        </span>
                      )}
                      {tender.closing_date && (
                        <span>
                          Closes:{" "}
                          {new Date(tender.closing_date).toLocaleDateString()}
                        </span>
                      )}
                      {tender.days_until_closing !== null &&
                        tender.days_until_closing > 0 && (
                          <span className="flex items-center gap-1 text-orange-600 font-medium">
                            <ClockIcon size={14} />
                            {tender.days_until_closing} days left
                          </span>
                        )}
                      {tender.budget_range && (
                        <span className="text-xs text-gray-400">
                          {tender.budget_range}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}
