"use client";

import { useRef, type ReactElement } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox, Text } from "@react-three/drei";
import CRTScreen from "./CRTScreen";

/* Aged Pravec-beige palette matching the reference photos */
const CASE = "#e7ddc1";        // main cream plastic
const CASE_WARM = "#e2d7b7";   // slight top highlight
const CASE_SHADOW = "#c9be9c"; // shadow side
const SEAM = "#b3a682";        // panel seams
const SCREEN_TINT = "#34312a"; // dark phosphor tube behind glass (recessed)
const KEY_BODY = "#d3c8a8";    // key skirts
const KEY_TOP = "#ece3c8";     // cream key tops
const KEY_LABEL = "#2a241d";
const LABEL_DARK = "#3a2f1e";
const LABEL_RED = "#8a1f16";
const KNOB = "#b5aa8c";

type Props = {
  onScreenClick?: () => void;
  hovered?: boolean;
  onHoverChange?: (h: boolean) => void;
};

/* ------------------------- Keyboard ------------------------- */
function Keycap({
  position,
  size = [0.1, 0.045, 0.1],
}: {
  position: [number, number, number];
  size?: [number, number, number];
}) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      {/* Darker skirt */}
      <RoundedBox args={[w, h * 0.5, d]} radius={0.008} smoothness={2} position={[0, -h * 0.25, 0]}>
        <meshStandardMaterial color={KEY_BODY} roughness={0.7} />
      </RoundedBox>
      {/* Flat cream top */}
      <RoundedBox args={[w * 0.9, h * 0.5, d * 0.9]} radius={0.012} smoothness={3} position={[0, h * 0.1, 0]}>
        <meshStandardMaterial color={KEY_TOP} roughness={0.55} />
      </RoundedBox>
    </group>
  );
}

function Keyboard() {
  const kW = 0.1;
  const kD = 0.1;
  const gap = 0.016;
  // 5 rows matching the photo (numbers, QWERTY, ASDF, ZXCV, space/modifiers)
  const rowCounts = [14, 14, 13, 12, 9];
  const startY = 0.03;
  const startZ = 0.26;

  const items: ReactElement[] = [];
  rowCounts.forEach((count, r) => {
    const width = count * kW + (count - 1) * gap;
    const offset = r * kW * 0.12; // slight right-shift stagger
    for (let c = 0; c < count; c++) {
      const x = -width / 2 + offset + c * (kW + gap) + kW / 2;
      const z = startZ - r * (kD + gap);
      // Bottom row center = space bar (wider)
      if (r === 4 && c === 4) {
        items.push(
          <Keycap key={`${r}-${c}-space`} position={[x, startY, z]} size={[kW * 4, 0.045, kD]} />
        );
      } else if (r === 4 && c > 4) {
        continue;
      } else {
        items.push(<Keycap key={`${r}-${c}`} position={[x, startY, z]} />);
      }
    }
  });
  return <group>{items}</group>;
}

/* ------------------------- Base (computer + keyboard) ------------------------- */
/**
 * Wedge-shaped base: thicker at back, slopes down toward the front edge.
 * Keyboard sits directly on the top face (no dark inset).
 */
function Base() {
  const W = 3.6;   // base width
  const Dback = 0.34; // thickness at back
  const Dfront = 0.11; // thickness at front
  const DP = 1.9;  // depth (front-to-back)

  // Build the wedge via an extruded shape in X-Z with Y as height variation.
  // We'll approximate with two stacked RoundedBoxes + a sloped top plane.
  // Simpler: a RoundedBox for the base (uniform height = avg), then a sloped top cap.

  return (
    <group position={[0, -0.92, 0.3]}>
      {/* Front (thinner) section */}
      <RoundedBox args={[W, Dfront, DP * 0.45]} radius={0.04} smoothness={3} position={[0, -Dback / 2 + Dfront / 2, DP / 2 - (DP * 0.45) / 2]}>
        <meshStandardMaterial color={CASE} roughness={0.72} metalness={0.02} />
      </RoundedBox>

      {/* Back (thicker) section */}
      <RoundedBox args={[W, Dback, DP * 0.6]} radius={0.05} smoothness={3} position={[0, 0, -DP / 2 + (DP * 0.6) / 2]}>
        <meshStandardMaterial color={CASE} roughness={0.72} metalness={0.02} />
      </RoundedBox>

      {/* Sloped transition (top face wedge from back → front) */}
      {(() => {
        const sX = W - 0.02;
        const sZ = DP * 0.5;
        // Top sloped slab using a Box rotated slightly
        const slopeAngle = Math.atan2((Dback - Dfront) / 2, sZ);
        return (
          <mesh position={[0, (Dfront / 2 + Dback / 2 - Dback / 2) / 2 + 0.02, 0.03]} rotation={[slopeAngle, 0, 0]}>
            <boxGeometry args={[sX, 0.03, sZ]} />
            <meshStandardMaterial color={CASE_WARM} roughness={0.68} />
          </mesh>
        );
      })()}

      {/* Keyboard keys directly on base (wedged onto the top center area) */}
      <group position={[0, Dback / 2 + 0.01, 0.05]}>
        <Keyboard />
      </group>

      {/* Small "8A" red label on top-right of base */}
      <RoundedBox args={[0.22, 0.005, 0.13]} radius={0.01} smoothness={2} position={[W / 2 - 0.22, Dback / 2 + 0.005, -DP / 2 + 0.24]}>
        <meshStandardMaterial color="#f0e8cf" roughness={0.5} />
      </RoundedBox>
      <Text
        position={[W / 2 - 0.22, Dback / 2 + 0.009, -DP / 2 + 0.24]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.07}
        color={LABEL_RED}
        anchorX="center"
        anchorY="middle"
      >
        8A
      </Text>

      {/* Top-left small brand plate — "Правец" */}
      <Text
        position={[-W / 2 + 0.35, Dback / 2 + 0.005, -DP / 2 + 0.24]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.04}
        color={LABEL_DARK}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.25}
      >
        PRAVEC
      </Text>

      {/* Side panel seams */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (W / 2 - 0.003), -0.05, -0.1]}>
          <boxGeometry args={[0.003, Dback * 0.65, DP * 0.88]} />
          <meshStandardMaterial color={SEAM} roughness={0.75} />
        </mesh>
      ))}

      {/* Front lip seam */}
      <mesh position={[0, -Dback / 2 + Dfront + 0.003, DP / 2 - 0.004]}>
        <boxGeometry args={[W - 0.08, 0.002, 0.003]} />
        <meshStandardMaterial color={SEAM} roughness={0.7} />
      </mesh>

      {/* Tiny rubber feet */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * (W / 2 - 0.2), -Dback / 2 - 0.012, sz * (DP / 2 - 0.18)]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
          <meshStandardMaterial color="#1a1713" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------- Monitor ------------------------- */
/**
 * Characteristic proportions: slightly taller than wide, BOXY with a
 * distinctive raised "hump" on the back-top where the CRT neck tapers in.
 * Front bezel is SAME cream plastic (not black).
 */
function Monitor({ onScreenClick, hovered, onHoverChange }: Props) {
  const W = 1.55;        // width
  const H = 1.45;        // height (front face)
  const D_front = 0.9;   // depth of main boxy front section
  const D_hump = 0.75;   // additional back-taper hump

  return (
    <group position={[-0.05, -0.05, -0.35]}>
      {/* Main front cube (the boxy part with the screen) */}
      <RoundedBox args={[W, H, D_front]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={CASE} roughness={0.72} metalness={0.02} />
      </RoundedBox>

      {/* Raised back "hump" — taller in the middle where CRT neck starts,
          sits only on TOP-BACK half, shorter than main box */}
      <RoundedBox
        args={[W * 0.72, H * 0.78, D_hump]}
        radius={0.06}
        smoothness={4}
        position={[0, H * 0.04, -(D_front / 2 + D_hump / 2 - 0.02)]}
      >
        <meshStandardMaterial color={CASE_SHADOW} roughness={0.75} />
      </RoundedBox>

      {/* Narrow CRT neck further back */}
      <RoundedBox
        args={[W * 0.36, H * 0.42, 0.35]}
        radius={0.04}
        smoothness={3}
        position={[0, H * 0.02, -(D_front / 2 + D_hump + 0.13)]}
      >
        <meshStandardMaterial color={CASE_SHADOW} roughness={0.78} />
      </RoundedBox>

      {/* Top vent grille — DEEP slats cut into top of hump */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} position={[0, H * 0.04 + H * 0.39 + 0.002, -D_front / 2 - 0.05 - i * 0.035]}>
          <boxGeometry args={[W * 0.55, 0.003, 0.012]} />
          <meshStandardMaterial color="#15120e" roughness={0.6} />
        </mesh>
      ))}

      {/* -- FRONT FACE elements -- */}
      {/* The recessed screen inset — same cream color, just slightly darker from shadow */}
      <group position={[-0.12, 0.08, D_front / 2 + 0.001]}>
        {/* Inset frame (darker cream, slight recess) */}
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[W * 0.72, H * 0.7]} />
          <meshStandardMaterial color={CASE_SHADOW} roughness={0.7} />
        </mesh>
        {/* Deeper inset (screen recess) */}
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[W * 0.64, H * 0.58]} />
          <meshStandardMaterial color={SCREEN_TINT} roughness={0.4} />
        </mesh>

        {/* Curved CRT glass with phosphor shader — slightly bulged forward */}
        <group
          position={[0, 0, 0.025]}
          onClick={(e) => { e.stopPropagation(); onScreenClick?.(); }}
          onPointerOver={(e) => { e.stopPropagation(); onHoverChange?.(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={(e) => { e.stopPropagation(); onHoverChange?.(false); document.body.style.cursor = "auto"; }}
        >
          {/* Flat tinted-glass plate in front of the phosphor */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[W * 0.62, H * 0.56]} />
            <meshPhysicalMaterial
              color="#0a120a"
              roughness={0.2}
              transmission={0.15}
              transparent
              opacity={0.55}
              clearcoat={0.9}
              clearcoatRoughness={0.08}
              metalness={0.05}
              envMapIntensity={1.1}
            />
          </mesh>
          {/* Phosphor shader plane inside */}
          <CRTScreen width={W * 0.6} height={H * 0.54} position={[0, 0, -0.005]} />
        </group>

        {hovered && (
          <pointLight position={[0, 0, 0.3]} color="#c8ff00" intensity={4} distance={3.5} />
        )}
      </group>

      {/* -- Right-side control strip (knobs + LED) -- */}
      <group position={[W / 2 - 0.12, 0.12, D_front / 2 + 0.002]}>
        {/* Brightness knob (larger) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.02, 32]} />
          <meshStandardMaterial color={KNOB} roughness={0.5} metalness={0.15} />
        </mesh>
        {/* Contrast knob (smaller) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 32]} />
          <meshStandardMaterial color={KNOB} roughness={0.5} metalness={0.15} />
        </mesh>
        {/* Power LED */}
        <mesh position={[0, -0.08, 0]}>
          <sphereGeometry args={[0.013, 12, 12]} />
          <meshStandardMaterial color="#39e661" emissive="#39e661" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* Small power button */}
        <mesh position={[0, -0.18, 0]}>
          <boxGeometry args={[0.05, 0.025, 0.012]} />
          <meshStandardMaterial color={CASE_SHADOW} roughness={0.7} />
        </mesh>
      </group>

      {/* Bottom-right tiny model label */}
      <Text
        position={[W / 2 - 0.2, -H / 2 + 0.08, D_front / 2 + 0.003]}
        fontSize={0.028}
        color={LABEL_DARK}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        PRAVEC 8A
      </Text>

      {/* Side panel seams */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (W / 2 - 0.003), 0, 0]}>
          <boxGeometry args={[0.003, H * 0.75, D_front * 0.92]} />
          <meshStandardMaterial color={SEAM} roughness={0.75} />
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
    group.current.position.y = Math.sin(t * 0.4) * 0.025;
    const mx = state.pointer.x;
    const my = state.pointer.y;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mx * 0.22, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -my * 0.1, 0.04);
  });

  return (
    <group ref={group} scale={0.82} position={[0, 0.15, 0]}>
      <Base />
      <Monitor onScreenClick={onScreenClick} hovered={hovered} onHoverChange={onHoverChange} />
    </group>
  );
}
