"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function LicensingPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center px-6 mt-20 md:mt-30 space-y-4">
        <div className="max-w-5xl space-y-5">
          <h1 className="text-3xl font-semibold w-full flex justify-between items-center">
            Licensing
            <button className="bg-dark-teal text-white px-3 py-1 md:px-6 md:py-2 text-base">
              <Link href="/apply-for-license">Apply for License</Link>
            </button>
          </h1>
          <p className="text-lg">
            BOCRA is mandated by Sec 6 (h) of the CRA Act to process
            applications for and issue, licences, permits, permissions,
            concessions and authorities for regulated sectors being
            telecommunications, Internet, radio communications, broadcasting and
            postal.
          </p>
          <h1 className="text-3xl font-semibold">
            Licensing Framework (Telecommunications And Broadcasting)
          </h1>
          <p className="text-lg">
            In 2015, BOCRA commissioned a study to review licensing framework
            and pricing principles for telecommunications services. The study
            culminated with the introduction of a new framework intended to
            close market gaps that have existed in the previous framework and
            provide a more conducive environment for market growth and
            improvement of the welfare of the society taking into account
            convergence of technologies and evolution to Next Generation
            Networks.
          </p>
          <p className="text-lg">
            The framework has primary objective to achieve Efficiency of
            Convergence where multiple services are delivered on single network
            or platform embracing convergence of networks, services and
            technologies. It also aims to achieve Technology neutrality where
            licensed networks are not distinguished by technology but capability
            to deliver multiple and multimedia products. The framework further
            aims to achieve Ease of market entry and increased competition;
            Consumer choice; Diversification, Open Access as well as Economic
            Inclusion.
          </p>
          <p className="text-lg">
            The licensing framework covers broadcasting systems, broadcasting
            service, subscription management services, electronic
            communications, telecommunication service and telecommunication
            systems under broad areas of System license, Service license,
            Broadcasting and Re-broadcasting Licenses as provided for in the CRA
            Act.
          </p>
          <h3 className="text-xl font-semibold">
            The framework provides for three major licensing categories being:
          </h3>
          <p className="text-lg">
            Network Facilities Provider (NFP) where licensees own, operate or
            provide any form of physical infrastructure used principally for
            carrying service and applications and content. The infrastructure
            may include fixed links, radio communication transmitters,
            satellites and satellites station, submarine cable, fibre/copper
            cable, towers, switches, base stations. The facilities are for own
            use or for availing to other licensed operators on commercial basis.
            Private Telecommunications Networks fall in this category and are
            further specified in the appropriate license type to distinguish
            them from major networks.
          </p>
          <h1 className="text-3xl font-semibold">
            Services And Applications Provider (SAP)
          </h1>
          <p className="text-lg">
            SAPs are non-infrastructure based service providers that provide all
            forms of services and applications to end users using infrastructure
            of the Network Facilities Provider. The services and applications
            may be based on speech, sound, data, text and images and they
            deliver a specific function to the end user. The services and
            applications shall not be for broadcasting purposes.
          </p>
          <h1 className="text-3xl font-semibold">
            Content Services Provider (CSP)
          </h1>
          <p className="text-lg">
            CSP licensee provides content material in the form of speech or
            other sounds, text, data, images, whether still or moving solely for
            broadcasting (TV and radio) and other information services including
            Subscription TV. NB, State broadcasters do not require license to
            operate.
          </p>
          <h1 className="text-3xl font-semibold">
            Licensing Framework (Postal Services)
          </h1>
          <h3 className="text-xl font-semibold">
            In August 2015 BOCRA conducted a study to assess the postal market
            and develop appropriate licensing framework. Following conclusion of
            the study, BOCRA introduced a licensing framework that provides for
            two licensing categories for the postal sector as follows:
          </h3>
          <p className="text-lg">
            The Designated Postal Operator (DPO) licence. The licence category
            provides for a postal operator to be designated to carry universal
            postal service obligations.
          </p>
          <p className="text-lg">
            The Commercial Postal Operator (CPO) licence. The licence category
            provides for postal operators which provide value-added services.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
