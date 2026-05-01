import type { ReactNode } from "react";
import Link from "next/link";
import ActiveRunsBadge from "@/components/ActiveRunsBadge";

export const metadata = {
  title: "Vekto Dashboard",
  description: "Generate AI videos from briefs",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight">
            Vekto<span className="text-orange-500">.</span>Dashboard
          </Link>
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6 text-sm text-white/70">
              <Link href="/dashboard" className="hover:text-white">Home</Link>
              <Link href="/dashboard/new" className="hover:text-white">+ New brief</Link>
              <Link href="/dashboard/queue" className="hover:text-white">Queue</Link>
              <Link href="/dashboard/projects" className="hover:text-white">Projects</Link>
              <Link href="/dashboard/brands" className="hover:text-white">Brands</Link>
              <Link href="/dashboard/costs" className="hover:text-white">Costs</Link>
              <Link href="/dashboard/settings" className="hover:text-white">Settings</Link>
            </nav>
            <ActiveRunsBadge />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
