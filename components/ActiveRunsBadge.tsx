"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/dashboard-api";

export default function ActiveRunsBadge() {
  const [active, setActive] = useState(0);
  const [queued, setQueued] = useState(0);
  const [limit, setLimit] = useState(3);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function tick() {
      try {
        const res = await api.listActiveRuns();
        if (!mounted) return;
        setActive(res.active.length);
        setQueued(res.queued.length);
        setLimit(res.concurrency_limit);
        setVisible(res.active.length > 0 || res.queued.length > 0);
      } catch {
        // ignore
      }
    }
    tick();
    const interval = setInterval(tick, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <Link
      href="/dashboard/runs/active"
      className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200 hover:bg-orange-500/20"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
      </span>
      🟢 {active}/{limit} running{queued > 0 ? ` · ⏳ ${queued} queued` : ""}
    </Link>
  );
}
