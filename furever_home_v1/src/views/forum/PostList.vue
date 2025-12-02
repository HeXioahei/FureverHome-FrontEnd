<template>
  <div>
    <main class="forum-main">
      <div class="welcome-header">
        <h1 class="page-title">宠物论坛</h1>
        <p class="page-subtitle">分享养宠经验，交流信息心得</p>
      </div>

      <!-- 搜索栏 -->
      <div class="search-container">
        <div class="search-box">
          <input
            type="text"
            class="search-input"
            placeholder="搜索帖子、话题或用户..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="post-list">
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-card"
          @click="goToPostDetail(post.id)"
        >
          <div class="post-header">
            <div class="post-meta">
              <div class="post-author">
                <div class="author-avatar">{{ post.avatarInitial }}</div>
                <span>{{ post.author }}</span>
              </div>
              <span>{{ post.timeAgo }}</span>
            </div>
            <div class="post-title">{{ post.title }}</div>
          </div>

          <div class="post-content clamped">{{ post.content }}</div>

          <div v-if="post.images && post.images.length" class="post-images">
            <div
              v-for="(image, index) in post.images.slice(0, 3)"
              :key="index"
              class="post-image"
            >
              {{ image }}
            </div>
          </div>

          <div class="post-stats">
            <div class="stat-item">
              <i class="fa-solid fa-heart"></i> {{ post.likes }}
            </div>
            <div class="stat-item">
              <i class="fa-solid fa-comment"></i> {{ post.comments }}
            </div>
            <div class="stat-item">
              <i class="fa-solid fa-eye"></i> {{ post.views }}
            </div>
          </div>
        </div>
      </div>

      <!-- 发布帖子按钮 -->
      <button class="new-post-btn" @click="goToPostCreation">
        <i class="fa-solid fa-pen"></i> 发布帖子
      </button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getPostList, searchPosts } from '@/api/postApi';

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
const searchQuery = ref('');

// 示例数据（用于展示和接口失败时的fallback）
const getExamplePosts = (): Post[] => [
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
    views: '568'
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
    views: '432'
  }
];

// 加载帖子列表
const loadPosts = async () => {
  try {
    const res = await getPostList();
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      posts.value = res.data.map((p: any) => ({
        id: p.id || p.postId,
        author: p.authorName || '未知用户',
        avatarInitial: (p.authorName || '用')[0],
        timeAgo: p.timeAgo || p.createTime || '刚刚',
        title: p.title || '无标题',
        content: p.content || p.summary || '',
        images: p.images || [],
        likes: p.likes || p.likeCount || 0,
        comments: p.comments || p.commentCount || 0,
        views: p.views || p.viewCount || '0'
      }));
    } else {
      // 接口返回空数据，使用示例数据
      posts.value = getExamplePosts();
    }
  } catch (error) {
    console.error('加载接口失败，显示示例数据', error);
    // 接口失败，使用示例数据
    posts.value = getExamplePosts();
  }
};

// 搜索功能
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    // 如果搜索框为空，加载全部帖子
    loadPosts();
    return;
  }
  
  try {
    const res = await searchPosts({
      keyword: searchQuery.value.trim(),
      page: 1,
      pageSize: 20
    });
    
    if (res.data && res.data.list && res.data.list.length > 0) {
      posts.value = res.data.list.map((p: any) => ({
        id: p.id || p.postId,
        author: p.authorName || '未知用户',
        avatarInitial: (p.authorName || '用')[0],
        timeAgo: p.timeAgo || p.createTime || '刚刚',
        title: p.title || '无标题',
        content: p.content || p.summary || '',
        images: p.images || [],
        likes: p.likes || p.likeCount || 0,
        comments: p.comments || p.commentCount || 0,
        views: p.views || p.viewCount || '0'
      }));
    } else {
      // 搜索无结果
      posts.value = [];
    }
  } catch (error) {
    console.error('搜索失败:', error);
    // 搜索失败，加载全部帖子
    loadPosts();
  }
};

// 跳转到帖子详情
const goToPostDetail = (postId: number) => {
  router.push({ name: 'PostDetail', params: { id: postId.toString() } });
};

// 跳转到发布帖子页面
const goToPostCreation = () => {
  router.push({ name: 'PostNew' });
};

onMounted(() => {
  loadPosts();
});
</script>

<style scoped>
:root {
  --primary-color: #FF8C00;
  --text-orange: #FF8C00;
  --bg-color: #F8F9FB;
  --card-bg: #FFFFFF;
  --text-main: #333333;
  --text-sub: #666666;
  --border-color: #e0e0e0;
  --radius: 12px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.forum-main {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

.welcome-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text-main);
}

.page-subtitle {
  color: var(--text-sub);
  font-size: 14px;
  margin-bottom: 30px;
}

/* 搜索栏 */
.search-container {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 20px;
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid var(--border-color);
  border-radius: 30px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #FF8C00 !important;
  outline: none;
}

.search-btn {
  padding: 12px 25px;
  background: #FF8C00 !important;
  color: white !important;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover {
  background: #E67A2A !important;
  transform: translateY(-2px);
}

/* 帖子列表 */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 25px;
  transition: transform 0.3s;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-sub);
  font-size: 14px;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F3C697;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  font-weight: 600;
}

.post-title {
  font-size: 20px;
  font-weight: 700;
  color: #FF8C00 !important;
  line-height: 1.4;
}

.post-content {
  color: var(--text-main);
  margin-bottom: 15px;
  line-height: 1.7;
}

.post-content.clamped {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

/* 帖子图片 */
.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin: 15px 0;
}

.post-image {
  width: 100%;
  height: 150px;
  border-radius: var(--radius);
  object-fit: cover;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.post-stats {
  display: flex;
  gap: 20px;
  color: var(--text-sub);
  font-size: 14px;
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 发布帖子按钮 */
.new-post-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #FF8C00 !important;
  color: white !important;
  border: none;
  border-radius: 30px;
  padding: 15px 25px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(255, 140, 66, 0.4);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
}

.new-post-btn:hover {
  background: #E67A2A !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255, 140, 66, 0.5);
}

/* 响应式 */
@media (max-width: 850px) {
  .new-post-btn {
    padding: 12px 20px;
    font-size: 14px;
    bottom: 20px;
    right: 20px;
  }
}
</style>
