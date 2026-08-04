// ============================================================================
// JOURNEY MAP — the single source of truth for the full-page scrub.
//
// The entire page is ONE video (the Vector's flight), scrubbed by scroll from
// 0 to 1. Sections are stops along the camera's path: each zone owns a slice
// of the global progress, and its overlay text is pinned while the camera
// passes through that slice.
//
// Frame counts and boundaries are data, not layout: when the generated chain
// lands, only FRAME_COUNT, FRAME_DIR and the zone fractions change — the
// page component reads everything from here.
// ============================================================================

export const FRAME_DIR = "/scrub/vector";
export const FRAME_COUNT = 288; // 6 clips × 8s × 6fps extraction
export const FRAME_W = 960;
export const FRAME_H = 540;

export type Zone = {
  id: string;
  /** global scroll progress where the zone begins, 0..1 */
  from: number;
  /** global scroll progress where it hands over */
  to: number;
};

// Six equal beats of the flight. `from`/`to` are fractions of the whole
// scrub; the overlay for a zone fades in shortly after `from` and out
// shortly before `to`, so text never straddles a hand-over.
export const ZONES: Zone[] = [
  { id: "vault",    from: 0 / 6, to: 1 / 6 },
  { id: "ignition", from: 1 / 6, to: 2 / 6 },
  { id: "screen",   from: 2 / 6, to: 3 / 6 },
  { id: "feed",     from: 3 / 6, to: 4 / 6 },
  { id: "curve",    from: 4 / 6, to: 5 / 6 },
  { id: "landing",  from: 5 / 6, to: 6 / 6 },
];

/** 0..1 progress local to a zone, clamped. */
export const zoneLocal = (p: number, z: Zone) =>
  Math.max(0, Math.min(1, (p - z.from) / (z.to - z.from)));

/** Overlay opacity envelope: in over the first 18%, out over the last 15%. */
export const zoneEnvelope = (p: number, z: Zone) => {
  const t = zoneLocal(p, z);
  const inn = Math.min(1, t / 0.18);
  const out = Math.min(1, (1 - t) / 0.15);
  return Math.max(0, Math.min(inn, out));
};
