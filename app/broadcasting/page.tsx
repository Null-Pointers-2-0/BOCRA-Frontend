"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function Broadcasting() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen flex flex-col justify-center items-center px-6 mt-20 md:mt-30 space-y-4">
        <div className="max-w-5xl space-y-5">
          <h1 className="text-5xl font-bold text-dark-teal">Broadcasting</h1>
          <p className="text-lg">
            The CRA Act mandates BOCRA to regulate all broadcasting;
            subscription management services and re-broadcasting activities save
            for the state broadcasting. It is in this light that BOCRA regulates
            Yarona FM, Duma FM, Gabz FM and eBotswana.
          </p>
          <p className="text-lg">
            Commercial radio stations namely Yarona, Duma, Gabz FM are all
            available in most of major towns and villages in Botswana. The
            stations have extended access to their services through online
            broadcasting transmission which makes them accessible worldwide.
          </p>
          <p className="text-lg">
            eBotswana television station is currently available in Gaborone and
            surrounding villages within a 60km radius of Gaborone through
            terrestrial broadcasting. eBotswana will in future introduce a
            satellite broadcast service in order to achieve national coverage.
          </p>
          <p className="text-lg">
            Broadcasters are required to promote music tracks by local artists.
            Broadcasters' licences specify a certain percentage of local content
            to be complied with.
          </p>
          <p className="text-lg">
            Click the link for{" "}
            <Link
              href="https://www.bocra.org.bw/sites/default/files/NBB_Audience_Survey_Report_Volume_I.pdf"
              className="text-turquoise underline "
            >
              National Broadcasting Board Audience Survey
            </Link>{" "}
            for the Broadcasting Sector in Botswana.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
