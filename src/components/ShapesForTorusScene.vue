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

  <!-- Torus: dreht sich um die senkrechte y-Achse (wie eine kreiselnde Münze) -->
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

  <!-- Kugeln: feste, unterschiedlich geneigte Kreisbahnen im Raum -->
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
    /** Winkel pro Inkrement von sceneCounter (Radiant) – gilt für Kugeln UND Torus */
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

/* ------------------------------------------------------------------ */
/* Maße                                                               */
/* ------------------------------------------------------------------ */
// Torus: steht aufrecht (Ring in der lokalen xy-Ebene, Lochachse z) und
// dreht sich mit Winkel θ um die senkrechte y-Achse. Seine Lochachse zeigt
// dann in Richtung n(θ) = (sin θ, 0, cos θ) – sie liegt immer waagerecht.
//
// Kugeln: jede fliegt auf einem festen Kreis durch das Torus-Zentrum.
// Damit sie durch die Öffnung passt, muss ihre Flugrichtung im Zentrum
// parallel zur Lochachse sein. Deshalb gilt für jede Bahn:
//   - Tangente im Zentrum d = (sin δ, 0, cos δ)  (waagerecht, Richtung δ)
//   - Bahnebene um diese Tangente um den Winkel γ gekippt
//     (γ = 0: waagerechte Bahn, γ = 90°: senkrechte Bahn)
//   - Radius ρ
//
// Synchronisation: Kugeln und Torus nutzen denselben Winkel θ.
// Kugel k erreicht das Zentrum genau dann, wenn θ = δ_k (bzw. δ_k + π),
// also wenn die Lochachse in ihre Flugrichtung zeigt.
//
// Die Bahnparameter sind numerisch über einen vollen Umlauf geprüft:
//   kleinster Abstand Kugel–Torus  ≈ 0.47 · unit
//   kleinster Abstand Kugel–Kugel  ≈ 0.73 · unit
const unit = computed(() => props.size / 4);
const R = computed(() => 1.5 * unit.value); // großer Torusradius
const r = computed(() => 0.4 * unit.value); // Rohrradius
const s = computed(() => 0.3 * unit.value); // Kugelradius

type Orbit = {
  id: string;
  rho: number; // Bahnradius (in unit)
  delta: number; // Richtung der Tangente im Zentrum (Grad)
  gamma: number; // Neigung der Bahnebene (Grad)
  half: 0 | 1; // Durchflug bei θ = δ (0) oder θ = δ + 180° (1)
};

const orbits: Orbit[] = [
  { id: "flach", rho: 1.5, delta: 0, gamma: 0, half: 0 },
  { id: "schraeg-hoch", rho: 1.8, delta: 45, gamma: 35, half: 1 },
  { id: "schraeg-tief", rho: 1.8, delta: 135, gamma: -35, half: 0 },
  { id: "steil", rho: 2.0, delta: 90, gamma: 70, half: 0 },
];

// Gitterebene unter dem tiefsten Punkt der Szene
const gridY = computed(() => -2.8 * unit.value);

/* ------------------------------------------------------------------ */
/* Animation über sceneCounter                                        */
/* ------------------------------------------------------------------ */
// EIN gemeinsamer Winkel für Torus und Kugeln -> synchron
const angle = computed(() => props.sceneCounter * props.step);

type Vec3 = [number, number, number];
const DEG = Math.PI / 180;

// Position auf der Kreisbahn zum Torus-Winkel theta
const onOrbit = (o: Orbit, theta: number): Vec3 => {
  const rho = o.rho * unit.value;
  const dl = o.delta * DEG;
  const g = o.gamma * DEG;
  // d: Flugrichtung im Zentrum, h: waagerecht senkrecht zu d
  const d: Vec3 = [Math.sin(dl), 0, Math.cos(dl)];
  const h: Vec3 = [Math.cos(dl), 0, -Math.sin(dl)];
  // w: Richtung vom Zentrum zum Kreismittelpunkt (h um γ nach oben gekippt)
  const w: Vec3 = [Math.cos(g) * h[0], Math.sin(g), Math.cos(g) * h[2]];
  // phi = 0 -> Kugel im Zentrum
  const phi = theta - dl - o.half * Math.PI;
  const a = rho * (1 - Math.cos(phi));
  const b = rho * Math.sin(phi);
  return [a * w[0] + b * d[0], a * w[1] + b * d[1], a * w[2] + b * d[2]];
};

const balls = computed(() =>
  orbits.map((o) => ({ id: o.id, position: onOrbit(o, angle.value) })),
);

/* ------------------------------------------------------------------ */
/* Geometrie-Helfer                                                   */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Torus (parametrisch)                                               */
/* ------------------------------------------------------------------ */
const TORUS_U = 48; // Segmente entlang des Rings
const TORUS_V = 20; // Segmente um das Rohr

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
      // Farbverlauf entlang des Rings, damit die Drehung sichtbar ist
      c.setHSL(i / TORUS_U, 0.65, 0.45 + 0.15 * Math.cos(v));
      col.push(c.r, c.g, c.b);
    }
  }

  // Index mit Umlauf (modulo), keine doppelten Naht-Vertices nötig
  const idx = (i: number, j: number) => (i % TORUS_U) * TORUS_V + (j % TORUS_V);

  for (let i = 0; i < TORUS_U; i++) {
    for (let j = 0; j < TORUS_V; j++) {
      const a = idx(i, j);
      const b = idx(i + 1, j);
      const cc = idx(i + 1, j + 1);
      const d = idx(i, j + 1);
      tri.push(a, b, cc, a, cc, d);
      lineIdx.push(a, b, a, d); // nur Gitterlinien, keine Diagonalen
    }
  }

  return makeGeometries(pos, col, tri, lineIdx);
});

/* ------------------------------------------------------------------ */
/* Kugel aus Oktaeder-Unterteilung                                    */
/* ------------------------------------------------------------------ */
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

// Farbverlauf je Kugel (unten -> oben), Reihenfolge wie in `orbits`
const sphereColors: [string, string][] = [
  ["#991B1B", "#FCA5A5"], // rot
  ["#16A34A", "#86EFAC"], // grün
  ["#1E40AF", "#93C5FD"], // blau
  ["#EAB308", "#FEF9C3"], // gelb
];

const sphereGeos = computed<Geometries[]>(() =>
  sphereColors.map(([from, to]) =>
    buildSphere(s.value, props.recursionDepth, new Color(from), new Color(to)),
  ),
);
</script>
