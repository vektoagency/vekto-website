"use client";

import { useState, useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import AnimateIn from "./AnimateIn";
import { sendContactEmail } from "../actions/contact";

type Mode = "call" | "message";

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
    if (result.success) {
      setSent(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-28 px-6" style={{ background: "linear-gradient(to bottom, #060606, #0a0a0f)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <AnimateIn from="left">
            <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-3">Get in Touch</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Ready to build
              <br />
              <span className="text-[#c8ff00]">something iconic?</span>
            </h2>
            <p className="text-[#a0a0a0] leading-relaxed mb-10 max-w-md">
              Pick what fits you best — jump on a quick call or drop us a message.
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
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-2 shadow-[0_0_40px_rgba(200,255,0,0.03)]">
              {/* Tab switcher */}
              <div className="relative grid grid-cols-2 bg-[#080808] rounded-xl p-1 mb-1">
                <div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#c8ff00] rounded-lg transition-transform duration-300 ease-out"
                  style={{ transform: mode === "call" ? "translateX(0)" : "translateX(calc(100% + 8px))" }}
                />
                <button
                  onClick={() => setMode("call")}
                  className={`relative z-10 py-3 rounded-lg font-semibold text-sm transition-colors ${
                    mode === "call" ? "text-black" : "text-[#9a958e] hover:text-white"
                  }`}
                >
                  Book a Call
                </button>
                <button
                  onClick={() => setMode("message")}
                  className={`relative z-10 py-3 rounded-lg font-semibold text-sm transition-colors ${
                    mode === "message" ? "text-black" : "text-[#9a958e] hover:text-white"
                  }`}
                >
                  Send Message
                </button>
              </div>

              <div className="p-6">
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
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">✓</div>
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
                          className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/50 transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Email</label>
                        <input
                          required type="email" placeholder="luca@company.com" name="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/50 transition-colors text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Company</label>
                      <input
                        type="text" placeholder="Acme Studio" name="company"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/50 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#666] mb-2 uppercase tracking-wider">Tell us about your project</label>
                      <textarea
                        required rows={4} placeholder="We want to create a short-form video series for our brand..." name="message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#c8ff00]/50 transition-colors text-sm resize-none"
                      />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#c8ff00] text-black font-semibold py-4 rounded-full hover:bg-[#d4ff33] transition-colors disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
