<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2" style="color: #333333;">欢迎回来，{{ userName }}！</h1>
      <p class="text-sm" style="color: #666666;">这是您的活动简报。</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-3 gap-5 mb-10">
      <div class="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-[120px]">
        <span class="text-sm font-medium" style="color: #6B7280;">已发布内容</span>
        <span class="text-4xl font-bold mt-2.5" style="color: #111;">3</span>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-30">
        <span class="text-sm font-medium" style="color: #6B7280;">我的待办</span>
        <span class="text-4xl font-bold mt-2.5" style="color: #111;">2</span>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-30">
        <span class="text-sm font-medium" style="color: #6B7280;">信誉积分</span>
        <span class="text-4xl font-bold mt-2.5" style="color: #111;">4.5/5</span>
      </div>
    </div>

    <!-- 近期动态 -->
    <div class="text-xl font-bold mb-5" style="color: #333333;">近期动态</div>
    <div class="flex flex-col gap-4">
      <div 
        v-for="activity in activities" 
        :key="activity.id"
        class="bg-white p-5 rounded-xl shadow-sm flex items-center gap-5 cursor-pointer transition-transform hover:-translate-y-0.5"
      >
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
          :style="{ backgroundColor: activity.iconBg, color: activity.iconColor }"
        >
          <i :class="activity.icon"></i>
        </div>
        <div class="flex-1">
          <div class="text-base font-medium mb-1" style="color: #1F2937;">{{ activity.title }}</div>
          <div class="text-xs" style="color: #9CA3AF;">{{ activity.time }}</div>
        </div>
        <i class="fa-solid fa-chevron-right text-sm" style="color: #D1D5DB;"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const userName = ref('李同学');

interface Activity {
  id: number;
  title: string;
  time: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const activities = ref<Activity[]>([
  {
    id: 1,
    title: '您对"巴迪"的领养申请已通过！',
    time: '2小时前',
    icon: 'fa-solid fa-paw',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB'
  },
  {
    id: 2,
    title: '收到关于您帖子"猫咪米洛"的新消息',
    time: '1天前',
    icon: 'fa-regular fa-comment-dots',
    iconBg: '#D1FAE5',
    iconColor: '#059669'
  },
  {
    id: 3,
    title: '您发布了"金毛犬戈尔迪"的领养信息。',
    time: '3天前',
    icon: 'fa-solid fa-arrow-up-from-bracket',
    iconBg: '#FEF3C7',
    iconColor: '#D97706'
  }
]);
</script>

<style scoped>
</style>

