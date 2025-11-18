<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isActive = (name: string) => route.name === name

const navItems = [
  { name: 'Home', label: '首页', path: '/' },
  { name: 'PetList', label: '宠物列表', path: '/pets' },
  { name: 'Communication', label: '沟通对接', path: '/communication' },
  { name: 'Forum', label: '宠物论坛', path: '/forum' }
]

// 在新标签页打开个人主页
const openProfile = () => {
  // 获取完整的 URL 路径
  const routeData = router.resolve({ name: 'Profile' })
  window.open(routeData.href, '_blank')
}
</script>

<template>
  <header class="bg-orange-500 shadow-md sticky top-0 z-20">
    <nav class="container mx-auto px-6 py-5 flex justify-between items-center">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center space-x-2 hover:opacity-90 transition-opacity">
        <span class="material-icons text-white text-3xl">pets</span>
        <span class="text-2xl font-bold text-white tracking-wider">FUREVER HOME</span>
      </RouterLink>

      <!-- Main nav menu -->
      <div class="hidden md:flex items-center space-x-8 text-sm font-medium text-white">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          :class="[
            'hover:text-white/80 transition-colors',
            isActive(item.name) ? 'pb-1 border-b-2 border-white font-semibold' : ''
          ]"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <!-- User Avatar -->
      <button
        @click="openProfile"
        class="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
        type="button"
      >
        <span class="material-icons">account_circle</span>
        <span class="hidden sm:inline">用户</span>
      </button>
    </nav>
  </header>
</template>
