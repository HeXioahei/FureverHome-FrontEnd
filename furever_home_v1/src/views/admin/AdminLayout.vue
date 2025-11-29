<template>
  <div class="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark">
    <div class="flex h-full grow flex-row">
      <!-- 左侧边栏 -->
      <aside class="flex h-screen w-64 flex-col bg-[#0D1117] p-4 text-white sticky top-0">
        <div class="flex flex-1 flex-col gap-y-6">
          <div class="flex gap-4 items-center pl-2">
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-10" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXgIEGQDxm_-u0_hGh3zLMrnSopanRetl40eBEzEZK5EuAzmRBjLSoHvTfChZUsRxhl-VkmKERbA8dzEfmZ0Lc7Eknq3IrtFS8nTd7yOq--6qN8nThXknq4Dc7yuS2F6JRnn0Lq5TvGd9eOQu1tCT8pzt3mINpyWwQjwcdAyj-0i0GbYn-BjJJ1TbMLXrWmMWqHYUTnao2jcQCpqu5SM6X3Kus-jTK34uXpMPa8s692RkVoKXgYaZqCNN-QAj1pjmnT34bKsjYDgI");'></div>
            <h1 class="text-white text-base font-bold leading-normal">FUREVER HOME 管理后台</h1>
          </div>
          <nav class="flex flex-col gap-2 mt-4">
            <router-link 
              :to="{ name: 'AdminDashboard' }"
              class="flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors"
              :class="isActive('AdminDashboard') ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'"
            >
              <span class="material-symbols-outlined" style="font-size: 24px;">grid_view</span>
              <p class="text-sm font-medium leading-normal">首页</p>
            </router-link>
            <router-link 
              :to="{ name: 'AdminPosts' }"
              class="flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors"
              :class="isActive('AdminPosts') ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'"
            >
              <span class="material-symbols-outlined" style="font-size: 24px;">article</span>
              <p class="text-sm font-medium leading-normal">帖子管理</p>
            </router-link>
            <router-link 
              :to="{ name: 'AdminPets' }"
              class="flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors"
              :class="isActive('AdminPets') ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'"
            >
              <span class="material-symbols-outlined" style="font-size: 24px;">pets</span>
              <p class="text-sm font-medium leading-normal">宠物管理</p>
            </router-link>
            <router-link 
              :to="{ name: 'AdminApplications' }"
              class="flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors"
              :class="isActive('AdminApplications') ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'"
            >
              <span class="material-symbols-outlined" style="font-size: 24px;">assignment</span>
              <p class="text-sm font-medium leading-normal">申请管理</p>
            </router-link>
          </nav>
        </div>
        <div class="mt-auto flex flex-col">
          <a 
            class="flex items-center gap-4 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            @click="handleLogout"
          >
            <span class="material-symbols-outlined" style="font-size: 24px;">logout</span>
            <p class="text-sm font-medium leading-normal">退出登录</p>
          </a>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

function isActive(routeName: string): boolean {
  return route.name === routeName;
}

function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    // TODO: 实现退出登录逻辑
    router.push('/');
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>

