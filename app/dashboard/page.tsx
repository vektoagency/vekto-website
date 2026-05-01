"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type RunListItem } from "@/lib/dashboard-api";

export default function DashboardHome() {
  const router = useRouter();
  const [runs, setRuns] = useState<RunListItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.me();
        if (!me.authenticated) {
          router.push("/dashboard/login");
          return;
        }
        const r = await api.listRuns();
        setRuns(r.runs);
      } catch {
        router.push("/dashboard/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return <div className="text-white/60">Loading...</div>;
  }

  const stats = {
    total: runs?.length ?? 0,
    succeeded: runs?.filter((r) => r.status === "succeeded").length ?? 0,
    running: runs?.filter((r) => r.status === "running" || r.status === "queued").length ?? 0,
    failed: runs?.filter((r) => r.status === "failed").length ?? 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-white/60">Drop a brief, generate a video.</p>
        </div>
        <Link
          href="/dashboard/new"
          className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-black hover:bg-orange-400"
        >
          + New brief
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Stat label="Total runs" value={stats.total} />
        <Stat label="Succeeded" value={stats.succeeded} valueClass="text-green-400" />
        <Stat label="In progress" value={stats.running} valueClass="text-blue-400" />
        <Stat label="Failed" value={stats.failed} valueClass="text-red-400" />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Recent projects</h2>
        {runs && runs.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
            No projects yet. <Link href="/dashboard/new" className="text-orange-400">Drop your first brief</Link>.
          </div>
        )}
        {runs && runs.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase text-white/50">
                <tr>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Started</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Drive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {runs.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-4 py-3">{r.client}</td>
                    <td className="px-4 py-3 text-white/70">{r.product_name}</td>
                    <td className="px-4 py-3 text-white/50">{formatDate(r.started_at)}</td>
                    <td className="px-4 py-3 text-white/50">
                      {r.total_usd != null ? `$${r.total_usd.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.drive_folder_url ? (
                        <a
                          href={r.drive_folder_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300"
                        >
                          Open ↗
                        </a>
                      ) : (
                        <Link
                          href={`/dashboard/runs/${r.id}`}
                          className="text-white/50 hover:text-white"
                        >
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, valueClass }: { label: string; value: number; valueClass?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${valueClass ?? ""}`}>{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    succeeded: "bg-green-500/20 text-green-300",
    failed: "bg-red-500/20 text-red-300",
    running: "bg-blue-500/20 text-blue-300",
    queued: "bg-white/10 text-white/60",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? "bg-white/10 text-white/60"}`}>
      {status}
    </span>
  );
}

function formatDate(s: string): string {
  const d = new Date(s);
  return d.toLocaleString();
}
