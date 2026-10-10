"use client";

// ============================================================================
// THE WORK — the section right under the homepage hero. One strip of tabs
// answers "do you do what I need?" in a click: real videos, AI videos,
// websites, case studies. Each tab shows a short run of the real work on
// the spot and links to the full page for more.
//
// Sources, so nothing here is written fresh:
//   videos  — app/data/bunny-clips.json (portfolio order, `kind` field)
//   sites   — screenshots of the live builds in /images/sites
//   cases   — CASE_STUDIES from the case-studies page
// ============================================================================

import { useState } from "react";
import Link from "next/link";
import bunnyData from "../data/bunny-clips.json";
import { ClipTile, ClipLightbox, type Clip } from "../portfolio/PortfolioClient";
import { CASE_STUDIES } from "../case-studies/CaseStudiesClient";

const PIXEL = "var(--brutal-pixel), ui-monospace, monospace";

const VISIBLE: Clip[] = (bunnyData.clips as Clip[]).filter((c) => !c.excludeFromPortfolio);
const REAL = VISIBLE.filter((c) => c.kind === "real");
const AI = VISIBLE.filter((c) => c.kind !== "real");
const SHOWN = 8;

// Live builds. Only KingOfKlean runs on its own domain; the others are
// shown as screenshots until they move to theirs.
const SITES: { name: string; type: string; img: string; href?: string; tags: string[] }[] = [
  { name: "Ritello Bulgaria", type: "Marketing site · 25 pages", img: "/images/sites/ritello.webp", tags: ["Next.js", "Demo bookings", "Video library"] },
  { name: "Angel Face", type: "Salon chain website", img: "/images/sites/angelface.webp", tags: ["4 cities", "Online booking", "Services"] },
  { name: "FADEMASTER", type: "E-commerce store", img: "/images/sites/fademaster.webp", tags: ["Own checkout", "Cash on delivery", "Admin"] },
  { name: "KingOfKlean", type: "E-commerce store", img: "/images/sites/kingofklean.webp", href: "https://kingofklean.shop", tags: ["Own checkout", "Cash on delivery", "Admin"] },
];

type TabId = "real" | "ai" | "sites" | "cases";
// A tab with nothing in it stays hidden: "Real videos" appears by itself
// once the first clip tagged kind: "real" lands in the data.
const TABS: { id: TabId; label: string; count: number }[] = [
  { id: "real" as TabId, label: "Real videos", count: REAL.length },
  { id: "ai" as TabId, label: "AI videos", count: AI.length },
  { id: "sites" as TabId, label: "Websites", count: SITES.length },
  { id: "cases" as TabId, label: "Case studies", count: CASE_STUDIES.length },
].filter((tb) => tb.count > 0);

export default function WorkTabs() {
  const [tab, setTab] = useState<TabId>("ai");
  const [expanded, setExpanded] = useState<Clip | null>(null);

  const clips = tab === "real" ? REAL : AI;

  return (
    <section id="work" className="relative scroll-mt-16 md:scroll-mt-20" style={{ background: "#0d0d0d", color: "#f4f4f4" }}>
      <div className="px-6 md:px-14 pt-16 md:pt-24 pb-16 md:pb-24 max-w-[1400px] mx-auto">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] opacity-55 mb-4" style={{ fontFamily: PIXEL }}>
          The work
        </p>
        <h2
          className="font-black uppercase leading-[0.96] tracking-[-0.03em] mb-8 md:mb-10 text-balance"
          style={{ fontSize: "clamp(34px, 5.4vw, 80px)" }}
        >
          See what we make.
        </h2>

        {/* Tabs: a scrollable row on phones, one line on desktop */}
        <div
          role="tablist"
          aria-label="Work by type"
          className="flex gap-2 md:gap-3 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 mb-8 md:mb-10 [scrollbar-width:none]"
        >
          {TABS.map((tb) => {
            const active = tb.id === tab;
            return (
              <button
                key={tb.id}
                type="button"
                role="tab"
                id={`work-tab-${tb.id}`}
                aria-selected={active}
                aria-controls="work-panel"
                onClick={() => setTab(tb.id)}
                className={`shrink-0 flex items-center gap-2.5 border-[1.5px] px-4 md:px-5 py-2.5 md:py-3 font-black uppercase text-[12px] md:text-[13px] tracking-[0.14em] transition-colors ${
                  active
                    ? "bg-[#f4f4f4] text-[#0d0d0d] border-[#f4f4f4]"
                    : "bg-transparent text-[#f4f4f4] border-[#f4f4f4]/55 hover:bg-white hover:text-black"
                }`}
                style={{ boxShadow: active ? "4px 4px 0 0 #3a3a3a" : undefined }}
              >
                {tb.label}
                <span className="text-[10px] font-bold tabular-nums opacity-60" style={{ fontFamily: PIXEL }}>
                  {tb.count}
                </span>
              </button>
            );
          })}
        </div>

        <div id="work-panel" role="tabpanel" aria-labelledby={`work-tab-${tab}`}>
          {(tab === "real" || tab === "ai") && (
            <>
              <div className="grid grid-flow-dense grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-7 auto-rows-auto">
                {clips.slice(0, SHOWN).map((c, i) => (
                  <ClipTile key={c.id} clip={c} idx={i} onExpand={() => setExpanded(c)} />
                ))}
              </div>
              {clips.length > SHOWN && (
                <SeeAll href="/portfolio" label={`See all ${clips.length} ${tab === "real" ? "real" : "AI"} videos`} />
              )}
            </>
          )}

          {tab === "sites" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {SITES.map((s) => {
                const body = (
                  <>
                    <div className="relative overflow-hidden border-b-2" style={{ borderColor: "rgba(244,244,244,0.25)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.img} alt={`${s.name} website`} loading="lazy" className="w-full aspect-[1200/616] object-cover object-top" />
                    </div>
                    <div className="p-5 md:p-6 flex flex-col gap-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-black uppercase text-[18px] md:text-[20px] tracking-[-0.01em]">{s.name}</h3>
                        {s.href && (
                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.25em] opacity-70" style={{ fontFamily: PIXEL }}>
                            Visit ↗
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] opacity-60" style={{ fontFamily: PIXEL }}>
                        {s.type}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] opacity-75"
                            style={{ border: "1px solid rgba(244,244,244,0.35)", fontFamily: PIXEL }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                );
                const cardClass = "block border-2 overflow-hidden";
                const cardStyle = { background: "#141414", borderColor: "rgba(244,244,244,0.3)", boxShadow: "6px 6px 0 0 #2a2a2a" };
                return s.href ? (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className={`${cardClass} transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5`} style={cardStyle}>
                    {body}
                  </a>
                ) : (
                  <div key={s.name} className={cardClass} style={cardStyle}>
                    {body}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "cases" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                {CASE_STUDIES.map((cs) => (
                  <Link
                    key={cs.slug}
                    href={`/case-studies#${cs.slug}`}
                    className="group flex flex-col border-2 overflow-hidden transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                    style={{ background: "#141414", borderColor: "rgba(244,244,244,0.3)", boxShadow: "6px 6px 0 0 #2a2a2a" }}
                  >
                    <div className="h-24 md:h-28 flex items-center justify-center bg-white px-8 border-b-2 border-black">
                      {cs.brandLogo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={cs.brandLogo} alt={cs.brand} loading="lazy" className="max-h-12 md:max-h-14 max-w-[70%] object-contain" />
                      ) : (
                        <span className="font-black uppercase text-[#0d0d0d]">{cs.brand}</span>
                      )}
                    </div>
                    <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60" style={{ fontFamily: PIXEL }}>
                        {cs.brand} · {cs.category}
                      </p>
                      <h3 className="font-black text-[17px] md:text-[19px] leading-[1.2] text-balance">{cs.headline.en}</h3>
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                        {cs.services.map((sv) => (
                          <span
                            key={sv}
                            className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] opacity-75"
                            style={{ border: "1px solid rgba(244,244,244,0.35)", fontFamily: PIXEL }}
                          >
                            {sv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <SeeAll href="/case-studies" label="Open the case studies" />
            </>
          )}
        </div>
      </div>

      {expanded && <ClipLightbox clip={expanded} onClose={() => setExpanded(null)} />}
    </section>
  );
}

function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-8 md:mt-10 flex justify-center">
      <Link
        href={href}
        className="inline-flex items-center gap-3 border-[1.5px] border-[#f4f4f4]/75 px-6 py-3.5 font-black uppercase text-[12px] md:text-[13px] tracking-[0.16em] transition-colors text-[#f4f4f4] hover:bg-white hover:text-black"
      >
        {label}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
