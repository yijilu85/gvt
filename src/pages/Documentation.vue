<template>
  <div class="documentation-view">
    <article class="mb-8">
      <h2 class="text-2xl font-bold mb-4">
        Graphical Visualisation Technologies EA 6: Objekte bewegen - fliegende
        Kugeln
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
        Zur Konsultation und Hilfe beim Übersetzen der Formeln wurde
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
      <h3 class="text-xl font-bold mb-2 mt-8">Kamerasteuerung</h3>
      <p>
        Die Kamerasteuerung erfolgt maßgeblich in der Komponente
        <code>CameraScene2.vue</code>. Hierfür werden drei Werte
        <code>azimut</code> (horizontal), <code>altitude</code>(vertikal) und
        <code>radius</code> (Distanz) mit Default-Werten initialisiert und durch
        Benutzerinteraktion verändert. Die Pfeiltasten ändern den Winkel je um
        5° in eine Richtung und den Radius um Schritt 1. Anhand der drei Werte
        wird eine Position auf einem Orbit um die Szene herum mit
        <code>x</code>, <code>y</code> und <code>z</code> Koordinaten berechnet.
      </p>
      <p>
        Die Rendering-Komponente erhält immer nur die berechneten Koordinaten
        und positioniert die Kamera dort mit Blick auf den Ursprung.
      </p>
      <pre class="doc-code-block"><strong>Kamerapositionierung</strong>
       {{ cameraPos }}
      </pre>
      <pre class="doc-code-block"><strong>Kamerasteuerung</strong>
        {{ cameraControl }}
      </pre>
      <h3 class="text-xl font-bold mb-2 mt-8">Animationssteuerung</h3>
      <p>
        In der Komponente <code>CameraScene2.vue</code> erfolgt ebenso die
        Animationssteuerung. Es wird initial ein
        <code>sceneCounter:0</code> initialisiert schrittweise entweder durch
        Nutzereingabe <code>k</code> oder fortlaufend mit
        <code>a</code> hochgezählt.
      </p>
      <pre
        class="doc-code-block"
      ><strong>Inkrementierung von sceneCounter</strong>
       {{ animationControl }}
      </pre>
      <p></p>
      <p>
        Die zentrale Komponente <code>ShapesForTorusScene.vue</code> ist für die
        Objektgenerierung und das Rendering der Szene zuständig. Es werden ein 4
        Kugeln mit fixer Rekursionstiefe und ein Torus generiert.
      </p>
      <pre
        class="doc-code-block"
      ><strong>Generierung von Torus und Kugeln</strong>
       {{ buildShapes }}
      </pre>
      <p>
        Die Komponente erhält die Kameraposition und sceneCounter als Parameter
        und rendert damit die aktuelle Szene: Mit Kameraposition wird der Blick
        auf die Perspektive berechnet und über das Inkrementieren sceneCounter
        werden die Vertices der Objekte verschoben, um eine Animation zu
        realisieren.
      </p>
      <h3 class="text-xl font-bold mb-2 mt-8">Animation</h3>
      <p>
        Die Animation aller Objekte wird über eine gemeinsame
        <code>angle</code> Variable gesteuert.
        <code
          >const angle = computed(() => props.sceneCounter * props.step);
        </code>
        Der Torus wird einfach über <code>angle</code> auf der y-Achse rotiert.
      </p>
      <pre class="doc-code-block"><strong>Torus-Rotation</strong>
       {{ torusRotation }}
      </pre>
      <p>
        Die 4 Kugeln laufen auf fest definierten Umlaufbahnen durch die
        Torusöffnun, die sich im Nullpunkt befindet. Die jeweilige Position
        jeder Kugel wird durch die Funktion
        <code>onOrbit(orbit, angle)</code> berechnet. Jede Bahn ist ein Kreis
        mit Radius <code>rho</code>, der durch den Nullpunkt.
        <code>rho·(1−cos φ)·w + rho·sin φ·d mit φ = angle − delta − half·π</code
        >. d ist die Flugrichtung im Nullpunkt, waagerecht unter dem Winkel
        delta. w zeigt zum Mittelpunkt des Kreises. Es steht waagerecht
        senkrecht auf d und ist um gamma nach oben gekippt, das ergibt die
        Neigung der Bahn.
      </p>
      <pre class="doc-code-block"><strong>Umlaufbahnen</strong>
       {{ orbits }}
      </pre>
      <p>
        Torus und Kugeln nutzen denselben Winkel <code>angle</code> und laufen
        immer synchron. Bei <code>φ = 0</code> ist eine Kugel genau im
        Nullpunkt. Genau dann zeigt die Lochachse des gedrehten Torus in die
        Flugrichtung d (bzw. in die Gegenrichtung). Jede Kugel fliegt pro
        Torus-Umdrehung einmal hindurch. Durch die unterschiedlichen delta-Werte
        (0°, 45°, 135°, 90°) fliegen die Kugeln nacheinander durch und treffen
        sich – auch dank unterschiedlicher Umlaufbahnneigung – nie.
      </p>
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

const animationControl = `
const toggleAutoPlay = () => {
  autoPlay.value = !autoPlay.value;
};
const incrementSceneCounter = () => {
  sceneCounter.value++;
};

const tick = () => {
  sceneCounter.value++;
  raf = requestAnimationFrame(tick);
};

watch(autoPlay, (on) => (on ? tick() : cancelAnimationFrame(raf)));`;

const torusRotation = `
  <TresMesh v-if="showFill" :geometry="torus.surface" :rotation="[0, angle, 0]">
    <TresMeshBasicMaterial
      :vertex-colors="true"
      :polygon-offset="true"
      :polygon-offset-factor="1"
      :polygon-offset-units="1"
    />
  </TresMesh>`;

const orbits = `
const orbits: Orbit[] = [
  { id: "flach", rho: 1.5, delta: 0, gamma: 0, half: 0 },
  { id: "schraeg-hoch", rho: 1.8, delta: 45, gamma: 35, half: 1 },
  { id: "schraeg-tief", rho: 1.8, delta: 135, gamma: -35, half: 0 },
  { id: "steil", rho: 2.0, delta: 90, gamma: 70, half: 0 },
];

const onOrbit = (o: Orbit, theta: number): Vec3 => {
  const rho = o.rho * unit.value;
  const dl = o.delta * DEG;
  const g = o.gamma * DEG;
  const d: Vec3 = [Math.sin(dl), 0, Math.cos(dl)];
  const h: Vec3 = [Math.cos(dl), 0, -Math.sin(dl)];
  const w: Vec3 = [Math.cos(g) * h[0], Math.sin(g), Math.cos(g) * h[2]];
  const phi = theta - dl - o.half * Math.PI;
  const a = rho * (1 - Math.cos(phi));
  const b = rho * Math.sin(phi);
  return [a * w[0] + b * d[0], a * w[1] + b * d[1], a * w[2] + b * d[2]];
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

const buildShapes = `
  const torus = computed<Geometries>(() => {
  const pos: number[] = [];
  const col: number[] = [];
  const tri: number[] = [];
  const lineIdx: number[] = [];
  const c = new Color();

  for (let i = 0; i < TORUS_U; i++) {
    const u = (i / TORUS_U) * Math.PI * 2;
    for (let j = 0; j < TORUS_V; j++) {
      const v = (j / TORUS_V) * Math.PI * 2;
      const ring = R.value + r.value * Math.cos(v);
      pos.push(ring * Math.cos(u), ring * Math.sin(u), r.value * Math.sin(v));
      c.setHSL(i / TORUS_U, 0.65, 0.45 + 0.15 * Math.cos(v));
      col.push(c.r, c.g, c.b);
    }
  }

  const idx = (i: number, j: number) => (i % TORUS_U) * TORUS_V + (j % TORUS_V);

  for (let i = 0; i < TORUS_U; i++) {
    for (let j = 0; j < TORUS_V; j++) {
      const a = idx(i, j);
      const b = idx(i + 1, j);
      const cc = idx(i + 1, j + 1);
      const d = idx(i, j + 1);
      tri.push(a, b, cc, a, cc, d);
      lineIdx.push(a, b, a, d);
    }
  }

  return makeGeometries(pos, col, tri, lineIdx);
});

const buildSphere = (
  radius: number,
  depthIn: number,
  bottom: Color,
  top: Color,
): Geometries => {
  const depth = Math.min(Math.max(Math.round(depthIn), 0), 6);
  const verts: number[] = [];
  const cache = new Map<string, number>();

  const addVertex = (x: number, y: number, z: number) => {
    const len = Math.hypot(x, y, z);
    verts.push(x / len, y / len, z / len);
    return verts.length / 3 - 1;
  };

  const midpoint = (a: number, b: number) => {
    const key = a < b ? '{a}_{b} : '{b}_{a}';
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
  };

  addVertex(1, 0, 0);
  addVertex(-1, 0, 0);
  addVertex(0, 1, 0);
  addVertex(0, -1, 0);
  addVertex(0, 0, 1);
  addVertex(0, 0, -1);

  for (let sx = 0; sx < 2; sx++) {
    for (let sy = 0; sy < 2; sy++) {
      for (let sz = 0; sz < 2; sz++) {
        const flipped = (sx + sy + sz) % 2 === 1;
        if (flipped) subdivide(sx, 4 + sz, 2 + sy, depth);
        else subdivide(sx, 2 + sy, 4 + sz, depth);
      }
    }
  }

  const edges = new Set<string>();
  const lineIdx: number[] = [];
  for (let i = 0; i < triangles.length; i += 3) {
    for (let e = 0; e < 3; e++) {
      const a = triangles[i + e];
      const b = triangles[i + ((e + 1) % 3)];
      const key = a < b ? '{a}_{b}' : '{ b }_{ a }';
      if (!edges.has(key)) {
        edges.add(key);
        lineIdx.push(a, b);
      }
    }
  }

  const pos: number[] = [];
  const col: number[] = [];
  const c = new Color();
  for (let i = 0; i < verts.length; i += 3) {
    pos.push(verts[i] * radius, verts[i + 1] * radius, verts[i + 2] * radius);
    c.lerpColors(bottom, top, (verts[i + 1] + 1) / 2);
    col.push(c.r, c.g, c.b);
  }

  return makeGeometries(pos, col, triangles, lineIdx);
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
