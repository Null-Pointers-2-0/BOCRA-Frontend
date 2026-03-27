"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import {
  getPublications,
  getPublication,
  getPublicationCategories,
} from "@/lib/api/clients/publications";
import type {
  PublicationListItem,
  PublicationDetail,
} from "@/lib/api/types/publications";
import { config } from "@/lib/config";
import HeaderSection from "@/components/HeaderSection";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<PublicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);

  // Detail view
  const [selectedPub, setSelectedPub] = useState<PublicationDetail | null>(
    null,
  );
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    getPublicationCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params: Record<string, string | number | boolean | undefined> = {};
    if (searchTerm) params.search = searchTerm;
    if (categoryFilter) params.category = categoryFilter;
    getPublications(params as never)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          // Check if response has results or is directly an array
          if (Array.isArray(res.data)) {
            setPublications(res.data);
          } else if (res.data.results) {
            setPublications(res.data.results);
          } else {
            setPublications([]);
          }
        } else {
          setPublications([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setPublications([]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchTerm, categoryFilter]);

  const handleViewDetail = async (id: string) => {
    setLoadingDetail(true);
    const res = await getPublication(id);
    if (res.success) setSelectedPub(res.data);
    setLoadingDetail(false);
  };

  // ── Detail view ──
  if (selectedPub) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen px-6 mt-20 md:mt-30 mb-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <button
              onClick={() => setSelectedPub(null)}
              className="text-turquoise hover:underline text-md flex items-center gap-1"
            >
              <ArrowLeftIcon size={16} /> Back to Publications
            </button>

            <div>
              <span className="text-xs bg-turquoise/20 rounded-sm text-turquoise px-2 py-0.5 font-medium">
                {selectedPub.category_display}
              </span>
              <h1 className="text-3xl font-bold mt-2">{selectedPub.title}</h1>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                {selectedPub.published_date && (
                  <span>
                    Published:{" "}
                    {new Date(selectedPub.published_date).toLocaleDateString()}
                  </span>
                )}
                {selectedPub.version && (
                  <span>Version: {selectedPub.version}</span>
                )}
                <span>{selectedPub.download_count} downloads</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md border border-gray-400 p-4">
              <p className="leading-relaxed whitespace-pre-wrap">
                {selectedPub.summary}
              </p>
            </div>

            {selectedPub.file && (
              <a
                href={`${config.apiUrl}/publications/${selectedPub.id}/download/`}
                className="inline-flex items-center gap-2 rounded-md bg-turquoise text-white px-3 py-2 hover:bg-turquoise/90"
              >
                <DownloadSimpleIcon size={20} /> Download Publication
              </a>
            )}

            {selectedPub.attachments && selectedPub.attachments.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Attachments</h2>
                <div className="space-y-2">
                  {selectedPub.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border border-gray-300 hover:bg-gray-50"
                    >
                      <DownloadSimpleIcon
                        size={18}
                        className="text-turquoise"
                      />
                      {att.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ── List view ──
  return (
    <main>
      <Navbar />
      <div className="min-h-screen px-6 mt-20 flex justify-center">
        <div className="space-y-5 w-full items-center max-w-4xl">
          <div className="flex flex-col justify-between gap-4">
            <HeaderSection title="Publications" textSize="text-5xl" />
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 border border-gray-400 px-3 text-sm rounded-md bg-white w-full"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  className="h-10 md:min-w-72 text-lg border-gray-400 placeholder:text-gray-900 pl-10"
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-600">
              Loading publications...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publications && publications.length > 0 ? (
                publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="p-4 flex flex-col justify-between border border-gray-400 bg-gray-50 space-y-2 rounded-md"
                  >
                    <div>
                      <span className="text-xs bg-turquoise/20 text-turquoise px-2 py-0.5 font-medium rounded-sm">
                        {pub.category_display}
                      </span>
                      {pub.is_featured && (
                        <span className="text-xs bg-pink/20 text-pink px-2 py-0.5 font-medium rounded-sm ml-1">
                          Featured
                        </span>
                      )}
                      <h3 className="text-lg font-bold mt-2 line-clamp-2">
                        {pub.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {pub.summary}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">
                        {pub.published_date
                          ? new Date(pub.published_date).toLocaleDateString()
                          : "Not dated"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {pub.download_count} downloads
                      </span>
                    </div>
                    <Button
                      onClick={() => handleViewDetail(pub.id)}
                      disabled={loadingDetail}
                      className="w-full text-md py-5 bg-turquoise hover:bg-turquoise/90 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-lg text-gray-600">
                    No publications found.
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
