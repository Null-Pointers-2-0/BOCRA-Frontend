"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  CalendarBlankIcon,
  EyeIcon,
} from "@phosphor-icons/react";
import {
  getArticles,
  getArticle,
  getNewsCategories,
} from "@/lib/api/clients/news";
import type { ArticleListItem, ArticleDetail } from "@/lib/api/types/news";
import HeaderSection from "@/components/HeaderSection";
import { Button } from "@/components/ui/button";

export default function NewsPage() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);

  // Detail
  const [selectedArticle, setSelectedArticle] = useState<ArticleDetail | null>(
    null,
  );
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    getNewsCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params: Record<string, string | number | boolean | undefined> = {};
    if (searchTerm) params.search = searchTerm;
    if (categoryFilter) params.category = categoryFilter;

    getArticles(params as never)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          if (Array.isArray(res.data)) {
            setArticles(res.data);
          } else if (res.data.results) {
            setArticles(res.data.results);
          } else {
            setArticles([]);
          }
        } else {
          setArticles([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setArticles([]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchTerm, categoryFilter]);

  const handleViewDetail = async (id: string) => {
    setLoadingDetail(true);
    const res = await getArticle(id);
    if (res.success) setSelectedArticle(res.data);
    setLoadingDetail(false);
  };

  // ── Detail view ──
  if (selectedArticle) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen px-6 mt-20 mb-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-turquoise hover:underline text-sm flex items-center gap-1"
            >
              <ArrowLeftIcon size={16} /> Back to News
            </button>

            {selectedArticle.featured_image && (
              <img
                src={selectedArticle.featured_image}
                alt={selectedArticle.title}
                width={900}
                height={400}
                className="w-full max-h-96 object-cover"
              />
            )}

            <div>
              <span className="text-xs bg-turquoise/20 text-turquoise px-2 py-0.5 font-medium">
                {selectedArticle.category_display}
              </span>
              {selectedArticle.is_featured && (
                <span className="text-xs bg-pink/20 text-pink px-2 py-0.5 font-medium ml-1">
                  Featured
                </span>
              )}
              <h1 className="text-3xl font-bold mt-2">
                {selectedArticle.title}
              </h1>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                {selectedArticle.author_name && (
                  <span>By {selectedArticle.author_name}</span>
                )}
                {selectedArticle.published_at && (
                  <span className="flex items-center gap-1">
                    <CalendarBlankIcon size={14} />
                    {new Date(
                      selectedArticle.published_at,
                    ).toLocaleDateString()}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <EyeIcon size={14} /> {selectedArticle.view_count} views
                </span>
              </div>
            </div>

            {selectedArticle.excerpt && (
              <p className="text-lg text-gray-600 italic border-l-4 border-turquoise pl-4">
                {selectedArticle.excerpt}
              </p>
            )}

            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
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
      <div className="min-h-screen px-6 mt-20">
        <div className="space-y-5 max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            <HeaderSection title="news" />
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 border rounded-md border-gray-400 px-3 text-sm bg-white w-full"
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
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-600">
              Loading news...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles && articles.length > 0 ? (
                articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex flex-col rounded-md justify-between border border-gray-300 bg-gray-50 overflow-hidden"
                  >
                    {article.featured_image && (
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                      <div>
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-xs bg-turquoise/20 text-turquoise px-2 py-0.5 font-medium rounded-sm">
                            {article.category_display}
                          </span>
                          {article.is_featured && (
                            <span className="text-xs bg-pink/20 rounded-sm text-pink px-2 py-0.5 font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold mt-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-md mt-1 line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2 justify-between text-gray-500">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1">
                            <CalendarBlankIcon size={12} />
                            {article.published_at
                              ? new Date(
                                  article.published_at,
                                ).toLocaleDateString()
                              : "Draft"}
                          </span>
                          <span className="flex items-center gap-1">
                            <EyeIcon size={12} /> {article.view_count}
                          </span>
                        </div>
                        <Button
                          onClick={() => handleViewDetail(article.id)}
                          disabled={loadingDetail}
                          className="w-full bg-turquoise text-md hover:bg-turquoise/90 py-5 text-white"
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-600">
                  No articles found.
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
