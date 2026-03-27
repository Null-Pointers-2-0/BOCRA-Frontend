"use client";

import { Footer } from "@/components/Footer";
import HeaderSection from "@/components/HeaderSection";
import { Navbar } from "@/components/Navbar";

export default function Telecommunications() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen flex flex-col justify-center items-center px-6 mt-20 space-y-4">
        <div className="max-w-4xl space-y-5">
          <HeaderSection title="Telecommunications" textSize="text-2xl" />
          <p className="text-lg">
            Under the Communications Regulatory Authority Act 2012, BOCRA has
            authority - within the guidelines established by the 1995
            Telecommunication Policy to regulate telecommunications, among other
            sub-sectors communications. The telecommunications sector, sparred
            by the mobile technology, continues to experience significant growth
            in terms of the total number of consumers and variety of services.
          </p>
          <p className="text-lg">
            The Telecommunications/ICT sector has undergone numerous reforms
            since the introduction of competition in 1998. Currently three
            Public Telecommunication Operators (PTOs) provide local,
            international, national and mobile services. The market structure
            for local services, domestic long distance services, market for
            international long distance services and market structure for mobile
            services has been partly liberalised. The telecommunications market
            is dominated by the three operators which operate under Public
            Telecommunications Operator (PTO) licence namely Botswana
            Telecommunications Limited (BTCL), Mascom Wireless Botswana (Pty)
            Ltd (Mascom) and Orange Botswana (Pty) Ltd (Orange). The other major
            player in the market is Botswana Fibre Networks (BoFiNet) which was
            issued an interim licence to provide wholesale services beginning 1
            April 2013. BoFiNet started offering services in October 2013. Other
            market players are the Value Added Network Services (VANS)
            providers.{" "}
          </p>
          <p className="text-lg">
            Although the PTO licence allows the operators to offer both mobile
            and fixed telephony services and products, Mascom and Orange
            continue to offer mobile telephony services only including mobile
            internet and value add services while BTCL provides both the fixed
            and mobile telephony services including data network services,
            providing access and connectivity.
          </p>
          <p className="text-lg">
            The market for private networks is fully liberalised as Value Added
            Services (VANS) may provide services using any technology including
            very small aperture terminals (VSAT). The market for terminal
            equipment trade is also fully liberalised as no telecommunications
            licence is required to sell terminal equipment, however, vendors for
            radio equipment have to be approved by the BOCRA, as one of the
            functions of the BOCRA is to type approve communication equipment.
          </p>
          <p className="text-lg">
            In addition, Private Telecommunications Network Licences (PTNL) have
            been issued to entities to build private networks for internal
            business use.
          </p>
          <p className="text-lg">
            BOCRA reviewed the old ICT licensing framework that has been in
            operation since 2007 and began implementation of the new and
            converged framework in September 2015. The new ICT licensing
            framework was meant to create a more conducive environment for ICT
            development. Its development was motivated by the need to meet
            demand for real-time high quality and affordable services, and to
            accommodate emerging players for increased competitiveness. It is
            intended to deliver enhanced value proposition for consumers and the
            entire Botswana market.
          </p>
          <p className="text-lg">
            The revised licensing framework has two major categories which are
            Network Facilities Provider Licence (NFP) and the Services and
            Applications Provider Licence (SAP) compared to the previous one
            which had three licence categories being PTO, VANS and PTNL.
          </p>
          <p className="text-lg">
            The market for Internet telephony is also fully liberalised, and
            VANS are allowed to provide voice over internet protocol (VoIP)
            services. The number of PTOs has been restricted to three as a
            policy decision. In 2006, the Government of Botswana decided to
            privatise the incumbent, Botswana Telecommunications Corporation
            (BTC). Following the Government's decision to privatize BTC, in
            2008, Parliament enacted the BTC (Transition) Act to assist the
            privatisation process. Consequently, the Botswana Fibre Networks
            (BoFiNet) was created as a wholesale provider of national and
            international telecommunication infrastructure while BTC remained a
            retailer. In 2008 BTC introduced its mobile network, beMOBILE. On
            the 1st of November 2012, BTC was converted from a statutory body
            into a public company limited by shares, in accordance with the
            Transition Act and Companies Act, and renamed Botswana
            Telecommunications Corporation Limited.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
