<template>
  <div class="documentation-view">
    <article class="mb-8">
      <h2 class="text-2xl font-bold mb-4">
        Graphical Visualisation Technologies EA 4: Parametrisierte Flächen
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
        Die zentrale Komponente <code>ParametricSheet.vue</code> ist für das
        Rendern der parametrisierten Fläche zuständig. Sie steuert das Toggle
        der Form und das Rendering der Control-Slider.
      </p>
      <pre class="doc-code-block"><strong>Control Component</strong>
       {{ control }}
      </pre>
      <p>
        Es werden 3 Formen dargestellt: <code>Kidney Surface</code>,
        <code>Bohemian Dome</code> und ein modifizierter
        <code>Whitney Umbrella</code>. Dafür werden jeweils für die Vorderseite
        ein blauer Farbverlauf und für die Rückseite ein lila Farbverlauf
        gewählt.
      </p>
      <pre
        class="doc-code-block"
      ><strong>Rendering von Vorderseite, Rückseite und Wireframe</strong>
       {{ templates }}
      </pre>
      <p>
        Die Formen <code>Kidney Surface</code> und
        <code>Bohemian Dome</code> haben jeweils feste Parameter und werden mit
        jeweils mit einer Auflösung von <code>uSegments: 32</code> und
        <code>vSegments: 64</code> initialisiert.
      </p>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Fläche</th>
            <th class="text-left">U</th>
            <th class="text-left">V</th>
            <th class="text-left">Konstanten</th>
            <th class="text-left">Quelle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bohemian Dome</td>
            <td>[0, 2π]</td>
            <td>[0, 2π]</td>
            <td>a= 0.8<br />b= 1.4<br />c= 1.1</td>
            <td>
              <a
                href="http://www.3d-meier.de/tut3/Seite5.html"
                target="_blank"
                class="text-primary underline"
                >http://www.3d-meier.de/tut3/Seite5.html</a
              >
            </td>
          </tr>
          <tr>
            <td>Kidney Surface</td>
            <td>[0, 2π]</td>
            <td>[−π/2, π/2]</td>
            <td></td>
            <td>
              <a
                href="http://www.3d-meier.de/tut3/Seite42.html"
                target="_blank"
                class="text-primary underline"
                >http://www.3d-meier.de/tut3/Seite42.html</a
              >
            </td>
          </tr>
        </tbody>
      </v-table>
      <pre class="doc-code-block"><strong>Bohemian Dome</strong>
       {{ bohemian }}
      </pre>
      <pre class="doc-code-block"><strong>Kidney Surface</strong>
       {{ kidney }}
      </pre>
      <p>
        Die modifizierte Fläche <code>Whitney Umbrella</code> hat dynamische
        Parameter.
      </p>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Fläche</th>
            <th class="text-left">U</th>
            <th class="text-left">V</th>
            <th class="text-left">Angle</th>
            <th class="text-left">Quelle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Modifizierter Whitney Umrella</td>
            <td>dynamisch</td>
            <td>dynamisch</td>
            <td>dynamisch</td>
            <td>
              <a
                href="http://www.3d-meier.de/tut3/Seite22.html"
                target="_blank"
                class="text-primary underline"
                >http://www.3d-meier.de/tut3/Seite22.html</a
              >
            </td>
          </tr>
        </tbody>
      </v-table>
      <pre
        class="doc-code-block"
      ><strong>Modifizierter Whitney Umbrella</strong>
       {{ whiteney }}
      </pre>
    </article>
  </div>
</template>

<script lang="ts" setup>
const control = `
  <div class="control flex justify-center">
    <v-btn @click="incrementCurrentShapeIndex"> Next Shape </v-btn>
  </div>
  <div class="control flex justify-center mt-8 text-xl">
    {{ currentShape.label }}
  </div>

 <TresCanvas class="tres-canvas" :clear-color="backgroundColor" window-size>
    <SheetGenerator
      :u="u"
      :v="v"
      :angle="angle"
      :showFill="showFill"
      v-if="isCurrentShape('umbrella')"
    />
    <Kidney :showFill="showFill" v-if="isCurrentShape('kidney')" />
    <BohemianDome :showFill="showFill" v-if="isCurrentShape('bohemian')" />
  </TresCanvas>

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
};`;

const bohemian = `
const A = 0.8;
const B = 1.4;
const C = 1.1;
const TWO_PI = 2 * Math.PI;
const ROTATION = (-45 * Math.PI) / 180;

const scale = computed(() => props.size / (2 * (A + B)));
const height = computed(() => 2 * C * scale.value);

const positions = computed(() => {
  const nu = props.uSegments;
  const nv = props.vSegments;
  const stride = nu + 1;
  const pos = new Float32Array(stride * (nv + 1) * 3);
  const s = scale.value;

  for (let row = 0; row <= nv; row++) {
    const v = (TWO_PI * row) / nv;
    const bCos = B * Math.cos(v);
    const cSin = C * Math.sin(v);

    for (let col = 0; col <= nu; col++) {
      const u = (TWO_PI * col) / nu;

      const fx = A * Math.cos(u);
      const fy = bCos + A * Math.sin(u);
      const fz = cSin;

      const cosR = Math.cos(ROTATION);
      const sinR = Math.sin(ROTATION);

      const x0 = s * fy;
      const z0 = s * fx;

      const k = (row * stride + col) * 3;
      pos[k] = x0 * cosR - z0 * sinR;
      pos[k + 1] = s * (fz + C);
      pos[k + 2] = x0 * sinR + z0 * cosR;
    }
  }
  return new BufferAttribute(pos, 3);
});`;

const kidney = `
const positions = computed(() => {
  const nu = props.uSegments;
  const nv = props.vSegments;
  const stride = nu + 1;
  const pos = new Float32Array(stride * (nv + 1) * 3);

  const scale = props.size / 8;
  const yOffset = props.size / 2;

  for (let row = 0; row <= nv; row++) {
    const v = -Math.PI / 2 + (Math.PI * row) / nv;
    const r = 3 * Math.cos(v) - Math.cos(3 * v);
    const h = 3 * Math.sin(v) - Math.sin(3 * v);

    for (let col = 0; col <= nu; col++) {
      const u = (2 * Math.PI * col) / nu;

      const k = (row * stride + col) * 3;
      pos[k] = scale * r * Math.cos(u);
      pos[k + 1] = scale * h + yOffset;
      pos[k + 2] = scale * r * Math.sin(u);
    }
  }
  return new BufferAttribute(pos, 3);
});`;

const whiteney = `
const props = withDefaults(
  defineProps<{
    size?: number;
    segments?: number;
    u: number;
    v: number;
    angle: number;
    showFill: Boolean;
  }>(),
  { size: 4, segments: 24 },
);

const thetaRad = computed(
  () => (Math.min(Math.max(props.angle, 1), 170) * Math.PI) / 180,
);

const positions = computed(() => {
  const n = props.segments;
  const pos = new Float32Array((n + 1) * (n + 1) * 3);

  const half = thetaRad.value / 2;
  const t = Math.tan(half);
  const base = half + (45 * Math.PI) / 180;

  for (let row = 0; row <= n; row++) {
    for (let col = 0; col <= n; col++) {
      const u = props.u * (-1 + (2 * col) / n);
      const vNorm = -1 + (2 * row) / n; // -1 … 1
      const v = props.v * vNorm;

      const psi = Math.atan(t * vNorm) + base;

      const k = (row * (n + 1) + col) * 3;
      pos[k] = u * Math.sin(psi); // x
      pos[k + 1] = v * v; // y
      pos[k + 2] = u * Math.cos(psi); // z
    }
  }
  return new BufferAttribute(pos, 3);
});`;

const templates = `
  <TresMesh :geometry="surfaceGeometry" v-if="showFill">
    <TresMeshBasicMaterial
      :color="frontColor"
      :vertex-colors="true"
      :side="FrontSide"
      :polygon-offset="true"
      :polygon-offset-factor="1"
      :polygon-offset-units="1"
    />
  </TresMesh>

  <TresMesh :geometry="surfaceGeometry" v-if="showFill">
    <TresMeshBasicMaterial
      :color="backColor"
      :vertex-colors="true"
      :side="BackSide"
      :polygon-offset="true"
      :polygon-offset-factor="1"
      :polygon-offset-units="1"
    />
  </TresMesh>

  <TresLineSegments :geometry="lineGeometry">
    <TresLineBasicMaterial :color="edgeColor" />
  </TresLineSegments>`;
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
