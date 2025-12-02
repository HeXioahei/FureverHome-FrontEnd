<template>
  <div class="font-display bg-background-light dark:bg-background-dark text-stone-900 dark:text-stone-200 min-h-screen flex items-center justify-center p-4">

    <main
      class="w-full max-w-[420px] bg-white dark:bg-stone-800 rounded-xl shadow-xl px-10 py-12"
    >
      <!-- 标题 -->
      <div class="flex flex-col items-center gap-2 text-center mb-8">
        <h1 class="text-stone-900 dark:text-white text-3xl font-extrabold">
          创建账户
        </h1>
        <p class="text-sm text-stone-500 dark:text-stone-400">
          欢迎加入 FUREVER HOME 大家庭
        </p>
      </div>

      <div class="w-full space-y-5">

        <!-- 邮箱 -->
        <div class="space-y-1">
          <label class="text-sm font-bold ml-1">邮箱地址</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              class="form-input border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800
              h-12 px-4 rounded text-stone-900 dark:text-white text-sm w-full pr-10"
              placeholder="请输入您的邮箱"
            />
            <span
              class="material-symbols-outlined text-[20px] text-stone-400 absolute right-3 top-1/2 -translate-y-1/2"
            >
              mail
            </span>
          </div>
        </div>

        <!-- 密码 -->
        <div class="space-y-1">
          <label class="text-sm font-bold ml-1">设置密码</label>
          <div class="relative">
            <input
              :type="showPassword1 ? 'text' : 'password'"
              v-model="password"
              class="form-input border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800
              h-12 px-4 rounded text-stone-900 dark:text-white text-sm w-full pr-10"
              placeholder="请输入您的密码"
            />
            <button
              type="button"
              @click="showPassword1 = !showPassword1"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
            >
              <span class="material-symbols-outlined text-[20px]">
                {{ showPassword1 ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
        </div>

        <!-- 再次输入密码 -->
        <div class="space-y-1">
          <label class="text-sm font-bold ml-1">确认密码</label>
          <div class="relative">
            <input
              :type="showPassword2 ? 'text' : 'password'"
              v-model="password2"
              class="form-input border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800
              h-12 px-4 rounded text-stone-900 dark:text-white text-sm w-full pr-10"
              placeholder="请再次输入您的密码"
            />
            <button
              type="button"
              @click="showPassword2 = !showPassword2"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
            >
              <span class="material-symbols-outlined text-[20px]">
                {{ showPassword2 ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
        </div>

        <!-- 昵称 -->
        <div class="space-y-1">
          <label class="text-sm font-bold ml-1">您的昵称</label>
          <input
            v-model="nickname"
            type="text"
            class="form-input border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800
            h-12 px-4 rounded text-stone-900 dark:text-white text-sm w-full"
            placeholder="请输入您的昵称"
          />
        </div>

        <!-- 注册按钮 -->
        <div class="pt-2">
          <button
            class="h-12 w-full bg-primary text-white font-bold rounded hover:bg-primary-hover transition-all"
            @click="handleRegister"
          >
            完成注册
          </button>

          <p class="text-center text-xs text-stone-400 dark:text-stone-500 mt-3">
            点击“完成注册”即表示您同意
            <a class="text-primary hover:underline" href="#">《用户协议》</a>
            和
            <a class="text-primary hover:underline" href="#">《隐私政策》</a>
          </p>
        </div>

        <!-- 已有账号 -->
        <div class="text-center text-sm text-stone-500 dark:text-stone-400 pt-4 border-t border-stone-200 dark:border-stone-700">
          已有账户？
          <span
            class="font-bold text-primary cursor-pointer"
            @click="goLogin"
          >
            返回登录
          </span>
        </div>

      </div>
    </main>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 表单数据
const email = ref("");
const password = ref("");
const password2 = ref("");
const nickname = ref("");

// 密码可见切换
const showPassword1 = ref(false);
const showPassword2 = ref(false);

// 注册逻辑
const handleRegister = () => {
  if (!email.value.includes("@")) {
    alert("请输入正确的邮箱！");
    return;
  }
  if (!password.value) {
    alert("请输入密码！");
    return;
  }
  if (password.value !== password2.value) {
    alert("两次密码不一致！");
    return;
  }
  if (!nickname.value) {
    alert("请输入昵称！");
    return;
  }

  // ⚠️ 这里之后要接后端接口
  console.log("注册成功:", email.value, password.value, nickname.value);

  // 注册成功后跳转到成功页
  router.push("/login-success");
};

const goLogin = () => {
  router.push("/login-email");
};
</script>

<style>
/* 保证 tailwind 的 primary 能用 */
:root {
  --tw-primary: #ff8c00;
}
.text-primary {
  color: #ff8c00 !important;
}

/* 让按钮 hover 的时候也强制橙色 */
.bg-primary {
  background-color: #ff8c00 !important;
}

.bg-primary-hover:hover {
  background-color: #e67e00 !important;
}

/* 链接使用橙色 */
a.text-primary {
  color: #ff8c00 !important;
}

.font-orange {
  color: #ff8c00 !important;
}
</style>
