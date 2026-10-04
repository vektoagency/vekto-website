"use client";

// ============================================================================
// /hospitality — the /cv page, cut down for hotels and villa owners.
//
// Four parts: hero, the work, what we do for a property, contact. No nav,
// no funnel - the reader arrived from an email about a stay. English, Thai
// and Spanish on their own switch (?lang=th|es, or a Thai / Spanish browser).
// The page names no trip or dates - one link serves every outreach.
// Thai has no capitals and breaks under wide tracking, and its vowel and
// tone marks sit above and below the line - so Thai text gets normal
// tracking and open line-height instead of the film-world uppercase.
// ============================================================================

import { useEffect, useState } from "react";
import bunnyData from "../data/bunny-clips.json";
import { ClipTile, ClipLightbox, type Clip } from "../portfolio/PortfolioClient";
import SectionPlate from "../components/SectionPlate";

type L = "en" | "th" | "es";

const SILVER_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 22%, #8a8a8a 45%, #eaeaea 62%, #c8c8c8 78%, #ffffff 100%)";
const WORDMARK_METAL =
  "linear-gradient(180deg, #d4d4d4 0%, #a8a8a8 40%, #7a7a7a 70%, #969696 100%)";
const PIXEL = "var(--brutal-pixel), ui-monospace, monospace";
const COMIC = "var(--brutal-comic), system-ui, sans-serif";

const all = bunnyData.clips as Clip[];
const HOTELS = all.filter((c) => c.hospitality === "hotel");
const PROPERTY = all.filter((c) => c.hospitality === "property");

function ChannelIcon({ kind }: { kind: string }) {
  const common = {
    width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 1.8, strokeLinecap: "square" as const, strokeLinejoin: "miter" as const,
  };
  if (kind === "call")
    return (<svg {...common} aria-hidden><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>);
  if (kind === "whatsapp")
    return (
      <svg {...common} aria-hidden>
        <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
        <path d="M9 9.5c.4 2.3 2.2 4.1 4.5 4.5l1.2-1.2 1.8.8v1.6c-4 .4-8.4-4-8-8h1.6l.8 1.8z" strokeWidth={1.4} />
      </svg>
    );
  return (<svg {...common} aria-hidden><rect x="3" y="5" width="18" height="14" /><path d="M3 6l9 7 9-7" /></svg>);
}

const COPY = {
  en: {
    heroEyebrow: "VEKTO · VIDEO FOR HOTELS & VILLAS",
    h1a: "VIDEO FOR PLACES",
    h1b: "PEOPLE STAY IN.",
    sub: "Short vertical video for Instagram, TikTok and your listings - plus direct booking pages and ads that bring guests to you without an OTA commission.",
    stats: [
      { num: "300+", label: "VIDEOS / MONTH" },
      { num: "100+", label: "BUSINESSES" },
      { num: "BG · US", label: "TWO MARKETS" },
    ],
    workEyebrow: "01 · CLIENT WORK",
    workTitle: "THE VIDEOS",
    soundOn: "Sound on.",
    hotels: "Hotels & resorts",
    hotelsNote: "Wellness and mountain resorts - rooms, pools, restaurant, grounds.",
    property: "Property",
    propertyNote: "Not hotels - residential developments. Same job: sell a building on camera.",
    offerEyebrow: "02 · FOR YOUR PROPERTY",
    offerTitle: "WHAT WE DO",
    offer: [
      { title: "Short vertical video", text: "Cut for Reels, TikTok and the top of your Booking and Airbnb listings. Yours to keep and use anywhere." },
      { title: "Stills from the same session", text: "Graded photos for your listings, your website and print." },
      { title: "Direct booking page + ads", text: "So more guests book with you directly, instead of paying an OTA around 15%." },
    ],
    offerNote: "How many videos, and which parts, we agree with you before we start.",
    contactEyebrow: "03 · CONTACT",
    contactA: "LET'S",
    contactB: "TALK.",
    contactSub: "A reply within 24 hours - from a person, not a bot.",
    channels: [
      { kind: "call", label: "CALL", value: "+359 88 225 1474", action: "Call", href: "tel:+359882251474" },
      { kind: "whatsapp", label: "WHATSAPP", value: "Message us", action: "Open chat", href: "https://wa.me/359882251474" },
      { kind: "email", label: "EMAIL", value: "vektoagency@gmail.com", action: "Write", href: "mailto:vektoagency@gmail.com" },
    ],
    copy: "Copy",
    copied: "Copied",
    based: "BULGARIA · US",
    rights: "All rights reserved.",
  },
  th: {
    heroEyebrow: "VEKTO · วิดีโอสำหรับโรงแรมและวิลล่า",
    h1a: "วิดีโอสำหรับ",
    h1b: "ที่พักของคุณ",
    sub: "วิดีโอแนวตั้งสั้น ๆ สำหรับ Instagram, TikTok และหน้าประกาศที่พักของคุณ พร้อมหน้าเว็บจองตรงและโฆษณา ที่พาแขกมาจองกับคุณโดยไม่ต้องเสียค่าคอมมิชชั่นให้ OTA",
    stats: [
      { num: "300+", label: "วิดีโอต่อเดือน" },
      { num: "100+", label: "ธุรกิจ" },
      { num: "BG · US", label: "สองตลาด" },
    ],
    workEyebrow: "01 · ผลงานลูกค้า",
    workTitle: "ผลงานวิดีโอ",
    soundOn: "เปิดเสียงเพื่อรับชม",
    hotels: "โรงแรมและรีสอร์ต",
    hotelsNote: "รีสอร์ตสุขภาพและรีสอร์ตบนภูเขา - ห้องพัก สระว่ายน้ำ ร้านอาหาร และบริเวณรอบ ๆ",
    property: "อสังหาริมทรัพย์",
    propertyNote: "ไม่ใช่โรงแรม แต่เป็นโครงการที่อยู่อาศัย - งานเดียวกัน คือขายอาคารผ่านวิดีโอ",
    offerEyebrow: "02 · สำหรับที่พักของคุณ",
    offerTitle: "สิ่งที่เราทำ",
    offer: [
      { title: "วิดีโอแนวตั้งสั้น", text: "ตัดต่อสำหรับ Reels, TikTok และหน้าประกาศบน Booking และ Airbnb เป็นของคุณ ใช้ได้ทุกที่" },
      { title: "ภาพนิ่งจากการถ่ายครั้งเดียวกัน", text: "ภาพที่ปรับสีแล้ว สำหรับหน้าประกาศ เว็บไซต์ และงานพิมพ์" },
      { title: "หน้าเว็บจองตรง + โฆษณา", text: "เพื่อให้แขกจองกับคุณโดยตรงมากขึ้น แทนที่จะเสียค่าคอมมิชชั่นประมาณ 15% ให้ OTA" },
    ],
    offerNote: "จำนวนวิดีโอและขอบเขตงาน เราตกลงกับคุณก่อนเริ่มงาน",
    contactEyebrow: "03 · ติดต่อ",
    contactA: "คุย",
    contactB: "กับเรา",
    contactSub: "ตอบกลับภายใน 24 ชั่วโมง โดยคนจริง ไม่ใช่บอท",
    channels: [
      { kind: "call", label: "โทร", value: "+359 88 225 1474", action: "โทรเลย", href: "tel:+359882251474" },
      { kind: "whatsapp", label: "WHATSAPP", value: "ส่งข้อความหาเรา", action: "เปิดแชท", href: "https://wa.me/359882251474" },
      { kind: "email", label: "อีเมล", value: "vektoagency@gmail.com", action: "เขียนถึงเรา", href: "mailto:vektoagency@gmail.com" },
    ],
    copy: "คัดลอก",
    copied: "คัดลอกแล้ว",
    based: "บัลแกเรีย · สหรัฐฯ",
    rights: "สงวนลิขสิทธิ์",
  },
  es: {
    heroEyebrow: "VEKTO · VÍDEO PARA HOTELES Y VILLAS",
    h1a: "VÍDEO PARA",
    h1b: "HOTELES Y VILLAS.",
    sub: "Vídeos verticales cortos para Instagram, TikTok y tus anuncios - y páginas de reserva directa y publicidad que te traen huéspedes sin pagar comisión a Booking o Airbnb.",
    stats: [
      { num: "300+", label: "VÍDEOS / MES" },
      { num: "100+", label: "EMPRESAS" },
      { num: "BG · US", label: "DOS MERCADOS" },
    ],
    workEyebrow: "01 · TRABAJO PARA CLIENTES",
    workTitle: "LOS VÍDEOS",
    soundOn: "Con sonido.",
    hotels: "Hoteles y resorts",
    hotelsNote: "Resorts de bienestar y de montaña - habitaciones, piscinas, restaurante, entorno.",
    property: "Inmuebles",
    propertyNote: "No son hoteles - promociones residenciales. El mismo trabajo: vender un edificio en vídeo.",
    offerEyebrow: "02 · PARA TU ALOJAMIENTO",
    offerTitle: "LO QUE HACEMOS",
    offer: [
      { title: "Vídeo vertical corto", text: "Montado para Reels, TikTok y la parte superior de tus anuncios en Booking y Airbnb. Es tuyo y lo usas donde quieras." },
      { title: "Fotos de la misma sesión", text: "Fotos retocadas para tus anuncios, tu web e impresión." },
      { title: "Reserva directa + publicidad", text: "Para que más huéspedes reserven directamente contigo, en lugar de pagar alrededor de un 15 % a una OTA." },
    ],
    offerNote: "Cuántos vídeos y qué partes, lo acordamos contigo antes de empezar.",
    contactEyebrow: "03 · CONTACTO",
    contactA: "VAMOS A",
    contactB: "HABLAR.",
    contactSub: "Respuesta en 24 horas - de una persona, no de un bot.",
    channels: [
      { kind: "call", label: "LLAMAR", value: "+359 88 225 1474", action: "Llamar", href: "tel:+359882251474" },
      { kind: "whatsapp", label: "WHATSAPP", value: "Escríbenos", action: "Abrir chat", href: "https://wa.me/359882251474" },
      { kind: "email", label: "EMAIL", value: "vektoagency@gmail.com", action: "Escribir", href: "mailto:vektoagency@gmail.com" },
    ],
    copy: "Copiar",
    copied: "Copiado",
    based: "BULGARIA · EE. UU.",
    rights: "Todos los derechos reservados.",
  },
} as const;

const LANGS: { id: L; label: string; aria: string }[] = [
  { id: "en", label: "EN", aria: "English" },
  { id: "th", label: "ไทย", aria: "ภาษาไทย" },
  { id: "es", label: "ES", aria: "Español" },
];

export default function HospitalityClient() {
  const [lang, setLang] = useState<L>("en");
  const t = COPY[lang];
  const th = lang === "th";

  const [solid, setSolid] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [expanded, setExpanded] = useState<Clip | null>(null);
  const [copied, setCopied] = useState(false);

  // ?lang=th from an email, or a Thai browser, opens the page in Thai.
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const q = qs.get("lang");
    const nav = (navigator.language || "").toLowerCase();
    if (q === "th" || q === "en" || q === "es") setLang(q);
    else if (nav.startsWith("th")) setLang("th");
    else if (nav.startsWith("es")) setLang("es");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The hero video is desktop-only; phones get its still.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  useEffect(() => {
    window.dispatchEvent(new Event(expanded ? "vekto:player-open" : "vekto:player-closed"));
  }, [expanded]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("vektoagency@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = "mailto:vektoagency@gmail.com";
    }
  };

  // Thai: no wide tracking, no forced caps, room for marks above and below.
  const track = (en: string) => (th ? "0.02em" : en);
  const lh = (en: number) => (th ? Math.max(en, 1.3) : en);
  const eyebrow = `text-[10px] md:text-xs font-bold ${th ? "" : "uppercase"} opacity-55`;
  const sectionTitle = `font-black ${th ? "" : "uppercase"}`;
  const silver = { background: SILVER_H, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } as const;

  return (
    <div
      className="relative"
      style={{ background: "#0d0d0d", color: "#f4f4f4", fontFamily: "var(--brutal-display), system-ui, sans-serif", overflowX: "clip" }}
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 3px)" }}
      />

      {/* ============ HEADER — wordmark and the language toggle ============ */}
      <div
        className="fixed inset-x-0 top-0 z-50"
        style={{
          background: solid ? "rgba(13,13,13,0.94)" : "transparent",
          borderBottom: solid ? "1px solid rgba(244,244,244,0.18)" : "1px solid transparent",
          backdropFilter: solid ? "blur(8px)" : undefined,
          transition: "background-color 300ms ease, border-color 300ms ease",
        }}
      >
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div
            role="img"
            aria-label="VEKTO"
            className="h-8 md:h-11 w-[112px] md:w-[180px] shrink-0"
            style={{
              background: WORDMARK_METAL,
              filter: "drop-shadow(0 0 1px rgba(13,13,13,0.95)) drop-shadow(0 1px 5px rgba(13,13,13,0.75))",
              WebkitMaskImage: "url(/images/logo.png)", maskImage: "url(/images/logo.png)",
              WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
              WebkitMaskPosition: "left center", maskPosition: "left center",
              WebkitMaskSize: "contain", maskSize: "contain",
            }}
          />
          <div className="flex shrink-0" role="group" aria-label="Language">
            {LANGS.map((o, i) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setLang(o.id)}
                aria-label={o.aria}
                aria-pressed={lang === o.id}
                className={`px-2.5 md:px-3 py-2 font-bold text-xs transition-colors ${lang === o.id ? "bg-white text-black" : "text-[#f4f4f4] hover:bg-white/15"}`}
                style={{
                  border: "1.5px solid rgba(244,244,244,0.75)",
                  marginLeft: i ? -1.5 : 0,
                  letterSpacing: o.id === "th" ? "0" : "0.2em",
                  fontFamily: "var(--f-thai), var(--f-display-lat), sans-serif",
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section className="relative flex flex-col justify-end overflow-hidden" style={{ minHeight: "88dvh" }}>
        <div className="absolute inset-0 z-0">
          {isDesktop === true && (
            <video src="/videos/arte-script-1-480p.mp4" autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover" />
          )}
          {isDesktop === false && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/videos/thumbnails/arte-script-1.webp" alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div aria-hidden className="absolute inset-0 z-[1] pointer-events-none" style={{ background: "rgba(13,13,13,0.6)" }} />
        <div aria-hidden className="absolute inset-x-0 top-0 h-[38%] z-[1] pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(13,13,13,0.96) 0%, rgba(13,13,13,0.6) 55%, transparent 100%)" }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[50%] z-[1] pointer-events-none" style={{ background: "linear-gradient(to top, rgba(13,13,13,0.98) 0%, rgba(13,13,13,0.7) 55%, transparent 100%)" }} />

        <div className="relative z-10 px-6 md:px-14 pb-12 md:pb-16 max-w-[1400px] w-full mx-auto">
          <p className={`${eyebrow} mb-5`} style={{ fontFamily: PIXEL, letterSpacing: track("0.35em") }}>{t.heroEyebrow}</p>
          <h1
            className={`font-black ${th ? "" : "uppercase"} mb-6 max-w-5xl`}
            style={{ fontSize: th ? "clamp(34px, 6vw, 88px)" : "clamp(38px, 7.2vw, 108px)", lineHeight: lh(0.94), letterSpacing: th ? "0" : "-0.03em" }}
          >
            {t.h1a}
            <br />
            <span className={th ? "" : "italic pr-[0.08em]"} style={silver}>{t.h1b}</span>
          </h1>
          <p className="text-[15px] md:text-lg max-w-2xl opacity-80 font-medium mb-5" style={{ fontFamily: COMIC, lineHeight: th ? 1.7 : 1.6 }}>
            {t.sub}
          </p>
          <div className="mb-5 md:mb-6" />
          <div className="grid grid-cols-3 gap-4 md:gap-10 pt-5" style={{ borderTop: "1px solid rgba(244,244,244,0.25)" }}>
            {t.stats.map((s) => (
              <div key={s.num}>
                <div className="font-black leading-none tabular-nums" style={{ fontSize: "clamp(22px, 3vw, 44px)", letterSpacing: "-0.03em", ...silver }}>{s.num}</div>
                <p className={`text-[10px] md:text-[11px] font-bold ${th ? "" : "uppercase"} opacity-65 mt-1.5`} style={{ fontFamily: PIXEL, letterSpacing: track("0.22em") }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 01 · THE WORK ============ */}
      <section id="work" className="py-14 md:py-24" style={{ background: "#141414", borderTop: "1px solid rgba(244,244,244,0.14)", borderBottom: "1px solid rgba(244,244,244,0.14)" }}>
        <div className="px-6 md:px-14 max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10 md:mb-12">
            <div>
              <p className={`${eyebrow} mb-4`} style={{ fontFamily: PIXEL, letterSpacing: track("0.35em") }}>{t.workEyebrow} · {HOTELS.length + PROPERTY.length}</p>
              <h2 className={sectionTitle} style={{ fontSize: "clamp(34px, 5.4vw, 80px)", lineHeight: lh(0.96), letterSpacing: th ? "0" : "-0.03em" }}>{t.workTitle}</h2>
            </div>
            <p className={`text-[11px] font-bold opacity-50 ${th ? "" : "uppercase"}`} style={{ fontFamily: PIXEL, letterSpacing: track("0.2em") }}>{t.soundOn}</p>
          </div>

          {[
            { label: t.hotels, note: t.hotelsNote, clips: HOTELS, offset: 0 },
            { label: t.property, note: t.propertyNote, clips: PROPERTY, offset: HOTELS.length },
          ]
            .filter((g) => g.clips.length > 0)
            .map((g) => (
              <div key={g.label} className="mb-10 md:mb-14 last:mb-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 border-b border-[#f4f4f4]/20 pb-2.5 mb-5">
                  <h3 className={`text-[12px] font-bold ${th ? "" : "uppercase"} whitespace-nowrap`} style={{ fontFamily: PIXEL, letterSpacing: track("0.3em") }}>{g.label}</h3>
                  <span className={`text-[11px] opacity-45 ${th ? "" : "uppercase"}`} style={{ fontFamily: PIXEL, letterSpacing: track("0.14em") }}>{g.note}</span>
                </div>
                <div className="grid grid-flow-dense grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-7">
                  {g.clips.map((c, i) => (
                    <ClipTile key={c.id} clip={c} idx={g.offset + i} onExpand={() => setExpanded(c)} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ============ 02 · WHAT WE DO FOR A PROPERTY ============ */}
      <section className="px-6 md:px-14 py-14 md:py-24 max-w-[1400px] mx-auto">
        <p className={`${eyebrow} mb-4`} style={{ fontFamily: PIXEL, letterSpacing: track("0.35em") }}>{t.offerEyebrow}</p>
        <h2 className={`${sectionTitle} mb-10 md:mb-12`} style={{ fontSize: "clamp(34px, 5.4vw, 80px)", lineHeight: lh(0.96), letterSpacing: th ? "0" : "-0.03em" }}>{t.offerTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
          {t.offer.map((o, i) => (
            <div key={o.title} className="border-2 p-6 md:p-7 flex flex-col" style={{ background: "#0d0d0d", borderColor: "rgba(244,244,244,0.3)", boxShadow: "6px 6px 0 0 #2a2a2a" }}>
              <span className="self-start px-2 py-1 border-2 border-black text-[11px] font-bold tracking-[0.25em] mb-6" style={{ background: SILVER_H, color: "#0d0d0d", fontFamily: "var(--f-pixel), monospace" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={`font-black ${th ? "" : "uppercase"} mb-3 text-balance`} style={{ fontSize: "clamp(20px, 1.7vw, 26px)", lineHeight: lh(1), letterSpacing: th ? "0" : "-0.02em" }}>{o.title}</h3>
              <p className="text-[14px] font-medium opacity-80" style={{ fontFamily: COMIC, lineHeight: th ? 1.75 : 1.55 }}>{o.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[14px] opacity-60 max-w-[70ch]" style={{ fontFamily: COMIC, lineHeight: th ? 1.75 : 1.55 }}>{t.offerNote}</p>
      </section>

      {/* ============ 03 · CONTACT ============ */}
      <section id="contact" className="relative overflow-hidden" style={{ background: "#141414", borderTop: "1px solid rgba(244,244,244,0.14)" }}>
        <SectionPlate src="creatives" ground="#141414" opacity={0.42} />
        <div className="relative z-10 px-6 md:px-14 pt-14 md:pt-24 pb-10 md:pb-12 max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12 mb-10 md:mb-14">
            <div>
              <p className={`${eyebrow} mb-4`} style={{ fontFamily: PIXEL, letterSpacing: track("0.35em") }}>{t.contactEyebrow}</p>
              <h2 className={`${sectionTitle} lg:whitespace-nowrap`} style={{ fontSize: th ? "clamp(44px, 7vw, 110px)" : "clamp(48px, 8.4vw, 132px)", lineHeight: lh(0.96), letterSpacing: th ? "0" : "-0.03em" }}>
                {t.contactA}{th ? "" : " "}
                <span className={th ? "" : "italic pr-[0.06em]"} style={silver}>{t.contactB}</span>
              </h2>
            </div>
            <div className="lg:max-w-[340px] lg:pb-3">
              <p className="text-[15px] md:text-[17px] opacity-80 font-medium mb-4" style={{ fontFamily: COMIC, lineHeight: th ? 1.7 : 1.6 }}>{t.contactSub}</p>
              <div className={`flex items-center gap-2.5 text-[11px] font-bold opacity-55 ${th ? "" : "uppercase"}`} style={{ fontFamily: PIXEL, letterSpacing: track("0.3em") }}>
                <span aria-hidden className="w-[7px] h-[7px] rotate-45" style={{ background: "#f4f4f4" }} />
                {t.based}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {t.channels.map((ch) => {
              const external = ch.href.startsWith("http");
              return (
                <div key={ch.kind} className="relative">
                  <a
                    href={ch.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group flex h-full flex-row md:flex-col items-center md:items-stretch gap-4 md:gap-0 border-2 p-4 md:p-6 transition-[background-color,color,transform] duration-200 bg-[rgba(13,13,13,0.82)] text-[#f4f4f4] hover:bg-white hover:text-black hover:-translate-x-0.5 hover:-translate-y-0.5"
                    style={{ borderColor: "rgba(244,244,244,0.55)", boxShadow: "6px 6px 0 0 #2a2a2a" }}
                  >
                    <span className="flex shrink-0 items-start justify-between md:mb-10">
                      <span className="w-11 h-11 flex items-center justify-center border-2" style={{ borderColor: "currentColor" }}><ChannelIcon kind={ch.kind} /></span>
                      <span aria-hidden className="hidden md:inline text-2xl font-black leading-none transition-transform group-hover:translate-x-1">→</span>
                    </span>
                    <span className="min-w-0 flex-1 md:flex-none">
                      <span className="block text-[10px] md:text-[11px] font-bold opacity-60 mb-1.5 md:mb-2" style={{ fontFamily: PIXEL, letterSpacing: track("0.3em") }}>{ch.label}</span>
                      <span className="block font-black text-[17px] md:text-[clamp(16px,1.55vw,23px)] tabular-nums leading-tight truncate md:whitespace-normal">{ch.value}</span>
                    </span>
                    <span aria-hidden className="md:hidden shrink-0 text-xl font-black leading-none">→</span>
                    <span className="hidden md:block mt-auto pt-4 text-[11px] font-bold opacity-70" style={{ fontFamily: PIXEL, letterSpacing: track("0.25em") }}>
                      <span className="block mb-4 mt-5 h-px" style={{ background: "currentColor", opacity: 0.35 }} />
                      {ch.action}
                    </span>
                  </a>
                  {ch.kind === "email" && (
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="hidden md:block absolute right-6 bottom-[21px] px-2.5 py-1 text-[10px] font-bold border transition-colors bg-[rgba(13,13,13,0.9)] text-[#f4f4f4] hover:bg-white hover:text-black"
                      style={{ fontFamily: PIXEL, borderColor: "rgba(244,244,244,0.55)", letterSpacing: track("0.22em") }}
                      aria-live="polite"
                    >
                      {copied ? `✓ ${t.copied}` : t.copy}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-14 md:mt-20 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] opacity-45" style={{ borderTop: "1px solid rgba(244,244,244,0.14)", fontFamily: PIXEL, letterSpacing: track("0.2em") }}>
            <span>© {new Date().getFullYear()} VEKTO. {t.rights}</span>
            <span>vektoagency.com</span>
          </div>
        </div>
      </section>

      {expanded && <ClipLightbox clip={expanded} onClose={() => setExpanded(null)} />}
    </div>
  );
}
