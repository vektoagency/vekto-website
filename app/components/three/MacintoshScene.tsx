"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import MacintoshGLB from "./MacintoshGLB";

type Props = {
  zoomedIn: boolean;
  paused?: boolean;
  mobile?: boolean;
  onScreenClick?: () => void;
  onReady?: () => void;
};

// Fires once after the Suspense boundary resolves (GLB parsed, scene built).
function ReadySignal({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    if (!onReady) return;
    // One extra frame gives the shader time to compile.
    const id = requestAnimationFrame(() => onReady());
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  return null;
}

type ScreenInfo = {
  center: THREE.Vector3;
  normal: THREE.Vector3;
  width: number;
  height: number;
};

// Canvas is now fullscreen. Pan the whole view left so the Mac renders
// visually on the right, and pull the camera back slightly so the
// keyboard + mouse aren't cramped against the viewport edge.
const DEFAULT_IDLE_CAM = new THREE.Vector3(-0.9, 1.35, 6.2);
const DEFAULT_IDLE_TARGET = new THREE.Vector3(-2.0, 0.0, 0.3);
// Mobile framing — Canvas is fullscreen portrait. Camera sits slightly
// left of centre so the Mac lands a touch right of centre in the
// viewport (halfway between dead-centre and the desktop right-third
// placement). fov stays wide because portrait aspect squeezes
// horizontal room.
const MOBILE_IDLE_CAM = new THREE.Vector3(-0.15, 0.1, 6.9);
const MOBILE_IDLE_TARGET = new THREE.Vector3(-0.37, -0.45, 0.3);
// Fallback zoom target if screen mesh hasn't been located yet.
const FALLBACK_ZOOM_CAM = new THREE.Vector3(0, 0.4, 2.0);
const FALLBACK_ZOOM_TARGET = new THREE.Vector3(0, 0.4, 0.5);

function CameraRig({
  zoomedIn,
  screen,
  mobile,
}: {
  zoomedIn: boolean;
  screen: ScreenInfo | null;
  mobile?: boolean;
}) {
  const { camera } = useThree();
  const idleCam = mobile ? MOBILE_IDLE_CAM : DEFAULT_IDLE_CAM;
  const idleTarget = mobile ? MOBILE_IDLE_TARGET : DEFAULT_IDLE_TARGET;
  const target = useRef(new THREE.Vector3().copy(idleTarget));

  // Build zoom cam/target from the real screen mesh if available
  const { zoomCam, zoomTarget } = useMemo(() => {
    if (!screen) {
      return { zoomCam: FALLBACK_ZOOM_CAM.clone(), zoomTarget: FALLBACK_ZOOM_TARGET.clone() };
    }
    // Stand off from the screen along its normal by enough distance to frame it
    // at the current fov. Distance = max(width, height) / (2 * tan(fov/2))
    // fov vertical = 32deg, tan(16) ≈ 0.287
    const maxSide = Math.max(screen.width, screen.height);
    // Very aggressive crop — camera lands so close that the phosphor fills
    // the entire viewport and literally becomes the page background.
    const standoff = maxSide / (2 * Math.tan((32 * Math.PI) / 360)) * 0.38;
    const camPos = screen.center.clone().add(screen.normal.clone().multiplyScalar(standoff));
    // Account for the model group's y-offset applied in MacintoshGLB's useFrame (root.y=-0.8)
    camPos.y += -0.8;
    const tgtPos = screen.center.clone();
    tgtPos.y += -0.8;
    return { zoomCam: camPos, zoomTarget: tgtPos };
  }, [screen]);

  useFrame((_, delta) => {
    // Delta-based lerp — frame-rate independent (same smoothness on 60Hz and 120Hz).
    const rate = zoomedIn ? 0.10 : 0.05;
    const t = 1 - Math.pow(1 - rate, Math.min(delta, 0.05) * 60);
    const targetCam = zoomedIn ? zoomCam : idleCam;
    const targetLook = zoomedIn ? zoomTarget : idleTarget;
    camera.position.lerp(targetCam, t);
    target.current.lerp(targetLook, t);
    camera.lookAt(target.current);
  });

  return null;
}

export default function MacintoshScene({ zoomedIn, paused = false, mobile = false, onScreenClick, onReady }: Props) {
  const [hovered, setHovered] = useState(false);
  const [screen, setScreen] = useState<ScreenInfo | null>(null);
  const [inView, setInView] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pause the render loop whenever the Mac scrolls out of view. Keeps the
  // idle GPU load at ~0% when the user is below the hero. When zoomed in
  // the scene is locked fullscreen, so we force "always" in that case.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Pause rendering entirely when the portfolio overlay is covering the scene —
  // the R3F loop was burning ~60fps behind an opaque modal.
  const frameloop = paused ? "never" : zoomedIn || inView ? "always" : "never";

  return (
    <div ref={wrapperRef} className="absolute inset-0">
      <Canvas
        shadows={!mobile}
        dpr={mobile ? 1 : [1, 1.5]}
        frameloop={frameloop}
        camera={{ position: (mobile ? MOBILE_IDLE_CAM : DEFAULT_IDLE_CAM).toArray(), fov: mobile ? 52 : 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: mobile ? "default" : "high-performance" }}
        style={{ background: "transparent" }}
      >

        <Suspense fallback={null}>
          <directionalLight
            position={[3.5, 4.5, 3.5]}
            intensity={1.3}
            color="#fff2d8"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-4, 2.5, 1.5]} intensity={0.45} color="#8fb3ff" />
          <pointLight position={[-2.2, 1.4, -2.5]} intensity={3.2} distance={7} color="#c8ff00" />
          <ambientLight intensity={0.32} color="#2b2518" />

          <Environment preset="warehouse" />

          <MacintoshGLB
            hovered={hovered}
            zoomedIn={zoomedIn}
            onHoverChange={setHovered}
            onScreenClick={() => onScreenClick?.()}
            onScreenLocated={setScreen}
          />

          <ReadySignal onReady={onReady} />

          <ContactShadows
            position={[0, -0.88, 0.2]}
            opacity={0.55}
            scale={6}
            blur={2.4}
            far={2.5}
            color="#000000"
          />
        </Suspense>

        <CameraRig zoomedIn={zoomedIn} screen={screen} mobile={mobile} />

        {/* Mobile skips postprocessing entirely — bloom + vignette are
            the most expensive passes on the GPU and the CSS atmosphere
            behind the canvas already provides the dim-studio feel. */}
        {!mobile && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={zoomedIn ? 0.9 : 0.4}
              luminanceThreshold={0.78}
              luminanceSmoothing={0.22}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.5} darkness={zoomedIn ? 0.78 : 0.55} />
          </EffectComposer>
        )}
      </Canvas>

      {!zoomedIn && !mobile && (
        <div className="pointer-events-none absolute inset-y-0 left-[74%] -translate-x-1/2 z-10 flex flex-col justify-center pt-24 pb-16 text-center">
          {/* Caption — occupies the same slot as the left column's "AI-Powered Creative Agency" badge */}
          <div className={`inline-flex flex-col items-center gap-1.5 transition-opacity duration-500 mb-8 mt-[46px] ${hovered ? "opacity-100" : "opacity-90"}`}>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
              OUR PORTFOLIO LIVES INSIDE
            </span>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/85">
              {hovered ? "▸ click to enter" : "click the screen ↓"}
            </span>
          </div>
          {/* Invisible spacer mirroring left column's h1 + p + buttons + tagline
              so that justify-center places the caption at the same vertical
              position as the left badge, regardless of viewport height. */}
          <div aria-hidden className="invisible">
            <div className="text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
              Placeholder<br />for layout<br />alignment
            </div>
            <p className="max-w-md text-lg leading-relaxed mb-10">
              Placeholder paragraph kept for layout parity with the left column.
            </p>
            <div className="px-8 py-4 mb-4 font-semibold">Button Row</div>
            <p className="text-sm">Tagline placeholder.</p>
          </div>
        </div>
      )}
    </div>
  );
}
