<template>
  <div>
    <h2 class="text-2xl font-bold mb-5" style="color: #111;">我发布的帖子</h2>

    <div v-if="posts.length" class="flex flex-col gap-5">
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="bg-white rounded-xl p-6 shadow-sm flex flex-col border cursor-pointer transition-transform hover:-translate-y-1"
        style="border-color: #F3F4F6;"
        @click="router.push({ name: 'PostDetail', params: { id: post.id } })"
      >
        <!-- 头部用户信息 -->
        <div class="flex items-center mb-3">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white mr-2.5" style="background-color: #FBBF24;">
            {{ userName.charAt(0) }}
          </div>
          <div class="flex items-center gap-2.5 text-sm">
            <span class="font-bold" style="color: #333;">{{ userName }}</span>
            <span class="text-xs" style="color: #9CA3AF;">{{ post.time }}</span>
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
        <div class="grid grid-cols-3 gap-2.5 mb-4">
          <div 
            v-for="(img, index) in post.images" 
            :key="index"
            class="bg-gray-200 rounded-md aspect-[16/10] flex items-center justify-center text-xs text-gray-400 overflow-hidden"
          >
            {{ img }}
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
      title="删除成功"
      message="帖子已成功删除。"
      @close="closeDeleteSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmModal from '../../../components/common/ConfirmModal.vue';
import SuccessModal from '../../../components/common/SuccessModal.vue';
import { getMyPostList } from '@/api/postApi';

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
}

const userName = ref('李同学');

const posts = ref<Post[]>([]);

const currentPage = ref(1);
const pageSize = 10;
const total = ref(0);
const totalPages = computed(() => Math.max(1, Math.ceil((total.value || 0) / pageSize)));

const showDeleteConfirmModal = ref(false);
const showDeleteSuccessModal = ref(false);
const postToDelete = ref<Post | null>(null);

function handleDelete(post: Post) {
  postToDelete.value = post;
  showDeleteConfirmModal.value = true;
}

function confirmDelete() {
  if (postToDelete.value) {
    // 从列表中删除
    const index = posts.value.findIndex(p => p.id === postToDelete.value!.id);
    if (index > -1) {
      posts.value.splice(index, 1);
    }
    showDeleteSuccessModal.value = true;
    // 这里可以调用API删除帖子
  }
  showDeleteConfirmModal.value = false;
  postToDelete.value = null;
}

function closeDeleteConfirm() {
  showDeleteConfirmModal.value = false;
  postToDelete.value = null;
}

function closeDeleteSuccess() {
  showDeleteSuccessModal.value = false;
}

async function loadPosts(page = 1) {
  try {
    const res = await getMyPostList({ page, pageSize });
    if (res.code === 200 && res.data) {
      total.value = res.data.total ?? 0;
      const records = res.data.records ?? [];
      posts.value = records.map((item: any, index: number) => {
        const id = item.postId ?? item.id ?? index + 1;
        const title = item.title || '';
        const content = item.content || '';
        const time = item.createTime || '';
        let images: string[] = [];
        if (typeof item.mediaUrls === 'string' && item.mediaUrls) {
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
        return {
          id,
          title,
          content,
          time,
          images,
          likes: item.likeCount ?? 0,
          comments: item.commentCount ?? 0,
          views: item.viewCount ?? 0,
        } as Post;
      });
    } else {
      console.error('获取我的帖子列表失败', res);
    }
  } catch (err) {
    console.error('获取我的帖子列表接口异常', err);
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
  loadPosts(currentPage.value);
});
</script>

<style scoped>
</style>
