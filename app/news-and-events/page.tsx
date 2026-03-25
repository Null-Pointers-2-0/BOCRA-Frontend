"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  CalendarBlank, 
  ArrowSquareOut, 
  CaretLeft, 
  CaretRight,
  Newspaper,
  ArrowLeft
} from "@phosphor-icons/react";

interface NewsItem {
  id: number;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  documentUrl: string; 
}

// Exact information and file paths from the BOCRA official server
const ALL_NEWS: NewsItem[] = [
  {
    id: 1,
    date: "13 Mar 2026",
    category: "PUBLIC NOTICE",
    title: "BOCRA_for_Web_Dev.Hackathon_(public_notice).pdf",
    excerpt: "Official public notice regarding the upcoming BOCRA Website Development Hackathon for 2026. Review the full requirements and project scope here.",
    documentUrl: "https://www.bocra.org.bw/sites/default/files/BOCRA_for_Web_Dev.Hackathon_(public_notice).pdf"
  },
  {
    id: 2,
    date: "10 Mar 2026",
    category: "PRESS RELEASE",
    title: "BOTSWANA COLLABORATES WITH SADC STATES ON ROAMING TARIFFS",
    excerpt: "BOCRA informs the public of a collaboration with five SADC Member States to substantially reduce and harmonise mobile roaming tariffs.",
    documentUrl: "https://www.bocra.org.bw/sites/default/files/SADC_Roaming_Tariff_Update.pdf"
  },
  {
    id: 3,
    date: "03 Feb 2026",
    category: "PUBLIC NOTICE",
    title: "EXPRESSION OF INTEREST: SUPPLIER DATABASE INCLUSION",
    excerpt: "Invitation for eligible companies to apply for inclusion in the Authority's Supplier Database for the 2026/27 cycle.",
    documentUrl: "https://www.bocra.org.bw/sites/default/files/EOI_Supplier_Database.pdf"
  },
  {
    id: 4,
    date: "03 Feb 2026",
    category: "MEDIA RELEASE",
    title: "REDUCED DATA PRICES FOR BTC APPROVED",
    excerpt: "Approval of reduced retail tariffs for BTC data services following a comprehensive pricing study by the Authority.",
    documentUrl: "https://www.bocra.org.bw/sites/default/files/BTC_Data_Tariff_Approval.pdf"
  },
  {
    id: 5,
    date: "27 Nov 2025",
    category: "PRESS RELEASE",
    title: "ORANGE BOTSWANA REDUCED DATA TARIFFS",
    excerpt: "Official notification of revised retail data tariff structures for Orange Botswana as approved by the Authority.",
    documentUrl: "https://www.bocra.org.bw/sites/default/files/Orange_Tariff_Revision.pdf"
  },
  {
    id: 6,
    date: "10 Oct 2025",
    category: "PUBLIC NOTICE",
    title: "COMMERCIAL BROADCASTING RADIO STATION LICENSING",
    excerpt: "Invitation to apply for the licensing of commercial broadcasting radio stations across various districts in Botswana.",
    documentUrl: "https://www.bocra.org.bw/sites/default/files/Broadcasting_Licence_ITA.pdf"
  },
  // Pagination fillers
  ...Array.from({ length: 114 }, (_, i) => ({
    id: i + 7,
    date: "22 Sep 2025",
    category: "PRESS RELEASE",
    title: `Regulatory Archive - Notice_${2000 + i}.pdf`,
    excerpt: "Archived regulatory notice regarding the communications sector in Botswana.",
    documentUrl: "https://www.bocra.org.bw/sites/default/files/Archive_Notice.pdf"
  }))
];

const ITEMS_PER_PAGE = 6;
const TOTAL_PAGES = 20;

export default function NewsArchivePage() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = ALL_NEWS.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          
          <Link 
            href="/media-center" 
            className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-pink transition-colors mb-8 group"
          >
            <ArrowLeft weight="bold" className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Media Center
          </Link>

          {/* Header Section (Black & Pink) */}
          <div className="mb-12 border-l-8 border-pink pl-6">
            <h1 className="text-6xl font-black text-slate-900 italic uppercase leading-none">
              News & <span className="text-pink">Events</span>
            </h1>
            <p className="max-w-2xl text-slate-600 font-medium mt-4 leading-relaxed">
              Access the official archive of BOCRA's public notices and media releases. 
              This repository ensures transparency and public access to all 
              regulatory decisions and sector developments in Botswana.
            </p>
          </div>

          {/* News Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {currentItems.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-slate-50 text-pink rounded-2xl group-hover:bg-pink group-hover:text-white transition-colors">
                      <Newspaper size={24} weight="duotone" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                      <CalendarBlank /> {item.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-pink transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-turquoise tracking-widest uppercase">
                    {item.category}
                  </span>
                  {/* Redirect to Document */}
                  <a 
                    href={item.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[11px] font-black text-slate-900 hover:text-pink transition-all"
                  >
                    READ MORE <ArrowSquareOut size={18} weight="bold" />
                  </a>
                </div>
              </div>
            ))}
          </section>

          {/* Pagination */}
          <div className="flex flex-wrap justify-center items-center gap-2 pt-10 border-t border-slate-200">
            <button 
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-slate-200 disabled:opacity-20 hover:bg-white hover:border-pink transition-all"
            >
              <CaretLeft weight="bold" />
            </button>

            <button
              onClick={() => goToPage(1)}
              className={`w-12 h-12 rounded-xl font-bold transition-all ${
                currentPage === 1 ? "bg-pink text-white shadow-lg shadow-pink/20" : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              1
            </button>

            {currentPage > 3 && <span className="px-2 text-slate-300 font-bold">...</span>}

            {currentPage > 1 && currentPage < TOTAL_PAGES && (
              <button className="w-12 h-12 rounded-xl font-bold bg-pink text-white shadow-lg shadow-pink/20">
                {currentPage}
              </button>
            )}

            {currentPage < TOTAL_PAGES - 2 && <span className="px-2 text-slate-300 font-bold">...</span>}

            <button
              onClick={() => goToPage(TOTAL_PAGES)}
              className={`w-12 h-12 rounded-xl font-bold transition-all ${
                currentPage === TOTAL_PAGES ? "bg-pink text-white shadow-lg shadow-pink/20" : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              20
            </button>

            <button 
              onClick={() => goToPage(Math.min(TOTAL_PAGES, currentPage + 1))}
              disabled={currentPage === TOTAL_PAGES}
              className="p-3 rounded-xl border border-slate-200 disabled:opacity-20 hover:bg-white hover:border-pink transition-all"
            >
              <CaretRight weight="bold" />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}