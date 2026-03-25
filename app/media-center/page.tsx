"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { 
  Megaphone, 
  BookOpen, 
  Globe, 
  Users, 
  CaretRight,
  Target,
  NewspaperClipping,
  MicrophoneStage,
  ArrowUpRight
} from "@phosphor-icons/react";

export default function MediaCenter() {
  const audience = [
    "BOCRA Board", "Government (through line ministry)", 
    "National Broadcasting Board", "Telecommunications Service Providers", 
    "Telecommunications Service Consumers", "Investors", 
    "International Telecommunications Organisations", "Media", "BOCRA Staff"
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 space-y-20">
          
          {/* Section 1: Header & Strategy */}
          <section className="space-y-8">
            <h1 className="text-6xl font-black text-gray-900 tracking-tight italic border-l-8 border-pink pl-6 uppercase">
              Media <span className="text-pink">Center</span>
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="font-semibold text-gray-900 underline decoration-pink decoration-4 underline-offset-4">
                  The BOCRA Communications Strategy aims at creating a customer driven external and internal communications process.
                </p>
                <p>
                  The communications process targets internal and external communications of BOCRA and includes traditional and non-traditional communication channels to ensure a holistic approach that is governed by a corporate communications mindset.
                </p>
                <p>
                  The underlying objective is to proactively promote a positive image of the BOCRA and ensure that BOCRA fulfils its mandate to continuously improve the sector by facilitating ongoing consultation and feedback.
                </p>
              </div>
              
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[350px] border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80" 
                  className="w-full h-full object-cover" 
                  alt="Professional Communication" 
                />
              </div>
            </div>
          </section>

          {/* Section 2: News & Speeches */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group overflow-hidden rounded-[3rem] bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all">
               <div className="h-48 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="News" />
               </div>
               <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                       <NewspaperClipping size={32} weight="duotone" />
                    </div>
                    <Link href="/news-and-events" className="p-2 bg-gray-100 rounded-full hover:bg-pink hover:text-white transition-colors">
                       <ArrowUpRight size={20} weight="bold" />
                    </Link>
                  </div>
                  <h3 className="text-2xl font-bold">News & Events</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Access the latest public notices, press releases, and upcoming regulatory events.
                  </p>
               </div>
            </div>

            <div className="relative group overflow-hidden rounded-[3rem] bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all">
               <div className="h-48 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Speech" />
               </div>
               <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-pink/5 text-pink rounded-2xl">
                       <MicrophoneStage size={32} weight="duotone" />
                    </div>
                    <Link href="/speeches" className="p-2 bg-gray-100 rounded-full hover:bg-pink hover:text-white transition-colors">
                       <ArrowUpRight size={20} weight="bold" />
                    </Link>
                  </div>
                  <h3 className="text-2xl font-bold">Official Speeches</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Read keynote addresses and official remarks from the BOCRA Executive Management and Board.
                  </p>
               </div>
            </div>
          </section>

          {/* Section 3: Information Repository Objectives */}
          <section className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
               <h2 className="text-3xl font-black uppercase tracking-widest text-gray-400">Information Repository</h2>
               <p className="text-gray-600 mt-2 font-medium">The Centre will be a repository of information targeted at:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Promoting BOCRA", icon: <Megaphone />, color: "text-blue-600", bg: "bg-blue-50", desc: "Explaining how it works, celebrating its successes, making its services and decisions more accessible." },
                { title: "Educating Public", icon: <BookOpen />, color: "text-pink", bg: "bg-pink/5", desc: "Raise awareness amongst the public about the BOCRA and informing them about services and rights." },
                { title: "Conveying Messages", icon: <Globe />, color: "text-green-600", bg: "bg-green-50", desc: "Influencing behaviour, promoting universally accessible technologies, and increasing literacy." },
                { title: "Peering", icon: <Users />, color: "text-orange-600", bg: "bg-orange-50", desc: "Fostering the exchange of staff, sharing of information and influencing international decisions." }
              ].map((obj, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-200 hover:border-pink transition-all">
                   <div className={`w-12 h-12 ${obj.bg} ${obj.color} rounded-xl flex items-center justify-center mb-4`}>
                      {obj.icon}
                   </div>
                   <h4 className="font-bold mb-2">{obj.title}</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">{obj.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Target Audience */}
          <section className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row gap-10 items-center">
               <div className="w-full md:w-1/3">
                  <div className="bg-pink/10 p-6 rounded-2xl inline-block mb-4">
                    <Target size={40} weight="duotone" className="text-pink" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Target Audience</h2>
                  <p className="text-gray-500 mt-2">The platform where BOCRA interacts with its stakeholders.</p>
               </div>
               <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {audience.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-pink transition-colors">
                      <CaretRight size={18} className="text-pink" />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
               </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}