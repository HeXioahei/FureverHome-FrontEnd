<!--test-->
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

      <div class="w-full space-y-5">
        <!-- 显示邮箱区域 -->
        <div
          class="flex w-full items-center justify-between border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 h-12 px-4 rounded"
        >
          <span class="text-stone-900 dark:text-white text-sm font-medium">{{ email }}</span>
          <button
            class="text-sm font-bold text-primary hover:text-primary-hover"
            @click="goChangeEmail"
          >
            更改
          </button>
        </div>

        <!-- 登录方式按钮 -->
        <div class="space-y-3 pt-2">
          <!-- 邮箱验证码登录：橙底白字 -->
          <button
  class="flex h-12 w-full items-center justify-center rounded text-white font-bold text-base shadow-sm transition-all hover:bg-primary-hover"
  style="background-color: #FB923C !important;"
  @click="goEmailLogin"
>
  邮箱验证码登录
</button>


<!-- 密码登录：白底黑字 + 橙色边框 -->
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
          <a class="underline hover:text-stone-600 dark:hover:text-stone-300" href="#"
            >《用户协议》</a
          >
          和
          <a class="underline hover:text-stone-600 dark:hover:text-stone-300" href="#"
            >《隐私政策》</a
          >
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const email = userStore.email || 'user@example.com'

const goEmailLogin = () => router.push('/login/email')
const goPasswordLogin = () => router.push('/login/password')
const goRegister = () => router.push('/register')
const goChangeEmail = () => router.push('/login')
</script>
