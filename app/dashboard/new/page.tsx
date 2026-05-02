"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/dashboard-api";

interface BatchResult {
  filename: string;
  brief?: any;
  warnings?: string[];
  error?: string;
  briefId?: string;
  saved?: boolean;
}

export default function NewBriefPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"file" | "text" | "batch">("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Batch mode state
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchResults, setBatchResults] = useState<BatchResult[] | null>(null);
  const [batchSaving, setBatchSaving] = useState(false);

  async function handleBatchParse() {
    setError(null);
    setLoading(true);
    setBatchResults(null);
    try {
      const res = await api.intakeBatch(batchFiles);
      setBatchResults(res.results);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBatchSaveAndRun() {
    if (!batchResults) return;
    setError(null);
    setBatchSaving(true);
    try {
      const briefIds: string[] = [];
      const updated: BatchResult[] = [];
      for (const result of batchResults) {
        if (!result.brief || result.error) {
          updated.push(result);
          continue;
        }
        try {
          const saved = await api.saveBrief(result.brief);
          updated.push({ ...result, briefId: saved.id, saved: true });
          briefIds.push(saved.id);
        } catch (err) {
          updated.push({ ...result, error: (err as Error).message });
        }
      }
      setBatchResults(updated);
      if (briefIds.length > 0) {
        await api.batchRun(briefIds);
        router.push("/dashboard/runs/active");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBatchSaving(false);
    }
  }

  async function handleGenerate() {
    setError(null);
    setLoading(true);
    try {
      // Step 1: parse the brief (intake)
      const res = mode === "file" && file
        ? await api.intakeFile(file)
        : await api.intakeText(text);
      // Step 2: save it
      const saved = await api.saveBrief(res.brief);
      // Step 3: queue the run
      const run = await api.runBrief(saved.id);
      // Step 4: jump straight to the run page
      router.push(`/dashboard/runs/${run.run_id}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New brief</h1>
        <p className="mt-1 text-sm text-white/60">
          Drop a DOCX, PDF, or paste plain text. Pipeline parses it and shows the brief for review.
        </p>
      </div>

      {!batchResults && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              className={`rounded-lg px-3 py-1.5 text-sm ${mode === "file" ? "bg-orange-500 text-black" : "bg-white/10 text-white/70"}`}
              onClick={() => setMode("file")}
            >
              Single file
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-1.5 text-sm ${mode === "batch" ? "bg-orange-500 text-black" : "bg-white/10 text-white/70"}`}
              onClick={() => setMode("batch")}
            >
              📦 Batch upload
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-1.5 text-sm ${mode === "text" ? "bg-orange-500 text-black" : "bg-white/10 text-white/70"}`}
              onClick={() => setMode("text")}
            >
              Paste text
            </button>
          </div>

          {mode === "file" && (
            <label className="block">
              <div
                className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-black/30 p-8 hover:border-orange-500/50 ${file ? "border-orange-500/50" : ""}`}
              >
                <div className="text-4xl">📁</div>
                <div className="mt-3 text-white/80">
                  {file ? file.name : "Drop DOCX or PDF here"}
                </div>
                <div className="mt-1 text-xs text-white/40">
                  or click to browse
                </div>
              </div>
              <input
                type="file"
                accept=".docx,.pdf,.txt,.md"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          )}

          {mode === "batch" && (
            <label className="block">
              <div
                className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-black/30 p-8 hover:border-orange-500/50 ${batchFiles.length > 0 ? "border-orange-500/50" : ""}`}
              >
                <div className="text-4xl">📦</div>
                <div className="mt-3 text-white/80">
                  {batchFiles.length > 0
                    ? `${batchFiles.length} files selected`
                    : "Drop multiple DOCX / PDF files here"}
                </div>
                <div className="mt-1 text-xs text-white/40">
                  Each becomes a separate brief — review before queueing
                </div>
                {batchFiles.length > 0 && (
                  <ul className="mt-4 max-h-32 w-full space-y-1 overflow-y-auto text-xs text-white/60">
                    {batchFiles.map((f, i) => (
                      <li key={i} className="truncate">• {f.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <input
                type="file"
                accept=".docx,.pdf,.txt,.md"
                multiple
                className="hidden"
                onChange={(e) => setBatchFiles(Array.from(e.target.files ?? []))}
              />
            </label>
          )}

          {mode === "text" && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              className="w-full rounded-lg bg-black/40 border border-white/15 px-4 py-3 font-mono text-sm text-white outline-none focus:border-orange-500"
              placeholder="Paste the full brief text here..."
            />
          )}

          <button
            onClick={mode === "batch" ? handleBatchParse : handleGenerate}
            disabled={
              loading ||
              (mode === "file" && !file) ||
              (mode === "text" && text.length < 30) ||
              (mode === "batch" && batchFiles.length === 0)
            }
            className="mt-4 rounded-lg bg-orange-500 px-5 py-2.5 font-medium text-black hover:bg-orange-400 disabled:opacity-50"
          >
            {loading
              ? mode === "batch"
                ? `Parsing ${batchFiles.length} briefs...`
                : "Generating..."
              : mode === "batch"
                ? `🚀 Parse ${batchFiles.length} briefs →`
                : "🚀 Generate"}
          </button>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>
      )}

      {batchResults && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium">
                Batch result — {batchResults.filter((r) => r.brief).length} parsed,{" "}
                {batchResults.filter((r) => r.error).length} failed
              </div>
            </div>
            <ul className="space-y-2">
              {batchResults.map((r, i) => (
                <li
                  key={i}
                  className={`rounded-lg border px-3 py-2 text-sm ${r.error ? "border-red-500/30 bg-red-500/10" : r.saved ? "border-green-500/30 bg-green-500/10" : "border-white/10 bg-black/30"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{r.filename}</span>
                    {r.saved && <span className="text-green-400 text-xs">✓ queued</span>}
                  </div>
                  {r.brief && (
                    <div className="mt-1 text-xs text-white/60">
                      {r.brief.client} · {r.brief.product?.name} · {r.brief.creative?.duration ?? "?"}
                    </div>
                  )}
                  {r.error && (
                    <div className="mt-1 text-xs text-red-300">{r.error}</div>
                  )}
                  {r.warnings && r.warnings.length > 0 && (
                    <details className="mt-1 text-xs text-yellow-300/80">
                      <summary>{r.warnings.length} warnings</summary>
                      <ul className="mt-1 list-disc pl-4">
                        {r.warnings.map((w, j) => (
                          <li key={j}>{w}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBatchSaveAndRun}
              disabled={batchSaving || batchResults.every((r) => !r.brief || r.error)}
              className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-black hover:bg-orange-400 disabled:opacity-50"
            >
              {batchSaving
                ? "Saving & queueing..."
                : `🚀 Queue ${batchResults.filter((r) => r.brief && !r.error).length} briefs`}
            </button>
            <button
              onClick={() => {
                setBatchResults(null);
                setBatchFiles([]);
              }}
              className="rounded-lg border border-white/15 px-5 py-3 text-white/70 hover:bg-white/5"
            >
              ← Back
            </button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      )}

    </div>
  );
}
