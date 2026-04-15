"use client";

import { useEffect, useRef, useState } from "react";
import AnimateIn from "./AnimateIn";

const stats = [
  { value: 3, suffix: "x", label: "Delivery speed vs agencies", symbol: null },
  { value: null, suffix: "",  label: "Every idea, every format",    symbol: "∞" },
  { value: 60,   suffix: "%", label: "Lower cost, higher output",   symbol: null },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 40;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + increment, target);
          setCount(Math.round(current));
          if (current >= target) clearInterval(timer);
        }, 1500 / steps);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="px-4 py-3 md:py-16" style={{ background: "#060606" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 divide-x divide-[#1a1a1a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
          {stats.map((s, i) => (
            <AnimateIn key={s.label} delay={i * 120}>
              <div className="text-center py-6 px-2 md:py-14 md:px-8">
                <div className="flex items-center justify-center mb-1 md:mb-2" style={{ height: "clamp(3rem, 10vw, 7rem)" }}>
                  <span className="text-3xl sm:text-5xl md:text-7xl font-bold text-[#c8ff00] tracking-tight">
                    {s.symbol ? (
                      <span style={{ fontSize: "clamp(3rem, 10vw, 8rem)", fontWeight: 700, lineHeight: 1 }}>∞</span>
                    ) : (
                      <CountUp target={s.value!} suffix={s.suffix} />
                    )}
                  </span>
                </div>
                <p className="text-[10px] sm:text-sm text-[#a0a0a0] leading-snug max-w-[100px] md:max-w-[120px] mx-auto">{s.label}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
