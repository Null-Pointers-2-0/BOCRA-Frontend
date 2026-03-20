import Link from "next/link";

export const Navbar = () => {
  const topLinks = [
    { name: "BOCRA Portal", href: "https://op-web.bocra.org.bw" },
    { name: "QOS Monitoring", href: "https://dqos.bocra.org.bw" },
    { name: "Licensing", href: "/licensing" },
  ];

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Mandate", href: "/mandate" },
    { name: "Projects", href: "/projects" },
    { name: "Documents", href: "/documents" },
    { name: "Complaints", href: "/complaints" },
    { name: "Media", href: "/media-center" },
    { name: "Tenders", href: "/tenders" },
  ];

  const logoSrc = "/bocra-logo.png";

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <nav className="fixed top-0 left-0 right-0 flex flex-col justify-center items-center bg-white/70">
      <div className="w-full flex flex-row px-6 justify-around space-x-6 bg-pink text-white">
        <div className="flex items-center justify-center gap-2">
            <label htmlFor="searchBar">Search BOCRA: </label>
            <input id="searchBar" type="text" placeholder="Search..." className="border border-white rounded px-2 py-1" />  
        </div>
        <div className="flex flex-row px-6 py-2 space-x-6">
          {topLinks.map((link) => (
            <Link
              className="hover:text-gold transition-colors"
              key={link.name}
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-row justify-between items-center px-6 py-2">
        <div className="flex items-center justify-center">
          <img src={logoSrc} alt="BOCRA Logo" width={100} height={100} />
        </div>
        {isMobile ? (
          <div className="flex items-center justify-center">
            <button>MENU</button>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-7 text-turquoise">
            {navLinks.map((link) => (
              <Link
                className="hover:text-pink transition-colors"
                key={link.name}
                href={link.href}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
