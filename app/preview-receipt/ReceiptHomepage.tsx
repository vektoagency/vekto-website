"use client";

// Receipt / spec sheet homepage. Every element behaves like ink on
// thermal paper: monospace only, perforated edges via SVG, dashed
// dividers, itemized line-items with quantities + totals, a barcode,
// a rubber stamp, and a serial number in the corner. Zero rounded
// corners. Zero images. Zero decorative colour except the red stamp.
// Feels like an invoice from a very confident supplier.

import Link from "next/link";
import { useEffect, useState } from "react";

const CLIENTS = [
  ["001", "MEN'S CARE",     "Beauty · DTC",       "BG"],
  ["002", "DUSQ",           "Wearable",           "US"],
  ["003", "PARFEN",         "Perfumes · Ecom",    "BG"],
  ["004", "ISOSPORT",       "Beverage",           "BG"],
  ["005", "BIOTICA",        "Supplements",        "BG"],
  ["006", "BULTEX",         "Workwear · Safety",  "BG"],
  ["007", "NEDELYA",        "Bakery",             "BG"],
  ["008", "ANOMALY",        "Immunity · Gut",     "US"],
  ["009", "GOURMET HOUSE",  "Food",               "BG"],
  ["010", "ETHAN'S",        "Plant-based drinks", "US"],
  ["011", "LUCKY ENERGY",   "Zero-sugar drinks",  "US"],
  ["012", "NUTRIFITT",      "Sports nutrition",   "US"],
];

const LINE_ITEMS = [
  { sku: "SKU-001", name: "PPC · Meta / Google / TikTok",  qty: "MO", price: "quote"    },
  { sku: "SKU-002", name: "AI Video Production",           qty: "PC", price: "quote"    },
  { sku: "SKU-003", name: "Live-Action + UGC Shoots",      qty: "PC", price: "quote"    },
  { sku: "SKU-004", name: "Product Visualization",         qty: "PC", price: "quote"    },
  { sku: "SKU-005", name: "Websites · Landing / Ecom",     qty: "PC", price: "quote"    },
  { sku: "SKU-006", name: "Email + CRM Automation",        qty: "MO", price: "quote"    },
  { sku: "SKU-007", name: "Positioning + Offer Strategy",  qty: "QT", price: "quote"    },
  { sku: "SKU-008", name: "Fractional CMO Retainer",       qty: "MO", price: "quote"    },
];

const TOTALS = [
  { label: "Brands served",         value: "50+"           },
  { label: "Avg. campaign ROAS",    value: "4.8×"          },
  { label: "New partners / year",   value: "12"            },
  { label: "Markets covered",       value: "BG · US"       },
];

export default function ReceiptHomepage() {
  // Live serial number that ticks up — feels like it's being printed
  // fresh for each visitor.
  const [serial, setSerial] = useState("00000000");
  useEffect(() => {
    const s = Math.floor(Math.random() * 99999999).toString().padStart(8, "0");
    setSerial(s);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#f4f0e6] text-[#0a0a0a] font-mono py-8 md:py-16 px-4 relative overflow-x-hidden"
      style={{
        fontFamily: "var(--font-receipt-mono), ui-monospace, monospace",
      }}
    >
      {/* Paper texture overlay */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.7  0 0 0 0 0.62  0 0 0 0 0.42  0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>")`,
        }}
      />

      <div className="max-w-[560px] mx-auto relative">
        {/* ===== TOP PERFORATION ===== */}
        <PerforatedEdge position="top" />

        {/* ===== RECEIPT BODY ===== */}
        <div
          className="bg-[#f9f5eb] px-6 md:px-10 py-10 relative"
          style={{
            boxShadow:
              "0 12px 40px -12px rgba(0,0,0,0.25), 0 4px 12px -4px rgba(0,0,0,0.1)",
          }}
        >
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="text-[10px] tracking-[0.3em] mb-3">** VEKTO GROWTH STUDIO **</div>
            <div className="text-[9px] leading-tight">
              123 SOFIA ROAD · SOFIA 1000 · BG<br />
              +359 88 225 1474 · vektoagency.com
            </div>
            <div className="mt-4 border-t border-b border-dashed border-[#0a0a0a] py-2 text-[10px] tracking-[0.2em]">
              — SPECIFICATION SHEET —
            </div>
          </div>

          {/* META BLOCK */}
          <MetaRow label="INVOICE"   value={`# ${serial}`} />
          <MetaRow label="DATE"      value="04 · VIII · 2026" />
          <MetaRow label="CASHIER"   value="N. GOSPODINOV" />
          <MetaRow label="CUSTOMER"  value="** YOUR BRAND HERE **" />

          {/* HERO CLAIM */}
          <div className="mt-8 mb-6 border-t border-b border-[#0a0a0a] py-6 text-center">
            <div className="text-[9px] tracking-[0.35em] mb-3 opacity-70">** ITEM DESCRIPTION **</div>
            <div className="text-2xl md:text-3xl leading-[1.15] font-bold tracking-tight">
              ONE (1) FULL-STACK<br />
              GROWTH SYSTEM.<br />
              <span className="italic font-normal">Ready to ship.</span>
            </div>
            <div className="text-[10px] mt-3 tracking-[0.2em] opacity-70">
              [ NOT AVAILABLE IN STORES ]
            </div>
          </div>

          {/* LINE ITEMS */}
          <div className="text-[10px] tracking-[0.3em] mb-3 text-center opacity-70">== SERVICES ==</div>
          <div className="border-t border-dashed border-[#0a0a0a] pt-3">
            <div className="flex text-[9px] tracking-[0.15em] font-bold pb-2 border-b border-dashed border-[#0a0a0a]/40">
              <span className="w-16">SKU</span>
              <span className="flex-1">DESCRIPTION</span>
              <span className="w-12 text-right">QTY</span>
              <span className="w-16 text-right">PRICE</span>
            </div>
            {LINE_ITEMS.map((li) => (
              <div key={li.sku} className="flex text-[11px] py-1.5 tracking-tight border-b border-dotted border-[#0a0a0a]/25">
                <span className="w-16 opacity-70">{li.sku}</span>
                <span className="flex-1 pr-1 truncate">{li.name}</span>
                <span className="w-12 text-right">{li.qty}</span>
                <span className="w-16 text-right italic">{li.price}</span>
              </div>
            ))}
          </div>

          {/* TOTALS */}
          <div className="mt-6 border-t border-double border-[#0a0a0a] pt-4">
            <div className="text-[10px] tracking-[0.3em] mb-3 text-center opacity-70">== TOTALS ==</div>
            {TOTALS.map((t) => (
              <div key={t.label} className="flex text-[13px] py-1 justify-between border-b border-dotted border-[#0a0a0a]/25">
                <span>{t.label}</span>
                <span className="font-bold">{t.value}</span>
              </div>
            ))}
            <div className="flex text-[15px] font-bold py-3 justify-between border-t border-double border-[#0a0a0a] mt-2">
              <span>** SUBTOTAL **</span>
              <span>WORTH IT.</span>
            </div>
          </div>

          {/* ROSTER */}
          <div className="mt-8">
            <div className="text-[10px] tracking-[0.3em] mb-3 text-center opacity-70">== SELECTED CAST ==</div>
            <div className="border-t border-dashed border-[#0a0a0a]">
              {CLIENTS.map((c) => (
                <div key={c[0]} className="flex text-[11px] py-1 tracking-tight border-b border-dotted border-[#0a0a0a]/25">
                  <span className="w-10 opacity-60">{c[0]}</span>
                  <span className="flex-1 font-bold">{c[1]}</span>
                  <span className="w-32 opacity-70 truncate">{c[2]}</span>
                  <span className="w-6 text-right">[{c[3]}]</span>
                </div>
              ))}
            </div>
          </div>

          {/* STAMP */}
          <div className="mt-10 mb-6 flex justify-center relative">
            <div
              className="border-[3px] px-6 py-3 -rotate-[8deg]"
              style={{
                borderColor: "#a01414",
                color: "#a01414",
                fontFamily: "var(--font-receipt-mono), monospace",
              }}
            >
              <div className="text-[10px] tracking-[0.25em] mb-0.5">** APPROVED **</div>
              <div className="text-2xl font-black tracking-tight leading-none">GROWTH READY</div>
              <div className="text-[9px] tracking-[0.3em] mt-0.5 text-right">
                MMXXVI
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 border-t border-b border-[#0a0a0a] py-6 text-center">
            <div className="text-[10px] tracking-[0.3em] mb-3 opacity-70">== NEXT STEP ==</div>
            <div className="text-lg font-bold mb-4">
              CLAIM YOUR SLOT.
            </div>
            <a
              href="mailto:vektoagency@gmail.com"
              className="inline-block border-2 border-[#0a0a0a] px-5 py-2 text-[13px] tracking-[0.15em] font-bold hover:bg-[#0a0a0a] hover:text-[#f9f5eb] transition-colors"
            >
              → VEKTOAGENCY@GMAIL.COM ←
            </a>
            <div className="mt-4 text-[10px] tracking-[0.2em] opacity-70">
              12 PARTNER SLOTS · 2026 · FIRST-COME
            </div>
          </div>

          {/* BARCODE */}
          <div className="mt-8 text-center">
            <Barcode value={serial} />
            <div className="text-[10px] tracking-[0.15em] mt-1">
              VKT · {serial} · 2026 · BG
            </div>
          </div>

          {/* THANK YOU */}
          <div className="mt-8 pt-4 border-t border-dashed border-[#0a0a0a] text-center space-y-2">
            <div className="text-[10px] tracking-[0.3em]">** THANK YOU **</div>
            <div className="text-[10px] tracking-[0.25em]">
              KEEP THIS RECEIPT FOR YOUR RECORDS
            </div>
            <div className="text-[9px] tracking-[0.2em] opacity-70 pt-2">
              Vol · II · Est · MMXXIV<br />
              vektoagency.com · Sofia · Bulgaria
            </div>
          </div>

          {/* Nav to full site — as small print at very bottom */}
          <div className="mt-8 pt-4 border-t border-dotted border-[#0a0a0a] flex justify-between text-[10px] tracking-[0.15em]">
            <Link href="/" className="underline hover:no-underline">← BACK</Link>
            <Link href="/portfolio" className="underline hover:no-underline">PORTFOLIO</Link>
            <Link href="/case-studies" className="underline hover:no-underline">CASES</Link>
          </div>
        </div>

        {/* ===== BOTTOM PERFORATION ===== */}
        <PerforatedEdge position="bottom" />
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex text-[11px] py-0.5">
      <span className="w-24 opacity-70">{label}</span>
      <span className="opacity-40 mr-2">:</span>
      <span className="flex-1 font-bold">{value}</span>
    </div>
  );
}

function PerforatedEdge({ position }: { position: "top" | "bottom" }) {
  return (
    <svg
      viewBox="0 0 560 12"
      width="100%"
      height="12"
      preserveAspectRatio="none"
      className="block"
      style={{ transform: position === "top" ? "scaleY(-1)" : "none" }}
    >
      <path
        d="M0,0 L560,0 L560,4 L555,4 Q550,12 545,4 L545,4 L535,4 Q530,12 525,4 L525,4 L515,4 Q510,12 505,4 L505,4 L495,4 Q490,12 485,4 L485,4 L475,4 Q470,12 465,4 L465,4 L455,4 Q450,12 445,4 L445,4 L435,4 Q430,12 425,4 L425,4 L415,4 Q410,12 405,4 L405,4 L395,4 Q390,12 385,4 L385,4 L375,4 Q370,12 365,4 L365,4 L355,4 Q350,12 345,4 L345,4 L335,4 Q330,12 325,4 L325,4 L315,4 Q310,12 305,4 L305,4 L295,4 Q290,12 285,4 L285,4 L275,4 Q270,12 265,4 L265,4 L255,4 Q250,12 245,4 L245,4 L235,4 Q230,12 225,4 L225,4 L215,4 Q210,12 205,4 L205,4 L195,4 Q190,12 185,4 L185,4 L175,4 Q170,12 165,4 L165,4 L155,4 Q150,12 145,4 L145,4 L135,4 Q130,12 125,4 L125,4 L115,4 Q110,12 105,4 L105,4 L95,4 Q90,12 85,4 L85,4 L75,4 Q70,12 65,4 L65,4 L55,4 Q50,12 45,4 L45,4 L35,4 Q30,12 25,4 L25,4 L15,4 Q10,12 5,4 L0,4 Z"
        fill="#f9f5eb"
      />
    </svg>
  );
}

function Barcode({ value }: { value: string }) {
  // Deterministic barcode-like pattern from the serial
  const bars: number[] = [];
  for (let i = 0; i < value.length; i++) {
    const d = parseInt(value[i]);
    bars.push(1 + (d % 3));
  }
  return (
    <div className="inline-flex items-end gap-[2px] h-12">
      {[3, 1, 3, ...bars, ...bars.slice().reverse(), 3, 1, 3].map((w, i) => (
        <div
          key={i}
          className="bg-[#0a0a0a]"
          style={{ width: `${w * 2}px`, height: i % 4 === 0 ? "48px" : "42px" }}
        />
      ))}
    </div>
  );
}
