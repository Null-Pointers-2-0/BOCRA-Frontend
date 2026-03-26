import Link from "next/link";

export const PortalFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          © {year} BOCRA Internal Portal
        </p>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/faqs" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            FAQs
          </Link>
          <Link href="/complaints" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
};
