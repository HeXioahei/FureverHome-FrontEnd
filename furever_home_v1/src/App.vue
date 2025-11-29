<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/common/NavBar.vue';

const route = useRoute();

// 判断是否为后台管理页面
const isAdminPage = computed(() => {
  return route.path.startsWith('/admin');
});
</script>

<template>
  <div>
    <NavBar v-if="!isAdminPage" />
    <RouterView />
  </div>
</template>