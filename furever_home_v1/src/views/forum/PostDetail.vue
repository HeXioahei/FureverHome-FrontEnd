<template>
  <div class="post-detail-page">
    <div class="container">

      <!-- 帖子存在时显示 -->
      <main v-if="post" class="main-content">

        <!-- 返回按钮 -->
        <div class="back-btn" @click="goBack">
          <i class="fa-solid fa-arrow-left"></i> 返回论坛
        </div>

        <!-- 标题区 -->
        <header class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>

          <div class="post-meta">
            <div class="author-info">
              <img :src="post.avatarUrl" alt="作者头像" class="author-avatar" />
              <div class="author-name">{{ post.author }}</div>
            </div>

            <div class="meta-data">
              <span><i class="fa-solid fa-calendar"></i> {{ post.publishDate }}</span>
              <span><i class="fa-solid fa-eye"></i> {{ post.views }}</span>
            </div>
          </div>
        </header>

        <!-- 正文内容 -->
        <section class="post-content-section">
          <p class="post-text">
            {{ post.content }}
          </p>

          <!-- 图片 / 视频区域 -->
          <div v-if="post.media.length" class="post-media-grid">
            <div
              v-for="(media, index) in post.media"
              :key="index"
              class="media-item"
            >
              <img v-if="media.type === 'image'" :src="media.url" class="post-image" />
              <video
                v-else
                :src="media.url"
                class="post-video"
                controls
              ></video>
            </div>
          </div>
        </section>

        <!-- 点赞区 -->
        <footer class="post-footer">
          <div class="post-actions">
            <span class="action-item">
              <i class="fa-solid fa-comment"></i> {{ post.comments }} 评论
            </span>

            <span class="action-item like-btn" @click="toggleLike">
              <i :class="['fa-heart', isLiked ? 'fa-solid text-red-500' : 'fa-regular']"></i>
              {{ post.likes }}
            </span>
          </div>
        </footer>

        <!-- 评论区 -->
        <section class="comment-section">
          <h2>评论 ({{ post.comments }})</h2>

          <!-- 输入评论 -->
          <div class="comment-input-area">
            <textarea
              v-model="newComment"
              placeholder="请输入评论内容..."
              class="comment-input"
            ></textarea>

            <button
              @click="submitComment"
              class="comment-submit"
              :disabled="!newComment.trim().length"
            >
              提交评论
            </button>
          </div>

          <!-- 评论列表（示例，可改传后台） -->
          <div class="comment-list">
            <div class="comment-item" v-for="n in post.comments" :key="n">
              <div class="comment-meta">
                <img class="comment-avatar" src="https://i.ibb.co/34Gf4rW/avatar-default.png" />
                <span class="comment-author">用户 {{ n }}</span>
                <span class="comment-date">2025-11-20</span>
              </div>

              <p class="comment-text">
                这是示例评论内容（可替换为真实评论数据）。
              </p>

              <div class="comment-actions">
                <span class="comment-action"><i class="fa-solid fa-reply"></i> 回复</span>
                <span class="comment-action"><i class="fa-regular fa-thumbs-up"></i> 赞</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- 帖子找不到 -->
      <div v-else class="not-found">
        <h1>帖子不存在</h1>
        <p>ID: {{ postId }}</p>
        <button @click="goBack" class="btn-back">返回论坛</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useForumStore, type Post } from '@/stores/ForumStore';

// 接收路由参数（必须是 postId）
const props = defineProps<{ postId: string }>();

const router = useRouter();
const forumStore = useForumStore();

const post = ref<Post | undefined>(undefined);
const newComment = ref('');
const isLiked = ref(false);

// 获取帖子
const loadPost = (id: number) => {
  const p = forumStore.getPostById(id);

  if (p) {
    p.views += 1; // 浏览量 +1
  }

  post.value = p;
};

// 监听路由参数
watch(
  () => props.postId,
  (newVal) => {
    if (!newVal) return;
    const idNum = Number(newVal);
    if (!isNaN(idNum)) {
      loadPost(idNum);
    }
  },
  { immediate: true }
);

// 点赞
const toggleLike = () => {
  if (!post.value) return;
  if (isLiked.value) post.value.likes--;
  else post.value.likes++;
  isLiked.value = !isLiked.value;
};

// 提交评论
const submitComment = () => {
  if (!post.value) return;

  // 实际项目应 push 到 post.commentsList
  post.value.comments += 1;
  newComment.value = '';
};

// 返回
const goBack = () => {
  router.push({ name: 'Forum' });
};
</script>

<style scoped>
/* ——— 页面整体结构 ——— */
.post-detail-page {
  background: #f8f9fb;
  min-height: 100vh;
  padding: 30px 0 70px;
}
.container {
  max-width: 900px;
  margin: auto;
  padding: 0 15px;
}
.main-content {
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

/* 返回按钮 */
.back-btn {
  cursor: pointer;
  font-size: 16px;
  color: #888;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.back-btn:hover {
  color: #ff8c00;
}

/* ——— 帖子头部 ——— */
.post-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 25px;
  margin-bottom: 25px;
}
.post-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.author-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff8c00;
}
.author-name {
  font-weight: 600;
  color: #333;
}
.meta-data span {
  margin-left: 15px;
  color: #666;
  font-size: 14px;
}

/* ——— 内容区 ——— */
.post-text {
  line-height: 1.8;
  margin-bottom: 25px;
  color: #444;
  font-size: 16px;
}
.post-media-grid {
  margin-top: 20px;
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.media-item img,
.media-item video {
  width: 100%;
  border-radius: 10px;
  height: 260px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* ——— 点赞区域 ——— */
.post-footer {
  border-top: 1px solid #eee;
  padding-top: 20px;
  margin-top: 20px;
}
.post-actions {
  display: flex;
  gap: 25px;
  justify-content: flex-end;
  color: #666;
  font-size: 16px;
}
.post-actions .action-item {
  cursor: pointer;
}
.post-actions .action-item:hover {
  color: #ff8c00;
}

/* ——— 评论区 ——— */
.comment-section {
  margin-top: 40px;
}
.comment-section h2 {
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #333;
}

.comment-input-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.comment-input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 15px;
  min-height: 80px;
}
.comment-submit {
  align-self: flex-end;
  padding: 10px 22px;
  border: none;
  border-radius: 6px;
  background: #ff8c00;
  color: white;
  cursor: pointer;
  font-weight: 600;
}
.comment-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 评论列表 */
.comment-list {
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.comment-item {
  border-bottom: 1px dashed #eee;
  padding-bottom: 15px;
}
.comment-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}
.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.comment-author {
  font-weight: bold;
  color: #333;
}
.comment-date {
  color: #999;
  font-size: 14px;
}
.comment-text {
  margin-left: 42px;
  margin-bottom: 10px;
  color: #444;
}
.comment-actions {
  margin-left: 42px;
  display: flex;
  gap: 18px;
  font-size: 14px;
  color: #666;
}
.comment-action:hover {
  color: #ff8c00;
}

/* 帖子不存在 */
.not-found {
  text-align: center;
  background: white;
  padding: 60px 20px;
  border-radius: 16px;
}
.btn-back {
  margin-top: 20px;
  padding: 10px 25px;
  border: none;
  background: #ff8c00;
  color: white;
  border-radius: 8px;
}
</style>
