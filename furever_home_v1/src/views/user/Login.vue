<template>
  <div class="font-display bg-background-light dark:bg-background-dark text-stone-900 dark:text-stone-200">
    <div class="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6">
      <main
        class="relative z-10 flex w-full max-w-[420px] flex-col items-center bg-white dark:bg-stone-800 rounded-xl shadow-xl px-10 py-12"
      >
        <div class="flex flex-col items-center gap-2 text-center mb-8">
          <h1 class="text-stone-900 dark:text-white text-3xl font-extrabold leading-tight tracking-tight">
            欢迎使用 FUREVER<br />HOME!
          </h1>
        </div>

        <div class="w-full space-y-5">
          <!-- 账号/邮箱输入行 -->
          <div
            class="flex w-full items-center justify-between border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 h-12 px-4 rounded-DEFAULT"
          >
            <input
              v-model="account"
              type="text"
              autocomplete="username"
              class="flex-1 bg-transparent outline-none text-sm text-stone-900 dark:text-white placeholder:text-stone-400"
              placeholder="请输入您的账号或邮箱"
            />
          </div>

          <!-- 密码输入 -->
          <div class="relative flex w-full">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="form-input flex w-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 h-12 px-4 rounded-DEFAULT text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm pr-10"
              placeholder="请输入您的密码"
            />
            <button
              type="button"
              class="absolute right-0 top-0 h-full px-3 text-stone-400 hover:text-stone-500 dark:hover:text-stone-200 flex items-center justify-center"
              @click="togglePassword"
            >
              <span class="material-symbols-outlined text-[20px]">
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>

          <!-- 忘记密码 -->
          <div class="flex justify-end pt-0">
            <a href="javascript:void(0)" class="text-sm font-bold text-primary hover:text-primary-hover">
              忘记密码?
            </a>
          </div>

          <!-- 登录按钮 -->
          <button
            class="flex h-12 w-full items-center justify-center rounded-DEFAULT px-6 text-base font-bold text-white shadow-sm transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            :style="{
              backgroundColor: loading ? '#e67e00' : '#FF8C00'
            }"
            :disabled="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>

          <!-- 底部注册链接 -->
          <div class="text-center text-sm text-stone-500 dark:text-stone-400 mt-6">
            还没有账户?
            <a class="font-bold text-primary hover:text-primary-hover ml-1" href="javascript:void(0)" @click="goRegister">
              立即注册
            </a>
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

      <!-- 登录成功弹窗 -->
      <div
        v-if="showSuccess"
        class="fixed inset-0 bg-black/40 z-[3000] flex items-center justify-center p-4 sm:p-6"
      >
        <main
          class="relative z-10 flex w-full max-w-[420px] flex-col items-center justify-center bg-white dark:bg-stone-800 rounded-xl shadow-xl px-10 py-16 text-center"
        >
          <div class="w-24 h-24 bg-[#DCFCE7] dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8">
            <svg
              class="w-12 h-12 text-[#16A34A]"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>

          <div class="space-y-3">
            <h1 class="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              {{ isAdminLogin ? '管理员登录成功！' : '登录成功！' }}
            </h1>
            <p class="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              欢迎回来，<span class="font-bold text-primary">{{ successUserName }}</span>！<br />
              正在为您跳转至{{ isAdminLogin ? '后台首页' : '主页' }}...
            </p>
          </div>
        </main>
      </div>

      <!-- 错误提示 -->
      <div
        v-if="errorMessage"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm px-4 py-2 rounded-full shadow-lg z-[3100]"
      >
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userLogin } from '../../api/authApi';
import { getCurrentUser, type CurrentUserInfo } from '../../api/userApi';

const route = useRoute();
const router = useRouter();

// 账号（可以是用户名或邮箱），尝试从 query 中预填
const account = ref<string>((route.query.email as string) || '');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const showSuccess = ref(false);
const successUserName = ref('');
const isAdminLogin = ref(false); // 是否为管理员登录成功

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function goRegister() {
  router.push({ name: 'Register' });
}

async function handleLogin() {
  if (!account.value || !password.value) {
    errorMessage.value = '请输入账号和密码';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const res: any = await userLogin({
      account: account.value,
      password: password.value
    });

    // 兼容两种返回结构：
    // 1）data 直接是 token 信息（老结构）
    // 2）data 里包含 tokenInfo（当前后台返回）
    const data = res.data || {};
    const tokenInfo = data.tokenInfo || data;

    const tokenValue: string | undefined = tokenInfo.tokenValue;
    const tokenName: string | undefined = tokenInfo.tokenName;
    const isLogin: boolean = tokenInfo.isLogin ?? true;

    if ((res.code === 0 || res.code === 200) && tokenValue && isLogin) {
      // 使用返回的 tokenValue 作为前台 token
      localStorage.setItem('token', tokenValue);
      // 记录 tokenName（如 Authorization 或 satoken），便于后续接口带上正确的头
      if (tokenName && tokenValue) {
        localStorage.setItem('saTokenName', tokenName);
        localStorage.setItem('saTokenValue', tokenValue);
      }

      // 解析角色，决定跳转前台还是后台
      // roles 可能在 res.data.roles 或 res.data.tokenInfo.roles 或 res.data 的顶层
      let targetRouteName: string = 'Home'; // 默认前台首页
      
      // 尝试从多个位置获取 roles
      const rawRoles: any = data.roles || tokenInfo.roles || (res as any).roles;
      let roles: string[] = [];

      // 解析角色数组
      if (Array.isArray(rawRoles)) {
        roles = rawRoles.map(r => String(r).toUpperCase().trim());
      } else if (typeof rawRoles === 'string') {
        // 如果是逗号分隔的字符串，拆分成数组
        roles = rawRoles.split(',').map(r => r.toUpperCase().trim()).filter(r => r);
      } else if (rawRoles !== null && rawRoles !== undefined) {
        // 如果是对象或其他类型，尝试转换为字符串再处理
        const roleStr = String(rawRoles).toUpperCase().trim();
        if (roleStr) {
          roles = [roleStr];
        }
      }

      if (roles.length > 0) {
        // 记录角色到本地，方便其他地方使用
        localStorage.setItem('roles', JSON.stringify(roles));
      }

      // 兼容 ROLE_ADMIN / ROLE_USER / ADMIN / admin / "ADMIN" / ["ADMIN"] 等各种形式
      // 检查是否包含 ADMIN（不区分大小写，支持多种格式）
      const hasAdminRole = roles.some(r => {
        const roleStr = String(r).toUpperCase().trim();
        // 匹配: ADMIN, ROLE_ADMIN, ADMIN_ROLE, 或包含 ADMIN 的任何字符串
        return roleStr === 'ADMIN' || 
               roleStr.includes('ADMIN') || 
               roleStr === 'ROLE_ADMIN' ||
               roleStr.startsWith('ADMIN');
      });
      
      const hasUserRole = roles.some(r => {
        const roleStr = String(r).toUpperCase().trim();
        return roleStr === 'USER' || 
               roleStr.includes('USER') || 
               roleStr === 'ROLE_USER' ||
               roleStr.startsWith('USER');
      });

      isAdminLogin.value = hasAdminRole;

      if (hasAdminRole) {
        // 管理员：直接进入后台首页，不再调用"获取我的个人信息"接口
        targetRouteName = 'AdminDashboard';
        successUserName.value = account.value;
      } else {
        if (hasUserRole) {
          targetRouteName = 'Home';
        }

        // 前台用户：立刻获取我的个人信息并缓存，供导航栏和个人主页使用
        try {
          const meRes = await getCurrentUser();
          if ((meRes.code === 0 || meRes.code === 200) && meRes.data) {
            const me: CurrentUserInfo = meRes.data;
            localStorage.setItem('currentUser', JSON.stringify(me));
            if (me.userName) {
              localStorage.setItem('userName', me.userName);
            }
            if (me.avatarUrl) {
              localStorage.setItem('avatarUrl', me.avatarUrl);
            }
            successUserName.value = me.userName || account.value;
            // 通知全局（如导航栏）当前用户信息已更新
            window.dispatchEvent(new CustomEvent('current-user-updated'));
          } else {
            successUserName.value = account.value;
          }
        } catch (e) {
          console.error('登录后获取当前用户信息失败', e);
          successUserName.value = account.value;
        }
      }

      showSuccess.value = true;

      // 2 秒后自动跳转；如果 router.push 失败，使用 window.location 兜底
      window.setTimeout(async () => {
        try {
          await router.push({ name: targetRouteName });
        } catch (e) {
          console.error('路由跳转失败，使用浏览器跳转兜底', e);
          const fallbackPath =
            targetRouteName === 'AdminDashboard' ? '/admin' : '/home';
          window.location.href = fallbackPath;
        }
      }, 2000);
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
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* 强制灰色 placeholder */
.placeholder-text {
  color: #9CA3AF !important;
}
</style>
