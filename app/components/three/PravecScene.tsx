"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import PravecModel from "./PravecModel";
import ShaderBackdrop from "./ShaderBackdrop";

const IDLE_CAM = new THREE.Vector3(0, 0.1, 7.2);
const ZOOM_CAM = new THREE.Vector3(0, 0.4, 2.0);

function CameraRig({ transitioning }: { transitioning: boolean }) {
  const { camera } = useThree();
  const t0 = useRef<number | null>(null);
  const start = useRef(IDLE_CAM.clone());

  useFrame((state) => {
    if (transitioning) {
      if (t0.current === null) {
        t0.current = state.clock.getElapsedTime();
        start.current.copy(camera.position);
      }
      const dur = 0.95;
      const k = Math.min((state.clock.getElapsedTime() - t0.current) / dur, 1);
      const eased = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const accel = eased + Math.pow(k, 4) * 0.4;
      camera.position.lerpVectors(start.current, ZOOM_CAM, Math.min(accel, 1));
      camera.lookAt(0, 0.3, 0);
    } else {
      t0.current = null;
      camera.position.lerp(IDLE_CAM, 0.05);
      camera.lookAt(0, 0.1, 0);
    }
  });

  return null;
}

export default function PravecScene() {
  const [hovered, setHovered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const handleEnter = (evt?: { clientX?: number; clientY?: number }) => {
    if (transitioning) return;
    setTransitioning(true);
    // Use the click point if available, else default (handled by bridge)
    const detail =
      evt && evt.clientX != null && evt.clientY != null
        ? {
            x: (evt.clientX / window.innerWidth) * 100,
            y: (evt.clientY / window.innerHeight) * 100,
          }
        : undefined;
    window.dispatchEvent(new CustomEvent("vekto:enter-pravec", { detail }));
  };

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <div className="absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.1, 7.2], fov: 30 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#0a0805"]} />
          <fog attach="fog" args={["#0a0805", 6, 12]} />

          <Suspense fallback={null}>
            {/* Key light warm */}
            <directionalLight
              position={[4, 6, 5]}
              intensity={1.4}
              color="#fff6e0"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            {/* Fill light cool */}
            <directionalLight position={[-5, 3, 2]} intensity={0.4} color="#8fb3ff" />
            {/* Rim light lime */}
            <pointLight position={[-3, 2, -3]} intensity={3.5} distance={8} color="#c8ff00" />
            {/* Ambient */}
            <ambientLight intensity={0.35} color="#2a2418" />

            <Environment preset="warehouse" />

            <ShaderBackdrop intensity={transitioning ? 2.2 : 1.0} />

            <Sparkles
              count={60}
              scale={[6, 4, 4]}
              position={[0, 0, 0]}
              size={2}
              speed={0.25}
              opacity={0.6}
              color="#c8ff00"
            />

            <PravecModel
              onScreenClick={handleEnter}
              hovered={hovered}
              onHoverChange={setHovered}
            />

            <ContactShadows
              position={[0, -1.28, 0.25]}
              opacity={0.55}
              scale={8}
              blur={2.4}
              far={3}
              color="#000000"
            />
          </Suspense>

          <CameraRig transitioning={transitioning} />

          <EffectComposer multisampling={0}>
            <Bloom
              intensity={transitioning ? 1.2 : 0.35}
              luminanceThreshold={0.82}
              luminanceSmoothing={0.2}
              mipmapBlur
            />
            <ChromaticAberration
              offset={transitioning ? [0.015, 0.015] : [0.001, 0.001]}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={false}
              modulationOffset={0}
            />
            <Noise opacity={transitioning ? 0.35 : 0.06} blendFunction={BlendFunction.SCREEN} />
            <Vignette eskil={false} offset={0.15} darkness={0.9} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Helper hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a7f6a]">
        <span className={`inline-flex items-center gap-2 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-70"}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
          {hovered ? "CLICK SCREEN TO ENTER" : "INTERACT WITH THE MACHINE"}
        </span>
      </div>

    </>
  );
}
