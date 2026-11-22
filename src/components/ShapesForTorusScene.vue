<template>
  <TresPerspectiveCamera
    ref="cameraRef"
    :position="camPos"
    :look-at="[0, 0, 0]"
  />

  <TresGridHelper
    :key="gridColor"
    :position="[0, gridY, 0]"
    :args="[10, 20, gridColor, gridColor]"
  />

  <TresMesh v-if="showFill" :geometry="torus.surface" :rotation="[0, angle, 0]">
    <TresMeshBasicMaterial
      :vertex-colors="true"
      :polygon-offset="true"
      :polygon-offset-factor="1"
      :polygon-offset-units="1"
    />
  </TresMesh>
  <TresLineSegments
    v-if="showEdges"
    :geometry="torus.lines"
    :rotation="[0, angle, 0]"
  >
    <TresLineBasicMaterial :color="edgeColor" />
  </TresLineSegments>

  <template v-for="(ball, i) in balls" :key="ball.id">
    <TresMesh
      v-if="showFill"
      :geometry="sphereGeos[i].surface"
      :position="ball.position"
    >
      <TresMeshBasicMaterial
        :vertex-colors="true"
        :polygon-offset="true"
        :polygon-offset-factor="1"
        :polygon-offset-units="1"
      />
    </TresMesh>
    <TresLineSegments
      v-if="showEdges"
      :geometry="sphereGeos[i].lines"
      :position="ball.position"
    >
      <TresLineBasicMaterial :color="edgeColor" />
    </TresLineSegments>
  </template>
</template>

<script setup lang="ts">
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  type PerspectiveCamera,
} from "three";
import { computed, ref } from "vue";
import { useTheme } from "vuetify";
import { useLoop } from "@tresjs/core";

const { onBeforeRender } = useLoop();

const props = withDefaults(
  defineProps<{
    recursionDepth?: number;
    showFill?: boolean;
    showEdges?: boolean;
    size?: number;
    cameraPosition?: { x: number; y: number; z: number };
    sceneCounter: number;
    step?: number;
  }>(),
  {
    recursionDepth: 3,
    showFill: true,
    showEdges: true,
    size: 4,
    cameraPosition: () => ({ x: 6, y: 5, z: 9 }),
    sceneCounter: 0,
    step: 0.03,
  },
);

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
const edgeColor = computed(() => (isDark.value ? "#B754FF" : "#8514D9"));
const gridColor = computed(() => (isDark.value ? "#404040" : "#D9D9D9"));

const camPos = computed<[number, number, number]>(() => [
  props.cameraPosition.x,
  props.cameraPosition.y,
  props.cameraPosition.z,
]);

const cameraRef = ref<PerspectiveCamera | null>(null);
onBeforeRender(() => {
  cameraRef.value?.lookAt(0, 0, 0);
});

const unit = computed(() => props.size / 4);
const R = computed(() => 1.5 * unit.value);
const r = computed(() => 0.4 * unit.value);
const s = computed(() => 0.3 * unit.value);

type Orbit = {
  id: string;
  rho: number;
  delta: number;
  gamma: number;
  half: 0 | 1;
};

const orbits: Orbit[] = [
  { id: "flach", rho: 1.5, delta: 0, gamma: 0, half: 0 },
  { id: "schraeg-hoch", rho: 1.8, delta: 45, gamma: 35, half: 1 },
  { id: "schraeg-tief", rho: 1.8, delta: 135, gamma: -35, half: 0 },
  { id: "steil", rho: 2.0, delta: 90, gamma: 70, half: 0 },
];

const gridY = computed(() => -2.8 * unit.value);

const angle = computed(() => props.sceneCounter * props.step);

type Vec3 = [number, number, number];
const DEG = Math.PI / 180;

const onOrbit = (o: Orbit, theta: number): Vec3 => {
  const rho = o.rho * unit.value;
  const dl = o.delta * DEG;
  const g = o.gamma * DEG;
  const d: Vec3 = [Math.sin(dl), 0, Math.cos(dl)];
  const h: Vec3 = [Math.cos(dl), 0, -Math.sin(dl)];
  const w: Vec3 = [Math.cos(g) * h[0], Math.sin(g), Math.cos(g) * h[2]];
  const phi = theta - dl - o.half * Math.PI;
  const a = rho * (1 - Math.cos(phi));
  const b = rho * Math.sin(phi);
  return [a * w[0] + b * d[0], a * w[1] + b * d[1], a * w[2] + b * d[2]];
};

const balls = computed(() =>
  orbits.map((o) => ({ id: o.id, position: onOrbit(o, angle.value) })),
);

type Geometries = { surface: BufferGeometry; lines: BufferGeometry };

const makeGeometries = (
  pos: number[],
  col: number[],
  triangles: number[],
  lineIdx: number[],
): Geometries => {
  const position = new BufferAttribute(new Float32Array(pos), 3);

  const surface = new BufferGeometry();
  surface.setAttribute("position", position);
  surface.setAttribute("color", new BufferAttribute(new Float32Array(col), 3));
  surface.setIndex(triangles);

  const lines = new BufferGeometry();
  lines.setAttribute("position", position);
  lines.setIndex(lineIdx);

  return { surface, lines };
};

const TORUS_U = 48;
const TORUS_V = 20;

const torus = computed<Geometries>(() => {
  const pos: number[] = [];
  const col: number[] = [];
  const tri: number[] = [];
  const lineIdx: number[] = [];
  const c = new Color();

  for (let i = 0; i < TORUS_U; i++) {
    const u = (i / TORUS_U) * Math.PI * 2;
    for (let j = 0; j < TORUS_V; j++) {
      const v = (j / TORUS_V) * Math.PI * 2;
      const ring = R.value + r.value * Math.cos(v);
      pos.push(ring * Math.cos(u), ring * Math.sin(u), r.value * Math.sin(v));
      c.setHSL(i / TORUS_U, 0.65, 0.45 + 0.15 * Math.cos(v));
      col.push(c.r, c.g, c.b);
    }
  }

  const idx = (i: number, j: number) => (i % TORUS_U) * TORUS_V + (j % TORUS_V);

  for (let i = 0; i < TORUS_U; i++) {
    for (let j = 0; j < TORUS_V; j++) {
      const a = idx(i, j);
      const b = idx(i + 1, j);
      const cc = idx(i + 1, j + 1);
      const d = idx(i, j + 1);
      tri.push(a, b, cc, a, cc, d);
      lineIdx.push(a, b, a, d);
    }
  }

  return makeGeometries(pos, col, tri, lineIdx);
});

const buildSphere = (
  radius: number,
  depthIn: number,
  bottom: Color,
  top: Color,
): Geometries => {
  const depth = Math.min(Math.max(Math.round(depthIn), 0), 6);
  const verts: number[] = [];
  const cache = new Map<string, number>();

  const addVertex = (x: number, y: number, z: number) => {
    const len = Math.hypot(x, y, z);
    verts.push(x / len, y / len, z / len);
    return verts.length / 3 - 1;
  };

  const midpoint = (a: number, b: number) => {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`;
    const hit = cache.get(key);
    if (hit !== undefined) return hit;
    const i = addVertex(
      (verts[a * 3] + verts[b * 3]) / 2,
      (verts[a * 3 + 1] + verts[b * 3 + 1]) / 2,
      (verts[a * 3 + 2] + verts[b * 3 + 2]) / 2,
    );
    cache.set(key, i);
    return i;
  };

  const triangles: number[] = [];
  const subdivide = (a: number, b: number, c: number, d: number) => {
    if (d === 0) {
      triangles.push(a, b, c);
      return;
    }
    const ab = midpoint(a, b);
    const bc = midpoint(b, c);
    const ca = midpoint(c, a);
    subdivide(a, ab, ca, d - 1);
    subdivide(b, bc, ab, d - 1);
    subdivide(c, ca, bc, d - 1);
    subdivide(ab, bc, ca, d - 1);
  };

  addVertex(1, 0, 0);
  addVertex(-1, 0, 0);
  addVertex(0, 1, 0);
  addVertex(0, -1, 0);
  addVertex(0, 0, 1);
  addVertex(0, 0, -1);

  for (let sx = 0; sx < 2; sx++) {
    for (let sy = 0; sy < 2; sy++) {
      for (let sz = 0; sz < 2; sz++) {
        const flipped = (sx + sy + sz) % 2 === 1;
        if (flipped) subdivide(sx, 4 + sz, 2 + sy, depth);
        else subdivide(sx, 2 + sy, 4 + sz, depth);
      }
    }
  }

  const edges = new Set<string>();
  const lineIdx: number[] = [];
  for (let i = 0; i < triangles.length; i += 3) {
    for (let e = 0; e < 3; e++) {
      const a = triangles[i + e];
      const b = triangles[i + ((e + 1) % 3)];
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (!edges.has(key)) {
        edges.add(key);
        lineIdx.push(a, b);
      }
    }
  }

  const pos: number[] = [];
  const col: number[] = [];
  const c = new Color();
  for (let i = 0; i < verts.length; i += 3) {
    pos.push(verts[i] * radius, verts[i + 1] * radius, verts[i + 2] * radius);
    c.lerpColors(bottom, top, (verts[i + 1] + 1) / 2);
    col.push(c.r, c.g, c.b);
  }

  return makeGeometries(pos, col, triangles, lineIdx);
};

const sphereColors: [string, string][] = [
  ["#991B1B", "#FCA5A5"],
  ["#16A34A", "#86EFAC"],
  ["#1E40AF", "#93C5FD"],
  ["#EAB308", "#FEF9C3"],
];

const sphereGeos = computed<Geometries[]>(() =>
  sphereColors.map(([from, to]) =>
    buildSphere(s.value, props.recursionDepth, new Color(from), new Color(to)),
  ),
);
</script>
