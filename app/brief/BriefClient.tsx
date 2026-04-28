"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { briefCopy, type Lang } from "./translations";
import { submitBrief, type BriefSubmission } from "../actions/brief";

const TOTAL_STEPS = 7;
const STORAGE_KEY = "vekto-brief-draft-v1";
const LANG_KEY = "vekto-brief-lang";

const initialForm: BriefSubmission = {
  lang: "bg",
  brand: "",
  website: "",
  ig: "",
  industry: "",
  stage: "",
  revenue: "",
  teamSize: "",
  pitch: "",
  audience: "",
  problem: "",
  usp: "",
  competitors: "",
  competitorsStrengths: "",
  tone: "",
  platforms: [],
  postsPerMonth: "",
  currentMaker: "",
  avgPerformance: "",
  whatNotWorking: "",
  topClips: "",
  adSpend: "",
  services: [],
  volume: "",
  multilingual: "",
  includeStrategy: "",
  mainGoal: "",
  goal90Days: "",
  successMetric: "",
  tracking: "",
  brandAssets: "",
  refsLove: "",
  refsHate: "",
  music: "",
  restrictions: "",
  hasScripts: "",
  timeline: "",
  engagement: "",
  budget: "",
  name: "",
  role: "",
  email: "",
  phone: "",
  preferredChannel: "",
  additional: "",
};

export default function BriefClient() {
  const [lang, setLang] = useState<Lang>("bg");
  const [step, setStep] = useState(0); // 0 = intro, 1-7 = steps, 8 = success
  const [form, setForm] = useState<BriefSubmission>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore draft + lang on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANG_KEY);
      if (savedLang === "bg" || savedLang === "en") setLang(savedLang);
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

  // Persist lang
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LANG_KEY, lang);
    setForm((f) => ({ ...f, lang }));
  }, [lang, hydrated]);

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

  const toggleArray = (key: "platforms" | "services", value: string) => {
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
      setStep(8);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setErrorMsg(t.error.generic);
    }
  };

  const progressPct = step === 0 ? 0 : step === 8 ? 100 : ((step - 1) / TOTAL_STEPS) * 100 + 100 / TOTAL_STEPS / 2;

  return (
    <div className="min-h-screen bg-[#080808] text-[#ece8e1]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[#1e1e1c] bg-[#080808]/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-3 md:py-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#9a958e] hover:text-[#c8ff00] transition-colors"
          >
            {t.nav.home}
          </Link>
          <div className="flex items-center gap-3 md:gap-4">
            {step > 0 && step < 8 && (
              <span className="hidden sm:inline font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#c8ff00]">
                {t.meta.stepOf(step, TOTAL_STEPS)}
              </span>
            )}
            <button
              onClick={() => setLang(lang === "bg" ? "en" : "bg")}
              className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#c8ff00] border border-[#c8ff00]/40 px-2.5 md:px-3 py-1 md:py-1.5 rounded-sm hover:bg-[#c8ff00]/10 transition-colors"
              aria-label="Toggle language"
            >
              {t.meta.langToggle}
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-[2px] bg-[#1e1e1c]">
          <div
            className="h-full bg-[#c8ff00] transition-all duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              boxShadow: "0 0 10px rgba(200,255,0,0.55)",
            }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 md:px-8 py-8 md:py-14">
        {/* Step 0 — intro */}
        {step === 0 && (
          <div className="animate-[briefFade_0.5s_ease-out_both]">
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-4">
              {t.intro.eyebrow}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
              {t.intro.h1}
            </h1>
            <p className="text-[15px] md:text-lg text-[#a0a0a0] leading-relaxed mb-8 max-w-xl">
              {t.intro.sub}
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#c8ff00]/70 border border-[#c8ff00]/30 px-3 py-1.5 rounded-full">
                {t.meta.timeEstimate}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#9a958e] border border-[#1e1e1c] px-3 py-1.5 rounded-full">
                {t.meta.autoSaved}
              </span>
            </div>
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-semibold px-8 py-3.5 rounded-full hover:bg-[#d4ff33] transition-colors text-[15px]"
              style={{ boxShadow: "0 14px 40px -12px rgba(200,255,0,0.55)" }}
            >
              {t.intro.start}
            </button>
          </div>
        )}

        {/* Step 1 — Who you are */}
        {step === 1 && (
          <StepWrapper title={t.step1.title} stepLabel={t.meta.stepOf(1, TOTAL_STEPS)}>
            <Field label={t.step1.brand}>
              <Input value={form.brand} onChange={(v) => update("brand", v)} placeholder={t.step1.brandPh} />
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
            <Field label={t.step1.stage}>
              <Pills value={form.stage} onChange={(v) => update("stage", v)} options={t.step1.stageOptions} />
            </Field>
            <Field label={t.step1.revenue}>
              <Pills value={form.revenue} onChange={(v) => update("revenue", v)} options={t.step1.revenueOptions} />
            </Field>
            <Field label={t.step1.teamSize}>
              <Pills value={form.teamSize} onChange={(v) => update("teamSize", v)} options={t.step1.teamSizeOptions} />
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
            <Field label={t.step3.postsPerMonth}>
              <Pills value={form.postsPerMonth} onChange={(v) => update("postsPerMonth", v)} options={t.step3.postsPerMonthOptions} />
            </Field>
            <Field label={t.step3.currentMaker}>
              <Pills value={form.currentMaker} onChange={(v) => update("currentMaker", v)} options={t.step3.currentMakerOptions} />
            </Field>
            <Field label={t.step3.avgPerformance}>
              <Input value={form.avgPerformance} onChange={(v) => update("avgPerformance", v)} placeholder={t.step3.avgPerformancePh} />
            </Field>
            <Field label={t.step3.whatNotWorking}>
              <Textarea value={form.whatNotWorking} onChange={(v) => update("whatNotWorking", v)} placeholder={t.step3.whatNotWorkingPh} />
            </Field>
            <Field label={t.step3.topClips}>
              <Textarea value={form.topClips} onChange={(v) => update("topClips", v)} placeholder={t.step3.topClipsPh} rows={3} />
            </Field>
            <Field label={t.step3.adSpend}>
              <Pills value={form.adSpend} onChange={(v) => update("adSpend", v)} options={t.step3.adSpendOptions} />
            </Field>
          </StepWrapper>
        )}

        {/* Step 4 — Services */}
        {step === 4 && (
          <StepWrapper title={t.step4.title} stepLabel={t.meta.stepOf(4, TOTAL_STEPS)} sub={t.step4.sub}>
            <Field label={t.step4.services}>
              <PillsMulti
                values={form.services}
                onToggle={(v) => toggleArray("services", v)}
                options={t.step4.servicesOptions}
                stack
              />
            </Field>
            <Field label={t.step4.volume}>
              <Pills value={form.volume} onChange={(v) => update("volume", v)} options={t.step4.volumeOptions} />
            </Field>
            <Field label={t.step4.multilingual}>
              <Pills value={form.multilingual} onChange={(v) => update("multilingual", v)} options={t.step4.multilingualOptions} />
            </Field>
            <Field label={t.step4.includeStrategy}>
              <Pills value={form.includeStrategy} onChange={(v) => update("includeStrategy", v)} options={t.step4.includeStrategyOptions} stack />
            </Field>
          </StepWrapper>
        )}

        {/* Step 5 — Goals */}
        {step === 5 && (
          <StepWrapper title={t.step5.title} stepLabel={t.meta.stepOf(5, TOTAL_STEPS)}>
            <Field label={t.step5.mainGoal}>
              <Pills value={form.mainGoal} onChange={(v) => update("mainGoal", v)} options={t.step5.mainGoalOptions} stack />
            </Field>
            <Field label={t.step5.goal90Days}>
              <Input value={form.goal90Days} onChange={(v) => update("goal90Days", v)} placeholder={t.step5.goal90DaysPh} />
            </Field>
            <Field label={t.step5.successMetric}>
              <Textarea value={form.successMetric} onChange={(v) => update("successMetric", v)} placeholder={t.step5.successMetricPh} />
            </Field>
            <Field label={t.step5.tracking}>
              <Pills value={form.tracking} onChange={(v) => update("tracking", v)} options={t.step5.trackingOptions} stack />
            </Field>
          </StepWrapper>
        )}

        {/* Step 6 — Creative */}
        {step === 6 && (
          <StepWrapper title={t.step6.title} stepLabel={t.meta.stepOf(6, TOTAL_STEPS)} sub={t.step6.sub}>
            <Field label={t.step6.brandAssets}>
              <Textarea value={form.brandAssets} onChange={(v) => update("brandAssets", v)} placeholder={t.step6.brandAssetsPh} rows={2} />
            </Field>
            <Field label={t.step6.refsLove}>
              <Textarea value={form.refsLove} onChange={(v) => update("refsLove", v)} placeholder={t.step6.refsLovePh} rows={4} />
            </Field>
            <Field label={t.step6.refsHate}>
              <Textarea value={form.refsHate} onChange={(v) => update("refsHate", v)} placeholder={t.step6.refsHatePh} rows={3} />
            </Field>
            <Field label={t.step6.music}>
              <Pills value={form.music} onChange={(v) => update("music", v)} options={t.step6.musicOptions} />
            </Field>
            <Field label={t.step6.restrictions}>
              <Textarea value={form.restrictions} onChange={(v) => update("restrictions", v)} placeholder={t.step6.restrictionsPh} rows={3} />
            </Field>
            <Field label={t.step6.hasScripts}>
              <Pills value={form.hasScripts} onChange={(v) => update("hasScripts", v)} options={t.step6.hasScriptsOptions} stack />
            </Field>
          </StepWrapper>
        )}

        {/* Step 7 — Logistics */}
        {step === 7 && (
          <StepWrapper title={t.step7.title} stepLabel={t.meta.stepOf(7, TOTAL_STEPS)}>
            <Field label={t.step7.timeline}>
              <Pills value={form.timeline} onChange={(v) => update("timeline", v)} options={t.step7.timelineOptions} />
            </Field>
            <Field label={t.step7.engagement}>
              <Pills value={form.engagement} onChange={(v) => update("engagement", v)} options={t.step7.engagementOptions} />
            </Field>
            <Field label={t.step7.budget}>
              <Pills value={form.budget} onChange={(v) => update("budget", v)} options={t.step7.budgetOptions} />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-0">
              <Field label={t.step7.name}>
                <Input value={form.name} onChange={(v) => update("name", v)} placeholder={t.step7.namePh} required />
              </Field>
              <Field label={t.step7.role}>
                <Input value={form.role} onChange={(v) => update("role", v)} placeholder={t.step7.rolePh} />
              </Field>
              <Field label={t.step7.email}>
                <Input value={form.email} onChange={(v) => update("email", v)} placeholder={t.step7.emailPh} type="email" required />
              </Field>
              <Field label={t.step7.phone}>
                <Input value={form.phone} onChange={(v) => update("phone", v)} placeholder={t.step7.phonePh} type="tel" />
              </Field>
            </div>
            <Field label={t.step7.preferredChannel}>
              <Pills value={form.preferredChannel} onChange={(v) => update("preferredChannel", v)} options={t.step7.preferredChannelOptions} />
            </Field>
            <Field label={t.step7.additional}>
              <Textarea value={form.additional} onChange={(v) => update("additional", v)} placeholder={t.step7.additionalPh} rows={4} />
            </Field>
          </StepWrapper>
        )}

        {/* Step 8 — Success */}
        {step === 8 && (
          <div className="animate-[briefFade_0.5s_ease-out_both] py-8 md:py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c8ff00] text-black mb-7"
              style={{ boxShadow: "0 0 40px rgba(200,255,0,0.45)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-4">
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
                className="inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-semibold px-8 py-3.5 rounded-full hover:bg-[#d4ff33] transition-colors font-mono text-sm uppercase tracking-[0.2em]"
                style={{ boxShadow: "0 14px 40px -12px rgba(200,255,0,0.55)" }}
              >
                {t.success.backHome}
              </Link>
            </div>
          </div>
        )}

        {/* Nav buttons (hide on intro & success) */}
        {step > 0 && step < 8 && (
          <div className="mt-10 md:mt-12 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-6 border-t border-[#1e1e1c]">
            <button
              onClick={handleBack}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#9a958e] hover:text-[#c8ff00] transition-colors py-2 self-start sm:self-auto"
            >
              {t.nav.back}
            </button>
            {errorMsg && (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400 sm:flex-1 sm:text-center">
                {errorMsg}
              </span>
            )}
            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                className="bg-[#c8ff00] text-black font-semibold px-8 py-3 rounded-full hover:bg-[#d4ff33] transition-colors text-[14px]"
                style={{ boxShadow: "0 10px 30px -10px rgba(200,255,0,0.55)" }}
              >
                {t.nav.next}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.email}
                className="bg-[#c8ff00] text-black font-semibold px-8 py-3 rounded-full hover:bg-[#d4ff33] transition-colors text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "0 10px 30px -10px rgba(200,255,0,0.55)" }}
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
      <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
        {stepLabel}
      </p>
      <h2 className="text-2xl md:text-4xl font-bold leading-[1.15] tracking-tight mb-2">
        {title}
      </h2>
      {sub && <p className="text-[14px] md:text-base text-[#a0a0a0] leading-relaxed mb-7 max-w-xl">{sub}</p>}
      <div className={sub ? "" : "mt-6 md:mt-8"}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 md:mb-7">
      <label className="block font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#c8ff00]/85 mb-2.5">
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
      className="w-full bg-[#0d0d0d] border border-[#1e1e1c] focus:border-[#c8ff00]/60 focus:outline-none focus:ring-1 focus:ring-[#c8ff00]/30 rounded-md px-4 py-3 text-[15px] text-[#ece8e1] placeholder-[#555] transition-colors"
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
      className="w-full bg-[#0d0d0d] border border-[#1e1e1c] focus:border-[#c8ff00]/60 focus:outline-none focus:ring-1 focus:ring-[#c8ff00]/30 rounded-md px-4 py-3 text-[15px] text-[#ece8e1] placeholder-[#555] transition-colors resize-y leading-relaxed"
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
        className="w-full appearance-none bg-[#0d0d0d] border border-[#1e1e1c] focus:border-[#c8ff00]/60 focus:outline-none focus:ring-1 focus:ring-[#c8ff00]/30 rounded-md px-4 py-3 pr-10 text-[15px] text-[#ece8e1] transition-colors cursor-pointer"
      >
        <option value="">— {lang === "bg" ? "избери" : "select"} —</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#c8ff00] text-xs">▾</span>
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
            className={`text-left px-4 py-2.5 rounded-md text-[13px] md:text-sm transition-all ${
              active
                ? "bg-[#c8ff00] text-black font-semibold border border-[#c8ff00]"
                : "bg-[#0d0d0d] text-[#ece8e1] border border-[#1e1e1c] hover:border-[#c8ff00]/40 hover:text-[#c8ff00]"
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
            className={`text-left px-4 py-2.5 rounded-md text-[13px] md:text-sm transition-all flex items-center gap-2 ${
              active
                ? "bg-[#c8ff00] text-black font-semibold border border-[#c8ff00]"
                : "bg-[#0d0d0d] text-[#ece8e1] border border-[#1e1e1c] hover:border-[#c8ff00]/40 hover:text-[#c8ff00]"
            }`}
          >
            <span aria-hidden className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center shrink-0 ${active ? "border-black bg-black" : "border-[#c8ff00]/40"}`}>
              {active && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
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
