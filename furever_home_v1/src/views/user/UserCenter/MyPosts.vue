<template>
  <div>
    <h2 class="text-2xl font-bold mb-5" style="color: #111;">我发布的帖子</h2>

    <div v-if="posts.length" class="flex flex-col gap-5">
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="bg-white rounded-xl p-6 shadow-sm flex flex-col border cursor-pointer transition-transform hover:-translate-y-1"
        style="border-color: #F3F4F6;"
        @click="goToDetail(post)"
      >
        <!-- 头部用户信息 & 帖子状态 -->
        <div class="flex items-center justify-between mb-3">
        <div class="flex items-center">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white mr-2.5 overflow-hidden"
            style="background-color: #FBBF24;"
          >
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="用户头像"
              class="w-full h-full object-cover"
            />
            <span v-else>{{ userName.charAt(0) }}</span>
          </div>
            <div class="flex items-center gap-2.5 text-sm">
              <span class="font-bold" style="color: #333;">{{ userName }}</span>
              <span class="text-xs" style="color: #9CA3AF;">{{ post.time }}</span>
            </div>
          </div>

          <!-- 审核状态标签 -->
          <div v-if="post.reviewStatus" class="ml-4">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
              :class="getReviewStatusClass(post.reviewStatus)"
            >
              审核状态：{{ post.reviewStatus }}
            </span>
          </div>
        </div>

        <!-- 标题 -->
        <div class="text-lg font-bold mb-2.5 leading-snug" style="color: #E67E22;">
          {{ post.title }}
        </div>

        <!-- 正文 -->
        <div class="text-sm leading-relaxed mb-4" style="color: #333;">
          {{ post.content }}
        </div>

        <!-- 图片区域 -->
        <div v-if="post.images && post.images.length" class="grid grid-cols-3 gap-2.5 mb-4">
          <div 
            v-for="(img, index) in post.images" 
            :key="index"
            class="bg-gray-200 rounded-md aspect-[16/10] flex items-center justify-center text-xs text-gray-400 overflow-hidden"
          >
            <img 
              v-if="typeof img === 'string' && (img.startsWith('http') || img.startsWith('/'))"
              :src="img" 
              :alt="`帖子图片 ${index + 1}`"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <span v-else>{{ img }}</span>
          </div>
        </div>

        <!-- 底部数据栏和操作按钮 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6 text-xs" style="color: #6B7280;">
            <div class="flex items-center gap-1.5 cursor-pointer hover:text-[#FF8C00]">
              <i class="fa-solid fa-heart text-sm"></i>
              {{ post.likes }}
            </div>
            <div class="flex items-center gap-1.5 cursor-pointer hover:text-[#FF8C00]">
              <i class="fa-solid fa-comment text-sm"></i>
              {{ post.comments }}
            </div>
            <div class="flex items-center gap-1.5 cursor-pointer hover:text-[#FF8C00]">
              <i class="fa-solid fa-eye text-sm"></i>
              {{ post.views }}
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              class="px-4 py-1.5 text-sm font-medium rounded-lg cursor-pointer transition-all hover:opacity-90"
              style="background-color: #F59E0B; color: white;"
              @click.stop="handleEdit(post)"
            >
              <i class="fa-regular fa-pen-to-square"></i> 编辑
            </button>
            <button
              class="px-4 py-1.5 text-sm font-medium rounded-lg cursor-pointer transition-all hover:opacity-90"
              style="background-color: #EF4444; color: white;"
              @click.stop="handleDelete(post)"
            >
              <i class="fa-solid fa-trash"></i> 删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-8 text-center text-sm" style="color: #9CA3AF;">
      当前还没有发布帖子
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-10 mb-5" v-if="total > pageSize">
      <div class="flex gap-2.5">
        <button 
          class="w-10 h-10 rounded-lg border border-gray-300 bg-white text-sm cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
          style="color: #6B7280;"
          @click="goPrev"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page"
          class="w-10 h-10 rounded-lg border border-gray-300 bg-white text-sm cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
          :class="page === currentPage ? 'bg-[#FF8C00] text-white border-[#FF8C00]' : 'text-gray-600'"
          style="color: #6B7280;"
          @click="goPage(page)"
        >
          {{ page }}
        </button>
        <button 
          class="w-10 h-10 rounded-lg border border-gray-300 bg-white text-sm cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
          style="color: #6B7280;"
          @click="goNext"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <ConfirmModal
      :visible="showDeleteConfirmModal"
      title="确认删除"
      message="确定要删除这条帖子吗？删除后无法恢复。"
      @confirm="confirmDelete"
      @cancel="closeDeleteConfirm"
    />

    <!-- 删除成功弹窗 -->
    <SuccessModal
      :visible="showDeleteSuccessModal"
      :title="deleteResult.title"
      :message="deleteResult.message"
      @close="closeDeleteSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmModal from '../../../components/common/ConfirmModal.vue';
import SuccessModal from '../../../components/common/SuccessModal.vue';
import { getMyPostList, deletePost } from '@/api/postApi';
import { getCurrentUser, type CurrentUserInfo } from '@/api/userApi';

const router = useRouter();

interface Post {
  id: number;
  title: string;
  content: string;
  time: string;
  images: string[];
  likes: number;
  comments: number;
  views: number;
   // 审核状态：待审核 / 通过 / 拒绝
  reviewStatus?: string;
}

const userName = ref('用户');
const avatarUrl = ref<string | null>(null);

const posts = ref<Post[]>([]);

const currentPage = ref(1);
const pageSize = 10;
const total = ref(0);
const totalPages = computed(() => Math.max(1, Math.ceil((total.value || 0) / pageSize)));

const showDeleteConfirmModal = ref(false);
const showDeleteSuccessModal = ref(false);
const postToDelete = ref<Post | null>(null);
const deleteResult = reactive({
  title: '删除成功',
  message: '帖子已成功删除。'
});

function handleEdit(post: Post) {
  // 跳转到发帖页面的编辑模式
  router.push({
    name: 'PostNew',
    query: { id: post.id.toString(), mode: 'edit' }
  });
}

function handleDelete(post: Post) {
  postToDelete.value = post;
  showDeleteConfirmModal.value = true;
}

async function confirmDelete() {
  if (!postToDelete.value) {
    showDeleteConfirmModal.value = false;
    return;
  }

  try {
    const id = postToDelete.value.id;
    const res = await deletePost(id);

    if (res.code === 200) {
      // 本地列表中移除
      const index = posts.value.findIndex(p => p.id === id);
      if (index > -1) {
        posts.value.splice(index, 1);
      }
      deleteResult.title = '删除成功';
      deleteResult.message = '帖子已成功删除。';
    } else {
      console.error('删除帖子失败', res);
      deleteResult.title = '删除失败';
      deleteResult.message = res.message || '删除帖子失败，请稍后重试。';
    }
  } catch (err) {
    console.error('删除帖子接口异常', err);
    deleteResult.title = '删除失败';
    deleteResult.message = '删除帖子接口异常，请稍后重试。';
  } finally {
    showDeleteConfirmModal.value = false;
    showDeleteSuccessModal.value = true;
    postToDelete.value = null;
  }
}

function closeDeleteConfirm() {
  showDeleteConfirmModal.value = false;
  postToDelete.value = null;
}

function closeDeleteSuccess() {
  showDeleteSuccessModal.value = false;
}

// 从「我的帖子」跳转到帖子详情，同时把基础信息通过 query 传过去，便于在详情页回显（例如待审核时后端不返回详情）
function goToDetail(post: Post) {
  router.push({
    name: 'PostDetail',
    params: { id: post.id.toString() },
    query: {
      from: 'myPosts',
      title: post.title,
      content: post.content,
      time: post.time,
      images: JSON.stringify(post.images || []),
      reviewStatus: post.reviewStatus || ''
    }
  });
}

async function loadPosts(page = 1) {
  try {
    const res = await getMyPostList({ page, pageSize });
    console.log('我的帖子列表API返回:', res);
    
    if (res.code === 200 && res.data) {
      total.value = res.data.total ?? 0;
      const records = res.data.records ?? [];
      console.log('帖子记录:', records);
      
      posts.value = records.map((item: any, index: number) => {
        const id = item.postId ?? item.id ?? index + 1;
        const title = item.title || '';
        const content = item.content || '';
        const time = item.createTime || '';
        
        // 解析图片：优先 images，其次 mediaUrls（可能是数组或字符串）
        let images: string[] = [];
        if (Array.isArray(item.images)) {
          images = item.images;
        } else if (Array.isArray(item.mediaUrls)) {
          images = item.mediaUrls;
        } else if (typeof item.mediaUrls === 'string' && item.mediaUrls) {
          try {
            const parsed = JSON.parse(item.mediaUrls);
            if (Array.isArray(parsed)) {
              images = parsed;
            } else {
              images = [item.mediaUrls];
            }
          } catch {
            images = [item.mediaUrls];
          }
        }
        
        console.log(`帖子 ${id} (${title}) 的图片:`, images);
        
        return {
          id,
          title,
          content,
          time,
          images,
          likes: item.likeCount ?? 0,
          comments: item.commentCount ?? 0,
          views: item.viewCount ?? 0,
          reviewStatus: item.reviewStatus || '',
        } as Post;
      });
      
      console.log('处理后的帖子列表:', posts.value);
    } else {
      console.error('获取我的帖子列表失败', res);
    }
  } catch (err) {
    console.error('获取我的帖子列表接口异常', err);
  }
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.style.display = 'none';
  }
};

// 加载当前登录用户信息（昵称和头像），用于展示“我”的帖子列表头部信息
function loadUserFromCache() {
  try {
    const cached = localStorage.getItem('currentUser');
    if (cached) {
      const data = JSON.parse(cached) as CurrentUserInfo;
      if (data.userName) userName.value = data.userName;
      if (data.avatarUrl) avatarUrl.value = data.avatarUrl;
    }
  } catch (e) {
    console.error('解析本地缓存用户信息失败(MyPosts)', e);
  }
}

async function loadUserFromApi() {
  try {
    const res = await getCurrentUser();
    if ((res.code === 0 || res.code === 200) && res.data) {
      const data = res.data;
      if (data.userName) userName.value = data.userName;
      if (data.avatarUrl) avatarUrl.value = data.avatarUrl;
      // 更新本地缓存，供其他页面复用
      localStorage.setItem('currentUser', JSON.stringify(data));
    }
  } catch (e) {
    console.error('获取当前用户信息失败(MyPosts)', e);
  }
}

function goPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  loadPosts(page);
}

function goPrev() {
  if (currentPage.value > 1) {
    goPage(currentPage.value - 1);
  }
}

function goNext() {
  if (currentPage.value < totalPages.value) {
    goPage(currentPage.value + 1);
  }
}

onMounted(() => {
  loadUserFromCache();
  loadUserFromApi();
  loadPosts(currentPage.value);
});

function getReviewStatusClass(status: string) {
  if (status === '通过') {
    return 'bg-green-50 text-green-600';
  }
  if (status === '拒绝') {
    return 'bg-red-50 text-red-500';
  }
  // 默认：待审核 或 其它未知状态
  return 'bg-yellow-50 text-yellow-600';
}
</script>

<style scoped>
</style>
