<template>
  <TresCanvas class="tres-canvas" :clear-color="backgroundColor" window-size>
    <WhitneyUmbrella
      :u="u"
      :v="v"
      :angle="angle"
      :showFill="showFill"
      v-if="isCurrentShape('umbrella')"
    />
    <Kidney :showFill="showFill" v-if="isCurrentShape('kidney')" />
    <BohemianDome :showFill="showFill" v-if="isCurrentShape('bohemian')" />
  </TresCanvas>
  <div class="control flex justify-center">
    <v-btn @click="incrementCurrentShapeIndex"> Next Shape </v-btn>
  </div>
  <div class="control flex justify-center mt-8 text-xl">
    {{ currentShape.label }}
  </div>
  <div class="control flex gap-4 w-full justify-center mt-4">
    <span class="w-1/8">Show fill:</span>
    <v-switch
      v-model="showFill"
      hide-details
      density="compact"
      class="flex-none"
      style="--v-input-control-height: 24px"
    ></v-switch>
  </div>
  <div class="sliders flex gap-16 mt-12">
    <div class="flex flex-col items-start gap-4 w-1/2">
      <div class="flex gap-4 w-full" v-if="currentShape.sliders">
        <span class="w-1/3">Height:</span>
        <v-slider
          v-model="u"
          :min="0.1"
          :max="3"
          :step="0.1"
          thumb-label="always"
        />
      </div>
      <div class="flex gap-4 w-full" v-if="currentShape.sliders">
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
    <div
      class="flex flex-col items-start gap-4 w-1/2"
      v-if="currentShape.sliders"
    >
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import WhitneyUmbrella from "@/components/WhitneyUmbrella.vue";
import Kidney from "@/components/Kidney.vue";
import BohemianDome from "@/components/BohemianDome.vue";
import { ref, computed } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
const showFill = ref(true);
const shapes = ref([
  { id: "kidney", label: "Kidney Surface", sliders: false },
  { id: "bohemian", label: "Bohemian Dome", sliders: false },
  { id: "umbrella", label: "Whitney Umbrella – modifiziert", sliders: true },
]);

const currentShapeIndex = ref(0);

const incrementCurrentShapeIndex = () => {
  if (currentShapeIndex.value < shapes.value.length - 1) {
    currentShapeIndex.value++;
  } else {
    currentShapeIndex.value = 0;
  }
};

const currentShape = computed(() => {
  return shapes.value[currentShapeIndex.value];
});

const isCurrentShape = (id: string) => {
  return currentShape.value.id === id;
};

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
.sliders,
.control {
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
