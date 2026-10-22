/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import Index from "@/pages/index.vue";
import Documentation from "@/pages/Documentation.vue";
import WebGL from "@/components/WebGL.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      component: WebGL,
    },
    { path: "/documentation", component: Documentation },
    { path: "/webgl", component: WebGL },
  ],
});

export default router;
