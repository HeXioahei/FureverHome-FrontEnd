<template>
  <div class="post-detail-page">
    <div class="container">
      <div class="main-content">
        <!-- 返回按钮 -->
        <div class="back-btn" @click="goBack">
          ← 返回论坛
        </div>

        <!-- 帖子详情 -->
        <div v-if="post" class="post-header">
          <div class="post-title">{{ post.title }}</div>
          <div class="post-meta">
            <div class="author-info">
              <img :src="post.avatarUrl || defaultAvatar" alt="avatar" class="author-avatar" />
              <span class="author-name">{{ post.author }}</span>
            </div>
            <div class="meta-data">
              <span>发布时间: {{ post.publishDate }}</span>
              <span>点赞: {{ post.likes || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- 帖子内容 -->
        <div v-if="post" class="post-text">{{ post.content }}</div>
        <div v-if="post && post.media.length" class="post-media-grid">
          <div v-for="(m, idx) in post.media" :key="idx" class="media-item">
            <img v-if="m.type === 'image'" :src="m.url" />
            <video v-else controls :src="m.url" />
          </div>
        </div>

        <!-- 点赞操作 -->
        <div v-if="post" class="post-footer">
          <div class="post-actions">
            <div class="action-item" @click="toggleLike">
              {{ isLiked ? '取消点赞' : '点赞' }}
            </div>
          </div>
        </div>

        <!-- 评论区 -->
        <div class="comment-section">
          <h2>评论</h2>
          <div class="comment-input-area">
            <textarea v-model="newComment" class="comment-input" placeholder="写下你的评论..."></textarea>
            <button class="comment-submit" @click="submitComment" :disabled="!newComment.trim()">提交</button>
          </div>

          <div class="comment-list">
            <div v-for="c in comments" :key="c.id" class="comment-item">
              <div class="comment-meta">
                <img :src="c.authorAvatar || defaultAvatar" class="comment-avatar" />
                <span class="comment-author">{{ c.authorName }}</span>
                <span class="comment-date">{{ c.date }}</span>
              </div>
              <div class="comment-text">{{ c.content }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 帖子不存在 -->
      <div v-if="!post" class="not-found">
        <h2>帖子不存在或加载失败</h2>
        <button class="btn-back" @click="goBack">返回论坛</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostDetail, type Post } from '@/api/postApi'
import { getPostComments, submitComment as submitCommentApi, likePost as likePostApi, type Comment } from '@/api/commentapi'

const route = useRoute()
const router = useRouter()

const post = ref<Post | undefined>(undefined)
const comments = ref<Comment[]>([])
const newComment = ref('')
const isLiked = ref(false)
const defaultAvatar = 'https://i.ibb.co/34Gf4rW/avatar-default.png'

// 加载帖子详情
const loadPost = async (id: number) => {
  try {
    const res = await getPostDetail(id)
    if (res.data) {
      const p = res.data
      post.value = {
        ...p,
        author: p.authorName,
        avatarUrl: p.authorAvatar,
        publishDate: p.date,
        media: p.images?.map(url => ({ type: 'image', url })) || []
      }
    }
    await loadComments(id)
  } catch (error) {
    console.error(error)
    // 示例数据
    post.value = {
      id,
      title: '示例帖子标题',
      content: '这是示例帖子内容，用于接口加载失败时显示。',
      author: '示例用户',
      avatarUrl: defaultAvatar,
      publishDate: '2025-12-02',
      likes: 0,
      media: []
    }
    await loadComments(id)
  }
}

// 获取评论列表
const loadComments = async (postId: number) => {
  try {
    const res = await getPostComments(postId)
    comments.value = res.data || []
  } catch (error) {
    console.error(error)
    comments.value = [
      { id: 1, content: '示例评论1', authorName: '用户1', date: '2025-11-20', authorAvatar: defaultAvatar },
      { id: 2, content: '示例评论2', authorName: '用户2', date: '2025-11-21', authorAvatar: defaultAvatar }
    ]
  }
}

// 点赞
const toggleLike = async () => {
  if (!post.value) return
  try {
    await likePostApi(post.value.id)
    if (isLiked.value) post.value.likes--
    else post.value.likes++
    isLiked.value = !isLiked.value
  } catch (error) {
    console.error(error)
  }
}

// 提交评论
const submitComment = async () => {
  if (!post.value || !newComment.value.trim()) return
  try {
    const res = await submitCommentApi(post.value.id, { content: newComment.value })
    comments.value.push(res.data)
    newComment.value = ''
  } catch (error) {
    console.error(error)
    comments.value.push({ id: comments.value.length + 1, content: newComment.value, authorName: '我', date: '2025-12-02', authorAvatar: defaultAvatar })
    newComment.value = ''
  }
}

// 返回
const goBack = () => {
  router.push({ name: 'Forum' })
}

// 监听路由参数
watch(
  () => route.params.id,
  (newVal) => {
    if (!newVal) return
    const idNum = Number(newVal)
    if (!isNaN(idNum)) loadPost(idNum)
  },
  { immediate: true }
)

onMounted(() => {
  const postId = route.params.id
  if (postId) loadPost(Number(postId))
})
</script>

<style scoped>
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
.back-btn {
  cursor: pointer;
  font-size: 16px;
  color: #888;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.back-btn:hover { color: #ff8c00; }
.post-header { border-bottom: 1px solid #eee; padding-bottom: 25px; margin-bottom: 25px; }
.post-title { font-size: 30px; font-weight: bold; margin-bottom: 12px; color: #333; }
.post-meta { display: flex; justify-content: space-between; align-items: center; }
.author-info { display: flex; align-items: center; gap: 10px; }
.author-avatar { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid #ff8c00; }
.author-name { font-weight: 600; color: #333; }
.meta-data span { margin-left: 15px; color: #666; font-size: 14px; }
.post-text { line-height: 1.8; margin-bottom: 25px; color: #444; font-size: 16px; }
.post-media-grid { margin-top: 20px; display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.media-item img, .media-item video { width: 100%; border-radius: 10px; height: 260px; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.post-footer { border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; }
.post-actions { display: flex; gap: 25px; justify-content: flex-end; color: #666; font-size: 16px; }
.post-actions .action-item { cursor: pointer; }
.post-actions .action-item:hover { color: #ff8c00; }
.comment-section { margin-top: 40px; }
.comment-section h2 { font-size: 22px; margin-bottom: 20px; font-weight: bold; color: #333; }
.comment-input-area { display: flex; flex-direction: column; gap: 10px; }
.comment-input { border: 1px solid #ddd; border-radius: 8px; padding: 12px; font-size: 15px; min-height: 80px; }
.comment-submit { align-self: flex-end; padding: 10px 22px; border: none; border-radius: 6px; background: #ff8c00; color: white; cursor: pointer; font-weight: 600; }
.comment-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.comment-list { margin-top: 25px; display: flex; flex-direction: column; gap: 25px; }
.comment-item { border-bottom: 1px dashed #eee; padding-bottom: 15px; }
.comment-meta { display: flex; align-items: center; gap: 10px; }
.comment-avatar { width: 32px; height: 32px; border-radius: 50%; }
.comment-author { font-weight: bold; color: #333; }
.comment-date { color: #999; font-size: 14px; }
.comment-text { margin-left: 42px; margin-bottom: 10px; color: #444; }
.not-found { text-align: center; background: white; padding: 60px 20px; border-radius: 16px; }
.btn-back { margin-top: 20px; padding: 10px 25px; border: none; background: #ff8c00; color: white; border-radius: 8px; }
</style>
