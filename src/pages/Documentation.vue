<template>
  <div class="documentation-view">
    <article class="mb-8">
      <h2 class="text-2xl font-bold mb-4">
        Graphical Visualisation Technologies EA 3: Farbig gefüllte 2D Geometrie
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
        Die zentrale Komponente <code>RoseGeneratorFill.vue</code> ist für das
        Rendern der Blütenform zuständig. Sie erhält vom Parent-Komponent
        <code>WebGL.vue</code> die Parameter für Blütenzahl (petals) und
        Vertices-Anzal (vertices), die über Slider im Interface gesteuert werden
        können.
      </p>
      <p>
        Das Design ist Darkmode kompatibel, d.h. Canvas-Hintergrund, Raster- und
        Formfarbe berücksichtigen den Browser-Darkmode und passen sich
        entsprechend an.
      </p>
      <p>
        Die zentrale Komponente RoseGeneratorFill.vue ist für das Rendern der
        Blütenform zuständig. Sie erhält vom Parent-Komponent die Parameter für
        Blütenzahl (petals) und Vertices-Anzal (vertices), die über Slider im
        Interface gesteuert werden können.
      </p>
      <p>
        Bei jeder Änderung der Parameter <code>petals</code> und
        <code>vertices</code> wird in der Child-Komponente die Funktion
        <code>makeRose</code>
        neu ausgeführt. Sie berechnet die Blütenform prozedural: Die Vertices
        werden gleichmäßig über den Vollkreis verteilt, und für jeden Winkel
        <span class="quote">θ</span> wird der Abstand zum Mittelpunkt mit der
        Rosenkurve
        <span class="quote">r = |cos(petalCount · θ / 2)| · radius</span>
        bestimmt. Die Kurve hat dadurch genau
        <span class="quote">petalCount</span> Blätter, deren Spitzen im Abstand
        <span class="quote">radius</span> liegen und die sich im Mittelpunkt
        treffen. Die Anzahl der Vertices pro Blatt bestimmt, wie glatt oder
        kantig die Blätter wirken: Wenige Vertices ergeben eckige Blätter, viele
        eine glatte Kurve. Aus Winkel und Abstand werden die x- und
        z-Koordinaten berechnet <span class="quote">(y = 0)</span>, in ein
        <code>Float32Array</code> geschrieben und als
        <code>BufferGeometry</code> mit einer <code>TresMesh</code> gezeichnet.
      </p>
      <pre
        class="doc-code-block"
      ><strong>Dynamische Vertices-Generierung für Petals</strong>
       {{ positions }}
      </pre>

      <p>
        Damit ergeben sich bei 5 Petals und 10 Vertices pro Petal folgende
        Vertices:
      </p>
      <v-img
        :width="700"
        aspect-ratio="16/9"
        cover
        src="../assets/doc-imgs/petal-vertices.jpg"
      ></v-img>
      <p>
        Für die Triangulation wird nun jedes Petal einzeln betrachtet. Ausgehend
        von der Spitze des Petals wird ein doppeltes Reißverschlussverfahren
        genutzt, um jeweils mit 2 hochzählenden Pointern Dreiecke zu generieren.
        Pro Petal mit 10 Vertices ergeben sich daraus 8 Dreiecke:
      </p>
      <v-img
        :width="900"
        aspect-ratio="16/9"
        cover
        src="../assets/doc-imgs/triangulation.jpg"
      ></v-img>
      <pre class="doc-code-block"><strong>Triangulation eines Petal</strong>
       {{ triangulation }}
      </pre>
      <p>
        Die Vertices werden dann einmal als Fläche und einmal als Wireframe
        gerendered.
      </p>
      <pre class="doc-code-block"><strong>Rendering des Template</strong>
       {{ template }}
      </pre>
    </article>
  </div>
</template>

<script lang="ts" setup>
const positions = `
const positions = computed(() => {
  const n = vertexCount.value;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2;
    const r = Math.abs(Math.cos((petalCount.value * theta) / 2)) * radius.value;
    pos[i * 3] = r * Math.cos(theta);
    pos[i * 3 + 1] = 0;
    pos[i * 3 + 2] = r * Math.sin(theta);
  }
  return new BufferAttribute(pos, 3);
});`;

const triangulation = `
const triangulatePetal = (tip: number, vpp: number, n: number): number[] => {
  const half = vpp / 2;
  const w = (i: number) => ((i % n) + n) % n;

  let a = tip - 1;
  let b = tip + 1;
  const triagles: number[] = [w(tip), w(a), w(b)];

  let lowerLeft = half - 1;
  let upperLeft = half - 2;
  let lowerTurn = true;

  while (lowerLeft > 0 || upperLeft > 0) {
    if ((lowerTurn && lowerLeft > 0) || upperLeft === 0) {
      const next = a - 1;
      triagles.push(w(b), w(a), w(next));
      a = next;
      lowerLeft--;
    } else {
      const next = b + 1;
      triagles.push(w(a), w(next), w(b));
      b = next;
      upperLeft--;
    }
    lowerTurn = !lowerTurn;
  }
  return triagles;
};

const indices = computed(() =>
  Array.from({ length: petalCount.value }, (_, k) =>
    triangulatePetal(k * vpp.value, vpp.value, vertexCount.value),
  ).flat(),
);`;

const template = `
<template>
  <TresPerspectiveCamera
    :position="[0, cameraHeight, 0]"
    :look-at="[0, 0, 0]"
  />
  <TresGridHelper
    :key="gridColor"
    :position="[0, -0.02, 0]"
    :args="[5.5, 16, gridColor, gridColor]"
  />
  <TresMesh :geometry="fillGeometry" :position="[0, -0.01, 0]">
    <TresMeshBasicMaterial :color="fillColor" :side="2" />
  </TresMesh>

  <TresMesh
    :geometry="fillGeometry"
    :position="[0, -0.005, 0]"
    v-if="showTriangles"
  >
    <TresMeshBasicMaterial :color="edgeColor" :wireframe="true" />
  </TresMesh>
</template>

...

const fillGeometry = computed(() => {
  const geo = new BufferGeometry();
  geo.setAttribute("position", positions.value);
  geo.setIndex(indices.value);
  return geo;
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

@media (prefers-color-scheme: dark) {
  .doc-code-block {
    background: #2e2e2e;
  }
  code {
    color: #85bced;
  }
}
</style>
