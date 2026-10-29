<template>
  <TresCanvas class="tres-canvas" :clear-color="backgroundColor" window-size>
    <RoseGeneratorFill :petals="petals" :vertices="vertices" />
  </TresCanvas>
  <div class="sliders flex gap-4 mt-20">
    <div class="flex gap-4 w-full">
      <span>Petals:</span>
      <v-slider
        v-model="petals"
        :max="15"
        :min="3"
        :step="1"
        thumb-label="always"
      ></v-slider>
    </div>
    <div class="flex gap-4 w-full">
      <span>Vertices per Petal</span>
      <v-slider
        v-model="vertices"
        :max="50"
        :min="6"
        :step="2"
        thumb-label="always"
      ></v-slider>
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
