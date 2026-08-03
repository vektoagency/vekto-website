"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Bloomberg-terminal aesthetic. Amber-on-charcoal, IBM Plex Mono
// everywhere, live ticker across the top, panel-based grid layout,
// blinking cursors on active fields, sector performance grids,
// F-key hotbar at bottom. Feels like a live trading desk running
// a growth portfolio.

const TICKER = [
  { sym: "MSCR", name: "MEN'S CARE",     chg: "+520.4", pct: "+5.2×"  },
  { sym: "ISPT", name: "ISOSPORT",       chg: "+380.0", pct: "+3.8×"  },
  { sym: "PRFN", name: "PARFEN",         chg: "+4400",  pct: "+44"    },
  { sym: "DUSQ", name: "DUSQ (US)",      chg: "+1.2M",  pct: "REACH"  },
  { sym: "BLTX", name: "BULTEX",         chg: "PARTNR", pct: "NEW"    },
  { sym: "NDLY", name: "NEDELYA",        chg: "PARTNR", pct: "NEW"    },
  { sym: "GRMT", name: "GOURMET H.",     chg: "LAUNCH", pct: "Q3-26"  },
  { sym: "ANML", name: "ANOMALY (US)",   chg: "+220",   pct: "+2.2×"  },
];

const PORTFOLIO = [
  { sym: "MSCR", cat: "BEAUTY",   spend: "€48K",  return: "€250K", roas: "5.20", status: "ACTIVE" },
  { sym: "ISPT", cat: "BEVERAGE", spend: "€32K",  return: "€122K", roas: "3.80", status: "ACTIVE" },
  { sym: "PRFN", cat: "PERFUMES", spend: "€24K",  return: "€110K", roas: "4.60", status: "ACTIVE" },
  { sym: "DUSQ", cat: "WEARABLE", spend: "$120K", return: "$412K", roas: "3.43", status: "ACTIVE" },
  { sym: "ANML", cat: "SUPPLMTS", spend: "$80K",  return: "$176K", roas: "2.20", status: "ACTIVE" },
  { sym: "BLTX", cat: "WORKWEAR", spend: "€8K",   return: "€24K",  roas: "3.00", status: "RAMPUP" },
  { sym: "NDLY", cat: "BAKERY",   spend: "€6K",   return: "€18K",  roas: "3.00", status: "RAMPUP" },
  { sym: "GRMT", cat: "FOOD",     spend: "—",     return: "—",     roas: "—",    status: "PENDNG" },
];

const SECTORS = [
  { name: "PERFORMANCE",   loc: "GRID.01", val: "48",  unit: "ACTV CAMP" },
  { name: "CREATIVE ENG",  loc: "GRID.02", val: "312", unit: "VIDS / MO" },
  { name: "INFRASTRUCT",   loc: "GRID.03", val: "17",  unit: "WEB LIVE"  },
  { name: "STRATEGY",      loc: "GRID.04", val: "12",  unit: "PARTNERS"  },
];

const HOTKEYS = [
  { k: "F1",  action: "HELP"     },
  { k: "F2",  action: "PORTFOLIO" },
  { k: "F3",  action: "SECTORS"   },
  { k: "F4",  action: "CONTACT"   },
  { k: "F5",  action: "REFRESH"   },
  { k: "ESC", action: "EXIT"      },
];

export default function TerminalHomepage() {
  const [now, setNow] = useState("");
  const [cursor, setCursor] = useState(true);
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        `${d.getUTCHours().toString().padStart(2, "0")}:${d
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}:${d.getUTCSeconds().toString().padStart(2, "0")} UTC`
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 620);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTickerOffset((o) => o - 1), 40);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#ffb000] font-mono relative overflow-hidden"
      style={{ fontFamily: "var(--font-terminal-mono), ui-monospace, monospace" }}
    >
      {/* Scanline effect */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.05] mix-blend-screen z-[60]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #ffb000, #ffb000 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* CRT vignette */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[59]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* ===== TOP BAR ===== */}
      <div className="border-b-2 border-[#ffb000] px-3 py-1.5 flex items-center gap-4 text-[11px] md:text-xs">
        <div className="font-bold">VKT/BLOOMBERG</div>
        <div className="hidden md:block opacity-70">TERMINAL v26.08</div>
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden md:inline opacity-70">SFO/BG</span>
          <span className="tabular-nums">{now}</span>
          <span className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse" />
        </div>
      </div>

      {/* ===== SCROLLING TICKER ===== */}
      <div className="border-b border-[#ffb000]/40 overflow-hidden bg-[#111]">
        <div
          className="flex whitespace-nowrap py-1.5 text-[11px] md:text-xs"
          style={{ transform: `translateX(${tickerOffset}px)` }}
        >
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="px-4 flex items-center gap-2">
              <span className="text-[#ffb000] font-bold">{t.sym}</span>
              <span className="opacity-60">{t.name}</span>
              <span
                className="font-bold"
                style={{ color: t.chg.startsWith("+") || t.chg === "PARTNR" || t.chg === "LAUNCH" ? "#00ff41" : "#ffb000" }}
              >
                {t.chg}
              </span>
              <span className="opacity-70">{t.pct}</span>
              <span className="opacity-30 ml-2">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="grid md:grid-cols-[1fr_320px] gap-3 p-3">
        {/* ===== LEFT COLUMN ===== */}
        <div className="space-y-3">
          {/* HERO PANEL */}
          <Panel label="MAIN.001 · GROWTH POSITIONING">
            <div className="p-4 md:p-6">
              <div className="text-[10px] tracking-widest opacity-60 mb-2">
                VEKTO GROWTH STUDIO · SOFIA + WORLDWIDE
              </div>
              <div className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6 uppercase tracking-tight">
                {"> "}Growth as a
                <br />
                traded position{cursor && "_"}
              </div>
              <div className="text-sm md:text-base opacity-80 max-w-xl leading-relaxed mb-6">
                50+ бранда в портфолиото. Всеки клиент е позиция.
                Всеки месец — отчет. Всяко тримесечие — сверяване с benchmark-а.
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href="mailto:vektoagency@gmail.com"
                  className="border border-[#ffb000] px-4 py-1.5 hover:bg-[#ffb000] hover:text-black transition-colors"
                >
                  [ INITIATE POSITION ]
                </a>
                <Link
                  href="/case-studies"
                  className="border border-[#ffb000]/50 opacity-70 px-4 py-1.5 hover:opacity-100 hover:border-[#ffb000] transition-all"
                >
                  [ VIEW PORTFOLIO ]
                </Link>
              </div>
            </div>
          </Panel>

          {/* PORTFOLIO TABLE */}
          <Panel label="PORT.002 · ACTIVE POSITIONS">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] md:text-xs">
                <thead>
                  <tr className="border-b border-[#ffb000]/40 bg-[#111]">
                    <th className="text-left px-3 py-2 font-normal opacity-70">SYM</th>
                    <th className="text-left px-3 py-2 font-normal opacity-70">CATEGORY</th>
                    <th className="text-right px-3 py-2 font-normal opacity-70">SPEND</th>
                    <th className="text-right px-3 py-2 font-normal opacity-70">RETURN</th>
                    <th className="text-right px-3 py-2 font-normal opacity-70">ROAS</th>
                    <th className="text-right px-3 py-2 font-normal opacity-70">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {PORTFOLIO.map((p, i) => (
                    <tr
                      key={p.sym}
                      className={`border-b border-[#ffb000]/10 ${i % 2 === 0 ? "bg-transparent" : "bg-[#0d0d0d]"}`}
                    >
                      <td className="px-3 py-1.5 font-bold text-[#ffb000]">{p.sym}</td>
                      <td className="px-3 py-1.5 opacity-70">{p.cat}</td>
                      <td className="px-3 py-1.5 text-right">{p.spend}</td>
                      <td className="px-3 py-1.5 text-right">{p.return}</td>
                      <td className={`px-3 py-1.5 text-right font-bold ${p.roas !== "—" && parseFloat(p.roas) >= 3 ? "text-[#00ff41]" : ""}`}>
                        {p.roas}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        <span
                          className={`px-1.5 py-0.5 border ${
                            p.status === "ACTIVE"
                              ? "border-[#00ff41] text-[#00ff41]"
                              : p.status === "RAMPUP"
                                ? "border-[#ffb000]"
                                : "border-[#666] text-[#666]"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#ffb000] font-bold">
                    <td className="px-3 py-2" colSpan={2}>TOTAL POSITIONS</td>
                    <td className="px-3 py-2 text-right">€322K</td>
                    <td className="px-3 py-2 text-right">€1.11M</td>
                    <td className="px-3 py-2 text-right text-[#00ff41]">4.80</td>
                    <td className="px-3 py-2 text-right">50+</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Panel>

          {/* SECTORS */}
          <Panel label="SECT.003 · CAPABILITIES BY SECTOR">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {SECTORS.map((s) => (
                <div
                  key={s.name}
                  className="p-4 border-r border-b border-[#ffb000]/20 last:border-r-0 md:last:border-r md:[&:nth-child(4n)]:border-r-0"
                >
                  <div className="text-[9px] opacity-50 tracking-widest mb-1">{s.loc}</div>
                  <div className="text-3xl md:text-4xl font-bold text-[#00ff41] mb-1 leading-none tabular-nums">
                    {s.val}
                  </div>
                  <div className="text-[10px] tracking-widest">{s.unit}</div>
                  <div className="text-[11px] md:text-xs uppercase mt-2 opacity-80">{s.name}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <div className="space-y-3">
          {/* ORDER TICKET */}
          <Panel label="ORDER.09 · NEW POSITION">
            <div className="p-4 space-y-3 text-xs">
              <div>
                <div className="text-[10px] opacity-60 mb-1">BRAND</div>
                <div className="border border-[#ffb000]/40 px-2 py-1.5">
                  YOUR BRAND HERE{cursor && "_"}
                </div>
              </div>
              <div>
                <div className="text-[10px] opacity-60 mb-1">POSITION SIZE</div>
                <div className="border border-[#ffb000]/40 px-2 py-1.5 opacity-70">
                  QUARTERLY MIN
                </div>
              </div>
              <div>
                <div className="text-[10px] opacity-60 mb-1">DESIRED ROAS</div>
                <div className="border border-[#ffb000]/40 px-2 py-1.5 flex items-center justify-between">
                  <span>4.0×+</span>
                  <span className="text-[#00ff41]">▲</span>
                </div>
              </div>
              <a
                href="mailto:vektoagency@gmail.com"
                className="block text-center bg-[#ffb000] text-black font-bold px-4 py-2 mt-3 hover:bg-[#ffc933] transition-colors"
              >
                [ SUBMIT ORDER ]
              </a>
              <div className="text-[10px] opacity-50 text-center pt-2 border-t border-[#ffb000]/20">
                12 SLOTS AVAILABLE · 2026 CYCLE
              </div>
            </div>
          </Panel>

          {/* CONTACT DESK */}
          <Panel label="COMS.10 · TRADING DESK">
            <div className="p-4 space-y-3 text-xs">
              <ContactLine label="EMAIL" value="vektoagency@gmail.com" href="mailto:vektoagency@gmail.com" />
              <ContactLine label="VOICE" value="+359 88 225 1474" href="tel:+359882251474" />
              <ContactLine label="HRS"   value="MON-FRI 09:00 UTC+2" />
              <ContactLine label="RESP"  value="< 24H" />
            </div>
          </Panel>

          {/* NEWS FEED */}
          <Panel label="FEED.11 · WIRE">
            <div className="p-4 space-y-2 text-[11px]">
              {[
                { d: "04.08", n: "MSCR upgraded to BUY — 5.2× revenue lift confirmed" },
                { d: "01.08", n: "New position: BLTX. Workwear · BG · Q3-26" },
                { d: "24.07", n: "DUSQ US launch: 1.2M reach in week 1" },
                { d: "10.07", n: "NDLY added to roster — bakery ecom rebuild" },
              ].map((n) => (
                <div key={n.d} className="border-b border-[#ffb000]/15 pb-2 last:border-0">
                  <div className="opacity-60 tabular-nums">{n.d} —</div>
                  <div className="mt-0.5 leading-snug">{n.n}</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* MARKET STATUS */}
          <Panel label="STAT.12 · MARKET">
            <div className="p-4 text-xs">
              <div className="flex justify-between mb-1">
                <span className="opacity-60">Sofia</span>
                <span className="text-[#00ff41]">OPEN</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="opacity-60">New York</span>
                <span className="text-[#00ff41]">OPEN</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Vekto Desk</span>
                <span className="text-[#00ff41]">LIVE</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* ===== BOTTOM F-KEY HOTBAR ===== */}
      <div className="border-t-2 border-[#ffb000] bg-[#111] flex items-center overflow-x-auto text-[11px] md:text-xs">
        {HOTKEYS.map((h) => (
          <div key={h.k} className="flex items-center border-r border-[#ffb000]/20 px-3 py-2 gap-2 whitespace-nowrap">
            <span className="bg-[#ffb000] text-black px-1.5 font-bold">{h.k}</span>
            <span className="opacity-70">{h.action}</span>
          </div>
        ))}
        <div className="ml-auto px-4 py-2 opacity-50 hidden md:block">© MMXXVI VEKTO · ALL POSITIONS RECORDED</div>
      </div>
    </div>
  );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#ffb000]/60">
      <div className="border-b border-[#ffb000]/60 px-3 py-1 text-[10px] tracking-[0.2em] flex items-center justify-between bg-[#111]">
        <span className="font-bold">{label}</span>
        <span className="opacity-50">[■][□][×]</span>
      </div>
      {children}
    </div>
  );
}

function ContactLine({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-baseline gap-3">
      <span className="w-14 opacity-60 uppercase text-[10px] tracking-widest">{label}</span>
      <span className="font-bold flex-1 break-all">{value}</span>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:text-[#00ff41] transition-colors">
      {inner}
    </a>
  ) : (
    inner
  );
}
