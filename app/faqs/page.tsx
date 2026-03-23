"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQS() {
  const faqs = [
    {
      question:
        "Can I Use The Frequency Allocated Throughout The Country (Can I Use The Frequency Allocated For Geographical Area A At Area B)?",
      answer:
        "Radio licenses are issued per geographical (40 km) location unless advice so, if you need to change location one need to submit an application requesting for reuse of the same frequency in another area. If the frequency is not used in the area that you want to use it you may be authorized to use it. Note that the frequency allocated for one location is strictly for that area and may not be reused in another area without the consent of BOCRA.",
    },
    {
      question: "Can I Buy Radios For Personal Use From Outside The Country? ",
      answer:
        "BOCRA encourage customers to buy radio equipment from local, recognizedradio dealers for the simple reason that if they are faulty you can always takethem back for repair and to also ensure that if they are not programmed properly or need to be deprogrammed you can always have them done locally by your dealer. Note that it is illegal to enter the country with radio equipment that has not been licensed, unless on the expressed authority from the BOCRA.",
    },
    {
      question:
        "Do I Have To Type Approve Equipment That Is Already Type Approved?",
      answer:
        "Type approval of radio equipment has to be done on every equipment that comes into the market, unless if the equipment has been type approved with BOCRA by the manufacturer on behalf of the distributor, BOCRA also wants to satisfy itself that the equipment indeed comply to the standards and technical information that has been provided on the previous application. Note that any variation on the software will require a new type approval.",
    },
    {
        question: "How Does A Radio Dealer Assist In Acquiring A Radio License?",
        answer: "A radio dealer is a company that has the expertise of maintaining radio equipment. It is a company that sell radios, repair those radios as well as program radios to the allocated frequency or deprogrammed them once they are no longer in use. It is a company that understands the impact that radio equipment may have to human health and the importance of tuning the radios to the allocated frequency."
    },
    {
        question: "What Are The Requirements To Have Equipment Type Approved?",
        answer: "For type approval of equipments one needs to fill a type approval form indicating his/her business, technical specification of the equipment that he/she wants to type approved, type approval certificate from region1(Africa and Europe/ or any recognized regulator), declaration of conformity from manufacturer. Note for type approval one has to have a repair centre locally or a local office where those equipment maybe taken for repair even though he/she may be importing the equipment from outside."
    }, 
    {
        question: "What Are The Requirements To Sell And Maintain Radio Equipments And How To You Go About Getting The License?",
        answer: "In order to repair, distribute (sell) radio equipment you require a Radio Dealers license. This license can be obtained from BOCRA after clearly demonstrating that you have the expertise to work with radio equipment and that you have test equipment that you can use to test and tune those radios to the allocated frequency and that financially you can sustain the business. Refer to requirements to have a dealer's license."
    }, 
    {
        question: "How Do I Go About Disposing Radios That I Do Not Need?",
        answer: "To dispose of radio equipment the following steps should be followed: A company wishing to dispose off their radio equipment must write to BOCRA indicating what they intend doing with their radios which they no longer require. Secondly, depending on the status of the radio (still serviceable or unusable) they may take them to a radio dealer who will remove the frequency from the radios (deprogramming), and if they can no longer be used will prepare a boarding certificate. Those that are still in good working condition, once deprogrammed may be sold to a licensed radio operator or the company taking them over must be willing to license them, or may take them to the auctioneers for disposal Note: if you have radios they must be licensed according to the Telecommunication Act whether in use or not."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex flex-col md:justify-center md:items-center min-h-screen px-6 mt-20 md:mt-30">
        <div className="w-full max-w-6xl space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">FAQs</h1>
            <p className="text-lg text-gray-600">Frequently Asked Questions</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-5">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-400 bg-gray-50 px-4"
              >
                <AccordionTrigger className="text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-lg h-fit">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </>
  );
}
