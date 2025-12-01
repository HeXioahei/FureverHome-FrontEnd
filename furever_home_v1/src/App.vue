<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/common/NavBar.vue';

const route = useRoute();

// 判断是否为后台管理页面
const isAdminPage = computed(() => route.path.startsWith('/admin'));

// 登录/注册等认证页面不展示顶部导航栏
const isAuthPage = computed(() => ['Login', 'Register'].includes(route.name as string));
</script>

<template>
  <div>
    <NavBar v-if="!isAdminPage && !isAuthPage" />
    <RouterView />
  </div>
</template>