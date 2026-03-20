"use client"

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { InfoIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col justify-center items-center">
        <section className="flex flex-col justify-center items-center bg-[url('/hero-image.jpg')] bg-center bg-fit md:bg-contain bg-no-repeat md:bg-repeat-x h-screen w-full px-6 space-y-7">
          <div className="flex flex-col justify-center items-center space-y-7">
            <h1 className="text-4xl md:text-7xl font-bold text-white">
              Welcome to Botswana Communications Regulatory Authority
            </h1>
            <p className="text-xl md:text-2xl text-white">
              Your trusted partner in telecommunications
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center items-center w-full bg-black/60 text-white">
            <Link href="/telecommunications" className="hover:bg-turquoise/40">
              <div className="p-6 border-x border-white flex items-center gap-2">
                <div className="bg-turquoise h-6 w-6 rounded-full"></div>
                <h1 className="text-lg">TELECOMMUNICATIONS</h1>
              </div>
            </Link>
            <Link href="/broadcasting" className="hover:bg-dark-teal/40">
              <div className="p-6 border-x border-white flex items-center gap-2">
                <div className="bg-dark-teal h-6 w-6 rounded-full"></div>
                <h1 className="text-lg">BROADCASTING</h1>
              </div>
            </Link>
            <Link href="/postal" className="hover:bg-pink/40">
              <div className="p-6 border-x border-white flex items-center gap-2">
                <div className="bg-pink h-6 w-6 rounded-full"></div>
                <h1 className="text-lg">POSTAL</h1>
              </div>
            </Link>
            <Link href="/internet" className="hover:bg-gold/40">
              <div className="p-6 border-x border-white flex items-center gap-2">
                <div className="bg-gold h-6 w-6 rounded-full"></div>
                <h1 className="text-lg">INTERNET</h1>
              </div>
            </Link>
          </div>
        </section>
        <section className="flex flex-col justify-center items-center space-y-5 py-20 px-6 w-full bg-turquoise text-white">
          <div className="flex items-center gap-2">
            <InfoIcon className="text-3xl md:text-5xl" />
            <h2 className="text-2xl md:text-5xl font-semibold">About BOCRA</h2>
          </div>
          <p className="max-w-3xl text-center text-lg leading-loose">
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
        <Footer />
      </main>
    </>
  );
}
