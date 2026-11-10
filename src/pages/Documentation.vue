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
      <p>
        Zur Konsultation und Hilfe beim Übersetzen der Formeln sowie eigenen
        Parametrisierung wurde
        <a
          href="https://claude.ai/"
          target="_blank"
          class="text-primary underline"
          >Claude AI</a
        >
        als KI Tool eingesetzt.
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
      <h3 class="text-xl font-bold mb-2 mt-8">Koordinatensystem</h3>
      <p>
        In allen Flächen zeigt in der Szene die y-Achse nach oben. Die Formeln
        aus der Quelle verwenden z als Höhenachse, deshalb werden die Achsen
        vertauscht:
      </p>
      <h3 class="text-xl font-bold mb-2 mt-8">
        Farbverlauf der Flächen und Wireframe
      </h3>
      <p>
        Jeder Vertex erhält einen Helligkeitswert zwischen 0,25 (unterster
        Punkt) und 1,0 (oberster Punkt), berechnet aus seiner Höhe (Vertex
        Colors). Dieser Wert wird mit der Materialfarbe multipliziert:
        <code>#8EC5FF</code> auf der Vorderseite (hellblau nach dunkelblau) und
        <code>#D9B8FF</code> auf der Rückseite (helllila nach dunkellila). Dafür
        wird dieselbe Geometrie zweimal gerendert, einmal mit
        <code>FrontSide</code> und einmal mit <code>BackSide</code>. Die Linien
        sind <code>LineSegments</code> entlang der Gitterkanten (ohne
        Diagonalen) und bleiben auch bei ausgeblendeter Füllung sichtbar. Bei
        den geschlossenen Flächen ist nur die Außenseite sichtbar, die Rückseite
        wird erst bei den offenen Flächen sichtbar.
      </p>
      <pre
        class="doc-code-block"
      ><strong>Rendering von Vorderseite, Rückseite und Wireframe</strong>
       {{ templates }}
      </pre>
      <h3 class="text-xl font-bold mb-2 mt-8">
        Feste parametrisierte Formen Kidney Surface und Bohemian Dome
      </h3>
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
      <h3 class="text-xl font-bold mb-2 mt-8">
        Whitney Umbrella – modifiziert
      </h3>
      <p>
        Ausgangspunkt ist der <code>Whitney Umbrella</code> (<a
          href="http://www.3d-meier.de/tut3/Seite22.html"
          target="_blank"
          class="text-primary underline"
          >http://www.3d-meier.de/tut3/Seite22.html</a
        >) mit den Gleichungen <code>x = u·v</code>, <code>y = u</code>,
        <code>z = v²</code> und <code>u, v ∈ [−1,5; 1,5]</code>. Die Fläche ist
        eine Regelfläche: Für festes v ist sie eine Gerade in Richtung (v, 1, 0)
        durch die Schirmachse. Entlang der Achse durchdringt sich die Fläche
        selbst (Doppellinie), im Ursprung liegt der Pinch Point.
      </p>
      <p>
        Im Original lässt sich der Öffnungswinkel nicht steuern. Die
        <strong>eigene Variante</strong> ersetzt deshalb die Parametrisierung
        durch eine Richtungsparametrisierung: Jede Zeile ist eine Gerade durch
        die Schirmachse in der Höhe v² mit einer Richtung ψ(v) in der
        Horizontalebene. Der Parameter <code>angle</code> legt fest, wie weit
        sich diese Richtungen auffächern.
      </p>
      <pre class="doc-code-block"><strong>Eigene Parametrisierung</strong>
{{ whiteneyCustom }}
        </pre>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Parameter</th>
            <th class="text-left">Bedeutung</th>
            <th class="text-left">Wirkung</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>U (Prop <code>u</code>)</td>
            <td>halbe Länge jeder Zeile</td>
            <td>Breite der Flügel 2U, unabhängig vom Winkel</td>
          </tr>
          <tr>
            <td>V (Prop <code>v</code>)</td>
            <td>Parameterbereich in Höhenrichtung</td>
            <td>Höhe der obersten Zeilen V² (wächst quadratisch)</td>
          </tr>
          <tr>
            <td>θ (Prop <code>angle</code>)</td>
            <td>Öffnungswinkel zwischen den beiden Randkanten</td>
            <td>Slider 10° bis 170°, im Code auf [1°, 170°] begrenzt</td>
          </tr>
        </tbody>
      </v-table>
      <h4 class="text-lg font-bold mb-2 mt-6">Grenzen</h4>
      <p>
        Für θ → 180° geht tan(θ/2) gegen unendlich. Der Winkel ψ springt dann
        nahe v = 0 fast sprunghaft von einem Ende zum anderen. Bei 24 Zeilen
        liegt nur die mittlere Zeile in diesem Übergang, wodurch sich ein
        flaches Dreieck am Boden um den Pinch Point bildet. Deshalb ist θ auf
        170° begrenzt. Wie das Original ist die Fläche nicht abwickelbar, die
        Gitterzellen werden also verzerrt. Sie ist keine exakte Lösung der
        Whitney-Gleichung, behält aber die Struktur: gerade Zeilen,
        Selbstdurchdringung entlang der Achse und den Pinch Point im Ursprung.
      </p>
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

const whiteneyCustom = `
u ∈ [−U, U],  v ∈ [−V, V],  θ = angle

ψ(v) = arctan( tan(θ/2) · v / V ) + θ/2 + 45°

x(u, v) = u · sin ψ(v)
y(u, v) = v²
z(u, v) = u · cos ψ(v)`;
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
      pos[k] = u * Math.sin(psi);
      pos[k + 1] = v * v;
      pos[k + 2] = u * Math.cos(psi);
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
