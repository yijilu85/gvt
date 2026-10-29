<template>
  <v-app>
    <v-main>
      <nav class="main-nav mt-4 mb-6 sm:mt-8 sm:mb-8">
        <!-- <RouterLink activeClass="active" to="/">Interaktive Scheibe</RouterLink> -->
        <RouterLink activeClass="active" to="/webgl"
          >Geometrische Form trianguliert</RouterLink
        >
        <RouterLink activeClass="active" to="/documentation"
          >Dokumentation</RouterLink
        >
      </nav>
      <div class="main">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style lang="scss">
.active {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  text-decoration-color: var(--color-primary);
}
.main {
  width: min(100%, 1000px);
  margin: 0 auto;
  padding: 0 1rem 1.5rem;
}

.main-nav {
  position: relative;
  width: min(100%, 1000px);
  margin-inline: auto;
  padding: 0 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  flex-wrap: wrap;
  z-index: 9999;
}

@media (max-width: 640px) {
  .main-nav {
    justify-content: center;
    gap: 1rem;
  }
}
</style>
