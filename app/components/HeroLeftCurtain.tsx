"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function HeroLeftCurtain({ children, className = "", style }: Props) {
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
        ...style,
        opacity: fading ? 0 : 1,
        transition: "opacity 620ms cubic-bezier(0.22,0.61,0.36,1)",
        // Only force pointer-events off while fading. When visible, leave
        // it undefined so the caller's className (e.g. pointer-events-none
        // on the mobile curtain) decides — otherwise we'd swallow taps
        // meant for the Mac canvas underneath.
        ...(fading ? { pointerEvents: "none" as const } : {}),
      }}
    >
      {children}
    </div>
  );
}
