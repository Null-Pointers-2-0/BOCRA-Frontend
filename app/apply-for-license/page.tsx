"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

const licenseTypes = [
  { id: 1, name: "Telecommunications" },
  { id: 2, name: "Radio & Spectrum" },
  { id: 3, name: "Postal Services" },
  { id: 4, name: "Broadcasting" },
  { id: 5, name: "Telecommunications" },
  { id: 6, name: "Radio & Spectrum" },
  { id: 7, name: "Postal Services" },
  { id: 8, name: "Broadcasting" },
];

export default function LicensingPage() {
  return (
    <main className="">
      <Navbar />
      <div className="min-h-screen px-6 mt-20 md:mt-30">
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <h1 className="text-3xl font-bold">Licensing Portal</h1>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                className="h-10 md:min-w-md max-w-md text-lg rounded-none border-gray-400 placeholder:text-gray-900 pl-10"
                placeholder="Search licenses..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {licenseTypes.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-400 bg-gray-50 space-y-2"
              >
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-md leading-relaxed">
                  Apply for {item.name.toLowerCase()} certificates and
                  regulatory permits.
                </p>
                <button className="py-1 bg-turquoise text-white text-md w-full cursor-pointer">
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
