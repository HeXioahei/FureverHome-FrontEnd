<template>
  <div
    class="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F6F6F8] dark:bg-[#101622] overflow-x-hidden"
  >
    <div class="w-full max-w-md px-6">
      <div
        class="flex flex-col gap-8 rounded-xl border border-slate-200/60 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
      >
        <div class="flex flex-col items-center">
          <h1
            class="text-[#111318] dark:text-white text-[24px] font-bold leading-tight text-center tracking-tight"
          >
            FUREVER HOME - 管理后台
          </h1>
        </div>

        <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-4">
            <label class="flex flex-col">
              <p class="text-[#111318] dark:text-slate-300 text-sm font-medium leading-normal pb-2">
                管理员账号
              </p>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-4 text-slate-500 dark:text-slate-400">
                  person
                </span>
                <input
                  v-model="form.username"
                  autocomplete="username"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary h-14 placeholder:text-[#616f89] dark:placeholder:text-slate-500 pl-12 pr-4 py-3 text-base font-normal leading-normal"
                  placeholder="请输入您的账号"
                />
              </div>
            </label>

            <label class="flex flex-col">
              <p class="text-[#111318] dark:text-slate-300 text-sm font-medium leading-normal pb-2">
                密码
              </p>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-4 text-slate-500 dark:text-slate-400">
                  lock
                </span>
                <input
                  v-model="form.password"
                  autocomplete="current-password"
                  type="password"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary h-14 placeholder:text-[#616f89] dark:placeholder:text-slate-500 pl-12 pr-4 py-3 text-base font-normal leading-normal"
                  placeholder="请输入您的密码"
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            class="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 text-white text-base font-bold leading-normal tracking-[0.015em] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            :style="{
              backgroundColor: loading ? '#4b7cff' : '#1152d4'
            }"
            :disabled="loading"
          >
            <span class="truncate">
              {{ loading ? '登录中...' : '登 录' }}
            </span>
          </button>

          <p v-if="errorMessage" class="text-sm text-red-500 text-center">
            {{ errorMessage }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { adminLogin, type AdminLoginRequest } from '../../api/adminAuthApi';

const router = useRouter();

const form = reactive<AdminLoginRequest>({
  username: '',
  password: ''
});

const loading = ref(false);
const errorMessage = ref('');

async function handleSubmit() {
  if (!form.username || !form.password) {
    errorMessage.value = '请输入账号和密码';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const res = await adminLogin({
      username: form.username,
      password: form.password
    });

    if (res.code === 0 && res.data && res.data.token) {
      // 保存 token，后续请求会自动携带
      localStorage.setItem('token', res.data.token);
      // 跳转到后台首页
      router.push({ name: 'AdminDashboard' });
    } else {
      errorMessage.value = res.message || '登录失败，请检查账号或密码';
    }
  } catch (error: any) {
    errorMessage.value = error?.message || '登录失败，请稍后重试';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>


