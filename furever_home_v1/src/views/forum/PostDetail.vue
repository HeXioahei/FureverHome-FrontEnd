<template>
  <div class="post-detail-page">
    <main class="forum-main">
      <!-- 返回按钮 -->
      <a href="#" class="back-btn" @click.prevent="goBack">
        <i class="fa-solid fa-arrow-left"></i> 返回论坛
      </a>

      <!-- 帖子详情 -->
      <div v-if="post" class="post-detail">
        <div class="post-header">
          <div class="post-meta">
            <div class="post-author">
              <div class="author-avatar">{{ post.avatarInitial || post.author?.[0] || '用' }}</div>
              <span>{{ post.author }}</span>
            </div>
            <span>{{ post.timeAgo || post.publishDate }}</span>
          </div>
          <div class="post-title">{{ post.title }}</div>
        </div>

        <div class="post-content">
          <p v-for="(paragraph, index) in postContentParagraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>

        <div v-if="post.images && post.images.length" class="post-images">
          <div
            v-for="(image, index) in post.images"
            :key="index"
            class="post-image"
          >
            {{ image }}
          </div>
        </div>

        <div class="post-stats">
          <div
            class="stat-item"
            :class="{ liked: isLiked }"
            @click="toggleLike"
          >
            <i class="fa-solid fa-thumbs-up"></i> {{ post.likes || 0 }}
          </div>
          <div class="stat-item">
            <i class="fa-solid fa-comment"></i> {{ post.comments || comments.length || 0 }}
          </div>
          <div class="stat-item">
            <i class="fa-solid fa-eye"></i> {{ post.views || 0 }}
          </div>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="comments-section">
        <h2 class="section-title">评论 ({{ comments.length || post.comments || 0 }})</h2>

        <div class="comment-form">
          <textarea
            v-model="newComment"
            class="comment-input"
            placeholder="写下你的评论..."
          ></textarea>
          <button
            class="comment-submit"
            @click="submitComment"
            :disabled="!newComment.trim()"
          >
            发表评论
          </button>
        </div>

        <div class="comments-list">
          <div v-for="c in comments" :key="c.id" class="comment-item">
            <div class="comment-header">
              <div class="comment-avatar">
                {{ (c.authorName === '我' ? '我' : c.authorName)?.[0] || '用' }}
              </div>
              <div class="comment-author">{{ c.authorName }}</div>
              <div class="comment-time">{{ c.date || c.timeAgo || '刚刚' }}</div>
            </div>
            <div class="comment-content">{{ c.content }}</div>
          </div>
        </div>
      </div>
    </main>

    <!-- 错误提示模态框 -->
    <div v-if="showErrorModal" class="modal" @click.self="showErrorModal = false">
      <div class="modal-content">
        <div class="modal-icon" style="color: #D9534F;">❌</div>
        <h2>操作失败</h2>
        <p>{{ errorMessage }}</p>
        <div class="modal-buttons">
          <button class="btn btn-primary" @click="showErrorModal = false; errorMessage = ''">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPostDetail, type 帖子详情DTO } from '@/api/postApi';
import {
  getPostComments,
  submitComment as submitCommentApi,
  likePost as likePostApi,
  type Comment
} from '@/api/commentapi';
import { getCurrentUser, type CurrentUserInfo } from '@/api/userApi';

const route = useRoute();
const router = useRouter();

interface PostDetailData {
  id: number;
  title: string;
  author: string;
  avatarInitial?: string;
  timeAgo?: string;
  publishDate?: string;
  content: string;
  fullContent?: string; // 完整内容（多段文字）
  images: string[];
  likes: number;
  comments: number;
  views: number | string;
}

const post = ref<PostDetailData | undefined>(undefined);
// 是否为前端示例帖子（如"李同学""王医生"），示例帖子在后端并不存在
const isMockPost = ref(false);
const comments = ref<Comment[]>([]);
const newComment = ref('');
const isLiked = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');
// 审核提示（例如：尚未通过审核，仅自己可见）
const reviewNotice = ref('');
// 当前登录用户信息
const currentUser = ref<CurrentUserInfo | null>(null);

// 示例帖子数据（仅用于演示 id 为 1 和 2 的情况）
const getExamplePost = (id: number): PostDetailData | undefined => {
  if (id === 1) {
    return {
      id: 1,
      title: '小橘的领养更新：越来越亲人啦！',
      author: '李同学',
      avatarInitial: '李',
      timeAgo: '3小时前',
      content: '小橘本来是出生一个月就被遗弃在校园里的小流浪猫，从最开始的警惕怕人到现在的主动蹭腿求摸摸。它已经成为我们宿舍楼的团宠，每天都有同学带着猫粮、猫条来看它。',
      fullContent: [
        '小橘本来是出生一个月就被遗弃在校园里的小流浪猫，从最开始的警惕怕人到现在的主动蹭腿求摸摸。它已经成为我们宿舍楼的团宠，每天都有同学带着猫粮、猫条来看它。',
        '记得刚发现它的时候，它躲在宿舍楼下的灌木丛里，只敢在夜深人静的时候出来找吃的。我们几个同学轮流喂它，一开始它总是保持距离，等我们走远了才敢靠近食物。',
        '经过一个多月的耐心接触，小橘终于开始信任我们了。现在它不仅会主动蹭我们的腿，还会发出响亮的呼噜声，甚至会在我们腿上打盹。它的性格真的超级好，不抓人不咬人，特别适合作为家庭宠物。',
        '最近我们正在为小橘寻找一个永久的家。希望找到一个有爱心、负责任的主人，能够给它一个温暖的家。小橘已经做了驱虫，下周会带它去做绝育手术。',
        '如果有意向领养小橘的同学，欢迎联系我！'
      ],
      images: ['小橘晒太阳', '小橘玩耍', '小橘吃饭'],
      likes: 128,
      comments: 42,
      views: 568
    };
  }
  if (id === 2) {
    return {
      id: 2,
      title: '秋季宠物常见疾病预防指南',
      author: '王医生',
      avatarInitial: '王',
      timeAgo: '1天前',
      content: '随着天气转凉，宠物容易患上呼吸道疾病和关节问题。本文为大家提供秋季宠物护理指南，包括饮食调整、保暖措施、疫苗接种提醒等实用建议。',
      fullContent: [
        '随着天气转凉，宠物容易患上呼吸道疾病和关节问题。本文为大家提供秋季宠物护理指南，包括饮食调整、保暖措施、疫苗接种提醒等实用建议。',
        '秋季是宠物疾病高发期，特别是呼吸道感染和关节疼痛。建议主人们提前做好预防工作，包括定期体检、及时接种疫苗、注意保暖等。',
        '饮食方面，可以适当增加营养，但要注意控制食量，避免宠物在秋季过度增重。同时，要保证充足的饮水，防止干燥引起的健康问题。'
      ],
      images: ['疾病预防图', '护理指南'],
      likes: 89,
      comments: 23,
      views: 432
    };
  }
  // 其它 id 不再返回示例帖子
  return undefined;
};

// 示例评论数据
const getExampleComments = (postId: number): Comment[] => {
  if (postId === 1) {
    return [
      {
        id: 1,
        content: '小橘太可爱了！我经常在宿舍楼下看到它，性格真的很好，希望它能找到一个好人家！',
        authorName: '王同学',
        date: '2小时前'
      },
      {
        id: 2,
        content: '感谢你们为小橘做的一切！绝育手术对流浪猫的健康和寿命非常重要。如果需要帮助，可以联系学校的动物保护社团。',
        authorName: '张医生',
        date: '1小时前'
      },
      {
        id: 3,
        content: '我室友对领养小橘很感兴趣！可以私聊一下领养条件和流程吗？',
        authorName: '陈同学',
        date: '45分钟前'
      },
      {
        id: 4,
        content: '看到小橘的变化真的很感动！你们做得太好了，希望更多流浪动物能像小橘一样幸运。',
        authorName: '刘学姐',
        date: '30分钟前'
      }
    ];
  } else {
    return [
      {
        id: 1,
        content: '非常实用的指南！我家的猫咪最近确实有些咳嗽，看来需要带它去检查一下了。',
        authorName: '李同学',
        date: '5小时前'
      },
      {
        id: 2,
        content: '感谢王医生的专业建议，这些预防措施对我们这些新手宠物主人来说很有帮助。',
        authorName: '张同学',
        date: '3小时前'
      }
    ];
  }
};

// 将帖子内容转换为段落数组
const postContentParagraphs = computed(() => {
  if (!post.value) return [];
  if (post.value.fullContent && Array.isArray(post.value.fullContent)) {
    return post.value.fullContent;
  }
  // 如果没有完整内容，将content按句号分割
  return post.value.content.split('。').filter(p => p.trim()).map(p => p.trim() + '。');
});

// 如果是从「我的帖子」过来，并且后端不返回详情时，尝试用路由 query 构建一个可预览的数据
const buildPostFromRouteIfAvailable = (id: number): boolean => {
  if (route.query.from !== 'myPosts') return false;

  const title = (route.query.title as string) || '未命名帖子';
  const content = (route.query.content as string) || '';
  const time = (route.query.time as string) || '刚刚';
  let images: string[] = [];
  if (typeof route.query.images === 'string') {
    try {
      const parsed = JSON.parse(route.query.images);
      if (Array.isArray(parsed)) {
        images = parsed;
      }
    } catch (e) {
      console.error('解析路由中的图片列表失败', e);
    }
  }

  post.value = {
    id,
    title,
    author: '我',
    avatarInitial: '我',
    timeAgo: time,
    publishDate: time,
    content,
    fullContent: content
      ? content
          .split('。')
          .filter(p => p.trim())
          .map(p => p.trim() + '。')
      : [],
    images,
    likes: 0,
    comments: 0,
    views: 0
  };
  isMockPost.value = false;
  reviewNotice.value = '当前帖子尚未通过审核，仅自己可见预览。';
  return true;
};

// 获取当前用户信息
const loadCurrentUser = async () => {
  try {
    // 先从缓存获取
    const cached = localStorage.getItem('currentUser');
    if (cached) {
      try {
        currentUser.value = JSON.parse(cached) as CurrentUserInfo;
      } catch (e) {
        console.error('解析缓存用户信息失败', e);
      }
    }
    // 再从接口获取最新信息
    const res = await getCurrentUser();
    if ((res.code === 0 || res.code === 200) && res.data) {
      currentUser.value = res.data;
      localStorage.setItem('currentUser', JSON.stringify(res.data));
    }
  } catch (error) {
    console.error('获取当前用户信息失败', error);
  }
};

// 加载帖子详情
const loadPost = async (id: number) => {
  try {
    const res = await getPostDetail(id);
    if (res.data) {
      const p = res.data as 帖子详情DTO;
      const createdAt = p.createTime ? String(p.createTime) : '';
      
      // 判断是否是当前用户发布的帖子
      let authorName = '用户 ' + (p.userId ?? '');
      let avatarInitial = '用';
      
      // 如果接口返回了 userName，使用它
      if ((p as any).userName) {
        authorName = (p as any).userName;
        avatarInitial = authorName[0] || '用';
      }
      
      // 判断是否是当前用户
      if (currentUser.value && p.userId === currentUser.value.userId) {
        authorName = '我';
        avatarInitial = '我';
      }
      
      post.value = {
        id: p.postId ?? id,
        title: p.title || '无标题',
        author: authorName,
        avatarInitial: avatarInitial,
        timeAgo: createdAt || '刚刚',
        publishDate: createdAt,
        content: p.content || '',
        fullContent: p.content
          ? p.content
              .split('。')
              .filter((para: string) => para.trim())
              .map((para: string) => para.trim() + '。')
          : [],
        images: p.mediaUrls || [],
        likes: p.likeCount ?? 0,
        comments: p.commentCount ?? 0,
        views: p.viewCount ?? 0
      };
      isMockPost.value = false;
      
      // 检查点赞状态（优先使用接口返回的，其次使用本地存储的）
      if (typeof (p as any).isLiked === 'boolean') {
        isLiked.value = (p as any).isLiked;
      } else if (typeof (p as any).liked === 'boolean') {
        isLiked.value = (p as any).liked;
      } else {
        // 如果接口没有返回点赞状态，从本地存储读取
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]') as number[];
        isLiked.value = likedPosts.includes(p.postId ?? id);
      }
    } else {
      // 接口返回空数据，如果是示例 id（1 或 2），使用示例数据
      const example = getExamplePost(id);
      if (example) {
        post.value = example;
        isMockPost.value = true;
        reviewNotice.value = '';
      } else if (!buildPostFromRouteIfAvailable(id)) {
        // 既不是示例帖子，也没有从「我的帖子」带过来的数据，才提示不可查看
        post.value = undefined;
        isMockPost.value = false;
        reviewNotice.value = '';
        errorMessage.value = '帖子不存在或尚未通过审核，暂时无法查看详情。';
        showErrorModal.value = true;
      }
    }
    // 这里原本会调用 incrementPostViews(id) 增加浏览数。
    // 由于后端暂未提供 /post/{id}/view 接口，暂时不再调用，避免 404。
    await loadComments(id);
  } catch (error) {
    console.error('加载帖子失败:', error);
    // 接口失败，如果是示例 id（1 或 2），使用示例数据
    const example = getExamplePost(id);
    if (example) {
      post.value = example;
      isMockPost.value = true;
      reviewNotice.value = '';
      await loadComments(id);
    } else if (!buildPostFromRouteIfAvailable(id)) {
      post.value = undefined;
      isMockPost.value = false;
      reviewNotice.value = '';
      errorMessage.value = '帖子详情加载失败，可能不存在或尚未通过审核。';
      showErrorModal.value = true;
    }
  }
};

// 获取评论列表
const loadComments = async (postId: number) => {
  try {
    const res = await getPostComments(postId);

    // 后端返回格式可能是：
    // 1) data: Comment[]
    // 2) data: { data: Comment[] }
    // 3) data: { list: Comment[] } / { records: Comment[] }
    let rawList: any[] = [];
    const d: any = res.data;
    if (Array.isArray(d)) {
      rawList = d;
    } else if (d && Array.isArray(d.data)) {
      rawList = d.data;
    } else if (d && Array.isArray(d.list)) {
      rawList = d.list;
    } else if (d && Array.isArray(d.records)) {
      rawList = d.records;
    }

    // 统一映射为 Comment 结构
    comments.value = rawList.map((item: any, index: number) => {
      let authorName = item.authorName ?? item.userName ?? '用户';
      // 判断评论者是否是当前用户
      if (currentUser.value && (item.userId === currentUser.value.userId || item.authorId === currentUser.value.userId)) {
        authorName = '我';
      }
      return {
        id: item.id ?? item.commentId ?? index + 1,
        content: item.content ?? item.commentContent ?? item.text ?? '',
        authorName: authorName,
        authorAvatar: item.authorAvatar ?? '',
        date: item.date ?? item.createTime ?? item.timeAgo ?? '刚刚'
      };
    });

    // 如果接口返回空数据，仅对内置示例帖子使用示例评论
    if (comments.value.length === 0 && isMockPost.value) {
      comments.value = getExampleComments(postId);
    }
  } catch (error) {
    console.error('加载评论失败:', error);
    // 接口失败，仅在示例帖子时使用示例评论
    comments.value = isMockPost.value ? getExampleComments(postId) : [];
  }
};

// 更新本地存储的点赞状态
const updateLikedPostsStorage = (postId: number, liked: boolean) => {
  try {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]') as number[];
    if (liked) {
      if (!likedPosts.includes(postId)) {
        likedPosts.push(postId);
      }
    } else {
      const index = likedPosts.indexOf(postId);
      if (index > -1) {
        likedPosts.splice(index, 1);
      }
    }
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  } catch (error) {
    console.error('更新点赞状态到本地存储失败', error);
  }
};

// 点赞
const toggleLike = async () => {
  if (!post.value) return;

  // 示例帖子并不存在于后端，直接提示用户，不调用接口
  if (isMockPost.value) {
    errorMessage.value = '当前帖子是示例内容，用于展示效果，暂不支持实际点赞操作。';
    showErrorModal.value = true;
    return;
  }
  
  const previousLiked = isLiked.value;
  const previousLikes = post.value.likes || 0;
  const postId = post.value.id;

  // 乐观更新UI
  isLiked.value = !isLiked.value;
  if (isLiked.value) {
    // 如果之前未点赞，现在点赞，数量+1
    post.value.likes = (post.value.likes || 0) + 1;
  } else {
    // 如果之前已点赞，现在取消点赞，数量-1
    post.value.likes = Math.max(0, (post.value.likes || 0) - 1);
  }
  
  // 更新本地存储
  updateLikedPostsStorage(postId, isLiked.value);

  try {
    await likePostApi(postId);
  } catch (error: any) {
    // 回滚UI状态
    isLiked.value = previousLiked;
    post.value.likes = previousLikes;
    // 回滚本地存储
    updateLikedPostsStorage(postId, previousLiked);
    errorMessage.value = error?.message || '点赞失败，请稍后重试';
    showErrorModal.value = true;
    console.error('点赞失败:', error);
  }
};

// 提交评论
const submitComment = async () => {
  if (!post.value || !newComment.value.trim()) return;
  const commentContent = newComment.value.trim();

  // 先在前端本地添加一条“我的评论”，保证立刻能看到
  const localComment: Comment = {
    id: comments.value.length + 1,
    content: commentContent,
    authorName: '我',
    date: '刚刚'
  };
  comments.value.push(localComment);
  if (post.value.comments !== undefined) {
    post.value.comments = (post.value.comments || 0) + 1;
  }
  newComment.value = ''; // 清空输入框

  try {
    const res = await submitCommentApi(post.value.id, { content: commentContent });
    // 如果后端返回了带真实 id 的评论，用后端数据替换刚才那条本地评论
    if (res && res.data) {
      const serverComment = res.data as Comment;
      // 确保评论者显示为"我"（如果是当前用户）
      if (currentUser.value && (serverComment as any).userId === currentUser.value.userId) {
        serverComment.authorName = '我';
      }
      const idx = comments.value.indexOf(localComment);
      if (idx > -1) {
        comments.value[idx] = serverComment;
      } else {
        comments.value.push(serverComment);
      }
    }
  } catch (error: any) {
    // 接口失败只提示一下，不删除刚才添加的本地评论
    errorMessage.value = error?.message || '评论提交失败（仅本地可见），请稍后重试';
    showErrorModal.value = true;
    console.error('评论失败:', error);
  }
};

// 返回
const goBack = () => {
  router.push({ name: 'Forum' });
};

// 监听路由参数
watch(
  () => route.params.id,
  async (newVal) => {
    if (!newVal) return;
    const idNum = Number(newVal);
    if (!isNaN(idNum)) {
      // 确保用户信息已加载
      if (!currentUser.value) {
        await loadCurrentUser();
      }
      loadPost(idNum);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  // 先加载当前用户信息
  await loadCurrentUser();
  const postId = route.params.id;
  if (postId) loadPost(Number(postId));
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
  --border-color: #E5E7EB;
}

.post-detail-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding-bottom: 40px;
}

.forum-main {
  max-width: 900px;
  margin: 30px auto;
  padding: 0 20px;
}

/* 返回按钮 */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 10px 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-sub);
  font-size: 14px;
  transition: all 0.3s;
  text-decoration: none;
  cursor: pointer;
}

.back-btn:hover {
  border-color: #FF8C00 !important;
  color: #FF8C00 !important;
}

/* 帖子详情 */
.post-detail {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 30px;
}

.post-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: var(--text-sub);
  font-size: 14px;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #FF8C00 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white !important;
  font-weight: 600;
}

.post-title {
  font-size: 24px;
  font-weight: 700;
  color: #FF8C00 !important;
  line-height: 1.4;
}

.post-content {
  color: var(--text-main);
  line-height: 1.8;
  margin-bottom: 25px;
}

.post-content p {
  margin-bottom: 15px;
}

/* 帖子图片 */
.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 25px 0;
}

.post-image {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-sub);
  font-size: 14px;
}

.post-stats {
  display: flex;
  gap: 25px;
  color: var(--text-sub);
  font-size: 14px;
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: color 0.3s;
}

.stat-item:hover {
  color: #FF8C00 !important;
}

/* 点过赞后的高亮状态，使用主色橙色并强制覆盖 */
.stat-item.liked {
  color: #FF8C00 !important;
}

/* 评论区域 */
.comments-section {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--text-main);
}

.comment-form {
  margin-bottom: 30px;
}

.comment-input {
  width: 100%;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 15px;
  transition: border-color 0.3s;
  font-family: inherit;
}

.comment-input:focus {
  border-color: #FF8C00 !important;
  outline: none;
}

.comment-submit {
  padding: 12px 25px;
  background: #FF8C00 !important;
  color: white !important;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.comment-submit:hover:not(:disabled) {
  background: #E67A2A !important;
}

.comment-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  padding: 20px;
  border-radius: 12px;
  background: #fafafa;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4A90E2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  font-weight: 600;
}

.comment-author {
  font-weight: 600;
  color: var(--text-main);
}

.comment-time {
  color: var(--text-sub);
  font-size: 13px;
}

.comment-content {
  color: var(--text-main);
  line-height: 1.6;
}

/* 错误模态框 */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-icon {
  font-size: 70px;
  margin-bottom: 25px;
}

.modal-content h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

.modal-content p {
  margin-bottom: 30px;
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn {
  padding: 14px 40px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  min-width: 140px;
}

.btn-primary {
  background: #ff8c00 !important;
  color: white;
}

.btn-primary:hover {
  background: #E67A2A !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 140, 0, 0.3);
}

/* 响应式 */
@media (max-width: 850px) {
  .post-images {
    grid-template-columns: 1fr;
  }
}
</style>
