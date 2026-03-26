"use client";

import { Footer } from "@/components/Footer";
import HeaderSection from "@/components/HeaderSection";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function Internet() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen flex flex-col justify-center items-center px-6 mt-20 md:mt-30 space-y-4">
        <div className="max-w-5xl space-y-5">
          <HeaderSection title="Internet" />
          <p className="text-lg">
            The preamble of the Communications Regulatory Authority Act 2012
            suggests that BOCRA is responsible for the regulation of the
            communications sector in Botswana, comprising among others the
            Internet and Information and Communications Technologies (ICTs).
          </p>
          <p className="text-lg">
            The foregoing notwithstanding, BOCRA facilitates the growth of the
            Internet market as part its role to facilitate the uptake of ICTs.
            The use of smartphones has led to increased number of people with
            access to mobile internet especially among the youth.
          </p>
          <p className="text-lg">
            In a bid to improve the performance of the Internet, BOCRA issued
            Guidelines on Minimum Requirements for Internet
          </p>
          <p className="text-lg">
            <Link
              href="https://www.bocra.org.bw/sites/default/files/BOCRA%20Minimum%20Internet%20Connectivity.pdf"
              className="text-turquoise underline"
            >
              Connectivity in Hospitality Facilities
            </Link>
            , which among others sets minimum standards for Internet
            connectivity in the industry. The Guidelines are intended to provide
            guidance for the quality of Internet services and minimum bandwidth
            requirements to be adopted by both the Hospitality Facilities and
            Service Providers.
          </p>
          <HeaderSection title="Wholesale Internet Bandwidth Prices" textSize="text-2xl"/>
          <p className="text-lg">
            Wholesale Internet bandwidth prices/tariffs have been declining. The
            decline in wholesale Internet bandwidth prices is influenced by
            acquisition of Internet bandwidth capacity through the East Africa
            Sub Marine System (EASSy) and West Africa Cable System (WACS)
            undersea cables systems. It is also in keeping with international
            trends.
          </p>
          <p>
            As a converged regulator, BOCRA is responsible for regulatory
            oversight of broadcasting, internet, postal and telecommunications
            services.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
