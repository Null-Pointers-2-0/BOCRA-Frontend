"use client";

import { Footer } from "@/components/Footer";
import HeaderSection from "@/components/HeaderSection";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function Postal() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen flex flex-col justify-center items-center px-6 mt-20 space-y-4">
        <div className="max-w-4xl space-y-5">
          <HeaderSection title="postal"/>
          <p className="text-lg">
            The CRA Act, 2012 ushered in a new dawn of regulation for the postal
            sector as BOCRA assumed the mandate of supervising the provision of
            postal services in Botswana. The CRA Act prohibits any person to
            provide postal services without a valid licence issued by BOCRA. The
            Authority is also mandated to ensure that there is provision of
            safe, reliable, efficient and affordable postal services throughout
            Botswana.
          </p>
          <p className="text-lg">
            In line with this, the Authority has prepared the ground for
            regulation of postal services by putting in place regulatory
            instruments and tools that allows ease of market entry and supports
            innovation for the provision of varied postal service offerings.
            These regulatory instruments include among others, the Postal Sector
            Licensing Framework to guide the provision of postal services in the
            country and Licence Application Requirements for licensing of
            courier service providers.
          </p>
          <HeaderSection title="Current Market Structure" textSize="text-3xl"/>
          <h3 className="text-xl font-semibold">
            The Botswana postal market comprises of two main categories of
            postal services which include the following:
          </h3>
          <ol type="i" className="text-lg space-y-5">
            <li>
              <span className="font-semibold">Ordinary Mail Services or Universal Postal Services:</span> These are
              mail services provided nation-wide, under the same conditions for
              all citizens and customers and delivered into the P.O. Box. These
              services are only provided by the Designated Public Postal
              Operator.
            </li>
            <li>
              <span className="font-semibold">Courier Services or Value-added Services:</span> These are services
              provided on a commercial basis and delivered directly to the
              addressee. These services are mainly provided by courier service
              providers. However, the Designated Public Postal Operator can also
              provide these services on a commercial basis.
            </li>
          </ol>
          <HeaderSection title="Licensing of Postal Operators" textSize="text-3xl"/>
          <h3 className="text-xl font-semibold">
            The licensing framework for the Postal Sector in Botswana comprises
            of two licence categories as outlined below:
          </h3>
          <ol type="i" className="space-y-5 text-lg">
            <li>
              <span className="font-semibold">Public Postal Operator Licence:</span> This licence is issued to only
              one postal service provider, designated by the Minister
              responsible for the Communication Sector. The licence is valid for
              a period of fifteen (15) years and may be renewed upon expiry of
              the 15-year licence period. The current Designated Public Postal
              Operator is Botswana Postal Services Limited.
            </li>
            <li>
              <span className="font-semibold">Commercial Postal Operator Licence:</span> This licence is issued to
              operators providing courier services or value-added services.
              Application for Commercial Postal Operator licence is open at any
              time and there is no limit on the number of operators to be
              licensed. The licence is valid for a period of ten (10) years and
              may be renewed upon expiry of the 10-year licence period.
            </li>
          </ol>
          <HeaderSection title="POSTAL SERVICE OPERATORS OFFERING INTERCONNECTION" textSize="text-3xl"/>
          <h3 className="text-xl font-semibold">
            <Link
              href="https://www.bocra.org.bw/sites/default/files/RIOs_Final_Public_Notice.pdf"
              className="text-turquoise underline"
            >
              POSTAL SERVICE OPERATORS OFFERING INTERCONNECTION
            </Link>
          </h3>
          <HeaderSection title="Designation of a Public Postal Operator" textSize="text-3xl"/>
          <p>
            Pursuant to Section 67 of the CRA Act, the Minister responsible for
            Communications shall, on the recommendation of the Authority
            designate one postal service provider as a Public Postal Operator. A
            Public Postal Operator carries a number of universal service
            obligations aimed at ensuring that, so far as it is practicable,
            postal services reach all inhabitants of Botswana. Invariably, this
            mandate includes provision of universal postal services in areas
            that are not commercially viable.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
