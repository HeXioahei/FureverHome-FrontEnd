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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PostCard from '../../components/common/PostCard.vue';
import { getPostList } from '@/api/postapi'; // ⚠️ 调用后端接口

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

const router = useRouter();
const posts = ref<Post[]>([]);
const defaultAvatar = 'https://i.ibb.co/34Gf4rW/avatar-default.png';

// 加载帖子列表
const loadPosts = async () => {
  try {
    const res = await getPostList();
    posts.value = res.data.map((p: any) => ({
      id: p.id,
      author: p.authorName,
      avatarInitial: p.authorAvatar ? p.authorAvatar[0] : '用',
      timeAgo: p.timeAgo || '刚刚',
      title: p.title,
      content: p.content,
      images: p.images || [],
      likes: p.likes || 0,
      comments: p.comments || 0,
      views: p.views || '0'
    }));
  } catch (error) {
    console.error('加载接口失败，显示示例数据', error);
    // 示例数据
    posts.value = [
      {
        id: 1,
        author: '李同学',
        avatarInitial: '李',
        timeAgo: '3小时前',
        title: '小橘的领养更新：越来越亲人啦！',
        content: '小橘本来是出生一个月就被遗弃在校园里的小流浪猫...',
        images: ['小橘晒太阳', '小橘玩耍', '小橘吃饭'],
        likes: 128,
        comments: 42,
        views: '568'
      },
      {
        id: 2,
        author: '王医生',
        avatarInitial: '王',
        timeAgo: '1天前',
        title: '秋季宠物常见疾病预防指南',
        content: '随着天气转凉，宠物容易患上呼吸道疾病和关节问题...',
        images: ['疾病预防图', '护理指南'],
        likes: 89,
        comments: 23,
        views: '432'
      }
    ];
  }
};

const goToPostCreation = () => {
  router.push({ name: 'PostNew' });
  console.log('跳转到发布帖子页面...');
};

onMounted(() => {
  loadPosts();
});
</script>

<style scoped>
.new-post-btn {
  box-shadow: 0 4px 20px rgba(255, 140, 66, 0.4);
}
</style>
