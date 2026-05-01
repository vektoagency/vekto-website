"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type RunListItem } from "@/lib/dashboard-api";

export default function CostsPage() {
  const router = useRouter();
  const [runs, setRuns] = useState<RunListItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.me();
        if (!me.authenticated) return router.push("/dashboard/login");
        const r = await api.listRuns();
        setRuns(r.runs.filter((x) => x.total_usd != null));
      } catch {
        router.push("/dashboard/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const stats = useMemo(() => {
    if (!runs) return null;
    const total = runs.reduce((acc, r) => acc + (r.total_usd ?? 0), 0);
    const last30 = runs.filter((r) => Date.now() - new Date(r.started_at).getTime() < 30 * 24 * 60 * 60 * 1000);
    const last30Total = last30.reduce((acc, r) => acc + (r.total_usd ?? 0), 0);
    const last7 = runs.filter((r) => Date.now() - new Date(r.started_at).getTime() < 7 * 24 * 60 * 60 * 1000);
    const last7Total = last7.reduce((acc, r) => acc + (r.total_usd ?? 0), 0);

    // Per-brand breakdown
    const perBrand = new Map<string, { count: number; total: number }>();
    for (const r of runs) {
      const cur = perBrand.get(r.client) ?? { count: 0, total: 0 };
      cur.count++;
      cur.total += r.total_usd ?? 0;
      perBrand.set(r.client, cur);
    }

    // Daily breakdown (last 30 days)
    const days = new Map<string, number>();
    for (const r of last30) {
      const day = new Date(r.started_at).toISOString().slice(0, 10);
      days.set(day, (days.get(day) ?? 0) + (r.total_usd ?? 0));
    }
    const daily = Array.from(days.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([day, usd]) => ({ day, usd }));
    const dailyMax = daily.length > 0 ? Math.max(...daily.map((d) => d.usd)) : 0;

    return {
      total,
      last30Total,
      last7Total,
      avgPerVideo: runs.length > 0 ? total / runs.length : 0,
      brands: Array.from(perBrand.entries())
        .map(([client, v]) => ({ client, ...v }))
        .sort((a, b) => b.total - a.total),
      daily,
      dailyMax,
    };
  }, [runs]);

  if (loading) return <div className="text-white/60">Loading...</div>;
  if (!stats || stats.brands.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Cost analytics</h1>
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center text-white/50">
          No cost data yet — generate a video to start tracking spend.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cost analytics</h1>
        <p className="mt-1 text-sm text-white/60">Spending across all generations.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Stat label="All-time" value={`$${stats.total.toFixed(2)}`} valueClass="text-orange-400" />
        <Stat label="Last 30 days" value={`$${stats.last30Total.toFixed(2)}`} />
        <Stat label="Last 7 days" value={`$${stats.last7Total.toFixed(2)}`} />
        <Stat
          label="Avg per video"
          value={`$${stats.avgPerVideo.toFixed(2)}`}
          valueClass="text-green-400"
        />
      </div>

      {/* Daily bar chart */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-semibold mb-4">Daily spend (last 30 days)</h3>
        {stats.daily.length === 0 ? (
          <div className="text-white/40 text-sm">No data in last 30 days.</div>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {stats.daily.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center group" title={`${d.day}: $${d.usd.toFixed(2)}`}>
                <div className="text-[10px] text-white/40 opacity-0 group-hover:opacity-100 mb-0.5">${d.usd.toFixed(2)}</div>
                <div
                  className="w-full bg-orange-500 rounded-t hover:bg-orange-400 transition"
                  style={{ height: `${stats.dailyMax > 0 ? (d.usd / stats.dailyMax) * 100 : 0}%`, minHeight: "2px" }}
                />
              </div>
            ))}
          </div>
        )}
        {stats.daily.length > 0 && (
          <div className="mt-2 flex justify-between text-xs text-white/40">
            <span>{stats.daily[0].day}</span>
            <span>{stats.daily[stats.daily.length - 1].day}</span>
          </div>
        )}
      </div>

      {/* Per-brand breakdown */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-semibold mb-4">Per-brand breakdown</h3>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-white/50 border-b border-white/10">
            <tr>
              <th className="py-3">Brand</th>
              <th className="py-3 text-right">Videos</th>
              <th className="py-3 text-right">Total</th>
              <th className="py-3 text-right">Avg / video</th>
              <th className="py-3 text-right">% of total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {stats.brands.map((b) => (
              <tr key={b.client} className="hover:bg-white/5">
                <td className="py-3 font-medium">{b.client}</td>
                <td className="py-3 text-right text-white/70">{b.count}</td>
                <td className="py-3 text-right font-semibold text-orange-300">${b.total.toFixed(2)}</td>
                <td className="py-3 text-right text-white/60">${(b.total / b.count).toFixed(2)}</td>
                <td className="py-3 text-right text-white/50">
                  {((b.total / stats.total) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${valueClass ?? ""}`}>{value}</div>
    </div>
  );
}
