<template>
  <TresCanvas class="tres-canvas" :clear-color="backgroundColor" window-size>
    <ShapesForScene
      :recursionDepth="recursionDepth"
      :showFill="showFill"
      :showEdges="showEdges"
      :cameraPosition="cameraPosition"
    />
  </TresCanvas>
  <div class="control flex flex-row gap-4 w-full justify-center mt-4">
    <div class="control flex gap-4 w-full items-center justify-center mt-4">
      <span class="w-1/3">Rekursionstiefe:</span>
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
      <span class="w-1/3">Show fill:</span>
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
      <span class="w-1/3">Show edges:</span>
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

/* aus: Track und Knopf weiß */
.toggle-switch .v-switch__track {
  background-color: #ffffff !important;
  opacity: 1 !important;
  box-shadow: inset 0 0 0 1px #bdbdbd; /* Rand, damit der Track auf hellem Grund sichtbar bleibt */
}
.toggle-switch .v-switch__thumb {
  background-color: #ffffff !important;
  color: #ffffff !important;
  box-shadow:
    0 0 0 1px #bdbdbd,
    0 1px 3px rgba(0, 0, 0, 0.3);
}

/* an: Track und Knopf grau */
.toggle-switch .v-selection-control--dirty .v-switch__track {
  background-color: #bdbdbd !important;
  box-shadow: none;
}
.toggle-switch .v-selection-control--dirty .v-switch__thumb {
  background-color: #757575 !important;
  color: #757575 !important;
}
</style>
