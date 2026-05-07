"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, apiBaseUrl, type RunRating } from "@/lib/dashboard-api";
import RunRatingCmp from "@/components/RunRating";

interface PipelineEvent {
  type: string;
  [key: string]: unknown;
}

export default function RunPage() {
  const { id } = useParams() as { id: string };
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [status, setStatus] = useState<"connecting" | "running" | "succeeded" | "failed">("connecting");
  const [driveUrl, setDriveUrl] = useState<string | null>(null);
  const [outputPath, setOutputPath] = useState<string | null>(null);
  const eventsBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const url = `${apiBaseUrl}/api/dashboard/runs/${encodeURIComponent(id)}/sse`;
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
          setOutputPath((ev.output_path as string) ?? null);
          es.close();
        }
        if (ev.type === "run_finished") {
          setStatus(((ev.status as string) === "failed" ? "failed" : "succeeded") as any);
          setDriveUrl((ev.drive_folder_url as string) ?? null);
          es.close();
        }
      } catch {
        // ignore parse errors
      }
    };
    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, [id]);

  // Auto-scroll
  useEffect(() => {
    if (eventsBox.current) {
      eventsBox.current.scrollTop = eventsBox.current.scrollHeight;
    }
  }, [events]);

  const stage = friendlyStage(events);
  const progress = computeProgress(events);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Generation in progress</h1>
          <p className="mt-1 text-sm text-white/60">Run ID: <code className="text-white/40">{id}</code></p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-medium">{stage}</div>
          <div className="text-sm text-white/50">{progress}%</div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full transition-all ${status === "failed" ? "bg-red-500" : status === "succeeded" ? "bg-green-500" : "bg-orange-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {(status === "succeeded" || status === "failed") && (
        <div className={`rounded-xl border p-6 ${status === "succeeded" ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}>
          {status === "succeeded" ? (
            <>
              <div className="text-lg font-semibold text-green-300">✅ Generated successfully</div>
              {driveUrl && (
                <a
                  href={driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-lg bg-orange-500 px-5 py-3 font-medium text-black hover:bg-orange-400"
                >
                  Open in Drive ↗
                </a>
              )}
              <div className="mt-4">
                <div className="mb-2 text-sm font-medium text-white/70">Оценка:</div>
                <RunRatingCmp runId={id} initialRating={null} initialNote={null} />
              </div>
              <div className="mt-4 flex gap-3">
                <Link href="/dashboard/new" className="text-sm text-white/70 hover:text-white">+ Generate another</Link>
                <Link href="/dashboard" className="text-sm text-white/70 hover:text-white">Back to dashboard</Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-semibold text-red-300">✗ Generation failed</div>
              <div className="mt-2 text-sm text-red-200/80">
                {(events.find((e) => e.type === "done")?.result as any)?.error ??
                  "Check the events log below for details."}
              </div>
            </>
          )}
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-4 py-3 text-sm font-medium">Events log</div>
        <div ref={eventsBox} className="max-h-[500px] overflow-y-auto p-4 font-mono text-xs">
          {events.length === 0 && (
            <div className="text-white/40">Waiting for first event...</div>
          )}
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    connecting: "bg-white/10 text-white/60",
    running: "bg-blue-500/20 text-blue-300",
    succeeded: "bg-green-500/20 text-green-300",
    failed: "bg-red-500/20 text-red-300",
  };
  return (
    <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${map[status]}`}>
      {status}
    </span>
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
    planning_segments: "Planning segments (Claude)",
    segments_planned: "Segments planned",
    generating_character_refs: "Generating character references (NB2)",
    character_ref_ready: `Character ref ${(last as any).index ?? "?"} ready`,
    submitting_segment: `Submitting segment ${(last as any).index ?? "?"}`,
    segment_submitted: `Segment ${(last as any).index ?? "?"} submitted to Seedance`,
    segment_polling: `Polling segment ${(last as any).index ?? "?"}`,
    segment_downloaded: `Segment ${(last as any).index ?? "?"} downloaded`,
    extracting_continuity_assets: "Extracting last frame",
    uploading_continuity_assets: "Uploading reference asset",
    concatenating_segments: "Concatenating segments (ffmpeg)",
    concatenated_segments: "Concat complete",
    transcribing: "Transcribing for captions",
    transcribed: "Transcription complete",
    uploading_to_drive: "Uploading to Drive",
    drive_uploaded: "Drive upload complete",
    done: "Done!",
  };
  return map[last.type] ?? last.type;
}

function computeProgress(events: PipelineEvent[]): number {
  if (events.length === 0) return 0;
  const last = events[events.length - 1];
  if (last.type === "done") return 100;

  // Stage budgets (cumulative %):
  //   0-15%  : setup (template selection, prompt fill, segment planning)
  //   15-30% : NB2 character ref generation (scales by completed/total)
  //   30-85% : segment generation (scales by completed segments + sub-event)
  //   85-92% : concat + music
  //   92-98% : R2 + Drive delivery
  //   100%   : done

  // Discover totals from event metadata
  const segPlanned = events.find((e) => e.type === "segments_planned") as
    | (PipelineEvent & { segment_count?: number })
    | undefined;
  const totalSegments = segPlanned?.segment_count ?? 3;

  const charGen = events.find((e) => e.type === "generating_character_refs") as
    | (PipelineEvent & { count?: number })
    | undefined;
  const totalChars = charGen?.count ?? 0;

  const completedChars = events.filter((e) => e.type === "character_ref_ready").length;
  const completedSegments = events.filter((e) => e.type === "segment_downloaded").length;

  const t = last.type;

  // Setup phase (0-15%)
  if (t === "selecting_template") return 3;
  if (t === "template_selected") return 6;
  if (t === "filling_prompts") return 9;
  if (t === "prompts_filled") return 12;
  if (t === "resuming_run") return 14;
  if (t === "planning_segments") return 13;
  if (t === "segments_planned") return 15;

  // Char refs phase (15-30%)
  if (t === "generating_character_refs") return 16;
  if (t === "character_ref_ready") {
    if (totalChars === 0) return 30;
    return Math.round(15 + (completedChars / totalChars) * 15);
  }

  // Segment generation phase (30-85%)
  const SEG_START = 30;
  const SEG_END = 85;
  const perSeg = (SEG_END - SEG_START) / Math.max(totalSegments, 1);

  const segEventTypes = ["submitting_segment", "segment_submitted", "segment_polling", "segment_downloaded", "segment_skipped"];
  if (segEventTypes.includes(t)) {
    const evWithIdx = last as PipelineEvent & { index?: number };
    const segIdx = evWithIdx.index ?? completedSegments + 1;
    const segIdx0Based = Math.max(0, segIdx - 1);
    const baseProgress = SEG_START + segIdx0Based * perSeg;
    // Sub-progress within current segment
    const subFraction =
      t === "submitting_segment"
        ? 0.1
        : t === "segment_submitted"
        ? 0.25
        : t === "segment_polling"
        ? 0.6 // poll phase is the longest — give it the most chunk
        : t === "segment_downloaded" || t === "segment_skipped"
        ? 1.0
        : 0.5;
    return Math.min(SEG_END, Math.round(baseProgress + perSeg * subFraction));
  }

  // Continuity / asset upload (between segments) — small bumps
  if (t === "extracting_continuity_assets" || t === "uploading_continuity_assets") {
    const bump = SEG_START + completedSegments * perSeg;
    return Math.min(SEG_END, Math.round(bump));
  }

  // Concat phase (85-90%)
  if (t === "concatenating_segments") return 85;
  if (t === "concatenated_segments") return 88;

  // Music phase (88-92%)
  if (t === "generating_music") return 89;
  if (t === "music_mixed" || t === "music_skipped") return 92;

  // Captions (mostly OFF; if ON then ~92-94%)
  if (t === "transcribing") return 92;
  if (t === "transcribed") return 94;

  // Upload + delivery phase (94-98%)
  if (t === "uploading_to_r2") return 95;
  if (t === "uploaded_to_r2") return 96;
  if (t === "editing") return 96;
  if (t === "edited") return 97;
  if (t === "uploading_to_drive") return 97;
  if (t === "drive_uploaded") return 98;
  if (t === "delivering_email") return 98;
  if (t === "delivered") return 99;

  // Fallback: estimate from completed segments
  if (completedSegments > 0) {
    return Math.min(SEG_END, Math.round(SEG_START + completedSegments * perSeg));
  }
  return 15;
}

function formatEvent(ev: PipelineEvent): string {
  const { type, ...rest } = ev;
  const meta = Object.entries(rest)
    .filter(([k]) => k !== "result")
    .map(([k, v]) => `${k}=${typeof v === "string" ? v.slice(0, 80) : JSON.stringify(v).slice(0, 80)}`)
    .join(" ");
  return `[${type}] ${meta}`;
}
