<template>
  <div>
    <h2 class="text-2xl font-bold mb-5" style="color: #111;">我的申请记录</h2>

    <div class="flex flex-col gap-5">
      <div 
        v-for="application in applications" 
        :key="application.id"
        class="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center gap-5"
      >
        <!-- 左侧：图片和基本信息 -->
        <div class="flex gap-5 flex-1">
          <div class="w-20 h-20 rounded-lg flex items-center justify-center text-xs text-gray-400 flex-shrink-0" style="background-color: #FFF3E0;">
            {{ application.petName }}的照片
          </div>
          <div class="flex flex-col justify-center">
            <div class="text-base font-bold mb-1" style="color: #1F2937;">申请领养：{{ application.petBreed }}"{{ application.petName }}"</div>
            <div class="text-xs mb-0.5" style="color: #6B7280;">{{ application.ownerLabel }}：{{ application.ownerName }}</div>
            <div class="text-xs" style="color: #9CA3AF;">申请日期：{{ application.date }}</div>
          </div>
        </div>

        <!-- 右侧：状态和操作 -->
        <div class="flex flex-col items-end gap-2.5">
          <span 
            class="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
            :style="{ 
              backgroundColor: getStatusBg(application.status), 
              color: getStatusColor(application.status) 
            }"
          >
            <i :class="getStatusIcon(application.status)"></i>
            {{ getStatusLabel(application.status) }}
          </span>
          <button 
            v-if="application.status === 'pending'"
            class="border border-gray-300 bg-white px-4 py-1.5 rounded-md text-xs cursor-pointer transition-colors hover:border-[#FF8C00] hover:text-[#FF8C00]"
            style="color: #4B5563;"
            @click="handleCancel(application)"
          >
            撤销申请
          </button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-10 mb-5">
      <div class="flex gap-2.5">
        <button 
          v-for="page in totalPages" 
          :key="page"
          class="w-11 h-11 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
          :class="page === currentPage ? 'bg-[#FF8C00] text-white border-[#FF8C00]' : 'text-gray-600'"
          style="color: #6B7280;"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button 
          v-if="currentPage < totalPages"
          class="px-5 h-11 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
          style="color: #6B7280;"
          @click="currentPage++"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Application {
  id: number;
  petName: string;
  petBreed: string;
  ownerName: string;
  ownerLabel: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

const applications = ref<Application[]>([
  {
    id: 1,
    petName: '巴迪',
    petBreed: '边牧',
    ownerName: '陈老师',
    ownerLabel: '短期领养人',
    date: '2023-11-15',
    status: 'approved'
  },
  {
    id: 2,
    petName: '小黑',
    petBreed: '中华田园犬',
    ownerName: '张同学',
    ownerLabel: '短期领养人',
    date: '2023-11-20',
    status: 'pending'
  },
  {
    id: 3,
    petName: '米洛',
    petBreed: '布偶猫',
    ownerName: '林女士',
    ownerLabel: '短期领养人',
    date: '2023-11-01',
    status: 'rejected'
  }
]);

const currentPage = ref(1);
const pageSize = 10;
const totalPages = computed(() => Math.ceil(applications.value.length / pageSize));

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    approved: '已通过',
    pending: '等待对方确认',
    rejected: '未通过'
  };
  return labels[status] || '未知';
}

function getStatusIcon(status: string) {
  const icons: Record<string, string> = {
    approved: 'fa-solid fa-check',
    pending: 'fa-regular fa-clock',
    rejected: 'fa-solid fa-xmark'
  };
  return icons[status] || '';
}

function getStatusBg(status: string) {
  const colors: Record<string, string> = {
    approved: '#D1FAE5',
    pending: '#DBEAFE',
    rejected: '#F3F4F6'
  };
  return colors[status] || '#F3F4F6';
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    approved: '#059669',
    pending: '#2563EB',
    rejected: '#6B7280'
  };
  return colors[status] || '#6B7280';
}

function handleCancel(application: Application) {
  if (confirm(`确定要撤销对"${application.petName}"的申请吗？`)) {
    alert('已撤销申请');
    // 这里可以调用API更新状态
  }
}
</script>

<style scoped>
</style>
