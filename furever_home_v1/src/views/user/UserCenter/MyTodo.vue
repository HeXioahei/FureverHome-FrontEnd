<template>
  <div>
    <h2 class="text-2xl font-bold mb-5" style="color: #111;">我的待办</h2>

    <div v-if="todos.length" class="flex flex-col gap-5">
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

    <div v-else class="mt-8 text-center text-sm" style="color: #9CA3AF;">
      当前没有待办事项
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SuccessModal from '../../../components/common/SuccessModal.vue';
import ErrorModal from '../../../components/common/ErrorModal.vue';
import ConfirmModal from '../../../components/common/ConfirmModal.vue';
import ApplicationDetailModal from '../../../components/common/ApplicationDetailModal.vue';
import { getMyAdoptTodoList } from '@/api/adoptApi';

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

const todos = ref<Todo[]>([]);

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

async function loadTodos() {
  try {
    const res = await getMyAdoptTodoList();
    if (res.code === 200 && Array.isArray(res.data)) {
      todos.value = res.data.map((item: any, index: number) => {
        const id = item.id ?? index + 1;
        const requester = item.requesterName || item.applicantName || item.userName || '未知申请人';
        const petName = item.petName || item.animalName || '';
        const createdAt = item.createTime || item.createdAt || item.applyTime || '';
        const reason = item.reason || item.applyReason || item.remark || '';
        return {
          id,
          type: '领养申请',
          typeIcon: 'fa-solid fa-heart',
          date: createdAt,
          title: petName ? `对"${petName}"的领养申请` : '领养申请',
          requester,
          requesterId: item.applicantId || item.userId || undefined,
          reason,
          showConfirm: true,
          showReject: true,
          phone: item.phone || item.contactPhone,
          email: item.email || item.contactEmail,
          address: item.address || item.location,
          petName
        } as Todo;
      });
    } else {
      console.error('获取待办列表失败', res);
    }
  } catch (err) {
    console.error('获取待办列表接口异常', err);
  }
}

onMounted(() => {
  loadTodos();
});
</script>

<style scoped>
</style>

