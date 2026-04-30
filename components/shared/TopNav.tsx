"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

const tabs = [
  { href: "/integration", label: "Integration" },
  { href: "/forecast", label: "Forecast" },
  { href: "/allocation", label: "Allocation" },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center px-6">
        <Link href="/integration" className="flex items-center gap-2 text-navy-600">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-navy-600 text-white">
            <Activity size={16} />
          </span>
          <span className="text-[17px] font-semibold tracking-tight">
            Trend<span className="text-teal">Pulse</span>
          </span>
        </Link>
        <nav className="mx-auto flex items-center gap-1 rounded-full border border-navy-100 bg-navy-50 p-1 text-sm">
          {tabs.map((t) => {
            const active = pathname?.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={
                  "rounded-full px-4 py-1.5 transition " +
                  (active
                    ? "bg-navy-600 text-white shadow-sm"
                    : "text-navy-500 hover:text-navy-600")
                }
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center gap-2 text-xs text-navy-400">
          <span className="inline-flex h-2 w-2 rounded-full bg-success animate-pulse" />
          <span>4 AI workloads · live</span>
        </div>
      </div>
    </header>
  );
}
