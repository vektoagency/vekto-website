"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Full-screen overlay that briefly shows on arrival to /work, bridging
 * the Pravec click-zoom animation into the portfolio without a visible
 * page reload. Reads sessionStorage flag set by PravecScene.
 */
export default function TransitionBridge() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (pathname !== "/work") return;
    const flag = sessionStorage.getItem("vekto-entering-pravec");
    if (flag !== "1") return;
    // Start covered
    setActive(true);
    // Trigger fade-out after a frame so the covered state paints first
    const t1 = requestAnimationFrame(() => {
      setTimeout(() => setFading(true), 40);
    });
    const t2 = setTimeout(() => {
      setActive(false);
      sessionStorage.removeItem("vekto-entering-pravec");
    }, 1200);
    return () => {
      cancelAnimationFrame(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70]"
      style={{
        background: "radial-gradient(circle at 50% 50%, #c8ff00 0%, #080808 55%)",
        opacity: fading ? 0 : 1,
        transition: "opacity 1s ease-out",
      }}
    />
  );
}
