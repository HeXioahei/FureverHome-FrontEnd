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
    <div class="flex flex-col gap-5">
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

    <!-- 分页 -->
    <div class="flex justify-center mt-10 mb-5">
      <div class="flex gap-2.5">
        <button 
          v-for="page in 4" 
          :key="page"
          class="w-11 h-11 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
          :class="page === 1 ? 'bg-[#E67E22] text-white border-[#E67E22]' : 'text-gray-600'"
          style="color: #6B7280;"
        >
          {{ page }}
        </button>
        <button 
          class="px-5 h-11 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
          style="color: #6B7280;"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

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

const reviews = ref<Review[]>([
  {
    id: 1,
    name: '张伟',
    nameId: 2,
    time: '2天前',
    stars: 5,
    content: '非常有爱心和责任心的领养人，对猫咪"米洛"照顾得无微不至，沟通顺畅，强烈推荐！',
    avatarBg: '#F3C697',
    avatarColor: 'white',
    avatarIcon: 'fa-regular fa-circle'
  },
  {
    id: 2,
    name: '李静',
    nameId: 4,
    time: '1周前',
    stars: 5,
    content: '沟通很及时，对宠物的了解也很专业。只是约定时间稍微迟到了一点，但总体体验不错。',
    avatarBg: '#E5E7EB',
    avatarColor: '#555',
    avatarIcon: 'fa-solid fa-location-dot'
  },
  {
    id: 3,
    name: '王强',
    nameId: 5,
    time: '3周前',
    stars: 5,
    content: '回复消息不是很及时，但能看出来是很喜欢小动物的人。希望以后多分享一些宠物的近况。',
    avatarBg: '#F3C697',
    avatarColor: 'white',
    avatarIcon: 'fa-regular fa-circle'
  }
]);

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
</script>

<style scoped>
</style>

