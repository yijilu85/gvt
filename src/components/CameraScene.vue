<template>
  <TresCanvas class="tres-canvas" :clear-color="backgroundColor" window-size>
    <ShapesForScene
      :recursionDepth="recursionDepth"
      :showFill="showFill"
      :showEdges="showEdges"
      :cameraPosition="cameraPosition"
    />
  </TresCanvas>
  <div class="control key-legend">
    <span class="key-legend__title">Kamerasteuerung</span>

    <div class="key-legend__group">
      <div class="key-row">
        <kbd class="key" :class="{ 'key--active': ArrowLeft }">←</kbd>
        <kbd class="key" :class="{ 'key--active': ArrowUp }">↑</kbd>
        <kbd class="key" :class="{ 'key--active': ArrowDown }">↓</kbd>
        <kbd class="key" :class="{ 'key--active': ArrowRight }">→</kbd>
      </div>
      <span class="key-legend__label">Rotation</span>
    </div>

    <div class="key-legend__group">
      <kbd class="key" :class="{ 'key--active': n && !shift }">N</kbd>
      <span class="key-legend__label">Rein</span>
    </div>

    <div class="key-legend__group">
      <kbd class="key" :class="{ 'key--active': shift }">Shift</kbd>
      <span class="key-legend__label">+</span>
      <kbd class="key" :class="{ 'key--active': n && shift }">N</kbd>
      <span class="key-legend__label">Raus</span>
    </div>
  </div>
  <div class="control flex flex-row gap-4 w-full justify-center mt-4">
    <div
      class="control flex gap-4 w-full items-center justify-center mt-4 w-1/2"
    >
      <span class="w-2/5">Rekursionstiefe:</span>
      <v-slider
        v-model="recursionDepth"
        :min="0"
        :max="10"
        :step="1"
        thumb-label="always"
        hide-details
      />
    </div>
    <div
      class="control flex gap-4 w-full items-center justify-center mt-4 w-1/4"
    >
      <span class="w-1/3">Farbflächen:</span>
      <v-switch
        v-model="showFill"
        hide-details
        density="compact"
        class="flex-none toggle-switch"
      ></v-switch>
    </div>
    <div
      class="control flex gap-4 w-full items-center justify-center mt-4 w-1/4"
    >
      <span class="w-1/3">Kanten:</span>
      <v-switch
        v-model="showEdges"
        hide-details
        density="compact"
        class="flex-none toggle-switch"
      ></v-switch>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import ShapesForScene from "@/components/ShapesForScene.vue";
import { ref, computed } from "vue";
import { useTheme } from "vuetify";
import { useMagicKeys, whenever, onKeyStroke } from "@vueuse/core";

const { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, n, shift } = useMagicKeys();

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
const showFill = ref(true);
const showEdges = ref(true);
const recursionDepth = ref(2);

const azimuth = ref(0);
const altitude = ref(15);
const radius = ref(10);

const ANGLE_STEP = 5;
const RADIUS_STEP = 1;

const cameraPosition = computed(() => {
  const az = (azimuth.value * Math.PI) / 180;
  const alt = (altitude.value * Math.PI) / 180;
  return {
    x: radius.value * Math.cos(alt) * Math.sin(az),
    y: radius.value * Math.sin(alt),
    z: radius.value * Math.cos(alt) * Math.cos(az),
  };
});

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

whenever(ArrowUp, () => {
  moveCameraUp();
});
whenever(ArrowDown, () => {
  moveCameraDown();
});
whenever(ArrowLeft, () => {
  moveCameraLeft();
});
whenever(ArrowRight, () => {
  moveCameraRight();
});

onKeyStroke(["n", "N"], (e) => {
  if (e.shiftKey) moveCameraAway();
  else moveCameraCloser();
});

const moveCameraLeft = () => {
  azimuth.value = (azimuth.value - ANGLE_STEP + 360) % 360;
};
const moveCameraRight = () => {
  azimuth.value = (azimuth.value + ANGLE_STEP) % 360;
};
const moveCameraUp = () => {
  altitude.value = clamp(altitude.value + ANGLE_STEP, -85, 85);
};
const moveCameraDown = () => {
  altitude.value = clamp(altitude.value - ANGLE_STEP, -85, 85);
};
const moveCameraAway = () => {
  radius.value = clamp(radius.value + RADIUS_STEP, 3, 30);
};
const moveCameraCloser = () => {
  radius.value = clamp(radius.value - RADIUS_STEP, 3, 30);
};

const backgroundColor = computed(() => {
  if (isDark.value) {
    return "#121212";
  } else {
    return "#ffffff";
  }
});
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

.toggle-switch .v-switch__track {
  background-color: #ffffff !important;
  opacity: 1 !important;
  box-shadow: inset 0 0 0 1px #bdbdbd;
}
.toggle-switch .v-switch__thumb {
  background-color: #ffffff !important;
  color: #ffffff !important;
  box-shadow:
    0 0 0 1px #bdbdbd,
    0 1px 3px rgba(0, 0, 0, 0.3);
}

.toggle-switch .v-selection-control--dirty .v-switch__track {
  background-color: #bdbdbd !important;
  box-shadow: none;
}
.toggle-switch .v-selection-control--dirty .v-switch__thumb {
  background-color: #757575 !important;
  color: #757575 !important;
}

.key-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem 2rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: rgb(var(--v-theme-on-surface));
}
.key-legend__title {
  font-weight: 600;
}

.key-legend__group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.key-legend__label {
  opacity: 0.7;
}

.key-row {
  display: flex;
  gap: 0.25rem;
}

.key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.6rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1;
  color: rgb(var(--v-theme-on-surface));
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), 0.4);
  border-radius: 0.4rem;
  box-shadow: 0 2px 0 rgba(var(--v-border-color), 0.4);
  user-select: none;
  transition:
    transform 0.05s,
    box-shadow 0.05s,
    background-color 0.1s;
}

.key--active {
  transform: translateY(2px);
  box-shadow: 0 0 0 rgba(var(--v-border-color), 0.4);
  background: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

@media (hover: none) {
  .key-legend {
    display: none;
  }
}
</style>
