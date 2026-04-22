"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import CRTScreen from "./CRTScreen";

const MODEL_URL = "/models/mac-128k.glb";
const SCREEN_MESH_NAME = "Computer_Screen_0";

type ScreenData = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  width: number;
  height: number;
  normal: THREE.Vector3;
};

type Props = {
  hovered: boolean;
  onHoverChange: (h: boolean) => void;
  onScreenClick: () => void;
  onScreenLocated?: (data: { center: THREE.Vector3; normal: THREE.Vector3; width: number; height: number }) => void;
};

/**
 * Real Mac 128K loaded from /public/models/mac-128k.glb. The model is
 * auto-centered + normalized to ~1.6 units tall. The CRT phosphor
 * shader is positioned by reading the actual `Computer_Screen_0` mesh's
 * bounding box from the GLB, so it always lands precisely on the bezel.
 */
export default function MacintoshGLB({ hovered, onHoverChange, onScreenClick, onScreenLocated }: Props) {
  const root = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const { pointer } = useThree();

  const { prepared, scale, offset, screen } = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });

    // Normalize the whole model: base on y=0, vertically scaled to 1.6u, x/z centered
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 1.6 / Math.max(size.y, 0.0001);
    const off = new THREE.Vector3(-center.x, -center.y + size.y / 2, -center.z).multiplyScalar(s);

    // Find the screen mesh and compute its real-world transform inside our group
    cloned.updateMatrixWorld(true);
    let screenData: ScreenData | null = null;

    cloned.traverse((obj) => {
      if (obj.name !== SCREEN_MESH_NAME) return;
      const mesh = obj as THREE.Mesh;
      mesh.geometry.computeBoundingBox();
      const bb = mesh.geometry.boundingBox;
      if (!bb) return;
      const localCenter = bb.getCenter(new THREE.Vector3());
      const localSize = bb.getSize(new THREE.Vector3());

      // The thin axis = surface normal direction
      const dims: [number, number, number] = [localSize.x, localSize.y, localSize.z];
      const normalAxis = dims.indexOf(Math.min(...dims));
      // Width/height = the other two dims
      const widthLocal = normalAxis === 0 ? localSize.z : localSize.x;
      const heightLocal = normalAxis === 1 ? localSize.z : localSize.y;

      // Local normal vector (then transformed to world)
      const localNormal = new THREE.Vector3(0, 0, 0);
      localNormal.setComponent(normalAxis, 1);

      // World transform of the mesh (within the cloned scene)
      const meshWorldPos = localCenter.clone().applyMatrix4(mesh.matrixWorld);
      const q = new THREE.Quaternion();
      const _p = new THREE.Vector3();
      const _s = new THREE.Vector3();
      mesh.matrixWorld.decompose(_p, q, _s);
      const worldNormal = localNormal.clone().applyQuaternion(q).normalize();

      // Apply our group's normalize transform (scale * worldPos + offset)
      const finalPos = meshWorldPos.clone().multiplyScalar(s).add(off);
      // Push the overlay slightly outward along the normal so it doesn't z-fight
      finalPos.add(worldNormal.clone().multiplyScalar(0.005));

      // Final size = local size * mesh world scale * group scale
      const meshScale = _s;
      const finalWidth = widthLocal * meshScale.x * s;
      const finalHeight = heightLocal * meshScale.y * s;

      const data: ScreenData = {
        position: finalPos,
        quaternion: q,
        width: finalWidth,
        height: finalHeight,
        normal: worldNormal,
      };
      screenData = data;
    });

    return {
      prepared: cloned,
      scale: s,
      offset: off,
      screen: screenData as ScreenData | null,
    };
  }, [scene]);

  // Notify parent of the screen location so the camera can aim at it for zoom
  useEffect(() => {
    if (!screen || !onScreenLocated) return;
    onScreenLocated({
      center: screen.position.clone(),
      normal: screen.normal.clone(),
      width: screen.width,
      height: screen.height,
    });
  }, [screen, onScreenLocated]);

  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.getElapsedTime();
    root.current.position.y = Math.sin(t * 0.7) * 0.015 - 0.8;
    const tx = pointer.x * 0.1;
    const ty = -pointer.y * 0.05;
    root.current.rotation.y += (tx - root.current.rotation.y) * 0.05;
    root.current.rotation.x += (ty - root.current.rotation.x) * 0.05;
  });

  // Mac 128K visible screen aspect = ~1.49:1. Force this aspect to avoid
  // stretching/squashing based on the GLB's bounding box. Width first, height
  // derived from the aspect ratio. Offset downward to land in the visible bezel.
  const padW = screen ? screen.width * 0.84 : 0;
  const padH = screen ? padW / 1.45 : 0;
  const yOffset = screen ? -screen.height * 0.08 : 0;

  return (
    <group ref={root}>
      <primitive object={prepared} scale={scale} position={offset} />

      {screen && (
        <group
          position={screen.position}
          quaternion={screen.quaternion}
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
          <group position={[0, yOffset, 0]}>
            <CRTScreen width={padW} height={padH} />
            {hovered && (
              <mesh position={[0, 0, 0.002]}>
                <planeGeometry args={[padW * 1.02, padH * 1.02]} />
                <meshBasicMaterial color="#c8ff00" transparent opacity={0.05} />
              </mesh>
            )}
          </group>
        </group>
      )}
    </group>
  );
}

useGLTF.preload(MODEL_URL);
