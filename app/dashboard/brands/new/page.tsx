"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/dashboard-api";

export default function NewBrandPage() {
  const router = useRouter();
  const [json, setJson] = useState(EXAMPLE_BRAND);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setLoading(true);
    try {
      const parsed = JSON.parse(json);
      const res = await api.createBrand(parsed);
      router.push(`/dashboard/brands/${res.brand.id}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New brand</h1>
        <p className="mt-1 text-sm text-white/60">
          Edit the JSON below and save. Reference images are URLs (Drive shareable links work).
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={28}
          className="w-full rounded-lg bg-black/60 border border-white/10 px-4 py-3 font-mono text-xs text-white outline-none focus:border-orange-500"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-black hover:bg-orange-400 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save brand"}
        </button>
        <button
          onClick={() => router.push("/dashboard/brands")}
          className="rounded-lg border border-white/15 px-5 py-3 text-white/70 hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

const EXAMPLE_BRAND = `{
  "name": "Brand Name",
  "tone": "conversational, supportive, anti-gatekeeping",
  "target_audience": "Adults 22-40, fitness-focused",
  "primary_color": "#000000",
  "logo_url": "https://...",
  "values": [
    "honest credibility",
    "permission-giving",
    "community"
  ],
  "dont": [
    "no preachy wellness-influencer voice",
    "no hard sell"
  ],
  "voice_examples": [
    "Eating clean doesn't have to mean eating sad.",
    "Made for people who actually train. Not for influencers."
  ],
  "products": [
    {
      "name": "Product Name",
      "description": "Short description",
      "category": "low-calorie sauce",
      "url": "https://...",
      "image_urls": ["https://..."],
      "hero_features": ["10 calories per serving", "real ingredients"],
      "personality": "the daily workhorse",
      "use_context": "grilled chicken, dipping",
      "tagline": "Real flavor. No compromise."
    }
  ]
}`;
