<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-[-0.033em]">管理帖子</h1>
    </header>
    <section class="bg-white dark:bg-[#181C25] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div class="flex flex-wrap border-b border-gray-100 dark:border-gray-800 text-sm font-medium">
        <button
          class="py-4 px-6 transition-colors"
          :class="activeTab === 'pending' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 border-b-2 border-transparent hover:text-primary'"
          @click="activeTab = 'pending'"
        >
          待审核的帖子列表
        </button>
        <button
          class="py-4 px-6 transition-colors"
          :class="activeTab === 'published' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 border-b-2 border-transparent hover:text-primary'"
          @click="activeTab = 'published'"
        >
          已发布的帖子列表
        </button>
      </div>

      <!-- 待审核标签页 -->
      <div v-if="activeTab === 'pending'" class="post-tab">
        <div class="p-5 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <div class="relative">
            <input
              v-model="pendingSearch"
              type="text"
              placeholder="搜索帖子..."
              class="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-5 p-5">
          <div
            v-for="post in paginatedPendingPosts"
            :key="post.id"
            class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1C202B] shadow-sm p-5 flex flex-col gap-4"
          >
            <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">#{{ post.id }}</span>
            <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">头像</div>
                <div class="flex flex-col">
                  <span class="text-gray-900 dark:text-white">{{ post.author }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="material-symbols-outlined text-base text-gray-400">schedule</span>
                <span>{{ post.time }}</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ post.title }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{{ post.excerpt }}</p>
              </div>
            </div>
            <div class="flex items-center justify-end gap-2">
              <button
                title="审核通过"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30"
                @click="handleApprove(post)"
              >
                <span class="material-symbols-outlined">check</span>
              </button>
              <button
                title="审核不通过"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                @click="handleReject(post)"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
              <button
                title="查看详情"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                @click="handleViewDetail(post)"
              >
                <span class="material-symbols-outlined">visibility</span>
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 p-5">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            显示 {{ pendingTotal ? (currentPendingPage - 1) * PAGE_SIZE + 1 : 0 }} 到 {{ Math.min(currentPendingPage * PAGE_SIZE, pendingTotal) }} 条，共 {{ pendingTotal }} 条
          </p>
          <div class="flex gap-2">
            <button
              :disabled="currentPendingPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentPendingPage--"
            >
              上一页
            </button>
            <button
              v-for="page in totalPendingPages"
              :key="page"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm transition-colors"
              :class="page === currentPendingPage ? 'bg-primary text-white border-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
              @click="currentPendingPage = page"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPendingPage === totalPendingPages"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentPendingPage++"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      <!-- 已发布标签页 -->
      <div v-if="activeTab === 'published'" class="post-tab">
        <div class="p-5 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <div class="relative">
            <input
              v-model="publishedSearch"
              type="text"
              placeholder="搜索帖子..."
              class="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-5 p-5">
          <div
            v-for="post in paginatedPublishedPosts"
            :key="post.id"
            class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1C202B] shadow-sm p-5 flex flex-col gap-4"
          >
            <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">#{{ post.id }}</span>
            <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">头像</div>
                <div class="flex flex-col">
                  <span class="text-gray-900 dark:text-white">{{ post.author }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="material-symbols-outlined text-base text-gray-400">schedule</span>
                <span>{{ post.time }}</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ post.title }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ post.excerpt }}</p>
              </div>
            </div>
            <div class="flex items-center justify-end gap-2">
              <button
                title="查看详情"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                @click="handleViewDetail(post)"
              >
                <span class="material-symbols-outlined">visibility</span>
              </button>
              <button
                title="删除"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                @click="handleDelete(post)"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 p-5">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            显示 {{ publishedTotal ? (currentPublishedPage - 1) * PAGE_SIZE + 1 : 0 }} 到 {{ Math.min(currentPublishedPage * PAGE_SIZE, publishedTotal) }} 条，共 {{ publishedTotal }} 条
          </p>
          <div class="flex gap-2">
            <button
              :disabled="currentPublishedPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentPublishedPage--"
            >
              上一页
            </button>
            <button
              v-for="page in totalPublishedPages"
              :key="page"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm transition-colors"
              :class="page === currentPublishedPage ? 'bg-primary text-white border-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
              @click="currentPublishedPage = page"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPublishedPage === totalPublishedPages"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentPublishedPage++"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 弹窗组件 -->
    <PostDetailModal
      :visible="showPostDetailModal"
      :post-data="selectedPost ? {
        id: selectedPost.id,
        title: selectedPost.title,
        excerpt: selectedPost.excerpt,
        author: selectedPost.author,
        time: selectedPost.time,
        comments: []
      } : undefined"
      @close="showPostDetailModal = false"
    />
    <ApproveModal
      :visible="showApproveModal"
      message="该帖子已成功通过审核并发布。"
      @close="showApproveModal = false"
      @confirm="onApproveConfirm"
    />
    <RejectModal
      :visible="showRejectModal"
      message="该帖子审核未通过，已通知发布者。"
      @close="showRejectModal = false"
      @confirm="onRejectConfirm"
    />
    <DeleteSuccessModal
      :visible="showDeleteSuccessModal"
      message="该帖子已从列表中永久移除。"
      @close="showDeleteSuccessModal = false"
      @confirm="onDeleteConfirm"
    />
    <ConfirmModal
      :visible="showConfirmModal"
      :title="confirmAction === 'approve' ? '确认审核通过' : confirmAction === 'reject' ? '确认审核不通过' : '确认删除'"
      :message="confirmAction === 'approve' ? '确定要通过该帖子的审核吗？' : confirmAction === 'reject' ? '确定要拒绝该帖子的审核吗？' : '确定要删除该帖子吗？此操作不可恢复。'"
      @confirm="onConfirmModalConfirm"
      @cancel="onConfirmModalCancel"
      @close="onConfirmModalCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import PostDetailModal from '../../components/admin/PostDetailModal.vue';
import ApproveModal from '../../components/admin/ApproveModal.vue';
import RejectModal from '../../components/admin/RejectModal.vue';
import DeleteSuccessModal from '../../components/admin/DeleteSuccessModal.vue';
import ConfirmModal from '../../components/admin/ConfirmModal.vue';
import {
  getPendingPosts,
  getPublishedPosts,
  getPostDetail,
  approvePost,
  rejectPost,
  deletePost as deletePostApi,
  type AdminPostSummaryDto,
  type AdminPostDetailDto
} from '../../api/adminApi';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  time: string;
}

const route = useRoute();
const PAGE_SIZE = 10;

const activeTab = ref<string>((route.query.tab as string) || 'pending');
const pendingSearch = ref('');
const publishedSearch = ref('');
const currentPendingPage = ref(1);
const currentPublishedPage = ref(1);

// 生成示例数据
const generatePendingPosts = (): Post[] => {
  return Array.from({ length: 32 }, (_, i) => ({
    id: 2001 + i,
    title: `待审核帖子 ${2001 + i}`,
    excerpt: '发布者介绍一只待领养宠物的背景、性格以及适合的家庭环境，等待管理员审核。',
    author: ['周八', '吴九', '郑十', '钱十一', '吕十二'][i % 5],
    time: `2023-07-${(i % 20) + 1} ${9 + (i % 9)}:${(i * 5) % 60}`
  }));
};

// 待审核和已发布帖子数据来自后端
const pendingPosts = ref<Post[]>([]);
const pendingTotal = ref(0);
const publishedPosts = ref<Post[]>([]);
const publishedTotal = ref(0);
const loadingPending = ref(false);
const loadingPublished = ref(false);

const filteredPendingPosts = computed(() => {
  if (!pendingSearch.value) return pendingPosts.value;
  const search = pendingSearch.value.toLowerCase();
  return pendingPosts.value.filter(
    post => post.title.toLowerCase().includes(search) ||
            post.author.toLowerCase().includes(search) ||
            post.excerpt.toLowerCase().includes(search)
  );
});

const filteredPublishedPosts = computed(() => {
  if (!publishedSearch.value) return publishedPosts.value;
  const search = publishedSearch.value.toLowerCase();
  return publishedPosts.value.filter(
    post =>
      post.title.toLowerCase().includes(search) ||
      post.author.toLowerCase().includes(search) ||
      post.excerpt.toLowerCase().includes(search)
  );
});

const totalPendingPages = computed(() => Math.ceil(pendingTotal.value / PAGE_SIZE));
const totalPublishedPages = computed(() => Math.ceil(publishedTotal.value / PAGE_SIZE));

// 待审核列表由后端分页，前端仅做搜索过滤
const paginatedPendingPosts = computed(() => {
  if (!pendingSearch.value) return pendingPosts.value;
  const search = pendingSearch.value.toLowerCase();
  return pendingPosts.value.filter(
    post => post.title.toLowerCase().includes(search) ||
            post.author.toLowerCase().includes(search) ||
            post.excerpt.toLowerCase().includes(search)
  );
});

// 已发布列表由后端分页，前端仅做搜索过滤
const paginatedPublishedPosts = computed(() => {
  if (!publishedSearch.value) return publishedPosts.value;
  const search = publishedSearch.value.toLowerCase();
  return publishedPosts.value.filter(
    post =>
      post.title.toLowerCase().includes(search) ||
      post.author.toLowerCase().includes(search) ||
      post.excerpt.toLowerCase().includes(search)
  );
});

// 将后端 AdminPostSummaryDto 映射到前端展示用 Post
function mapAdminPostToPost(item: AdminPostSummaryDto): Post {
  const createTime = item.createTime
    ? typeof item.createTime === 'string'
      ? new Date(item.createTime).toLocaleString('zh-CN')
      : new Date(item.createTime).toLocaleString('zh-CN')
    : '';
  return {
    id: item.postId ?? 0,
    title: item.title ?? '',
    excerpt: item.excerpt ?? '',
    author: item.authorName ?? '未知作者',
    time: createTime
  };
}

// 加载待审核帖子列表
async function loadPendingPosts() {
  try {
    loadingPending.value = true;
    const res = await getPendingPosts({
      page: currentPendingPage.value,
      pageSize: PAGE_SIZE,
      keyword: pendingSearch.value || undefined
    });
    if ((res.code === 0 || res.code === 200) && res.data) {
      const list = res.data.list || res.data.records || [];
      pendingPosts.value = list.map(mapAdminPostToPost);
      pendingTotal.value = res.data.total ?? list.length;
    } else {
      console.warn('获取待审核帖子列表失败', res);
    }
  } catch (error) {
    console.error('获取待审核帖子列表异常', error);
  } finally {
    loadingPending.value = false;
  }
}

// 加载已发布帖子列表
async function loadPublishedPosts() {
  try {
    loadingPublished.value = true;
    const res = await getPublishedPosts({
      page: currentPublishedPage.value,
      pageSize: PAGE_SIZE,
      keyword: publishedSearch.value || undefined
    });
    if ((res.code === 0 || res.code === 200) && res.data) {
      const list = res.data.list || res.data.records || [];
      publishedPosts.value = list.map(mapAdminPostToPost);
      publishedTotal.value = res.data.total ?? list.length;
    } else {
      console.warn('获取已发布帖子列表失败', res);
    }
  } catch (error) {
    console.error('获取已发布帖子列表异常', error);
  } finally {
    loadingPublished.value = false;
  }
}

// 弹窗状态
const showPostDetailModal = ref(false);
const showApproveModal = ref(false);
const showRejectModal = ref(false);
const showDeleteSuccessModal = ref(false);
const showConfirmModal = ref(false);
const confirmAction = ref<'approve' | 'reject' | 'delete' | null>(null);
const selectedPost = ref<Post | null>(null);

function handleApprove(post: Post) {
  selectedPost.value = post;
  confirmAction.value = 'approve';
  showConfirmModal.value = true;
}

function handleReject(post: Post) {
  selectedPost.value = post;
  confirmAction.value = 'reject';
  showConfirmModal.value = true;
}

async function handleViewDetail(post: Post) {
  try {
    const res = await getPostDetail(post.id);
    if ((res.code === 0 || res.code === 200) && res.data) {
      selectedPost.value = {
        id: res.data.postId ?? post.id,
        title: res.data.title ?? post.title,
        excerpt: res.data.content?.substring(0, 100) ?? post.excerpt,
        author: res.data.authorName ?? post.author,
        time: res.data.createTime
          ? typeof res.data.createTime === 'string'
            ? new Date(res.data.createTime).toLocaleString('zh-CN')
            : new Date(res.data.createTime).toLocaleString('zh-CN')
          : post.time
      };
      showPostDetailModal.value = true;
    } else {
      console.warn('获取帖子详情失败', res);
      // 如果获取详情失败，仍然显示基本信息
      selectedPost.value = post;
      showPostDetailModal.value = true;
    }
  } catch (error) {
    console.error('获取帖子详情异常', error);
    // 如果获取详情失败，仍然显示基本信息
    selectedPost.value = post;
    showPostDetailModal.value = true;
  }
}

function handleDelete(post: Post) {
  selectedPost.value = post;
  confirmAction.value = 'delete';
  showConfirmModal.value = true;
}

async function onConfirmModalConfirm() {
  if (!selectedPost.value || !confirmAction.value) return;
  
  showConfirmModal.value = false;
  
  try {
    if (confirmAction.value === 'approve') {
      // 审核通过
      const res = await approvePost(selectedPost.value.id);
      if (res.code === 0 || res.code === 200) {
        showApproveModal.value = true;
        // 从待审核列表中移除
        if (activeTab.value === 'pending') {
          await loadPendingPosts();
        }
      } else {
        alert(res.message || '审核通过失败');
      }
    } else if (confirmAction.value === 'reject') {
      // 审核拒绝
      const reason = prompt('请输入拒绝原因（可选）:') || '';
      const res = await rejectPost(selectedPost.value.id, { reason });
      if (res.code === 0 || res.code === 200) {
        showRejectModal.value = true;
        // 从待审核列表中移除
        if (activeTab.value === 'pending') {
          await loadPendingPosts();
        }
      } else {
        alert(res.message || '审核拒绝失败');
      }
    } else if (confirmAction.value === 'delete') {
      // 删除帖子
      const res = await deletePostApi(selectedPost.value.id);
      if (res.code === 0 || res.code === 200) {
        showDeleteSuccessModal.value = true;
        // 从列表中移除
        if (activeTab.value === 'pending') {
          await loadPendingPosts();
        } else {
          await loadPublishedPosts();
        }
      } else {
        alert(res.message || '删除失败');
      }
    }
  } catch (error: any) {
    console.error('操作失败', error);
    alert(error?.message || '操作失败，请稍后重试');
  }
}

function onConfirmModalCancel() {
  showConfirmModal.value = false;
  confirmAction.value = null;
}

function onApproveConfirm() {
  showApproveModal.value = false;
  selectedPost.value = null;
  confirmAction.value = null;
}

function onRejectConfirm() {
  showRejectModal.value = false;
  selectedPost.value = null;
  confirmAction.value = null;
}

function onDeleteConfirm() {
  showDeleteSuccessModal.value = false;
  selectedPost.value = null;
  confirmAction.value = null;
}

onMounted(() => {
  if (route.query.tab) {
    activeTab.value = route.query.tab as string;
  }

  // 根据当前标签页加载数据
  if (activeTab.value === 'pending') {
    loadPendingPosts();
  } else if (activeTab.value === 'published') {
    loadPublishedPosts();
  }
});

// 监听分页变化
watch(currentPendingPage, () => {
  if (activeTab.value === 'pending') {
    loadPendingPosts();
  }
});

watch(currentPublishedPage, () => {
  if (activeTab.value === 'published') {
    loadPublishedPosts();
  }
});

// 监听标签页切换
watch(activeTab, (value) => {
  if (value === 'pending') {
    currentPendingPage.value = 1;
    loadPendingPosts();
  } else if (value === 'published') {
    currentPublishedPage.value = 1;
    loadPublishedPosts();
  }
});

// 监听搜索关键词变化（防抖）
let pendingSearchTimer: number | undefined;
watch(pendingSearch, () => {
  if (pendingSearchTimer) clearTimeout(pendingSearchTimer);
  pendingSearchTimer = window.setTimeout(() => {
    if (activeTab.value === 'pending') {
      currentPendingPage.value = 1;
      loadPendingPosts();
    }
  }, 500);
});

let publishedSearchTimer: number | undefined;
watch(publishedSearch, () => {
  if (publishedSearchTimer) clearTimeout(publishedSearchTimer);
  publishedSearchTimer = window.setTimeout(() => {
    if (activeTab.value === 'published') {
      currentPublishedPage.value = 1;
      loadPublishedPosts();
    }
  }, 500);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>

