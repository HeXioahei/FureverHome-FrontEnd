<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
    <div class="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="rounded-2xl bg-white dark:bg-[#1A1E26] shadow-2xl">
        <div class="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 sticky top-0 bg-white dark:bg-[#1A1E26] z-10">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">帖子详情</h2>
          </div>
          <button
            class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
            @click="handleClose"
          >
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        <div class="px-6 py-6 space-y-6">
          <div class="flex items-center gap-4">
            <div class="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
              {{ postData?.author?.charAt(0) || '头' }}
            </div>
            <div>
              <p class="text-base font-semibold text-slate-900 dark:text-white">{{ postData?.author || '未知用户' }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">发布于 {{ postData?.time || '未知时间' }}</p>
            </div>
          </div>
          <div class="space-y-3">
            <h3 class="text-xl font-semibold text-slate-900 dark:text-white">{{ postData?.title || '无标题' }}</h3>
            <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {{ postData?.content || postData?.excerpt || '暂无内容' }}
            </p>
          </div>
          <div v-if="postData?.images && postData.images.length > 0" class="grid grid-cols-2 gap-4">
            <img
              v-for="(img, index) in postData.images"
              :key="index"
              class="rounded-xl object-cover w-full h-48"
              :src="img"
              :alt="`post image ${index + 1}`"
            />
          </div>
          <!-- 评论列表 -->
          <div v-if="postData?.comments && postData.comments.length > 0" class="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h4 class="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">chat</span>评论 ({{ postData.comments.length }})
            </h4>
            <ul class="space-y-4 max-h-64 overflow-y-auto pr-2">
              <li
                v-for="(comment, index) in postData.comments"
                :key="index"
                class="flex gap-3"
              >
                <div class="size-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium shrink-0">
                  {{ comment.author?.charAt(0) || '头' }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-slate-900 dark:text-white">{{ comment.author || '未知用户' }}</span>
                    <span class="text-xs text-slate-400">{{ comment.time || '未知时间' }}</span>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ comment.content || '暂无内容' }}</p>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h4 class="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">chat</span>评论 (0)
            </h4>
            <p class="text-sm text-slate-500 dark:text-slate-400">暂无评论</p>
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
interface Comment {
  author?: string;
  time?: string;
  content?: string;
}

interface PostData {
  id?: number;
  title?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  time?: string;
  images?: string[];
  comments?: Comment[];
}

const props = defineProps<{
  visible: boolean;
  postData?: PostData;
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

