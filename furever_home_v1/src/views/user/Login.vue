<template>
  <div
    class="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 font-display bg-background-light dark:bg-background-dark text-stone-900 dark:text-stone-200"
  >
    <main
      class="relative z-10 flex w-full max-w-[420px] flex-col items-center bg-white dark:bg-stone-800 rounded-xl shadow-xl px-10 py-12"
    >
      <!-- 标题 -->
      <div class="flex flex-col items-center gap-2 text-center mb-8">
        <h1
          class="text-stone-900 dark:text-white text-3xl font-extrabold leading-tight tracking-tight"
        >
          欢迎使用 FUREVER<br />HOME!
        </h1>
      </div>

      <div class="w-full space-y-5 relative">
        <!-- 邮箱输入框 -->
        <div class="relative flex w-full items-center border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 h-12 px-4 rounded">
          <input
            type="text"
            v-model="emailInput"
            placeholder=""
            class="w-full bg-transparent outline-none text-stone-900 dark:text-white placeholder-transparent"
          />
          <!-- 灰色示例 -->
          <span
            class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none placeholder-text"
          >
            {{ displayPlaceholder }}
          </span>
        </div>

        <!-- 邮箱不合法提示 -->
        <div v-if="showEmailWarning" class="text-sm text-white bg-orange-500 px-3 py-1 rounded mt-1">
          请输入正确邮箱
        </div>

        <!-- 登录方式按钮 -->
        <div class="space-y-3 pt-2">
          <!-- 邮箱验证码登录 -->
          <button
            class="flex h-12 w-full items-center justify-center rounded text-white font-bold text-base shadow-sm transition-all hover:bg-primary-hover"
            style="background-color: #FB923C !important;"
            @click="validateAndGoEmailLogin"
          >
            邮箱验证码登录
          </button>

          <!-- 密码登录 -->
          <button
            class="flex h-12 w-full items-center justify-center rounded border border-primary text-stone-900 font-bold text-base shadow-sm transition-all hover:bg-primary/10"
            style="border-color: #FB923C !important;"
            @click="goPasswordLogin"
          >
            密码登录
          </button>
        </div>

        <!-- 注册入口 -->
        <div class="text-center text-sm mt-6">
          还没有账户?
          <button
            class="font-bold ml-1"
            style="color: #FB923C !important;"
            @click="goRegister"
          >
            立即注册
          </button>
        </div>
      </div>

      <!-- 协议 -->
      <div class="mt-8 text-center">
        <p class="text-xs text-stone-400 dark:text-stone-500 transform scale-90">
          继续即表示您同意我们的
          <a
            class="underline hover:text-stone-600 dark:hover:text-stone-300"
            href="#"
          >《用户协议》</a>
          和
          <a
            class="underline hover:text-stone-600 dark:hover:text-stone-300"
            href="#"
          >《隐私政策》</a>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const emailInput = ref(userStore.email || '')
const showEmailWarning = ref(false)

// 控制灰色示例显示
const placeholderSuffix = '@example.com'
const displayPlaceholder = computed(() => {
  if (!emailInput.value) {
    return 'user@example.com'
  }
  return emailInput.value.includes('@') ? '' : emailInput.value + placeholderSuffix
})

// 校验邮箱并跳转
const validateAndGoEmailLogin = () => {
  if (!emailInput.value || !emailInput.value.includes('@')) {
    showEmailWarning.value = true
    setTimeout(() => (showEmailWarning.value = false), 3000)
    return
  }
  userStore.setEmail(emailInput.value)
  router.push('/login/email')
}

// 密码登录
const goPasswordLogin = () => {
  userStore.setEmail(emailInput.value)
  router.push('/login/password')
}

// 注册
const goRegister = () => router.push('/register')
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* 强制灰色 placeholder */
.placeholder-text {
  color: #9CA3AF !important;
}
</style>
