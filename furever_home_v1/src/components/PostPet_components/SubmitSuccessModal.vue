<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/60 px-4 py-5"
  >
    <div class="flex h-full max-h-[420px] w-full max-w-md grow flex-col">
      <div class="flex flex-1 justify-center">
        <div
          class="flex w-full flex-col items-center rounded-xl bg-white dark:bg-background-dark p-8 shadow-2xl"
        >
          <div class="flex flex-col items-center justify-center gap-6 text-center">
            <!-- Success Icon -->
            <div
              class="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50"
            >
              <span class="material-icons text-5xl text-green-500">
                check_circle
              </span>
            </div>

            <!-- Text Content -->
            <div class="flex max-w-[480px] flex-col items-center gap-2">
              <p
                class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
              >
                信息已成功提交！
              </p>
              <p
                class="text-base font-normal leading-relaxed text-gray-600 dark:text-gray-400"
              >
                您的宠物信息已提交，平台将在24小时内完成审核。审核结果将通过站内信通知您。您也可以随时在【个人主页】-【我的内容】中查看进度。
              </p>
            </div>

            <!-- Action Button -->
            <button
              type="button"
              class="flex w-full min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-orange-500 hover:bg-orange-600 text-white text-base font-bold leading-normal shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
              @click="handleClose"
            >
              <span class="truncate">好的，我知道了</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  visible: boolean
}

defineProps<Props>()

const router = useRouter()

const handleClose = () => {
  router.push('/')
}
</script>

