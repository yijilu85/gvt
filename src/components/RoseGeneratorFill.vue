<template>
  <TresPerspectiveCamera
    :position="[0, cameraHeight, 0]"
    :look-at="[0, 0, 0]"
  />
  <TresGridHelper
    :key="gridColor"
    :position="[0, -0.02, 0]"
    :args="[6, 16, gridColor, gridColor]"
  />
  <TresMesh :geometry="fillGeometry" :position="[0, -0.01, 0]">
    <TresMeshBasicMaterial :color="fillColor" :side="2" />
  </TresMesh>

  <TresMesh :geometry="fillGeometry" :position="[0, -0.005, 0]">
    <TresMeshBasicMaterial :color="edgeColor" :wireframe="true" />
  </TresMesh>
</template>

<script setup lang="ts">
import { BufferAttribute, BufferGeometry } from "three";
import { computed, ref } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useTheme } from "vuetify";

const theme = useTheme();
const isMobile = useMediaQuery("(max-width: 640px)");

const cameraHeight = computed(() => (isMobile.value ? 15 : 10));
const radius = computed(() => (isMobile.value ? 1.5 : 2));
const isDark = computed(() => theme.global.current.value.dark);

const petalCount = computed(() => props.petals || 5);
const vpp = computed(
  () => 2 * Math.max(1, Math.round((props.vertices || 80) / 2)),
);
const vertexCount = computed(() => petalCount.value * vpp.value);

const fillColor = computed(() => (isDark.value ? "#4C1D95" : "#bc86f8"));
const edgeColor = computed(() => (isDark.value ? "#B754FF" : "#8514D9"));

const gridColor = computed(() => {
  if (isDark.value) {
    return "#404040";
  } else {
    return "#D9D9D9";
  }
});

const props = defineProps({
  petals: Number,
  vertices: Number,
});

const positions = computed(() => {
  const n = vertexCount.value;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2;
    const r = Math.abs(Math.cos((petalCount.value * theta) / 2)) * radius.value;
    pos[i * 3] = r * Math.cos(theta);
    pos[i * 3 + 1] = 0;
    pos[i * 3 + 2] = r * Math.sin(theta);
  }
  return new BufferAttribute(pos, 3);
});

const triangulatePetal = (tip: number, vpp: number, n: number): number[] => {
  const half = vpp / 2;
  const w = (i: number) => ((i % n) + n) % n;

  let a = tip - 1;
  let b = tip + 1;
  const triagles: number[] = [w(tip), w(a), w(b)];

  let lowerLeft = half - 1;
  let upperLeft = half - 2;
  let lowerTurn = true;

  while (lowerLeft > 0 || upperLeft > 0) {
    if ((lowerTurn && lowerLeft > 0) || upperLeft === 0) {
      const next = a - 1;
      triagles.push(w(b), w(a), w(next));
      a = next;
      lowerLeft--;
    } else {
      const next = b + 1;
      triagles.push(w(a), w(next), w(b));
      b = next;
      upperLeft--;
    }
    lowerTurn = !lowerTurn;
  }
  return triagles;
};

const indices = computed(() =>
  Array.from({ length: petalCount.value }, (_, k) =>
    triangulatePetal(k * vpp.value, vpp.value, vertexCount.value),
  ).flat(),
);

const fillGeometry = computed(() => {
  const geo = new BufferGeometry();
  geo.setAttribute("position", positions.value);
  geo.setIndex(indices.value);
  return geo;
});
</script>
