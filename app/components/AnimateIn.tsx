"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left" | "right";
}

export default function AnimateIn({ children, className = "", delay = 0, from = "bottom" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Add the hidden class only after JS loads — SSR renders visible
    el.classList.add("animate-in-hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.remove("animate-in-hidden");
            el.classList.add("animate-in-visible");
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const translateClass =
    from === "left" ? "animate-in-from-left"
    : from === "right" ? "animate-in-from-right"
    : "animate-in-from-bottom";

  return (
    <div ref={ref} className={`${className} ${translateClass} animate-in-base`}>
      {children}
    </div>
  );
}
