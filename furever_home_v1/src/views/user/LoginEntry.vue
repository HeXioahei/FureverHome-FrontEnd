<template>
  <div class="font-display bg-background-light dark:bg-background-dark text-stone-900 dark:text-stone-200">
    <div class="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6">
      <main
        class="relative z-10 flex w-full max-w-[420px] flex-col items-center bg-white dark:bg-stone-800 rounded-xl shadow-xl px-10 py-12"
      >
        <!-- 标题 -->
        <div class="flex flex-col items-center gap-2 text-center mb-8">
          <h1 class="text-stone-900 dark:text-white text-3xl font-extrabold leading-tight tracking-tight">
            欢迎使用 FUREVER<br />HOME!
          </h1>
          <p class="text-sm text-stone-500 dark:text-stone-400 mt-1">
            请选择登录方式
          </p>
        </div>

        <div class="w-full space-y-5">
          <!-- 顶部装饰输入框：昵称或邮箱（仅用于美观 & 预填下一个页面） -->
          <div
            class="flex w-full items-center justify-between border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 h-12 px-4 rounded-DEFAULT"
          >
            <input
              v-model="quickAccount"
              type="text"
              autocomplete="username"
              class="flex-1 bg-transparent outline-none text-sm text-stone-900 dark:text-white placeholder:text-stone-400"
              placeholder="请输入昵称或邮箱"
            />
          </div>

          <!-- 两种登录方式按钮 -->
          <div class="space-y-3 pt-2">
            <button
              type="button"
              class="flex h-12 w-full items-center justify-center rounded-DEFAULT bg-primary px-6 text-base font-bold text-white shadow-sm transition-all hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              @click="goEmailCodeLogin"
            >
              邮箱验证码登录
            </button>

            <button
              type="button"
              class="flex h-12 w-full items-center justify-center rounded-DEFAULT border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-6 text-base font-bold text-stone-900 dark:text-white shadow-sm transition-all hover:bg-stone-50 dark:hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
              @click="goPasswordLogin"
            >
              密码登录（昵称或邮箱）
            </button>
          </div>

          <!-- 注册入口 -->
          <div class="text-center text-sm text-stone-500 dark:text-stone-400 mt-6">
            还没有账户?
            <button
              type="button"
              class="font-bold text-primary hover:text-primary-hover ml-1"
              @click="goRegister"
            >
              立即注册
            </button>
          </div>
        </div>

        <!-- 协议文案 -->
        <div class="mt-8 text-center">
          <p class="text-xs text-stone-400 dark:text-stone-500 transform scale-90">
            继续即表示您同意我们的
            <a class="underline hover:text-stone-600 dark:hover:text-stone-300" href="javascript:void(0)">《用户协议》</a>
            和
            <a class="underline hover:text-stone-600 dark:hover:text-stone-300" href="javascript:void(0)">《隐私政策》</a>
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 顶部输入框内容（昵称或邮箱，仅用于传递到后续页面做预填）
const quickAccount = ref('');

// 选择：邮箱验证码登录 => 先进入“输入邮箱”页面
function goEmailCodeLogin() {
  const value = quickAccount.value.trim();
  const email = value.includes('@') ? value : '';
  router.push({ name: 'LoginEmailEnter', query: { email } });
}

// 选择：密码登录 => 直接进入密码登录页，在那里输入昵称或邮箱
function goPasswordLogin() {
  const value = quickAccount.value.trim();
  router.push({ name: 'LoginPassword', query: { account: value } });
}

// 跳转到注册页
function goRegister() {
  const value = quickAccount.value.trim();
  const email = value.includes('@') ? value : '';
  router.push({ name: 'Register', query: { email } });
}
</script>


