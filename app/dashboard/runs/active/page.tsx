"use client";

import { useEffect, useState } from "react";
import { api, type RunListItem } from "@/lib/dashboard-api";
import RunStream from "@/components/RunStream";

export default function ActiveRunsPage() {
  const [active, setActive] = useState<RunListItem[]>([]);
  const [queued, setQueued] = useState<RunListItem[]>([]);
  const [concurrencyLimit, setConcurrencyLimit] = useState<number>(3);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const res = await api.listActiveRuns();
      setActive(res.active);
      setQueued(res.queued);
      setConcurrencyLimit(res.concurrency_limit);
      setLoading(false);
    } catch {
      // silent
    }
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleCancel(runId: string) {
    if (!confirm("Cancel this run?")) return;
    try {
      await api.cancelRun(runId);
      refresh();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Active runs</h1>
          <p className="mt-1 text-sm text-white/60">
            Live progress across all currently-running pipelines.
          </p>
        </div>
        <div className="text-sm text-white/60">
          🟢 {active.length}/{concurrencyLimit} running · ⏳ {queued.length} queued
        </div>
      </div>

      {loading && <p className="text-sm text-white/60">Loading...</p>}

      {!loading && active.length === 0 && queued.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
          No active runs. Upload briefs in <a href="/dashboard/new" className="text-orange-400 underline">New brief</a> and queue them.
        </div>
      )}

      {active.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {active.map((run) => (
            <div key={run.id} className="rounded-xl border border-orange-500/30 bg-orange-500/5 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-2">
                <div className="min-w-0 truncate">
                  <div className="text-sm font-medium truncate">{run.client}</div>
                  <div className="text-xs text-white/50 truncate">{run.product_name}</div>
                </div>
                <button
                  onClick={() => handleCancel(run.id)}
                  className="ml-2 rounded bg-red-500/20 px-2 py-1 text-xs text-red-300 hover:bg-red-500/30"
                  title="Cancel run"
                >
                  ✕
                </button>
              </div>
              <RunStream runId={run.id} compact />
            </div>
          ))}
        </div>
      )}

      {queued.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-sm font-medium">⏳ Queued ({queued.length})</div>
          <ul className="space-y-1">
            {queued.map((run, i) => (
              <li key={run.id} className="flex items-center justify-between rounded-md bg-black/20 px-3 py-2 text-sm">
                <div>
                  <span className="text-white/40 mr-2">#{i + 1}</span>
                  <span className="font-medium">{run.client}</span>
                  <span className="text-white/50"> · {run.product_name}</span>
                </div>
                <button
                  onClick={() => handleCancel(run.id)}
                  className="text-xs text-red-300/70 hover:text-red-300"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
