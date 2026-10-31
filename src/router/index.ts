/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import Index from "@/pages/index.vue";
import Documentation from "@/pages/Documentation.vue";
import ShapeFill from "@/components/ShapeFill.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      component: ShapeFill,
    },
    { path: "/documentation", component: Documentation },
    { path: "/shapefill", component: ShapeFill },
  ],
});

export default router;
