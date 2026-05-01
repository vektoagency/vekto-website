"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiBaseUrl } from "@/lib/dashboard-api";

interface PipelineEvent {
  type: string;
  [key: string]: unknown;
}

interface RunStreamProps {
  runId: string;
  compact?: boolean;
}

export default function RunStream({ runId, compact = false }: RunStreamProps) {
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [status, setStatus] = useState<"connecting" | "running" | "succeeded" | "failed">(
    "connecting"
  );
  const [driveUrl, setDriveUrl] = useState<string | null>(null);
  const eventsBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!runId) return;
    const url = `${apiBaseUrl}/api/dashboard/runs/${encodeURIComponent(runId)}/sse`;
    const es = new EventSource(url, { withCredentials: true });

    es.onopen = () => setStatus("running");
    es.onmessage = (e) => {
      try {
        const ev = JSON.parse(e.data) as PipelineEvent;
        setEvents((prev) => [...prev, ev]);
        if (ev.type === "drive_uploaded") setDriveUrl(ev.folder_url as string);
        if (ev.type === "done") {
          const result = ev.result as { status?: string; error?: string } | undefined;
          setStatus(result?.status === "failed" ? "failed" : "succeeded");
          es.close();
        }
        if (ev.type === "run_finished") {
          setStatus(((ev.status as string) === "failed" ? "failed" : "succeeded") as any);
          setDriveUrl((ev.drive_folder_url as string) ?? null);
          es.close();
        }
      } catch {
        // ignore
      }
    };
    es.onerror = () => es.close();

    return () => es.close();
  }, [runId]);

  useEffect(() => {
    if (eventsBox.current) {
      eventsBox.current.scrollTop = eventsBox.current.scrollHeight;
    }
  }, [events]);

  const stage = friendlyStage(events);
  const progress = computeProgress(events);

  if (compact) {
    return (
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/70 truncate">{stage}</span>
          <span className="text-white/50">{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full transition-all ${
              status === "failed"
                ? "bg-red-500"
                : status === "succeeded"
                  ? "bg-green-500"
                  : "bg-orange-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div ref={eventsBox} className="max-h-32 overflow-y-auto font-mono text-[10px] leading-tight text-white/60">
          {events.slice(-12).map((ev, i) => (
            <div key={i} className="truncate">
              [{ev.type}]
            </div>
          ))}
        </div>
        {(status === "succeeded" || status === "failed") && (
          <div className="flex items-center justify-between text-xs">
            <Link href={`/dashboard/runs/${runId}`} className="text-orange-400 hover:underline">
              Full log →
            </Link>
            {status === "succeeded" && driveUrl && (
              <a
                href={driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                Drive ↗
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-medium">{stage}</div>
          <div className="text-sm text-white/50">{progress}%</div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full transition-all ${
              status === "failed"
                ? "bg-red-500"
                : status === "succeeded"
                  ? "bg-green-500"
                  : "bg-orange-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-4 py-3 text-sm font-medium">Events log</div>
        <div ref={eventsBox} className="max-h-[500px] overflow-y-auto p-4 font-mono text-xs">
          {events.length === 0 && <div className="text-white/40">Waiting for first event...</div>}
          {events.map((ev, i) => (
            <div key={i} className="py-0.5 text-white/70">
              <span className="text-white/40">{i + 1}.</span> {formatEvent(ev)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function friendlyStage(events: PipelineEvent[]): string {
  const last = events[events.length - 1];
  if (!last) return "Starting...";
  const map: Record<string, string> = {
    selecting_template: "Selecting template",
    template_selected: "Template selected",
    filling_prompts: "Filling prompts",
    prompts_filled: "Prompts ready",
    planning_segments: "Planning segments",
    segments_planned: "Segments planned",
    generating_character_refs: "Generating character refs",
    character_ref_ready: `Char ref ${(last as any).index ?? "?"} ready`,
    submitting_segment: `Submitting seg ${(last as any).index ?? "?"}`,
    segment_submitted: `Seg ${(last as any).index ?? "?"} submitted`,
    segment_polling: `Polling seg ${(last as any).index ?? "?"}`,
    segment_downloaded: `Seg ${(last as any).index ?? "?"} downloaded`,
    extracting_continuity_assets: "Extracting last frame",
    uploading_continuity_assets: "Uploading ref asset",
    concatenating_segments: "Concat segments",
    concatenated_segments: "Concat done",
    transcribing: "Transcribing",
    transcribed: "Transcription done",
    uploading_to_drive: "Uploading to Drive",
    drive_uploaded: "Drive upload done",
    done: "Done",
  };
  return map[last.type] ?? last.type;
}

function computeProgress(events: PipelineEvent[]): number {
  const last = events[events.length - 1];
  if (!last) return 0;
  if (last.type === "done") return 100;
  const map: Record<string, number> = {
    selecting_template: 5,
    template_selected: 8,
    filling_prompts: 10,
    prompts_filled: 12,
    planning_segments: 15,
    segments_planned: 18,
    generating_character_refs: 25,
    character_ref_ready: 30,
    submitting_segment: 40,
    segment_submitted: 45,
    segment_polling: 50,
    segment_downloaded: 65,
    extracting_continuity_assets: 70,
    uploading_continuity_assets: 72,
    concatenating_segments: 80,
    concatenated_segments: 85,
    transcribing: 88,
    transcribed: 92,
    uploading_to_drive: 95,
    drive_uploaded: 98,
  };
  return map[last.type] ?? 50;
}

function formatEvent(ev: PipelineEvent): string {
  const { type, ...rest } = ev;
  const meta = Object.entries(rest)
    .filter(([k]) => k !== "result")
    .map(([k, v]) => `${k}=${typeof v === "string" ? v.slice(0, 80) : JSON.stringify(v).slice(0, 80)}`)
    .join(" ");
  return `[${type}] ${meta}`;
}
