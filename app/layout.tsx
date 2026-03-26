import type { Metadata } from "next";
import { Instrument_Sans, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const poppins = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "arial"],
});


export const metadata: Metadata = {
  title: "Botswana Communications Regulatory Authority",
  description: "Botswana Communications Regulatory Authority",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("antialiased", poppins.className, "font-sans", inter.variable)}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
