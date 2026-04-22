"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import MacintoshModel from "./MacintoshModel";

type Props = {
  zoomedIn: boolean;
  onScreenClick?: () => void;
};

const IDLE_CAM = new THREE.Vector3(0.9, 1.1, 4.6);
const IDLE_TARGET = new THREE.Vector3(0, -0.25, 0.4);
const ZOOM_CAM = new THREE.Vector3(0, 0.32, 0.74);
const ZOOM_TARGET = new THREE.Vector3(0, 0.32, 0);

function CameraRig({ zoomedIn }: { zoomedIn: boolean }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3().copy(IDLE_TARGET));

  useFrame(() => {
    const lerp = zoomedIn ? 0.06 : 0.05;
    const targetCam = zoomedIn ? ZOOM_CAM : IDLE_CAM;
    const targetLook = zoomedIn ? ZOOM_TARGET : IDLE_TARGET;
    camera.position.lerp(targetCam, lerp);
    target.current.lerp(targetLook, lerp);
    camera.lookAt(target.current);
  });

  return null;
}

export default function MacintoshScene({ zoomedIn, onScreenClick }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: IDLE_CAM.toArray(), fov: 32 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#0a0805"]} />
        <fog attach="fog" args={["#0a0805", 4.5, 9]} />

        <Suspense fallback={null}>
          {/* Warm key */}
          <directionalLight
            position={[3.5, 4.5, 3.5]}
            intensity={1.3}
            color="#fff2d8"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* Cool fill */}
          <directionalLight position={[-4, 2.5, 1.5]} intensity={0.45} color="#8fb3ff" />
          {/* Lime rim */}
          <pointLight position={[-2.2, 1.4, -2.5]} intensity={3.2} distance={7} color="#c8ff00" />
          {/* Ambient */}
          <ambientLight intensity={0.32} color="#2b2518" />

          <Environment preset="warehouse" />

          <MacintoshModel
            hovered={hovered}
            onHoverChange={setHovered}
            onScreenClick={() => onScreenClick?.()}
          />

          <ContactShadows
            position={[0, -0.88, 0.2]}
            opacity={0.55}
            scale={6}
            blur={2.4}
            far={2.5}
            color="#000000"
          />
        </Suspense>

        <CameraRig zoomedIn={zoomedIn} />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={zoomedIn ? 0.9 : 0.4}
            luminanceThreshold={0.78}
            luminanceSmoothing={0.22}
            mipmapBlur
          />
          <ChromaticAberration
            offset={zoomedIn ? [0.01, 0.01] : [0.0012, 0.0012]}
            blendFunction={BlendFunction.NORMAL}
            radialModulation={false}
            modulationOffset={0}
          />
          <Noise opacity={zoomedIn ? 0.2 : 0.07} blendFunction={BlendFunction.SCREEN} />
          <Vignette eskil={false} offset={0.18} darkness={0.88} />
        </EffectComposer>
      </Canvas>

      {/* Hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a7f6a]">
        <span className={`inline-flex items-center gap-2 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-70"}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
          {hovered ? "CLICK SCREEN TO ENTER" : "VEKTO/MAC — 1984"}
        </span>
      </div>
    </div>
  );
}
