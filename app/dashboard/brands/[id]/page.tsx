"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, type Brand } from "@/lib/dashboard-api";

export default function BrandDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [brand, setBrand] = useState<Brand | null>(null);
  const [editJson, setEditJson] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.me();
        if (!me.authenticated) return router.push("/dashboard/login");
        const r = await api.getBrand(id);
        setBrand(r.brand);
        setEditJson(JSON.stringify(serializeForEdit(r.brand), null, 2));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const parsed = JSON.parse(editJson);
      const res = await api.updateBrand(id, parsed);
      setBrand(res.brand);
      setEditing(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete brand "${brand?.name}"? This cannot be undone.`)) return;
    await api.deleteBrand(id);
    router.push("/dashboard/brands");
  }

  if (loading) return <div className="text-white/60">Loading...</div>;
  if (!brand) return <div className="text-red-400">Not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="w-20 h-20 rounded-xl object-contain bg-white/10 p-2"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold"
              style={{ background: brand.primary_color ?? "#1a1a1a" }}
            >
              {brand.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{brand.name}</h1>
            <div className="text-sm text-white/50">{brand.slug}</div>
            {brand.tone && <div className="mt-2 text-sm text-white/70 max-w-2xl">{brand.tone}</div>}
          </div>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
            >
              ✏ Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20"
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      {editing ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <textarea
              value={editJson}
              onChange={(e) => setEditJson(e.target.value)}
              rows={26}
              className="w-full rounded-lg bg-black/60 border border-white/10 px-4 py-3 font-mono text-xs text-white outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-black hover:bg-orange-400 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditJson(JSON.stringify(serializeForEdit(brand), null, 2));
              }}
              className="rounded-lg border border-white/15 px-5 py-3 text-white/70 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {brand.target_audience && (
            <Section title="Target audience">
              <p className="text-white/80">{brand.target_audience}</p>
            </Section>
          )}

          {brand.values.length > 0 && (
            <Section title="Values">
              <ul className="list-disc pl-5 space-y-1 text-white/80">
                {brand.values.map((v, i) => <li key={i}>{v}</li>)}
              </ul>
            </Section>
          )}

          {brand.dont.length > 0 && (
            <Section title="Anti-patterns (don't)">
              <ul className="list-disc pl-5 space-y-1 text-white/80">
                {brand.dont.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </Section>
          )}

          {brand.voice_examples.length > 0 && (
            <Section title="Voice examples">
              <ul className="space-y-2">
                {brand.voice_examples.map((v, i) => (
                  <li key={i} className="rounded-lg bg-black/40 px-4 py-3 text-white/80 italic">"{v}"</li>
                ))}
              </ul>
            </Section>
          )}

          {brand.products.length > 0 && (
            <Section title={`Products (${brand.products.length})`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brand.products.map((p, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex gap-3">
                      {p.image_urls?.[0] && (
                        <img
                          src={p.image_urls[0]}
                          alt={p.name}
                          className="w-16 h-16 rounded-lg object-contain bg-white/10 p-1"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{p.name}</div>
                        {p.description && (
                          <div className="text-xs text-white/60 mt-1 line-clamp-3">{p.description}</div>
                        )}
                        {p.tagline && (
                          <div className="text-xs italic text-orange-400 mt-2">"{p.tagline}"</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      <div className="pt-4">
        <Link href="/dashboard/brands" className="text-sm text-white/50 hover:text-white">
          ← Back to all brands
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <h3 className="font-semibold mb-3 text-white/90">{title}</h3>
      {children}
    </div>
  );
}

function serializeForEdit(b: Brand): Record<string, unknown> {
  return {
    name: b.name,
    tone: b.tone,
    target_audience: b.target_audience,
    primary_color: b.primary_color,
    logo_url: b.logo_url,
    values: b.values,
    dont: b.dont,
    voice_examples: b.voice_examples,
    products: b.products,
  };
}
