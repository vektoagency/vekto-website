"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import bunnyData from "../data/bunny-clips.json";
import { ClipTile, ClipLightbox, type Clip } from "../portfolio/PortfolioClient";

// English-only on purpose. This page is the link we put in cold outreach to
// hotels and villa owners abroad, so it deliberately sits outside the site's
// BG/EN toggle — the reader is never Bulgarian.

const all = bunnyData.clips as Clip[];
const hotels = all.filter((c) => c.hospitality === "hotel");
const property = all.filter((c) => c.hospitality === "property");

export default function HospitalityClient() {
  const [expanded, setExpanded] = useState<Clip | null>(null);
  const total = hotels.length + property.length;

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#f4f4f4" },
          dark: { "cal-brand": "#f4f4f4" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  // Same contract as /portfolio — pause the Hero R3F background and any
  // mobile preview tiles while a clip is playing full-screen.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(expanded ? "vekto:player-open" : "vekto:player-closed"));
    return () => {
      if (expanded) window.dispatchEvent(new Event("vekto:player-closed"));
    };
  }, [expanded]);

  return (
    <>
      <div
        className="sticky top-[56px] md:top-[76px] z-30 flex items-center justify-between px-6 md:px-10 py-3 border-b border-[#f4f4f4]/45 font-mono text-[11px] uppercase tracking-[0.3em]"
        style={{
          background: "#161616",
          boxShadow: "0 2px 0 rgba(244,244,244,0.18), 0 10px 24px -12px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-center gap-3 text-[#f4f4f4]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f4f4f4] animate-pulse" />
          Hospitality — {total} videos
        </div>
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#0d0d0d] bg-[#f4f4f4] px-4 py-2 font-black transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          style={{ boxShadow: "3px 3px 0 0 #3a3a3a" }}
          aria-label="Back"
        >
          <span aria-hidden>←</span>
          <span>Back</span>
        </Link>
      </div>

      <section className="px-6 md:px-12 pt-10 md:pt-14 pb-2 max-w-[1240px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-black leading-[1.03] tracking-tight text-[#f4f4f4] text-balance max-w-[16ch]">
          Video for places people stay in.
        </h1>
        <p className="mt-5 max-w-[62ch] text-[#f4f4f4]/70 text-[15px] md:text-base leading-relaxed">
          We are VEKTO, a creative agency out of Bulgaria. We shoot and cut the short
          vertical video that hotels and villas run on Instagram, TikTok and their own
          listings — and we build the direct booking pages and paid ads that turn it into
          arrivals that owe no commission to anyone.
        </p>
        <p className="mt-3 max-w-[62ch] text-[#f4f4f4]/45 font-mono text-[11px] uppercase tracking-[0.18em]">
          Everything below is client work. Sound on.
        </p>
      </section>

      <Group
        label="Hotels & resorts"
        note="Wellness and mountain resorts — rooms, pools, restaurant, grounds."
        clips={hotels}
        onExpand={setExpanded}
        offset={0}
      />

      <Group
        label="Property"
        note="Not hotels — residential developments. Same job: sell a building on camera."
        clips={property}
        onExpand={setExpanded}
        offset={hotels.length}
      />

      <section className="px-6 md:px-12 pt-6 pb-4 max-w-[1240px] mx-auto">
        <div className="border border-[#f4f4f4]/20 p-6 md:p-9">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f4f4f4]/50">
            What a package usually is
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {[
              ["Six to eight short videos", "Cut vertical for Reels, TikTok and the top of your Booking and Airbnb listings. Enough to keep a feed running well past the shoot."],
              ["The stills behind them", "Graded photography from the same session — for listings, the site, and anything print."],
              ["A direct booking page", "Plus the paid ads pointing at it, so a larger share of your guests arrive without an OTA commission."],
            ].map(([h, b]) => (
              <div key={h}>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#f4f4f4] font-bold">{h}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-[#f4f4f4]/60">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[13px] leading-relaxed text-[#f4f4f4]/50 max-w-[70ch]">
            Nothing here is a fixed package. Tell us which part is actually useful to you and
            we will shape the work around that.
          </p>
        </div>
      </section>

      <section className="relative px-6 md:px-10 pt-10 pb-20 max-w-[1100px] mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight mb-5 text-[#f4f4f4] po-glow text-balance">
          Want this for
          <br />
          <span className="text-[#f4f4f4]">your property?</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            data-cal-namespace="30min"
            data-cal-link="vekto/30min"
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            className="inline-flex items-center justify-center gap-2 bg-[#f4f4f4] text-[#0d0d0d] font-black uppercase tracking-[0.15em] text-[13px] px-10 py-4 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-pointer"
            style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
          >
            Book a call
          </button>
          <a
            href="mailto:vektoagency@gmail.com"
            className="inline-flex items-center justify-center gap-2 border-[1.5px] border-[#f4f4f4]/75 text-[#f4f4f4] px-10 py-4 hover:bg-white hover:text-black transition-colors cursor-pointer font-mono text-sm uppercase tracking-[0.2em] font-bold"
          >
            vektoagency@gmail.com
          </a>
        </div>
      </section>

      {expanded && <ClipLightbox clip={expanded} onClose={() => setExpanded(null)} />}
    </>
  );
}

function Group({
  label,
  note,
  clips,
  onExpand,
  offset,
}: {
  label: string;
  note: string;
  clips: Clip[];
  onExpand: (c: Clip) => void;
  offset: number;
}) {
  if (clips.length === 0) return null;
  return (
    <section className="px-6 md:px-12 pt-8 md:pt-10 pb-2 max-w-[1240px] mx-auto">
      <div className="flex items-baseline gap-4 border-b border-[#f4f4f4]/20 pb-3 mb-6">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#f4f4f4] font-bold whitespace-nowrap">
          {label}
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f4f4f4]/40 truncate">
          {note}
        </span>
      </div>
      <div className="grid grid-flow-dense grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-7 auto-rows-auto">
        {clips.map((c, i) => (
          <ClipTile key={c.id} clip={c} idx={offset + i} onExpand={() => onExpand(c)} />
        ))}
      </div>
    </section>
  );
}
