"use client";

import dynamic from "next/dynamic";

const VectorScope = dynamic(() => import("./three/VectorScope"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#030503]">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00]/70 animate-pulse">
        VEKTO/SCOPE INIT…
      </div>
    </div>
  ),
});

export default function HeroPravec() {
  return (
    <div className="absolute inset-0">
      <VectorScope />
    </div>
  );
}
