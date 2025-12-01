<template>
  <div class="new-post-page">
    <div class="container">
      <main class="main-content">
        <h1 class="page-title">
          <i class="fa-solid fa-feather-alt text-orange-500 mr-2"></i> 发布新帖子
        </h1>

        <form @submit.prevent="submitPost">
          <div class="form-group">
            <h2 class="section-title">帖子信息</h2>

            <div class="form-group">
              <label for="post-title" class="required">帖子标题</label>
              <input
                type="text"
                id="post-title"
                v-model="postTitle"
                placeholder="请输入帖子标题"
                required
              />
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
                <span :class="{'text-red-500': charCount > 500}">{{ charCount }}</span> 字
              </div>
            </div>
          </div>

          <div class="form-group">
            <h2 class="section-title">图片/视频上传</h2>
            <div
              class="upload-area"
              id="uploadArea"
              @click="fileInput?.click()"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="handleFileDrop"
              :style="{borderColor: isDragOver ? 'var(--primary-color)' : 'var(--border-color)', backgroundColor: isDragOver ? 'rgba(255, 140, 0, 0.05)' : 'transparent'}"
            >
              <div class="upload-icon">
                <i class="fa-solid fa-cloud-upload-alt"></i>
              </div>
              <div class="upload-text">
                点击上传或拖拽文件到这里
              </div>
              <div class="upload-hint">
                支持 JPG, PNG, MP4 格式，最多5个文件
                <span v-if="uploadedFiles.length > 0" class="text-sm text-red-500 ml-2">({{ uploadedFiles.length }}/5)</span>
              </div>
              <input
                type="file"
                ref="fileInput"
                @change="handleFileSelect"
                multiple
                accept="image/*,video/*"
                class="hidden"
              />
            </div>

            <div class="preview-container" id="previewContainer">
              <div v-for="(file, index) in uploadedFiles" :key="index" class="preview-item">
                <img v-if="file.type.startsWith('image')" :src="file.preview" :alt="file.name" />
                <video v-else-if="file.type.startsWith('video')" :src="file.preview" controls></video>

                <div
                  class="remove-btn"
                  @click="removeFile(index)"
                >
                  &times;
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn btn-secondary"
              id="cancelBtn"
              @click="cancelPost"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!isFormValid"
            >
              发布帖子
            </button>
          </div>
        </form>
      </main>
    </div>

    <div v-if="showSuccessModal" class="modal">
        <div class="modal-content">
            <div class="modal-icon text-green-500">
                <i class="fa-solid fa-check-circle"></i>
            </div>
            <h2>发布成功！</h2>
            <p>您的帖子已成功发布，现在可以在论坛中查看。</p>
            <div class="modal-buttons">
                <button class="btn btn-primary" @click="confirmSuccess">确定</button>
            </div>
        </div>
    </div>

    <div v-if="showCancelModal" class="modal">
        <div class="modal-content">
            <div class="modal-icon text-yellow-500">
                <i class="fa-solid fa-exclamation-triangle"></i>
            </div>
            <h2>确认取消</h2>
            <p>您确定要取消发布吗？所有未保存的内容将会丢失。</p>
            <div class="modal-buttons">
                <button class="btn btn-secondary" @click="showCancelModal = false">继续编辑</button>
                <button class="btn btn-primary" @click="confirmCancel">确定取消</button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useForumStore } from '@/stores/ForumStore';

const router = useRouter();
const forumStore = useForumStore(); // 实例化 Store

const MAX_FILES = 5;
const MAX_CHARS = 500;

const postTitle = ref('');
const postContent = ref('');
const uploadedFiles = ref<{ name: string; preview: string; type: string; file: File }[]>([]);
const isDragOver = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const showSuccessModal = ref(false);
const showCancelModal = ref(false);
const submittedPostId = ref<number | null>(null); // 用于存储新帖子的ID

// ----------------------------------------
// 计算属性
// ----------------------------------------
const charCount = computed(() => postContent.value.length);
const isFormValid = computed(() =>
  postTitle.value.trim().length > 0 &&
  postContent.value.trim().length > 0 &&
  charCount.value <= MAX_CHARS
);

// ----------------------------------------
// 文件处理方法 (省略，与之前代码一致)
// ----------------------------------------
const checkContent = () => {
    if (charCount.value > MAX_CHARS) {
        postContent.value = postContent.value.substring(0, MAX_CHARS);
    }
};

const processFiles = (files: FileList) => {
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_FILES - uploadedFiles.value.length;
    let filesToProcess = files.length > remainingSlots ? remainingSlots : files.length;

    for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];

        if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {

            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedFiles.value.push({
                    name: file.name,
                    preview: e.target?.result as string,
                    type: file.type,
                    file: file,
                });
            };
            reader.readAsDataURL(file);
        } else if (file && !file.type.startsWith('image/') && !file.type.startsWith('video/')) {
             alert('只支持图片和视频文件');
             filesToProcess--;
        }
    }
    isDragOver.value = false;
};

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        processFiles(target.files);
        target.value = '';
    }
};

const handleFileDrop = (event: DragEvent) => {
    isDragOver.value = false;
    if (event.dataTransfer?.files) {
        processFiles(event.dataTransfer.files);
    }
};

const removeFile = (index: number) => {
    uploadedFiles.value.splice(index, 1);
};


// ----------------------------------------
// 表单/模态框方法 (关键更新)
// ----------------------------------------
const submitPost = () => {
    if (!isFormValid.value) return;

    // 1. 调用 Store 的 addPost 方法，添加新帖子
    const newPostId = forumStore.addPost(
        { title: postTitle.value, content: postContent.value },
        uploadedFiles.value
    );

    // 2. 存储新帖子的 ID
    submittedPostId.value = newPostId;

    console.log(`New Post ID created: ${newPostId}`); // 诊断信息

    // 3. 显示成功模态框
    showSuccessModal.value = true;
};

const cancelPost = () => {
    if (postTitle.value.trim() || postContent.value.trim() || uploadedFiles.value.length > 0) {
        showCancelModal.value = true;
    } else {
        router.back();
    }
};

const confirmSuccess = () => {
    // 清空表单数据
    postTitle.value = '';
    postContent.value = '';
    uploadedFiles.value = [];
    showSuccessModal.value = false;

    // 导航：跳转到新创建的帖子详情页
    if (submittedPostId.value !== null) {
        console.log(`Navigating to PostDetail with ID: ${submittedPostId.value}`); // 诊断信息
        router.push({
            name: 'PostDetail',
            // 关键：将数字 ID 转换为字符串传递给路由参数
            params: { postId: submittedPostId.value.toString() }
        });
        submittedPostId.value = null;
    } else {
        router.push({ name: 'Forum' });
    }
};

const confirmCancel = () => {
    showCancelModal.value = false;
    router.back();
};
</script>

<style scoped>
/* 样式与之前提供的代码相同，用于美化页面 */
:root {
    --primary-color: #FF8C00;
    --text-main: #333333;
    --text-sub: #666666;
    --card-bg: #FFFFFF;
    --border-color: #e0e0e0;
    --error-color: #D9534F;
}
.new-post-page { background-color: #F8F9FB; min-height: 100vh; padding-top: 30px; padding-bottom: 80px; }
.container { max-width: 1400px; margin: 0 auto; padding: 0 20px; width: 100%; }
main.main-content { background: var(--card-bg); border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); width: 80%; margin: 0 auto; }
.page-title { font-size: 32px; font-weight: bold; margin-bottom: 30px; color: var(--text-main); text-align: center; }
.page-title i { color: var(--primary-color); }
.section-title { font-size: 22px; font-weight: bold; margin-bottom: 25px; color: var(--text-main); padding-bottom: 12px; border-bottom: 2px solid #ffe4cc; }
label { display: block; margin-bottom: 10px; font-weight: 600; color: var(--text-sub); font-size: 16px; }
.required::after { content: " *"; color: var(--error-color); }
input, textarea { width: 100%; padding: 14px 18px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 16px; transition: border-color 0.3s, box-shadow 0.3s; }
input:focus, textarea:focus { border-color: var(--primary-color); outline: none; box-shadow: 0 0 0 4px rgba(255, 140, 0, 0.4); }
textarea { min-height: 250px; resize: vertical; line-height: 1.6; }
.char-count { text-align: right; font-size: 14px; color: #888; margin-top: 8px; }
.text-red-500 { color: var(--error-color); }
.upload-area { border: 2px dashed var(--border-color); border-radius: 10px; padding: 50px 30px; text-align: center; cursor: pointer; transition: all 0.3s; }
.upload-area:hover { border-color: var(--primary-color) !important; background-color: rgba(255, 140, 0, 0.02) !important; }
.upload-icon { font-size: 48px; margin-bottom: 15px; color: var(--text-sub); }
.upload-icon i { color: var(--text-sub); }
.upload-text { color: var(--text-sub); margin-bottom: 12px; font-size: 18px; }
.upload-hint { font-size: 14px; color: #999; }
.preview-container { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 20px; }
.preview-item { position: relative; width: 150px; height: 150px; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s; }
.preview-item img, .preview-item video { width: 100%; height: 100%; object-fit: cover; }
.remove-btn { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; background: rgba(0,0,0,0.7); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; transition: background 0.2s; }
.remove-btn:hover { background: rgba(0,0,0,0.9); }
.form-actions { display: flex; justify-content: center; gap: 20px; margin-top: 40px; }
.btn { padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; border: none; min-width: 140px; }
.btn-primary {
  background: #ff8c00;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.4);
  font-weight: 600;
}
.btn-primary:hover:not(:disabled) {
  background: #e67800;
  transform: translateY(-2px);
}
.btn-primary:disabled { background: #FFDAC5; color: #999; cursor: not-allowed; box-shadow: none; transform: none; opacity: 1; }
.btn-secondary {
  background: white;
  color: #444;
  border: 2px solid #ddd;
  font-weight: 600;
}
.btn-secondary:hover {
  background: #f5f5f5;
}
.modal { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 3000; display: flex; align-items: center; justify-content: center; }
.modal-content { background: white; border-radius: 16px; width: 90%; max-width: 500px; padding: 40px; box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3); text-align: center; }
.modal-icon { font-size: 70px; margin-bottom: 25px; }
.modal h2 { color: var(--text-main); margin-bottom: 20px; font-size: 24px; }
.modal p { margin-bottom: 30px; color: var(--text-sub); font-size: 16px; line-height: 1.6; }
.modal-buttons { display: flex; justify-content: center; gap: 15px; }

@media (max-width: 1200px) { main.main-content { width: 85%; } }
@media (max-width: 768px) {
    main.main-content { width: 95%; padding: 25px; }
    .form-actions { flex-direction: column; gap: 15px; }
    .btn { width: 100%; }
}
@media (max-width: 480px) {
    main.main-content { padding: 20px 15px; width: 100%; }
    .page-title { font-size: 26px; }
}
</style>
