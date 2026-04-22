"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import CRTScreen from "./CRTScreen";

const BEIGE = "#d6c7ab";
const BEIGE_MID = "#c5b59a";
const BEIGE_DARK = "#a89879";
const RECESS = "#3a332a";
const DARK = "#141110";
const SLOT = "#0c0a09";

/**
 * Procedural Classic Macintosh 128K (1984). Vertical all-in-one beige
 * case with CRT, floppy slot, rainbow Apple logo, and Macintosh wordmark.
 */
type Props = {
  hovered: boolean;
  onHoverChange: (h: boolean) => void;
  onScreenClick: () => void;
};

export default function MacintoshModel({ hovered, onHoverChange, onScreenClick }: Props) {
  const root = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle float + parallax to pointer
    root.current.position.y = Math.sin(t * 0.7) * 0.015;
    const tx = pointer.x * 0.12;
    const ty = -pointer.y * 0.06;
    root.current.rotation.y += (tx - root.current.rotation.y) * 0.06;
    root.current.rotation.x += (ty - root.current.rotation.x) * 0.06;
  });

  // Dimensions (units ~= 25cm per 1.0)
  const W = 1.35;
  const H = 1.55;
  const D = 1.3;

  // Screen recess (inset panel)
  const screenW = 0.92;
  const screenH = 0.72;
  const screenY = 0.32;
  const screenZ = D / 2 + 0.001;

  // CRT glass size (actual viewable)
  const crtW = 0.74;
  const crtH = 0.56;

  return (
    <group ref={root} position={[0, -0.05, 0]}>
      {/* ---------- MAIN CASE ---------- */}
      <RoundedBox args={[W, H, D]} radius={0.05} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={BEIGE} roughness={0.78} metalness={0.02} />
      </RoundedBox>

      {/* Front bevel — thin darker rim around front face */}
      <mesh position={[0, 0, D / 2 - 0.001]}>
        <planeGeometry args={[W - 0.015, H - 0.015]} />
        <meshStandardMaterial color={BEIGE_MID} roughness={0.85} metalness={0.02} />
      </mesh>

      {/* ---------- SCREEN RECESS ---------- */}
      {/* Recessed darker panel around the CRT */}
      <RoundedBox
        args={[screenW, screenH, 0.06]}
        radius={0.03}
        smoothness={3}
        position={[0, screenY, screenZ - 0.035]}
      >
        <meshStandardMaterial color={RECESS} roughness={0.6} metalness={0.15} />
      </RoundedBox>

      {/* CRT phosphor (shader) */}
      <group
        position={[0, screenY, screenZ + 0.001]}
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
        <CRTScreen width={crtW} height={crtH} />
        {/* Tinted glass in front for depth */}
        <mesh position={[0, 0, 0.003]}>
          <planeGeometry args={[crtW, crtH]} />
          <meshPhysicalMaterial
            color="#0a0805"
            transparent
            opacity={0.12}
            transmission={0.25}
            roughness={0.08}
            metalness={0}
            thickness={0.05}
          />
        </mesh>
        {/* Hover pulse rim */}
        <mesh position={[0, 0, 0.006]} visible={hovered}>
          <planeGeometry args={[crtW + 0.02, crtH + 0.02]} />
          <meshBasicMaterial color="#c8ff00" transparent opacity={0.08} />
        </mesh>
      </group>

      {/* ---------- RAINBOW APPLE LOGO ---------- */}
      {/* Small six-stripe logo on the upper-left front */}
      <group position={[-W / 2 + 0.12, H / 2 - 0.12, screenZ + 0.001]}>
        {[
          "#5cb85c", // green
          "#f0d43a", // yellow
          "#f08a1e", // orange
          "#e0362a", // red
          "#9c3a96", // purple
          "#2e9ad0", // blue
        ].map((c, i) => (
          <mesh key={c} position={[0, 0.042 - i * 0.012, 0]}>
            <planeGeometry args={[0.08, 0.012]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.15} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* ---------- "Macintosh" WORDMARK ---------- */}
      <Text
        position={[0, -0.08, screenZ + 0.002]}
        fontSize={0.06}
        letterSpacing={-0.02}
        color="#2a2420"
        anchorX="center"
        anchorY="middle"
      >
        Macintosh
      </Text>

      {/* ---------- FLOPPY DISK SLOT ---------- */}
      {/* Slot itself (dark recess) */}
      <mesh position={[0.05, -0.34, screenZ + 0.001]}>
        <planeGeometry args={[0.52, 0.022]} />
        <meshStandardMaterial color={SLOT} roughness={0.9} />
      </mesh>
      {/* Disk indicator circle (tiny) */}
      <mesh position={[-0.3, -0.34, screenZ + 0.001]}>
        <circleGeometry args={[0.008, 16]} />
        <meshStandardMaterial color="#2a2420" />
      </mesh>

      {/* ---------- POWER LED ---------- */}
      <mesh position={[W / 2 - 0.08, -0.54, screenZ + 0.001]}>
        <circleGeometry args={[0.01, 16]} />
        <meshStandardMaterial
          color="#7fff70"
          emissive="#7fff70"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* ---------- VENT SLITS (top) ---------- */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-0.18 + i * 0.06, H / 2 - 0.025, D / 2 - 0.2]}>
          <boxGeometry args={[0.035, 0.004, 0.22]} />
          <meshStandardMaterial color={RECESS} />
        </mesh>
      ))}

      {/* ---------- HANDLE RECESS (top) ---------- */}
      <mesh position={[0, H / 2 - 0.004, -0.05]}>
        <boxGeometry args={[0.42, 0.01, 0.05]} />
        <meshStandardMaterial color={SLOT} roughness={0.9} />
      </mesh>

      {/* ---------- SIDE DETAIL / SEAM ---------- */}
      <mesh position={[W / 2 + 0.001, 0.1, 0]}>
        <planeGeometry args={[D - 0.1, 0.008]} />
        <meshStandardMaterial color={BEIGE_DARK} />
      </mesh>
      <mesh position={[-W / 2 - 0.001, 0.1, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[D - 0.1, 0.008]} />
        <meshStandardMaterial color={BEIGE_DARK} />
      </mesh>

      {/* ---------- BASE / FOOT ---------- */}
      <mesh position={[0, -H / 2 - 0.04, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[W - 0.12, 0.08, D - 0.12]} />
        <meshStandardMaterial color={BEIGE_DARK} roughness={0.82} metalness={0.02} />
      </mesh>

      {/* ---------- KEYBOARD (in front, offset left) ---------- */}
      <group position={[-0.28, -H / 2 - 0.05, D / 2 + 0.55]} rotation={[0, 0.05, 0]}>
        <RoundedBox args={[1.1, 0.08, 0.38]} radius={0.015} smoothness={2} castShadow receiveShadow>
          <meshStandardMaterial color={BEIGE} roughness={0.8} />
        </RoundedBox>
        {/* key grid */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 12 }).map((__, col) => (
            <mesh
              key={`${row}-${col}`}
              position={[-0.46 + col * 0.084, 0.045, -0.12 + row * 0.075]}
            >
              <boxGeometry args={[0.072, 0.014, 0.064]} />
              <meshStandardMaterial color={BEIGE_MID} roughness={0.75} />
            </mesh>
          ))
        )}
      </group>

      {/* ---------- MOUSE (to the right of keyboard) ---------- */}
      <group position={[0.7, -H / 2 - 0.05, D / 2 + 0.6]} rotation={[0, -0.25, 0]}>
        <RoundedBox args={[0.22, 0.07, 0.3]} radius={0.03} smoothness={3} castShadow receiveShadow>
          <meshStandardMaterial color={BEIGE} roughness={0.8} />
        </RoundedBox>
        {/* single button split line */}
        <mesh position={[0, 0.036, -0.08]}>
          <boxGeometry args={[0.18, 0.002, 0.005]} />
          <meshStandardMaterial color={BEIGE_DARK} />
        </mesh>
        {/* cable — short curved tube */}
        <mesh position={[-0.08, 0.02, 0.16]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />
          <meshStandardMaterial color={BEIGE_MID} roughness={0.9} />
        </mesh>
      </group>

      {/* ---------- BACK subtle darken (for depth) ---------- */}
      <mesh position={[0, 0, -D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W - 0.02, H - 0.02]} />
        <meshStandardMaterial color={BEIGE_DARK} roughness={0.9} />
      </mesh>
    </group>
  );
}
