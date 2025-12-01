<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2" style="color: #111;">我的宠物</h2>
      <p class="text-sm" style="color: #666666;">查看并管理您发布的短期与长期宠物。</p>
    </div>

    <div class="flex items-center gap-3 mb-6">
      <button
        class="px-6 py-2.5 rounded-full text-smfont-medium border transition-all"
        :class="activeTab === 'short'
          ? 'text-white border-transparent'
          : 'text-gray-700 border-gray-300 bg-white hover:border-[#FF8C00] hover:text-[#FF8C00]'"
        :style="activeTab === 'short' ? 'background-color: #FF8C00;' : ''"
        @click="switchTab('short')"
      >
        短期宠物
      </button>
      <button
        class="px-6 py-2.5 rounded-full text-sm font-medium border transition-all"
        :class="activeTab === 'long'
          ? 'text-white border-transparent'
          : 'text-gray-700 border-gray-300 bg-white hover:border-[#FF8C00] hover:text-[#FF8C00]'"
        :style="activeTab === 'long' ? 'background-color: #FF8C00;' : ''"
        @click="switchTab('long')"
      >
        长期宠物
      </button>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <div
        v-for="pet in currentPets"
        :key="pet.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border cursor-pointer"
        style="border-color: #F3F4F6;"
        @click="viewDetail(pet)"
      >
        <div class="relative h-48 bg-[#FFEFD5]">
          <img
            v-if="pet.cover"
            :src="pet.cover"
            :alt="pet.name"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center text-sm"
            style="color: #C97A30;"
          >
            {{ pet.photoText }}
          </div>
        </div>

        <div class="px-5 py-4 flex flex-col gap-3">
          <div>
            <div class="text-base font-bold hover:underline" style="color: #FF8C00;">
              {{ pet.name }}
            </div>
            <div class="text-xs mt-1" style="color: #666666;">
              {{ pet.meta }}
            </div>
          </div>

          <div class="flex items-center justify-between">
            <button
              class="px-4 py-1.5 rounded-full text-xs font-medium border border-transparent cursor-pointer transition-all"
              :style="pet.type === 'short'
                ? 'background-color: #FFEDD5; color: #C05621;'
                : 'background-color: #FEF9C3; color: #854D0E;'"
              @click.stop
            >
              {{ pet.type === 'short' ? '短期领养' : '长期领养' }}
            </button>
            <div class="flex items-center gap-3 text-lg" style="color: #9CA3AF;">
              <button
                class="w-8 h-8 rounded-full flex items-center justify-center border border-transparent bg-white cursor-pointer hover:border-[#FF8C00] hover:text-[#FF8C00] transition-all"
                @click.stop="handleEdit(pet)"
              >
                <i class="fa-regular fa-pen-to-square text-sm"></i>
              </button>
              <button
                class="w-8 h-8 rounded-full flex items-center justify-center border border-transparent bg-white cursor-pointer hover:border-[#EF4444] hover:text-[#EF4444] transition-all"
                @click.stop="handleDelete(pet)"
              >
                <i class="fa-regular fa-trash-can text-sm"></i>
              </button>
            </div>
          </div>

          <div class="text-xs pt-3 border-t" style="color: #9CA3AF; border-color: #F3F4F6;">
            {{ pet.footerText }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-10 mb-4">
      <div class="flex items-center gap-2.5">
        <button
          class="w-9 h-9 rounded-lg border bg-white text-xs flex items-center justify-center cursor-pointer transition-all"
          style="border-color: #E5E7EB; color: #6B7280;"
          :disabled="currentPage === 1"
          :class="currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:border-[#FF8C00] hover:text-[#FF8C00]'"
          @click="goPrev"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          class="w-9 h-9 rounded-lg border text-xs flex items-center justify-center cursor-pointer transition-all"
          :style="page === currentPage
            ? 'background-color: #FF8C00; border-color: #FF8C00; color: #FFFFFF;'
            : 'background-color: #FFFFFF; border-color: #E5E7EB; color: #4B5563;'"
          @click="goPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="w-9 h-9 rounded-lg border bg-white text-xs flex items-center justify-center cursor-pointer transition-all"
          style="border-color: #E5E7EB; color: #6B7280;"
          :disabled="currentPage === totalPages"
          :class="currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:border-[#FF8C00] hover:text-[#FF8C00]'"
          @click="goNext"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 z-[3000] flex items-start justify-center overflow-y-auto px-4 py-10"
    >
      <div class="bg-white rounded-2xl w-full max-w-3xl shadow-2xl p-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-2xl font-bold text-[#333333]">编辑宠物信息</h3>
            <p class="text-sm text-[#9CA3AF]">根据发布宠物页的字段样式进行修改</p>
          </div>
          <button class="text-[#9CA3AF] hover:text-[#FF8C00]" @click="cancelEdit">
            <i class="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <div class="space-y-8">
          <section class="pb-5 border-b border-[#E5E7EB]">
            <h4 class="text-lg font-semibold mb-4 flex items-center gap-2 text-[#333333]">
              <i class="fa-solid fa-paw text-[#FF8C00]"></i>
              宠物基本信息
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div v-for="field in basicFields" :key="field.key">
                <label class="block mb-2 text-sm font-semibold text-[#666666]">
                  {{ field.label }}
                  <span v-if="field.required" class="text-[#EF4444]">*</span>
                </label>
                <input
                  v-if="field.type === 'text'"
                  v-model="editForm[field.key]"
                  :placeholder="field.placeholder"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm focus:border-[#FF8C00] focus:outline-none"
                />
                <select
                  v-else
                  v-model="editForm[field.key]"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm focus:border-[#FF8C00] focus:outline-none"
                >
                  <option value="">请选择</option>
                  <option v-for="option in field.options" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </div>
            </div>
          </section>

          <section class="pb-5 border-b border-[#E5E7EB]">
            <h4 class="text-lg font-semibold mb-4 flex items-center gap-2 text-[#333333]">
              <i class="fa-solid fa-book text-[#FF8C00]"></i>
              详细描述
            </h4>
            <textarea
              v-model="editForm.story"
              placeholder="请详细描述救助背景、健康状态及注意事项"
              class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm min-h-[120px] resize-y focus:border-[#FF8C00] focus:outline-none"
            ></textarea>
          </section>

          <section class="pb-5 border-b border-[#E5E7EB]">
            <h4 class="text-lg font-semibold mb-4 flex items-center gap-2 text-[#333333]">
              <i class="fa-solid fa-address-book text-[#FF8C00]"></i>
              联系信息
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block mb-2 text-sm font-semibold text-[#666666]">
                  联系电话 <span class="text-[#EF4444]">*</span>
                </label>
                <input
                  v-model="editForm.phone"
                  type="tel"
                  placeholder="13812345678"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm focus:border-[#FF8C00] focus:outline-none"
                />
              </div>
              <div>
                <label class="block mb-2 text-sm font-semibold text-[#666666]">
                  电子邮箱 <span class="text-[#EF4444]">*</span>
                </label>
                <input
                  v-model="editForm.email"
                  type="email"
                  placeholder="user@example.com"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm focus:border-[#FF8C00] focus:outline-none"
                />
              </div>
            </div>
          </section>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            class="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-[#666666] hover:bg-gray-50"
            @click="cancelEdit"
          >
            取消
          </button>
          <button
            class="px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
            style="background-color: #FF8C00;"
            @click="submitEdit"
          >
            确认保存
          </button>
        </div>
      </div>
    </div>

    <ConfirmModal
      :visible="showDeleteConfirm"
      title="确认删除"
      message="确定要删除这条宠物信息吗？删除后将无法恢复。"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />

    <SuccessModal
      :visible="successModal.visible"
      :title="successModal.title"
      :message="successModal.message"
      @close="closeSuccessModal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmModal from '../../../components/common/ConfirmModal.vue';
import SuccessModal from '../../../components/common/SuccessModal.vue';

interface PetCard {
  id: number;
  name: string;
  meta: string;
  type: 'short' | 'long';
  days: number;
  cover: string;
  story: string;
  phone: string;
  email: string;
  gender: string;
  age: string;
  species: string;
  breed: string;
  sterilized: string;
  location: string;
}

const router = useRouter();

const shortPets = ref<PetCard[]>([
  {
    id: 1,
    name: '小黑',
    meta: '狗 · 8个月 · 未绝育',
    type: 'short',
    days: 8,
    cover: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=800&q=80',
    story: '小黑是一只活泼的校园流浪狗，目前正在寻找短期寄养家庭。',
    phone: '13812345678',
    email: 'user@example.com',
    gender: '公',
    age: '8个月',
    species: '狗',
    breed: '田园犬',
    sterilized: '否',
    location: '上海市徐汇区'
  },
  {
    id: 2,
    name: '灰灰',
    meta: '猫 · 5个月 · 已绝育',
    type: 'short',
    days: 5,
    cover: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    story: '灰灰性格温和，已经完成免疫和绝育，适合短期陪伴。',
    phone: '13812345678',
    email: 'user@example.com',
    gender: '母',
    age: '5个月',
    species: '猫',
    breed: '银渐层',
    sterilized: '是',
    location: '杭州市西湖区'
  },
  {
    id: 3,
    name: '小黄',
    meta: '狗 · 1岁 · 已绝育',
    type: 'short',
    days: 12,
    cover: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    story: '小黄已经训练良好，可以与小朋友和平相处。',
    phone: '13812345678',
    email: 'user@example.com',
    gender: '母',
    age: '1岁',
    species: '狗',
    breed: '金毛',
    sterilized: '是',
    location: '北京市朝阳区'
  }
]);

const longPets = ref<PetCard[]>([
  {
    id: 4,
    name: '大白',
    meta: '萨摩耶 · 2岁 · 已绝育',
    type: 'long',
    days: 20,
    cover: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    story: '大白活泼亲人，适合长期陪伴家庭。',
    phone: '13812345678',
    email: 'user@example.com',
    gender: '公',
    age: '2岁',
    species: '狗',
    breed: '萨摩耶',
    sterilized: '是',
    location: '南京市鼓楼区'
  },
  {
    id: 5,
    name: '咪咪',
    meta: '狸花猫 · 1岁 · 未绝育',
    type: 'long',
    days: 15,
    cover: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?auto=format&fit=crop&w=800&q=80',
    story: '咪咪喜欢安静的环境，需要一个长期稳定的家。',
    phone: '13812345678',
    email: 'user@example.com',
    gender: '母',
    age: '1岁',
    species: '猫',
    breed: '狸花猫',
    sterilized: '否',
    location: '武汉市武昌区'
  },
  {
    id: 6,
    name: '贝贝',
    meta: '金毛 · 3岁 · 已绝育',
    type: 'long',
    days: 5,
    cover: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=800&q=80',
    story: '贝贝热爱户外活动，需要充足的运动量。',
    phone: '13812345678',
    email: 'user@example.com',
    gender: '公',
    age: '3岁',
    species: '狗',
    breed: '金毛',
    sterilized: '是',
    location: '深圳市南山区'
  }
]);

const activeTab = ref<'short' | 'long'>('short');
const pageSize = 6;
const currentPage = ref(1);

const currentList = computed(() => (activeTab.value === 'short' ? shortPets.value : longPets.value));
const totalPages = computed(() => Math.max(1, Math.ceil(currentList.value.length / pageSize)));

const currentPets = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return currentList.value.slice(start, start + pageSize).map(pet => ({
    ...pet,
    photoText: `${pet.name}的照片`,
    footerText: pet.type === 'short' ? `已短期领养第 ${pet.days} 天` : `已发布第 ${pet.days} 天`
  }));
});

watch(activeTab, () => {
  currentPage.value = 1;
});

function switchTab(tab: 'short' | 'long') {
  activeTab.value = tab;
}

function goPrev() {
  if (currentPage.value > 1) currentPage.value -= 1;
}

function goNext() {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
}

function goPage(page: number) {
  currentPage.value = page;
}

function viewDetail(pet: PetCard) {
  router.push({ name: 'PetDetail', params: { id: pet.id } });
}

const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const petToDelete = ref<PetCard | null>(null);
const editingPet = ref<PetCard | null>(null);

const editForm = reactive<Record<string, string>>({
  name: '',
  age: '',
  gender: '',
  species: '',
  breed: '',
  sterilized: '',
  location: '',
  story: '',
  phone: '',
  email: ''
});

const basicFields = [
  { key: 'name', label: '动物名称', type: 'text', required: true, placeholder: '例如：豆豆' },
  { key: 'age', label: '年龄', type: 'text', required: true, placeholder: '例如：6个月/2岁' },
  { key: 'gender', label: '性别', type: 'select', required: true, options: ['公', '母'] },
  { key: 'species', label: '动物种类', type: 'select', required: true, options: ['狗', '猫', '兔子', '鸟类', '其他'] },
  { key: 'breed', label: '动物品种', type: 'text', required: true, placeholder: '例如：布偶猫' },
  { key: 'sterilized', label: '是否绝育', type: 'select', required: true, options: ['是', '否', '未知'] },
  { key: 'location', label: '目前位置', type: 'text', required: true, placeholder: '城市/区域' }
];

function populateEditForm(pet: PetCard) {
  editForm.name = pet.name;
  editForm.age = pet.age;
  editForm.gender = pet.gender;
  editForm.species = pet.species;
  editForm.breed = pet.breed;
  editForm.sterilized = pet.sterilized;
  editForm.location = pet.location;
  editForm.story = pet.story;
  editForm.phone = pet.phone;
  editForm.email = pet.email;
}

function handleEdit(pet: PetCard) {
  editingPet.value = pet;
  populateEditForm(pet);
  showEditModal.value = true;
}

const successModal = reactive({
  visible: false,
  title: '提示',
  message: ''
});

function cancelEdit() {
  showEditModal.value = false;
  successModal.title = '编辑取消';
  successModal.message = '已取消本次编辑操作。';
  successModal.visible = true;
}

function submitEdit() {
  if (!editingPet.value) return;
  const list = editingPet.value.type === 'short' ? shortPets.value : longPets.value;
  const index = list.findIndex(item => item.id === editingPet.value!.id);
  if (index > -1) {
    const sterilizedLabel =
      editForm.sterilized === '是' ? '已绝育' : editForm.sterilized === '否' ? '未绝育' : list[index].sterilized;
    list[index] = {
      ...list[index],
      ...editForm,
      meta: `${editForm.species || list[index].species} · ${editForm.age || list[index].age} · ${sterilizedLabel}`
    };
  }
  showEditModal.value = false;
  successModal.title = '保存成功';
  successModal.message = '宠物信息已更新。';
  successModal.visible = true;
}

function handleDelete(pet: PetCard) {
  petToDelete.value = pet;
  showDeleteConfirm.value = true;
}

function confirmDelete() {
  if (!petToDelete.value) return;
  const list = petToDelete.value.type === 'short' ? shortPets.value : longPets.value;
  const idx = list.findIndex(item => item.id === petToDelete.value!.id);
  if (idx > -1) {
    list.splice(idx, 1);
  }
  showDeleteConfirm.value = false;
  successModal.title = '删除成功';
  successModal.message = '宠物信息已被删除。';
  successModal.visible = true;
  petToDelete.value = null;
}

function closeSuccessModal() {
  successModal.visible = false;
}

</script>

<style scoped>
</style>


