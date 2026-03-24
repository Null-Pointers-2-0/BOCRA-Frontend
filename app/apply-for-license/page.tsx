"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

const licenseTypes = [
    { id: 1, title: "Aircraft Radio License", },
    { id: 2, title: "Amateur Radio License", },
    { id: 3, title: "Broadcasting License", },
    { id: 4, title: "Cellular License", },
    { id: 5, title: "Citizen Band Radio License", },
    { id: 6, title: "Point-to-Multipoint License", },
    { id: 7, title: "Point-to-Point License", },
    { id: 8, title: "Private Radio Communication License", },
    { id: 9, title: "Radio Dealers License", },
    { id: 10, title: "Radio Frequency License", },
    { id: 11, title: "Satellite Service License", },
    { id: 12, title: "Type Approval License", },
    { id: 13, title: "VANS License", },
  ];

export default function LicensingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLicenses = licenseTypes.filter((license) =>
    license.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredLicenses.length > 0 ? (
              filteredLicenses.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col justify-between border border-gray-400 bg-gray-50 space-y-2"
                >
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-md leading-relaxed">
                    Apply for {item.title} certificates and
                    regulatory permits.
                  </p>
                  <button className="py-1 bg-turquoise text-white text-md w-full cursor-pointer">
                    Apply
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-lg text-gray-600">No licenses found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
