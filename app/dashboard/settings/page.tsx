"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/dashboard-api";

export default function SettingsPage() {
  const [limit, setLimit] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    api.getSettings()
      .then((s) => {
        setLimit(s.concurrency_limit);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const s = await api.setSettings({ concurrency_limit: limit });
      setLimit(s.concurrency_limit);
      setSavedAt(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-white/60">Pipeline behavior and limits.</p>
      </div>

      {loading && <p className="text-sm text-white/60">Loading...</p>}

      {!loading && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Concurrent runs limit</h2>
            <p className="mt-1 text-sm text-white/60">
              How many videos to generate in parallel. Start at 3. Push to 5 once you confirm
              there are no rate-limit errors in logs.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={10}
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value, 10))}
              className="flex-1 accent-orange-500"
            />
            <div className="w-16 rounded-lg bg-black/40 px-3 py-2 text-center font-mono text-lg">
              {limit}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-white/40">
              {limit <= 2 && "Conservative — safest for testing."}
              {limit === 3 && "Recommended starting point."}
              {limit === 4 && "Comfortable for stable APIs."}
              {limit === 5 && "Push only after monitoring for rate-limits."}
              {limit > 5 && "⚠ Watch logs closely — Anthropic / kie.ai limits may bite."}
            </div>
            <div className="flex items-center gap-3">
              {savedAt && <span className="text-xs text-green-300">Saved {savedAt}</span>}
              <button
                onClick={save}
                disabled={saving}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-black hover:bg-orange-400 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
