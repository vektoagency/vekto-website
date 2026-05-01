"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/dashboard-api";

export default function CloneBriefPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [stage, setStage] = useState<"cloning" | "running" | "error">("cloning");
  const [error, setError] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    (async () => {
      try {
        const me = await api.me();
        if (!me.authenticated) return router.push("/dashboard/login");
        const cloned = await api.cloneBrief(id);
        setStage("running");
        const run = await api.runBrief(cloned.id);
        router.push(`/dashboard/runs/${run.run_id}`);
      } catch (err) {
        setError((err as Error).message);
        setStage("error");
      }
    })();
  }, [id, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        {stage === "cloning" && (
          <>
            <div className="text-2xl font-bold mb-2">Cloning brief...</div>
            <div className="text-sm text-white/60">Creating a fresh copy with a new ID.</div>
          </>
        )}
        {stage === "running" && (
          <>
            <div className="text-2xl font-bold mb-2">Starting new generation...</div>
            <div className="text-sm text-white/60">Redirecting to live progress.</div>
          </>
        )}
        {stage === "error" && (
          <>
            <div className="text-2xl font-bold text-red-400 mb-2">Error</div>
            <div className="text-sm text-white/60 mb-4">{error}</div>
            <button
              onClick={() => router.push("/dashboard/projects")}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
            >
              ← Back to projects
            </button>
          </>
        )}
      </div>
    </div>
  );
}
