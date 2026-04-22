"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox, Text } from "@react-three/drei";
import CRTScreen from "./CRTScreen";

// Colors matching aged Bulgarian computer beige plastic
const CASE_COLOR = "#d4c8ad";
const CASE_SIDE_COLOR = "#c1b598";
const BEZEL_COLOR = "#14110e";
const BEZEL_INNER = "#0a0806";
const KEY_COLOR = "#2a2520";
const KEY_TOP = "#3a332c";
const LABEL_COLOR = "#3a2e1f";

type Props = {
  onScreenClick?: () => void;
  hovered?: boolean;
  onHoverChange?: (h: boolean) => void;
};

function Key({ position, size = [0.14, 0.05, 0.14] as [number, number, number] }: { position: [number, number, number]; size?: [number, number, number] }) {
  return (
    <RoundedBox args={size} radius={0.015} smoothness={3} position={position}>
      <meshStandardMaterial color={KEY_TOP} roughness={0.55} metalness={0.02} />
    </RoundedBox>
  );
}

function Keyboard() {
  // 4 rows of keys; stylized Apple-II/Pravec layout
  const rows = [13, 13, 12, 11];
  const keyW = 0.14;
  const keyGap = 0.02;
  const startZ = 0.15;
  const startY = 0.03;

  const keys: { pos: [number, number, number]; size?: [number, number, number] }[] = [];
  rows.forEach((count, rIdx) => {
    const rowOffset = rIdx * 0.01;
    const totalWidth = count * keyW + (count - 1) * keyGap;
    for (let c = 0; c < count; c++) {
      const x = -totalWidth / 2 + c * (keyW + keyGap) + keyW / 2 + rowOffset;
      const z = startZ - rIdx * (0.14 + keyGap);
      keys.push({ pos: [x, startY, z] });
    }
  });

  // Space bar
  keys.push({
    pos: [0, startY, startZ - 4 * (0.14 + keyGap)],
    size: [1.1, 0.05, 0.12],
  });

  return (
    <group>
      {keys.map((k, i) => (
        <Key key={i} position={k.pos} size={k.size} />
      ))}
    </group>
  );
}

function Base() {
  return (
    <group position={[0, -0.78, 0.25]}>
      {/* Main base body */}
      <RoundedBox args={[2.85, 0.28, 1.55]} radius={0.04} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color={CASE_COLOR} roughness={0.7} metalness={0.03} />
      </RoundedBox>

      {/* Front bevel (darker strip) */}
      <mesh position={[0, 0.005, 0.78]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.8, 0.04, 0.01]} />
        <meshStandardMaterial color="#a89c7f" roughness={0.6} />
      </mesh>

      {/* Keyboard area — inset slightly */}
      <mesh position={[0, 0.145, 0]}>
        <boxGeometry args={[2.6, 0.015, 1.3]} />
        <meshStandardMaterial color="#1e1a16" roughness={0.5} />
      </mesh>

      <group position={[0, 0.155, 0]}>
        <Keyboard />
      </group>

      {/* Floppy-style drive slot on right */}
      <mesh position={[1.15, 0.08, 0.78]}>
        <boxGeometry args={[0.4, 0.035, 0.015]} />
        <meshStandardMaterial color="#0a0806" roughness={0.4} />
      </mesh>

      {/* Power LED */}
      <mesh position={[-1.25, 0.14, 0.76]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial color="#4caf50" emissive="#4caf50" emissiveIntensity={2.2} toneMapped={false} />
      </mesh>

      {/* Brand plate */}
      <Text
        position={[-0.95, 0.146, 0.72]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.045}
        color={LABEL_COLOR}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.15}
      >
        PRAVEC 8A
      </Text>
    </group>
  );
}

function Monitor({ onScreenClick, hovered, onHoverChange }: Props) {
  // Monitor dimensions
  const width = 2.0;
  const height = 1.6;
  const depth = 1.7;

  return (
    <group position={[0, 0.35, -0.2]}>
      {/* Main case (tapered CRT housing via two boxes) */}
      <RoundedBox args={[width, height, depth]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={CASE_COLOR} roughness={0.72} metalness={0.03} />
      </RoundedBox>

      {/* Back taper (smaller box behind for CRT illusion) */}
      <RoundedBox args={[width * 0.78, height * 0.78, 0.7]} radius={0.06} smoothness={3} position={[0, -0.02, -depth / 2 - 0.3]}>
        <meshStandardMaterial color={CASE_SIDE_COLOR} roughness={0.75} />
      </RoundedBox>

      {/* Top vent slats */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} position={[0, height / 2 + 0.001, -depth / 2 + 0.25 + i * 0.05]}>
          <boxGeometry args={[width * 0.7, 0.002, 0.015]} />
          <meshStandardMaterial color="#302721" roughness={0.5} />
        </mesh>
      ))}

      {/* Top label */}
      <Text
        position={[0, height / 2 + 0.002, -depth / 2 + 0.12]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.055}
        color={LABEL_COLOR}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        PRAVEC · 8A
      </Text>

      {/* Front bezel (recessed dark panel around screen) */}
      <group position={[0, 0.06, depth / 2 + 0.002]}>
        <RoundedBox args={[width * 0.88, height * 0.78, 0.06]} radius={0.04} smoothness={3}>
          <meshStandardMaterial color={BEZEL_COLOR} roughness={0.35} metalness={0.1} />
        </RoundedBox>

        {/* Inner screen recess (darker) */}
        <mesh position={[0, 0, 0.031]}>
          <boxGeometry args={[width * 0.78, height * 0.66, 0.001]} />
          <meshStandardMaterial color={BEZEL_INNER} roughness={0.2} />
        </mesh>

        {/* Actual CRT screen (shader) — slightly in front so it shows */}
        <group
          position={[0, 0, 0.033]}
          onClick={(e) => { e.stopPropagation(); onScreenClick?.(); }}
          onPointerOver={(e) => { e.stopPropagation(); onHoverChange?.(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={(e) => { e.stopPropagation(); onHoverChange?.(false); document.body.style.cursor = "auto"; }}
        >
          <CRTScreen width={width * 0.76} height={height * 0.64} />
        </group>

        {/* Screen glow halo when hovered */}
        {hovered && (
          <pointLight position={[0, 0, 0.25]} color="#c8ff00" intensity={3.5} distance={3} />
        )}
      </group>

      {/* Bottom bezel controls (knobs) */}
      <group position={[0, -height / 2 + 0.08, depth / 2 + 0.005]}>
        {/* Brightness knob */}
        <mesh position={[width / 2 - 0.18, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 24]} />
          <meshStandardMaterial color="#2a231d" roughness={0.4} metalness={0.4} />
        </mesh>
        {/* Contrast knob */}
        <mesh position={[width / 2 - 0.32, 0, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.018, 20]} />
          <meshStandardMaterial color="#1a1613" roughness={0.5} />
        </mesh>

        {/* Left: VEKTO brand plate (subtle nod) */}
        <Text
          position={[-width / 2 + 0.18, 0, 0.01]}
          fontSize={0.04}
          color={LABEL_COLOR}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
        >
          VEKTO
        </Text>
      </group>

      {/* Side ridges (subtle detail on case sides) */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * width / 2 - s * 0.0, -0.4, 0]}>
          <boxGeometry args={[0.01, 0.4, depth * 0.9]} />
          <meshStandardMaterial color="#b3a688" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export default function PravecModel({ onScreenClick, hovered, onHoverChange }: Props) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle float
    group.current.position.y = Math.sin(t * 0.4) * 0.03;
    // Mouse parallax
    const mx = state.pointer.x;
    const my = state.pointer.y;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mx * 0.25, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -my * 0.12, 0.04);
  });

  return (
    <group ref={group}>
      <Base />
      <Monitor onScreenClick={onScreenClick} hovered={hovered} onHoverChange={onHoverChange} />
    </group>
  );
}
