"use client";

import { useState, useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import AnimateIn from "./AnimateIn";
import { sendContactEmail } from "../actions/contact";

type Mode = "call" | "message";

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="8" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <circle cx="16" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function Contact() {
  const [mode, setMode] = useState<Mode>("call");
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "inline-30min" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#c8ff00" },
          dark: { "cal-brand": "#c8ff00" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await sendContactEmail(formData);
    setLoading(false);
    if (result.success) setSent(true);
    else setError("Something went wrong. Please try again.");
  };

  const options: { id: Mode; title: string; meta: string; icon: React.ReactNode }[] = [
    { id: "call", title: "Book a Call", meta: "30 min · free", icon: <CalendarIcon /> },
    { id: "message", title: "Send Message", meta: "reply in 24h", icon: <MessageIcon /> },
  ];

  return (
    <section id="contact" className="relative py-28 px-6 overflow-hidden" style={{ background: "linear-gradient(to bottom, #060606, #0a0a0f)" }}>
      {/* Ambient glow */}
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #c8ff00 0%, transparent 60%)" }} />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-16 items-start">
          <AnimateIn from="left">
            <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-3">Get in Touch</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Ready to build
              <br />
              <span className="text-[#c8ff00]">something iconic?</span>
            </h2>
            <p className="text-[#a0a0a0] leading-relaxed mb-10 max-w-md">
              Pick what fits you best — hop on a quick call or drop us a message.
              Either way, we&apos;ll come back with a tailored plan.
            </p>
            <div className="space-y-4 text-sm text-[#a0a0a0]">
              {[
                "Free demo video made for your business",
                "Personalized proposal within 24 hours",
                "No commitments, just a conversation",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full border border-[#222] flex items-center justify-center text-[#c8ff00] flex-shrink-0">
                    →
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </AnimateIn>

          <AnimateIn from="right">
            {/* Gradient border wrapper */}
            <div className="relative rounded-[22px] p-[1px] bg-gradient-to-b from-[#c8ff00]/25 via-[#1a1a1a] to-[#1a1a1a]">
              {/* Active-mode aura */}
              <div aria-hidden
                className="absolute -inset-8 rounded-[30px] blur-3xl opacity-20 transition-opacity duration-700 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 0%, #c8ff00 0%, transparent 70%)" }} />

              <div className="relative bg-[#0b0b0b] rounded-[21px] p-3">
                {/* Segmented picker */}
                <div className="relative grid grid-cols-2 bg-[#060606] border border-[#161616] rounded-2xl p-1.5">
                  <div
                    className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl transition-transform duration-400 ease-out"
                    style={{
                      transform: mode === "call" ? "translateX(0)" : "translateX(calc(100% + 12px))",
                      background: "linear-gradient(135deg, #c8ff00 0%, #9ed600 100%)",
                      boxShadow: "0 8px 28px -8px rgba(200,255,0,0.55), inset 0 1px 0 rgba(255,255,255,0.35)",
                    }}
                  />
                  {options.map((o) => {
                    const active = mode === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setMode(o.id)}
                        className={`relative z-10 flex items-center justify-center gap-2.5 py-4 rounded-xl transition-colors duration-300 ${
                          active ? "text-black" : "text-[#8a8680] hover:text-white"
                        }`}
                      >
                        <span className={active ? "text-black" : "text-[#c8ff00]"}>{o.icon}</span>
                        <span className="text-left leading-tight">
                          <span className="block text-sm font-semibold">{o.title}</span>
                          <span className={`block text-[10px] uppercase tracking-widest ${active ? "text-black/60" : "text-[#555]"}`}>{o.meta}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Panel */}
                <div className="relative mt-3">
                  <div
                    key={mode}
                    className="p-6 animate-[fadeSlide_0.45s_ease-out]"
                    style={{ animationFillMode: "both" }}
                  >
                    {mode === "call" ? (
                      <div className="overflow-hidden rounded-xl -mx-2 -mb-4">
                        <Cal
                          namespace="inline-30min"
                          calLink="vekto/30min"
                          style={{ width: "100%", height: "620px", overflow: "scroll" }}
                          config={{ layout: "month_view", theme: "dark" }}
                        />
                      </div>
                    ) : sent ? (
                      <div className="text-center py-16">
                        <div className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ background: "radial-gradient(circle, rgba(200,255,0,0.25) 0%, transparent 70%)" }}>
                          <div className="w-12 h-12 rounded-full bg-[#c8ff00] text-black flex items-center justify-center text-2xl font-bold">✓</div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Message sent!</h3>
                        <p className="text-[#a0a0a0]">We&apos;ll get back to you within 24 hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Name</label>
                            <input
                              required type="text" placeholder="Luca Rossi" name="name"
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/60 focus:bg-[#0f0f0a] transition-colors text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Email</label>
                            <input
                              required type="email" placeholder="luca@company.com" name="email"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/60 focus:bg-[#0f0f0a] transition-colors text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Company</label>
                          <input
                            type="text" placeholder="Acme Studio" name="company"
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/60 focus:bg-[#0f0f0a] transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Tell us about your project</label>
                          <textarea
                            required rows={4} placeholder="We want to create a short-form video series for our brand..." name="message"
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/60 focus:bg-[#0f0f0a] transition-colors text-sm resize-none"
                          />
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button
                          type="submit"
                          disabled={loading}
                          className="group relative w-full overflow-hidden bg-[#c8ff00] text-black font-semibold py-4 rounded-full hover:bg-[#d4ff33] transition-colors disabled:opacity-50"
                          style={{ boxShadow: "0 10px 30px -10px rgba(200,255,0,0.5)" }}
                        >
                          <span className="relative z-10">{loading ? "Sending..." : "Send Message →"}</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
