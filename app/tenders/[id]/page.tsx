"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getTender } from "@/lib/api/clients/tenders";
import type { TenderDetail } from "@/lib/api/types/tenders";
import {
  ArrowLeftIcon,
  ClockIcon,
  EnvelopeIcon,
  FileTextIcon,
  PhoneIcon,
  SpinnerIcon,
  UserIcon,
} from "@phosphor-icons/react";

export default function TenderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [tender, setTender] = useState<TenderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTender() {
      setLoading(true);
      setError(null);
      try {
        const res = await getTender(id);
        if (res.success) {
          setTender(res.data);
        } else {
          setError(res.message || "Tender not found");
        }
      } catch {
        setError("Failed to load tender");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTender();
  }, [id]);

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-4xl mt-30 space-y-6">
          <Link
            href="/tenders"
            className="inline-flex items-center gap-2 text-turquoise hover:text-pink transition-colors text-sm"
          >
            <ArrowLeftIcon size={16} />
            Back to Tenders
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

          {!loading && !error && tender && (
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-medium text-white px-2 py-1 rounded ${statusColor(tender.status)}`}
                  >
                    {tender.status_display}
                  </span>
                  <span className="text-xs font-medium text-white bg-pink px-2 py-1 rounded">
                    {tender.category_display}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {tender.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Reference: {tender.reference_number}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tender.opening_date && (
                  <div className="border rounded p-4 space-y-1">
                    <p className="text-xs text-gray-400 uppercase">Opening Date</p>
                    <p className="font-semibold">
                      {new Date(tender.opening_date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {tender.closing_date && (
                  <div className="border rounded p-4 space-y-1">
                    <p className="text-xs text-gray-400 uppercase">Closing Date</p>
                    <p className="font-semibold">
                      {new Date(tender.closing_date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {tender.days_until_closing !== null &&
                      tender.days_until_closing > 0 && (
                        <p className="flex items-center gap-1 text-sm text-orange-600">
                          <ClockIcon size={14} />
                          {tender.days_until_closing} days remaining
                        </p>
                      )}
                  </div>
                )}
                {tender.budget_range && (
                  <div className="border rounded p-4 space-y-1">
                    <p className="text-xs text-gray-400 uppercase">Budget Range</p>
                    <p className="font-semibold">{tender.budget_range}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Description</h2>
                <div
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: tender.description }}
                />
              </div>

              {(tender.contact_name || tender.contact_email || tender.contact_phone) && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                  <div className="border rounded p-4 space-y-2">
                    {tender.contact_name && (
                      <p className="flex items-center gap-2 text-sm">
                        <UserIcon size={16} className="text-turquoise" />
                        {tender.contact_name}
                      </p>
                    )}
                    {tender.contact_email && (
                      <a
                        href={`mailto:${tender.contact_email}`}
                        className="flex items-center gap-2 text-sm text-turquoise hover:text-pink"
                      >
                        <EnvelopeIcon size={16} />
                        {tender.contact_email}
                      </a>
                    )}
                    {tender.contact_phone && (
                      <a
                        href={`tel:${tender.contact_phone}`}
                        className="flex items-center gap-2 text-sm text-turquoise hover:text-pink"
                      >
                        <PhoneIcon size={16} />
                        {tender.contact_phone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {tender.documents && tender.documents.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">Documents</h2>
                  <div className="space-y-2">
                    {tender.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-turquoise hover:text-pink transition-colors"
                      >
                        <FileTextIcon size={16} />
                        {doc.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {tender.addenda && tender.addenda.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">Addenda</h2>
                  <div className="space-y-4">
                    {tender.addenda.map((addendum) => (
                      <div key={addendum.id} className="border rounded p-4 space-y-1">
                        <h3 className="font-medium">{addendum.title}</h3>
                        <p className="text-sm text-gray-600">{addendum.content}</p>
                        <p className="text-xs text-gray-400">
                          By {addendum.author_name} on{" "}
                          {new Date(addendum.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tender.award && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">Award Details</h2>
                  <div className="border rounded p-4 border-turquoise bg-turquoise/5 space-y-2">
                    <p className="font-semibold text-lg">
                      Awarded to: {tender.award.awardee_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {tender.award.summary}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Date:{" "}
                        {new Date(tender.award.award_date).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </span>
                      {tender.award.award_amount && (
                        <span>Amount: {tender.award.award_amount}</span>
                      )}
                    </div>
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
