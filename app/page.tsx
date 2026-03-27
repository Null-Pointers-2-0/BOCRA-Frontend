"use client";

import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import HeaderSection from "@/components/HeaderSection";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { getArticles } from "@/lib/api/clients/news";
import type { ArticleListItem } from "@/lib/api/types/news";

export default function Home() {
  const [news, setNews] = useState<ArticleListItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    getArticles({ page: 1 })
      .then((res) => {
        if (res.success) {
          const items = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
          setNews(items.slice(0, 5));
        }
      })
      .finally(() => setLoadingNews(false));
  }, []);

  const tagColors: Record<string, string> = {
    Notice: "bg-turquoise/10 text-turquoise",
    "Press Release": "bg-dark-teal/10 text-dark-teal",
    "Media Release": "bg-pink/10 text-pink",
    Release: "bg-pink/10 text-pink",
    Report: "bg-gold/10 text-gold",
    Guidelines: "bg-dark-teal/10 text-dark-teal",
    Guide: "bg-turquoise/10 text-turquoise",
  };

  const documentsAndLegislation = [
    { title: "Media Release", tag: "Release" },
    { title: "Cost Modelling Project Interim Report", tag: "Report" },
    { title: "Enforcement Guidelines", tag: "Guidelines" },
    { title: "Understanding Broadband Connectivity", tag: "Guide" },
  ];

  const licenses = [
    { title: "Aircraft Radio License" },
    { title: "Amateur Radio License" },
    { title: "Broadcasting License" },
    { title: "Cellular License" },
    {
      title: "Citizen Band Radio License",
    },
    {
      title: "Point-to-Multipoint License",
    },
    { title: "Point-to-Point License" },
    {
      title: "Private Radio Communication License",
    },
    { title: "Radio Dealers License" },
    { title: "Radio Frequency License" },
    { title: "Satellite Service License" },
    { title: "Type Approval License" },
    { title: "VANS License" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex flex-col justify-center items-center">
        <section className="flex flex-col justify-end items-end bg-[url('/hero-image.jpg')] bg-center bg-fit md:bg-contain bg-no-repeat md:bg-repeat-x h-screen w-full px-6 space-y-5 py-10">
          <div className="flex flex-col space-y-5">
            <h1 className="text-4xl md:text-7xl font-bold text-white">
              Welcome to the <br /> <span className="text-gold">Botswana Communications Regulatory Authority</span>
            </h1>
            <p className="text-xl md:text-2xl text-white">
              Your trusted partner in telecommunications
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center items-center w-full bg-black/60 text-white">
            <Link href="/telecommunications" className="hover:bg-turquoise/40">
              <div className="p-6 border-y md:border-y-0 md:border-x border-white flex items-center gap-2">
                <div className="bg-turquoise h-6 w-6 rounded-full"></div>
                <h1 className="text-lg">TELECOMMUNICATIONS</h1>
              </div>
            </Link>
            <Link href="/broadcasting" className="hover:bg-dark-teal/40">
              <div className="p-6 border-y md:border-y-0 md:border-x border-white flex items-center gap-2">
                <div className="bg-dark-teal h-6 w-6 rounded-full"></div>
                <h1 className="text-lg">BROADCASTING</h1>
              </div>
            </Link>
            <Link href="/postal" className="hover:bg-pink/40">
              <div className="p-6 border-y md:border-y-0 md:border-x border-white flex items-center gap-2">
                <div className="bg-pink h-6 w-6 rounded-full"></div>
                <h1 className="text-lg">POSTAL</h1>
              </div>
            </Link>
            <Link href="/internet" className="hover:bg-gold/40">
              <div className="p-6 border-y md:border-y-0 md:border-x border-white flex items-center gap-2">
                <div className="bg-gold h-6 w-6 rounded-full"></div>
                <h1 className="text-lg">INTERNET</h1>
              </div>
            </Link>
          </div>
        </section>
        <section className="bg-gray-50 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
 
        {/* ── NEWS & EVENTS ─────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Section header */}
          <div className="flex items-baseline gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">News &amp;</h2>
            <h2 className="text-2xl font-bold text-pink">Events</h2>
          </div>

          {/* News cards - live from API */}
          <div className="flex flex-col gap-3 flex-1">
            {loadingNews ? (
              <p className="text-gray-400 text-sm py-4">Loading…</p>
            ) : news.length > 0 ? (
              news.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-md bg-white border border-gray-300 hover:border-turquoise transition-all duration-200 cursor-pointer p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm ${tagColors[item.category_display] ?? "bg-gray-100 text-gray-500"}`}>
                      {item.category_display}
                    </span>
                    {item.published_at && (
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">
                        {new Date(item.published_at).toLocaleDateString("en-BW", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-turquoise transition-colors line-clamp-2">
                    {item.title}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm py-4">No recent news.</p>
            )}
          </div>
 
          <Link href="/news" className="mt-auto bg-pink transition-colors duration-200 text-white text-md rounded-sm py-3 w-full text-center block">
            View All News
          </Link>
        </div>
 
        {/* ── DOCUMENTS & LEGISLATION ───────────────────────── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-baseline gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">Documents &amp;</h2>
            <h2 className="text-2xl font-bold text-pink">Legislation</h2>
          </div>
 
          <Link href="/publications" className="inline-flex items-center gap-1 text-pink text-sm font-semibold hover:gap-3 transition-all duration-200">
            Publications →
          </Link>
 
          <div className="flex flex-col gap-3 flex-1">
            {documentsAndLegislation.map((doc, i) => (
              <Link
                href="/publications"
                key={i}
                className="group bg-white border rounded-md border-gray-300 hover:border-dark-teal transition-all duration-200 cursor-pointer p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-1 h-10 bg-dark-teal rounded-full flex-shrink-0 group-hover:h-12 transition-all duration-200" />
                  <p className="text-sm font-medium text-gray-800 group-hover:text-dark-teal transition-colors leading-snug">
                    {doc.title}
                  </p>
                </div>
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm flex-shrink-0 ${tagColors[doc.tag] ?? "bg-gray-100 text-gray-500"}`}>
                  {doc.tag}
                </span>
              </Link>
            ))}
          </div>
 
          <button className="mt-auto bg-pink transition-colors duration-200 text-white text-md rounded-sm py-3 w-full">
            View All Documents
          </button>
        </div>
 
        {/* ── APPLY FOR A LICENCE ───────────────────────────── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-baseline gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">Apply for a</h2>
            <h2 className="text-2xl font-bold text-pink">Licence</h2>
          </div>
 
          {/* Scrollable licence card list */}
          <div className="flex flex-col gap-2 flex-1 max-h-[420px] overflow-y-auto pr-1">
            {licenses.map((lic, i) => (
              <Link href="/apply-for-license" key={i}>
                <div className="group bg-white border border-gray-300 hover:border-pink transition-all duration-200 px-4 py-3 flex items-center justify-between gap-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-pink flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-sm text-gray-700 group-hover:text-pink transition-colors font-medium">
                      {lic.title}
                    </span>
                  </div>
                  <span className="text-gray-300 group-hover:text-pink text-sm transition-colors flex-shrink-0">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
 
      </div>
    </section>
        <section className="w-full flex flex-col md:justify-center md:items-center bg-dark-teal text-white py-10 space-y-5 px-6">
          <h1 className="text-3xl md:text-5xl font-semibold">
            Equipment Approval Database
          </h1>
          <p className="text-md md:text-lg max-w-3xl md:text-center text-left leading-loose">
            BOCRA is mandated by Sec 84 of the CRA Act to Type Approve
            communications equipment that may be connected, used or operated to
            provide broadcasting or telecommunications services in Botswana. In
            addition, BOCRA is mandated to ensure consumer protection.The
            purpose of Type Approval procedure is to ensure that all radio
            communication and telecommunication equipment used in Botswana
            comply with international standards that are applicable in Botswana
            as a member of the ITU Region…
          </p>
          <button className="px-6 py-2 border rounded-md border-white hover:bg-white hover:text-dark-teal cursor-pointer">
            Search Equipment
          </button>
        </section>

        <section className="bg-gray-50 py-20 px-8 md:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-pink text-sm font-semibold tracking-[0.2em] uppercase mb-3">
                Consumer Protection
              </p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Filing Complaints
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  num: "01",
                  title: "Complaints Process",
                  body: "BOCRA investigates consumer complaints against service providers where sufficient evidence exists to establish a prima facie case of possible breaches.",
                  color: "border-turquoise",
                  numColor: "text-turquoise",
                },
                {
                  num: "02",
                  title: "Regulatory Tools",
                  body: "In consultation with stakeholders, BOCRA periodically develops regulatory tools to establish minimum requirements and guide licensees and consumers.",
                  color: "border-dark-teal",
                  numColor: "text-dark-teal",
                },
                {
                  num: "03",
                  title: "Complaint Status",
                  body: "BOCRA will keep you updated on the status of your complaint and provide a unique reference number to track progress.",
                  color: "border-pink",
                  numColor: "text-pink",
                },
              ].map((card) => (
                <div
                  key={card.num}
                  className={`bg-white border-t-4 ${card.color} p-8 shadow-sm`}
                >
                  <p
                    className={`text-5xl font-bold ${card.numColor} mb-4 opacity-30`}
                  >
                    {card.num}
                  </p>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/file-complaint" className="px-4 py-2 bg-pink rounded-sm text-white hover:cursor-pointer inline-block">
                File a Complaint
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
