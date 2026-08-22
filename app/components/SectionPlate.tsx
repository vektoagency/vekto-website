"use client";

// ============================================================================
// SECTION PLATE — the homepage's room plates, reusable as a section ground.
//
// On the homepage these frames cross-fade behind the four-rooms pan. Here
// they sit still behind a single section: same purpose-shot stills, same
// treatment — desaturated by birth, held down by a двоен scrim so the type
// on top keeps its contrast and the edges return to the section's own
// ground. Texture, never a picture competing with the copy.
// ============================================================================

import Image from "next/image";

export type PlateName = "creatives" | "websites" | "strategy" | "ai";

export default function SectionPlate({
  src,
  ground = "#0d0d0d",
  opacity = 0.5,
}: {
  src: PlateName;
  /** The section's own background — the scrim fades back to it at the edges. */
  ground?: string;
  opacity?: number;
}) {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <Image
        src={`/images/rooms/${src}.webp`}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ opacity, filter: "contrast(1.08)" }}
        priority={false}
      />
      <div
        className="absolute inset-0"
        style={{
          background: [
            `linear-gradient(90deg, ${ground} 0%, transparent 26%, transparent 74%, ${ground} 100%)`,
            `linear-gradient(180deg, ${ground} 0%, rgba(0,0,0,0.35) 34%, rgba(0,0,0,0.45) 68%, ${ground} 100%)`,
          ].join(", "),
        }}
      />
    </div>
  );
}
