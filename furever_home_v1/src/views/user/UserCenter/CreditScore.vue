<template>
  <div>
    <h2 class="text-2xl font-bold mb-5" style="color: #111;">我的信誉积分</h2>
    
    <!-- 积分概览卡片 -->
    <div class="bg-white rounded-xl p-6 shadow-sm mb-10">
      <div class="bg-gray-50 rounded-lg p-6 flex items-center gap-5">
        <span class="text-5xl font-extrabold leading-none" style="color: #E67E22;">
          4.5<span class="text-2xl font-medium" style="color: #9CA3AF;">/5</span>
        </span>
        <div class="flex flex-col gap-1">
          <div class="text-lg font-bold" style="color: #111;">信誉良好</div>
          <div class="text-sm" style="color: #6B7280;">您的信誉积分很高，有助于提高领养成功率。</div>
        </div>
      </div>
    </div>

    <h2 class="text-2xl font-bold mb-5" style="color: #111;">他人评价</h2>
    
    <!-- 评价列表 -->
    <div v-if="reviews.length" class="flex flex-col gap-5">
      <div 
        v-for="review in reviews" 
        :key="review.id"
        class="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              :style="{ backgroundColor: review.avatarBg, color: review.avatarColor }"
            >
              <i :class="review.avatarIcon"></i>
            </div>
            <div class="flex flex-col">
              <span 
                class="text-base font-bold cursor-pointer transition-colors hover:text-[#FF8C42]" 
                style="color: #111;"
                @click="router.push({ name: 'UserProfile', params: { userId: review.nameId || getUserIdByName(review.name) } })"
              >
                {{ review.name }}
              </span>
              <span class="text-xs" style="color: #9CA3AF;">{{ review.time }}</span>
            </div>
          </div>
          <div class="text-sm" style="color: #F59E0B; letter-spacing: 2px;">
            <i 
              v-for="i in 5" 
              :key="i"
              :class="i <= review.stars ? 'fa-solid fa-star' : 'fa-regular fa-star'"
            ></i>
          </div>
        </div>
        <div class="text-sm leading-relaxed" style="color: #4B5563;">
          {{ review.content }}
        </div>
      </div>
    </div>

    <div v-else class="mt-8 text-center text-sm" style="color: #9CA3AF;">
      当前还没有收到评价
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-10 mb-5" v-if="total > pageSize">
      <div class="flex gap-2.5">
        <button 
          v-for="page in totalPages" 
          :key="page"
          class="w-11 h-11 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
          :class="page === currentPage ? 'bg-[#E67E22] text-white border-[#E67E22]' : 'text-gray-600'"
          style="color: #6B7280;"
          @click="goPage(page)"
        >
          {{ page }}
        </button>
        <button 
          v-if="currentPage < totalPages"
          class="px-5 h-11 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
          style="color: #6B7280;"
          @click="goPage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getReceivedRatings } from '@/api/ratingApi';

const router = useRouter();

interface Review {
  id: number;
  name: string;
  nameId?: number;
  time: string;
  stars: number;
  content: string;
  avatarBg: string;
  avatarColor: string;
  avatarIcon: string;
}

const reviews = ref<Review[]>([]);
const currentPage = ref(1);
const pageSize = 10;
const total = ref(0);

const totalPages = computed(() => {
  return Math.max(1, Math.ceil((total.value || 0) / pageSize));
});

async function loadReviews(page = 1) {
  try {
    const res = await getReceivedRatings({ page, pageSize });
    if (res.code === 200 && res.data) {
      total.value = res.data.total ?? 0;
      const records = res.data.records ?? [];
      reviews.value = records.map((item: any, index: number) => {
        const id = item.ratingId ?? index + 1;
        const name = item.otherUserName || '匿名用户';
        const nameId = item.otherUserId;
        const time = item.createTime || '';
        const stars = item.score ?? 0;
        const content = item.content || '';
        // 头像样式暂时简单处理
        return {
          id,
          name,
          nameId,
          time,
          stars,
          content,
          avatarBg: '#F3C697',
          avatarColor: 'white',
          avatarIcon: 'fa-regular fa-circle'
        } as Review;
      });
    } else {
      console.error('获取评价列表失败', res);
    }
  } catch (err) {
    console.error('获取评价列表接口异常', err);
  }
}

function goPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  loadReviews(page);
}

// 根据用户名获取用户ID（这里应该从API获取，暂时使用映射）
function getUserIdByName(name: string): number {
  const nameToIdMap: Record<string, number> = {
    '张伟': 2,
    '李静': 4,
    '王强': 5,
    '张同学': 2,
    '王老师': 3,
    '刘同学': 4,
    '陈学姐': 5,
    '赵同学': 6,
    '孙老师': 7,
    '周同学': 8,
    '吴同学': 9,
    '郑同学': 10,
    '钱老师': 11,
    '李同学': 1
  };
  return nameToIdMap[name] || 1;
}

onMounted(() => {
  loadReviews(currentPage.value);
});
</script>

<style scoped>
</style>

