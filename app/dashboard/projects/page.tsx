"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type RunListItem, type RunRating } from "@/lib/dashboard-api";
import RunRatingCmp, { RatingBadge } from "@/components/RunRating";

type StatusFilter = "all" | "succeeded" | "running" | "failed";
type RatingFilter = "all" | "unrated" | RunRating;

export default function ProjectsPage() {
  const router = useRouter();
  const [runs, setRuns] = useState<RunListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");

  useEffect(() => {
    (async () => {
      try {
        const me = await api.me();
        if (!me.authenticated) return router.push("/dashboard/login");
        const r = await api.listRuns();
        setRuns(r.runs);
      } catch {
        router.push("/dashboard/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const brands = useMemo(() => {
    if (!runs) return [];
    return Array.from(new Set(runs.map((r) => r.client))).sort();
  }, [runs]);

  const filtered = useMemo(() => {
    if (!runs) return [];
    return runs.filter((r) => {
      if (statusFilter !== "all") {
        if (statusFilter === "running" && r.status !== "running" && r.status !== "queued") return false;
        if (statusFilter !== "running" && r.status !== statusFilter) return false;
      }
      if (brandFilter !== "all" && r.client !== brandFilter) return false;
      if (ratingFilter !== "all") {
        if (ratingFilter === "unrated" && r.rating != null) return false;
        if (ratingFilter !== "unrated" && r.rating !== ratingFilter) return false;
      }
      if (search) {
        const s = search.toLowerCase();
        if (
          !r.client.toLowerCase().includes(s) &&
          !r.product_name.toLowerCase().includes(s) &&
          !r.brief_id.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [runs, search, statusFilter, brandFilter]);

  if (loading) return <div className="text-white/60">Loading...</div>;

  const totalCost = filtered.reduce((acc, r) => acc + (r.total_usd ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-white/60">All past video generations.</p>
        </div>
        <Link
          href="/dashboard/new"
          className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-black hover:bg-orange-400"
        >
          + New brief
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by client, product, or brief id..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[240px] rounded-lg bg-black/40 border border-white/15 px-4 py-2 text-sm text-white outline-none focus:border-orange-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="all">All statuses</option>
          <option value="succeeded">Succeeded</option>
          <option value="running">Running</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="all">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value as RatingFilter)}
          className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="all">All ratings</option>
          <option value="good">✅ става</option>
          <option value="edit">✂️ за едит</option>
          <option value="bad">❌ не става</option>
          <option value="unrated">Unrated</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Filtered runs" value={filtered.length.toString()} />
        <Stat
          label="Succeeded"
          value={filtered.filter((r) => r.status === "succeeded").length.toString()}
          valueClass="text-green-400"
        />
        <Stat label="Total cost" value={`$${totalCost.toFixed(2)}`} valueClass="text-orange-400" />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
          No matching runs.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase text-white/50">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Started</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-4 py-3 font-medium">{r.client}</td>
                  <td className="px-4 py-3 text-white/70">{r.product_name}</td>
                  <td className="px-4 py-3 text-white/50">{formatDate(r.started_at)}</td>
                  <td className="px-4 py-3 text-white/60">
                    {r.total_usd != null ? `$${r.total_usd.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "succeeded" ? (
                      <RunRatingCmp
                        runId={r.id}
                        initialRating={r.rating}
                        initialNote={r.rating_note}
                        size="sm"
                        onChange={(newRating) => {
                          setRuns((prev) =>
                            prev?.map((x) => (x.id === r.id ? { ...x, rating: newRating } : x)) ?? null
                          );
                        }}
                      />
                    ) : (
                      <RatingBadge rating={r.rating} />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      {r.drive_folder_url && (
                        <a
                          href={r.drive_folder_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 text-xs"
                        >
                          Drive ↗
                        </a>
                      )}
                      <Link
                        href={`/dashboard/runs/${r.id}`}
                        className="text-white/60 hover:text-white text-xs"
                      >
                        View
                      </Link>
                      {(r.status === "succeeded" || r.status === "failed") && (
                        <Link
                          href={`/dashboard/briefs/${r.brief_id}/clone`}
                          className="text-blue-400 hover:text-blue-300 text-xs"
                        >
                          ↻ Re-run
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
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
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? "bg-white/10 text-white/60"}`}
    >
      {status}
    </span>
  );
}

function formatDate(s: string): string {
  const d = new Date(s);
  return d.toLocaleString();
}
