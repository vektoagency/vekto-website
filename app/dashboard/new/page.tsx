"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/dashboard-api";

export default function NewBriefPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"file" | "text">("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [briefDraft, setBriefDraft] = useState<any>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingJson, setEditingJson] = useState<string>("");

  async function handleParse() {
    setError(null);
    setLoading(true);
    try {
      const res = mode === "file" && file
        ? await api.intakeFile(file)
        : await api.intakeText(text);
      setBriefDraft(res.brief);
      setWarnings(res.warnings ?? []);
      setEditingJson(JSON.stringify(res.brief, null, 2));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAndRun() {
    setError(null);
    setLoading(true);
    try {
      let parsed: unknown;
      try {
        parsed = JSON.parse(editingJson);
      } catch {
        throw new Error("JSON is invalid — fix syntax errors first");
      }
      const saved = await api.saveBrief(parsed);
      const run = await api.runBrief(saved.id);
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

      {!briefDraft && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              className={`rounded-lg px-3 py-1.5 text-sm ${mode === "file" ? "bg-orange-500 text-black" : "bg-white/10 text-white/70"}`}
              onClick={() => setMode("file")}
            >
              Upload file
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-1.5 text-sm ${mode === "text" ? "bg-orange-500 text-black" : "bg-white/10 text-white/70"}`}
              onClick={() => setMode("text")}
            >
              Paste text
            </button>
          </div>

          {mode === "file" ? (
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
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              className="w-full rounded-lg bg-black/40 border border-white/15 px-4 py-3 font-mono text-sm text-white outline-none focus:border-orange-500"
              placeholder="Paste the full brief text here..."
            />
          )}

          <button
            onClick={handleParse}
            disabled={loading || (mode === "file" ? !file : text.length < 30)}
            className="mt-4 rounded-lg bg-orange-500 px-5 py-2.5 font-medium text-black hover:bg-orange-400 disabled:opacity-50"
          >
            {loading ? "Parsing..." : "Parse brief →"}
          </button>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>
      )}

      {briefDraft && (
        <div className="space-y-4">
          {warnings.length > 0 && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="mb-2 text-sm font-medium text-yellow-300">⚠ Warnings</div>
              <ul className="list-disc pl-5 text-sm text-yellow-100/90 space-y-1">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium">Brief JSON (editable)</div>
              <div className="text-xs text-white/40">
                Client: {briefDraft.client} · {briefDraft.product?.name} · {briefDraft.creative?.duration ?? "?"}
              </div>
            </div>
            <textarea
              value={editingJson}
              onChange={(e) => setEditingJson(e.target.value)}
              rows={28}
              className="w-full rounded-lg bg-black/60 border border-white/10 px-4 py-3 font-mono text-xs text-white outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveAndRun}
              disabled={loading}
              className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-black hover:bg-orange-400 disabled:opacity-50"
            >
              {loading ? "Starting..." : "🚀 Save & Generate"}
            </button>
            <button
              onClick={() => {
                setBriefDraft(null);
                setEditingJson("");
                setFile(null);
                setText("");
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
