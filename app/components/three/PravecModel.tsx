"use client";

import { useRef, type ReactElement } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox, Text } from "@react-three/drei";
import CRTScreen from "./CRTScreen";

/* Aged Pravec-beige palette matching the reference photos */
const CASE = "#ddd0b0";        // main cream plastic (warmer, aged)
const CASE_WARM = "#e4d8b8";   // slight top highlight
const CASE_SHADOW = "#b8ac8a"; // shadow side (deeper for contrast)
const CASE_WELL = "#9d9173";   // recessed keyboard well
const SEAM = "#8a7f63";        // panel seams
const SCREEN_TINT = "#2a2820"; // dark phosphor tube behind glass (recessed)
const KEY_BODY = "#c8bc9a";    // key skirts
const KEY_TOP = "#e7dcbe";     // cream key tops
const LABEL_DARK = "#2a2114";
const LABEL_RED = "#9a2218";
const KNOB = "#ada285";

type Props = {
  onScreenClick?: (evt?: { clientX?: number; clientY?: number }) => void;
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
  const kW = 0.095;
  const kD = 0.095;
  const gap = 0.018;
  // 5 rows: function/number row, QWERTY, ASDF, ZXCV (with shifts), space row
  const rowCounts = [15, 14, 13, 12, 10];
  const startY = 0.03;
  const startZ = 0.28;

  const items: ReactElement[] = [];
  rowCounts.forEach((count, r) => {
    const width = count * kW + (count - 1) * gap;
    const offset = r * kW * 0.08; // slight right-shift stagger
    for (let c = 0; c < count; c++) {
      const x = -width / 2 + offset + c * (kW + gap) + kW / 2;
      const z = startZ - r * (kD + gap);
      // Space bar row: wide spacebar in middle, 2 modifiers each side
      if (r === 4) {
        if (c === 0 || c === 1) {
          // Left modifier keys (wider)
          items.push(<Keycap key={`${r}-${c}`} position={[x - kW * 0.1, startY, z]} size={[kW * 1.25, 0.045, kD]} />);
        } else if (c === 4) {
          items.push(<Keycap key={`${r}-${c}-space`} position={[x, startY, z]} size={[kW * 4.2, 0.045, kD]} />);
        } else if (c === 8 || c === 9) {
          items.push(<Keycap key={`${r}-${c}`} position={[x + kW * 0.1, startY, z]} size={[kW * 1.25, 0.045, kD]} />);
        }
      } else if (r === 0 && c === 0) {
        // Escape / RESET key — slightly red-tinted
        items.push(
          <group key={`${r}-${c}-esc`} position={[x, startY, z]}>
            <RoundedBox args={[kW, 0.0225, kD]} radius={0.008} smoothness={2} position={[0, -0.01125, 0]}>
              <meshStandardMaterial color={KEY_BODY} roughness={0.7} />
            </RoundedBox>
            <RoundedBox args={[kW * 0.9, 0.0225, kD * 0.9]} radius={0.012} smoothness={3} position={[0, 0.0045, 0]}>
              <meshStandardMaterial color="#c78a72" roughness={0.55} />
            </RoundedBox>
          </group>
        );
      } else if (r === 3 && c === 11) {
        // Return/Enter — wider, set apart
        items.push(<Keycap key={`${r}-${c}-ret`} position={[x + kW * 0.2, startY, z]} size={[kW * 1.35, 0.045, kD]} />);
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
  const Dback = 0.38; // thickness at back
  const Dfront = 0.14; // thickness at front
  const DP = 2.0;  // depth (front-to-back)

  return (
    <group position={[0, -0.92, 0.3]}>
      {/* Main wedge body — back slab (thicker) */}
      <RoundedBox args={[W, Dback, DP * 0.55]} radius={0.055} smoothness={3} position={[0, 0, -DP / 2 + (DP * 0.55) / 2]}>
        <meshStandardMaterial color={CASE} roughness={0.78} metalness={0.02} />
      </RoundedBox>

      {/* Front (thinner) section */}
      <RoundedBox args={[W, Dfront, DP * 0.5]} radius={0.045} smoothness={3} position={[0, -Dback / 2 + Dfront / 2, DP / 2 - (DP * 0.5) / 2]}>
        <meshStandardMaterial color={CASE} roughness={0.78} metalness={0.02} />
      </RoundedBox>

      {/* Sloped transition wedge connecting back → front */}
      {(() => {
        const sX = W;
        const sZ = DP * 0.35;
        const slopeAngle = Math.atan2((Dback - Dfront), sZ);
        return (
          <mesh position={[0, -0.02, 0.04]} rotation={[slopeAngle, 0, 0]}>
            <boxGeometry args={[sX - 0.005, 0.035, sZ]} />
            <meshStandardMaterial color={CASE_WARM} roughness={0.72} />
          </mesh>
        );
      })()}

      {/* Recessed keyboard well — darker inset so keys sit INSIDE the case */}
      <mesh position={[-0.25, Dback / 2 - 0.018, 0.05]}>
        <boxGeometry args={[W * 0.77, 0.04, DP * 0.62]} />
        <meshStandardMaterial color={CASE_WELL} roughness={0.82} />
      </mesh>

      {/* Keys on top of well */}
      <group position={[-0.25, Dback / 2 + 0.002, 0.05]}>
        <Keyboard />
      </group>

      {/* Right-side disk drive slot + bezel */}
      <group position={[W / 2 - 0.38, Dback / 2 - 0.015, 0.1]}>
        {/* Drive bezel plate (darker cream) */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.55, 0.035, 0.7]} />
          <meshStandardMaterial color={CASE_SHADOW} roughness={0.75} />
        </mesh>
        {/* Slot opening */}
        <mesh position={[0, 0.034, 0.05]}>
          <boxGeometry args={[0.45, 0.005, 0.03]} />
          <meshStandardMaterial color="#15110a" roughness={0.7} />
        </mesh>
        {/* Drive activity LED */}
        <mesh position={[0.17, 0.034, -0.18]}>
          <sphereGeometry args={[0.012, 10, 10]} />
          <meshStandardMaterial color="#ff3a1a" emissive="#ff3a1a" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
        {/* Drive handle/lever */}
        <mesh position={[-0.17, 0.034, 0.05]}>
          <boxGeometry args={[0.06, 0.008, 0.04]} />
          <meshStandardMaterial color={KNOB} roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* Back-top badge area — sloped strip behind keyboard with branding */}
      <mesh position={[0, Dback / 2 + 0.002, -DP / 2 + 0.18]}>
        <boxGeometry args={[W - 0.08, 0.008, 0.22]} />
        <meshStandardMaterial color={CASE_WARM} roughness={0.65} />
      </mesh>

      {/* Red "ПРАВЕЦ 8А" logo block — left side of back strip */}
      <Text
        position={[-W / 2 + 0.42, Dback / 2 + 0.009, -DP / 2 + 0.18]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.08}
        color={LABEL_RED}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.1}
        outlineWidth={0.002}
        outlineColor={LABEL_RED}
      >
        ПРАВЕЦ 8А
      </Text>

      {/* Small tech label under logo */}
      <Text
        position={[-W / 2 + 0.42, Dback / 2 + 0.009, -DP / 2 + 0.28]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.028}
        color={LABEL_DARK}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.2}
      >
        PERSONAL COMPUTER
      </Text>

      {/* Side panel seams */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (W / 2 - 0.003), -0.05, -0.1]}>
          <boxGeometry args={[0.003, Dback * 0.7, DP * 0.9]} />
          <meshStandardMaterial color={SEAM} roughness={0.75} />
        </mesh>
      ))}

      {/* Front lip seam */}
      <mesh position={[0, -Dback / 2 + Dfront + 0.003, DP / 2 - 0.004]}>
        <boxGeometry args={[W - 0.08, 0.002, 0.003]} />
        <meshStandardMaterial color={SEAM} roughness={0.7} />
      </mesh>

      {/* Rubber feet */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * (W / 2 - 0.2), -Dback / 2 - 0.012, sz * (DP / 2 - 0.22)]}>
          <cylinderGeometry args={[0.038, 0.038, 0.022, 16]} />
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
    <group position={[-0.05, 0.08, -0.4]}>
      {/* Pedestal — small beige plinth on which the monitor sits */}
      <group position={[0, -H / 2 - 0.09, 0]}>
        {/* Wide base plate */}
        <RoundedBox args={[W * 0.75, 0.05, D_front * 0.6]} radius={0.02} smoothness={3}>
          <meshStandardMaterial color={CASE_SHADOW} roughness={0.78} />
        </RoundedBox>
        {/* Narrower riser */}
        <RoundedBox args={[W * 0.5, 0.13, D_front * 0.4]} radius={0.025} smoothness={3} position={[0, 0.09, 0]}>
          <meshStandardMaterial color={CASE} roughness={0.72} />
        </RoundedBox>
      </group>

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
          onClick={(e) => { e.stopPropagation(); onScreenClick?.({ clientX: e.clientX, clientY: e.clientY }); }}
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
    const mx = state.pointer.x;
    const my = state.pointer.y;
    // Grounded stance — no float. Just gentle mouse parallax rotation.
    // Smooth, eased lerp (0.035) for a calm, considered feel.
    const targetRy = mx * 0.18;
    const targetRx = -my * 0.07;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRy, 0.035);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRx, 0.035);
    // Tiny positional parallax (much smaller than rotation — reads as "weight")
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, mx * 0.04, 0.04);
  });

  return (
    <group ref={group} scale={0.82} position={[0, 0.15, 0]}>
      <Base />
      <Monitor onScreenClick={onScreenClick} hovered={hovered} onHoverChange={onHoverChange} />
    </group>
  );
}
