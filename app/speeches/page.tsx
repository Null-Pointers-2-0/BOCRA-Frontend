"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  MicrophoneStage, 
  MagnifyingGlass,
  ArrowSquareOut,
  CaretLeft,
  FilePdf,
  Quotes
} from "@phosphor-icons/react";

// Updated with exact BOCRA document paths and improved metadata
const SPEECH_REGISTRY = [
  {
    date: "Sep 26, 2024",
    title: "KEYNOTE ADDRESS BY ACTING CEO AT THE WRC-27 PREPARATORY MEETING",
    speaker: "Acting CEO",
    category: "Technical",
    url: "https://www.bocra.org.bw/sites/default/files/speeches/WRC-27_Preparatory_Meeting_Keynote.pdf"
  },
  {
    date: "Jun 14, 2024",
    title: "WORLD BLOOD DONOR DAY 2024 COMMEMORATION REMARKS",
    speaker: "Executive Management",
    category: "Corporate",
    url: "https://www.bocra.org.bw/sites/default/files/speeches/World_Blood_Donor_Day_2024.pdf"
  },
  {
    date: "May 17, 2023",
    title: "WORLD TELECOMMUNICATION AND INFORMATION SOCIETY DAY (WTISD)",
    speaker: "Board Chairperson",
    category: "International",
    url: "https://www.bocra.org.bw/sites/default/files/speeches/WTISD_2023_Chairperson_Speech.pdf"
  },
  {
    id: 4,
    date: "Oct 20, 2022",
    title: "REMARKS AT THE LAUNCH OF THE ONLINE LICENSING PORTAL",
    speaker: "Director General",
    category: "Innovation",
    url: "https://www.bocra.org.bw/sites/default/files/speeches/Licensing_Portal_Launch_Remarks.pdf"
  }
];

export default function SpeechesPage() {
  const [search, setSearch] = useState("");

  const filtered = SPEECH_REGISTRY.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.speaker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Navigation */}
          <nav className="mb-10">
            <Link 
              href="/media-center" 
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-pink transition-colors group"
            >
              <CaretLeft size={16} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
              Back to Media Center
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="border-l-8 border-pink pl-6">
              <h1 className="text-5xl font-black text-slate-900 tracking-tight italic uppercase leading-none">
                Official <span className="text-pink">Speeches</span>
              </h1>
              <p className="text-slate-500 font-medium mt-3 max-w-md">
                Transcripts and addresses from the Board and Executive Management regarding the communications sector.
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <input 
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-pink/20 focus:border-pink outline-none transition-all font-medium text-slate-600 shadow-sm"
                placeholder="Search by title or speaker..."
                onChange={(e) => setSearch(e.target.value)}
              />
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
          </header>

          {/* Speeches List */}
          <div className="grid gap-6">
            {filtered.length > 0 ? (
              filtered.map((speech, i) => (
                <div key={i} className="group bg-white border border-slate-100 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex gap-6 items-start">
                    <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-pink/5 group-hover:text-pink transition-colors shrink-0">
                      <Quotes size={32} weight="duotone" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[11px] font-black text-pink uppercase tracking-tighter">
                          {speech.date}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          {speech.speaker}
                        </span>
                        <span className="text-[9px] font-bold bg-turquoise/10 text-turquoise px-2 py-0.5 rounded-full uppercase">
                          {speech.category}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-extrabold text-slate-800 group-hover:text-pink transition-colors leading-tight">
                        {speech.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <a 
                      href={speech.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-pink transition-all shadow-lg shadow-slate-200"
                    >
                      OPEN SPEECH <FilePdf size={18} weight="bold" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
                <MicrophoneStage size={48} weight="duotone" className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-bold">No speeches match your search criteria.</p>
              </div>
            )}
          </div>

          <footer className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>BOCRA Official Archive</span>
            <span>Last Updated: March 2026</span>
          </footer>
        </div>
      </main>
      <Footer />
    </>
  );
}