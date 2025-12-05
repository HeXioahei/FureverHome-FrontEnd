<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/common/NavBar.vue';
import GlobalLoading from './components/common/GlobalLoading.vue';

const route = useRoute();

// 判断是否为后台管理页面
const isAdminPage = computed(() => route.path.startsWith('/admin'));

// 登录/注册等认证页面不展示顶部导航栏
const isAuthPage = computed(() => {
  // 所有 /login 开头的路由 + 注册页，都视为认证页面
  if (route.path.startsWith('/login')) return true;
  return ['Register'].includes(route.name as string);
});
</script>

<template>
  <div>
    <NavBar v-if="!isAdminPage && !isAuthPage" />
    <RouterView />
    <!-- 全局请求加载提示，覆盖前台 + 后台所有页面 -->
    <GlobalLoading />
  </div>
</template>