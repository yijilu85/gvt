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
import CameraScene2 from "@/components/CameraScene2.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      component: CameraScene2,
    },
    { path: "/documentation", component: Documentation },
    { path: "/camerascenetorus", component: CameraScene2 },
  ],
});

export default router;
