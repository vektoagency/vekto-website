"use client";

// ============================================================================
// SCROLL-DRIVEN WEBGL GLOBE · hero of /preview-brutalism
//
// Loaded via next/dynamic with ssr:false, so three.js lands in its own chunk
// and never blocks first paint. The parent decides whether to mount it at all
// (desktop only, and not under prefers-reduced-motion).
//
// It is driven ENTIRELY by the `progress` prop — 0 when the sticky hero
// latches, 1 when it releases. There is no autonomous animation loop
// advancing state; the render loop only interpolates toward the scroll
// target so motion stays smooth between scroll events. Scrolling back up
// runs the whole thing in reverse.
//
// Honesty constraints (the roster is real, the geography is not invented):
//   - No fabricated client-city pins. The two markers are Bulgaria and the
//     United States, which is exactly the claim the page already makes.
//   - No coastline data ships with this project and none was authored by
//     hand, so the sphere carries a measurement graticule rather than
//     made-up continents.
// ============================================================================

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Palette, matched to the page.
const JET = 0x0d0d0d;
const SILVER = 0xb4b4b4;
const SILVER_DIM = 0x6d6d6d;

const R = 1; // globe radius in world units

// Real coordinates. Sofia is the agency's base; the US marker is the
// geographic centre of the contiguous United States, labelled as a country
// rather than dressed up as a client location.
const SOFIA = { lat: 42.6977, lon: 23.3219 };
const USA = { lat: 39.8283, lon: -98.5795 };

/** Lat/lon (degrees) -> point on a sphere of radius `r`. */
function toVec3(lat: number, lon: number, r = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

/** Cubic ease-out, used to settle each staged reveal. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
/** Map v from [a,b] to [0,1], clamped. */
const range = (v: number, a: number, b: number) =>
  Math.max(0, Math.min(1, (v - a) / (b - a)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// --- Aiming the globe -------------------------------------------------------
// A free spin is not good enough here: the two markers and the arc between
// them are the entire point of the sequence, and a rotation that happens to
// park Bulgaria on the far side of the sphere shows the visitor an empty
// wireframe. So rotation is solved rather than guessed.
//
// With toVec3 above, a point at longitude L sits on the camera-facing meridian
// when rotation.y = (-90 - L) in degrees. Deriving it means each beat can
// aim at a real coordinate.
const ryFacing = (lon: number) => (-90 - lon) * (Math.PI / 180);

const RY_SOFIA = ryFacing(SOFIA.lon);
// Framing that holds BOTH markers on screen with the arc bridging them:
// aim at the midpoint of the two longitudes. Reached monotonically from
// Bulgaria, so the globe never reverses direction mid-scroll.
const RY_BOTH = ryFacing((SOFIA.lon + USA.lon) / 2);
// Tilting by the marker's latitude brings it off the pole and onto the
// equator line facing the camera; 0.75 keeps a natural oblique instead of
// staring straight down at it.
const RX_AIM = SOFIA.lat * (Math.PI / 180) * 0.85;

export default function Globe({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Progress is written by React on every scroll frame but read inside the
  // rAF loop; a ref keeps the three.js scene from being rebuilt per update.
  const targetRef = useRef(progress);
  targetRef.current = progress;
  // Set by the scene effect; lets a progress change restart a settled loop.
  const kickRef = useRef<(() => void) | null>(null);
  useEffect(() => { kickRef.current?.(); }, [progress]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x000000, 0);
    // Capping at 2 keeps 3x/4x phone-class panels from quadrupling the
    // fragment cost for no visible gain.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    // The whole globe hangs off one group so scroll rotates everything —
    // sphere, graticule, markers and arc — as a single rigid body.
    const globe = new THREE.Group();
    scene.add(globe);

    // --- Body -------------------------------------------------------------
    // Matte, near-black, very low shininess. The point of the solid sphere
    // is occlusion: it hides the graticule and markers on the far side, which
    // is what makes this read as a globe instead of a flat ring diagram.
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.995, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x161616, shininess: 3, specular: 0x242424 }),
    );
    globe.add(body);

    // Hard silhouette rim. The globe sits on a jet-black panel, so without a
    // drawn edge its outline is defined only by where the graticule stops —
    // which reads as a smudge rather than an object. A crisp circle in the
    // camera plane gives it the same hard 2px edge every other element on
    // the page has. NOT parented to `globe`: it must not rotate.
    // Placed on the true tangent circle rather than the equator: from a
    // perspective camera at distance d the sphere's visible edge is a circle
    // of radius R*sqrt(1-(R/d)^2) sitting at z = R^2/d. A plain R-radius ring
    // at z=0 would sit visibly outside the silhouette.
    const camD = 4;
    const rimR = R * Math.sqrt(1 - (R / camD) ** 2);
    const rimGeom = new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, rimR, rimR, 0, Math.PI * 2, false, 0)
        .getPoints(180)
        .map((v) => new THREE.Vector3(v.x, v.y, (R * R) / camD)),
    );
    const rim = new THREE.LineLoop(
      rimGeom,
      new THREE.LineBasicMaterial({ color: SILVER, transparent: true, opacity: 0.9 }),
    );
    scene.add(rim);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(-2.5, 1.6, 2.2);
    scene.add(key);

    // --- Graticule --------------------------------------------------------
    // Parallels every 15°, meridians every 15°. Built as one LineSegments so
    // the entire grid is a single draw call.
    const gridPts: number[] = [];
    const SEG = 96;
    for (let lat = -75; lat <= 75; lat += 15) {
      for (let i = 0; i < SEG; i++) {
        const a = toVec3(lat, (i / SEG) * 360 - 180, R * 1.002);
        const b = toVec3(lat, ((i + 1) / SEG) * 360 - 180, R * 1.002);
        gridPts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    // Meridians stop short of the poles. Run to ±90 and all 24 of them
    // converge into a dense knot exactly where the Sofia–USA arc crosses,
    // which buried the arc in mesh noise.
    const MER_LIM = 78;
    for (let lon = -180; lon < 180; lon += 15) {
      for (let i = 0; i < SEG; i++) {
        const a = toVec3((i / SEG) * 2 * MER_LIM - MER_LIM, lon, R * 1.002);
        const b = toVec3(((i + 1) / SEG) * 2 * MER_LIM - MER_LIM, lon, R * 1.002);
        gridPts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const gridGeom = new THREE.BufferGeometry();
    gridGeom.setAttribute("position", new THREE.Float32BufferAttribute(gridPts, 3));
    const gridMat = new THREE.LineBasicMaterial({
      color: SILVER_DIM,
      transparent: true,
      opacity: 0.55,
    });
    const grid = new THREE.LineSegments(gridGeom, gridMat);
    globe.add(grid);

    // --- Equator + prime meridian ----------------------------------------
    // Drawn brighter than the rest of the graticule so the sphere has a
    // readable axis instead of a uniform mesh.
    const axisPts: number[] = [];
    for (let i = 0; i < 240; i++) {
      const a = toVec3(0, (i / 240) * 360 - 180, R * 1.004);
      const b = toVec3(0, ((i + 1) / 240) * 360 - 180, R * 1.004);
      axisPts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const axisGeom = new THREE.BufferGeometry();
    axisGeom.setAttribute("position", new THREE.Float32BufferAttribute(axisPts, 3));
    const axis = new THREE.LineSegments(
      axisGeom,
      new THREE.LineBasicMaterial({ color: SILVER, transparent: true, opacity: 0.9 }),
    );
    globe.add(axis);

    // --- Markers ----------------------------------------------------------
    // Each marker is a hard-edged octahedron (facets, not a smooth blob) plus
    // a flat ring lying tangent to the surface.
    const makeMarker = (lat: number, lon: number) => {
      const g = new THREE.Group();
      const pos = toVec3(lat, lon, R * 1.01);

      const pin = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.075, 0),
        new THREE.MeshBasicMaterial({ color: 0xf4f4f4 }),
      );
      pin.position.copy(pos);
      g.add(pin);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.1, 0.125, 32),
        new THREE.MeshBasicMaterial({
          color: SILVER,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        }),
      );
      ring.position.copy(pos);
      ring.lookAt(pos.clone().multiplyScalar(2)); // lie flat on the surface
      g.add(ring);

      // Stem down to the surface, so the pin reads as attached rather than
      // floating in front of the sphere.
      const stemGeom = new THREE.BufferGeometry().setFromPoints([
        toVec3(lat, lon, R * 0.99),
        pos,
      ]);
      g.add(new THREE.Line(stemGeom, new THREE.LineBasicMaterial({ color: SILVER })));

      g.scale.setScalar(0);
      globe.add(g);
      return g;
    };
    const mSofia = makeMarker(SOFIA.lat, SOFIA.lon);
    const mUsa = makeMarker(USA.lat, USA.lon);

    // --- Great-circle arc -------------------------------------------------
    // Spherical interpolation, not a Bezier. A quadratic Bezier only reaches
    // halfway to its control point, so with the endpoints 121 degrees apart
    // the curve's own midpoint landed at 0.85R — buried inside the sphere and
    // invisible. Slerping the endpoints and pushing the result out by a sine
    // profile keeps every point provably outside the surface, and gives the
    // real great-circle route between the two rather than an approximation.
    const arcFrom = toVec3(SOFIA.lat, SOFIA.lon, R);
    const arcTo = toVec3(USA.lat, USA.lon, R);
    const ARC_LIFT = 0.28;
    const arcPoint = (t: number) => {
      const omega = arcFrom.angleTo(arcTo);
      const s = Math.sin(omega);
      const a = Math.sin((1 - t) * omega) / s;
      const bq = Math.sin(t * omega) / s;
      return arcFrom
        .clone()
        .multiplyScalar(a)
        .add(arcTo.clone().multiplyScalar(bq))
        .normalize()
        .multiplyScalar(R * (1 + ARC_LIFT * Math.sin(Math.PI * t)));
    };
    // Drawn as a tube, not a line. WebGL ignores LineBasicMaterial.linewidth
    // on every desktop driver, so a 1px arc was indistinguishable from the
    // graticule it crosses. A thin tube gives it real weight and its own
    // shading, which is what makes the route read as the subject.
    const ARC_PTS = 160;
    const ARC_RADIAL = 6;
    const arcCurve = new THREE.CatmullRomCurve3(
      Array.from({ length: ARC_PTS }, (_, i) => arcPoint(i / (ARC_PTS - 1))),
    );
    const arcGeom = new THREE.TubeGeometry(
      arcCurve,
      ARC_PTS - 1,
      0.0125,
      ARC_RADIAL,
      false,
    );
    const arc = new THREE.Mesh(
      arcGeom,
      new THREE.MeshBasicMaterial({ color: 0xf4f4f4 }),
    );
    // Index count per tubular segment, used to reveal the tube ring by ring.
    const ARC_STRIDE = ARC_RADIAL * 6;
    arcGeom.setDrawRange(0, 0);
    globe.add(arc);

    // A bead that rides the arc as it draws — the "traffic" between the two
    // markers, and the only element that moves independently of rotation.
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.042, 14, 14),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    bead.visible = false;
    globe.add(bead);

    // --- Sizing -----------------------------------------------------------
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // --- Loop -------------------------------------------------------------
    // `shown` chases `targetRef.current`. The lerp is the only source of
    // motion between scroll events, so a parked page settles and stops
    // changing rather than idling forever.
    let raf = 0;
    let shown = targetRef.current;
    let running = true;

    // Don't burn frames while the hero is off-screen.
    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        if (running) kickRef.current?.();
      },
      { threshold: 0 },
    );
    io.observe(host);

    function tick() {
      raf = 0;
      const target = targetRef.current;
      shown += (target - shown) * 0.09;
      const p = shown;

      // Rotation, in two monotonic legs:
      //   0.00-0.30  the globe spins in and settles with Bulgaria centred
      //   0.30-1.00  it rotates west until both markers and the arc frame up
      // Both legs turn the same direction, so scrolling never makes the
      // globe visibly bounce back on itself.
      const spinIn = ease(range(p, 0, 0.3));
      const travel = ease(range(p, 0.3, 1));
      globe.rotation.y = lerp(RY_SOFIA - 1.35, RY_SOFIA, spinIn) + (RY_BOTH - RY_SOFIA) * travel;
      globe.rotation.x = lerp(0.1, RX_AIM, spinIn) - travel * 0.1;

      // Stage 1 — the globe arrives.
      const intro = ease(range(p, 0, 0.22));
      globe.scale.setScalar(0.82 + intro * 0.18);
      rim.scale.setScalar(0.82 + intro * 0.18); // rim is unparented, so match by hand
      gridMat.opacity = 0.14 + intro * 0.46;

      // Stage 2 — Bulgaria lands, then the United States rotates into view.
      mSofia.scale.setScalar(ease(range(p, 0.22, 0.42)));
      mUsa.scale.setScalar(ease(range(p, 0.46, 0.66)));

      // Stage 3 — the route draws between them.
      const arcP = ease(range(p, 0.6, 0.95));
      arcGeom.setDrawRange(0, Math.floor(arcP * (ARC_PTS - 1)) * ARC_STRIDE);
      if (arcP > 0.02 && arcP < 0.999) {
        bead.visible = true;
        bead.position.copy(arcPoint(arcP));
      } else {
        bead.visible = false;
      }

      renderer.render(scene, camera);

      // Keep going only while there is still motion left to resolve, so a
      // parked page costs zero frames instead of idling at 60fps forever.
      if (running && Math.abs(target - shown) > 0.0002) {
        raf = requestAnimationFrame(tick);
      }
    }

    // Re-arm the loop when the parent pushes a new progress value or the
    // hero scrolls back into view. Exposed through a ref rather than polled.
    kickRef.current = () => {
      if (running && !raf) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      kickRef.current = null;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      // three.js holds GPU memory outside the JS heap; without explicit
      // disposal every route change would leak a full scene.
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden />;
}
