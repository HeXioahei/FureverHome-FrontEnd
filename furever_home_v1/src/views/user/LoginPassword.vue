<template>
  <div class="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6">
    <main class="relative z-10 flex w-full max-w-[420px] flex-col items-center bg-white dark:bg-stone-800 rounded-xl shadow-xl px-10 py-12">

      <div class="flex flex-col items-center gap-2 text-center mb-8">
        <h1 class="text-stone-900 dark:text-white text-3xl font-extrabold leading-tight tracking-tight">
          欢迎使用 FUREVER HOME!
        </h1>
      </div>

      <div class="w-full space-y-5">

        <!-- 邮箱显示 -->
        <div class="flex w-full items-center justify-between border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 h-12 px-4 rounded-DEFAULT">
          <span class="text-stone-900 dark:text-white text-sm font-medium">{{ email }}</span>
          <a href="#" class="text-sm font-bold text-primary hover:text-primary-hover">更改</a>
        </div>

        <!-- 密码输入 -->
        <div class="relative flex w-full">
          <input
            type="password"
            v-model="password"
            placeholder="请输入您的密码"
            class="form-input flex w-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 h-12 px-4 rounded-DEFAULT text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm pr-10"
          />
          <button type="button" class="absolute right-0 top-0 h-full px-3 text-stone-400 hover:text-stone-500 dark:hover:text-stone-200 flex items-center justify-center" @click="togglePassword">
            <span class="material-symbols-outlined text-[20px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
          </button>
        </div>

        <div class="flex justify-end pt-0">
          <button
            type="button"
            class="text-sm font-bold text-primary hover:text-primary-hover"
            @click="goResetPassword"
          >
            忘记密码?
          </button>
        </div>

        <button
          class="flex h-12 w-full items-center justify-center rounded-DEFAULT bg-primary px-6 text-base font-bold text-white shadow-sm transition-all hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading"
          @click="loginWithPassword"
        >
          登录
        </button>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userLogin } from '@/api/authApi';
import { processLoginSuccess } from '@/utils/authHelpers';

const route = useRoute();
const router = useRouter();

const email = ref<string>((route.query.email as string) || 'user@example.com');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
  const input = document.querySelector('input[type=password]') as HTMLInputElement;
  if (input) {
    input.type = showPassword.value ? 'text' : 'password';
  }
};

const goResetPassword = () => {
  router.push({ name: 'ResetPasswordRequest', query: { email: email.value } });
};

const loginWithPassword = async () => {
  if (!email.value || !email.value.includes('@')) {
    alert('请输入正确的邮箱地址');
    return;
  }
  if (!password.value) {
    alert('请输入密码');
    return;
  }

  loading.value = true;
  try {
    const res = await userLogin({ account: email.value, password: password.value });
    const { targetRouteName } = await processLoginSuccess(res, email.value);
    await router.push({ name: targetRouteName });
  } catch (error: any) {
    alert(error?.message || '登录失败，请稍后再试');
  } finally {
    loading.value = false;
  }
};
</script>
