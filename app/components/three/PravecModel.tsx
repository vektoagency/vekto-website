"use client";

import { useRef, type ReactElement } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox, Text } from "@react-three/drei";
import CRTScreen from "./CRTScreen";

// Accurate aged Bulgarian-beige plastic palette
const CASE_TOP = "#d9cfb4";
const CASE_FRONT = "#cec3a4";
const CASE_SIDE = "#b8ad8e";
const BEZEL = "#1a1714";
const BEZEL_INNER = "#080604";
const KEY_BODY = "#5e554a";
const KEY_TOP = "#ebe3cf";
const KEY_LABEL = "#2a241d";
const LABEL_DARK = "#34281a";
const LABEL_RED = "#8c2118";

type Props = {
  onScreenClick?: () => void;
  hovered?: boolean;
  onHoverChange?: (h: boolean) => void;
};

/* ---------- Keyboard ---------- */
function Keycap({ position, size = [0.11, 0.055, 0.11] as [number, number, number], label }: {
  position: [number, number, number];
  size?: [number, number, number];
  label?: string;
}) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      {/* Base / skirt — darker plastic */}
      <RoundedBox args={[w, h * 0.55, d]} radius={0.008} smoothness={2} position={[0, -h * 0.22, 0]}>
        <meshStandardMaterial color={KEY_BODY} roughness={0.65} />
      </RoundedBox>
      {/* Top cap — cream with slight sculpt */}
      <RoundedBox args={[w * 0.88, h * 0.55, d * 0.88]} radius={0.015} smoothness={3} position={[0, h * 0.12, 0]}>
        <meshStandardMaterial color={KEY_TOP} roughness={0.55} />
      </RoundedBox>
      {label && (
        <Text
          position={[0, h * 0.41, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.028}
          color={KEY_LABEL}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

function Keyboard() {
  const keyW = 0.11;
  const keyD = 0.11;
  const keyGap = 0.017;
  // Row offsets (shift characteristic of staggered keyboard)
  const rowConfig = [
    { count: 13, offset: 0, labels: ["ESC", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="] },
    { count: 13, offset: keyW * 0.45, labels: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "RET"] },
    { count: 12, offset: keyW * 0.75, labels: ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "SHF"] },
    { count: 11, offset: keyW * 1.0, labels: ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "CTL"] },
  ];

  const y = 0.035;
  const z0 = 0.22;

  const items: ReactElement[] = [];
  rowConfig.forEach((row, rIdx) => {
    const total = row.count * keyW + (row.count - 1) * keyGap;
    for (let c = 0; c < row.count; c++) {
      const x = -total / 2 + row.offset + c * (keyW + keyGap) + keyW / 2;
      const z = z0 - rIdx * (keyD + keyGap);
      items.push(
        <Keycap
          key={`${rIdx}-${c}`}
          position={[x, y, z]}
          label={row.labels[c]}
        />
      );
    }
  });

  // Space bar — extra wide
  items.push(
    <Keycap
      key="space"
      position={[0, y, z0 - 4 * (keyD + keyGap)]}
      size={[1.1, 0.055, 0.1]}
    />
  );

  return <group>{items}</group>;
}

/* ---------- Base unit (computer + keyboard) ---------- */
function Base() {
  const baseW = 3.2;
  const baseH = 0.35;
  const baseD = 1.9;

  return (
    <group position={[0, -1.0, 0.3]}>
      {/* Main chassis (top face is the keyboard area, slightly sloped) */}
      <RoundedBox args={[baseW, baseH, baseD]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color={CASE_TOP} roughness={0.7} metalness={0.02} />
      </RoundedBox>

      {/* Front lip (darker strip) */}
      <mesh position={[0, baseH * 0.1, baseD / 2 - 0.005]}>
        <boxGeometry args={[baseW - 0.08, 0.05, 0.003]} />
        <meshStandardMaterial color={CASE_FRONT} roughness={0.6} />
      </mesh>

      {/* Inset keyboard well (darker) */}
      <RoundedBox
        args={[baseW - 0.45, 0.018, baseD - 0.6]}
        radius={0.02}
        smoothness={3}
        position={[0.08, baseH / 2 - 0.005, -0.05]}
      >
        <meshStandardMaterial color="#20190f" roughness={0.55} />
      </RoundedBox>

      {/* Keys */}
      <group position={[0.08, baseH / 2, -0.05]}>
        <Keyboard />
      </group>

      {/* Right-side floppy drives (two stacked) */}
      <group position={[baseW / 2 - 0.18, 0, -0.2]}>
        {/* Drive bezel block */}
        <RoundedBox args={[0.3, baseH, 1.0]} radius={0.02} smoothness={3}>
          <meshStandardMaterial color={CASE_FRONT} roughness={0.65} />
        </RoundedBox>
        {/* Slot 1 */}
        <mesh position={[0, 0.06, 0.505]}>
          <boxGeometry args={[0.26, 0.04, 0.01]} />
          <meshStandardMaterial color={BEZEL_INNER} roughness={0.3} />
        </mesh>
        {/* Slot 2 */}
        <mesh position={[0, -0.06, 0.505]}>
          <boxGeometry args={[0.26, 0.04, 0.01]} />
          <meshStandardMaterial color={BEZEL_INNER} roughness={0.3} />
        </mesh>
        {/* LEDs */}
        <mesh position={[0.08, 0.115, 0.505]}>
          <sphereGeometry args={[0.008, 12, 12]} />
          <meshStandardMaterial color="#ff2a0a" emissive="#ff2a0a" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
        <mesh position={[0.08, -0.005, 0.505]}>
          <sphereGeometry args={[0.008, 12, 12]} />
          <meshStandardMaterial color="#ff2a0a" emissive="#ff2a0a" emissiveIntensity={0.4} toneMapped={false} />
        </mesh>
      </group>

      {/* Power indicator — front left */}
      <group position={[-baseW / 2 + 0.25, baseH / 2 - 0.01, baseD / 2 - 0.2]}>
        <mesh>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color="#39e661" emissive="#39e661" emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
        <Text
          position={[0.07, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.035}
          color={LABEL_DARK}
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.15}
        >
          POWER
        </Text>
      </group>

      {/* PRAVEC brand plate on top-front-left of base */}
      <Text
        position={[-baseW / 2 + 0.6, baseH / 2 + 0.002, baseD / 2 - 0.18]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.07}
        color={LABEL_RED}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.25}
        maxWidth={2}
      >
        PRAVEC 8A
      </Text>
      <Text
        position={[-baseW / 2 + 0.6, baseH / 2 + 0.002, baseD / 2 - 0.09]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.03}
        color={LABEL_DARK}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.2}
      >
        MICROCOMPUTER
      </Text>

      {/* Subtle panel seams along the sides */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (baseW / 2 - 0.02), 0, 0]}>
          <boxGeometry args={[0.003, baseH * 0.7, baseD - 0.2]} />
          <meshStandardMaterial color={CASE_SIDE} roughness={0.7} />
        </mesh>
      ))}

      {/* Tiny feet */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * (baseW / 2 - 0.18), -baseH / 2 - 0.015, sz * (baseD / 2 - 0.18)]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
          <meshStandardMaterial color="#141110" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Monitor ---------- */
function Monitor({ onScreenClick, hovered, onHoverChange }: Props) {
  const w = 1.9;
  const h = 1.7;
  const d = 1.6;

  return (
    <group position={[0, 0.3, -0.25]}>
      {/* Main front case */}
      <RoundedBox args={[w, h, d * 0.6]} radius={0.08} smoothness={4} position={[0, 0, 0.15]}>
        <meshStandardMaterial color={CASE_TOP} roughness={0.72} metalness={0.02} />
      </RoundedBox>

      {/* Back CRT tube housing (tapers smaller going back) */}
      <RoundedBox args={[w * 0.7, h * 0.72, d * 0.55]} radius={0.06} smoothness={3} position={[0, -0.02, -0.15]}>
        <meshStandardMaterial color={CASE_SIDE} roughness={0.75} />
      </RoundedBox>
      <RoundedBox args={[w * 0.4, h * 0.4, 0.25]} radius={0.04} smoothness={3} position={[0, -0.03, -0.52]}>
        <meshStandardMaterial color={CASE_SIDE} roughness={0.78} />
      </RoundedBox>

      {/* Top ventilation slots (deep grille) */}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i} position={[0, h / 2 + 0.002, -0.32 + i * 0.06]}>
          <boxGeometry args={[w * 0.55, 0.004, 0.022]} />
          <meshStandardMaterial color={BEZEL} roughness={0.5} />
        </mesh>
      ))}

      {/* Cyrillic brand on top */}
      <Text
        position={[0, h / 2 + 0.003, 0.38]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.078}
        color={LABEL_RED}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.35}
      >
        PRAVEC · 8A
      </Text>

      {/* Front screen bezel — large recessed black panel */}
      <group position={[0, 0.1, d * 0.3 + 0.04]}>
        <RoundedBox args={[w * 0.86, h * 0.78, 0.06]} radius={0.04} smoothness={3}>
          <meshStandardMaterial color={BEZEL} roughness={0.35} metalness={0.1} />
        </RoundedBox>

        {/* Inner deeper recess */}
        <mesh position={[0, 0, 0.032]}>
          <boxGeometry args={[w * 0.76, h * 0.66, 0.002]} />
          <meshStandardMaterial color={BEZEL_INNER} roughness={0.2} />
        </mesh>

        {/* CRT glass plane — holds the shader */}
        <group
          position={[0, 0, 0.035]}
          onClick={(e) => { e.stopPropagation(); onScreenClick?.(); }}
          onPointerOver={(e) => { e.stopPropagation(); onHoverChange?.(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={(e) => { e.stopPropagation(); onHoverChange?.(false); document.body.style.cursor = "auto"; }}
        >
          <CRTScreen width={w * 0.74} height={h * 0.64} />
        </group>

        {/* Glass reflection highlight (subtle) */}
        <mesh position={[-w * 0.25, h * 0.22, 0.037]} rotation={[0, 0, -0.3]}>
          <planeGeometry args={[w * 0.18, h * 0.08]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.025} />
        </mesh>

        {hovered && (
          <pointLight position={[0, 0, 0.3]} color="#c8ff00" intensity={4} distance={3.5} />
        )}
      </group>

      {/* Bottom bezel — brand plate + knobs */}
      <group position={[0, -h / 2 + 0.1, d * 0.3 + 0.055]}>
        {/* Left: brand text */}
        <Text
          position={[-w / 2 + 0.18, 0.015, 0]}
          fontSize={0.055}
          color={LABEL_RED}
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.3}
        >
          PRAVEC
        </Text>
        <Text
          position={[-w / 2 + 0.18, -0.04, 0]}
          fontSize={0.025}
          color={LABEL_DARK}
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.15}
        >
          MODEL 8A
        </Text>

        {/* Right: knobs */}
        {[-0.1, 0.12].map((ox, i) => (
          <group key={i} position={[w / 2 - 0.22 + ox, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.035, 32]} />
              <meshStandardMaterial color="#2a231c" roughness={0.5} metalness={0.2} />
            </mesh>
            {/* Pointer notch */}
            <mesh position={[0.018, 0, 0.02]}>
              <boxGeometry args={[0.003, 0.02, 0.01]} />
              <meshStandardMaterial color="#e8dfca" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Side panel seams */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (w / 2 - 0.005), -0.1, 0.1]}>
          <boxGeometry args={[0.004, h * 0.75, d * 0.55]} />
          <meshStandardMaterial color={CASE_SIDE} roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Cable from base to monitor ---------- */
function Cable() {
  // Simple bezier tube going from base back-right to monitor back-left
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.8, -0.6, -0.3),
    new THREE.Vector3(0.6, -0.4, -0.6),
    new THREE.Vector3(0.2, -0.1, -0.7),
    new THREE.Vector3(-0.2, 0.05, -0.65),
  ]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 32, 0.028, 12, false]} />
      <meshStandardMaterial color="#141110" roughness={0.65} metalness={0.05} />
    </mesh>
  );
}

export default function PravecModel({ onScreenClick, hovered, onHoverChange }: Props) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 0.4) * 0.025;
    const mx = state.pointer.x;
    const my = state.pointer.y;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mx * 0.22, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -my * 0.1, 0.04);
  });

  return (
    <group ref={group}>
      <Base />
      <Monitor onScreenClick={onScreenClick} hovered={hovered} onHoverChange={onHoverChange} />
      <Cable />
    </group>
  );
}
