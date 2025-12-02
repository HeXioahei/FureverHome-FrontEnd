<template>
  <div class="font-display bg-background-light dark:bg-background-dark text-stone-900 dark:text-stone-200">
    <div class="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6">
      <main
        class="relative z-10 flex w-full max-w-[420px] flex-col items-center bg-white dark:bg-stone-800 rounded-xl shadow-xl px-10 py-12"
      >
        <!-- 标题 -->
        <div class="flex flex-col items-center gap-2 text-center mb-8">
          <h1 class="text-stone-900 dark:text-white text-3xl font-extrabold leading-tight tracking-tight">
            输入验证码
          </h1>
          <p class="text-sm text-stone-500 dark:text-stone-400 mt-2">
            验证码已发送至
            <span class="font-bold text-stone-900 dark:text-white">{{ email }}</span>
          </p>
        </div>

        <div class="w-full space-y-8">
          <!-- 6 位验证码输入框 -->
          <div class="flex justify-between gap-2">
            <input
              v-for="(item, index) in codes"
              :key="index"
              ref="codeInputs"
              v-model="codes[index]"
              type="text"
              maxlength="1"
              pattern="[0-9]"
              inputmode="numeric"
              class="w-12 h-14 text-center text-2xl font-bold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-DEFAULT focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-stone-900 dark:text-white placeholder:text-stone-300"
              @input="handleInput($event, index)"
              @keydown.backspace.prevent="handleBackspace(index)"
            />
          </div>

          <div class="text-center text-sm text-stone-400 dark:text-stone-500">
            60秒后可重新发送
          </div>

          <div class="text-center">
            <button
              type="button"
              class="text-sm font-bold text-primary hover:text-primary-hover"
              @click="resendCode"
            >
              收不到验证码？
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const email = ref<string>((route.query.email as string) || 'user@example.com');

// 6 位验证码
const codes = ref<string[]>(['', '', '', '', '', '']);
const codeInputs = ref<HTMLInputElement[]>([] as unknown as HTMLInputElement[]);

onMounted(() => {
  // 聚焦第一个输入框
  if (codeInputs.value && codeInputs.value[0]) {
    codeInputs.value[0].focus();
  }
});

function handleInput(e: Event, index: number) {
  const target = e.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, '');
  codes.value[index] = value;

  if (value && index < codes.value.length - 1) {
    const next = codeInputs.value[index + 1];
    next && next.focus();
  }
}

function handleBackspace(index: number) {
  if (codes.value[index]) {
    codes.value[index] = '';
    return;
  }
  if (index > 0) {
    const prev = codeInputs.value[index - 1];
    prev && prev.focus();
    codes.value[index - 1] = '';
  }
}

function resendCode() {
  // 这里后续可以接真正的“重发验证码”接口，目前做成前端提示即可
  alert('验证码已重新发送（示意）');
}
</script>
