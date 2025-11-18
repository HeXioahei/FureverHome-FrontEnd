<script setup lang="ts">
import NavBar from './components/common/NavBar.vue'
</script>

<template>
  <div>
    <RouterView v-slot="{ Component, route }">
      <div>
        <NavBar v-if="route.meta.showNavBar !== false" />
        <component :is="Component" />
      </div>
    </RouterView>
  </div>
</template>