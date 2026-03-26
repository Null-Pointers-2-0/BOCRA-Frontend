"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getArticle } from "@/lib/api/clients/news";
import type { ArticleDetail } from "@/lib/api/types/news";
import { ArrowLeftIcon, SpinnerIcon } from "@phosphor-icons/react";

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      setError(null);
      try {
        const res = await getArticle(id);
        if (res.success) {
          setArticle(res.data);
        } else {
          setError(res.message || "Article not found");
        }
      } catch {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchArticle();
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-4xl mt-30 space-y-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-turquoise hover:text-pink transition-colors text-sm"
          >
            <ArrowLeftIcon size={16} />
            Back to News
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

          {!loading && !error && article && (
            <article className="space-y-6">
              {article.featured_image && (
                <div className="relative h-64 md:h-96 w-full rounded overflow-hidden">
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-3">
                <span className="text-xs font-medium text-white bg-turquoise px-2 py-1 rounded">
                  {article.category_display}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {article.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By {article.author_name}</span>
                  {article.published_at && (
                    <span>
                      {new Date(article.published_at).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </span>
                  )}
                  <span>{article.view_count} views</span>
                </div>
              </div>

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </article>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}
