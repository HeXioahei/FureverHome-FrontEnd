<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SubmitSuccessModal from '@/components/PostPet_components/SubmitSuccessModal.vue'
import LeaveDraftConfirmModal from '@/components/PostPet_components/LeaveDraftConfirmModal.vue'

interface PetForm {
  name: string
  breed: string
  gender: 'male' | 'female' | ''
  age: string
  vaccinated: boolean
  neutered: boolean
  dewormed: boolean
  personality: string
  story: string
  phone: string
  email: string
}

const router = useRouter()
const DRAFT_KEY = 'post_pet_draft'

const form = ref<PetForm>({
  name: '',
  breed: '',
  gender: '',
  age: '',
  vaccinated: false,
  neutered: false,
  dewormed: false,
  personality: '',
  story: '',
  phone: '',
  email: ''
})

const showSubmitSuccess = ref(false)
const showLeaveConfirm = ref(false)

const mediaFiles = ref<File[]>([])
const mediaPreviews = ref<{ url: string; type: 'image' | 'video' }[]>([])

const submitForm = () => {
  // TODO: 这里未来接后端提交接口，现在先简单打印
  console.log('提交审核', form.value)
  // 提交成功后清空草稿
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch (e) {
    console.warn('清除草稿失败', e)
  }
  showSubmitSuccess.value = true
}

const openLeaveConfirm = () => {
  showLeaveConfirm.value = true
}

const handleLeaveWithoutSave = () => {
  showLeaveConfirm.value = false
  router.push('/')
}

const handleFilesAdded = (files: FileList | null) => {
  if (!files || !files.length) return

  Array.from(files).forEach((file) => {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) return

    mediaFiles.value.push(file)
    mediaPreviews.value.push({
      url: URL.createObjectURL(file),
      type: isImage ? 'image' : 'video'
    })
  })
}

const handleFileInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  handleFilesAdded(target?.files ?? null)
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  handleFilesAdded(event.dataTransfer?.files ?? null)
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleSaveAndLeave = () => {
  console.log('保存草稿', form.value)
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form.value))
  } catch (e) {
    console.warn('保存草稿失败', e)
  }
  showLeaveConfirm.value = false
  router.push('/')
}

onMounted(() => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PetForm>
      Object.assign(form.value, parsed)
    }
  } catch (e) {
    console.warn('读取草稿失败', e)
  }
})
</script>

<template>
  <main class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
    <div class="flex flex-col gap-10">
      <div class="flex flex-wrap justify-between gap-3 p-4">
        <h1
          class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72"
        >
          发布待领养动物信息
        </h1>
      </div>

      <div
        class="flex flex-col gap-8 bg-white dark:bg-gray-900/50 p-6 sm:p-8 rounded-xl border border-[#e6e0db] dark:border-gray-800"
      >
        <!-- 宠物基本信息 -->
        <section>
          <h2
            class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            宠物基本信息
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-4 py-3">
            <label class="flex flex-col min-w-40 flex-1">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                动物名称
              </p>
              <input
                v-model="form.name"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="例如：豆豆"
              />
            </label>

            <label class="flex flex-col min-w-40 flex-1">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                品种
              </p>
              <input
                v-model="form.breed"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="例如：金毛寻回犬"
              />
            </label>

            <div class="flex flex-col">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                性别
              </p>
              <div class="flex items-center gap-4 h-14">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="form.gender"
                    class="form-radio text-primary focus:ring-primary/50 bg-background-light dark:bg-background-dark border-[#e6e0db] dark:border-gray-700"
                    type="radio"
                    name="gender"
                    value="male"
                  />
                  <span class="text-slate-700 dark:text-slate-300">公</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="form.gender"
                    class="form-radio text-primary focus:ring-primary/50 bg-background-light dark:bg-background-dark border-[#e6e0db] dark:border-gray-700"
                    type="radio"
                    name="gender"
                    value="female"
                  />
                  <span class="text-slate-700 dark:text-slate-300">母</span>
                </label>
              </div>
            </div>

            <label class="flex flex-col min-w-40 flex-1">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                年龄
              </p>
              <input
                v-model="form.age"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="例如：2岁"
              />
            </label>
          </div>
        </section>

        <!-- 健康状况 -->
        <section>
          <h2
            class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            健康状况
          </h2>
          <div class="flex flex-wrap gap-x-8 gap-y-4 px-4 py-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.vaccinated"
                class="form-checkbox rounded text-primary focus:ring-primary/50 bg-background-light dark:bg-background-dark border-[#e6e0db] dark:border-gray-700"
                type="checkbox"
              />
              <span class="text-slate-700 dark:text-slate-300">已免疫</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.neutered"
                class="form-checkbox rounded text-primary focus:ring-primary/50 bg-background-light dark:bg-background-dark border-[#e6e0db] dark:border-gray-700"
                type="checkbox"
              />
              <span class="text-slate-700 dark:text-slate-300">已绝育</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.dewormed"
                class="form-checkbox rounded text-primary focus:ring-primary/50 bg-background-light dark:bg-background-dark border-[#e6e0db] dark:border-gray-700"
                type="checkbox"
              />
              <span class="text-slate-700 dark:text-slate-300">已驱虫</span>
            </label>
          </div>
        </section>

        <!-- 性格特点 -->
        <section>
          <h2
            class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            性格特点
          </h2>
          <div class="px-4 py-3">
            <textarea
              v-model="form.personality"
              class="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary min-h-[120px] placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              placeholder="例如：活泼亲人，喜欢玩球，对小孩和其它动物友好..."
            />
          </div>
        </section>

        <!-- 照片/视频上传 -->
        <section>
          <h2
            class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            照片/视频上传
          </h2>
          <div class="px-4 py-3 space-y-4">
            <div
              class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-[#faf7f2] dark:bg-gray-900/40 py-10 px-4 text-center cursor-pointer"
              @drop="handleDrop"
              @dragover="handleDragOver"
            >
              <input
                id="media-upload-input"
                type="file"
                class="hidden"
                multiple
                accept="image/png,image/jpeg,image/gif,video/mp4"
                @change="handleFileInputChange"
              />
              <label for="media-upload-input" class="flex flex-col items-center gap-2 cursor-pointer">
                <span class="material-icons text-gray-400 text-4xl mb-2">cloud_upload</span>
                <span class="text-orange-500 text-sm font-semibold">点击上传</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  或拖拽文件到此处，支持 PNG, JPG, GIF, MP4（第一张将作为封面）
                </span>
              </label>
            </div>

            <div v-if="mediaPreviews.length" class="flex flex-wrap gap-4">
              <div
                v-for="(media, index) in mediaPreviews"
                :key="media.url + index"
                class="w-32 h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center"
              >
                <img
                  v-if="media.type === 'image'"
                  :src="media.url"
                  alt="预览图片"
                  class="w-full h-full object-cover"
                />
                <video
                  v-else
                  :src="media.url"
                  class="w-full h-full object-cover"
                  controls
                />
              </div>
            </div>
          </div>
        </section>

        <!-- 故事/详细描述 -->
        <section>
          <h2
            class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            救助故事/详细描述
          </h2>
          <div class="px-4 py-3">
            <textarea
              v-model="form.story"
              class="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary min-h-[200px] placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              placeholder="请详细描述宠物的背景、故事和任何特殊需求..."
            />
          </div>
        </section>

        <!-- 联系信息 -->
        <section>
          <h2
            class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            联系信息
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-4 py-3">
            <label class="flex flex-col min-w-40 flex-1">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                联系电话
              </p>
              <input
                v-model="form.phone"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="请输入您的电话号码"
              />
            </label>
            <label class="flex flex-col min-w-40 flex-1">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                电子邮箱
              </p>
              <input
                v-model="form.email"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="请输入您的电子邮箱"
              />
            </label>
          </div>
        </section>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-wrap justify-end items-center gap-4 px-4 py-5">
        <button
          type="button"
          class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-200 text-base font-bold leading-normal tracking-[0.015em]"
          @click="openLeaveConfirm"
        >
          <span class="truncate">返回列表</span>
        </button>
        <button
          type="button"
          class="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-orange-500 hover:bg-orange-600 shadow-md text-white text-base font-bold leading-normal tracking-[0.015em]"
          @click="submitForm"
        >
          <span class="truncate">提交审核</span>
        </button>
      </div>
    </div>

    <SubmitSuccessModal :visible="showSubmitSuccess" />

    <LeaveDraftConfirmModal
      :visible="showLeaveConfirm"
      @leave-without-save="handleLeaveWithoutSave"
      @save-and-leave="handleSaveAndLeave"
    />
  </main>
</template>
