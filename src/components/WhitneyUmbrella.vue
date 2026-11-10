<template>
  <TresPerspectiveCamera :position="cameraPosition" :look-at="target" />

  <TresGridHelper
    :key="gridColor"
    :position="[0, -0.02, 0]"
    :args="[5.5, 16, gridColor, gridColor]"
  />

  <TresMesh :geometry="surfaceGeometry" v-if="showFill">
    <TresMeshBasicMaterial
      :color="frontColor"
      :vertex-colors="true"
      :side="FrontSide"
      :polygon-offset="true"
      :polygon-offset-factor="1"
      :polygon-offset-units="1"
    />
  </TresMesh>

  <TresMesh :geometry="surfaceGeometry" v-if="showFill">
    <TresMeshBasicMaterial
      :color="backColor"
      :vertex-colors="true"
      :side="BackSide"
      :polygon-offset="true"
      :polygon-offset-factor="1"
      :polygon-offset-units="1"
    />
  </TresMesh>

  <TresLineSegments :geometry="lineGeometry">
    <TresLineBasicMaterial :color="edgeColor" />
  </TresLineSegments>
</template>

<script setup lang="ts">
import { BufferAttribute, BufferGeometry, BackSide, FrontSide } from "three";
import { computed } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useTheme } from "vuetify";

const props = withDefaults(
  defineProps<{
    size?: number;
    segments?: number;
    u: number;
    v: number;
    angle: number;
    showFill: Boolean;
  }>(),
  { size: 4, segments: 24 },
);

const theme = useTheme();
const isMobile = useMediaQuery("(max-width: 640px)");
const isDark = computed(() => theme.global.current.value.dark);

const cameraDistance = computed(() => (isMobile.value ? 15 : 10));
const target = computed<[number, number, number]>(() => [0, props.size / 2, 0]);

const cameraPosition = computed<[number, number, number]>(() => {
  const d = cameraDistance.value;
  const a = Math.PI / 12;
  return [0, target.value[1] + d * Math.sin(a), d * Math.cos(a)];
});
const edgeColor = computed(() => (isDark.value ? "#B754FF" : "#8514D9"));
const gridColor = computed(() => (isDark.value ? "#404040" : "#D9D9D9"));

const thetaRad = computed(
  () => (Math.min(Math.max(props.angle, 1), 170) * Math.PI) / 180,
);

const positions = computed(() => {
  const n = props.segments;
  const pos = new Float32Array((n + 1) * (n + 1) * 3);

  const half = thetaRad.value / 2;
  const t = Math.tan(half);
  const base = half + (45 * Math.PI) / 180;

  for (let row = 0; row <= n; row++) {
    for (let col = 0; col <= n; col++) {
      const u = props.u * (-1 + (2 * col) / n);
      const vNorm = -1 + (2 * row) / n;
      const v = props.v * vNorm;

      const psi = Math.atan(t * vNorm) + base;

      const k = (row * (n + 1) + col) * 3;
      pos[k] = u * Math.sin(psi);
      pos[k + 1] = v * v;
      pos[k + 2] = u * Math.cos(psi);
    }
  }
  return new BufferAttribute(pos, 3);
});

const triangleIndices = computed(() => {
  const n = props.segments;
  const idx: number[] = [];
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const a = row * (n + 1) + col;
      const b = a + 1;
      const c = a + n + 1;
      const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  return idx;
});

const lineIndices = computed(() => {
  const n = props.segments;
  const idx: number[] = [];
  for (let row = 0; row <= n; row++) {
    for (let col = 0; col <= n; col++) {
      const a = row * (n + 1) + col;
      if (col < n) idx.push(a, a + 1);
      if (row < n) idx.push(a, a + n + 1);
    }
  }
  return idx;
});

const frontColor = "#8EC5FF";
const backColor = "#D9B8FF";

const gradientColors = computed(() => {
  const pos = positions.value;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const range = maxY - minY || 1;

  const col = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) - minY) / range;
    const b = 0.25 + 0.75 * t;
    col[i * 3] = b;
    col[i * 3 + 1] = b;
    col[i * 3 + 2] = b;
  }
  return new BufferAttribute(col, 3);
});

const surfaceGeometry = computed(() => {
  const geo = new BufferGeometry();
  geo.setAttribute("position", positions.value);
  geo.setAttribute("color", gradientColors.value);
  geo.setIndex(triangleIndices.value);
  return geo;
});

const lineGeometry = computed(() => {
  const geo = new BufferGeometry();
  geo.setAttribute("position", positions.value);
  geo.setIndex(lineIndices.value);
  return geo;
});
</script>
