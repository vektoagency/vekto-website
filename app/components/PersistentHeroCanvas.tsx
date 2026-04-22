"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MacintoshScene = dynamic(() => import("./three/MacintoshScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * A single WebGL canvas that persists across route transitions. On the
 * home page it sits inside the right-hand hero panel; on `/work` it
 * expands to fill the viewport and the camera zooms into the CRT.
 * No overlay, no remount — the canvas morphs while pages swap behind.
 */
export default function PersistentHeroCanvas() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrollFade, setScrollFade] = useState(1);

  const isWork = pathname === "/work";
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setScrollFade(1);
      return;
    }
    const onScroll = () => {
      const h = window.innerHeight;
      const y = window.scrollY;
      // Start fading almost immediately, fully gone by ~50% viewport scroll
      const fade = 1 - Math.max(0, Math.min(1, (y - h * 0.05) / (h * 0.45)));
      setScrollFade(fade);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (isHome) router.prefetch("/work");
  }, [isHome, router]);

  if (!isHome && !isWork) return null;

  const goWork = () => {
    if (isHome) router.push("/work");
  };

  return (
    <div
      aria-hidden={!isWork}
      onClick={goWork}
      className={`hidden lg:block fixed z-[1] ${isHome ? "cursor-pointer" : ""}`}
      style={{
        top: 0,
        right: 0,
        bottom: 0,
        left: isWork ? 0 : "52%",
        opacity: isHome ? scrollFade : 1,
        transition: "top 900ms cubic-bezier(0.72,0,0.28,1), right 900ms cubic-bezier(0.72,0,0.28,1), bottom 900ms cubic-bezier(0.72,0,0.28,1), left 900ms cubic-bezier(0.72,0,0.28,1)",
        pointerEvents: isHome && scrollFade < 0.2 ? "none" : "auto",
        visibility: isHome && scrollFade <= 0.01 ? "hidden" : "visible",
      }}
    >
      <MacintoshScene zoomedIn={isWork} onScreenClick={goWork} />
    </div>
  );
}
