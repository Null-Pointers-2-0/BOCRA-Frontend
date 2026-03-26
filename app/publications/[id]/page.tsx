"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPublication, downloadPublication } from "@/lib/api/clients/publications";
import type { PublicationDetail } from "@/lib/api/types/publications";
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";

export default function PublicationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [publication, setPublication] = useState<PublicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublication() {
      setLoading(true);
      setError(null);
      try {
        const res = await getPublication(id);
        if (res.success) {
          setPublication(res.data);
        } else {
          setError(res.message || "Publication not found");
        }
      } catch {
        setError("Failed to load publication");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPublication();
  }, [id]);

  async function handleDownload() {
    try {
      const blob = await downloadPublication(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = publication?.title || "publication";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download file");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-4xl mt-30 space-y-6">
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 text-turquoise hover:text-pink transition-colors text-sm"
          >
            <ArrowLeftIcon size={16} />
            Back to Publications
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

          {!loading && !error && publication && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-white bg-dark-teal px-2 py-1 rounded">
                    {publication.category_display}
                  </span>
                  {publication.year && (
                    <span className="text-sm text-gray-400">
                      {publication.year}
                    </span>
                  )}
                  {publication.version && (
                    <span className="text-sm text-gray-400">
                      Version {publication.version}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {publication.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {publication.published_date && (
                    <span>
                      Published{" "}
                      {new Date(publication.published_date).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </span>
                  )}
                  <span>{publication.download_count} downloads</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {publication.summary}
              </p>

              {publication.file && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-turquoise text-white rounded hover:bg-turquoise/80 transition-colors cursor-pointer"
                >
                  <DownloadSimpleIcon size={20} />
                  Download Publication
                </button>
              )}

              {publication.attachments && publication.attachments.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">Attachments</h2>
                  <div className="space-y-2">
                    {publication.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-turquoise hover:text-pink transition-colors"
                      >
                        <DownloadSimpleIcon size={16} />
                        {att.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}
