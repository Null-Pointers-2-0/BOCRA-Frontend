import {
  EnvelopeIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  MapPinIcon,
  PhoneCallIcon,
  PrinterIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  const logoSrc = "/bocra-logo.png";

  return (
    <footer className="grid grid-cols-1 md:grid-cols-3 px-6 py-10 gap-5 space-y-2">
      <div className="flex flex-col justify-start items-start space-y-2 w-full h-full">
        <Image
          alt="Botswana Communications Regulatory Authority logo"
          src={logoSrc}
          width={200}
          height={200}
        />
        <p className="font-bold text-xl">
          Botswana Communications Regulatory Authority
        </p>
        <p className="flex flex-row justify-center items-center gap-2 text-xl">
          <MapPinIcon /> Plot 50671,
        </p>
        <p className="text-xl">Independence Avenue,</p>
        <p className="text-xl">Gaborone, Botswana</p>
        <p className="flex flex-row justify-center items-center gap-2 text-xl">
          <PhoneCallIcon /> Telephone: +267 395 7755
        </p>
        <p className="flex flex-row justify-center items-center gap-2 text-xl">
          <PrinterIcon /> Fax: +267 395 7976
        </p>
        <a
          href="mailto:info@bocra.org.bw"
          className="flex flex-row justify-center items-center gap-2 text-xl"
        >
          <EnvelopeIcon /> Email: info@bocra.org.bw
        </a>
      </div>
      <div className="flex flex-col space-y-2 h-full w-full">
        <h1 className="text-2xl font-semibold">Quick Links</h1>
        <Link href={"/tarrifs"} className="text-xl underline">
          Tarrifs
        </Link>
        <Link href={"/faqs"} className="text-xl underline">
          FAQs
        </Link>
        <Link href={"/links"} className="text-xl underline">
          Links
        </Link>
        <Link href={"/tos-and-privacy-policy"} className="text-xl underline">
          Terms of Service and Privacy Policy
        </Link>
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold">Socials</h1>
          <div className="flex flex-row items-center gap-5 text-xl">
            <Link href={"#"}>
              <InstagramLogoIcon />
            </Link>
            <Link href={"#"}>
              <LinkedinLogoIcon />
            </Link>
            <Link href={"#"}>
              <YoutubeLogoIcon />
            </Link>
            <Link href={"#"}>
              <XLogoIcon />
            </Link>
          </div>
        </div>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1913.0357611799225!2d25.917799616730857!3d-24.654878451458323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ebb5ba1128f935d%3A0xa164d400c9b368f5!2sBOCRA%20-%20Botswana%20Communication%20Regulatory%20Authority!5e0!3m2!1sen!2sbw!4v1774121860010!5m2!1sen!2sbw"
        style={{ border: 0, height: 200, width: 300 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </footer>
  );
};
