<script setup lang="ts">
import { useRoute, useRouter, RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { name: 'Home', label: '首页', path: '/' },
  { name: 'PetList', label: '宠物列表', path: '/pets' },
  { name: 'Communication', label: '沟通对接', path: '/communication' },
  { name: 'Forum', label: '宠物论坛', path: '/forum' },
  { name: 'PostPet', label: '发布宠物', path: '/post-pet' }
]

// 跳转到个人主页（不新开标签页）
const goToProfile = () => {
  router.push({ name: 'Profile' })
}
</script>

<template>
  <header class="h-[60px] flex items-center justify-between px-[10%] shadow-md sticky top-0 z-[100]" style="background-color: #FF8C00; color: white;">
    <RouterLink to="/" class="font-extrabold text-xl flex items-center gap-2 hover:opacity-90 transition-opacity">
      <i class="fa-solid fa-paw"></i> FUREVERHOME
    </RouterLink>
    <nav>
      <ul class="flex gap-8 text-base">
        <li 
          v-for="item in navItems"
          :key="item.name"
          class="cursor-pointer opacity-90 py-1 border-b-[3px] border-transparent transition-all hover:opacity-100 hover:font-medium"
          :class="route.name === item.name ? 'opacity-100 font-extrabold border-white' : ''"
        >
          <RouterLink :to="item.path">{{ item.label }}</RouterLink>
        </li>
      </ul>
    </nav>
    <button
      @click="goToProfile"
      class="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity"
      type="button"
    >
      <i class="fa-solid fa-circle-user" style="font-size: 20px;"></i>
      <span>用户</span>
    </button>
  </header>
</template>
