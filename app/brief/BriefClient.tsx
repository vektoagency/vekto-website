"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { briefCopy, type Lang } from "./translations";
import { submitBrief, type BriefSubmission } from "../actions/brief";
import { useLang } from "../i18n/LangProvider";
import SiteHeader from "../components/SiteHeader";

const SILVER_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 22%, #8a8a8a 45%, #eaeaea 62%, #c8c8c8 78%, #ffffff 100%)";
const PIXEL = "var(--brutal-pixel), ui-monospace, monospace";
const COMIC = "var(--brutal-comic), system-ui, sans-serif";

const TOTAL_STEPS = 4;
const STORAGE_KEY = "vekto-brief-draft-v1";

const initialForm: BriefSubmission = {
  lang: "bg",
  brand: "",
  website: "",
  ig: "",
  industry: "",
  pitch: "",
  audience: "",
  problem: "",
  usp: "",
  competitors: "",
  competitorsStrengths: "",
  tone: "",
  platforms: [],
  currentMaker: "",
  whatNotWorking: "",
  topClips: "",
  name: "",
  role: "",
  email: "",
  phone: "",
  additional: "",
};

export default function BriefClient() {
  // Language lives in the global LangProvider (vekto-lang cookie) so the
  // shared SiteHeader toggle switches this page's copy too.
  const { lang } = useLang();
  const [step, setStep] = useState(0); // 0 = intro, 1-4 = steps, 5 = success
  const [form, setForm] = useState<BriefSubmission>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY);
      if (draft) {
        const parsed = JSON.parse(draft) as BriefSubmission;
        setForm({ ...initialForm, ...parsed });
      }
    } catch {
      // ignore — fresh start
    }
    setHydrated(true);
  }, []);

  // Mirror the provider language into the submission payload
  useEffect(() => {
    setForm((f) => (f.lang === lang ? f : { ...f, lang }));
  }, [lang]);

  // Persist draft
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // storage full — silent fail
    }
  }, [form, hydrated]);

  const t = briefCopy[lang];

  const update = <K extends keyof BriefSubmission>(key: K, value: BriefSubmission[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleArray = (key: "platforms", value: string) => {
    setForm((f) => {
      const cur = f[key];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...f, [key]: next };
    });
  };

  const handleNext = () => {
    setErrorMsg(null);
    if (step < TOTAL_STEPS) setStep(step + 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (step > 0) setStep(step - 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    const res = await submitBrief(form);
    setSubmitting(false);
    if (res.success) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      setStep(5);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setErrorMsg(t.error.generic);
    }
  };

  const progressPct = step === 0 ? 0 : step === 5 ? 100 : ((step - 1) / TOTAL_STEPS) * 100 + 100 / TOTAL_STEPS / 2;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#0d0d0d",
        color: "#f4f4f4",
        fontFamily: "var(--brutal-display), system-ui, sans-serif",
        ...({ "--bgk": lang === "bg" ? "0.92" : "1" } as React.CSSProperties),
      }}
    >
      {/* Top bar — shared site header + the wizard's own progress strip
          sticky right under it */}
      <SiteHeader solid />
      <header className="sticky top-[56px] md:top-[76px] z-30">
        {/* Progress bar */}
        <div className="h-[2px]" style={{ background: "rgba(244,244,244,0.14)" }}>
          <div
            className="h-full bg-[#f4f4f4] transition-all duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              boxShadow: "0 0 10px rgba(244,244,244,0.55)",
            }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 md:px-8 py-8 md:py-14">
        {/* Step 0 — intro */}
        {step === 0 && (
          <div className="animate-[briefFade_0.5s_ease-out_both]">
            <p
              className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] opacity-55 mb-4"
              style={{ fontFamily: PIXEL }}
            >
              {t.intro.eyebrow}
            </p>
            <h1
              className="font-black uppercase leading-[1.02] tracking-[-0.03em] mb-5"
              style={{ fontSize: "calc(clamp(30px, 5vw, 56px) * var(--bgk, 1))" }}
            >
              {t.intro.h1}
            </h1>
            <p
              className="text-[15px] md:text-lg leading-relaxed mb-8 max-w-xl opacity-70 font-medium"
              style={{ fontFamily: COMIC }}
            >
              {t.intro.sub}
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1.5"
                style={{ fontFamily: PIXEL, border: "1.5px solid rgba(244,244,244,0.5)" }}
              >
                {t.meta.timeEstimate}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 opacity-55"
                style={{ fontFamily: PIXEL, border: "1px solid rgba(244,244,244,0.22)" }}
              >
                {t.meta.autoSaved}
              </span>
            </div>
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-2 bg-[#f4f4f4] text-[#0d0d0d] font-black uppercase tracking-[0.15em] px-8 py-4 text-[13px] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"
              style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
            >
              {t.intro.start}
            </button>
          </div>
        )}

        {/* Step 1 — Who you are */}
        {step === 1 && (
          <StepWrapper title={t.step1.title} stepLabel={t.meta.stepOf(1, TOTAL_STEPS)}>
            <Field label={t.step1.brand}>
              <Input value={form.brand} onChange={(v) => update("brand", v)} placeholder={t.step1.brandPh} required />
            </Field>
            <Field label={t.step1.website}>
              <Input value={form.website} onChange={(v) => update("website", v)} placeholder={t.step1.websitePh} type="url" />
            </Field>
            <Field label={t.step1.ig}>
              <Input value={form.ig} onChange={(v) => update("ig", v)} placeholder={t.step1.igPh} />
            </Field>
            <Field label={t.step1.industry}>
              <Select
                value={form.industry}
                onChange={(v) => update("industry", v)}
                options={t.step1.industryOptions}
                lang={lang}
              />
            </Field>
          </StepWrapper>
        )}

        {/* Step 2 — Positioning */}
        {step === 2 && (
          <StepWrapper title={t.step2.title} stepLabel={t.meta.stepOf(2, TOTAL_STEPS)}>
            <Field label={t.step2.pitch}>
              <Input value={form.pitch} onChange={(v) => update("pitch", v)} placeholder={t.step2.pitchPh} />
            </Field>
            <Field label={t.step2.audience}>
              <Textarea value={form.audience} onChange={(v) => update("audience", v)} placeholder={t.step2.audiencePh} />
            </Field>
            <Field label={t.step2.problem}>
              <Textarea value={form.problem} onChange={(v) => update("problem", v)} placeholder={t.step2.problemPh} />
            </Field>
            <Field label={t.step2.usp}>
              <Textarea value={form.usp} onChange={(v) => update("usp", v)} placeholder={t.step2.uspPh} />
            </Field>
            <Field label={t.step2.competitors}>
              <Textarea value={form.competitors} onChange={(v) => update("competitors", v)} placeholder={t.step2.competitorsPh} rows={3} />
            </Field>
            <Field label={t.step2.competitorsStrengths}>
              <Textarea value={form.competitorsStrengths} onChange={(v) => update("competitorsStrengths", v)} placeholder={t.step2.competitorsStrengthsPh} rows={3} />
            </Field>
            <Field label={t.step2.tone}>
              <Pills value={form.tone} onChange={(v) => update("tone", v)} options={t.step2.toneOptions} />
            </Field>
          </StepWrapper>
        )}

        {/* Step 3 — Audit */}
        {step === 3 && (
          <StepWrapper title={t.step3.title} stepLabel={t.meta.stepOf(3, TOTAL_STEPS)}>
            <Field label={t.step3.platforms}>
              <PillsMulti
                values={form.platforms}
                onToggle={(v) => toggleArray("platforms", v)}
                options={t.step3.platformsOptions}
              />
            </Field>
            <Field label={t.step3.currentMaker}>
              <Pills value={form.currentMaker} onChange={(v) => update("currentMaker", v)} options={t.step3.currentMakerOptions} />
            </Field>
            <Field label={t.step3.whatNotWorking}>
              <Textarea value={form.whatNotWorking} onChange={(v) => update("whatNotWorking", v)} placeholder={t.step3.whatNotWorkingPh} />
            </Field>
            <Field label={t.step3.topClips}>
              <Textarea value={form.topClips} onChange={(v) => update("topClips", v)} placeholder={t.step3.topClipsPh} rows={3} />
            </Field>
          </StepWrapper>
        )}




        {/* Step 7 — Logistics */}
        {step === 4 && (
          <StepWrapper title={t.step4.title} stepLabel={t.meta.stepOf(4, TOTAL_STEPS)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-0">
              <Field label={t.step4.name}>
                <Input value={form.name} onChange={(v) => update("name", v)} placeholder={t.step4.namePh} required />
              </Field>
              <Field label={t.step4.role}>
                <Input value={form.role} onChange={(v) => update("role", v)} placeholder={t.step4.rolePh} />
              </Field>
              <Field label={t.step4.email}>
                <Input value={form.email} onChange={(v) => update("email", v)} placeholder={t.step4.emailPh} type="email" required />
              </Field>
              <Field label={t.step4.phone}>
                <Input value={form.phone} onChange={(v) => update("phone", v)} placeholder={t.step4.phonePh} type="tel" required />
              </Field>
            </div>
            <Field label={t.step4.additional}>
              <Textarea value={form.additional} onChange={(v) => update("additional", v)} placeholder={t.step4.additionalPh} rows={4} />
            </Field>
          </StepWrapper>
        )}

        {/* Step 8 — Success */}
        {step === 5 && (
          <div className="animate-[briefFade_0.5s_ease-out_both] py-8 md:py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f4f4f4] text-[#0d0d0d] mb-7"
              style={{ boxShadow: "0 0 40px rgba(244,244,244,0.45)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p
              className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] opacity-55 mb-4"
              style={{ fontFamily: PIXEL }}
            >
              {t.intro.eyebrow}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
              {t.success.title}
            </h1>
            <p className="text-[15px] md:text-lg text-[#a0a0a0] leading-relaxed mb-8 max-w-xl mx-auto">
              {t.success.body}
            </p>
            <div className="flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-[#f4f4f4] text-[#0d0d0d] font-black px-8 py-3.5 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform text-[13px] uppercase tracking-[0.15em]"
                style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
              >
                {t.success.backHome}
              </Link>
            </div>
          </div>
        )}

        {/* Nav buttons (hide on intro & success) */}
        {step > 0 && step < 5 && (
          <div className="mt-10 md:mt-12 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-6" style={{ borderTop: "1px solid rgba(244,244,244,0.14)" }}>
            <button
              onClick={handleBack}
              className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-55 hover:opacity-100 transition-opacity py-2 self-start sm:self-auto"
              style={{ fontFamily: PIXEL }}
            >
              {t.nav.back}
            </button>
            {errorMsg && (
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 sm:flex-1 sm:text-center"
                style={{ fontFamily: PIXEL }}
              >
                {errorMsg}
              </span>
            )}
            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                className="bg-[#f4f4f4] text-[#0d0d0d] font-black uppercase tracking-[0.15em] px-8 py-3.5 text-[13px] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"
                style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
              >
                {t.nav.next}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.brand.trim() || !form.name.trim() || !form.email.trim() || !form.phone.trim()}
                className="bg-[#f4f4f4] text-[#0d0d0d] font-black uppercase tracking-[0.15em] px-8 py-3.5 text-[13px] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
              >
                {submitting ? t.nav.submitting : t.nav.submit}
              </button>
            )}
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes briefFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ───────── building blocks ───────── */

function StepWrapper({
  title,
  stepLabel,
  sub,
  children,
}: {
  title: string;
  stepLabel: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-[briefFade_0.5s_ease-out_both]">
      <p
        className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] opacity-55 mb-3"
        style={{ fontFamily: PIXEL }}
      >
        {stepLabel}
      </p>
      <h2
        className="font-black uppercase leading-[1.04] tracking-[-0.03em] mb-2"
        style={{ fontSize: "calc(clamp(26px, 4vw, 44px) * var(--bgk, 1))" }}
      >
        {title}
      </h2>
      {sub && (
        <p
          className="text-[14px] md:text-base leading-relaxed mb-7 max-w-xl opacity-70 font-medium"
          style={{ fontFamily: COMIC }}
        >
          {sub}
        </p>
      )}
      <div className={sub ? "" : "mt-6 md:mt-8"}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 md:mb-7">
      <label
        className="block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#f4f4f4]/85 mb-2.5"
        style={{ fontFamily: PIXEL }}
      >
        {label}
      </label>
      {children}
    </div>
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
      className="w-full bg-[#141414] border border-[#f4f4f4]/25 focus:border-[#f4f4f4]/70 focus:outline-none focus:ring-1 focus:ring-[#f4f4f4]/30 px-4 py-3.5 text-[15px] text-[#f4f4f4] placeholder-[#555] transition-colors"
    />
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
      className="w-full bg-[#141414] border border-[#f4f4f4]/25 focus:border-[#f4f4f4]/70 focus:outline-none focus:ring-1 focus:ring-[#f4f4f4]/30 px-4 py-3.5 text-[15px] text-[#f4f4f4] placeholder-[#555] transition-colors resize-y leading-relaxed"
    />
  );
}

function Select({
  value,
  onChange,
  options,
  lang,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  lang: Lang;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-[#141414] border border-[#f4f4f4]/25 focus:border-[#f4f4f4]/70 focus:outline-none focus:ring-1 focus:ring-[#f4f4f4]/30 px-4 py-3.5 pr-10 text-[15px] text-[#f4f4f4] transition-colors cursor-pointer"
      >
        <option value="">— {lang === "bg" ? "избери" : "select"} —</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#f4f4f4] text-xs">▾</span>
    </div>
  );
}

function Pills({
  value,
  onChange,
  options,
  stack,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  stack?: boolean;
}) {
  return (
    <div className={stack ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(active ? "" : o)}
            className={`text-left px-4 py-2.5 text-[13px] md:text-sm font-bold uppercase tracking-[0.06em] transition-all ${
              active
                ? "bg-[#f4f4f4] text-black font-semibold border border-[#f4f4f4]"
                : "bg-[#141414] text-[#f4f4f4] border border-[#f4f4f4]/25 hover:border-[#f4f4f4]/70"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function PillsMulti({
  values,
  onToggle,
  options,
  stack,
}: {
  values: string[];
  onToggle: (v: string) => void;
  options: readonly string[];
  stack?: boolean;
}) {
  return (
    <div className={stack ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>
      {options.map((o) => {
        const active = values.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`text-left px-4 py-2.5 text-[13px] md:text-sm font-bold uppercase tracking-[0.06em] transition-all flex items-center gap-2 ${
              active
                ? "bg-[#f4f4f4] text-black font-semibold border border-[#f4f4f4]"
                : "bg-[#141414] text-[#f4f4f4] border border-[#f4f4f4]/25 hover:border-[#f4f4f4]/70"
            }`}
          >
            <span aria-hidden className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${active ? "border-black bg-black" : "border-[#f4f4f4]/40"}`}>
              {active && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f4f4f4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <span>{o}</span>
          </button>
        );
      })}
    </div>
  );
}
