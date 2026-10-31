<template>
  <TresCanvas class="tres-canvas" :clear-color="backgroundColor" window-size>
    <RoseGeneratorFill
      :petals="petals"
      :vertices="vertices"
      :showTriangles="showTriangles"
    />
  </TresCanvas>
  <div class="sliders flex gap-16 mt-20">
    <div class="flex flex-col items-start gap-4 w-1/2">
      <div class="flex gap-4 w-full">
        <span class="w-1/3">Petals:</span>
        <v-slider
          v-model="petals"
          :max="15"
          :min="3"
          :step="1"
          thumb-label="always"
        ></v-slider>
      </div>
      <div class="flex gap-4 w-full">
        <span class="w-1/3">Vertices per Petal</span>
        <v-slider
          v-model="vertices"
          :max="50"
          :min="6"
          :step="2"
          thumb-label="always"
        ></v-slider>
      </div>
    </div>
    <div class="flex gap-4 w-1/2 items-start">
      <span class="w-1/3">Show triangles:</span>
      <v-switch
        v-model="showTriangles"
        hide-details
        density="compact"
        class="flex-none"
        style="--v-input-control-height: 24px"
      ></v-switch>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import RoseGeneratorFill from "@/components/RoseGeneratorFill.vue";
import { ref, computed } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
const showTriangles = ref(false);

const backgroundColor = computed(() => {
  if (isDark.value) {
    return "#121212";
  } else {
    return "#ffffff";
  }
});
const petals = ref(5);
const vertices = ref(10);
</script>

<style>
.tres-canvas {
  z-index: 5;
}
.sliders {
  position: relative;
  z-index: 10;
}

@media (max-width: 640px) {
  .sliders {
    margin-left: 2em;
    margin-right: 2em;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }
}
</style>
