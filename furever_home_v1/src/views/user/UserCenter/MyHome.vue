<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2" style="color: #333333;">欢迎回来，{{ userName }}！</h1>
      <p class="text-sm" style="color: #666666;">这是您的活动简报。</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-3 gap-5 mb-10">
      <div class="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-[120px]">
        <span class="text-sm font-medium" style="color: #6B7280;">已发布内容</span>
        <span class="text-4xl font-bold mt-2.5" style="color: #111;">{{ publishedPostCount }}</span>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-30">
        <span class="text-sm font-medium" style="color: #6B7280;">我的待办</span>
        <span class="text-4xl font-bold mt-2.5" style="color: #111;">2</span>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-30">
        <span class="text-sm font-medium" style="color: #6B7280;">信誉积分</span>
        <span class="text-4xl font-bold mt-2.5" style="color: #111;">4.5/5</span>
      </div>
    </div>

    <!-- 近期动态 -->
    <div class="text-xl font-bold mb-5" style="color: #333333;">近期动态</div>
    <div class="flex flex-col gap-4">
      <div 
        v-for="activity in activities" 
        :key="activity.id"
        class="bg-white p-5 rounded-xl shadow-sm flex items-center gap-5 cursor-pointer transition-transform hover:-translate-y-0.5"
      >
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
          :style="{ backgroundColor: activity.iconBg, color: activity.iconColor }"
        >
          <i :class="activity.icon"></i>
        </div>
        <div class="flex-1">
          <div class="text-base font-medium mb-1" style="color: #1F2937;">{{ activity.title }}</div>
          <div class="text-xs" style="color: #9CA3AF;">{{ activity.time }}</div>
        </div>
        <i class="fa-solid fa-chevron-right text-sm" style="color: #D1D5DB;"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getCurrentUser, type CurrentUserInfo } from '../../../api/userApi';
import { getMyPostList } from '../../../api/postApi';

const userName = ref('用户');
const publishedPostCount = ref(0);

interface Activity {
  id: number;
  title: string;
  time: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const activities = ref<Activity[]>([
  {
    id: 1,
    title: '您对"巴迪"的领养申请已通过！',
    time: '2小时前',
    icon: 'fa-solid fa-paw',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB'
  },
  {
    id: 2,
    title: '收到关于您帖子"猫咪米洛"的新消息',
    time: '1天前',
    icon: 'fa-regular fa-comment-dots',
    iconBg: '#D1FAE5',
    iconColor: '#059669'
  },
  {
    id: 3,
    title: '您发布了"金毛犬戈尔迪"的领养信息。',
    time: '3天前',
    icon: 'fa-solid fa-arrow-up-from-bracket',
    iconBg: '#FEF3C7',
    iconColor: '#D97706'
  }
]);

async function loadCurrentUser() {
  try {
    const res = await getCurrentUser();
    if ((res.code === 0 || res.code === 200) && res.data) {
      const data: CurrentUserInfo = res.data;
      userName.value = data.userName || userName.value;
    } else {
      const cachedName = localStorage.getItem('userName');
      if (cachedName) userName.value = cachedName;
    }
  } catch (error) {
    const cachedName = localStorage.getItem('userName');
    if (cachedName) userName.value = cachedName;
    console.error('获取当前用户信息失败（MyHome）', error);
  }
}

// 加载已审核通过的帖子数量
async function loadPublishedPostCount() {
  try {
    const res = await getMyPostList({ page: 1, pageSize: 1000 }); // 获取足够多的数据以统计总数
    if (res.code === 200 && res.data && res.data.records) {
      // 统计审核状态为"通过"的帖子数量
      const approvedPosts = res.data.records.filter((post: any) => {
        const reviewStatus = post.reviewStatus || '';
        return reviewStatus === '通过' || reviewStatus === 'approved';
      });
      publishedPostCount.value = approvedPosts.length;
    } else {
      console.error('获取我的帖子列表失败', res);
    }
  } catch (error) {
    console.error('获取已发布帖子数量失败（MyHome）', error);
  }
}

onMounted(() => {
  loadCurrentUser();
  loadPublishedPostCount();
});
</script>

<style scoped>
</style>

