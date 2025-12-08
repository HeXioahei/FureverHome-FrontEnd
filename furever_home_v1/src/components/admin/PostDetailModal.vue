<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
    <div class="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="rounded-2xl bg-white dark:bg-[#1A1E26] shadow-2xl">
        <div class="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5 sticky top-0 bg-white dark:bg-[#1A1E26] z-10 rounded-t-2xl">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">帖子详情</h2>
          </div>
          <button
            class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
            @click="handleClose"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div class="px-6 py-6 space-y-5">
          <div class="flex items-center gap-4">
            <img
              v-if="postData?.authorAvatar"
              :src="postData.authorAvatar"
              :alt="postData.author"
              class="size-14 rounded-full object-cover shrink-0"
              @error="(e: any) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }"
            />
            <div
              v-if="!postData?.authorAvatar || !postData.authorAvatar.trim()"
              class="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-semibold shrink-0"
            >
              {{ postData?.author?.charAt(0) || '头' }}
            </div>
            <div>
              <p class="text-base font-semibold text-slate-900 dark:text-white">{{ postData?.author || '未知用户' }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">发布于 {{ postData?.time || '未知时间' }}</p>
            </div>
          </div>
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ postData?.title || '无标题' }}</h3>
            <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {{ postData?.content || postData?.excerpt || '暂无内容' }}
            </p>
          </div>
          <div v-if="postData?.images && postData.images.length > 0" class="grid grid-cols-2 gap-3">
            <img
              v-for="(img, index) in postData.images"
              :key="index"
              class="rounded-xl object-cover w-full h-40"
              :src="img"
              :alt="`post image ${index + 1}`"
            />
          </div>
          <!-- 评论列表 -->
          <div class="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-5">
            <h4 class="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-base">chat</span>评论 ({{ commentsTotal }})
            </h4>
            <div v-if="loadingComments" class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              加载中...
            </div>
            <ul v-else-if="comments.length > 0" class="space-y-3">
              <li
                v-for="comment in comments"
                :key="comment.commentId"
                class="flex gap-3"
              >
                <img
                  v-if="comment.userAvatar"
                  :src="comment.userAvatar"
                  :alt="comment.userName"
                  class="size-9 rounded-full object-cover shrink-0"
                  @error="(e: any) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }"
                />
                <div
                  v-if="!comment.userAvatar || !comment.userAvatar.trim()"
                  class="size-9 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300 flex items-center justify-center text-xs font-medium shrink-0"
                >
                  {{ comment.userName?.charAt(0) || '头' }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-slate-900 dark:text-white">{{ comment.userName || '未知用户' }}</span>
                    <span class="text-xs text-slate-400">{{ formatDateTime(comment.createTime) }}</span>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ comment.content || '暂无内容' }}</p>
                </div>
              </li>
            </ul>
            <p v-else class="text-sm text-slate-500 dark:text-slate-400">暂无评论</p>
            <!-- 评论分页 -->
            <div v-if="commentsTotal > 0" class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <p class="text-xs text-slate-500 dark:text-slate-400">
                显示 {{ (commentPage - 1) * COMMENT_PAGE_SIZE + 1 }} 到 {{ Math.min(commentPage * COMMENT_PAGE_SIZE, commentsTotal) }} 条，共 {{ commentsTotal }} 条
              </p>
              <div class="flex gap-2">
                <button
                  :disabled="commentPage === 1"
                  class="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="commentPage--"
                >
                  上一页
                </button>
                <button
                  v-for="page in commentTotalPages"
                  :key="page"
                  class="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-lg text-xs transition-colors"
                  :class="page === commentPage ? 'bg-blue-500 text-white border-blue-500' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
                  @click="commentPage = page"
                >
                  {{ page }}
                </button>
                <button
                  :disabled="commentPage === commentTotalPages"
                  class="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="commentPage++"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 px-6 py-4 rounded-b-2xl">
          <button
            class="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
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
import { ref, computed, watch } from 'vue';
import { getPostComments, type AdminCommentDto } from '../../api/adminApi';
import { formatDateTime } from '@/utils/format';

interface PostData {
  id?: number;
  title?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  authorAvatar?: string;
  time?: string;
  images?: string[];
}

const COMMENT_PAGE_SIZE = 5;

const props = defineProps<{
  visible: boolean;
  postData?: PostData;
}>();

const emit = defineEmits<{
  close: [];
}>();

const comments = ref<AdminCommentDto[]>([]);
const commentsTotal = ref(0);
const commentPage = ref(1);
const loadingComments = ref(false);

const commentTotalPages = computed(() => Math.ceil(commentsTotal.value / COMMENT_PAGE_SIZE));


async function loadComments() {
  if (!props.postData?.id) return;
  
  try {
    loadingComments.value = true;
    const res = await getPostComments(props.postData.id, {
      page: commentPage.value,
      pageSize: COMMENT_PAGE_SIZE
    });
    
    if ((res.code === 0 || res.code === 200) && res.data) {
      const list = res.data.list || res.data.records || [];
      comments.value = list;
      commentsTotal.value = res.data.total ?? list.length;
    } else {
      comments.value = [];
      commentsTotal.value = 0;
    }
  } catch (error) {
    console.error('获取评论列表异常', error);
    comments.value = [];
    commentsTotal.value = 0;
  } finally {
    loadingComments.value = false;
  }
}

// 监听 visible 和 postData.id 变化，重新加载评论
watch([() => props.visible, () => props.postData?.id], ([newVisible, newId]) => {
  if (newVisible && newId) {
    commentPage.value = 1;
    loadComments();
  }
});

// 监听分页变化，重新加载评论
watch(commentPage, () => {
  if (props.visible && props.postData?.id) {
    loadComments();
  }
});

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
