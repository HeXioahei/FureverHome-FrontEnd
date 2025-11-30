<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-[-0.033em]">管理宠物</h1>
    </header>
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-[#181C25] rounded-xl border border-gray-100 dark:border-gray-800 p-5">
        <p class="text-sm text-gray-500 dark:text-gray-400">短期宠物</p>
        <div class="flex items-end justify-between">
          <h3 class="text-3xl font-semibold text-[#111318] dark:text-white">{{ stats.shortTerm }}</h3>
        </div>
      </div>
      <div class="bg-white dark:bg-[#181C25] rounded-xl border border-gray-100 dark:border-gray-800 p-5">
        <p class="text-sm text-gray-500 dark:text-gray-400">长期宠物</p>
        <div class="flex items-end justify-between">
          <h3 class="text-3xl font-semibold text-[#111318] dark:text-white">{{ stats.longTerm }}</h3>
        </div>
      </div>
      <div class="bg-white dark:bg-[#181C25] rounded-xl border border-gray-100 dark:border-gray-800 p-5">
        <p class="text-sm text-gray-500 dark:text-gray-400">待审核短期</p>
        <div class="flex items-end justify-between">
          <h3 class="text-3xl font-semibold text-[#111318] dark:text-white">{{ stats.pending }}</h3>
        </div>
      </div>
    </section>
    <section class="bg-white dark:bg-[#181C25] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div class="flex flex-wrap border-b border-gray-100 dark:border-gray-800 text-sm font-medium">
        <button
          class="py-4 px-6 transition-colors"
          :class="activeTab === 'pending' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 border-b-2 border-transparent hover:text-primary'"
          @click="activeTab = 'pending'"
        >
          待审核的宠物列表
        </button>
        <button
          class="py-4 px-6 transition-colors"
          :class="activeTab === 'shortTerm' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 border-b-2 border-transparent hover:text-primary'"
          @click="activeTab = 'shortTerm'"
        >
          已发布的短期宠物列表
        </button>
        <button
          class="py-4 px-6 transition-colors"
          :class="activeTab === 'longTerm' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 border-b-2 border-transparent hover:text-primary'"
          @click="activeTab = 'longTerm'"
        >
          已发布的长期宠物列表
        </button>
      </div>

      <!-- 待审核宠物 -->
      <div v-if="activeTab === 'pending'" class="pet-tab">
        <div class="p-5 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <div class="relative">
            <input
              v-model="pendingSearch"
              type="text"
              placeholder="搜索宠物..."
              class="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5 p-5">
          <div
            v-for="pet in paginatedPendingPets"
            :key="pet.id"
            class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1C202B] shadow-sm p-5 flex flex-col gap-4"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700">#{{ pet.id }}</span>
              <span 
                v-if="pet.petType"
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="pet.petType === 'shortTerm' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'"
              >
                {{ pet.petType === 'shortTerm' ? '短期' : '长期' }}
              </span>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 w-full h-28 flex items-center justify-center text-blue-600 dark:text-blue-200 text-sm font-semibold">
              {{ pet.name }} 的照片
            </div>
            <div class="flex items-center gap-3">
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ pet.name }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ pet.category }}</p>
              </div>
            </div>
            <!-- <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div class="size-7 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 flex items-center justify-center text-xs font-medium shrink-0">
                {{ pet.adopterAvatar || pet.publisher?.charAt(0) || '领' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-900 dark:text-white font-medium truncate">{{ pet.adopterName || pet.publisher || '未知领养者' }}</p>
              </div>
            </div> -->
            <div class="text-xs text-gray-600 dark:text-gray-400 space-y-2">
              <div class="flex items-center gap-2">
                <p class="text-gray-500 dark:text-gray-400">领养者：</p>
                <!-- <p class="text-gray-900 dark:text-white font-medium">{{ pet.adopterName || pet.publisher }}</p> -->
                <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div class="size-7 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 flex items-center justify-center text-xs font-medium shrink-0">
                    {{ pet.adopterAvatar || pet.publisher?.charAt(0) || '领' }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-gray-900 dark:text-white font-medium truncate">{{ pet.adopterName || pet.publisher || '未知领养者' }}</p>
                  </div>
                </div>
              </div>
              <p class="text-gray-500 dark:text-gray-400">申请时间：{{ pet.publishedAt }}</p>
            </div>
            <div class="flex items-center gap-2 justify-end">
              <button
                title="审核通过"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30"
                @click="handleApprove(pet)"
              >
                <span class="material-symbols-outlined">check</span>
              </button>
              <button
                title="审核不通过"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                @click="handleReject(pet)"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
              <button
                title="查看详情"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                @click="handleViewDetail(pet)"
              >
                <span class="material-symbols-outlined">visibility</span>
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 p-5">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            显示 {{ pendingPets.length ? (currentPendingPage - 1) * PAGE_SIZE + 1 : 0 }} 到 {{ Math.min(currentPendingPage * PAGE_SIZE, pendingPets.length) }} 条，共 {{ pendingPets.length }} 条
          </p>
          <div class="flex gap-2">
            <button
              :disabled="currentPendingPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentPendingPage--"
            >
              上一页
            </button>
            <button
              v-for="page in totalPendingPages"
              :key="page"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm transition-colors"
              :class="page === currentPendingPage ? 'bg-primary text-white border-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
              @click="currentPendingPage = page"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPendingPage === totalPendingPages"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentPendingPage++"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      <!-- 已发布短期宠物 -->
      <div v-if="activeTab === 'shortTerm'" class="pet-tab">
        <div class="p-5 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <div class="relative">
            <input
              v-model="shortTermSearch"
              type="text"
              placeholder="搜索短期宠物..."
              class="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5 p-5">
          <div
            v-for="pet in paginatedShortTermPets"
            :key="pet.id"
            class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1C202B] shadow-sm p-5 flex flex-col gap-4"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">#{{ pet.id }}</span>
              <span 
                v-if="pet.petType"
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="pet.petType === 'shortTerm' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'"
              >
                {{ pet.petType === 'shortTerm' ? '短期' : '长期' }}
              </span>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 w-full h-28 flex items-center justify-center text-blue-600 dark:text-blue-200 text-sm font-semibold">
              {{ pet.name }} 的照片
            </div>
            <div class="flex items-center gap-3">
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ pet.name }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ pet.category }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div class="size-7 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 flex items-center justify-center text-xs font-medium shrink-0">
                {{ pet.adopterAvatar || pet.publisher?.charAt(0) || '领' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-900 dark:text-white font-medium truncate">{{ pet.adopterName || pet.publisher || '未知领养者' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 justify-end">
              <button
                title="查看详情"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                @click="handleViewDetail(pet)"
              >
                <span class="material-symbols-outlined">visibility</span>
              </button>
              <button
                title="删除"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                @click="handleDelete(pet)"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 p-5">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            显示 {{ shortTermPets.length ? (currentShortTermPage - 1) * PAGE_SIZE + 1 : 0 }} 到 {{ Math.min(currentShortTermPage * PAGE_SIZE, shortTermPets.length) }} 条，共 {{ shortTermPets.length }} 条
          </p>
          <div class="flex gap-2">
            <button
              :disabled="currentShortTermPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentShortTermPage--"
            >
              上一页
            </button>
            <button
              v-for="page in totalShortTermPages"
              :key="page"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm transition-colors"
              :class="page === currentShortTermPage ? 'bg-primary text-white border-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
              @click="currentShortTermPage = page"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentShortTermPage === totalShortTermPages"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentShortTermPage++"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      <!-- 已发布长期宠物 -->
      <div v-if="activeTab === 'longTerm'" class="pet-tab">
        <div class="p-5 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <div class="relative">
            <input
              v-model="longTermSearch"
              type="text"
              placeholder="搜索长期宠物..."
              class="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5 p-5">
          <div
            v-for="pet in paginatedLongTermPets"
            :key="pet.id"
            class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1C202B] shadow-sm p-5 flex flex-col gap-4"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">#{{ pet.id }}</span>
              <span 
                v-if="pet.petType"
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="pet.petType === 'shortTerm' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'"
              >
                {{ pet.petType === 'shortTerm' ? '短期' : '长期' }}
              </span>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 w-full h-28 flex items-center justify-center text-blue-600 dark:text-blue-200 text-sm font-semibold">
              {{ pet.name }} 的照片
            </div>
            <div class="flex items-center gap-3">
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ pet.name }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ pet.category }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div class="size-7 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 flex items-center justify-center text-xs font-medium shrink-0">
                {{ pet.adopterAvatar || pet.publisher?.charAt(0) || '领' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-900 dark:text-white font-medium truncate">{{ pet.adopterName || pet.publisher || '未知领养者' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 justify-end">
              <button
                title="查看详情"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                @click="handleViewDetail(pet)"
              >
                <span class="material-symbols-outlined">visibility</span>
              </button>
              <button
                title="删除"
                class="inline-flex items-center justify-center rounded-full size-9 border border-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                @click="handleDelete(pet)"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 p-5">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            显示 {{ longTermPets.length ? (currentLongTermPage - 1) * PAGE_SIZE + 1 : 0 }} 到 {{ Math.min(currentLongTermPage * PAGE_SIZE, longTermPets.length) }} 条，共 {{ longTermPets.length }} 条
          </p>
          <div class="flex gap-2">
            <button
              :disabled="currentLongTermPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentLongTermPage--"
            >
              上一页
            </button>
            <button
              v-for="page in totalLongTermPages"
              :key="page"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm transition-colors"
              :class="page === currentLongTermPage ? 'bg-primary text-white border-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
              @click="currentLongTermPage = page"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentLongTermPage === totalLongTermPages"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentLongTermPage++"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 弹窗组件 -->
    <PetDetailModal
      :visible="showPetDetailModal"
      :pet-data="selectedPet ? {
        id: selectedPet.id,
        name: selectedPet.name,
        category: selectedPet.category.split('  ')[0],
        breed: selectedPet.category.split('  ')[1] || selectedPet.category,
        gender: '未知',
        age: '未知',
        neutered: '未知',
        description: `${selectedPet.name}的详细信息`,
        adopterName: selectedPet.adopterName || selectedPet.publisher,
        adopterAvatar: selectedPet.adopterAvatar || selectedPet.publisher?.charAt(0) || '领'
      } : undefined"
      @close="showPetDetailModal = false"
    />
    <ApproveModal
      :visible="showApproveModal"
      message="该宠物已成功通过审核并发布。"
      @close="showApproveModal = false"
      @confirm="onApproveConfirm"
    />
    <RejectModal
      :visible="showRejectModal"
      message="该宠物审核未通过，已通知发布者。"
      @close="showRejectModal = false"
      @confirm="onRejectConfirm"
    />
    <DeleteSuccessModal
      :visible="showDeleteSuccessModal"
      message="该宠物已从列表中永久移除。"
      @close="showDeleteSuccessModal = false"
      @confirm="onDeleteConfirm"
    />
    <ConfirmModal
      :visible="showConfirmModal"
      :title="confirmAction === 'approve' ? '确认审核通过' : confirmAction === 'reject' ? '确认审核不通过' : '确认删除'"
      :message="confirmAction === 'approve' ? '确定要通过该宠物的审核吗？' : confirmAction === 'reject' ? '确定要拒绝该宠物的审核吗？' : '确定要删除该宠物吗？此操作不可恢复。'"
      @confirm="onConfirmModalConfirm"
      @cancel="onConfirmModalCancel"
      @close="onConfirmModalCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PetDetailModal from '../../components/admin/PetDetailModal.vue';
import ApproveModal from '../../components/admin/ApproveModal.vue';
import RejectModal from '../../components/admin/RejectModal.vue';
import DeleteSuccessModal from '../../components/admin/DeleteSuccessModal.vue';
import ConfirmModal from '../../components/admin/ConfirmModal.vue';

interface Pet {
  id: number;
  name: string;
  category: string;
  publisher: string;
  publishedAt: string;
  adopterName?: string;
  adopterAvatar?: string;
  petType?: 'shortTerm' | 'longTerm';
}

const route = useRoute();
const PAGE_SIZE = 10;

const activeTab = ref<string>((route.query.tab as string) || 'pending');
const pendingSearch = ref('');
const shortTermSearch = ref('');
const longTermSearch = ref('');
const currentPendingPage = ref(1);
const currentShortTermPage = ref(1);
const currentLongTermPage = ref(1);

const stats = ref({
  shortTerm: 48,
  longTerm: 32,
  pending: 9
});

const namePool = ['小橘', '团团', '贝贝', '星星', '雪糕', '可可', '奶茶', '闪电', '木木', '花花'];
const categoryPool = ['猫  英短', '狗  拉布拉多', '猫  布偶', '狗  柯基', '猫  暹罗', '狗  萨摩耶'];
const publisherPool = ['何管理员', '周志愿者', '吴站长', '郑审核员', '冯老师'];

const generatePendingPets = (): Pet[] => {
  return Array.from({ length: 18 }, (_, i) => {
    const name = namePool[(i + 4) % namePool.length] || '未知';
    const category = categoryPool[(i + 5) % categoryPool.length] || '未知';
    const publisher = publisherPool[i % publisherPool.length] || '未知';
    return {
      id: 5201 + i,
      name,
      category,
      publisher,
      publishedAt: `2023-07-${(i % 20) + 1} ${9 + (i % 8)}:${(i * 5) % 60}`,
      adopterName: publisher,
      adopterAvatar: publisher.charAt(0),
      petType: (i % 2 === 0 ? 'shortTerm' : 'longTerm') as 'shortTerm' | 'longTerm'
    };
  });
};

const generateShortTermPets = (): Pet[] => {
  return Array.from({ length: 48 }, (_, i) => {
    const name = namePool[i % namePool.length] || '未知';
    const category = categoryPool[i % categoryPool.length] || '未知';
    const publisher = publisherPool[i % publisherPool.length] || '未知';
    return {
      id: 5001 + i,
      name,
      category,
      publisher,
      publishedAt: `2023-0${(i % 6) + 1}-${(i % 28) + 1} ${8 + (i % 10)}:${(i * 7) % 60}`,
      adopterName: publisher,
      adopterAvatar: publisher.charAt(0),
      petType: 'shortTerm' as 'shortTerm' | 'longTerm'
    };
  });
};

const generateLongTermPets = (): Pet[] => {
  return Array.from({ length: 32 }, (_, i) => {
    const name = namePool[i % namePool.length] || '未知';
    const category = categoryPool[i % categoryPool.length] || '未知';
    const publisher = publisherPool[i % publisherPool.length] || '未知';
    return {
      id: 3001 + i,
      name,
      category,
      publisher,
      publishedAt: `2023-0${(i % 6) + 1}-${(i % 28) + 1} ${8 + (i % 10)}:${(i * 7) % 60}`,
      adopterName: publisher,
      adopterAvatar: publisher.charAt(0),
      petType: 'longTerm' as 'shortTerm' | 'longTerm'
    };
  });
};

const pendingPets = ref<Pet[]>(generatePendingPets());
const shortTermPets = ref<Pet[]>(generateShortTermPets());
const longTermPets = ref<Pet[]>(generateLongTermPets());

const filteredPendingPets = computed(() => {
  if (!pendingSearch.value) return pendingPets.value;
  const search = pendingSearch.value.toLowerCase();
  return pendingPets.value.filter(
    pet => pet.name.toLowerCase().includes(search) ||
            pet.category.toLowerCase().includes(search) ||
            pet.publisher.toLowerCase().includes(search)
  );
});

const filteredShortTermPets = computed(() => {
  if (!shortTermSearch.value) return shortTermPets.value;
  const search = shortTermSearch.value.toLowerCase();
  return shortTermPets.value.filter(
    pet => pet.name.toLowerCase().includes(search) ||
            pet.category.toLowerCase().includes(search) ||
            pet.publisher.toLowerCase().includes(search)
  );
});

const filteredLongTermPets = computed(() => {
  if (!longTermSearch.value) return longTermPets.value;
  const search = longTermSearch.value.toLowerCase();
  return longTermPets.value.filter(
    pet => pet.name.toLowerCase().includes(search) ||
            pet.category.toLowerCase().includes(search) ||
            pet.publisher.toLowerCase().includes(search)
  );
});

const totalPendingPages = computed(() => Math.ceil(filteredPendingPets.value.length / PAGE_SIZE));
const totalShortTermPages = computed(() => Math.ceil(filteredShortTermPets.value.length / PAGE_SIZE));
const totalLongTermPages = computed(() => Math.ceil(filteredLongTermPets.value.length / PAGE_SIZE));

const paginatedPendingPets = computed(() => {
  const start = (currentPendingPage.value - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return filteredPendingPets.value.slice(start, end);
});

const paginatedShortTermPets = computed(() => {
  const start = (currentShortTermPage.value - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return filteredShortTermPets.value.slice(start, end);
});

const paginatedLongTermPets = computed(() => {
  const start = (currentLongTermPage.value - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return filteredLongTermPets.value.slice(start, end);
});

// 弹窗状态
const showPetDetailModal = ref(false);
const showApproveModal = ref(false);
const showRejectModal = ref(false);
const showDeleteSuccessModal = ref(false);
const showConfirmModal = ref(false);
const confirmAction = ref<'approve' | 'reject' | 'delete' | null>(null);
const selectedPet = ref<Pet | null>(null);

function handleApprove(pet: Pet) {
  selectedPet.value = pet;
  confirmAction.value = 'approve';
  showConfirmModal.value = true;
}

function handleReject(pet: Pet) {
  selectedPet.value = pet;
  confirmAction.value = 'reject';
  showConfirmModal.value = true;
}

function handleViewDetail(pet: Pet) {
  selectedPet.value = pet;
  showPetDetailModal.value = true;
}

function handleDelete(pet: Pet) {
  selectedPet.value = pet;
  confirmAction.value = 'delete';
  showConfirmModal.value = true;
}

function onConfirmModalConfirm() {
  if (!selectedPet.value || !confirmAction.value) return;
  
  showConfirmModal.value = false;
  
  // 执行操作
  if (confirmAction.value === 'approve') {
    // TODO: 调用API审核通过
    console.log('审核通过:', selectedPet.value);
    showApproveModal.value = true;
  } else if (confirmAction.value === 'reject') {
    // TODO: 调用API审核拒绝
    console.log('审核拒绝:', selectedPet.value);
    showRejectModal.value = true;
  } else if (confirmAction.value === 'delete') {
    // TODO: 调用API删除
    // 从列表中移除
    if (activeTab.value === 'pending') {
      const index = pendingPets.value.findIndex(p => p.id === selectedPet.value!.id);
      if (index > -1) pendingPets.value.splice(index, 1);
    } else if (activeTab.value === 'shortTerm') {
      const index = shortTermPets.value.findIndex(p => p.id === selectedPet.value!.id);
      if (index > -1) shortTermPets.value.splice(index, 1);
    } else {
      const index = longTermPets.value.findIndex(p => p.id === selectedPet.value!.id);
      if (index > -1) longTermPets.value.splice(index, 1);
    }
    showDeleteSuccessModal.value = true;
  }
}

function onConfirmModalCancel() {
  showConfirmModal.value = false;
  confirmAction.value = null;
}

function onApproveConfirm() {
  showApproveModal.value = false;
  selectedPet.value = null;
  confirmAction.value = null;
}

function onRejectConfirm() {
  showRejectModal.value = false;
  selectedPet.value = null;
  confirmAction.value = null;
}

function onDeleteConfirm() {
  showDeleteSuccessModal.value = false;
  selectedPet.value = null;
  confirmAction.value = null;
}

onMounted(() => {
  if (route.query.tab) {
    activeTab.value = route.query.tab as string;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>

