<template>
  <div class="post-detail-page">
    <div class="container">
      <main v-if="post" class="main-content">
        <header class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <p class="text-lg font-semibold mb-4 text-orange-600">
            当前帖子 ID: {{ postId }}
          </p>
          <div class="post-meta">
            <div class="author-info">
              <img :src="post.avatarUrl" alt="作者头像" class="author-avatar" />
              <span class="author-name">{{ post.author }}</span>
            </div>
            <div class="meta-data">
              <span><i class="fa-solid fa-calendar-alt"></i> {{ post.publishDate }}</span>
              <span><i class="fa-solid fa-eye"></i> {{ post.views }}</span>
            </div>
          </div>
        </header>

        <section class="post-content-section">
          <div class="post-body">
            <p>{{ post.content }}</p>

            <div v-if="post.media.length > 0" class="post-media-grid">
                <div v-for="(media, index) in post.media" :key="index" class="media-item">
                    <img v-if="media.type === 'image'" :src="media.url" alt="帖子图片" class="post-image" />
                    <video v-else-if="media.type === 'video'" :src="media.url" controls class="post-video"></video>
                </div>
            </div>
          </div>
        </section>

        <footer class="post-footer">
          <div class="post-actions">
            <span class="action-item"><i class="fa-solid fa-comment"></i> {{ post.comments }} 评论</span>
            <span class="action-item like-btn" @click="handleLike">
              <i :class="['fa-heart', isLiked ? 'fa-solid text-red-500' : 'fa-regular']"></i> {{ post.likes }} 赞
            </span>
          </div>
        </footer>

        <section class="comment-section">
          <h2>评论 ({{ post.comments }})</h2>

          <div class="comment-input-area">
            <textarea
                v-model="newComment"
                placeholder="请输入你的评论..."
                class="comment-input"
            ></textarea>
            <button
                @click="submitComment"
                :disabled="!newComment.trim()"
                class="comment-submit btn-primary"
            >
                提交评论
            </button>
          </div>

          <div class="comment-list">
            <div class="comment-item" v-for="i in post.comments" :key="i">
                <div class="comment-meta">
                    <img src="https://i.ibb.co/34Gf4rW/avatar-default.png" alt="头像" class="comment-avatar" />
                    <span class="comment-author">用户-{{ i }}</span>
                    <span class="comment-date">2025-11-20</span>
                </div>
                <p class="comment-text">这是一个模拟评论内容 {{ i }}。</p>
                <div class="comment-actions">
                    <span class="comment-action"><i class="fa-solid fa-reply"></i> 回复</span>
                    <span class="comment-action like-comment"><i class="fa-regular fa-thumbs-up"></i> 0 赞</span>
                </div>
            </div>
          </div>
        </section>

      </main>
      <div v-else class="not-found">
          <h1 class="text-red-500">帖子未找到</h1>
          <p>您请求的帖子可能已被删除或链接有误。ID: {{ postId }}</p>
          <button @click="router.push({ name: 'Forum' })" class="btn btn-primary mt-4">返回论坛列表</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
// 修正导入，适配严格模式
import { useForumStore, type Post } from '@/stores/ForumStore';

// ----------------------------------------------------
// 关键：通过 props 接收路由参数 postId
// ----------------------------------------------------
const props = defineProps<{
    postId: string; // 必须匹配路由中定义的参数名 /forum/:postId
}>();

const router = useRouter();
const forumStore = useForumStore();

const newComment = ref('');
const isLiked = ref(false);
const post = ref<Post | undefined>(undefined);

// ----------------------------------------
// 数据获取逻辑
// ----------------------------------------
const fetchPost = (id: number) => {
    // 关键：使用数字 ID 从 Store 中查询
    const fetchedPost = forumStore.getPostById(id);
    if (fetchedPost) {
        fetchedPost.views += 1;
    }
    post.value = fetchedPost;
};

// 监听 postId 变化，执行查询
watch(() => props.postId, (newPostId) => {
    if (newPostId) {
        const idNum = parseInt(newPostId);
        // 关键：确保 ID 是有效数字
        if (!isNaN(idNum)) {
             fetchPost(idNum);
        } else {
             console.error('ERROR: Post ID is not a valid number:', newPostId);
             post.value = undefined;
        }
    }
}, { immediate: true });

// ----------------------------------------
// 互动方法 (保持不变)
// ----------------------------------------
const handleLike = () => {
    if (!post.value) return;

    if (isLiked.value) {
        post.value.likes--;
    } else {
        post.value.likes++;
    }
    isLiked.value = !isLiked.value;
};

const submitComment = () => {
    const content = newComment.value.trim();
    if (content && post.value) {
        alert(`评论已提交: ${content}`);
        post.value.comments++;
        newComment.value = '';
    }
};
</script>

<style scoped>
/* 样式与之前提供的代码相同，用于美化页面 */
:root {
    --primary-color: #FF8C00;
    --bg-color: #F8F9FB;
    --card-bg: #FFFFFF;
    --text-main: #333333;
    --text-sub: #666666;
    --border-color: #E5E7EB;
    --error-color: #D9534F;
}
.post-detail-page { min-height: 100vh; padding: 30px 0 80px; }
.container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
.main-content { background-color: var(--card-bg); border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
.post-header { border-bottom: 1px solid var(--border-color); padding-bottom: 25px; margin-bottom: 30px; }
.post-title { font-size: 36px; font-weight: bold; color: var(--text-main); margin-bottom: 15px; line-height: 1.3; }
.post-meta { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: var(--text-sub); }
.author-info { display: flex; align-items: center; }
.author-avatar { width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; object-fit: cover; border: 2px solid var(--primary-color); }
.author-name { font-weight: 600; color: var(--text-main); }
.meta-data span { margin-left: 20px; }
.meta-data i { margin-right: 5px; color: var(--primary-color); }
.post-content-section { line-height: 1.8; color: var(--text-main); font-size: 16px; }
.post-body p { margin-bottom: 20px; }
.post-media-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 20px; }
.media-item { border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.post-image, .post-video { width: 100%; height: 100%; max-height: 400px; object-fit: cover; display: block; }
.post-footer { border-top: 1px solid var(--border-color); margin-top: 30px; padding-top: 20px; }
.post-actions { display: flex; justify-content: flex-end; gap: 30px; font-size: 16px; color: var(--text-sub); }
.action-item { cursor: pointer; transition: color 0.2s; }
.action-item:hover { color: var(--primary-color); }
.action-item i { margin-right: 5px; }
.like-btn { font-weight: 600; }
.text-red-500 { color: var(--error-color); }
.text-red-500:hover { color: var(--error-color); }
.comment-section { margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border-color); }
.comment-section h2 { font-size: 24px; color: var(--text-main); margin-bottom: 20px; font-weight: bold; }
.comment-input-area { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; }
.comment-input { width: 100%; min-height: 80px; padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; resize: vertical; font-size: 15px; }
.comment-input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.2); }
.comment-submit { align-self: flex-end; padding: 10px 30px; border-radius: 6px; font-weight: 600; transition: all 0.3s; background: var(--primary-color); color: white; border: none; cursor: pointer; }
.comment-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.comment-list { display: flex; flex-direction: column; gap: 25px; }
.comment-item { border-bottom: 1px dashed #f0f0f0; padding-bottom: 15px; }
.comment-meta { display: flex; align-items: center; margin-bottom: 10px; font-size: 14px; }
.comment-avatar { width: 30px; height: 30px; border-radius: 50%; margin-right: 10px; object-fit: cover; }
.comment-author { font-weight: bold; color: var(--text-main); margin-right: 15px; }
.comment-date { color: var(--text-sub); }
.comment-text { padding-left: 40px; color: var(--text-main); line-height: 1.5; margin-bottom: 10px; }
.comment-actions { padding-left: 40px; font-size: 13px; color: var(--text-sub); display: flex; gap: 15px; }
.comment-action { cursor: pointer; }
.comment-action:hover { color: var(--primary-color); }
.like-comment i { margin-right: 4px; }
.not-found { text-align: center; background: white; padding: 60px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
.not-found h1 { color: var(--error-color); margin-bottom: 15px; }

@media (max-width: 768px) {
    .main-content { padding: 25px; }
    .post-title { font-size: 28px; }
    .post-meta { flex-direction: column; align-items: flex-start; }
    .meta-data { margin-top: 10px; margin-left: 0; }
    .meta-data span { margin-left: 0; margin-right: 15px; }
    .post-actions { justify-content: flex-start; }
}
</style>
