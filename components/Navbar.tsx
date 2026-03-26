"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CellTowerIcon,
  MagnifyingGlassIcon,
  CaretDownIcon,
  UserPlusIcon,
  LogIcon,
  SignInIcon,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";

const topLinks = [
  { name: "BOCRA Portal", href: "https://op-web.bocra.org.bw" },
  {
    name: "Telecom Statistics",
    href: "/telecom-statistics",
    icon: <CellTowerIcon />,
  },
];

const extraTopLinks = [
  { name: "Domain Registry", href: "/domain-registry" },
  { name: "Type Approval", href: "https://typeapproval.bocra.org.bw" },
];

const extraNavLinks = [
  { name: "Login", href: "/login" },
  {
    name: "Signup",
    href: "/signup",
  },
];

type NavChild = {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
};

type NavItem = {
  name: string;
  href: string;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  {
    name: "About",
    href: "/about",
    children: [
      { name: "Profile", href: "/profile" },
      { name: "A word from the Chief Executive", href: "/word-from-chief-executive" },
      { name: "History of Community Regulation", href: "/history-of-community-regulation" },
      { name: "Organogram", href: "/organogram" },
      { name: "Board of Directors", href: "/board-of-directors" },
      { name: "Executive Management", href: "/executive-management" },
      { name: "Careers", href: "/careers" },
      { name: "Projects", href: "/projects" },
      // Mandate is nested inside About
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
    ],
  },
  {
    name: "Documents",
    href: "/documents",
    children: [
      { name: "Publications", href: "/publications" },
      { name: "Tenders", href: "/tenders" },
    ],
  },
  {
    name: "Complaints",
    href: "/complaints",
    children: [
      { name: "File a complaint", href: "/complaints" },
      { name: "Track a complaint", href: "/complaints#track" },
    ],
  },
  {
    name: "Media",
    href: "/media-center",
    children: [
      { name: "News", href: "/news" },
      { name: "Speeches", href: "/speeches" },
    ],
  },
  {
    name: "Licensing",
    href: "/licensing",
    children: [
      { name: "Apply for a license", href: "/apply-for-license" },
      { name: "License Verification", href: "/verify-license" },
    ],
  },
  {
    name: "QOS Monitoring",
    href: "/qos",
    children: [
      { name: "Network Coverage", href: "/qos/coverage" },
      { name: "QoE Review", href: "/qos/qoe" },
      { name: "Scorecard", href: "/qos/scorecard" },
    ],
  },
];

function DesktopNavItem({ item }: { item: NavItem }) {
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
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
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
        {item.children.map((child) => {
          if (child.children) {
            return (
              <DropdownMenuSub key={child.name}>
                <DropdownMenuSubTrigger>{child.name}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="min-w-44">
                  {child.children.map((grandchild) => (
                    <DropdownMenuItem key={grandchild.name} asChild>
                      <Link href={grandchild.href}>{grandchild.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          }

          return (
            <DropdownMenuItem key={child.name} asChild>
              <Link href={child.href}>{child.name}</Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNestedItem({
  child,
  onClose,
}: {
  child: NavChild;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (!child.children) {
    return (
      <Link href={child.href} className="text-md underline" onClick={onClose}>
        {child.name}
      </Link>
    );
  }

  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-1 font-semibold text-md"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {child.name}
        <CaretDownIcon
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col pl-4 py-2 space-y-2 border-l-2 border-pink/40">
          {child.children.map((grandchild) => (
            <Link
              key={grandchild.name}
              href={grandchild.href}
              className="text-md underline"
              onClick={onClose}
            >
              {grandchild.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileNavItem({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <Link className="py-1 font-medium text-lg" href={item.href} onClick={onClose}>
        {item.name}
      </Link>
    );
  }

  return (
    <div className="text-lg">
      <button
        className="flex w-full items-center justify-between py-1 font-medium"
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
          open ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col p-4 space-y-3 border-l-2 border-turquoise/60">
          {item.children.map((child) => (
            <MobileNestedItem key={child.name} child={child} onClose={onClose} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TopBarDropdown({
  link,
}: {
  link: { name: string; href: string; children: { name: string; href: string }[] };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={link.href}
        className="hover:text-gold transition-colors text-sm flex flex-row items-center gap-1"
      >
        {link.name}
        <CaretDownIcon
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </Link>
      {open && (
        <div className="absolute top-full left-0 mt-0 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[180px] z-50">
          {link.children.map((child) => (
            <Link
              key={child.name}
              href={child.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink/10 hover:text-pink transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoSrc = "/bocra-logo.png";

  return (
    <nav className="fixed w-full top-0 z-[9] flex flex-col bg-white shadow-md">
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

        <div className="hidden md:flex md:items-center text-sm space-x-4 text-turquoise">
            <Link href="/login" className="flex items-center gap-2 py-2 px-3 bg-turquoise text-white rounded-md">
              Login
              <UserPlusIcon weight="bold"/>
            </Link>

            <Link href="/signup" className="flex items-center gap-2 py-2 px-3 bg-dark-teal text-white rounded-md">
              Signup
              <SignInIcon weight="bold"/>
            </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 text-turquoise"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile sliding menu */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-[150%]"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <Image src={logoSrc} alt="BOCRA Logo" width={80} height={80} />
            </Link>
            <button
              className="p-2 text-turquoise hover:text-pink transition-colors"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-turquoise">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black" />
              <Input
                type="search"
                className="h-10 max-w-sm text-md border-black placeholder:text-gray-600 pl-8 bg-transparent"
                placeholder="Search BOCRA..."
              />
            </div>

            {navItems.map((item) => (
              <MobileNavItem
                key={item.name}
                item={item}
                onClose={() => setMenuOpen(false)}
              />
            ))}

            <div className="flex flex-col space-y-3 text-pink pt-2 border-t-2 border-pink">
              {topLinks.map((link) => (
                <Link
                  className="text-lg flex items-center gap-1"
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                  {link.icon && link.icon}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex flex-col space-y-3 pt-2 border-t-2 border-gray-300">
              <Link 
                href="/login" 
                className="flex items-center gap-2 py-2 px-3 bg-turquoise text-white rounded-md justify-center"
                onClick={() => setMenuOpen(false)}
              >
                <UserPlusIcon weight="bold" size={20} />
                Login
              </Link>

              <Link 
                href="/signup" 
                className="flex items-center gap-2 py-2 px-3 bg-dark-teal text-white rounded-md justify-center"
                onClick={() => setMenuOpen(false)}
              >
                <SignInIcon weight="bold" size={20} />
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};