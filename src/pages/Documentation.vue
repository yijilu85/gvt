<template>
  <div class="documentation-view">
    <article class="mb-8">
      <h2 class="text-2xl font-bold mb-4">
        Graphical Visualisation Technologies EA 2: 2D Geometrie aus Linien
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
          WebGL Engine
          <a
            href="https://threejs.org/"
            target="_blank"
            class="text-primary underline"
            >Three.js</a
          >
        </li>
        <li>
          Vue3 Three.js Wrapper
          <a
            href="https://tresjs.org/"
            target="_blank"
            class="text-primary underline"
            >Tres.js</a
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
        Die Webanwendung wurde mit einer simplen Vue-JS Single Page Application
        realisiert.
      </p>
      <p>
        Als WebGL Engine wurde die Three.js Library verwendet. Tres.js ist ein
        Open-Source Wrapper, das Three.js Funktionalität als Vue-Komponenten
        bereitstellt.
      </p>
      <p>
        Das Hosting und Deployment erfolgt über Github Pages, die CI/CD-Pipeline
        wird mit Github Actions umgesetzt.
      </p>
    </article>
    <article>
      <h2 class="text-2xl font-bold mb-4">Implementation</h2>
      <p>
        Die zentrale Komponente <code>RoseGenerator.vue</code> ist für das
        Rendern der Blütenform zuständig. Sie erhält vom Parent-Komponent
        <code>WebGL.vue</code> die Parameter für Blütenzahl (petals) und
        Vertices-Anzal (vertices), die über Slider im Interface gesteuert werden
        können.
      </p>
      <p>
        Die zentrale Komponente RoseGenerator.vue ist für das Rendern der
        Blütenform zuständig. Sie erhält vom Parent-Komponent die Parameter für
        Blütenzahl (petals) und Vertices-Anzal (vertices), die über Slider im
        Interface gesteuert werden können.
      </p>
      <pre class="doc-code-block"><strong>Parent-Komponente WebGL.vue</strong>
       {{ parentTemplate }}
      </pre>
      <p>
        Bei jeder Änderung der Parameter <code>petals</code> und
        <code>vertices</code> wird in der Child-Komponente die Funktion
        <code>makeRose</code>
        neu ausgeführt. Sie berechnet die Blütenform prozedural: Die Vertices
        werden gleichmäßig über den Vollkreis verteilt, und für jeden Winkel
        <span class="quote">θ</span> wird der Abstand zum Mittelpunkt mit der
        Rosenkurve
        <span class="quote">r = |cos(petals · θ / 2)| · radius</span> bestimmt.
        Die Kurve hat dadurch genau <span class="quote">petals</span> Blätter,
        deren Spitzen im Abstand <span class="quote">radius</span> liegen und
        die sich im Mittelpunkt treffen. Die Anzahl der Vertices pro Blatt
        bestimmt, wie glatt oder kantig die Blätter wirken: Wenige Vertices
        ergeben eckige Blätter, viele eine glatte Kurve. Aus Winkel und Abstand
        werden die x- und z-Koordinaten berechnet
        <span class="quote">(y = 0)</span>, in ein
        <code>Float32Array</code> geschrieben und als
        <code>BufferGeometry</code> mit einer <code>LineLoop</code> gezeichnet.
      </p>
      <pre
        class="doc-code-block"
      ><strong>Child-Komponente RoseGenerator.vue</strong>
       {{ childTemplate }}
      </pre>
    </article>
  </div>
</template>

<script lang="ts" setup>
const parentTemplate = `
<template>
  <TresCanvas class="tres-canvas" clear-color="#FFFFFF" window-size>
    <RoseGenerator :petals="petals" :vertices="vertices" />
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

import { TresCanvas } from "@tresjs/core";
import RoseGenerator from "@/components/RoseGenerator.vue";
import { ref } from "vue";

const petals = ref(5);
const vertices = ref(10);`;

const childTemplate = `
<template>
  <TresPerspectiveCamera
    :position="[0, cameraHeight, 0]"
    :look-at="[0, 0, 0]"
  />
  <TresLineLoop :geometry="pattern">
    <TresLineBasicMaterial color="#8514D9" />
  </TresLineLoop>

  <TresGridHelper :args="[6, 16, '#D9D9D9', '#D9D9D9']" />
</template>

import { BufferAttribute, BufferGeometry } from "three";
import { computed } from "vue";
import { useMediaQuery } from "@vueuse/core";

const isMobile = useMediaQuery("(max-width: 640px)");

const cameraHeight = computed(() => (isMobile.value ? 15 : 10));
const radius = computed(() => (isMobile.value ? 1.5 : 2));

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
});`;
</script>

<style scoped>
p {
  margin-bottom: 1em;
}

code {
  color: #322e94;
}

.quote {
  font-style: italic;
  font-weight: 600;
}
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
