"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const VectorScope = dynamic(() => import("./three/VectorScope"), {
  ssr: false,
  loading: () => null,
});

/**
 * A single WebGL canvas that persists across route transitions. On the
 * home page it sits inside the right-hand hero panel; on `/work` it
 * expands to fill the viewport. No overlay, no remount — the canvas
 * visually grows/shrinks while pages swap content behind it.
 */
export default function PersistentHeroCanvas() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrollFade, setScrollFade] = useState(1);

  const isWork = pathname === "/work";
  const isHome = pathname === "/";

  // Fade the canvas out on home when the user scrolls past the hero
  useEffect(() => {
    if (!isHome) {
      setScrollFade(1);
      return;
    }
    const onScroll = () => {
      const h = window.innerHeight;
      const y = window.scrollY;
      const fade = 1 - Math.max(0, Math.min(1, (y - h * 0.35) / (h * 0.5)));
      setScrollFade(fade);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Prefetch /work while the user is on home so navigation is instant
  useEffect(() => {
    if (isHome) router.prefetch("/work");
  }, [isHome, router]);

  if (!isHome && !isWork) return null;

  const onClick = () => {
    if (isHome) router.push("/work");
  };

  return (
    <div
      aria-hidden={!isWork}
      onClick={onClick}
      className={`hidden lg:block fixed z-[1] transition-[top,right,bottom,left,opacity] duration-[900ms] ${isHome ? "cursor-pointer" : ""}`}
      style={{
        top: 0,
        right: 0,
        bottom: 0,
        left: isWork ? 0 : "52%",
        opacity: isHome ? scrollFade : 1,
        transitionTimingFunction: "cubic-bezier(0.72, 0, 0.28, 1)",
        pointerEvents: isHome && scrollFade < 0.2 ? "none" : "auto",
      }}
    >
      <VectorScope />
    </div>
  );
}
