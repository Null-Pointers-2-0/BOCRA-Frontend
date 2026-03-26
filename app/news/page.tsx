"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getArticles } from "@/lib/api/clients/news";
import type { ArticleListItem } from "@/lib/api/types/news";
import { SpinnerIcon } from "@phosphor-icons/react";

export default function NewsPage() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      setError(null);
      try {
        const res = await getArticles({ search: search || undefined });
        if (res.success) {
          setArticles(res.data);
        } else {
          setError(res.message || "Failed to load articles");
        }
      } catch {
        setError("Failed to load articles");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [search]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-6xl mt-30 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-semibold">News & Events</h1>
            <input
              type="text"
              placeholder="Search articles..."
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

          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No articles found.
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="border rounded overflow-hidden hover:shadow-lg transition-shadow bg-white group"
                >
                  {article.featured_image && (
                    <div className="relative h-48 w-full bg-gray-100">
                      <Image
                        src={article.featured_image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <span className="text-xs font-medium text-white bg-turquoise px-2 py-1 rounded">
                      {article.category_display}
                    </span>
                    <h2 className="text-lg font-semibold line-clamp-2 group-hover:text-turquoise transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                      <span>{article.author_name}</span>
                      {article.published_at && (
                        <span>
                          {new Date(article.published_at).toLocaleDateString()}
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
