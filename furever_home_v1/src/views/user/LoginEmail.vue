<template>
  <div class="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6">
    <main class="relative z-10 flex w-full max-w-[420px] flex-col items-center bg-white dark:bg-stone-800 rounded-xl shadow-xl px-10 py-12">

      <div class="flex flex-col items-center gap-2 text-center mb-8">
        <h1 class="text-stone-900 dark:text-white text-3xl font-extrabold leading-tight tracking-tight">
          登录 FUREVER HOME
        </h1>
        <p class="text-sm text-stone-500 dark:text-stone-400 mt-2">
          使用邮箱验证码登录
        </p>
      </div>

      <div class="w-full space-y-5">

        <!-- 邮箱输入 -->
        <div class="relative flex w-full">
          <input
            type="email"
            v-model="email"
            placeholder="请输入邮箱地址"
            class="form-input flex w-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 h-12 px-4 rounded-DEFAULT text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm"
          />
        </div>

        <!-- 验证码输入 -->
        <div class="relative flex w-full">
          <input
            type="text"
            v-model="code"
            placeholder="请输入验证码"
            maxlength="6"
            class="form-input flex w-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 h-12 px-4 rounded-DEFAULT text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm"
          />
          <button type="button" class="absolute right-0 top-0 h-full px-3 text-stone-400 hover:text-stone-500 dark:hover:text-stone-200 flex items-center justify-center" @click="sendCode">
            发送验证码
          </button>
        </div>

        <button class="flex h-12 w-full items-center justify-center rounded-DEFAULT bg-primary px-6 text-base font-bold text-white shadow-sm transition-all hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary mt-2" @click="login">
          登录
        </button>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const code = ref('');

// 发送验证码 (模拟)
const sendCode = () => {
  if (!validateEmail(email.value)) {
    alert('请输入正确邮箱');
    return;
  }
  alert('验证码已发送！(模拟)');
};

// 登录
const login = () => {
  if (!validateEmail(email.value)) {
    alert('请输入正确邮箱');
    return;
  }
  if (!code.value) {
    alert('请输入验证码');
    return;
  }

  // 登录成功跳转 LoginSuccess
  router.push({ path: '/login-success', query: { username: email.value.split('@')[0] } });
};

// 简单邮箱验证
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
</script>
