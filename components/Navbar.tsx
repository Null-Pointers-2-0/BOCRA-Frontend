"use client";

import {
  CaretDownIcon,
  CellTowerIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [qosOpen, setQosOpen] = useState(false);

  const topLinks = [
    { name: "BOCRA Portal", href: "https://op-web.bocra.org.bw" },
    { name: "Domain Registry", href: "/domains" },
    { name: "Licensing", href: "/licensing" },
    {
      name: "Telecom Statistics",
      href: "/telecom-statistics",
      icon: <CellTowerIcon />,
    },
  ];

  const qosChildren = [
    { name: "Network Coverage", href: "/coverage" },
    { name: "Quality of Experience", href: "/qoe" },
    { name: "Provider Scorecard", href: "/scorecard" },
  ];

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Mandate", href: "/mandate" },
    { name: "Projects", href: "/projects" },
    { name: "Complaints", href: "/complaints" },
  ];

  const documentsChildren = [
    { name: "News", href: "/news" },
    { name: "Publications", href: "/publications" },
    { name: "Tenders", href: "/tenders" },
  ];

  const logoSrc = "/bocra-logo.png";

  return (
    <nav className="fixed w-full top-0 z-50 flex flex-col bg-white shadow-md">
      <div className="hidden md:flex w-full flex-row px-6 justify-around items-center bg-pink text-white">
        <div className="flex items-center justify-center gap-2 py-2">
          <label htmlFor="searchBar">Search BOCRA:</label>
          <div className="flex flex-row p-0 px-2 m-0 items-center border">
            <MagnifyingGlassIcon />
            <input
              id="searchBar"
              type="text"
              placeholder="search..."
              className="rounded px-2 py-1 bg-transparent placeholder-white/70"
            />
          </div>
        </div>
        <div className="flex flex-row px-6 py-2 space-x-6">
          <div className="relative group">
            <button className="hover:text-gold transition-colors text-sm flex items-center gap-1 cursor-pointer">
              QoS Monitoring
              <CaretDownIcon size={12} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
              <div className="bg-white shadow-lg border rounded min-w-[200px]">
                {qosChildren.map((child) => (
                  <Link
                    key={child.name}
                    href={child.href}
                    className="block px-4 py-2 text-sm text-turquoise hover:bg-turquoise hover:text-white transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {topLinks.map((link) => (
            <Link
              className="hover:text-gold transition-colors text-sm flex flex-row items-center gap-1"
              key={link.name}
              href={link.href}
              {...(link.href.startsWith("http") ? { target: "_blank" } : {})}
            >
              {link.name}
              {link.icon && link.icon}
            </Link>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-row justify-between items-center px-6 py-2">
        <Link href="/">
          <Image src={logoSrc} alt="BOCRA Logo" width={100} height={100} />
        </Link>

        <div className="hidden md:flex items-center space-x-7 text-turquoise">
          {navLinks.map((link) => (
            <Link
              className="hover:text-pink transition-colors text-sm font-medium"
              key={link.name}
              href={link.href}
            >
              {link.name}
            </Link>
          ))}

          <div className="relative group">
            <button className="hover:text-pink transition-colors text-sm font-medium flex items-center gap-1 cursor-pointer">
              Documents
              <CaretDownIcon size={14} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
              <div className="bg-white shadow-lg border rounded min-w-[160px]">
                {documentsChildren.map((child) => (
                  <Link
                    key={child.name}
                    href={child.href}
                    className="block px-4 py-2 text-sm text-turquoise hover:bg-turquoise hover:text-white transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

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

      <div
        className={`md:hidden space-y-3 overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-screen py-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-6 space-y-3 text-turquoise">
          {navLinks.map((link) => (
            <Link
              className="hover:text-pink transition-colors py-1 font-medium"
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <button
            className="hover:text-pink transition-colors py-1 font-medium text-left flex items-center gap-1"
            onClick={() => setDocsOpen((prev) => !prev)}
          >
            Documents
            <CaretDownIcon
              size={14}
              className={`transition-transform ${docsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {docsOpen && (
            <div className="flex flex-col pl-4 space-y-2">
              {documentsChildren.map((child) => (
                <Link
                  key={child.name}
                  href={child.href}
                  className="hover:text-pink transition-colors py-1 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}

          <button
            className="hover:text-pink transition-colors py-1 font-medium text-left flex items-center gap-1"
            onClick={() => setQosOpen((prev) => !prev)}
          >
            QoS Monitoring
            <CaretDownIcon
              size={14}
              className={`transition-transform ${qosOpen ? "rotate-180" : ""}`}
            />
          </button>
          {qosOpen && (
            <div className="flex flex-col pl-4 space-y-2">
              {qosChildren.map((child) => (
                <Link
                  key={child.name}
                  href={child.href}
                  className="hover:text-pink transition-colors py-1 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex flex-col space-y-3 text-pink">
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

          <div className="py-2">
            <input
              type="search"
              placeholder="Search BOCRA..."
              className="w-full border border-black rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-turquoise"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
