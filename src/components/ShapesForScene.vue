<template>
  <TresPerspectiveCamera
    ref="cameraRef"
    :position="camPos"
    :look-at="[0, 0, 0]"
  />

  <TresGridHelper
    :key="gridColor"
    :position="[0, -0.02, 0]"
    :args="[8, 16, gridColor, gridColor]"
  />

  <template v-for="obj in objects" :key="obj.id">
    <TresMesh :geometry="obj.surface" :position="obj.position" v-if="showFill">
      <TresMeshBasicMaterial
        :vertex-colors="true"
        :polygon-offset="true"
        :polygon-offset-factor="1"
        :polygon-offset-units="1"
      />
    </TresMesh>

    <TresLineSegments
      :geometry="obj.lines"
      :position="obj.position"
      v-if="showEdges"
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
import { computed, ref, watch } from "vue";
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
  }>(),
  {
    recursionDepth: 4,
    showFill: true,
    showEdges: true,
    size: 4,
    cameraPosition: () => ({ x: 20, y: 20, z: 30 }),
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

type Face = {
  from: string;
  to: string;
  verts: [number, number, number][];
};

const buildFaces = (faces: Face[]): Geometries => {
  const pos: number[] = [];
  const col: number[] = [];
  const tri: number[] = [];
  const lineIdx: number[] = [];
  const cFrom = new Color();
  const cTo = new Color();
  let offset = 0;

  for (const face of faces) {
    cFrom.set(face.from);
    cTo.set(face.to);
    face.verts.forEach((v, i) => {
      const c = i < 2 ? cFrom : cTo;
      pos.push(v[0], v[1], v[2]);
      col.push(c.r, c.g, c.b);
    });
    const n = face.verts.length;
    for (let i = 1; i < n - 1; i++) {
      tri.push(offset, offset + i, offset + i + 1);
    }
    for (let i = 0; i < n; i++) {
      lineIdx.push(offset + i, offset + ((i + 1) % n));
    }
    offset += n;
  }
  return makeGeometries(pos, col, tri, lineIdx);
};

const unit = computed(() => props.size / 4);

const topColor = new Color("#8EC5FF");
const bottomColor = new Color("#7C3AED");

const sphere = computed<Geometries>(() => {
  const depth = Math.min(Math.max(Math.round(props.recursionDepth), 0), 6);
  const radius = unit.value;

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
        const x = sx;
        const y = 2 + sy;
        const z = 4 + sz;
        const flipped = (sx + sy + sz) % 2 === 1;
        if (flipped) subdivide(x, z, y, depth);
        else subdivide(x, y, z, depth);
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
    c.lerpColors(bottomColor, topColor, (verts[i + 1] + 1) / 2);
    col.push(c.r, c.g, c.b);
  }

  return makeGeometries(pos, col, triangles, lineIdx);
});

const cube = computed<Geometries>(() => {
  const h = 0.75 * unit.value;
  return buildFaces([
    {
      from: "#991B1B",
      to: "#FCA5A5",
      verts: [
        [h, -h, h],
        [h, -h, -h],
        [h, h, -h],
        [h, h, h],
      ],
    },
    {
      from: "#9A3412",
      to: "#FDBA74",
      verts: [
        [-h, -h, -h],
        [-h, -h, h],
        [-h, h, h],
        [-h, h, -h],
      ],
    },
    {
      from: "#A16207",
      to: "#FDE047",
      verts: [
        [-h, h, h],
        [h, h, h],
        [h, h, -h],
        [-h, h, -h],
      ],
    },
    {
      from: "#166534",
      to: "#86EFAC",
      verts: [
        [-h, -h, -h],
        [h, -h, -h],
        [h, -h, h],
        [-h, -h, h],
      ],
    },
    {
      from: "#1E40AF",
      to: "#93C5FD",
      verts: [
        [-h, -h, h],
        [h, -h, h],
        [h, h, h],
        [-h, h, h],
      ],
    },
    {
      from: "#6B21A8",
      to: "#D8B4FE",
      verts: [
        [h, -h, -h],
        [-h, -h, -h],
        [-h, h, -h],
        [h, h, -h],
      ],
    },
  ]);
});

const pyramid = computed<Geometries>(() => {
  const b = 0.75 * unit.value;
  const h = 0.75 * unit.value;

  const p0: [number, number, number] = [-b, -h, -b];
  const p1: [number, number, number] = [b, -h, -b];
  const p2: [number, number, number] = [b, -h, b];
  const p3: [number, number, number] = [-b, -h, b];
  const apex: [number, number, number] = [0, h, 0];

  const tip = "#FFEDD5";

  return buildFaces([
    { from: "#9D174D", to: "#F9A8D4", verts: [p3, p2, apex] },
    { from: "#155E75", to: "#67E8F9", verts: [p2, p1, apex] },
    { from: "#3F6212", to: "#BEF264", verts: [p1, p0, apex] },
    { from: "#3730A3", to: "#A5B4FC", verts: [p0, p3, apex] },
    { from: "#1E293B", to: "#64748B", verts: [p0, p1, p2, p3] },
  ]);
});

const objects = computed(() => [
  {
    id: "sphere",
    position: [0, 0, 0] as [number, number, number],
    ...sphere.value,
  },
  {
    id: "cube",
    position: [1, -1, 2] as [number, number, number],
    ...cube.value,
  },
  {
    id: "pyramid",
    position: [-1.5, 2, -1.5] as [number, number, number],
    ...pyramid.value,
  },
]);
</script>
