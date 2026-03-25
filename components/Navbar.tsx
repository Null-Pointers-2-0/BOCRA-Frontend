"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CellTowerIcon, MagnifyingGlassIcon, CaretDownIcon } from "@phosphor-icons/react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";

// Data arrays must stay at the top for TypeScript to "see" them in the components below
const topLinks = [
  { name: "BOCRA Portal", href: "https://op-web.bocra.org.bw" },
  { name: "QOS Monitoring", href: "https://dqos.bocra.org.bw" },
  { name: "Licensing", href: "/licensing" },
  {
    name: "Telecom Statistics",
    href: "/telecom-statistics",
    icon: <CellTowerIcon size={14} />,
  },
];

const extraTopLinks = [
  { name: "Register BW", href: "https://nic.net.bw" },
  { name: "Type Approval", href: "https://typeapproval.bocra.org.bw" },
];

const extraNavLinks = [
  { name: "ASMS-WebCP", href: "https://registration.bocra.org.bw" },
  {
    name: "License Verification",
    href: "https://customerportal.bocra.org.bw/OnlineLicenseVerification/verify",
  },
];

const navItems = [
  {
    name: "About",
    href: "/about",
    children: [
      { name: "Profile", href: "/profile" },
      { name: "A word from the CEO", href: "/word-from-chief-executive" },
      { name: "History", href: "/history-of-community-regulation" },
      { name: "Organogram", href: "/organogram" },
      { name: "Board", href: "/board-of-directors" },
      { name: "Management", href: "/executive-management" },
      { name: "Careers", href: "/careers" },
    ],
  },
  {
    name: "Mandate",
    href: "/mandate",
    children: [
      { name: "Legislation", href: "/legislation" },
      { name: "Telecommunications", href: "/telecommunications" },
      { name: "Broadcasting", href: "/broadcasting" },
      { name: "Postal", href: "/postal" },
      { name: "Internet", href: "/internet" },
      { name: "Licensing", href: "/licensing" },
    ],
  },
  { name: "Projects", href: "/projects" },
  {
    name: "Documents",
    href: "/documents",
    children: [
      { name: "Draft Documents", href: "/draft-documents-and-legislation" },
      { name: "ICT Framework", href: "/ict-licensing-framework" },
      { name: "ITU Workshop", href: "/itu-capacity-building-workshop" },
    ],
  },
  {
    name: "Complaints",
    href: "/complaints",
    children: [
      { name: "Consumer Advice", href: "/consumer-education-and-advice" },
      { name: "Registering", href: "/registering-a-complaint" },
      { name: "File a complaint", href: "/complaints" },
    ],
  },
  {name: "Media", href: "/media-center"},
  
  { name: "Tenders", href: "/tenders" },
];

function DesktopNavItem({ item }: { item: any }) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <Link className="hover:text-pink transition-colors text-sm font-medium" href={item.href}>
        {item.name}
      </Link>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center gap-0.5 hover:text-pink transition-colors text-sm font-medium outline-none"
          onClick={() => setOpen(!open)}
        >
          {item.name}
          <CaretDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="min-w-48 bg-white z-[100]" 
        onMouseEnter={() => setOpen(true)} 
        onMouseLeave={() => setOpen(false)}
      >
        {item.children.map((child: any) => (
          <DropdownMenuItem key={child.name} asChild>
            <Link href={child.href} className="cursor-pointer">
              {child.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 flex flex-col bg-white shadow-md">
      {/* Top utility bar */}
      <div className="hidden md:flex w-full px-6 justify-between items-center bg-pink text-white h-10">
        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon size={16} />
          <Input
            type="search"
            className="h-7 w-48 text-sm border-none placeholder:text-white/60 bg-white/20 text-white focus-visible:ring-0"
            placeholder="Search BOCRA..."
          />
        </div>
        <div className="flex items-center gap-6">
          {topLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:underline text-sm flex items-center gap-1">
              {link.name} {link.icon}
            </Link>
          ))}
          {extraTopLinks.map((link) => (
            <Link key={link.name} href={link.href} className="bg-slate-800 text-white px-2 py-1 text-xs rounded">
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main nav row */}
      <div className="w-full flex justify-between items-center px-12 h-20">
        <Link href="/">
          <Image src="/bocra-logo.png" alt="BOCRA Logo" width={80} height={80} priority />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-turquoise">
          {navItems.map((item) => (
            <DesktopNavItem key={item.name} item={item} />
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {extraNavLinks.map((link) => (
            <Link key={link.name} href={link.href} className="bg-turquoise text-white px-4 py-2 text-xs font-bold rounded">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Hamburger */}
        <button className="md:hidden text-turquoise" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1">
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t p-6 flex flex-col gap-4 shadow-xl overflow-y-auto max-h-[70vh]">
          {navItems.map((item) => (
            <div key={item.name} className="flex flex-col gap-2">
              <Link href={item.href} className="font-bold text-turquoise" onClick={() => setMenuOpen(false)}>
                {item.name}
              </Link>
              {item.children?.map((child) => (
                <Link key={child.name} href={child.href} className="pl-4 text-sm text-slate-500" onClick={() => setMenuOpen(false)}>
                  {child.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};