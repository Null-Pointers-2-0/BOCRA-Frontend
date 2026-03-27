"use client";

import { Footer } from "@/components/Footer";
import HeaderSection from "@/components/HeaderSection";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import {
  ShieldCheck,
  Bug,
  FileSearch,
  Siren,
  Info,
  ArrowRight,
} from "lucide-react";

const auditTypes = [
  {
    icon: Bug,
    title: "Vulnerability Assessment",
    desc: "Identify and classify security weaknesses in your ICT systems, networks and applications.",
  },
  {
    icon: ShieldCheck,
    title: "Penetration Testing",
    desc: "Simulated cyberattack to test the effectiveness of your security controls.",
  },
  {
    icon: FileSearch,
    title: "Compliance Audit",
    desc: "Evaluate compliance with national and international cybersecurity standards and regulations.",
  },
  {
    icon: Siren,
    title: "Incident Response",
    desc: "Expert assistance in responding to and recovering from cybersecurity incidents.",
  },
];

export default function CybersecurityPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="min-h-[50vh] flex flex-col justify-center items-center px-6 mt-20 md:mt-30 space-y-4">
        <div className="max-w-5xl space-y-6">
          <HeaderSection title="Cybersecurity — COMM-CIRT" textSize="text-4xl" />

          <p className="text-lg text-gray-700">
            The Communications Computer Incident Response Team (COMM-CIRT) was
            established under the mandate of BOCRA as part of Botswana&apos;s
            National Cybersecurity Strategy. COMM-CIRT is responsible for
            coordinating cybersecurity incident response for the communications
            sector and providing guidance on cybersecurity best practices.
          </p>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-800">
              <Info className="h-5 w-5" />
              About COMM-CIRT
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-blue-700">
              <li>• Coordinate cybersecurity incident response for licensed operators</li>
              <li>• Provide early warning and advisory services to the communications sector</li>
              <li>• Conduct cybersecurity audits and vulnerability assessments</li>
              <li>• Build cybersecurity capacity through training and awareness programs</li>
              <li>• Collaborate with the national BW-CIRT and regional/international CIRTs</li>
            </ul>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-semibold text-amber-800">Reporting an Incident</h2>
            <p className="mt-2 text-sm text-amber-700">
              If you suspect a cybersecurity incident affecting communications
              services in Botswana, report it immediately to BOCRA COMM-CIRT.
              You can contact us via email at{" "}
              <a href="mailto:cirt@bocra.org.bw" className="font-medium underline">
                cirt@bocra.org.bw
              </a>{" "}
              or use our online audit request form below.
            </p>
          </div>
        </div>
      </section>

      {/* Audit Types */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Cybersecurity Audit Services
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {auditTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.title}
                  className="rounded-xl border bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0073ae]/10">
                      <Icon className="h-5 w-5 text-[#0073ae]" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{type.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{type.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/cybersecurity/request"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0073ae] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#005f8f]"
            >
              Request a Cybersecurity Audit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* External Links */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            External Resources
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="https://www.bocra.org.bw/bw-cirt"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border p-5 transition-shadow hover:shadow-md group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-[#0073ae]">
                BW-CIRT Website
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Botswana national Computer Incident Response Team
              </p>
            </a>
            <a
              href="https://www.bocra.org.bw"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border p-5 transition-shadow hover:shadow-md group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-[#0073ae]">
                BOCRA Official Website
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Botswana Communications Regulatory Authority
              </p>
            </a>
            <a
              href="https://www.itu.int/en/ITU-D/Cybersecurity/Pages/default.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border p-5 transition-shadow hover:shadow-md group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-[#0073ae]">
                ITU Cybersecurity
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                International Telecommunication Union cybersecurity resources
              </p>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
