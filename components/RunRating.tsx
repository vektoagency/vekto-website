"use client";

import { useState } from "react";
import { api, type RunRating } from "@/lib/dashboard-api";

interface RunRatingProps {
  runId: string;
  initialRating: RunRating | null;
  initialNote: string | null;
  size?: "sm" | "md";
  onChange?: (rating: RunRating | null) => void;
}

const RATINGS: Array<{ value: RunRating; label: string; emoji: string; bg: string; ring: string }> = [
  { value: "bad",  label: "не става",  emoji: "❌", bg: "bg-red-500/15 text-red-300",     ring: "ring-red-500/40" },
  { value: "edit", label: "за едит",   emoji: "✂️", bg: "bg-yellow-500/15 text-yellow-200", ring: "ring-yellow-500/40" },
  { value: "good", label: "става",     emoji: "✅", bg: "bg-green-500/15 text-green-300",  ring: "ring-green-500/40" },
];

export default function RunRatingCmp({
  runId,
  initialRating,
  initialNote,
  size = "md",
  onChange,
}: RunRatingProps) {
  const [rating, setRating] = useState<RunRating | null>(initialRating);
  const [note, setNote] = useState<string>(initialNote ?? "");
  const [saving, setSaving] = useState(false);
  const [showNote, setShowNote] = useState(false);

  const padding = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm";

  async function handleRate(next: RunRating) {
    setSaving(true);
    try {
      await api.rateRun(runId, next, note || undefined);
      setRating(next);
      onChange?.(next);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveNote() {
    if (!rating) return;
    setSaving(true);
    try {
      await api.rateRun(runId, rating, note || undefined);
    } finally {
      setSaving(false);
      setShowNote(false);
    }
  }

  async function handleClear() {
    setSaving(true);
    try {
      await api.clearRating(runId);
      setRating(null);
      setNote("");
      onChange?.(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {RATINGS.map((r) => {
        const active = rating === r.value;
        return (
          <button
            key={r.value}
            type="button"
            onClick={() => handleRate(r.value)}
            disabled={saving}
            className={`${padding} rounded-md font-medium transition disabled:opacity-50 ${
              active ? `${r.bg} ring-2 ${r.ring}` : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
            title={`Маркирай като "${r.label}"`}
          >
            <span className="mr-1">{r.emoji}</span>
            {r.label}
          </button>
        );
      })}
      {rating && (
        <>
          <button
            type="button"
            onClick={() => setShowNote(!showNote)}
            className={`${padding} rounded-md bg-white/5 text-white/60 hover:bg-white/10`}
            title="Добави бележка"
          >
            📝 {note ? "edit note" : "+note"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={saving}
            className={`${padding} rounded-md text-white/40 hover:text-white/70`}
          >
            clear
          </button>
        </>
      )}
      {showNote && (
        <div className="flex w-full items-center gap-2 mt-1">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Кратка бележка (опционално)"
            className="flex-1 rounded-md bg-black/40 border border-white/15 px-3 py-1.5 text-sm text-white placeholder-white/30 outline-none focus:border-orange-500"
          />
          <button
            type="button"
            onClick={handleSaveNote}
            disabled={saving}
            className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-orange-400 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export function RatingBadge({ rating }: { rating: RunRating | null }) {
  if (!rating) return null;
  const r = RATINGS.find((x) => x.value === rating);
  if (!r) return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${r.bg}`}>
      <span>{r.emoji}</span>
      {r.label}
    </span>
  );
}
