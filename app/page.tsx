"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Spinner } from "@hugeicons/core-free-icons";
import { InfoIcon, SpinnerBallIcon, SpinnerIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function Home() {
  const newsAndEvents = [
    { title: "PUBLIC NOTICE - BOCRA WEBSITE DEVELOPMENT HACKATHON" },
    { title: "PRESS RELEASE - BOTSWANA COLLABORATES WITH FIVE SADC MEMBER STATES TO SUBSTANTIALLY REDUCE AND HARMONISE INTERNATIONAL ROAMING TARIFFS", },
    { title: "MEDIA RELEASE - BOCRA Approves Reduced Data Prices for Botswana Telecommunications Corporation (BTC)", },
    { title: "PUBLIC NOTICE - EXPRESSION OF INTEREST (EOI) FOR INCLUSION IN THE BOTSWANA COMMUNICATIONS REGULATORY AUTHORITY'S SUPPLIER DATABASE", },
    { title: "PUBLIC NOTICE - ITA Commercial Broadcasting Radio Station Licence", },
  ];

  const documentsAndLegislation = [
    { title: "Media Release" },
    { title: "Cost Modelling Project Interim report" },
    { title: "Enforcement Guidelines" },
    { title: "Understand Broadband Connectivity" },
  ];

  const licenses = [
    { title: "Aircraft Radio License", href: "/licenses/aircraft-radio" },
    { title: "Amateur Radio License", href: "/licenses/amateur-radio" },
    { title: "Broadcasting License", href: "/licenses/broadcasting" },
    { title: "Cellular License", href: "/licenses/cellular" },
    { title: "Citizen Band Radio License", href: "/licenses/citizen-band-radio", },
    { title: "Point-to-Multipoint License", href: "/licenses/point-to-multipoint", },
    { title: "Point-to-Point License", href: "/licenses/point-to-point" },
    { title: "Private Radio Communication License", href: "/licenses/private-radio-communication", },
    { title: "Radio Dealers License", href: "/licenses/radio-dealers" },
    { title: "Radio Frequency License", href: "/licenses/radio-frequency" },
    { title: "Satellite Service License", href: "/licenses/satellite-service" },
    { title: "Type Approval License", href: "/licenses/type-approval" },
    { title: "VANS License", href: "/licenses/vans" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex flex-col justify-center items-center">
        <section className="flex flex-col justify-end items-end bg-[url('/hero-image.jpg')] bg-center bg-fit md:bg-contain bg-no-repeat md:bg-repeat-x h-screen w-full px-6 space-y-5 py-10">
          <div className="flex flex-col space-y-5">
            <h1 className="text-4xl md:text-7xl font-bold text-white">
              Welcome to the Botswana Communications Regulatory Authority
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
        <section className="bg-turquoise md:bg-[url('/about-background.jpeg')] bg-cover bg-center bg-no-repeat flex flex-col justify-start items-start md:justify-end md:items-end space-y-5 py-10 md:py-20 px-6 w-full text-white text-left">
          <div className="flex items-center gap-2 md:w-3xl">
            <h2 className="text-3xl md:text-5xl font-semibold">About BOCRA</h2>
          </div>
          <p className="max-w-3xl text-lg leading-loose">
            Botswana Communications Regulatory Authority (BOCRA) was established
            through the Communications Regulatory Authority Act, 2012 (CRA Act)
            on the 1st of April 2013 to regulate the communications sector in
            Botswana, comprising telecommunications, Internet and Information
            and Communications Technologies (ICTs), radio communications,
            broadcasting, postal services and related matters.The CRA Act
            replaced the Broadcasting Act [Cap 72:04], the Telecommunications
            Act [Cap 72:03], and caused the amendment of the Postal Services Act
            to create a converged or an integrated regulatory authority for the
            communications industry.
          </p>
        </section>
        <section className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 justify-center gap-5 items-center w-full py-10 px-6">
          <div className="h-full w-full flex flex-col justify-between space-y-5">
            <h1 className="text-3xl font-semibold">News & Events</h1>
            <div className="flex flex-col justify-center items-center space-y-5">
              {newsAndEvents.map((news, index) => (
                <ol key={index} type="I" className="list-disc list-inside">
                  <li className="font-semibold">{news.title}</li>
                </ol>
              ))}
            </div>
            <button className="bg-pink text-white w-full py-2">View All</button>
          </div>
          <div className="flex flex-col justify-between h-full w-full space-y-5">
            <h1 className="text-3xl font-semibold">Documents & Legislation</h1>
            <div className="flex flex-col space-y-5 w-full h-full">
              <Link
                href="/popular-documents"
                className="text-pink underline text-lg"
              >
                Popular Documents
              </Link>
              {documentsAndLegislation.map((document, index) => (
                <ol key={index} className="list-disc list-inside">
                  <li className="font-light">{document.title}</li>
                </ol>
              ))}
            </div>
            <button className="bg-pink text-white w-full py-2">
              View All Documents
            </button>
          </div>
          <div className="h-full w-full flex flex-col space-y-5">
            <h1 className="text-3xl font-semibold">Apply for a License</h1>
            <h3 className="text-lg">
              Choose the license you want to apply for
            </h3>
            <div className="flex flex-col space-y-2 w-full h-full">
              {licenses.map((license, index) => (
                <Link
                  key={index}
                  href={license.href}
                  className="text-pink underline text-lg"
                >
                  {license.title}
                </Link>
              ))}
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
          <button className="px-6 py-2 border border-white hover:bg-white hover:text-dark-teal cursor-pointer">
            Search Equipment
          </button>
        </section>

        <section className="flex flex-col md:justify-center md:items-center px-6 space-y-5 py-10">
          <h1 className="text-3xl md:text-5xl font-semibold">Filing Complaints</h1>
          <main className="grid grid-cols-1 md:grid-cols-3 justify-center gap-5 items-center w-full">
            <div className="w-full h-full space-y-5 border-l-2 border-black md:border-l-0 md:border-r-2 p-4 md:p-0">
              <h2 className="text-2xl font-bold">Complaints Process</h2>
              <p>
                BOCRA will investigate a consumer complaint against a service
                provider if there is sufficient evidence to establish a prima
                facie case on possible breaches of any provisions under
              </p>
            </div>
            <div className="w-full h-full space-y-5 border-l-2 border-black md:border-l-0 md:border-r-2 p-4 md:p-0">
              <h2 className="text-xl font-bold">Tools</h2>
              <p>
                In the discharge of its mandate, BOCRA, in consultation with
                various stakeholders periodically develops regulatory tools to
                establish minimum regulatory requirements and guide licensees,
                consumers and other stakeholders on regulatory expectations.
              </p>
            </div>
            <div className="w-full h-full space-y-5 border-l-2 border-black p-4 md:border-none md:p-0">
              <h2 className="text-2xl font-bold">Complaint Status</h2>
              <p>
                BOCRA will keep you updated on the status of your complaint and
                provide you with a reference number for your complaint.
              </p>
            </div>
          </main>
          <button className="px-6 py-2 border border-pink text-pink hover:bg-pink hover:text-white cursor-pointer">
            File a complaint
          </button>
        </section>
        <Footer />
      </main>
    </>
  );
}
