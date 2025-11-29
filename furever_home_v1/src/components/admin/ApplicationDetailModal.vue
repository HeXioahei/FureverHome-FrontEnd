<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
    <div class="relative z-10 w-full max-w-2xl">
      <div class="rounded-2xl bg-white dark:bg-[#1A1E26] shadow-2xl">
        <div class="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">领养申请详情</h2>
          </div>
          <button
            class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
            @click="handleClose"
          >
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        <div class="px-6 py-6 space-y-6 text-sm text-slate-600 dark:text-slate-300">
          <div class="flex items-center gap-3">
            <div class="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
              {{ applicationData?.applicant?.charAt(0) || '头' }}
            </div>
            <div>
              <p class="text-base font-semibold text-slate-900 dark:text-white">{{ applicationData?.applicant || '未知用户' }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">提交时间：{{ applicationData?.time || '未知时间' }}</p>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-xs uppercase tracking-wide text-slate-400">联系信息</p>
            <p>手机号：{{ applicationData?.phone || '未提供' }}</p>
            <p>邮箱：{{ applicationData?.email || '未提供' }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs uppercase tracking-wide text-slate-400">居住地址</p>
            <p>{{ applicationData?.address || '未提供' }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-wide text-slate-400">申请理由</p>
            <p class="leading-relaxed">
              {{ applicationData?.reason || '未提供申请理由' }}
            </p>
          </div>
          <div v-if="applicationData?.petName" class="space-y-1">
            <p class="text-xs uppercase tracking-wide text-slate-400">申请的宠物</p>
            <p class="text-base font-medium text-slate-900 dark:text-white">{{ applicationData.petName }}</p>
          </div>
          <div v-if="applicationData?.targetUser" class="space-y-1">
            <p class="text-xs uppercase tracking-wide text-slate-400">被申请用户</p>
            <p class="text-base font-medium text-slate-900 dark:text-white">{{ applicationData.targetUser }}</p>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 px-6 py-4">
          <button
            class="px-4 py-2 rounded-lg text-slate-500 hover:text-slate-700 border border-slate-200 dark:border-slate-700 transition"
            @click="handleClose"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ApplicationData {
  id?: number;
  applicant?: string;
  petName?: string;
  targetUser?: string;
  time?: string;
  phone?: string;
  email?: string;
  address?: string;
  reason?: string;
}

const props = defineProps<{
  visible: boolean;
  applicationData?: ApplicationData;
}>();

const emit = defineEmits<{
  close: [];
}>();

function handleClose() {
  emit('close');
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>

