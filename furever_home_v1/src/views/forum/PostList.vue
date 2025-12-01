<template>
  <div>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">

      <div class="welcome-header">
        <h1 class="page-title text-3xl font-bold mb-2 text-gray-800">宠物论坛</h1>
        <p class="page-subtitle text-base text-gray-500 mb-8">分享养宠经验，交流信息心得</p>
      </div>

      <div class="search-container bg-white rounded-xl shadow-md p-5 mb-8">
        <div class="search-box flex gap-3">
          <input
            type="text"
            placeholder="搜索帖子、话题或用户..."
            class="flex-1 px-5 py-3 border border-gray-300 rounded-full text-base focus:border-orange-500 focus:outline-none transition duration-150"
          />
          <button
            class="search-btn bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition duration-300"
          >
            搜索
          </button>
        </div>
      </div>

      <div class="post-list flex flex-col gap-6">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <button
        class="new-post-btn fixed bottom-8 right-8 bg-orange-500 text-white rounded-full p-4 text-lg font-semibold shadow-xl hover:bg-orange-600 transition duration-300 flex items-center gap-2 z-50"
        @click="goToPostCreation"
      >
        <i class="fa-solid fa-pen"></i> 发布帖子
      </button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// ⚠️ 新增：导入 Vue Router 的 useRouter
import { useRouter } from 'vue-router';
import PostCard from '../../components/common/PostCard.vue';

// ----------------------------------------
// ⚠️ 新增：获取路由实例
const router = useRouter();
// ----------------------------------------

interface Post {
  id: number;
  author: string;
  avatarInitial: string;
  timeAgo: string;
  title: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  views: string;
}

const posts = ref<Post[]>([
  {
    id: 1,
    author: '李同学',
    avatarInitial: '李',
    timeAgo: '3小时前',
    title: '小橘的领养更新：越来越亲人啦！',
    content: '小橘本来是出生一个月就被遗弃在校园里的小流浪猫，从最开始的警惕怕人到现在的主动蹭腿求摸摸。它已经成为我们宿舍楼的团宠，每天都有同学带着猫粮、猫条来看它。',
    images: ['小橘晒太阳', '小橘玩耍', '小橘吃饭'],
    likes: 128,
    comments: 42,
    views: '568',
  },
  {
    id: 2,
    author: '王医生',
    avatarInitial: '王',
    timeAgo: '1天前',
    title: '秋季宠物常见疾病预防指南',
    content: '随着天气转凉，宠物容易患上呼吸道疾病和关节问题。本文为大家提供秋季宠物护理指南，包括饮食调整、保暖措施、疫苗接种提醒等实用建议。',
    images: ['疾病预防图', '护理指南'],
    likes: 89,
    comments: 23,
    views: '432',
  },
  {
    id: 3,
    author: '张同学',
    avatarInitial: '张',
    timeAgo: '5天前',
    title: '求助！我家金毛最近食欲不振，怎么办？',
    content: '我家金毛叫Lucky，快两岁了。这几天它精神状态还行，但是对平时很喜欢的狗粮不怎么感兴趣，零食也吃得少了。有没有宠物医生或有经验的朋友能给点建议？',
    images: ['金毛Lucky'],
    likes: 45,
    comments: 18,
    views: '290',
  },
  {
    id: 4,
    author: '陈同学',
    avatarInitial: '陈',
    timeAgo: '1周前',
    title: '分享自制猫零食：三文鱼冻干小教程',
    content: '自从学会给猫咪自制零食后，再也不担心市面上的添加剂了！这次尝试了三文鱼冻干，做法超级简单，成本也比外面买的低很多。附上详细的制作步骤和注意事项。',
    images: ['三文鱼冻干成品', '制作步骤'],
    likes: 155,
    comments: 67,
    views: '889',
  },
]);

// ⚠️ 修复：实现跳转逻辑
const goToPostCreation = () => {
  // 使用 router.push 通过路由名称进行跳转
  // 假设发布帖子的路由名称是 'PostNew' (请确保路由文件中存在此名称)
  router.push({ name: 'PostNew' });
  console.log('跳转到发布帖子页面...');
};
</script>

<style scoped>
.new-post-btn {
    box-shadow: 0 4px 20px rgba(255, 140, 66, 0.4);
}
</style>
