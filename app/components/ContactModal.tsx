"use client";

import { useState, useEffect, useCallback } from "react";
import { sendContactEmail } from "../actions/contact";
import { useT } from "../i18n/LangProvider";

type Mode = "call" | "message";

export const OPEN_CONTACT_EVENT = "vekto:open-contact";

export function openContactModal(mode: Mode = "message") {
  window.dispatchEvent(new CustomEvent(OPEN_CONTACT_EVENT, { detail: { mode } }));
}

function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useT({
    bg: {
      eyebrow: "Прати съобщение · отговор до 24ч",
      title: "Разкажи ни за проекта си",
      close: "Затвори",
      name: "Име",
      namePh: "Иван Иванов",
      email: "Имейл",
      emailPh: "ти@company.com",
      phone: "Телефон / WhatsApp",
      phonePh: "+359 ...",
      company: "Бизнес / уебсайт",
      companyPh: "Името на бизнеса или линк",
      messageLabel: "Разкажи ни за проекта си",
      messagePh: "Искаме да направим серия от кратки видеа за бизнеса си...",
      submit: "Прати →",
      submitting: "Изпраща се…",
      successTitle: "Съобщението е изпратено!",
      successBody: "Ще ти отговорим в рамките на 24 часа.",
      error: "Нещо се обърка. Опитай отново.",
    },
    en: {
      eyebrow: "Send Message · reply in 24h",
      title: "Tell us about your project",
      close: "Close",
      name: "Name",
      namePh: "Luca Rossi",
      email: "Email",
      emailPh: "luca@company.com",
      phone: "Phone / WhatsApp",
      phonePh: "+1 ...",
      company: "Business / website",
      companyPh: "Acme Studio",
      messageLabel: "Tell us about your project",
      messagePh: "We want to create a short-form video series for our brand...",
      submit: "Send Message →",
      submitting: "Sending...",
      successTitle: "Message sent!",
      successBody: "We'll get back to you within 24 hours.",
      error: "Something went wrong. Please try again.",
    },
  });

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CONTACT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONTACT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await sendContactEmail(formData);
    setLoading(false);
    if (result.success) setSent(true);
    else setError(t.error);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 modal-fade-in"
      onClick={close}
    >
      <div aria-hidden className="absolute inset-0 bg-black/80" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#0b0b0b] border border-[#1e1e1c] rounded-2xl shadow-2xl modal-pop-in max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[#151515]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#c8ff00] text-black">
              <MessageIcon />
            </div>
            <div>
              <p className="text-[10px] text-[#c8ff00] uppercase tracking-[0.2em] mb-0.5">{t.eyebrow}</p>
              <h3 className="text-lg font-bold text-white leading-tight">{t.title}</h3>
            </div>
          </div>
          <button
            onClick={close}
            aria-label={t.close}
            className="w-9 h-9 rounded-full border border-[#1a1a1a] text-[#888] hover:text-white hover:border-[#333] flex items-center justify-center transition-colors flex-shrink-0"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Panel */}
        <div className="flex-1 overflow-y-auto p-5">
          {sent ? (
            <div className="text-center py-10">
              <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-[#c8ff00] text-black flex items-center justify-center text-2xl font-bold">✓</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t.successTitle}</h3>
              <p className="text-[#a0a0a0]">{t.successBody}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">{t.name}</label>
                  <input
                    required type="text" placeholder={t.namePh} name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/60 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">{t.email}</label>
                  <input
                    required type="email" placeholder={t.emailPh} name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/60 text-sm"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">{t.phone}</label>
                  <input
                    required type="tel" placeholder={t.phonePh} name="phone"
                    inputMode="tel" autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/60 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">{t.company}</label>
                  <input
                    required type="text" placeholder={t.companyPh} name="company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/60 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">{t.messageLabel}</label>
                <textarea
                  required rows={3} placeholder={t.messagePh} name="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/60 text-sm resize-none"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c8ff00] text-black font-semibold py-4 rounded-full hover:bg-[#d4ff33] transition-colors disabled:opacity-50"
              >
                {loading ? t.submitting : t.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
