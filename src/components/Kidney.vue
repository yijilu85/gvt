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

  <TresLineSegments :geometry="lineGeometry">
    <TresLineBasicMaterial :color="edgeColor" />
  </TresLineSegments>
</template>

<script setup lang="ts">
import { BufferAttribute, BufferGeometry, FrontSide } from "three";
import { computed } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useTheme } from "vuetify";

const props = withDefaults(
  defineProps<{
    size?: number;
    uSegments?: number;
    vSegments?: number;
    showFill?: boolean;
  }>(),
  { size: 4, uSegments: 32, vSegments: 64, showFill: true },
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

const frontColor = "#8EC5FF";
const positions = computed(() => {
  const nu = props.uSegments;
  const nv = props.vSegments;
  const stride = nu + 1;
  const pos = new Float32Array(stride * (nv + 1) * 3);

  const scale = props.size / 8;
  const yOffset = props.size / 2;

  for (let row = 0; row <= nv; row++) {
    const v = -Math.PI / 2 + (Math.PI * row) / nv;
    const r = 3 * Math.cos(v) - Math.cos(3 * v);
    const h = 3 * Math.sin(v) - Math.sin(3 * v);

    for (let col = 0; col <= nu; col++) {
      const u = (2 * Math.PI * col) / nu;

      const k = (row * stride + col) * 3;
      pos[k] = scale * r * Math.cos(u);
      pos[k + 1] = scale * h + yOffset;
      pos[k + 2] = scale * r * Math.sin(u);
    }
  }
  return new BufferAttribute(pos, 3);
});

const triangleIndices = computed(() => {
  const nu = props.uSegments;
  const nv = props.vSegments;
  const stride = nu + 1;
  const idx: number[] = [];
  for (let row = 0; row < nv; row++) {
    for (let col = 0; col < nu; col++) {
      const a = row * stride + col;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  return idx;
});

const lineIndices = computed(() => {
  const nu = props.uSegments;
  const nv = props.vSegments;
  const stride = nu + 1;
  const idx: number[] = [];
  for (let row = 0; row <= nv; row++) {
    for (let col = 0; col <= nu; col++) {
      const a = row * stride + col;
      if (col < nu) idx.push(a, a + 1);
      if (row < nv) idx.push(a, a + stride);
    }
  }
  return idx;
});

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
