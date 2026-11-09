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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      component: ParametricSheet,
    },
    { path: "/documentation", component: Documentation },
    { path: "/parametrized", component: ParametricSheet },
  ],
});

export default router;
