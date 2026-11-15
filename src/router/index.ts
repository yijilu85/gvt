/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import Index from "@/pages/index.vue";
import Documentation from "@/pages/Documentation.vue";
import ParametricSheet from "@/components/ParametricSheet.vue";
import CameraScene from "@/components/CameraScene.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      component: CameraScene,
    },
    { path: "/documentation", component: Documentation },
    { path: "/camerascene", component: CameraScene },
  ],
});

export default router;
