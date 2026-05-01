"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Brand } from "@/lib/dashboard-api";

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.me();
        if (!me.authenticated) return router.push("/dashboard/login");
        const r = await api.listBrands();
        setBrands(r.brands);
      } catch {
        router.push("/dashboard/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) return <div className="text-white/60">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand library</h1>
          <p className="mt-1 text-sm text-white/60">
            Saved brand profiles — pick one when creating a brief to auto-fill brand context.
          </p>
        </div>
        <Link
          href="/dashboard/brands/new"
          className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-black hover:bg-orange-400"
        >
          + New brand
        </Link>
      </div>

      {brands && brands.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <div className="text-white/50 text-lg mb-2">No brands yet</div>
          <p className="text-sm text-white/40 mb-6">
            Save a brand profile once → re-use across all future briefs.
          </p>
          <Link
            href="/dashboard/brands/new"
            className="inline-block rounded-lg bg-orange-500 px-5 py-3 font-medium text-black hover:bg-orange-400"
          >
            + Create your first brand
          </Link>
        </div>
      )}

      {brands && brands.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/dashboard/brands/${b.id}`}
              className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-orange-500/50 hover:bg-white/10 transition"
            >
              <div className="flex items-start gap-4">
                {b.logo_url ? (
                  <img
                    src={b.logo_url}
                    alt={b.name}
                    className="w-14 h-14 rounded-lg object-contain bg-white/10 p-1"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold"
                    style={{ background: b.primary_color ?? "#1a1a1a", color: "#fff" }}
                  >
                    {b.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{b.name}</div>
                  <div className="text-xs text-white/50 truncate">{b.slug}</div>
                </div>
              </div>
              {b.tone && (
                <div className="mt-3 text-sm text-white/60 line-clamp-2">{b.tone}</div>
              )}
              <div className="mt-3 flex items-center gap-3 text-xs text-white/40">
                <span>{b.products.length} products</span>
                <span>•</span>
                <span>{b.voice_examples.length} voice samples</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
