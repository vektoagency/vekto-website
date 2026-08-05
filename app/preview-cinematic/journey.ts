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

// v4 is the user's own edit of the film (33.55s @30fps source, sampled at
// 12fps). 12fps because at 6fps adjacent frames were 166ms of camera motion
// apart and the scrub read as steppy; the canvas additionally crossfades
// between neighbouring frames so the remaining gap reads as motion blur.
export const FRAME_COUNT = 402;

// Two extractions of the same 288 frames. The film runs full-bleed, so the
// desktop set is sized for desktop viewports (1600w, q82 ≈ 6MB total) — the
// first cut shipped 960w/q55 everywhere and read visibly soft stretched
// across a 1920px screen. Phones keep the light set: same journey, a third
// of the bytes.
// v4 paths: the film is the user's own cut (new studio opening, the Omni
// middle, their landing clip). Versioned directories guarantee no browser or
// CDN cache can ever serve a frame from a previous chain.
export const FRAME_SETS = {
  hd: { dir: "/scrub/v4-hd", count: FRAME_COUNT, w: 1280, h: 720 },
  sd: { dir: "/scrub/v4",    count: FRAME_COUNT, w: 960,  h: 540 },
} as const;

// Static fallback (reduced motion) draws stills from the light set.
export const FRAME_DIR = FRAME_SETS.sd.dir;

export type Zone = {
  id: string;
  /** global scroll progress where the zone begins, 0..1 */
  from: number;
  /** global scroll progress where it hands over */
  to: number;
};

// Six beats of the flight — no longer equal sixths: the user's cut spends
// 10s in the studio opening and tightens the later beats. Boundaries were
// read off the edit frame by frame (launch streak 10.2s, turn behind the
// tail 13.0s, corridor wake-up 19.0s, white burst 27.3s, podium approach
// 31.0s; total 33.55s). `from`/`to` are fractions of the whole scrub; the
// overlay for a zone fades in shortly after `from` and out shortly before
// `to`, so text never straddles a hand-over.
export const ZONES: Zone[] = [
  { id: "vault",    from: 0,      to: 0.3040 },
  { id: "ignition", from: 0.3040, to: 0.3874 },
  { id: "screen",   from: 0.3874, to: 0.5663 },
  { id: "feed",     from: 0.5663, to: 0.8137 },
  { id: "curve",    from: 0.8137, to: 0.9239 },
  { id: "landing",  from: 0.9239, to: 1 },
];

/** 0..1 progress local to a zone, clamped. */
export const zoneLocal = (p: number, z: Zone) =>
  Math.max(0, Math.min(1, (p - z.from) / (z.to - z.from)));

/** Overlay opacity envelope: in over the first 18%, out over the last 15%.
    The FIRST zone skips the in-ramp — the hero must be fully present at
    page load (progress 0), not appear only after the visitor scrolls. The
    LAST zone skips the out-ramp so the closing CTA never fades away while
    the visitor rests at the bottom of the runway. */
export const zoneEnvelope = (p: number, z: Zone) => {
  const t = zoneLocal(p, z);
  const inn = z.from <= 0 ? 1 : Math.min(1, t / 0.18);
  const out = z.to >= 1 ? 1 : Math.min(1, (1 - t) / 0.15);
  return Math.max(0, Math.min(inn, out));
};
