"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { createCRTShaderMaterial } from "./crtShaderMaterial";

const MODEL_URL = "/models/mac-128k.glb";
const SCREEN_MESH_NAME = "Computer_Screen_0";

type Props = {
  hovered: boolean;
  zoomedIn?: boolean;
  mobile?: boolean;
  onHoverChange: (h: boolean) => void;
  onScreenClick: () => void;
  onScreenLocated?: (data: { center: THREE.Vector3; normal: THREE.Vector3; width: number; height: number }) => void;
};

/**
 * Real Mac 128K loaded from /public/models/mac-128k.glb. We directly REPLACE
 * the material on the `Computer_Screen_0` mesh with our CRT phosphor shader,
 * so the phosphor lands exactly on the screen geometry — no guesses.
 */
export default function MacintoshGLB({ hovered, zoomedIn, mobile, onHoverChange, onScreenClick, onScreenLocated }: Props) {
  const root = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const { pointer } = useThree();

  // One shared shader material, reused and animated in useFrame.
  const crtMaterial = useMemo(() => createCRTShaderMaterial(), []);

  const { prepared, scale, offset, screenInfo } = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });

    // Normalize: base on y=0, height ~1.6u, x/z centered
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 1.5 / Math.max(size.y, 0.0001);
    const off = new THREE.Vector3(-center.x, -center.y + size.y / 2, -center.z).multiplyScalar(s);

    cloned.updateMatrixWorld(true);

    // Find the screen mesh, replace its material with the CRT shader, and
    // report its world position/normal so the camera can aim at it for zoom.
    type ScreenInfo = { center: THREE.Vector3; normal: THREE.Vector3; width: number; height: number };
    const infoBox: { value: ScreenInfo | null } = { value: null };

    cloned.traverse((obj) => {
      if (obj.name !== SCREEN_MESH_NAME) return;
      const mesh = obj as THREE.Mesh;

      // Replace material in place — the CRT shader now renders on the exact
      // screen geometry baked into the GLB.
      mesh.material = crtMaterial;
      // Make sure screen doesn't cast shadows (emissive surface)
      mesh.castShadow = false;

      // Compute world transform for camera aiming
      mesh.geometry.computeBoundingBox();
      const bb = mesh.geometry.boundingBox;
      if (!bb) return;
      const localCenter = bb.getCenter(new THREE.Vector3());
      const localSize = bb.getSize(new THREE.Vector3());

      const dims: [number, number, number] = [localSize.x, localSize.y, localSize.z];
      const normalAxis = dims.indexOf(Math.min(...dims));
      const widthLocal = normalAxis === 0 ? localSize.z : localSize.x;
      const heightLocal = normalAxis === 1 ? localSize.z : localSize.y;

      const localNormal = new THREE.Vector3(0, 0, 0);
      localNormal.setComponent(normalAxis, 1);

      const meshWorldPos = localCenter.clone().applyMatrix4(mesh.matrixWorld);
      const q = new THREE.Quaternion();
      const _p = new THREE.Vector3();
      const _ms = new THREE.Vector3();
      mesh.matrixWorld.decompose(_p, q, _ms);
      const worldNormal = localNormal.clone().applyQuaternion(q).normalize();

      const finalPos = meshWorldPos.clone().multiplyScalar(s).add(off);
      const finalWidth = widthLocal * _ms.x * s;
      const finalHeight = heightLocal * _ms.y * s;

      infoBox.value = {
        center: finalPos,
        normal: worldNormal,
        width: finalWidth,
        height: finalHeight,
      };
    });

    return { prepared: cloned, scale: s, offset: off, screenInfo: infoBox.value };
  }, [scene, crtMaterial]);

  // Notify parent of screen location for camera zoom
  useEffect(() => {
    if (!screenInfo || !onScreenLocated) return;
    onScreenLocated(screenInfo);
  }, [screenInfo, onScreenLocated]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    // Heavier inertia on the parallax tilt — slower lerp + smaller target
    // multipliers so cursor flicks don't yank the model. Reads as silky.
    const rotRate = 1 - Math.pow(1 - 0.025, dt * 60);
    const intRate = 1 - Math.pow(1 - 0.12, dt * 60);
    if (root.current) {
      const t = state.clock.getElapsedTime();
      root.current.position.y = Math.sin(t * 0.7) * 0.015 - 0.8;
      const BASE_ROT_Y = -0.38;
      const tx = BASE_ROT_Y + pointer.x * 0.05;
      const ty = -pointer.y * 0.025;
      root.current.rotation.y += (tx - root.current.rotation.y) * rotRate;
      root.current.rotation.x += (ty - root.current.rotation.x) * rotRate;
    }
    crtMaterial.uniforms.uTime.value += delta;
    // On mobile there's no hover, so we pulse uIntensity between 1.0 and
    // 2.0 on a 1.6s cycle — a clearly visible breathing phosphor that
    // signals the CRT is interactive. The lerp rate smooths it out so
    // it reads as a pulse, not a flicker.
    const t = state.clock.getElapsedTime();
    const mobilePulse = mobile && !zoomedIn ? 1.0 + 1.0 * (0.5 + 0.5 * Math.sin(t * 1.25 * Math.PI)) : null;
    const target = zoomedIn ? 2.4 : hovered ? 1.5 : mobilePulse ?? 1.2;
    const cur = crtMaterial.uniforms.uIntensity.value;
    crtMaterial.uniforms.uIntensity.value = cur + (target - cur) * intRate;
  });

  // Invisible click/hover plane oriented to face along the screen's normal,
  // sitting slightly in front of it. Hit area exactly matches the screen.
  const hitQuat = useMemo(() => {
    if (!screenInfo) return new THREE.Quaternion();
    return new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      screenInfo.normal.clone().normalize()
    );
  }, [screenInfo]);

  const hitPlane = screenInfo ? (
    <mesh
      position={screenInfo.center.clone().add(screenInfo.normal.clone().multiplyScalar(0.08))}
      quaternion={hitQuat}
      onPointerOver={(e) => { e.stopPropagation(); onHoverChange(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={(e) => { e.stopPropagation(); onHoverChange(false); document.body.style.cursor = "auto"; }}
      onClick={(e) => { e.stopPropagation(); onScreenClick(); }}
    >
      <planeGeometry args={[screenInfo.width * 1.12, screenInfo.height * 1.12]} />
      <meshBasicMaterial
        color="#c8ff00"
        transparent
        opacity={hovered ? 0.08 : 0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  ) : null;

  return (
    <group ref={root}>
      <primitive object={prepared} scale={scale} position={offset} />
      {hitPlane}
    </group>
  );
}

useGLTF.preload(MODEL_URL);
