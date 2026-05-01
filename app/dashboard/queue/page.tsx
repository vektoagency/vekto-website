"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, type BriefListItem } from "@/lib/dashboard-api";

export default function QueuePage() {
  const router = useRouter();
  const [briefs, setBriefs] = useState<BriefListItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await api.listBriefs();
      setBriefs(res.briefs);
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === briefs.length ? new Set() : new Set(briefs.map((b) => b.id))
    );
  }

  async function handleRunSelected() {
    if (selected.size === 0) return;
    setRunning(true);
    setError(null);
    try {
      await api.batchRun(Array.from(selected));
      router.push("/dashboard/runs/active");
    } catch (err) {
      setError((err as Error).message);
      setRunning(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this brief?")) return;
    try {
      await api.deleteBrief(id);
      load();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Briefs queue</h1>
          <p className="mt-1 text-sm text-white/60">
            Select briefs and queue them for batch generation. Backend respects concurrency limit.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/new"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
          >
            + New brief
          </Link>
          <button
            onClick={handleRunSelected}
            disabled={running || selected.size === 0}
            className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-black hover:bg-orange-400 disabled:opacity-50"
          >
            {running ? "Queueing..." : `🚀 Run ${selected.size} selected`}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && <p className="text-sm text-white/60">Loading...</p>}

      {!loading && briefs.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
          No briefs yet. <Link href="/dashboard/new" className="text-orange-400 underline">Create one</Link> to get started.
        </div>
      )}

      {briefs.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-black/30 text-xs uppercase tracking-wide text-white/50">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selected.size === briefs.length && briefs.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-3 py-3 text-left">Client</th>
                <th className="px-3 py-3 text-left">Product</th>
                <th className="px-3 py-3 text-left">Duration</th>
                <th className="px-3 py-3 text-left">Created</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {briefs.map((b) => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(b.id)}
                      onChange={() => toggle(b.id)}
                    />
                  </td>
                  <td className="px-3 py-3 font-medium">{b.client}</td>
                  <td className="px-3 py-3 text-white/80">{b.product_name}</td>
                  <td className="px-3 py-3 text-white/60">{b.duration_hint ?? "?"}</td>
                  <td className="px-3 py-3 text-white/50">{formatDate(b.created_at)}</td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      href={`/dashboard/briefs/${encodeURIComponent(b.id)}/clone`}
                      className="mr-3 text-xs text-white/60 hover:text-white"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-xs text-red-300/70 hover:text-red-300"
                    >
                      Delete
                    </button>
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString();
}
