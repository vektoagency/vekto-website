"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import CRTScreen from "./CRTScreen";

const MODEL_URL = "/models/mac-128k.glb";

type Props = {
  hovered: boolean;
  onHoverChange: (h: boolean) => void;
  onScreenClick: () => void;
};

/**
 * Real 3D Macintosh 128K loaded from a Sketchfab GLB placed at
 * /public/models/mac-128k.glb. The model is auto-centered and
 * normalized to ~1.6 units tall so the CRT overlay coordinates stay
 * consistent regardless of the source file's original scale.
 */
export default function MacintoshGLB({ hovered, onHoverChange, onScreenClick }: Props) {
  const root = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const { pointer } = useThree();

  const { prepared, scale, offset } = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 1.6 / Math.max(size.y, 0.0001);
    return {
      prepared: cloned,
      scale: s,
      offset: new THREE.Vector3(-center.x, -center.y + size.y / 2, -center.z).multiplyScalar(s),
    };
  }, [scene]);

  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.getElapsedTime();
    root.current.position.y = Math.sin(t * 0.7) * 0.015 - 0.8;
    const tx = pointer.x * 0.12;
    const ty = -pointer.y * 0.06;
    root.current.rotation.y += (tx - root.current.rotation.y) * 0.06;
    root.current.rotation.x += (ty - root.current.rotation.x) * 0.06;
  });

  return (
    <group ref={root}>
      <primitive object={prepared} scale={scale} position={offset} />

      {/* CRT screen overlay — positioned to sit inside the model's bezel.
          Values are tuned for the Sketchfab macintosh_128k GLB (normalized
          to 1.6u tall). Size is intentionally slightly smaller than the
          bezel so the shader blends into the black screen behind it. */}
      <group
        position={[0, 1.05, 0.48]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHoverChange(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHoverChange(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onScreenClick();
        }}
      >
        <CRTScreen width={0.48} height={0.36} />
        {hovered && (
          <mesh position={[0, 0, 0.003]}>
            <planeGeometry args={[0.5, 0.38]} />
            <meshBasicMaterial color="#c8ff00" transparent opacity={0.06} />
          </mesh>
        )}
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
