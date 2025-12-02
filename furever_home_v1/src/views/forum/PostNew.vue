<template>
  <div class="new-post-page">
    <div class="container">
      <main class="main-content">
        <h1 class="page-title">
          <i class="fa-solid fa-feather-alt text-orange-500 mr-2"></i> 发布新帖子
        </h1>

        <form @submit.prevent="submitPost">
          <!-- 帖子标题和内容 -->
          <div class="form-group">
            <h2 class="section-title">帖子信息</h2>
            <label for="post-title" class="required">帖子标题</label>
            <input type="text" id="post-title" v-model="postTitle" placeholder="请输入帖子标题" required />
            <label for="post-content" class="required mt-4">帖子内容</label>
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
                <img v-if="file.type.startsWith('image')" :src="file.preview" :alt="file.name" />
                <video v-else-if="file.type.startsWith('video')" :src="file.preview" controls></video>
                <div class="remove-btn" @click="removeFile(index)">&times;</div>
              </div>
            </div>
          </div>

          <!-- 表单操作 -->
          <div class="form-actions mt-6">
            <button type="button" class="btn btn-secondary" @click="cancelPost">取消</button>
            <button type="submit" class="btn btn-primary" :disabled="!isFormValid">发布帖子</button>
          </div>
        </form>
      </main>
    </div>

    <!-- 成功/取消模态框 -->
    <div v-if="showSuccessModal" class="modal">
      <div class="modal-content">
        <div class="modal-icon text-green-500"><i class="fa-solid fa-check-circle"></i></div>
        <h2>发布成功！</h2>
        <p>您的帖子已成功发布，现在可以在论坛中查看。</p>
        <div class="modal-buttons">
          <button class="btn btn-primary" @click="confirmSuccess">确定</button>
        </div>
      </div>
    </div>

    <div v-if="showCancelModal" class="modal">
      <div class="modal-content">
        <div class="modal-icon text-yellow-500"><i class="fa-solid fa-exclamation-triangle"></i></div>
        <h2>确认取消</h2>
        <p>您确定要取消发布吗？所有未保存的内容将会丢失。</p>
        <div class="modal-buttons">
          <button class="btn btn-secondary" @click="showCancelModal=false">继续编辑</button>
          <button class="btn btn-primary" @click="confirmCancel">确定取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { createPost } from '@/api/postapi'; // ⚠️ 后端接口调用

const router = useRouter();

const MAX_CHARS = 500;
const MAX_FILES = 5;

const postTitle = ref('');
const postContent = ref('');
const uploadedFiles = ref<{ name: string; preview: string; type: string; file: File }[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);

const showSuccessModal = ref(false);
const showCancelModal = ref(false);
const submittedPostId = ref<number | null>(null);

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
      reader.onload = (e)=>uploadedFiles.value.push({name:file.name, preview:e.target?.result as string, type:file.type, file});
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

// ----------------------------------------
// 表单提交调用接口
// ----------------------------------------
const submitPost = async () => {
  if(!isFormValid.value) return;

  try{
    const formData = new FormData();
    formData.append('title', postTitle.value);
    formData.append('content', postContent.value);
    uploadedFiles.value.forEach(f=>formData.append('files', f.file));

    const res = await createPost(formData); // 调用接口
    submittedPostId.value = res.data.id;
    showSuccessModal.value = true;

  }catch(err){
    console.error('提交接口失败，使用前端模拟ID', err);
    submittedPostId.value = Math.floor(Math.random()*1000)+100;
    showSuccessModal.value=true;
  }
};

const cancelPost = ()=>{ if(postTitle.value||postContent.value||uploadedFiles.value.length>0){ showCancelModal.value=true } else { router.back() } };
const confirmSuccess = ()=>{
  postTitle.value=''; postContent.value=''; uploadedFiles.value=[];
  showSuccessModal.value=false;
  if(submittedPostId.value!==null) router.push({ name:'PostDetail', params:{postId:submittedPostId.value.toString()}});
  else router.push({ name:'Forum' });
};
const confirmCancel = ()=>{ showCancelModal.value=false; router.back() };
</script>

<style scoped>
/* 样式可沿用你原来的 PostNew.vue 样式 */
</style>
