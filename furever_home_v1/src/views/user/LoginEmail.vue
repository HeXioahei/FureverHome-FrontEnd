<template>
  <div class="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 font-display bg-background-light dark:bg-background-dark text-stone-900 dark:text-stone-200">
    <main class="relative z-10 flex w-full max-w-[420px] flex-col items-center bg-white dark:bg-stone-800 rounded-xl shadow-xl px-10 py-12">
      <div class="flex flex-col items-center gap-2 text-center mb-8">
        <h1 class="text-stone-900 dark:text-white text-3xl font-extrabold leading-tight tracking-tight">
          邮箱验证码登录
        </h1>
      </div>

      <div class="w-full space-y-5">
        <input
          type="text"
          v-model="email"
          placeholder="请输入邮箱"
          class="form-input w-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 h-12 px-4 rounded text-stone-900 dark:text-white placeholder:text-stone-400"
        />
        <div class="flex gap-2">
          <input
            type="text"
            v-model="code"
            placeholder="请输入验证码"
            class="form-input flex-1 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 h-12 px-4 rounded text-stone-900 dark:text-white placeholder:text-stone-400"
          />
          <button class="px-4 bg-primary text-white rounded" @click="sendCode">发送验证码</button>
        </div>

        <button class="w-full h-12 bg-primary text-white rounded font-bold" @click="login">
          登录
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref(userStore.email || '')
const code = ref('')

const sendCode = () => {
  alert(`验证码已发送到 ${email.value}`)
}

const login = () => {
  if (!email.value || !code.value) {
    alert('请输入邮箱和验证码')
    return
  }
  userStore.setEmail(email.value)
  alert('登录成功')
  router.push('/')
}
</script>
