<template>
  <div class="documentation-view">
    <article class="mb-8">
      <h2 class="text-2xl font-bold mb-4">
        Graphical Visualisation Technologies EA 1: Interaktiv animierte Scheibe
      </h2>
      <p>Yi-Ji Lu<br />BHT Berlin<br />Matrikelnummer: 929655</p>
    </article>
    <article class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Tech Stack</h2>
      <ul>
        <li>
          Frontend Framework:
          <a
            href="https://vuejs.org/"
            target="_blank"
            class="text-primary underline"
            >Vue.js</a
          >
        </li>
        <li>
          Build Tool
          <a
            href="https://vite.dev/"
            target="_blank"
            class="text-primary underline"
            >Vite</a
          >
        </li>
        <li>
          Frontend UI Library:
          <a
            href="https://vuetifyjs.com/en/introduction/why-vuetify/"
            target="_blank"
            class="text-primary underline"
            >Vuetify</a
          >
        </li>
        <li>
          Hosting, Deployment und CI/CD:
          <a
            href="https://github.com/"
            target="_blank"
            class="text-primary underline"
            >Github Pages/Github Actions</a
          >
        </li>
      </ul>
      <p>
        <br />
        Die Webanwendung wurde mit einer simplen Vue-JS Single Page Application
        realisiert.
      </p>
      <p>
        Das Hosting und Deployment erfolgt über Github Pages, die CI/CD-Pipeline
        wird mit Github Actions umgesetzt.
      </p>
    </article>
    <article>
      <h2 class="text-2xl font-bold mb-4">Implementation</h2>
      <p>
        Ein Bild (Kreis mit einem Muster) wurde in 24 Einzelbildern erstellt mit
        je 15° Drehung. Alle Bildpfade sind in einem Array definiert. Die
        Rotation wird über ein Inkrementieren/Dekrementieren des Array-Index
        realisiert. Eventlistener registrieren Key-Press und Button Press und
        rotieren das Bild in der aktuellen Laufrichtung. Mit rotate left /
        rotate right Aktionen wird die Richtung geändert. Autoplay rotiert die
        Scheibe im Interval von 150ms.
      </p>
      <p>
        <br />
        Die Anwendung kann über Tastatureingabe oder Button-Klick gesteuert
        werden
      </p>
      <pre class="doc-code-block"><strong>Code-Snippet</strong>
       {{ rawTemplate }}
      </pre>
    </article>
  </div>
</template>

<script lang="ts" setup>
const rawTemplate = `
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
    new URL(../assets/scheibe/{currentImage.value}, import.meta.url).href,
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
};`;
</script>

<style scoped>
.documentation-view {
  width: 100%;
  min-width: 0;
}

.doc-code-block {
  display: block;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  background: #f1f6ff;
  color: inherit;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 0.9rem;
  margin: 1rem 0;
}

@media (max-width: 640px) {
  .doc-code-block {
    padding: 0.7rem;
    font-size: 0.75rem;
  }
}
</style>
