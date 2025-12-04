<template>
  <div>
    <h2 class="text-2xl font-bold mb-5" style="color: #111;">我的申请记录</h2>

    <div v-if="applications.length" class="flex flex-col gap-5">
      <div 
        v-for="application in applications" 
        :key="application.id"
        class="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center gap-5 cursor-pointer"
        @click="handleViewDetail(application)"
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
            @click.stop="handleCancel(application)"
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

    <!-- 错误/提示弹窗 -->
    <ErrorModal
      :visible="showErrorModal"
      title="提示"
      :message="errorMessage"
      @close="closeErrorModal"
    />

    <!-- 申请详情弹窗（与“我的待办”保持一致） -->
    <ApplicationDetailModal
      v-if="currentApplication"
      :visible="showApplicationDetailModal"
      :application="currentApplication"
      @close="closeApplicationDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import SuccessModal from '../../../components/common/SuccessModal.vue';
import ConfirmModal from '../../../components/common/ConfirmModal.vue';
import ErrorModal from '../../../components/common/ErrorModal.vue';
import ApplicationDetailModal from '../../../components/common/ApplicationDetailModal.vue';
import {
  getMyAdoptMineList,
  getAdoptDetail,
  cancelMyAdopt,
  ApplicationStatus,
  ReviewStatus,
  type AdoptDetail,
  type AdoptTodoItem
} from '@/api/adoptApi';

interface Application {
  id: number;
  petName: string;
  petBreed: string;
  ownerName: string;
  ownerLabel: string;
  date: string;
  // 业务状态：
  // - pending        : 申请中（含管理员待审核、管理员已通过但对方还未处理）
  // - approved       : 管理员通过 + 对方同意 -> 「申请成功」
  // - rejected       : 管理员通过 + 对方婉拒 -> 「申请失败」
  // - adminRejected  : 管理员初审拒绝
  // - cancelled      : 当前用户主动撤销
  status: 'approved' | 'pending' | 'rejected' | 'adminRejected' | 'cancelled';
  // 是否由当前用户主动撤销
  cancelledByUser?: boolean;
  // 详情相关字段
  requester?: string;
  phone?: string;
  email?: string;
  address?: string;
  reason?: string;
}

const applications = ref<Application[]>([]);

const currentPage = ref(1);
const pageSize = 10;
const totalPages = computed(() => Math.ceil(applications.value.length / pageSize));

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    // 管理员已通过 + 对方同意
    approved: '对方已同意',
    // 包含两种场景：
    // 1）管理员待审核
    // 2）管理员已通过，但对方还未选择「同意 / 婉拒」
    pending: '申请中',
    // 管理员已通过 + 对方婉拒
    rejected: '对方已拒绝',
    // 管理员初次审核不通过
    adminRejected: '管理员已拒绝',
    // 当前用户主动撤销
    cancelled: '我已撤销',
  };
  return labels[status] || '未知';
}

function getStatusIcon(status: string) {
  const icons: Record<string, string> = {
    approved: 'fa-solid fa-check',
    pending: 'fa-regular fa-clock',
    rejected: 'fa-solid fa-xmark',
    adminRejected: 'fa-solid fa-xmark',
    cancelled: 'fa-regular fa-circle-xmark',
  };
  return icons[status] || '';
}

function getStatusBg(status: string) {
  const colors: Record<string, string> = {
    approved: '#D1FAE5',
    pending: '#DBEAFE',
    rejected: '#F3F4F6',
    adminRejected: '#F3F4F6',
    cancelled: '#F3F4F6',
  };
  return colors[status] || '#F3F4F6';
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    approved: '#059669',
    pending: '#2563EB',
    rejected: '#6B7280',
    adminRejected: '#6B7280',
    cancelled: '#6B7280',
  };
  return colors[status] || '#6B7280';
}

const showCancelSuccessModal = ref(false);
const showCancelConfirmModal = ref(false);
const applicationToCancel = ref<Application | null>(null);
const cancelMessage = ref('');

// 详情弹窗状态
const showApplicationDetailModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');
const currentApplication = ref<Application | null>(null);

function handleCancel(application: Application) {
  applicationToCancel.value = application;
  cancelMessage.value = `确定要撤销对"${application.petName}"的申请吗？`;
  showCancelConfirmModal.value = true;
}

async function confirmCancel() {
  if (!applicationToCancel.value) {
    showCancelConfirmModal.value = false;
    return;
  }

  try {
    const id = applicationToCancel.value.id;
    const res = await cancelMyAdopt(id);
    if (res.code === 200) {
      // 将该记录标记为“我已撤销”，保留在列表中作为历史记录
      applications.value = applications.value.map(app =>
        app.id === id
          ? { ...app, status: 'cancelled', cancelledByUser: true }
          : app
      );
      showCancelSuccessModal.value = true;
    } else {
      errorMessage.value = res.message || '撤销申请失败，请稍后重试';
      showErrorModal.value = true;
      console.error('撤销领养申请失败', res);
    }
  } catch (err) {
    errorMessage.value = '撤销申请接口异常，请稍后重试';
    showErrorModal.value = true;
    console.error('撤销领养申请接口异常', err);
  } finally {
    showCancelConfirmModal.value = false;
    applicationToCancel.value = null;
  }
}

function closeCancelConfirm() {
  showCancelConfirmModal.value = false;
  applicationToCancel.value = null;
}

function closeCancelSuccessModal() {
  showCancelSuccessModal.value = false;
}

function closeErrorModal() {
  showErrorModal.value = false;
}

function closeApplicationDetailModal() {
  showApplicationDetailModal.value = false;
  currentApplication.value = null;
}

// 查看申请详情：调用 /adopt/{id}，与“我的待办”保持一致
async function handleViewDetail(application: Application) {
  try {
    const res = await getAdoptDetail(application.id);
    if (res.code === 200 && res.data) {
      const detail: AdoptDetail = res.data;
      currentApplication.value = {
        ...application,
        requester: detail.userName || application.requester,
        date: (detail.createTime as string) || application.date,
        phone: detail.phone || application.phone,
        email: detail.email || application.email,
        address: detail.livingLocation || application.address,
        petName: (detail as any).animalName || application.petName,
        reason: detail.adoptReason || application.reason,
      };
      showApplicationDetailModal.value = true;
    } else {
      errorMessage.value = '获取申请详情失败，请稍后重试';
      showErrorModal.value = true;
      console.error('获取我的申请详情失败', res);
    }
  } catch (err) {
    errorMessage.value = '获取申请详情接口异常，请稍后重试';
    showErrorModal.value = true;
    console.error('获取我的申请详情接口异常', err);
  }
}

async function loadApplications() {
  try {
    const res = await getMyAdoptMineList();
    if (res.code === 200 && Array.isArray(res.data)) {
      applications.value = res.data.map((item: AdoptTodoItem & { status?: string; applyStatus?: string; applicationStatus?: ApplicationStatus | string; reviewStatus?: ReviewStatus | string }, index: number) => {
        const id = item.adoptId ?? index + 1;
        const petName = item.animalName || '';
        const petBreed = ''; // 当前接口未提供品种，可后端补充
        const ownerName = ''; // 我的申请列表暂未返回发布人信息
        const ownerLabel = '发布人';
        const date = item.createTime ? String(item.createTime) : '';

        // 统一把后端返回的状态转成普通字符串
        const applicationStatusStr = String(
          (item as any).applicationStatus ?? ''
        ).trim() as ApplicationStatus | string;
        const reviewStatusStr = String(
          (item as any).reviewStatus ?? ''
        ).trim() as ReviewStatus | string;

        let status: Application['status'];

        // 1）用户主动撤销（最高优先级）
        if (item.cancelledByUser) {
          status = 'cancelled';
        }
        // 2）管理员拒绝：reviewStatus = 拒绝
        else if (reviewStatusStr === ReviewStatus.拒绝 || reviewStatusStr === '拒绝') {
          status = 'adminRejected';
        }
        // 3）管理员通过 + applicationStatus = 申请成功 -> 对方已同意
        else if (
          (reviewStatusStr === ReviewStatus.通过 || reviewStatusStr === '通过') &&
          applicationStatusStr === ApplicationStatus.申请成功
        ) {
          status = 'approved';
        }
        // 4）管理员通过 + applicationStatus = 申请失败 -> 对方已拒绝
        else if (
          (reviewStatusStr === ReviewStatus.通过 || reviewStatusStr === '通过') &&
          applicationStatusStr === ApplicationStatus.申请失败
        ) {
          status = 'rejected';
        }
        // 5）其它所有情况 -> 申请中
        else {
          status = 'pending';
        }
        return {
          id,
          petName,
          petBreed,
          ownerName,
          ownerLabel,
          date,
          status,
          cancelledByUser: !!item.cancelledByUser,
          requester: undefined,
          phone: undefined,
          email: undefined,
          address: undefined,
          reason: undefined,
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
