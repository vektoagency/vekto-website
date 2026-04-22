"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  width: number;
  height: number;
  position?: [number, number, number];
  content?: "boot" | "portfolio";
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uPhosphor;

  // simple 2D noise
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // Barrel distort UVs slightly (CRT curvature)
    vec2 uv = vUv * 2.0 - 1.0;
    vec2 offset = uv.yx * uv.yx;
    uv += uv * offset * 0.08;
    uv = uv * 0.5 + 0.5;

    // If outside after distortion, darken (screen edge)
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    // Grid / terminal text rows
    float rows = floor(uv.y * 22.0);
    float rowT = fract(uv.y * 22.0);

    // Fake characters: columns of variable brightness per row, animated reveal
    float col = floor(uv.x * 50.0);
    float appear = step(col, uTime * 12.0 - rows * 2.0);
    float charNoise = hash(vec2(col, rows));
    float charOn = step(0.35, charNoise) * appear;

    // Character shape (dot in row)
    float yShape = smoothstep(0.15, 0.5, rowT) * (1.0 - smoothstep(0.5, 0.85, rowT));
    float xShape = 1.0 - abs(fract(uv.x * 50.0) - 0.5) * 2.0;
    xShape = smoothstep(0.15, 0.85, xShape);

    float text = charOn * yShape * xShape;

    // Header block: bright top line
    float header = smoothstep(0.92, 0.98, uv.y) * 0.9;
    // Big prompt cursor blink
    float cursorRow = step(0.06, uv.y) * step(uv.y, 0.10);
    float cursorCol = step(0.05, uv.x) * step(uv.x, 0.07);
    float cursorBlink = step(0.5, fract(uTime * 1.2));
    float cursor = cursorRow * cursorCol * cursorBlink;

    // Scanlines
    float scan = 0.85 + 0.15 * sin(vUv.y * 720.0);

    // Flicker + slight noise
    float flicker = 0.95 + 0.05 * noise(vec2(uTime * 4.0, 0.0));

    // Vignette
    vec2 cv = vUv - 0.5;
    float vign = 1.0 - dot(cv, cv) * 1.1;
    vign = clamp(vign, 0.0, 1.0);

    float brightness = (text * 1.4 + header + cursor * 1.8) * scan * flicker * vign;
    brightness *= uIntensity;

    vec3 color = uPhosphor * brightness;
    // Slight ambient phosphor warm
    color += uPhosphor * 0.03 * vign;

    // Edge fade so the shader plane blends into whatever is behind it
    // (real CRT tube / model's black screen) instead of showing a hard rect.
    vec2 ev = abs(vUv - 0.5) * 2.0;
    float edge = max(ev.x, ev.y);
    float alphaMask = 1.0 - smoothstep(0.72, 1.0, edge);

    gl_FragColor = vec4(color, alphaMask);
  }
`;

export default function CRTScreen({ width, height, position = [0, 0, 0] }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
      uPhosphor: { value: new THREE.Color("#c8ff00") },
    }),
    []
  );

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh position={position}>
      <planeGeometry args={[width, height, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        toneMapped={false}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
