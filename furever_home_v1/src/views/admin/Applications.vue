<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-[-0.033em]">管理申请</h1>
    </header>
    <section class="bg-white dark:bg-[#181C25] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div class="border-b border-gray-100 dark:border-gray-800 p-5 flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold text-[#111318] dark:text-white">待审核的领养申请列表</h2>
        </div>
        <div class="relative">
          <input
            v-model="search"
            type="text"
            placeholder="搜索申请..."
            class="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-5 p-5">
        <div
          v-for="app in paginatedApplications"
          :key="app.id"
          class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1C202B] shadow-sm p-5 flex flex-col gap-4"
        >
          <div class="flex items-center gap-3">
            <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">申请 #{{ app.id }}</span>
            <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span class="material-symbols-outlined text-base">schedule</span>
              <span>{{ app.time }}</span>
            </div>
          </div>
          <div class="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <p class="text-gray-500 dark:text-gray-400">申请者：</p>
              <p class="text-gray-900 dark:text-white font-medium">{{ app.applicant }}</p>
            </div>
            <div class="flex items-center gap-2">
              <p class="text-gray-500 dark:text-gray-400">被申请用户：</p>
              <p class="text-gray-900 dark:text-white font-medium">{{ app.targetUser }}</p>
            </div>
            <div class="flex items-center gap-2">
              <p class="text-gray-500 dark:text-gray-400">申请的宠物：</p>
              <p class="text-gray-900 dark:text-white font-medium">{{ app.petName }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 justify-end">
            <button
              title="审核通过"
              class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30"
              @click="handleApprove(app)"
            >
              <span class="material-symbols-outlined">check</span>
            </button>
            <button
              title="审核不通过"
              class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
              @click="handleReject(app)"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
            <button
              title="查看详情"
              class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              @click="handleViewDetail(app)"
            >
              <span class="material-symbols-outlined">visibility</span>
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 p-5">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          显示 {{ applications.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0 }} 到 {{ Math.min(currentPage * PAGE_SIZE, applications.length) }} 条，共 {{ applications.length }} 条
        </p>
        <div class="flex gap-2">
          <button
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="currentPage--"
          >
            上一页
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm transition-colors"
            :class="page === currentPage ? 'bg-primary text-white border-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="currentPage++"
          >
            下一页
          </button>
        </div>
      </div>
    </section>

    <!-- 弹窗组件 -->
    <ApplicationDetailModal
      :visible="showApplicationDetailModal"
      :application-data="selectedApplication ? {
        id: selectedApplication.id,
        applicant: selectedApplication.applicant,
        petName: selectedApplication.petName,
        targetUser: selectedApplication.targetUser,
        time: selectedApplication.time,
        phone: '138-****-2640',
        email: `${selectedApplication.applicant.toLowerCase()}@example.com`,
        address: '上海市徐汇区桂林路 188 弄',
        reason: '希望领养一只性格温顺的宠物作为伴侣。'
      } : undefined"
      @close="showApplicationDetailModal = false"
    />
    <ApproveModal
      :visible="showApproveModal"
      message="该申请已成功通过审核。"
      @close="showApproveModal = false"
      @confirm="onApproveConfirm"
    />
    <RejectModal
      :visible="showRejectModal"
      message="该申请审核未通过，已通知申请人。"
      @close="showRejectModal = false"
      @confirm="onRejectConfirm"
    />
    <ConfirmModal
      :visible="showConfirmModal"
      :title="confirmAction === 'approve' ? '确认审核通过' : '确认审核不通过'"
      :message="confirmAction === 'approve' ? '确定要通过该申请的审核吗？' : '确定要拒绝该申请的审核吗？'"
      @confirm="onConfirmModalConfirm"
      @cancel="onConfirmModalCancel"
      @close="onConfirmModalCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ApplicationDetailModal from '../../components/admin/ApplicationDetailModal.vue';
import ApproveModal from '../../components/admin/ApproveModal.vue';
import RejectModal from '../../components/admin/RejectModal.vue';
import ConfirmModal from '../../components/admin/ConfirmModal.vue';

interface Application {
  id: number;
  applicant: string;
  petName: string;
  targetUser: string;
  time: string;
}

const PAGE_SIZE = 10;
const search = ref('');
const currentPage = ref(1);

const applicants = ['李想', '王悦', '陈晨', '赵雷', '刘雪', '孙明', '周航', '吴桐'];
const petTargets = ['小橘', '星星', '豆豆', '雪球', '奶茶', '花花'];
const petOwners = ['张女士', '杨先生', '何主管', '郑老师', '钱同学'];

const generateApplications = (): Application[] => {
  return Array.from({ length: 27 }, (_, i) => ({
    id: 6001 + i,
    applicant: applicants[i % applicants.length],
    petName: petTargets[i % petTargets.length],
    targetUser: petOwners[i % petOwners.length],
    time: `2023-07-${(i % 20) + 1} ${9 + (i % 9)}:${(i * 4) % 60}`
  }));
};

const applications = ref<Application[]>(generateApplications());

const filteredApplications = computed(() => {
  if (!search.value) return applications.value;
  const searchLower = search.value.toLowerCase();
  return applications.value.filter(
    app => app.applicant.toLowerCase().includes(searchLower) ||
            app.petName.toLowerCase().includes(searchLower) ||
            app.targetUser.toLowerCase().includes(searchLower)
  );
});

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / PAGE_SIZE));

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return filteredApplications.value.slice(start, end);
});

// 弹窗状态
const showApplicationDetailModal = ref(false);
const showApproveModal = ref(false);
const showRejectModal = ref(false);
const showConfirmModal = ref(false);
const confirmAction = ref<'approve' | 'reject' | null>(null);
const selectedApplication = ref<Application | null>(null);

function handleApprove(app: Application) {
  selectedApplication.value = app;
  confirmAction.value = 'approve';
  showConfirmModal.value = true;
}

function handleReject(app: Application) {
  selectedApplication.value = app;
  confirmAction.value = 'reject';
  showConfirmModal.value = true;
}

function handleViewDetail(app: Application) {
  selectedApplication.value = app;
  showApplicationDetailModal.value = true;
}

function onConfirmModalConfirm() {
  if (!selectedApplication.value || !confirmAction.value) return;
  
  showConfirmModal.value = false;
  
  // 执行操作
  if (confirmAction.value === 'approve') {
    // TODO: 调用API审核通过
    console.log('审核通过:', selectedApplication.value);
    // 从列表中移除
    const index = applications.value.findIndex(a => a.id === selectedApplication.value!.id);
    if (index > -1) applications.value.splice(index, 1);
    showApproveModal.value = true;
  } else if (confirmAction.value === 'reject') {
    // TODO: 调用API审核拒绝
    console.log('审核拒绝:', selectedApplication.value);
    // 从列表中移除
    const index = applications.value.findIndex(a => a.id === selectedApplication.value!.id);
    if (index > -1) applications.value.splice(index, 1);
    showRejectModal.value = true;
  }
}

function onConfirmModalCancel() {
  showConfirmModal.value = false;
  confirmAction.value = null;
}

function onApproveConfirm() {
  showApproveModal.value = false;
  selectedApplication.value = null;
  confirmAction.value = null;
}

function onRejectConfirm() {
  showRejectModal.value = false;
  selectedApplication.value = null;
  confirmAction.value = null;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>

