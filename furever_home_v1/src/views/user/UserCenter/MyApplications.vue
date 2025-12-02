<template>
  <div>
    <h2 class="text-2xl font-bold mb-5" style="color: #111;">我的申请记录</h2>

    <div v-if="applications.length" class="flex flex-col gap-5">
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

    <div v-else class="mt-8 text-center text-sm" style="color: #9CA3AF;">
      当前没有领养申请记录
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

    <!-- 撤销确认弹窗 -->
    <ConfirmModal
      :visible="showCancelConfirmModal"
      title="确认操作"
      :message="cancelMessage"
      @confirm="confirmCancel"
      @cancel="closeCancelConfirm"
    />

    <!-- 撤销成功弹窗 -->
    <SuccessModal
      :visible="showCancelSuccessModal"
      title="操作成功"
      message="已撤销申请"
      @close="closeCancelSuccessModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import SuccessModal from '../../../components/common/SuccessModal.vue';
import ConfirmModal from '../../../components/common/ConfirmModal.vue';
import { getMyAdoptMineList } from '@/api/adoptApi';

interface Application {
  id: number;
  petName: string;
  petBreed: string;
  ownerName: string;
  ownerLabel: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

const applications = ref<Application[]>([]);

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

const showCancelSuccessModal = ref(false);
const showCancelConfirmModal = ref(false);
const applicationToCancel = ref<Application | null>(null);
const cancelMessage = ref('');

function handleCancel(application: Application) {
  applicationToCancel.value = application;
  cancelMessage.value = `确定要撤销对"${application.petName}"的申请吗？`;
  showCancelConfirmModal.value = true;
}

function confirmCancel() {
  if (applicationToCancel.value) {
    showCancelSuccessModal.value = true;
    // 这里可以调用API更新状态
  }
  showCancelConfirmModal.value = false;
  applicationToCancel.value = null;
}

function closeCancelConfirm() {
  showCancelConfirmModal.value = false;
  applicationToCancel.value = null;
}

function closeCancelSuccessModal() {
  showCancelSuccessModal.value = false;
}

async function loadApplications() {
  try {
    const res = await getMyAdoptMineList();
    if (res.code === 200 && Array.isArray(res.data)) {
      applications.value = res.data.map((item: any, index: number) => {
        const id = item.id ?? index + 1;
        const petName = item.petName || item.animalName || '';
        const petBreed = item.petBreed || item.breed || '';
        const ownerName = item.ownerName || item.publisherName || item.userName || '';
        const ownerLabel = item.ownerLabel || '发布人';
        const date = item.createTime || item.createdAt || item.applyTime || '';
        const rawStatus = item.status || item.applyStatus || '';
        let status: Application['status'] = 'pending';
        if (rawStatus === 'approved' || rawStatus === '通过') status = 'approved';
        else if (rawStatus === 'rejected' || rawStatus === '拒绝') status = 'rejected';
        else status = 'pending';
        return {
          id,
          petName,
          petBreed,
          ownerName,
          ownerLabel,
          date,
          status
        } as Application;
      });
    } else {
      console.error('获取我的申请列表失败', res);
    }
  } catch (err) {
    console.error('获取我的申请列表接口异常', err);
  }
}

onMounted(() => {
  loadApplications();
});
</script>

<style scoped>
</style>
