"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function HeroLeftCurtain({ children, className = "" }: Props) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const onStart = () => setFading(true);
    const onEnd = () => setFading(false);
    window.addEventListener("vekto:zoom-started", onStart);
    window.addEventListener("vekto:zoom-ended", onEnd);
    return () => {
      window.removeEventListener("vekto:zoom-started", onStart);
      window.removeEventListener("vekto:zoom-ended", onEnd);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 620ms cubic-bezier(0.22,0.61,0.36,1)",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {children}
    </div>
  );
}
