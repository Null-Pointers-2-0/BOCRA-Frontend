"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CellTowerIcon, MagnifyingGlassIcon, CaretDownIcon, } from "@phosphor-icons/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";

const topLinks = [
  { name: "BOCRA Portal", href: "https://op-web.bocra.org.bw" },
  { name: "QOS Monitoring", href: "https://dqos.bocra.org.bw" },
  { name: "Licensing", href: "/licensing" },
  {
    name: "Telecom Statistics",
    href: "/telecom-statistics",
    icon: <CellTowerIcon />,
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
      {
        name: "A word from the Chief Executive",
        href: "/word-from-chief-executive",
      },
      {
        name: "History of Community Regulation",
        href: "/history-of-community-regulation",
      },
      { name: "Organogram", href: "/organogram" },
      { name: "Board of Directors", href: "/board-of-directors" },
      { name: "Executive Management", href: "/executive-management" },
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
      {
        name: "Draft documents and legislation",
        href: "/draft-documents-and-legislation",
      },
      { name: "ICT Licensing Framework", href: "/ict-licensing-framework" },
      {
        name: "ITU Capacity Building Workshop",
        href: "/itu-capacity-building-workshop",
      },
    ],
  },
  {
    name: "Complaints",
    href: "/complaints",
    children: [
      {
        name: "Consumer education and advice",
        href: "/consumer-education-and-advice",
      },
      { name: "Registering complaints", href: "/registering-a-complaint" },
      { name: "File a complaint", href: "/complaints" },
    ],
  },
  {
    name: "Media",
    href: "/media-center",
    children: [
      { name: "News & Events", href: "/news-and-events" },
      { name: "Speeches", href: "/speeches" },
    ],
  },
  { name: "Tenders", href: "/tenders" },
];

function DesktopNavItem({ item }: { item: (typeof navItems)[number] }) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <Link
        className="hover:text-pink transition-colors text-sm font-medium"
        href={item.href}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        // Open on click
        onClick={() => setOpen(!open)}
      >
        <button className="flex items-center gap-0.5 hover:text-pink transition-colors text-sm font-medium outline-none">
          {item.name}
          <CaretDownIcon
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-48"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {item.children.map((child) => (
          <DropdownMenuItem key={child.name} asChild>
            <Link href={child.href}>{child.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavItem({
  item,
  onClose,
}: {
  item: (typeof navItems)[number];
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <Link
        className="hover:text-pink transition-colors py-1 font-medium"
        href={item.href}
        onClick={onClose}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-1 font-medium hover:text-pink transition-colors"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {item.name}
        <CaretDownIcon
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col pl-4 pt-1 pb-2 space-y-2 border-l border-turquoise/30">
          <Link
            href={item.href}
            className="text-sm font-semibold hover:text-pink transition-colors"
            onClick={onClose}
          >
            All {item.name}
          </Link>
          {item.children.map((child) => (
            <Link
              key={child.name}
              href={child.href}
              className="text-sm hover:text-pink transition-colors"
              onClick={onClose}
            >
              {child.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoSrc = "/bocra-logo.png";

  return (
    <nav className="fixed w-full top-0 z-50 flex flex-col bg-white shadow-md">
      {/* Top utility bar */}
      <div className="hidden md:flex w-full flex-row px-6 justify-evenly items-center bg-pink text-white">
        <div className="flex items-center justify-center gap-2 py-2">
          <label htmlFor="searchBar">Search BOCRA:</label>
          <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white" />
              <Input
                type="search"
                id="searchBar"
                className="h-7 max-w-sm text-sm border-gray-100 placeholder:text-white pl-8 bg-transparent"
                placeholder="Search BOCRA..."
              />
            </div>
        </div>
        <div className="flex flex-row px-6 py-2 space-x-6">
          {topLinks.map((link) => (
            <Link
              className="hover:text-gold transition-colors text-sm flex flex-row items-center gap-1"
              key={link.name}
              href={link.href}
            >
              {link.name}
              {link.icon && link.icon}
            </Link>
          ))}
          {extraTopLinks.map((link) => (
            <Link
              className="hover:text-gold transition-colors text-sm flex flex-row items-center gap-1 bg-dark-teal text-white px-2 py-1"
              key={link.name}
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main nav row */}
      <div className="w-full flex flex-row justify-between md:justify-evenly items-center px-6 py-2">
        <Link href="/">
          <Image src={logoSrc} alt="BOCRA Logo" width={100} height={100} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-7 text-turquoise">
          {navItems.map((item) => (
            <DesktopNavItem key={item.name} item={item} />
          ))}
        </div>

        <div className="hidden md:flex md:items-center space-x-4 text-turquoise">
          {extraNavLinks.map((link) => (
            <Link
              className="transition-colors text-sm font-medium bg-turquoise text-white px-3 py-1"
              key={link.name}
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 text-turquoise"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all bg-gray-200 duration-500 ${
          menuOpen ? "max-h-screen py-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-6 space-y-3 text-turquoise">
          {navItems.map((item) => (
            <MobileNavItem
              key={item.name}
              item={item}
              onClose={() => setMenuOpen(false)}
            />
          ))}

          {/* Top utility links in mobile */}
          <div className="flex flex-col space-y-3 text-pink pt-2 border-t border-pink/20">
            {topLinks.map((link) => (
              <Link
                className="text-md flex items-center gap-1"
                key={link.name}
                href={link.href}
                target="_blank"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
                {link.icon && link.icon}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="py-2">
            <input
              type="search"
              placeholder="Search BOCRA..."
              className="w-full border border-black px-3 py-2 text-sm placeholder:text-gray-900 text-gray-700 focus:outline-none focus:ring-2 focus:ring-turquoise"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
