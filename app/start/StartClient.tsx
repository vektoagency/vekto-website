"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { startCopy, type Lang } from "./translations";
import { submitStartLead } from "../actions/start-lead";
import { trackEvent } from "../components/MetaPixel";

const LANG_KEY = "vekto-start-lang";

export default function StartClient() {
  const [lang, setLang] = useState<Lang>("bg");
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState("");
  const [phone, setPhone] = useState("");
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState(2500); // €/month — slider value
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Restore language preference. Default BG since site is BG-first; full
  // geo detection will come once i18n middleware is wired up.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "bg" || saved === "en") setLang(saved);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang, hydrated]);

  const t = startCopy[lang];

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!email.trim()) {
      setErrorMsg(t.error.requiredEmail);
      return;
    }
    setSubmitting(true);
    const ctLabels = contentTypes
      .map((id) => t.fields.contentTypeOptions.find((o) => o.id === id)?.label)
      .filter(Boolean)
      .join(", ");
    const budgetLabel =
      budget >= 10000
        ? t.fields.budgetMaxLabel
        : `${budget.toLocaleString(lang === "bg" ? "bg-BG" : "en-US")} ${t.fields.budgetSuffix}`;
    const res = await submitStartLead({
      lang,
      name,
      email,
      brand,
      phone,
      contentType: contentTypes.join(","),
      contentTypeLabel: ctLabels,
      budget: String(budget),
      budgetLabel,
      message,
    });
    setSubmitting(false);
    if (res.success) {
      // Meta Pixel — fire Lead event with the monthly budget as value.
      // Helps Meta's algo bid for higher-budget leads as we scale ads.
      trackEvent("Lead", { value: budget, currency: "EUR", content_name: ctLabels });
      setDone(true);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setErrorMsg(t.error.generic);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#ece8e1] flex flex-col">
      {/* Top bar — minimal, no nav distractions */}
      <header className="border-b border-[#1e1e1c] bg-[#080808]/95 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-5 md:px-8 py-3 md:py-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#9a958e] hover:text-[#c8ff00] transition-colors"
          >
            {t.meta.home}
          </Link>
          <button
            onClick={() => setLang(lang === "bg" ? "en" : "bg")}
            className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#c8ff00] border border-[#c8ff00]/40 px-2.5 md:px-3 py-1 md:py-1.5 rounded-sm hover:bg-[#c8ff00]/10 transition-colors"
            aria-label="Toggle language"
          >
            {t.meta.langToggle}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-5 md:px-8 py-10 md:py-16">
        {!done ? (
          <div className="animate-[startFade_0.5s_ease-out_both]">
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
              {t.meta.eyebrow}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-3">
              {t.meta.h1}
            </h1>
            <p className="text-[14px] md:text-base text-[#a0a0a0] leading-relaxed mb-8 md:mb-10">
              {t.meta.sub}
            </p>

            <div className="space-y-5 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <Field label={t.fields.name}>
                  <Input value={name} onChange={setName} placeholder={t.fields.namePh} />
                </Field>
                <Field label={t.fields.email}>
                  <Input value={email} onChange={setEmail} placeholder={t.fields.emailPh} type="email" required />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <Field label={t.fields.brand}>
                  <Input value={brand} onChange={setBrand} placeholder={t.fields.brandPh} type="url" />
                </Field>
                <Field label={t.fields.phone}>
                  <Input value={phone} onChange={setPhone} placeholder={t.fields.phonePh} type="tel" />
                </Field>
              </div>

              <Field label={t.fields.contentType}>
                <PillsMulti
                  values={contentTypes}
                  onToggle={(id) =>
                    setContentTypes((cur) =>
                      cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id]
                    )
                  }
                  options={t.fields.contentTypeOptions}
                />
              </Field>

              <Field label={t.fields.budget}>
                <BudgetSlider
                  value={budget}
                  onChange={setBudget}
                  max={10000}
                  step={250}
                  suffix={t.fields.budgetSuffix}
                  maxLabel={t.fields.budgetMaxLabel}
                  lang={lang}
                />
              </Field>

              <Field label={t.fields.message}>
                <Textarea
                  value={message}
                  onChange={setMessage}
                  placeholder={t.fields.messagePh}
                  rows={4}
                />
              </Field>
            </div>

            <div className="mt-8 md:mt-10 flex flex-col items-stretch md:flex-row md:items-center gap-3 md:gap-5">
              <button
                onClick={handleSubmit}
                disabled={submitting || !email.trim()}
                className="bg-[#c8ff00] text-black font-semibold px-8 py-3.5 rounded-full hover:bg-[#d4ff33] transition-colors text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "0 14px 40px -12px rgba(200,255,0,0.55)" }}
              >
                {submitting ? t.cta.submitting : t.cta.submit}
              </button>
              {errorMsg && (
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400 md:flex-1">
                  {errorMsg}
                </span>
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-[#1e1e1c] text-center">
              <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#9a958e] mb-3">
                {t.cta.orBook}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  data-cal-namespace="30min"
                  data-cal-link="vekto/30min"
                  data-cal-config='{"layout":"month_view","theme":"dark"}'
                  className="inline-flex items-center justify-center gap-2 border border-[#c8ff00]/45 text-[#c8ff00] font-semibold px-7 py-3 rounded-full hover:bg-[#c8ff00]/10 transition-colors font-mono text-xs uppercase tracking-[0.25em] cursor-pointer"
                >
                  📅 {t.cta.bookCta}
                </button>
                <a
                  href="tel:+359882251474"
                  className="inline-flex items-center justify-center gap-2 border border-[#c8ff00]/45 text-[#c8ff00] font-semibold px-7 py-3 rounded-full hover:bg-[#c8ff00]/10 transition-colors font-mono text-xs uppercase tracking-[0.25em]"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  {t.cta.callCta}
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Success state */
          <div className="animate-[startFade_0.5s_ease-out_both] py-6 md:py-12 text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c8ff00] text-black mb-7"
              style={{ boxShadow: "0 0 40px rgba(200,255,0,0.45)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-4">
              {t.meta.eyebrow}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
              {t.success.title}
            </h1>
            <p className="text-[15px] md:text-lg text-[#a0a0a0] leading-relaxed mb-8 max-w-xl mx-auto">
              {t.success.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                data-cal-namespace="30min"
                data-cal-link="vekto/30min"
                data-cal-config='{"layout":"month_view","theme":"dark"}'
                className="inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-semibold px-8 py-3.5 rounded-full hover:bg-[#d4ff33] transition-colors cursor-pointer"
                style={{ boxShadow: "0 14px 40px -12px rgba(200,255,0,0.55)" }}
              >
                {t.success.bookCta}
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-[#c8ff00]/40 text-[#c8ff00] font-semibold px-8 py-3.5 rounded-full hover:bg-[#c8ff00]/10 transition-colors font-mono text-sm uppercase tracking-[0.2em]"
              >
                {t.success.backHome}
              </Link>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes startFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Custom range slider — lime thumb, dark transparent track (real
           visuals are painted by the two divs behind the input). */
        .vekto-range {
          height: 28px;
        }
        .vekto-range::-webkit-slider-runnable-track {
          height: 6px;
          background: transparent;
          border-radius: 999px;
        }
        .vekto-range::-moz-range-track {
          height: 6px;
          background: transparent;
          border-radius: 999px;
        }
        .vekto-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          margin-top: -8px;
          border-radius: 999px;
          background: #c8ff00;
          border: 3px solid #050505;
          box-shadow: 0 0 0 1px #c8ff00, 0 0 18px rgba(200, 255, 0, 0.7);
          cursor: grab;
          transition: transform 0.15s ease;
        }
        .vekto-range:active::-webkit-slider-thumb {
          transform: scale(1.18);
          cursor: grabbing;
        }
        .vekto-range::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #c8ff00;
          border: 3px solid #050505;
          box-shadow: 0 0 0 1px #c8ff00, 0 0 18px rgba(200, 255, 0, 0.7);
          cursor: grab;
        }
        .vekto-range:active::-moz-range-thumb {
          transform: scale(1.18);
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}

/* ───────── building blocks ───────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#c8ff00]/85 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-[#0d0d0d] border border-[#1e1e1c] focus:border-[#c8ff00]/60 focus:outline-none focus:ring-1 focus:ring-[#c8ff00]/30 rounded-md px-4 py-3 text-[15px] text-[#ece8e1] placeholder-[#555] transition-colors resize-y leading-relaxed"
    />
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-[#0d0d0d] border border-[#1e1e1c] focus:border-[#c8ff00]/60 focus:outline-none focus:ring-1 focus:ring-[#c8ff00]/30 rounded-md px-4 py-3 text-[15px] text-[#ece8e1] placeholder-[#555] transition-colors"
    />
  );
}

function PillsMulti({
  values,
  onToggle,
  options,
}: {
  values: string[];
  onToggle: (id: string) => void;
  options: ReadonlyArray<{ id: string; label: string }>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = values.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onToggle(o.id)}
            className={`flex items-center gap-2 text-left px-4 py-2.5 rounded-md text-[13px] md:text-sm transition-all ${
              active
                ? "bg-[#c8ff00] text-black font-semibold border border-[#c8ff00]"
                : "bg-[#0d0d0d] text-[#ece8e1] border border-[#1e1e1c] hover:border-[#c8ff00]/40 hover:text-[#c8ff00]"
            }`}
          >
            <span
              aria-hidden
              className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center shrink-0 ${
                active ? "border-black bg-black" : "border-[#c8ff00]/40"
              }`}
            >
              {active && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function BudgetSlider({
  value,
  onChange,
  max,
  step,
  suffix,
  maxLabel,
  lang,
}: {
  value: number;
  onChange: (v: number) => void;
  max: number;
  step: number;
  suffix: string;
  maxLabel: string;
  lang: "bg" | "en";
}) {
  const pct = Math.min(100, (value / max) * 100);
  const display =
    value >= max
      ? maxLabel
      : `${value.toLocaleString(lang === "bg" ? "bg-BG" : "en-US")} ${suffix}`;
  return (
    <div>
      {/* Live value — big, mono, lime */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-[#c8ff00] tabular-nums">
          {display}
        </span>
      </div>
      <div className="relative">
        {/* Background track */}
        <div className="absolute inset-y-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-[#1e1e1c] rounded-full pointer-events-none" />
        {/* Lime fill */}
        <div
          aria-hidden
          className="absolute inset-y-1/2 -translate-y-1/2 left-0 h-1.5 bg-[#c8ff00] rounded-full pointer-events-none transition-[width] duration-150"
          style={{
            width: `${pct}%`,
            boxShadow: "0 0 12px rgba(200,255,0,0.5)",
          }}
        />
        <input
          type="range"
          min={500}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="vekto-range relative w-full appearance-none bg-transparent cursor-grab active:cursor-grabbing"
          aria-label="Budget"
        />
      </div>
      {/* Min/max ticks */}
      <div className="flex items-center justify-between mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666]">
        <span>500 €</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
