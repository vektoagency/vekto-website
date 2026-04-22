"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fractal noise flow field with mouse-driven warp
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uIntensity;

  // 2D simplex-ish noise
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }
  float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);

    // Mouse warp — push UVs toward/away from cursor
    vec2 m = uMouse * 0.5 * vec2(uAspect, 1.0);
    float dm = distance(p, m);
    vec2 dir = (p - m) / max(dm, 0.0001);
    float warp = exp(-dm * 2.2) * 0.12;
    p += dir * warp;

    // Animated flow field
    float t = uTime * 0.08;
    vec2 q = vec2(fbm(p + t), fbm(p - t + 3.7));
    vec2 r = vec2(
      fbm(p + q + vec2(1.7, 9.2) + 0.15 * uTime),
      fbm(p + q + vec2(8.3, 2.8) + 0.126 * uTime)
    );
    float n = fbm(p + r);

    // Color mix — mostly dark w/ lime highlights
    vec3 bg = vec3(0.028, 0.022, 0.016);
    vec3 lime = vec3(0.78, 1.0, 0.0);
    vec3 deep = vec3(0.05, 0.12, 0.0);

    float limeMask = smoothstep(0.55, 0.92, n);
    float glowMask = smoothstep(0.35, 0.6, n);
    vec3 col = mix(bg, deep, glowMask);
    col = mix(col, lime * 0.55, limeMask * uIntensity);

    // Mouse halo glow
    float halo = exp(-dm * 3.5) * 0.55;
    col += lime * halo * 0.4;

    // Subtle vignette
    vec2 cv = uv - 0.5;
    col *= smoothstep(0.95, 0.2, dot(cv, cv));

    gl_FragColor = vec4(col, 1.0);
  }
`;

type Props = {
  intensity?: number;
};

export default function ShaderBackdrop({ intensity = 1.0 }: Props) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size, pointer } = useThree();
  const mouseTarget = useRef(new THREE.Vector2());

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
      uIntensity: { value: intensity },
    }),
    [intensity]
  );

  useFrame((_, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += delta;
    mat.current.uniforms.uAspect.value = size.width / size.height;
    // Smoothly follow pointer
    mouseTarget.current.lerp(new THREE.Vector2(pointer.x, pointer.y), 0.06);
    mat.current.uniforms.uMouse.value.copy(mouseTarget.current);
    mat.current.uniforms.uIntensity.value = intensity;
  });

  // Large plane at far z to act as background
  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[viewport.width * 4, viewport.height * 4]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
