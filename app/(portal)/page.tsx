"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard when accessing the portal root
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-slate-600 dark:text-slate-400">Redirecting to dashboard...</div>
    </div>
  );
}
