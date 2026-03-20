import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function Home() {

  return (
    <>
      <Navbar />
      <main className="flex flex-col justify-center items-center">
        <section className="flex flex-col justify-center items-center bg-[url('/hero-image.jpg')] bg-center bg-fit md:bg-contain bg-no-repeat md:bg-repeat-x h-screen w-full px-6 space-y-7">
          <div className="flex flex-col justify-start items-start space-y-7">
            <h1 className="text-7xl font-bold text-white">Welcome to Botswana Communications Regulatory Authority</h1>
            <p className="text-2xl text-white">Your trusted partner in telecommunications</p>
          </div>
          <div className="grid grid-cols-4 justify-center items-center w-full bg-black/60 text-white">
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
        <section className="h-screen w-full"></section>
      </main>
    </>
  );
}
