"use client";

import dynamic from "next/dynamic";

const PravecScene = dynamic(() => import("./three/PravecScene"), {
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
  return (
    <div className="absolute inset-0">
      <PravecScene />
    </div>
  );
}
