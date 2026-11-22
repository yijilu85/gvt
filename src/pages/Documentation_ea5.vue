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
        Die zentrale Komponente <code>ShapesForScene.vue</code> ist für die
        Objektgenerierung und das Rendering der Szene zuständig. Es werden ein
        Würfel und eine Pryramide als zwei feste Grundformen sowie eine
        parametrisierte Kugel mit dynamischer Rekursionstiefe generiert. Es wird
        eine generalisierte Methode <code>buildFaces</code> definiert, die für
        jedes Objekt aufgerufen wird.
      </p>
      <h3 class="text-xl font-bold mb-2 mt-8">Objektgenerierung</h3>

      <p>
        <code>buildFaces</code> erzeugt aus einer Liste von Polygonflächen die
        Geometrie für ein Objekt. Jede Fläche wird durch zwei Farben
        (<code>from</code>, <code>to</code>) und ihre Eckpunkte
        (<code>verts</code>) beschrieben. Die Eckpunkte müssen von außen gesehen
        gegen den Uhrzeigersinn angegeben werden, damit die Vorderseite nach
        außen zeigt.
      </p>
      <pre class="doc-code-block"><strong>buildFaces</strong>
       {{ buildFaces }}
      </pre>
      <pre class="doc-code-block"><strong>Würfel</strong>
       {{ cube }}
      </pre>
      <pre class="doc-code-block"><strong>Pyramide</strong>
       {{ pyramid }}
      </pre>
      <p>
        Für die rekursive Kugelgenerierung wird ein Oktaeder als Ausgangsform
        verwendet, jeder seiner Flächen in 4 Dreiecke geteilt und die neuen
        Vertices auf den Radius normalisiert. Ein dynamischer Parameter
        <code>recursionDepth</code> steuert die Tiefe der Rekursion, d.h.
        steuert die Rundheit der Kugel.
      </p>
      <pre class="doc-code-block"><strong>Rekursive Kugelgenerierung</strong>
       {{ sphere }}
      </pre>
      <h3 class="text-xl font-bold mb-2 mt-8">Kamerasteuerung</h3>
      <p>
        Die Kamerasteuerung erfolgt maßgeblich in der Komponente
        <code>CameraScene.vue</code>. Hierfür werden drei Werte
        <code>azimut</code> (horizontal), <code>altitude</code>(vertikal) und
        <code>radius</code> (Distanz) mit Default-Werten initialisiert und durch
        Benutzerinteraktion verändert. Die Pfeiltasten ändern den Winkel je um
        5° in eine Richtung und den Radius um Schritt 1. Anhand der drei Werte
        wird eine Position auf einem Orbit um die Szene herum mit
        <code>x</code>, <code>y</code> und <code>z</code> Koordinaten berechnet.
      </p>

      <pre class="doc-code-block"><strong>Kamerasteuerung</strong>
       {{ cameraControl }}
      </pre>
      <p>
        Die Rendering-Komponente erhält immer nur die berechneten Koordinaten
        und positioniert die Kamera dort mit Blick auf den Ursprung.
      </p>
      <pre class="doc-code-block"><strong>Kamerapositionierung</strong>
       {{ cameraPos }}
      </pre>
    </article>
  </div>
</template>

<script lang="ts" setup>
const cameraControl = `
const azimuth = ref(0);
const altitude = ref(15);
const radius = ref(10);

const ANGLE_STEP = 5;
const RADIUS_STEP = 1;

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

const cameraPosition = computed(() => {
  const az = (azimuth.value * Math.PI) / 180;
  const alt = (altitude.value * Math.PI) / 180;
  return {
    x: radius.value * Math.cos(alt) * Math.sin(az),
    y: radius.value * Math.sin(alt),
    z: radius.value * Math.cos(alt) * Math.cos(az),
  };
});
`;

const cube = `
const cube = computed<Geometries>(() => {
  const h = 0.75 * unit.value;
  return buildFaces([
    {
      from: "#991B1B",
      to: "#FCA5A5",
      verts: [
        [h, -h, h],
        [h, -h, -h],
        [h, h, -h],
        [h, h, h],
      ],
    },
    {
      from: "#9A3412",
      to: "#FDBA74",
      verts: [
        [-h, -h, -h],
        [-h, -h, h],
        [-h, h, h],
        [-h, h, -h],
      ],
    },
    {
      from: "#A16207",
      to: "#FDE047",
      verts: [
        [-h, h, h],
        [h, h, h],
        [h, h, -h],
        [-h, h, -h],
      ],
    },
    {
      from: "#166534",
      to: "#86EFAC",
      verts: [
        [-h, -h, -h],
        [h, -h, -h],
        [h, -h, h],
        [-h, -h, h],
      ],
    },
    {
      from: "#1E40AF",
      to: "#93C5FD",
      verts: [
        [-h, -h, h],
        [h, -h, h],
        [h, h, h],
        [-h, h, h],
      ],
    },
    {
      from: "#6B21A8",
      to: "#D8B4FE",
      verts: [
        [h, -h, -h],
        [-h, -h, -h],
        [-h, h, -h],
        [h, h, -h],
      ],
    },
  ]);
});`;

const pyramid = `
const pyramid = computed<Geometries>(() => {
  const b = 0.75 * unit.value;
  const h = 0.75 * unit.value;

  const p0: [number, number, number] = [-b, -h, -b];
  const p1: [number, number, number] = [b, -h, -b];
  const p2: [number, number, number] = [b, -h, b];
  const p3: [number, number, number] = [-b, -h, b];
  const apex: [number, number, number] = [0, h, 0];

  const tip = "#FFEDD5";

  return buildFaces([
    { from: "#9D174D", to: "#F9A8D4", verts: [p3, p2, apex] },
    { from: "#155E75", to: "#67E8F9", verts: [p2, p1, apex] },
    { from: "#3F6212", to: "#BEF264", verts: [p1, p0, apex] },
    { from: "#3730A3", to: "#A5B4FC", verts: [p0, p3, apex] },
    { from: "#1E293B", to: "#64748B", verts: [p0, p1, p2, p3] },
  ]);
});`;

const sphere = `
const sphere = computed<Geometries>(() => {
  const depth = Math.min(Math.max(Math.round(props.recursionDepth), 0), 6);
  const radius = unit.value;

  const verts: number[] = [];
  const cache = new Map<string, number>();

  const addVertex = (x: number, y: number, z: number) => {
    const len = Math.hypot(x, y, z);
    verts.push(x / len, y / len, z / len);
    return verts.length / 3 - 1;
  };

  const midpoint = (a: number, b: number) => {
    const key = a < b ? "{a}_{b} : {b}_{a}";
    const hit = cache.get(key);
    if (hit !== undefined) return hit;
    const i = addVertex(
      (verts[a * 3] + verts[b * 3]) / 2,
      (verts[a * 3 + 1] + verts[b * 3 + 1]) / 2,
      (verts[a * 3 + 2] + verts[b * 3 + 2]) / 2,
    );
    cache.set(key, i);
    return i;
  };

  const triangles: number[] = [];

  const subdivide = (a: number, b: number, c: number, d: number) => {
    if (d === 0) {
      triangles.push(a, b, c);
      return;
    }
    const ab = midpoint(a, b);
    const bc = midpoint(b, c);
    const ca = midpoint(c, a);
    subdivide(a, ab, ca, d - 1);
    subdivide(b, bc, ab, d - 1);
    subdivide(c, ca, bc, d - 1);
    subdivide(ab, bc, ca, d - 1);
  };`;

const cameraPos = `
const camPos = computed<[number, number, number]>(() => [
  props.cameraPosition.x,
  props.cameraPosition.y,
  props.cameraPosition.z,
]);

const cameraRef = ref<PerspectiveCamera | null>(null);

onBeforeRender(() => {
  cameraRef.value?.lookAt(0, 0, 0);
});`;

const buildFaces = `
  const buildFaces = (faces: Face[]): Geometries => {
  const pos: number[] = [];
  const col: number[] = [];
  const tri: number[] = [];
  const lineIdx: number[] = [];
  const cFrom = new Color();
  const cTo = new Color();
  let offset = 0;

  for (const face of faces) {
    cFrom.set(face.from);
    cTo.set(face.to);
    face.verts.forEach((v, i) => {
      const c = i < 2 ? cFrom : cTo;
      pos.push(v[0], v[1], v[2]);
      col.push(c.r, c.g, c.b);
    });
    const n = face.verts.length;
    for (let i = 1; i < n - 1; i++) {
      tri.push(offset, offset + i, offset + i + 1);
    }
    for (let i = 0; i < n; i++) {
      lineIdx.push(offset + i, offset + ((i + 1) % n));
    }
    offset += n;
  }
  return makeGeometries(pos, col, tri, lineIdx);
};`;
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
