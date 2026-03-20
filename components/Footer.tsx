import { EnvelopeIcon, MapPinAreaIcon, MapPinIcon, PrinterIcon } from "@phosphor-icons/react";
import { PhoneCallIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image"
import Link from "next/link";

export const Footer = ()=>{

    const logoSrc = "/bocra-logo.png";

    return(
        <footer className="grid grid-cols-1 md:grid-cols-2 p-6">
            <div className="flex flex-col justify-start items-start space-y-3 md:pr-4 border-b-2 pb-4 md:border-r-2">
                <Image alt="Botswana Communications Regulatory Authority logo" src={logoSrc} width={200} height={200}/>
                <p className="font-bold text-xl">Botswana Communications Regulatory Authority</p>
                <p className="flex flex-row justify-center items-center gap-2 text-xl"><MapPinIcon/> Plot 50671 Independence Avenue, Gaborone, Botswana</p>
                <p className="flex flex-row justify-center items-center gap-2 text-xl"><PhoneCallIcon /> Telephone: +267 395 7755</p>
                <p className="flex flex-row justify-center items-center gap-2 text-xl"><PrinterIcon /> Fax: +267 395 7976</p>
                <p className="flex flex-row justify-center items-center gap-2 text-xl"><EnvelopeIcon /> Email: info@bocra.org.bw</p>
            </div>
            <div className="flex flex-col items-start justify-start gap-5">
                <Link href={"/tarrifs"} className="text-xl">Tarrifs</Link>
                <Link href={"/faqs"} className="text-xl">FAQs</Link>
                <Link href={"/links"} className="text-xl">Links</Link>
                <Link href={"/privacy-notice"} className="text-xl">Privacy Notice</Link>
            </div>
        </footer>
    )
}