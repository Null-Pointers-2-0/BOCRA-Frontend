"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPublications } from "@/lib/api/clients/publications";
import type { PublicationListItem } from "@/lib/api/types/publications";
import { DownloadSimpleIcon, SpinnerIcon } from "@phosphor-icons/react";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<PublicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPublications() {
      setLoading(true);
      setError(null);
      try {
        const res = await getPublications({
          search: search || undefined,
          ordering: "-published_date",
        });
        if (res.success) {
          setPublications(res.data);
        } else {
          setError(res.message || "Failed to load publications");
        }
      } catch {
        setError("Failed to load publications");
      } finally {
        setLoading(false);
      }
    }
    fetchPublications();
  }, [search]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-6xl mt-30 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-semibold">Publications</h1>
            <input
              type="text"
              placeholder="Search publications..."
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

          {!loading && !error && publications.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No publications found.
            </div>
          )}

          {!loading && !error && publications.length > 0 && (
            <div className="space-y-4">
              {publications.map((pub) => (
                <div
                  key={pub.id}
                  className="border rounded p-5 bg-white hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-white bg-dark-teal px-2 py-0.5 rounded">
                        {pub.category_display}
                      </span>
                      {pub.year && (
                        <span className="text-xs text-gray-400">{pub.year}</span>
                      )}
                      {pub.version && (
                        <span className="text-xs text-gray-400">
                          v{pub.version}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold">{pub.title}</h2>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {pub.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      {pub.published_date && (
                        <span>
                          {new Date(pub.published_date).toLocaleDateString()}
                        </span>
                      )}
                      <span>{pub.download_count} downloads</span>
                    </div>
                  </div>
                  <Link
                    href={`/publications/${pub.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-turquoise text-turquoise rounded hover:bg-turquoise hover:text-white transition-colors text-sm whitespace-nowrap"
                  >
                    <DownloadSimpleIcon size={16} />
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}
