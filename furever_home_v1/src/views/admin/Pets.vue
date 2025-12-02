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
            显示 {{ pendingTotal ? (currentPendingPage - 1) * PAGE_SIZE + 1 : 0 }} 到 {{ Math.min(currentPendingPage * PAGE_SIZE, pendingTotal) }} 条，共 {{ pendingTotal }} 条
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
            显示 {{ shortTermTotal ? (currentShortTermPage - 1) * PAGE_SIZE + 1 : 0 }} 到 {{ Math.min(currentShortTermPage * PAGE_SIZE, shortTermTotal) }} 条，共 {{ shortTermTotal }} 条
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
            显示 {{ longTermTotal ? (currentLongTermPage - 1) * PAGE_SIZE + 1 : 0 }} 到 {{ Math.min(currentLongTermPage * PAGE_SIZE, longTermTotal) }} 条，共 {{ longTermTotal }} 条
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import PetDetailModal from '../../components/admin/PetDetailModal.vue';
import ApproveModal from '../../components/admin/ApproveModal.vue';
import RejectModal from '../../components/admin/RejectModal.vue';
import DeleteSuccessModal from '../../components/admin/DeleteSuccessModal.vue';
import ConfirmModal from '../../components/admin/ConfirmModal.vue';
import {
  getPendingShortAnimals,
  getShortAnimals,
  getLongAnimals,
  getAnimalDetail,
  approveAnimal,
  rejectAnimal,
  deleteAnimal as deleteAnimalApi,
  getDashboardStatistics,
  type AdminAnimalSummaryDto,
  type AdminAnimalDetailDto
} from '../../api/adminApi';

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

// 统计数据来自后端
const stats = ref({
  shortTerm: 0,
  longTerm: 0,
  pending: 0
});

// 宠物数据来自后端
const pendingPets = ref<Pet[]>([]);
const pendingTotal = ref(0);
const shortTermPets = ref<Pet[]>([]);
const shortTermTotal = ref(0);
const longTermPets = ref<Pet[]>([]);
const longTermTotal = ref(0);

const loadingPending = ref(false);
const loadingShortTerm = ref(false);
const loadingLongTerm = ref(false);

// 后端分页，前端仅做搜索过滤
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

const totalPendingPages = computed(() => Math.ceil(pendingTotal.value / PAGE_SIZE));
const totalShortTermPages = computed(() => Math.ceil(shortTermTotal.value / PAGE_SIZE));
const totalLongTermPages = computed(() => Math.ceil(longTermTotal.value / PAGE_SIZE));

const paginatedPendingPets = computed(() => filteredPendingPets.value);
const paginatedShortTermPets = computed(() => filteredShortTermPets.value);
const paginatedLongTermPets = computed(() => filteredLongTermPets.value);

// 将后端 AdminAnimalSummaryDto 映射到前端展示用 Pet
function mapAnimalToPet(item: AdminAnimalSummaryDto, petType: 'shortTerm' | 'longTerm'): Pet {
  const createdAt = item.createdAt
    ? typeof item.createdAt === 'string'
      ? new Date(item.createdAt).toLocaleString('zh-CN')
      : new Date(item.createdAt).toLocaleString('zh-CN')
    : '';
  return {
    id: item.animalId ?? 0,
    name: item.animalName ?? '',
    category: `${item.species ?? ''}  ${item.breed ?? ''}`.trim(),
    publisher: item.ownerName ?? '未知发布者',
    publishedAt: createdAt,
    adopterName: item.ownerName,
    adopterAvatar: item.ownerName?.charAt(0) || '未',
    petType
  };
}

// 加载统计数据
async function loadStats() {
  try {
    const res = await getDashboardStatistics();
    if ((res.code === 0 || res.code === 200) && res.data) {
      stats.value = {
        shortTerm: res.data.shortTermPetCount ?? 0,
        longTerm: res.data.longTermPetCount ?? 0,
        pending: res.data.pendingPetCount ?? 0
      };
    }
  } catch (error) {
    console.error('获取统计数据异常', error);
  }
}

// 加载待审核宠物列表
// 注意：后端只有 pending-short 接口，返回待审核的短期宠物列表
async function loadPendingPets() {
  try {
    loadingPending.value = true;
    const shortRes = await getPendingShortAnimals({
      page: currentPendingPage.value,
      pageSize: PAGE_SIZE,
      keyword: pendingSearch.value || undefined
    });
    
    const pendingList = (shortRes.code === 0 || shortRes.code === 200) && shortRes.data
      ? (shortRes.data.list || shortRes.data.records || []).map(item => mapAnimalToPet(item, 'shortTerm'))
      : [];
    
    pendingPets.value = pendingList;
    pendingTotal.value = shortRes.data?.total ?? 0;
  } catch (error) {
    console.error('获取待审核宠物列表异常', error);
  } finally {
    loadingPending.value = false;
  }
}

// 加载已发布短期宠物列表
async function loadShortTermPets() {
  try {
    loadingShortTerm.value = true;
    const res = await getShortAnimals({
      page: currentShortTermPage.value,
      pageSize: PAGE_SIZE,
      keyword: shortTermSearch.value || undefined
    });
    if ((res.code === 0 || res.code === 200) && res.data) {
      const list = res.data.list || res.data.records || [];
      shortTermPets.value = list.map(item => mapAnimalToPet(item, 'shortTerm'));
      shortTermTotal.value = res.data.total ?? list.length;
    }
  } catch (error) {
    console.error('获取短期宠物列表异常', error);
  } finally {
    loadingShortTerm.value = false;
  }
}

// 加载已发布长期宠物列表
async function loadLongTermPets() {
  try {
    loadingLongTerm.value = true;
    const res = await getLongAnimals({
      page: currentLongTermPage.value,
      pageSize: PAGE_SIZE,
      keyword: longTermSearch.value || undefined
    });
    if ((res.code === 0 || res.code === 200) && res.data) {
      const list = res.data.list || res.data.records || [];
      longTermPets.value = list.map(item => mapAnimalToPet(item, 'longTerm'));
      longTermTotal.value = res.data.total ?? list.length;
    }
  } catch (error) {
    console.error('获取长期宠物列表异常', error);
  } finally {
    loadingLongTerm.value = false;
  }
}

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

async function handleViewDetail(pet: Pet) {
  try {
    const res = await getAnimalDetail(pet.id);
    if ((res.code === 0 || res.code === 200) && res.data) {
      const data = res.data;
      selectedPet.value = {
        id: data.animalId ?? pet.id,
        name: data.animalName ?? pet.name,
        category: `${data.species ?? ''}  ${data.breed ?? ''}`.trim() || pet.category,
        publisher: data.ownerName ?? pet.publisher,
        publishedAt: data.createdAt
          ? typeof data.createdAt === 'string'
            ? new Date(data.createdAt).toLocaleString('zh-CN')
            : new Date(data.createdAt).toLocaleString('zh-CN')
          : pet.publishedAt,
        adopterName: data.ownerName,
        adopterAvatar: data.ownerName?.charAt(0) || '未',
        petType: pet.petType
      };
      showPetDetailModal.value = true;
    } else {
      selectedPet.value = pet;
      showPetDetailModal.value = true;
    }
  } catch (error) {
    console.error('获取宠物详情异常', error);
    selectedPet.value = pet;
    showPetDetailModal.value = true;
  }
}

function handleDelete(pet: Pet) {
  selectedPet.value = pet;
  confirmAction.value = 'delete';
  showConfirmModal.value = true;
}

async function onConfirmModalConfirm() {
  if (!selectedPet.value || !confirmAction.value) return;
  
  showConfirmModal.value = false;
  
  try {
    if (confirmAction.value === 'approve') {
      // 审核通过
      const res = await approveAnimal(selectedPet.value.id, { animalId: selectedPet.value.id });
      if (res.code === 0 || res.code === 200) {
        showApproveModal.value = true;
        if (activeTab.value === 'pending') {
          await loadPendingPets();
          await loadStats();
        }
      } else {
        alert(res.message || '审核通过失败');
      }
    } else if (confirmAction.value === 'reject') {
      // 审核拒绝
      const reason = prompt('请输入拒绝原因（可选）:') || '';
      const res = await rejectAnimal(selectedPet.value.id, { animalId: selectedPet.value.id, reason });
      if (res.code === 0 || res.code === 200) {
        showRejectModal.value = true;
        if (activeTab.value === 'pending') {
          await loadPendingPets();
          await loadStats();
        }
      } else {
        alert(res.message || '审核拒绝失败');
      }
    } else if (confirmAction.value === 'delete') {
      // 删除宠物
      const res = await deleteAnimalApi(selectedPet.value.id);
      if (res.code === 0 || res.code === 200) {
        showDeleteSuccessModal.value = true;
        if (activeTab.value === 'shortTerm') {
          await loadShortTermPets();
        } else if (activeTab.value === 'longTerm') {
          await loadLongTermPets();
        }
        await loadStats();
      } else {
        alert(res.message || '删除失败');
      }
    }
  } catch (error: any) {
    console.error('操作失败', error);
    alert(error?.message || '操作失败，请稍后重试');
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
  
  // 加载统计数据
  loadStats();
  
  // 根据当前标签页加载数据
  if (activeTab.value === 'pending') {
    loadPendingPets();
  } else if (activeTab.value === 'shortTerm') {
    loadShortTermPets();
  } else if (activeTab.value === 'longTerm') {
    loadLongTermPets();
  }
});

// 监听分页变化
watch(currentPendingPage, () => {
  if (activeTab.value === 'pending') {
    loadPendingPets();
  }
});

watch(currentShortTermPage, () => {
  if (activeTab.value === 'shortTerm') {
    loadShortTermPets();
  }
});

watch(currentLongTermPage, () => {
  if (activeTab.value === 'longTerm') {
    loadLongTermPets();
  }
});

// 监听标签页切换
watch(activeTab, (value) => {
  if (value === 'pending') {
    currentPendingPage.value = 1;
    loadPendingPets();
  } else if (value === 'shortTerm') {
    currentShortTermPage.value = 1;
    loadShortTermPets();
  } else if (value === 'longTerm') {
    currentLongTermPage.value = 1;
    loadLongTermPets();
  }
});

// 监听搜索关键词变化（防抖）
let pendingSearchTimer: number | undefined;
watch(pendingSearch, () => {
  if (pendingSearchTimer) clearTimeout(pendingSearchTimer);
  pendingSearchTimer = window.setTimeout(() => {
    if (activeTab.value === 'pending') {
      currentPendingPage.value = 1;
      loadPendingPets();
    }
  }, 500);
});

let shortTermSearchTimer: number | undefined;
watch(shortTermSearch, () => {
  if (shortTermSearchTimer) clearTimeout(shortTermSearchTimer);
  shortTermSearchTimer = window.setTimeout(() => {
    if (activeTab.value === 'shortTerm') {
      currentShortTermPage.value = 1;
      loadShortTermPets();
    }
  }, 500);
});

let longTermSearchTimer: number | undefined;
watch(longTermSearch, () => {
  if (longTermSearchTimer) clearTimeout(longTermSearchTimer);
  longTermSearchTimer = window.setTimeout(() => {
    if (activeTab.value === 'longTerm') {
      currentLongTermPage.value = 1;
      loadLongTermPets();
    }
  }, 500);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>

