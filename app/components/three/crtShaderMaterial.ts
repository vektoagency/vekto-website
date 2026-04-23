import * as THREE from "three";

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
    vec2 uv = vUv * 2.0 - 1.0;
    vec2 offset = uv.yx * uv.yx;
    uv += uv * offset * 0.06;
    uv = uv * 0.5 + 0.5;

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    float rows = floor(uv.y * 22.0);
    float rowT = fract(uv.y * 22.0);
    float col = floor(uv.x * 50.0);
    float appear = step(col, uTime * 12.0 - rows * 2.0);
    float charNoise = hash(vec2(col, rows));
    float charOn = step(0.35, charNoise) * appear;

    float yShape = smoothstep(0.15, 0.5, rowT) * (1.0 - smoothstep(0.5, 0.85, rowT));
    float xShape = 1.0 - abs(fract(uv.x * 50.0) - 0.5) * 2.0;
    xShape = smoothstep(0.15, 0.85, xShape);

    float text = charOn * yShape * xShape;

    float scan = 0.85 + 0.15 * sin(vUv.y * 720.0);
    float flicker = 0.95 + 0.05 * noise(vec2(uTime * 4.0, 0.0));

    vec2 cv = vUv - 0.5;
    float vign = 1.0 - dot(cv, cv) * 1.1;
    vign = clamp(vign, 0.0, 1.0);

    float brightness = text * 1.4 * scan * flicker * vign;
    brightness *= uIntensity;

    vec3 color = uPhosphor * brightness;
    color += uPhosphor * 0.04 * vign;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createCRTShaderMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 1.2 },
      uPhosphor: { value: new THREE.Color("#c8ff00") },
    },
    toneMapped: false,
    transparent: false,
    depthWrite: true,
  });
}
