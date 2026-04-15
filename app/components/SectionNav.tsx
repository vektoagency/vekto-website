"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hero",     label: "Home" },
  { id: "services", label: "Services" },
  { id: "why",      label: "Why VEKTO" },
  { id: "work",     label: "Our Work" },
  { id: "pricing",  label: "Pricing" },
  { id: "contact",  label: "Contact" },
];

export default function SectionNav() {
  const [active, setActive] = useState("hero");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.15, rootMargin: "-10% 0px -10% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    if (id === "hero") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3">
      {sections.map(({ id, label }) => {
        const isActive = active === id;
        const isHovered = hovered === id;

        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-3 group"
            aria-label={label}
          >
            {/* Label */}
            <span
              className="text-xs font-medium tracking-widest uppercase transition-all duration-300"
              style={{
                color: isActive ? "#c8ff00" : "#444",
                opacity: isHovered || isActive ? 1 : 0,
                transform: isHovered || isActive ? "translateX(0)" : "translateX(8px)",
              }}
            >
              {label}
            </span>

            {/* Dot */}
            <div
              className="relative flex items-center justify-center transition-all duration-300"
              style={{
                width: isActive ? 12 : 8,
                height: isActive ? 12 : 8,
              }}
            >
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full transition-all duration-300"
                style={{
                  border: isActive ? "1.5px solid #c8ff00" : "1.5px solid #333",
                  transform: isActive ? "scale(1.8)" : "scale(1)",
                  opacity: isActive ? 1 : 0.5,
                }}
              />
              {/* Inner dot */}
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: isActive ? 6 : isHovered ? 5 : 4,
                  height: isActive ? 6 : isHovered ? 5 : 4,
                  backgroundColor: isActive ? "#c8ff00" : isHovered ? "#888" : "#333",
                  boxShadow: isActive ? "0 0 8px #c8ff0088" : "none",
                }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
