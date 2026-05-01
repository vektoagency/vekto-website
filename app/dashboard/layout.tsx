import type { ReactNode } from "react";
import Link from "next/link";

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
          <nav className="flex items-center gap-6 text-sm text-white/70">
            <Link href="/dashboard" className="hover:text-white">Home</Link>
            <Link href="/dashboard/new" className="hover:text-white">+ New brief</Link>
            <Link href="/dashboard/projects" className="hover:text-white">Projects</Link>
            <form action="/api/dashboard-logout" method="post">
              <button type="submit" className="text-white/40 hover:text-white">Logout</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
