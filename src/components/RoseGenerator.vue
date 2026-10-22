<template>
  <TresPerspectiveCamera
    :position="[0, cameraHeight, 0]"
    :look-at="[0, 0, 0]"
  />

  <TresLineLoop :geometry="pattern">
    <TresLineBasicMaterial :color="patternColor" />
  </TresLineLoop>

  <TresGridHelper :key="gridColor" :args="[6, 16, gridColor, gridColor]" />
</template>

<script setup lang="ts">
import { BufferAttribute, BufferGeometry } from "three";
import { computed } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useTheme } from "vuetify";

const theme = useTheme();
const isMobile = useMediaQuery("(max-width: 640px)");

const cameraHeight = computed(() => (isMobile.value ? 15 : 10));
const radius = computed(() => (isMobile.value ? 1.5 : 2));
const isDark = computed(() => theme.global.current.value.dark);

const patternColor = computed(() => {
  if (isDark.value) {
    return "#B754FF";
  } else {
    return "#8514D9";
  }
});

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

function makeRose(petals: number, vertices: number) {
  const vpp = 2 * Math.max(1, Math.round(vertices / 2));
  const vertexCount = petals * vpp;

  const pos = new Float32Array(vertexCount * 3);
  for (let i = 0; i < vertexCount; i++) {
    const theta = (i / vertexCount) * Math.PI * 2;
    const c = Math.abs(Math.cos((petals * theta) / 2));
    const r = c * radius.value;
    pos[i * 3] = r * Math.cos(theta);
    pos[i * 3 + 1] = 0;
    pos[i * 3 + 2] = r * Math.sin(theta);
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(pos, 3));
  return geo;
}

const pattern = computed(() => {
  const petals = props.petals || 5;
  const vertices = props.vertices || 80;
  return makeRose(petals, vertices);
});
</script>
