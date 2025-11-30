<template>
  <div>
    <h2 class="text-2xl font-bold mb-5" style="color: #111;">我的待办</h2>

    <div class="flex flex-col gap-5">
      <div 
        v-for="todo in todos" 
        :key="todo.id"
        class="bg-white rounded-xl p-6 shadow-sm border-l-4"
        style="border-left-color: #FF8C00;"
      >
        <div class="flex justify-between mb-4 pb-4 border-b border-gray-100">
          <div class="flex items-center gap-2 text-sm font-bold" style="color: #FF8C00;">
            <i :class="todo.typeIcon"></i>
            <span>{{ todo.type }}</span>
          </div>
          <div class="text-xs" style="color: #9CA3AF;">{{ todo.date }}</div>
        </div>

        <div class="flex flex-col gap-4 mb-5 cursor-pointer" @click="handleViewDetail(todo)">
          <div class="flex-1">
            <div class="text-base font-bold mb-2.5" style="color: #1F2937;">{{ todo.title }}</div>
            
            <div class="flex items-center gap-2 mb-3 text-sm" style="color: #333;">
              <span class="font-normal">申请人：</span>
              <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-0.5">
                <i class="fa-regular fa-circle"></i>
              </div>
              <span 
                class="font-bold cursor-pointer transition-colors hover:text-[#FF8C00]" 
                style="color: #111;"
                @click.stop="router.push({ name: 'UserProfile', params: { userId: todo.requesterId || 1 } })"
              >
                {{ todo.requester }}
              </span>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg text-xs leading-relaxed" style="color: #4B5563;">
              {{ todo.reason }}
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2.5">
          <button 
            v-if="todo.showConfirm"
            class="px-5 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors hover:opacity-90"
            style="background-color: #FF8C00; color: white;"
            @click="handleConfirm(todo)"
          >
            同意领养
          </button>
          <button 
            class="px-5 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors border border-gray-300 hover:border-[#FF8C00] hover:text-[#FF8C00]"
            style="background-color: white; color: #333;"
            @click="handleContact(todo)"
          >
            联系申请人
          </button>
          <button 
            v-if="todo.showReject"
            class="px-5 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors hover:bg-red-100"
            style="background-color: #FEF2F2; color: #EF4444;"
            @click="handleReject(todo)"
          >
            婉拒
          </button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-10 mb-5">
      <div class="flex gap-2.5">
        <button 
          v-for="page in 4" 
          :key="page"
          class="w-11 h-11 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
          :class="page === 1 ? 'bg-[#E67E22] text-white border-[#E67E22]' : 'text-gray-600'"
          style="color: #6B7280;"
        >
          {{ page }}
        </button>
        <button 
          class="px-5 h-11 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
          style="color: #6B7280;"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 成功弹窗 -->
    <SuccessModal
      :visible="showSuccessModal"
      title="操作成功"
      :message="successMessage"
      @close="closeSuccessModal"
    />

    <!-- 错误/提示弹窗 -->
    <ErrorModal
      :visible="showErrorModal"
      title="提示"
      :message="errorMessage"
      @close="closeErrorModal"
    />

    <!-- 确认弹窗 - 同意申请 -->
    <ConfirmModal
      :visible="showConfirmModal"
      title="确认操作"
      :message="confirmMessage"
      @confirm="onConfirmConfirm"
      @cancel="showConfirmModal = false; currentTodo = null"
    />

    <!-- 确认弹窗 - 婉拒申请 -->
    <ConfirmModal
      :visible="showRejectModal"
      title="确认操作"
      :message="confirmMessage"
      @confirm="onRejectConfirm"
      @cancel="showRejectModal = false; currentTodo = null"
    />

    <!-- 申请详情弹窗 -->
    <ApplicationDetailModal
      v-if="currentTodo"
      :visible="showApplicationDetailModal"
      :application="currentTodo"
      @close="closeApplicationDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SuccessModal from '../../../components/common/SuccessModal.vue';
import ErrorModal from '../../../components/common/ErrorModal.vue';
import ConfirmModal from '../../../components/common/ConfirmModal.vue';
import ApplicationDetailModal from '../../../components/common/ApplicationDetailModal.vue';

const router = useRouter();

interface Todo {
  id: number;
  type: string;
  typeIcon: string;
  date: string;
  title: string;
  requester: string;
  requesterId?: number;
  reason: string;
  showConfirm: boolean;
  showReject: boolean;
  // 申请详情相关字段
  phone?: string;
  email?: string;
  address?: string;
  petName?: string;
}

const todos = ref<Todo[]>([
  {
    id: 1,
    type: '领养申请',
    typeIcon: 'fa-solid fa-heart',
    date: '2024-01-15 14:30',
    title: '对"巴迪"的领养申请',
    requester: '张同学',
    requesterId: 2,
    reason: '我是一名大学生，有稳定的住所和充足的时间照顾宠物。之前有养过金毛犬的经验，对狗狗的护理和训练都有一定了解。希望能给巴迪一个温暖的家。',
    showConfirm: true,
    showReject: true,
    phone: '138-****-2640',
    email: 'zhang@example.com',
    address: '上海市徐汇区桂林路 188 弄',
    petName: '巴迪'
  },
  {
    id: 2,
    type: '领养申请',
    typeIcon: 'fa-solid fa-heart',
    date: '2024-01-14 10:20',
    title: '对"米洛"的领养申请',
    requester: '王同学',
    requesterId: 3,
    reason: '家里已经有一只猫咪，想再领养一只作伴。有丰富的养猫经验，会定期带猫咪体检和打疫苗。',
    showConfirm: true,
    showReject: true,
    phone: '139-****-5678',
    email: 'wang@example.com',
    address: '北京市海淀区中关村大街 1 号',
    petName: '米洛'
  }
]);

const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const showConfirmModal = ref(false);
const showRejectModal = ref(false);
const showApplicationDetailModal = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const currentTodo = ref<Todo | null>(null);
const confirmMessage = ref('');

function handleConfirm(todo: Todo) {
  currentTodo.value = todo;
  confirmMessage.value = `确定同意${todo.requester}的领养申请吗？`;
  showConfirmModal.value = true;
}

function handleViewDetail(todo: Todo) {
  currentTodo.value = todo;
  showApplicationDetailModal.value = true;
}

function handleContact(todo: Todo) {
  // 跳转到沟通对接页面，并传递申请人ID
  router.push({ 
    name: 'Communication', 
    query: { userId: todo.requesterId || 1 } 
  });
}

function closeApplicationDetailModal() {
  showApplicationDetailModal.value = false;
  currentTodo.value = null;
}

function handleReject(todo: Todo) {
  currentTodo.value = todo;
  confirmMessage.value = `确定要婉拒${todo.requester}的领养申请吗？`;
  showRejectModal.value = true;
}

function onConfirmConfirm() {
  if (currentTodo.value) {
    successMessage.value = '已同意领养申请';
    showSuccessModal.value = true;
    // 这里可以调用API更新状态
  }
  showConfirmModal.value = false;
  currentTodo.value = null;
}

function onRejectConfirm() {
  if (currentTodo.value) {
    successMessage.value = '已婉拒申请';
    showSuccessModal.value = true;
    // 这里可以调用API更新状态
  }
  showRejectModal.value = false;
  currentTodo.value = null;
}

function closeSuccessModal() {
  showSuccessModal.value = false;
}

function closeErrorModal() {
  showErrorModal.value = false;
}
</script>

<style scoped>
</style>

