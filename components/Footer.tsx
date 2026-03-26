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
  return (
    <footer className="bg-gray-50 border-t-2 border-gray-300">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* BRAND */}
        <div className="space-y-4">
          <Image
            src="/bocra-logo.png"
            alt="BOCRA logo"
            width={140}
            height={140}
          />
          <h2 className="font-semibold text-lg leading-snug">
            Botswana Communications Regulatory Authority
          </h2>
        </div>

        {/* CONTACT */}
        <div className="space-y-3">
          <h3 className="font-semibold text-xl">Contact</h3>

          <div className="flex items-start gap-2 text-md">
            <MapPinIcon size={18} />
            <p>
              Plot 50671, Independence Avenue <br />
              Gaborone, Botswana
            </p>
          </div>

          <div className="flex items-center gap-2 text-md">
            <PhoneCallIcon size={18} />
            <span>+267 395 7755</span>
          </div>

          <div className="flex items-center gap-2 text-md">
            <PrinterIcon size={18} />
            <span>+267 395 7976</span>
          </div>

          <a
            href="mailto:info@bocra.org.bw"
            className="flex items-center gap-2 text-md hover:text-pink"
          >
            <EnvelopeIcon size={18} />
            info@bocra.org.bw
          </a>
        </div>

        {/* LINKS */}
        <div className="space-y-3">
          <h3 className="font-semibold text-xl">Quick Links</h3>

          <div className="flex flex-col gap-2 text-md">
            <Link href="/tarrifs" className="hover:text-pink">
              Tariffs
            </Link>
            <Link href="/faqs" className="hover:text-pink">
              FAQs
            </Link>
            <Link href="/media-center" className="hover:text-pink">
              Media Center
            </Link>
            <Link href="/tos-and-privacy-policy" className="hover:text-pink">
              Terms & Privacy
            </Link>
          </div>
        </div>

        {/* MAP + SOCIAL */}
        <div className="space-y-4">
          <h3 className="font-semibold text-md">Location</h3>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3626.090984564571!2d25.91678387415147!3d-24.654996378063945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ebb5ba1128f935d%3A0xa164d400c9b368f5!2sBOCRA%20-%20Botswana%20Communication%20Regulatory%20Authority!5e0!3m2!1sen!2sbw!4v1774559200697!5m2!1sen!2sbw"
            width="200"
            height="200"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          ></iframe>

          <div className="flex gap-4 text-2xl">
            <Link href="#">
              <InstagramLogoIcon />
            </Link>
            <Link href="#">
              <LinkedinLogoIcon />
            </Link>
            <Link href="#">
              <YoutubeLogoIcon />
            </Link>
            <Link href="#">
              <XLogoIcon />
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-300 text-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} BOCRA. All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-pink">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-pink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
