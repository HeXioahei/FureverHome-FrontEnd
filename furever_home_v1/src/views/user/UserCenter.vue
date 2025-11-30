<template>
  <div class="min-h-screen" style="background-color: #F8F9FB;">
    <!-- 主体布局 -->
    <div class="max-w-6xl mx-auto my-8 px-5 flex gap-8">
      <!-- 左侧侧边栏 -->
      <aside class="w-[260px] bg-white rounded-xl p-8 shadow-sm h-fit flex flex-col gap-8">
        <div class="flex items-center gap-4 pb-2.5">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-white" style="background-color: #F3C697;">
            <i class="fa-regular fa-circle text-2xl"></i>
          </div>
          <div>
            <h3 class="text-base font-bold" style="color: #333333;">{{ userName }}</h3>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <div 
            v-for="item in menuItems" 
            :key="item.key"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm cursor-pointer transition-colors"
            :class="[
              activeMenu === item.key 
                ? 'font-semibold' 
                : 'text-gray-600',
              item.isLogout ? 'text-red-500 mt-5' : '',
              activeMenu === item.key && !item.isLogout
                ? 'bg-[#FFE4CF] text-[#D97706]'
                : item.isLogout 
                  ? 'hover:bg-[#FEF2F2]'
                  : 'hover:bg-[#F3F4F6]'
            ]"
            @click="handleMenuClick(item)"
          >
            <i :class="item.icon" class="w-5 text-center"></i>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </aside>

      <!-- 右侧主内容区 -->
      <main class="flex-1">
        <component :is="currentComponent" />
      </main>
    </div>

    <!-- 退出登录确认弹窗 -->
    <ConfirmModal
      :visible="showLogoutConfirmModal"
      title="确认操作"
      message="确定要退出登录吗？"
      @confirm="confirmLogout"
      @cancel="closeLogoutConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ConfirmModal from '../../components/common/ConfirmModal.vue';
import MyHome from './UserCenter/MyHome.vue';
import MyTodo from './UserCenter/MyTodo.vue';
import MyPosts from './UserCenter/MyPosts.vue';
import MyApplications from './UserCenter/MyApplications.vue';
import BasicInfo from './UserCenter/BasicInfo.vue';
import CreditScore from './UserCenter/CreditScore.vue';

const route = useRoute();
const router = useRouter();

const userName = ref('李同学');

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  component: any;
  isLogout?: boolean;
}

const menuItems: MenuItem[] = [
  { key: 'home', label: '我的主页', icon: 'fa-solid fa-house', component: MyHome },
  { key: 'todo', label: '我的待办', icon: 'fa-solid fa-list-check', component: MyTodo },
  { key: 'posts', label: '我的帖子', icon: 'fa-regular fa-file-lines', component: MyPosts },
  { key: 'applications', label: '我的申请', icon: 'fa-regular fa-paste', component: MyApplications },
  { key: 'basic-info', label: '基本信息', icon: 'fa-regular fa-address-card', component: BasicInfo },
  { key: 'credit-score', label: '信誉积分', icon: 'fa-regular fa-star', component: CreditScore },
  { key: 'logout', label: '退出登录', icon: 'fa-solid fa-arrow-right-from-bracket', component: null, isLogout: true }
];

const activeMenu = ref<string>((route.query.menu as string) || 'home');

const currentComponent = computed(() => {
  const item = menuItems.find(i => i.key === activeMenu.value);
  return item?.component || MyHome;
});

const showLogoutConfirmModal = ref(false);

function handleMenuClick(item: MenuItem) {
  if (item.isLogout) {
    showLogoutConfirmModal.value = true;
    return;
  }
  activeMenu.value = item.key;
  router.push({ path: '/user-center', query: { menu: item.key } });
}

function confirmLogout() {
  router.push('/login');
  showLogoutConfirmModal.value = false;
}

function closeLogoutConfirm() {
  showLogoutConfirmModal.value = false;
}

// 监听路由变化
watch(() => route.query.menu, (newMenu) => {
  if (newMenu) {
    activeMenu.value = newMenu as string;
  }
}, { immediate: true });
</script>

<style scoped>
/* Font Awesome 图标需要引入，这里假设已经全局引入 */
</style>

