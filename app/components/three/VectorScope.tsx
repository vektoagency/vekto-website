"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Full-screen phosphor vectorscope. A Lissajous beam morphs over time,
 * mouse warps the trace, radar sweep + grid evoke old oscilloscopes.
 */
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uRes;
  uniform float uHover;

  // Signed distance to a line segment
  float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  float phosphorLine(float d, float thickness) {
    return exp(-(d * d) / (thickness * thickness));
  }

  // Lissajous point at parameter t
  vec2 liss(float t, float tt) {
    float a = 3.0 + sin(tt * 0.27) * 1.2;
    float b = 2.0 + cos(tt * 0.19) * 0.8;
    float phase = tt * 0.6;
    return vec2(
      sin(a * t + phase) * 0.82,
      sin(b * t + phase * 0.4) * 0.56
    );
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * 2.0;

    float aspect = uRes.x / max(uRes.y, 1.0);
    p.x *= aspect;

    // Barrel distortion (CRT bulge)
    float r2 = dot(p, p);
    p = p * (1.0 + 0.045 * r2);

    // Deep phosphor background
    vec3 col = vec3(0.003, 0.015, 0.003);

    // Faint grid
    vec2 g = abs(fract(p * 3.5) - 0.5);
    float gridLine = smoothstep(0.47, 0.5, max(g.x, g.y));
    col += vec3(0.18, 0.55, 0.06) * gridLine * 0.07;

    // Central crosshair
    float crossH = smoothstep(0.006, 0.0, abs(p.y));
    float crossV = smoothstep(0.006, 0.0, abs(p.x));
    col += vec3(0.5, 0.9, 0.1) * (crossH + crossV) * 0.18;

    // Outer frame circle
    float dFrame = abs(length(p) - 0.95);
    col += vec3(0.35, 0.8, 0.05) * phosphorLine(dFrame, 0.02) * 0.25;

    // Lissajous beam — sample along the curve as many short segments
    float beam = 0.0;
    const int N = 110;
    float tt = uTime;
    vec2 prev = liss(0.0, tt);
    for (int i = 1; i < N; i++) {
      float t = float(i) / float(N) * 6.2831853 * 2.0;
      vec2 cur = liss(t, tt);
      // Mouse warp pulls the trace toward pointer
      vec2 warpP = cur + (uMouse - cur) * 0.12 * exp(-length(cur - uMouse) * 2.2) * (0.6 + uHover * 0.6);
      float d = sdSegment(p, prev, warpP);
      beam += phosphorLine(d, 0.011);
      prev = warpP;
    }
    beam = min(beam, 6.0);

    // Phosphor color + afterglow
    vec3 phos = vec3(0.78, 1.0, 0.0);
    col += phos * beam * 0.38;
    col += phos * 0.04 * smoothstep(0.0, 0.4, beam);

    // Radar sweep
    float angle = atan(p.y, p.x);
    float sweepAngle = mod(uTime * 0.8, 6.2831853) - 3.1415926;
    float dAng = angle - sweepAngle;
    dAng = mod(dAng + 3.1415926, 6.2831853) - 3.1415926;
    float sweep = smoothstep(0.8, 0.0, dAng) * smoothstep(-0.05, 0.0, -dAng);
    float radial = 1.0 - smoothstep(0.9, 1.05, length(p));
    col += phos * sweep * radial * 0.12;

    // Scanlines
    float scan = 0.5 + 0.5 * sin(uv.y * uRes.y * 1.8);
    col *= 0.82 + 0.18 * scan;

    // Subtle noise
    float n = fract(sin(dot(uv + uTime * 0.1, vec2(12.9898, 78.233))) * 43758.5453);
    col += (n - 0.5) * 0.04;

    // Vignette
    float vig = smoothstep(1.8, 0.3, dot(p, p));
    col *= vig;

    // Chromatic ring at the extreme edges
    float edge = smoothstep(0.85, 1.15, length(p));
    col.r += edge * 0.06;
    col.b += edge * 0.02;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane({ hovered }: { hovered: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, pointer } = useThree();
  const mouseTarget = useRef(new THREE.Vector2());
  const hoverTarget = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uHover: { value: 0 },
    }),
    []
  );

  useFrame((_, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += dt;
    mat.current.uniforms.uRes.value.set(size.width, size.height);
    const aspect = size.width / Math.max(size.height, 1);
    mouseTarget.current.lerp(new THREE.Vector2(pointer.x * aspect, pointer.y), 0.08);
    mat.current.uniforms.uMouse.value.copy(mouseTarget.current);
    hoverTarget.current += ((hovered ? 1 : 0) - hoverTarget.current) * 0.12;
    mat.current.uniforms.uHover.value = hoverTarget.current;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function VectorScope() {
  const [hovered, setHovered] = useState(false);

  const onClick = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    window.dispatchEvent(new CustomEvent("vekto:enter-pravec", { detail: { x, y } }));
  };

  return (
    <div
      className="absolute inset-0 cursor-pointer select-none"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }} dpr={[1, 2]} camera={{ position: [0, 0, 1] }}>
        <Plane hovered={hovered} />
      </Canvas>

      {/* HUD overlay */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00]/70">
          VEKTO/SCOPE &nbsp;•&nbsp; CH 1
        </div>
        <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00]/70">
          VECTOR MODE &nbsp;•&nbsp; 60Hz
        </div>
        <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00]/60">
          X: 0.820 &nbsp;&nbsp; Y: 0.560
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c8ff00] align-middle mr-2 animate-pulse" />
          CLICK TO ENGAGE
        </div>
      </div>
    </div>
  );
}

