<template>
  <v-container class="h-full flex flex-col items-center" max-width="900">
    <v-img
      alt="Scheibe"
      class="mb-4"
      height="auto"
      width="auto"
      :src="imgPath"
    />
    <div class="flex gap-10">
      <v-btn :class="{ active: l }" @click="rotateLeft()">
        Rotate left (l)
      </v-btn>
      <v-btn :class="{ active: r }" @click="rotateRight()">
        Rotate right (r)
      </v-btn>
      <v-btn :class="{ active: isActive || a }" @click="toggleAutoPlay()">
        Auto: {{ currentDirection }} (a)
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useMagicKeys, useIntervalFn, whenever } from "@vueuse/core";
const { a, l, r } = useMagicKeys();

const IMAGES = [
  "0.png",
  "15.png",
  "30.png",
  "45.png",
  "60.png",
  "75.png",
  "90.png",
  "105.png",
  "120.png",
  "135.png",
  "150.png",
  "165.png",
  "180.png",
  "195.png",
  "210.png",
  "225.png",
  "240.png",
  "255.png",
  "270.png",
  "285.png",
  "300.png",
  "315.png",
  "330.png",
  "345.png",
];

const currentImageIndex = ref(0);
const currentImage = computed(() => IMAGES[currentImageIndex.value]);
const imgPath = computed(
  () =>
    new URL(`../assets/scheibe/${currentImage.value}`, import.meta.url).href,
);

type Direction = "left" | "right";
const currentDirection = ref<Direction>("right");

const rotate = () => {
  if (currentDirection.value === "right") {
    if (currentImageIndex.value < IMAGES.length - 1) {
      currentImageIndex.value++;
    } else {
      currentImageIndex.value = 0;
    }
  } else if (currentDirection.value === "left") {
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--;
    } else {
      currentImageIndex.value = IMAGES.length - 1;
    }
  }
};

const { isActive, pause, resume } = useIntervalFn(rotate, 150, {
  immediate: false,
});

const toggleAutoPlay = () => (isActive.value ? pause() : resume());

const rotateLeft = () => {
  setDirection("left");
  rotate();
};
const rotateRight = () => {
  setDirection("right");
  rotate();
};

whenever(a, () => {
  toggleAutoPlay();
});
whenever(l, () => {
  rotateLeft();
});
whenever(r, () => {
  rotateRight();
});

const setDirection = (direction: Direction) => {
  currentDirection.value = direction;
};
</script>

<style scoped>
@reference "../styles/tailwind.css";

.active {
  background-color: var(--color-background);
}
</style>
