"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
// Using the icons already present in your project
import { FileText, CaretRight, PhoneCall, ArrowSquareOut } from "@phosphor-icons/react";

export default function Tarrifs() {
  const mobileData = [
    { volume: "100MB", price: "P2.00", validity: "24 Hours", status: "Active" },
    { volume: "1.5GB", price: "P10.00", validity: "24 Hours", status: "New" },
    { volume: "30GB", price: "P199.00", validity: "30 Days", status: "Reduced" },
    { volume: "100GB", price: "P349.00", validity: "30 Days", status: "-40%" },
  ];

  const voiceRates = [
    { type: "Peak (Mon-Sat)", period: "07:00 - 21:00", rate: "P1.34", unit: "Per Min" },
    { type: "Off-Peak", period: "Nights & Holidays", rate: "P0.82", unit: "Per Min" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex flex-col md:items-center min-h-screen px-6 mt-20 md:mt-30 pb-20">
        <div className="w-full max-w-6xl space-y-12">
          
          <div className="space-y-2 border-b border-gray-100 pb-6">
            <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">Official Regulatory Price Ceilings (2026)</h1>
            <p className="text-lg text-gray-500 italic">Ensuring affordable communication for Botswana</p>
          </div>

          {/* 1. Mobile Data Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-l-4 border-pink pl-4">Approved Retail Prices</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {mobileData.map((item, i) => (
                <div key={i} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.volume}</p>
                  <p className="text-4xl font-bold text-pink my-1">{item.price}</p>
                  <p className="text-sm text-gray-500">{item.validity}</p>
                  <span className="mt-3 inline-block text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase italic">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Voice Rates Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-l-4 border-pink pl-4 text-gray-800">Voice Call Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {voiceRates.map((rate, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="p-4 bg-pink/10 rounded-full text-pink">
                    <PhoneCall size={32} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">{rate.type} • {rate.period}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900">{rate.rate}</p>
                        <p className="text-sm font-medium text-gray-500">{rate.unit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Official External Archive Link (Replaces Downloads) */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-l-4 border-pink pl-4 text-gray-800">Regulatory Archive</h2>
            <a 
              href="https://www.bocra.org.bw/tariffs-0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-8 border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl group hover:border-pink hover:bg-white transition-all shadow-sm"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gray-200 rounded-xl group-hover:bg-pink/10 group-hover:text-pink transition-colors">
                  <FileText size={40} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 group-hover:text-pink transition-colors">View Detailed Tariffs & Directives</h4>
                  <p className="text-gray-500">Access full regulatory documents and historical data.</p>
                </div>
              </div>
              <ArrowSquareOut size={32} className="text-gray-400 group-hover:text-pink" />
            </a>
          </section>

          {/* FAQ Link */}
          <Link href="/faqs" className="block p-8 bg-gray-900 rounded-2xl text-white group hover:bg-black transition-all">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-2xl font-bold italic mb-1">Still have questions?</h3>
                  <p className="text-gray-400">View our Frequently Asked Questions regarding billing and regulation.</p>
               </div>
               <CaretRight size={32} weight="bold" className="text-pink group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>

        </div>
      </main>
      <Footer />
    </>
  );
}