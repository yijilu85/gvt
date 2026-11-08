<template>
  <TresCanvas class="tres-canvas" :clear-color="backgroundColor" window-size>
    <SheetGenerator :u="u" :v="v" :angle="angle" :showFill="showFill" />
  </TresCanvas>
  <div class="sliders flex gap-16 mt-20">
    <div class="flex flex-col items-start gap-4 w-1/2">
      <div class="flex gap-4 w-full">
        <span class="w-1/3">Height:</span>
        <v-slider
          v-model="u"
          :min="0.1"
          :max="3"
          :step="0.1"
          thumb-label="always"
        />
      </div>
      <div class="flex gap-4 w-full">
        <span class="w-1/3">Width:</span>
        <v-slider
          v-model="v"
          :min="0.1"
          :max="3"
          :step="0.1"
          thumb-label="always"
        />
      </div>
    </div>
    <div class="flex flex-col items-start gap-4 w-1/2">
      <div class="flex gap-4 w-full">
        <span class="w-1/3">angle:</span>
        <v-slider
          v-model="angle"
          :min="10"
          :max="170"
          :step="1"
          thumb-label="always"
        />
      </div>
      <div class="flex gap-4 w-1/2 items-start">
        <span class="w-1/3">Show fill:</span>
        <v-switch
          v-model="showFill"
          hide-details
          density="compact"
          class="flex-none"
          style="--v-input-control-height: 24px"
        ></v-switch>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import SheetGenerator from "@/components/SheetGenerator.vue";
import { ref, computed } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
const showFill = ref(false);

const backgroundColor = computed(() => {
  if (isDark.value) {
    return "#121212";
  } else {
    return "#ffffff";
  }
});
const u = ref(1.9);
const v = ref(1.3);
const angle = ref(110);
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
