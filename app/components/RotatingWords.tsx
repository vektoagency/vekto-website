"use client";

import { useEffect, useRef, useState } from "react";

const words = [
  "Cinematic Ads",
  "Viral Short-Form",
  "Brand Storytelling",
  "AI-Powered Content",
  "Product Visuals",
];

const display = [...words, words[0]];
const HOLD = 3200;
const SLIDE = 700;

export default function RotatingWords({ itemH = 80 }: { itemH?: number }) {
  const [index, setIndex] = useState(0);
  const [smooth, setSmooth] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSmooth(true);
      setIndex((prev) => prev + 1);
    }, HOLD);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (index === words.length) {
      const t = setTimeout(() => {
        setSmooth(false);
        setIndex(0);
      }, SLIDE);
      return () => clearTimeout(t);
    }
  }, [index]);

  return (
    <span className="inline-block overflow-hidden align-middle" style={{ height: itemH }}>
      <span
        className="flex flex-col"
        style={{
          transform: `translateY(-${index * itemH}px)`,
          transition: smooth ? `transform ${SLIDE}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none",
        }}
      >
        {display.map((word, i) => (
          <span key={i} className="shrink-0 flex items-center justify-center" style={{ height: itemH }}>
            <span className="inline-block bg-[#c8ff00] text-[#080808] px-6 py-2 rounded-lg font-bold">
              {word}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
