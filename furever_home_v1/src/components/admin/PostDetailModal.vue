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
            <div
              v-for="(img, index) in postData.images"
              :key="index"
              class="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-40"
            >
              <template v-if="isVideoUrl(img)">
                <video
                  :src="img"
                  controls
                  preload="metadata"
                  class="w-full h-full object-cover"
                ></video>
              </template>
              <template v-else>
                <img
                  class="object-cover w-full h-full"
                  :src="img"
                  :alt="`post image ${index + 1}`"
                />
              </template>
            </div>
          </div>
          <!-- 评论列表 -->
          <div class="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-5">
            <h4 class="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-base">chat</span>评论 ({{ commentsTotal }})
            </h4>
            <div v-if="loadingComments" class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              加载中...
            </div>
            <div v-else-if="displayedComments.length > 0" class="space-y-3">
              <CommentItem 
                v-for="comment in displayedComments"
                :key="comment.id"
                :comment="comment"
                :readonly="true"
              />
            </div>
            <p v-else class="text-sm text-slate-500 dark:text-slate-400">暂无评论</p>
            <!-- 评论分页 -->
            <div v-if="commentTotalPages > 1" class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <p class="text-xs text-slate-500 dark:text-slate-400">
                显示 {{ (commentPage - 1) * pageSize + 1 }} 到 {{ Math.min(commentPage * pageSize, comments.length) }} 条，共 {{ comments.length }} 条
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
import CommentItem from '@/components/forum/CommentItem.vue';
import type { Comment } from '@/api/commentapi';
import { isVideoUrl } from '@/utils/mediaUtils';

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

const pageSize = ref(5);

const props = defineProps<{
  visible: boolean;
  postData?: PostData;
}>();

const emit = defineEmits<{
  close: [];
}>();

// 统一映射为 Comment 结构
const normalizeComments = (list: any[]): Comment[] => {
  if (!Array.isArray(list)) return [];
  return list.map((item: any, index: number) => {
    let authorName = item.authorName ?? item.userName ?? item.nickName ?? item.nickname ?? '用户';
    
    let children: Comment[] = [];
    if (Array.isArray(item.children) && item.children.length > 0) {
       children = normalizeComments(item.children);
    } else if (Array.isArray(item.replies) && item.replies.length > 0) {
       children = normalizeComments(item.replies);
    }

    return {
      id: item.id ?? item.commentId ?? index + 1,
      content: item.content ?? item.commentContent ?? item.text ?? item.body ?? item.message ?? '',
      authorName: authorName,
      authorAvatar: item.authorAvatar ?? item.avatar ?? item.userAvatar ?? '',
      date: formatDateTime(item.createTime || item.date) || item.timeAgo || '刚刚',
      likes: item.likes ?? item.likeCount ?? 0,
      isLiked: item.isLiked ?? item.liked ?? false,
      parentId: item.parentId ?? item.parentCommentId ?? item.parent_id ?? null,
      replyTo: item.replyTo ?? item.replyToUser ?? item.reply_to_user_name ?? undefined,
      children: children
    };
  });
};

const comments = ref<Comment[]>([]);
const commentsTotal = ref(0);
const commentPage = ref(1);
const loadingComments = ref(false);

const displayedComments = computed(() => {
  const start = (commentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return comments.value.slice(start, end);
});

const commentTotalPages = computed(() => Math.ceil(comments.value.length / pageSize.value));

async function loadComments() {
  if (!props.postData?.id) return;
  
  try {
    loadingComments.value = true;
    const res = await getPostComments(props.postData.id, {
      page: 1,
      pageSize: 1000
    });
    
    let rawList: any[] = [];
    if ((res.code === 0 || res.code === 200) && res.data) {
       const d: any = res.data;
       if (Array.isArray(d)) {
          rawList = d;
       } else if (d && Array.isArray(d.data)) {
          rawList = d.data;
       } else if (d && Array.isArray(d.list)) {
          rawList = d.list;
       } else if (d && Array.isArray(d.records)) {
          rawList = d.records;
       }
       
       commentsTotal.value = res.data.total ?? rawList.length;
    }

    const flatComments = normalizeComments(rawList);
    
    const hasChildren = flatComments.some(c => c.children && c.children.length > 0);
    
    if (hasChildren) {
       comments.value = flatComments;
    } else {
        const commentMap = new Map<number, Comment>();
        const roots: Comment[] = [];

        flatComments.forEach((c: Comment) => {
          c.children = []; 
          commentMap.set(c.id, c);
        });

        flatComments.forEach((c: Comment) => {
          if (c.parentId) {
            const parent = commentMap.get(c.parentId);
            if (parent) {
              if (!c.replyTo) {
                 c.replyTo = parent.authorName;
              }
              let root = parent;
              let current = parent;
              let depth = 0;
              while (current.parentId && depth < 20) {
                const p = commentMap.get(current.parentId);
                if (p) {
                  current = p;
                  root = p;
                } else {
                  break;
                }
                depth++;
              }
              root.children = root.children || [];
              root.children.push(c);
            } else {
              roots.push(c);
            }
          } else {
            roots.push(c);
          }
        });
        
        roots.forEach(root => {
          if (root.children && root.children.length > 0) {
            root.children.sort((a, b) => a.id - b.id);
          }
        });

        comments.value = roots;
    }
  } catch (error) {
    console.error('获取评论列表异常', error);
    comments.value = [];
    commentsTotal.value = 0;
  } finally {
    loadingComments.value = false;
  }
}

watch([() => props.visible, () => props.postData?.id], ([newVisible, newId]) => {
  if (newVisible && newId) {
    commentPage.value = 1;
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
