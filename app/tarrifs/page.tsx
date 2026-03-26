"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
// Using the icons already present in your project
import {
  FileTextIcon,
  CaretRightIcon,
  PhoneCallIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import HeaderSection from "@/components/HeaderSection";

export default function Tarrifs() {
  const mobileData = [
    { volume: "100MB", price: "P2.00", validity: "24 Hours", status: "Active" },
    { volume: "1.5GB", price: "P10.00", validity: "24 Hours", status: "New" },
    {
      volume: "30GB",
      price: "P199.00",
      validity: "30 Days",
      status: "Reduced",
    },
    { volume: "100GB", price: "P349.00", validity: "30 Days", status: "-40%" },
  ];

  const voiceRates = [
    {
      type: "Peak (Mon-Sat)",
      period: "07:00 - 21:00",
      rate: "P1.34",
      unit: "Per Min",
    },
    {
      type: "Off-Peak",
      period: "Nights & Holidays",
      rate: "P0.82",
      unit: "Per Min",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex flex-col md:items-center min-h-screen px-6 mt-20 md:mt-30">
        <div className="w-full max-w-4xl space-y-5">
          <HeaderSection
            title="Tarrifs"
            textSize="text-5xl"
            description="Ensuring affordable communication for Botswana"
          />

          {/* 1. Mobile Data Section */}
          <section className="space-y-5">
            <h2 className="text-2xl font-semibold border-l-4 border-pink pl-4">
              Approved Retail Prices
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mobileData.map((item, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {item.volume}
                  </p>
                  <p className="text-4xl font-bold text-pink my-1">
                    {item.price}
                  </p>
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
            <h2 className="text-2xl font-semibold border-l-4 border-pink pl-4 text-gray-800">
              Voice Call Rates
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {voiceRates.map((rate, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-6 p-4 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    {rate.type} • {rate.period}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl text-pink font-bold">{rate.rate}</p>
                    <p className="text-sm font-medium text-gray-500">
                      {rate.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Official External Archive Link (Replaces Downloads) */}
          <section className="space-y-5">
            <h2 className="text-2xl font-semibold border-l-4 border-pink pl-4 text-gray-800">
              Regulatory Archive
            </h2>
            <a
              href="https://www.bocra.org.bw/tariffs-0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-8 border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl group hover:border-pink hover:bg-white transition-all shadow-sm"
            >
              <div className="flex flex-col items-center gap-6">
                <h4 className="text-xl font-bold text-gray-800 group-hover:text-pink transition-colors">
                  View Detailed Tariffs & Directives
                </h4>
                <p className="text-gray-500">
                  Access full regulatory documents and historical data.
                </p>
              </div>
              <ArrowSquareOutIcon
                size={32}
                className="text-gray-400 group-hover:text-pink"
              />
            </a>
          </section>

          {/* FAQ Link */}
          <Link
            href="/faqs"
            className="block p-4 bg-gray-300 rounded-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  Still have questions?
                </h3>
                <p className="text-gray-900">
                  View our Frequently Asked Questions regarding billing and
                  regulation.
                </p>
              </div>
              <CaretRightIcon
                size={32}
                weight="bold"
                className="text-pink group-hover:translate-x-2 transition-transform"
              />
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
