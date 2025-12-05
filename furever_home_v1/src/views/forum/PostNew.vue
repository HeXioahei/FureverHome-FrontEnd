<template>
  <div class="new-post-page">
    <div class="container">
      <main class="main-content">
        <h1 class="page-title">{{ isEditMode ? '编辑帖子' : '发布新帖子' }}</h1>

        <form @submit.prevent="submitPost">
          <!-- 帖子标题和内容 -->
          <div class="form-group">
            <h2 class="section-title">帖子信息</h2>
            <div class="form-group">
              <label for="post-title" class="required">帖子标题</label>
              <input type="text" id="post-title" v-model="postTitle" placeholder="请输入帖子标题" required />
            </div>
            <div class="form-group">
              <label for="post-content" class="required">帖子内容</label>
              <textarea
                id="post-content"
                v-model="postContent"
                @input="checkContent"
                placeholder="在这里输入你的帖子内容..."
                required
              ></textarea>
              <div class="char-count">
                <span :class="{'text-red-500': charCount > MAX_CHARS}">{{ charCount }}</span> 字
              </div>
            </div>
          </div>

          <!-- 文件上传 -->
          <div class="form-group mt-6">
            <h2 class="section-title">图片/视频上传</h2>
            <div
              class="upload-area"
              @click="fileInput?.click()"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="handleFileDrop"
              :style="{borderColor: isDragOver ? 'var(--primary-color)' : 'var(--border-color)', backgroundColor: isDragOver ? 'rgba(255,140,0,0.05)' : 'transparent'}"
            >
              <div class="upload-icon"><i class="fa-solid fa-cloud-upload-alt"></i></div>
              <div class="upload-text">点击上传或拖拽文件到这里</div>
              <div class="upload-hint">
                支持 JPG, PNG, MP4 格式，最多5个文件
                <span v-if="uploadedFiles.length > 0" class="text-sm text-red-500 ml-2">({{ uploadedFiles.length }}/5)</span>
              </div>
              <input type="file" ref="fileInput" @change="handleFileSelect" multiple accept="image/*,video/*" class="hidden" />
            </div>

            <div class="preview-container mt-4">
              <div v-for="(file, index) in uploadedFiles" :key="index" class="preview-item">
                <img
                  v-if="file.type.startsWith('image')"
                  :src="file.preview"
                  :alt="file.name"
                  @click="openImagePreview(file.remoteUrl || file.preview)"
                />
                <video
                  v-else-if="file.type.startsWith('video')"
                  :src="file.preview"
                  controls
                ></video>
                <div class="remove-btn" @click="removeFile(index)">&times;</div>
              </div>
            </div>
          </div>

          <!-- 表单操作 -->
          <div class="form-actions mt-6">
            <button type="button" class="btn btn-secondary" @click="cancelPost">取消</button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="!isFormValid"
              @click="submitPost"
            >
              {{ isEditMode ? '保存修改' : '发布帖子' }}
            </button>
          </div>
        </form>
      </main>
    </div>

    <!-- 成功/取消模态框 -->
    <div v-if="showSuccessModal" class="modal" @click.self="showSuccessModal = false">
      <div class="modal-content">
        <div class="modal-icon">✅</div>
        <h2>{{ isEditMode ? '修改已提交' : '提交成功' }}</h2>
        <p>
          {{ isEditMode ? '您的帖子修改已提交成功，请等待审核结果。' : '您的帖子已提交成功，请等待审核结果。' }}
        </p>
        <div class="modal-buttons">
          <button class="btn btn-primary" @click="confirmSuccess">确定</button>
        </div>
      </div>
    </div>

    <div v-if="showCancelModal" class="modal" @click.self="showCancelModal = false">
      <div class="modal-content">
        <div class="modal-icon">⚠️</div>
        <h2>确认取消</h2>
        <p>您确定要取消发布吗？所有未保存的内容将会丢失。</p>
        <div class="modal-buttons">
          <button class="btn btn-secondary" @click="showCancelModal=false">继续编辑</button>
          <button class="btn btn-primary" @click="confirmCancel">确定取消</button>
        </div>
      </div>
    </div>

    <div v-if="showErrorModal" class="modal" @click.self="closeErrorModal">
      <div class="modal-content">
        <div class="modal-icon" style="color: var(--error-color);">❌</div>
        <h2>发布失败</h2>
        <p>{{ errorMessage }}</p>
        <div class="modal-buttons">
          <button class="btn btn-primary" @click="closeErrorModal">确定</button>
        </div>
      </div>
    </div>

    <!-- 图片大图预览 -->
    <div v-if="showImagePreview && previewImageUrl" class="modal" @click.self="closeImagePreview">
      <div class="modal-content">
        <div class="modal-icon">🖼️</div>
        <img :src="previewImageUrl" alt="预览图片" style="max-width: 100%; max-height: 60vh; object-fit: contain;" />
        <div class="modal-buttons">
          <button class="btn btn-primary" @click="closeImagePreview">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createPost, getPostDetail, updatePost } from '@/api/postApi'; // 帖子相关接口
import { uploadImage } from '@/api/storageApi'; // 图片上传接口，返回后端真实 URL

const route = useRoute();
const router = useRouter();

const MAX_CHARS = 500;
const MAX_FILES = 5;

interface UploadedMedia {
  name: string;
  preview: string;
  type: string;
  file: File;
  remoteUrl?: string;
}

const postTitle = ref('');
const postContent = ref('');
const uploadedFiles = ref<UploadedMedia[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const isSubmitting = ref(false);

const showSuccessModal = ref(false);
const showCancelModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');
const submittedPostId = ref<number | null>(null);
const showImagePreview = ref(false);
const previewImageUrl = ref<string | null>(null);

// 是否为编辑模式（从个人中心或其他地方带着帖子 ID 进入）
const editingPostId = ref<number | null>(null);
const isEditMode = computed(() => editingPostId.value !== null);

const charCount = computed(() => postContent.value.length);
const isFormValid = computed(() => postTitle.value.trim().length>0 && postContent.value.trim().length>0 && charCount.value<=MAX_CHARS);

const checkContent = () => {
  if(charCount.value>MAX_CHARS) postContent.value = postContent.value.substring(0,MAX_CHARS);
};

const processFiles = (files: FileList) => {
  const remaining = MAX_FILES - uploadedFiles.value.length;
  const count = Math.min(files.length, remaining);
  for(let i=0;i<count;i++){
    const file = files[i];
    if(file && (file.type.startsWith('image/')||file.type.startsWith('video/'))){
      const reader = new FileReader();
      reader.onload = (e)=>uploadedFiles.value.push({
        name:file.name,
        preview:e.target?.result as string,
        type:file.type,
        file
      });
      reader.readAsDataURL(file);
    } else {
      alert('只支持图片和视频文件');
    }
  }
  isDragOver.value=false;
};

const handleFileSelect = (e: Event)=>{ const t = e.target as HTMLInputElement; if(t.files) processFiles(t.files); t.value=''; };
const handleFileDrop = (e: DragEvent)=>{ isDragOver.value=false; if(e.dataTransfer?.files) processFiles(e.dataTransfer.files); };
const removeFile = (i:number)=>uploadedFiles.value.splice(i,1);

const openImagePreview = (url: string) => {
  if (!url) return;
  previewImageUrl.value = url;
  showImagePreview.value = true;
};

const closeImagePreview = () => {
  showImagePreview.value = false;
  previewImageUrl.value = null;
};

const uploadAllImages = async (): Promise<string[]> => {
  const urls: string[] = [];
  for (const item of uploadedFiles.value) {
    if (!item.type.startsWith('image/')) continue;
    try {
      // 如果已经有远程地址，避免重复上传
      if (!item.remoteUrl) {
        const res = await uploadImage(item.file);
        if ((res.code === 0 || res.code === 200) && res.data) {
          item.remoteUrl = res.data;
        } else {
          throw new Error(res.message || '图片上传失败，请稍后重试');
        }
      }
      if (item.remoteUrl) {
        urls.push(item.remoteUrl);
      }
    } catch (error: any) {
      throw new Error(error?.message || '图片上传失败，请稍后重试');
    }
  }
  return urls;
};

// ----------------------------------------
// 表单提交调用接口
// ----------------------------------------
const submitPost = async () => {
  console.log('submitPost 被调用', { 
    isFormValid: isFormValid.value, 
    title: postTitle.value, 
    content: postContent.value.length 
  });
  
  if(!isFormValid.value) {
    console.warn('表单验证失败，无法提交');
    alert('请填写标题和内容（内容不能超过500字）');
    return;
  }

  if (isSubmitting.value) return;

  try{
    isSubmitting.value = true;
    let res;

    if (isEditMode.value && editingPostId.value !== null) {
      console.log('开始调用 updatePost 接口...');
      // 编辑模式：仅更新标题和内容，图片沿用原有的
      res = await updatePost(editingPostId.value, {
        title: postTitle.value,
        content: postContent.value,
      });
    } else {
      console.log('开始调用 createPost 接口...');

      // 先把本地选择的文件（图片或视频）上传到后端存储，获得真实的在线 URL
      const mediaUrls: string[] = [];
      for (const item of uploadedFiles.value) {
        try {
          // 使用uploadImage接口上传，后端接口可能也支持视频上传
          const uploadRes = await uploadImage(item.file);
          if ((uploadRes.code === 0 || uploadRes.code === 200) && uploadRes.data) {
            mediaUrls.push(uploadRes.data);
          } else {
            console.warn('上传媒体文件失败，跳过该文件:', item.name, uploadRes.message);
          }
        } catch (e) {
          console.error('上传媒体文件出错，跳过该文件:', item.name, e);
        }
      }

      // 构建请求体，确保符合接口文档要求
      const requestBody: {
        title: string;
        content: string;
        mediaUrls?: string[];
      } = {
        title: postTitle.value.trim(),
        content: postContent.value.trim()
      };
      
      // 只有当有图片URL时才添加mediaUrls字段
      if (mediaUrls.length > 0) {
        requestBody.mediaUrls = mediaUrls;
      }
      
      console.log('发布帖子请求体:', JSON.stringify(requestBody, null, 2));
      
      res = await createPost(requestBody);
    }
    
    console.log('接口返回:', res);
    
    // 检查响应是否成功
    if (res.code && res.code !== 200) {
      throw new Error(res.message || '发布失败，请稍后重试');
    }
    
    // 后端可能返回 postId 或 id，都尝试一下
    submittedPostId.value = (res.data as any)?.postId || (res.data as any)?.id || res.data?.id;
    console.log('获取到的帖子ID:', submittedPostId.value);
    showSuccessModal.value = true;

  }catch(err: any){
    console.error('提交接口失败:', err);
    errorMessage.value = err?.message || err?.toString() || '发布失败，请检查网络连接或稍后重试';
    showErrorModal.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const cancelPost = ()=>{ if(postTitle.value||postContent.value||uploadedFiles.value.length>0){ showCancelModal.value=true } else { router.back() } };
const confirmSuccess = ()=>{ 
  postTitle.value=''; postContent.value=''; uploadedFiles.value=[];
  showSuccessModal.value=false;
  if (isEditMode.value && editingPostId.value !== null) {
    // 编辑完成后回到帖子详情
    router.push({ name: 'PostDetail', params: { id: editingPostId.value.toString() } });
  } else if(submittedPostId.value!==null) {
    router.push({ name:'PostDetail', params:{id:submittedPostId.value.toString()}});
  } else {
    router.push({ name:'Forum' });
  }
};
const confirmCancel = ()=>{ showCancelModal.value=false; router.back() };
const closeErrorModal = ()=>{ showErrorModal.value=false; errorMessage.value=''; };

// 初始化：如果带有 id 参数，则认为是编辑模式，先拉取帖子详情
onMounted(async () => {
  const idParam = route.query.id || route.params.id;
  const numId = typeof idParam === 'string' ? parseInt(idParam, 10) : Number(idParam);
  if (!isNaN(numId) && numId > 0) {
    editingPostId.value = numId;
    try {
      const res = await getPostDetail(numId);
      if ((res.code === 0 || res.code === 200) && res.data) {
        const data: any = res.data;
        postTitle.value = data.title || '';
        postContent.value = data.content || data.summary || '';
        // 目前不处理已有图片/视频预览，保持简单
      }
    } catch (err) {
      console.error('获取帖子详情失败(编辑模式)', err);
    }
  }
});
</script>

<style scoped>
/* --- CSS 变量 --- */
.new-post-page {
  --primary-color: #FF8C00;
  --text-orange: #FF8C00;
  --bg-color: #F8F9FB;
  --card-bg: #FFFFFF;
  --text-main: #333333;
  --text-sub: #666666;
  --border-color: #e0e0e0;
  --error-color: #D9534F;
}

.new-post-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding: 30px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.main-content {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 80%;
  margin: 0 auto;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
  color: var(--text-main);
  text-align: center;
}

.section-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 25px;
  color: var(--text-main);
  padding-bottom: 12px;
  border-bottom: 2px solid #ffe4cc;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--text-sub);
  font-size: 16px;
}

.required::after {
  content: " *";
  color: var(--error-color);
}

input,
textarea {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  font-family: inherit;
}

input:focus,
textarea:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
}

textarea {
  min-height: 250px;
  resize: vertical;
  line-height: 1.6;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 10px;
  padding: 50px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: var(--primary-color);
  background-color: rgba(255, 140, 0, 0.02);
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: var(--text-sub);
}

.upload-text {
  color: var(--text-sub);
  margin-bottom: 12px;
  font-size: 18px;
}

.upload-hint {
  font-size: 14px;
  color: #999;
}

.preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
}

.preview-item {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.preview-item:hover {
  transform: scale(1.03);
}

.preview-item img,
.preview-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: rgba(0, 0, 0, 0.9);
}

.char-count {
  text-align: right;
  font-size: 14px;
  color: #888;
  margin-top: 8px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
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
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #E67A2A;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 140, 0, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 模态框 */
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
  background: var(--card-bg);
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

.modal h2 {
  color: var(--text-main);
  margin-bottom: 20px;
  font-size: 24px;
}

.modal p {
  margin-bottom: 30px;
  color: var(--text-sub);
  font-size: 16px;
  line-height: 1.6;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.hidden {
  display: none;
}

/* 响应式 */
@media (max-width: 1200px) {
  .main-content {
    width: 85%;
  }
}

@media (max-width: 992px) {
  .main-content {
    width: 90%;
    padding: 30px;
  }

  .container {
    padding: 0 15px;
  }
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
    gap: 15px;
  }

  .btn {
    width: 100%;
  }

  .preview-item {
    width: 120px;
    height: 120px;
  }

  .upload-area {
    padding: 40px 20px;
  }

  .main-content {
    width: 95%;
    padding: 25px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 20px 15px;
    width: 100%;
  }

  .page-title {
    font-size: 26px;
  }

  .section-title {
    font-size: 20px;
  }

  .preview-item {
    width: 100px;
    height: 100px;
  }

  .upload-area {
    padding: 30px 15px;
  }
}
</style>
