<template>
  <v-container class="h-full flex flex-col items-center" max-width="900">
    <div v-if="!imagesReady" class="mb-4 text-sm text-medium-emphasis">
      Loading animation frames...
    </div>
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
import { ref, computed, onMounted } from "vue";
import { useMagicKeys, useIntervalFn, whenever } from "@vueuse/core";
const { a, l, r } = useMagicKeys();

const IMAGES = [
  "0.jpg",
  "15.jpg",
  "30.jpg",
  "45.jpg",
  "60.jpg",
  "75.jpg",
  "90.jpg",
  "105.jpg",
  "120.jpg",
  "135.jpg",
  "150.jpg",
  "165.jpg",
  "180.jpg",
  "195.jpg",
  "210.jpg",
  "225.jpg",
  "240.jpg",
  "255.jpg",
  "270.jpg",
  "285.jpg",
  "300.jpg",
  "315.jpg",
  "330.jpg",
  "345.jpg",
];

const currentImageIndex = ref(0);
const imagesReady = ref(false);
const imageUrls = computed(() =>
  IMAGES.map((file) => new URL(`../assets/scheibe/${file}`, import.meta.url).href),
);
const currentImage = computed(() => IMAGES[currentImageIndex.value]);
const imgPath = computed(() => imageUrls.value[currentImageIndex.value]);

const preloadImages = async () => {
  await Promise.all(
    imageUrls.value.map(
      (url) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = url;
        }),
    ),
  );

  imagesReady.value = true;
};

onMounted(() => {
  void preloadImages();
});

type Direction = "left" | "right";
const currentDirection = ref<Direction>("right");

const rotate = () => {
  if (!imagesReady.value) return;

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

const toggleAutoPlay = () => {
  if (!imagesReady.value) return;
  if (isActive.value) pause();
  else resume();
};

const rotateLeft = () => {
  if (!imagesReady.value) return;
  setDirection("left");
  rotate();
};
const rotateRight = () => {
  if (!imagesReady.value) return;
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
