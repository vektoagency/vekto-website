"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MacintoshScene = dynamic(() => import("./three/MacintoshScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5a5048] animate-pulse">
        Booting…
      </div>
    </div>
  ),
});

export default function HeroPravec() {
  const [zoomedIn, setZoomedIn] = useState(false);

  const handleScreenClick = () => {
    if (zoomedIn) return;
    setZoomedIn(true);
    // Small delay so the camera has time to start zooming,
    // then fire the transition bridge phosphor wash.
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("vekto:enter-pravec"));
    }, 380);
  };

  return (
    <div className="absolute inset-0">
      <MacintoshScene zoomedIn={zoomedIn} onScreenClick={handleScreenClick} />
    </div>
  );
}
