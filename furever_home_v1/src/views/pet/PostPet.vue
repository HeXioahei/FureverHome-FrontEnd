<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import SuccessModal from '../../components/common/SuccessModal.vue'
import ErrorModal from '../../components/common/ErrorModal.vue'
import ImageViewer from '../../components/common/ImageViewer.vue'
import { provinceCityOptions } from '@/constants/regions'

interface PetForm {
  name: string
  age: string
  gender: string
  species: string
  breed: string
  sterilized: string
  province: string
  city: string
  detailAddress: string
  location: string
  healthStatus: string
  story: string
  phone: string
  email: string
}

const router = useRouter()

const form = ref<PetForm>({
  name: '',
  age: '',
  gender: '',
  species: '',
  breed: '',
  sterilized: '',
  province: '',
  city: '',
  detailAddress: '',
  location: '',
  healthStatus: '',
  story: '',
  phone: '',
  email: ''
})

const cityOptions = computed(() => {
  const province = provinceCityOptions.find(
    p => p.value === form.value.province
  )
  return province ? province.cities : []
})

const uploadedFiles = ref<File[]>([])
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const showFileLimitModal = ref(false)
const errorMessage = ref('')

watch(
  () => form.value.province,
  () => {
    form.value.city = ''
  }
)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    if (uploadedFiles.value.length + newFiles.length > 5) {
      showFileLimitModal.value = true
      return
    }
    uploadedFiles.value.push(...newFiles)
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const getFileUrl = (file: File) => {
  return URL.createObjectURL(file)
}

const showImageViewer = ref(false)
const imageViewerIndex = ref(0)

const openImageViewer = (index: number) => {
  imageViewerIndex.value = index
  showImageViewer.value = true
}

const closeImageViewer = () => {
  showImageViewer.value = false
}

const getImageUrls = () => {
  return uploadedFiles.value.map(file => getFileUrl(file))
}

const triggerFileInput = () => {
  const input = document.getElementById('fileInput') as HTMLInputElement
  input?.click()
}

const validateForm = (): boolean => {
  const requiredFields = [
    { key: 'name', label: '动物名称' },
    { key: 'age', label: '年龄' },
    { key: 'gender', label: '性别' },
    { key: 'species', label: '动物种类' },
    { key: 'breed', label: '动物品种' },
    { key: 'sterilized', label: '是否绝育' },
    { key: 'province', label: '所在省份' },
    { key: 'city', label: '所在城市' },
    { key: 'detailAddress', label: '详细地址' },
    { key: 'phone', label: '联系电话' },
    { key: 'email', label: '电子邮箱' }
  ]

  const missingFields: string[] = []
  requiredFields.forEach(field => {
    if (!form.value[field.key as keyof PetForm]?.trim()) {
      missingFields.push(field.label)
    }
  })

  if (missingFields.length > 0) {
    errorMessage.value = `请完善以下必填信息：${missingFields.join('、')}`
    showErrorModal.value = true
    return false
  }

  return true
}

const submitForm = () => {
  if (!validateForm()) {
    return
  }

  // 组合省市 + 详细地址为 location，方便后端按地区筛选
  form.value.location = [
    form.value.province,
    form.value.city,
    form.value.detailAddress
  ].join('')

  // TODO: 这里未来接后端提交接口
  console.log('提交审核', form.value)
  console.log('上传的文件', uploadedFiles.value)
  showSuccessModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  // 重置表单
  form.value = {
    name: '',
    age: '',
    gender: '',
    species: '',
    breed: '',
    sterilized: '',
    province: '',
    city: '',
    detailAddress: '',
    location: '',
    healthStatus: '',
    story: '',
    phone: '',
    email: ''
  }
  uploadedFiles.value = []
}

const closeErrorModal = () => {
  showErrorModal.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FB]">
    <div class="max-w-[1200px] mx-auto py-8 px-5">
      <main class="bg-white rounded-xl p-8 shadow-sm">
        <h1 class="text-[28px] font-bold text-center mb-8 text-[#333333]">
          发布待领养动物信息
        </h1>

        <form @submit.prevent="submitForm">
          <!-- 宠物基本信息 -->
          <div class="mb-8 pb-5 border-b border-[#E5E7EB]">
            <h2 class="text-xl font-bold mb-5 text-[#333333] flex items-center gap-2.5">
              <i class="fa-solid fa-paw text-[#FF8C00]"></i>
              宠物基本信息
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="mb-5">
                <label class="block mb-2 font-semibold text-[#666666] text-sm">
                  动物名称 <span class="text-[#EF4444]">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="例如：豆豆"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm transition-colors focus:border-[#FF8C00] focus:outline-none"
                />
              </div>

              <div class="mb-5">
                <label class="block mb-2 font-semibold text-[#666666] text-sm">
                  年龄(以月为单位) <span class="text-[#EF4444]">*</span>
                </label>
                <input
                  v-model="form.age"
                  type="text"
                  placeholder="例如：5"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm transition-colors focus:border-[#FF8C00] focus:outline-none"
                />
              </div>

              <div class="mb-5">
                <label class="block mb-2 font-semibold text-[#666666] text-sm">
                  性别 <span class="text-[#EF4444]">*</span>
                </label>
                <select
                  v-model="form.gender"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm transition-colors focus:border-[#FF8C00] focus:outline-none"
                >
                  <option value="">请选择</option>
                  <option value="公">公</option>
                  <option value="母">母</option>
                </select>
              </div>

              <div class="mb-5">
                <label class="block mb-2 font-semibold text-[#666666] text-sm">
                  动物种类 <span class="text-[#EF4444]">*</span>
                </label>
                <select
                  v-model="form.species"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm transition-colors focus:border-[#FF8C00] focus:outline-none"
                >
                  <option value="">请选择</option>
                  <option value="狗">狗</option>
                  <option value="猫">猫</option>
                  <option value="兔子">兔子</option>
                  <option value="仓鼠">仓鼠</option>
                  <option value="鸟类">鸟类</option>
                  <option value="鱼类">鱼类</option>
                  <option value="龟类">龟类</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              <div class="mb-5">
                <label class="block mb-2 font-semibold text-[#666666] text-sm">
                  动物品种 <span class="text-[#EF4444]">*</span>
                </label>
                <input
                  v-model="form.breed"
                  type="text"
                  placeholder="例如：拉布拉多、布偶猫"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm transition-colors focus:border-[#FF8C00] focus:outline-none"
                />
              </div>

              <div class="mb-5">
                <label class="block mb-2 font-semibold text-[#666666] text-sm">
                  是否绝育 <span class="text-[#EF4444]">*</span>
                </label>
                <select
                  v-model="form.sterilized"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm transition-colors focus:border-[#FF8C00] focus:outline-none"
                >
                  <option value="">请选择</option>
                  <option value="是">是</option>
                  <option value="否">否</option>
                  <option value="未知">未知</option>
                </select>
              </div>

              <div class="mb-5 md:col-span-2">
                <label class="block mb-2 font-semibold text-[#666666] text-sm">
                  目前位置 <span class="text-[#EF4444]">*</span>
                </label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <select
                    v-model="form.province"
                    class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm transition-colors focus:border-[#FF8C00] focus:outline-none"
                  >
                    <option value="">请选择省份</option>
                    <option
                      v-for="p in provinceCityOptions"
                      :key="p.value"
                      :value="p.value"
                    >
                      {{ p.label }}
                    </option>
                  </select>
                  <select
                    v-model="form.city"
                    class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm transition-colors focus:border-[#FF8C00] focus:outline-none"
                  >
                    <option value="">请选择城市</option>
                    <option
                      v-for="c in cityOptions"
                      :key="c.value"
                      :value="c.value"
                    >
                      {{ c.label }}
                    </option>
                  </select>
                  <input
                    v-model="form.detailAddress"
                    type="text"
                    placeholder="详细地址，如街道、小区、楼栋、门牌号等"
                    class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm transition-colors focus:border-[#FF8C00] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 照片/视频上传 -->
          <div class="mb-8 pb-5 border-b border-[#E5E7EB]">
            <h2 class="text-xl font-bold mb-5 text-[#333333] flex items-center gap-2.5">
              <i class="fa-solid fa-image text-[#FF8C00]"></i>
              照片/视频上传
            </h2>
            <div
              class="border-2 border-dashed border-[#E5E7EB] rounded-xl p-10 text-center cursor-pointer transition-all hover:border-[#FF8C00] hover:bg-[rgba(255,140,0,0.05)]"
              @click="triggerFileInput"
            >
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleFileUpload"
              />
              <div class="text-[40px] mb-2.5 text-[#666666]">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div class="text-[#666666] mb-2.5">点击上传或拖拽文件到这里</div>
              <div class="text-sm text-[#9CA3AF]">支持 JPG, PNG 格式，最多5张照片</div>
            </div>
            <div v-if="uploadedFiles.length > 0" class="mt-4 flex flex-wrap gap-3">
              <div
                v-for="(file, index) in uploadedFiles"
                :key="index"
                class="relative w-24 h-24 rounded-lg overflow-hidden border border-[#E5E7EB] cursor-pointer"
                @click="openImageViewer(index)"
              >
                <img
                  :src="getFileUrl(file)"
                  :alt="file.name"
                  class="w-full h-full object-cover"
                />
                <button
                  type="button"
                  class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 z-10"
                  @click.stop="removeFile(index)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- 详细描述 -->
          <div class="mb-8 pb-5 border-b border-[#E5E7EB]">
            <h2 class="text-xl font-bold mb-5 text-[#333333] flex items-center gap-2.5">
              <i class="fa-solid fa-book text-[#FF8C00]"></i>
              详细描述（救助故事与宠物的健康状态）
            </h2>
            <div class="mb-5">
              <textarea
                v-model="form.story"
                placeholder="请详细描述救助的背景、故事和任何特殊需求。"
                class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm min-h-[120px] resize-y transition-colors focus:border-[#FF8C00] focus:outline-none"
              ></textarea>
            </div>
          </div>

          <!-- 联系信息 -->
          <div class="mb-8 pb-5 border-b border-[#E5E7EB]">
            <h2 class="text-xl font-bold mb-5 text-[#333333] flex items-center gap-2.5">
              <i class="fa-solid fa-address-book text-[#FF8C00]"></i>
              联系信息
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="mb-5">
                <label class="block mb-2 font-semibold text-[#666666] text-sm">
                  联系电话 <span class="text-[#EF4444]">*</span>
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="13812345678"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm transition-colors focus:border-[#FF8C00] focus:outline-none"
                />
              </div>

              <div class="mb-5">
                <label class="block mb-2 font-semibold text-[#666666] text-sm">
                  电子邮箱 <span class="text-[#EF4444]">*</span>
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="user@example.com"
                  class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm transition-colors focus:border-[#FF8C00] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-center gap-5 mt-8">
            <button
              type="submit"
              class="px-8 py-3 rounded-lg text-base font-semibold cursor-pointer transition-all border-none bg-[#FF8C00] text-white hover:bg-[#E67A2A] hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(255,140,0,0.3)]"
            >
              提交审核
            </button>
          </div>
        </form>
      </main>
    </div>

    <!-- 成功模态框 -->
    <SuccessModal
      :visible="showSuccessModal"
      title="发布成功！"
      message="您发布的宠物信息将展示在平台上。"
      @close="closeSuccessModal"
    />

    <!-- 失败模态框 -->
    <ErrorModal
      :visible="showErrorModal"
      title="发布失败"
      :message="errorMessage"
      @close="closeErrorModal"
    />

    <!-- 文件数量限制提示 -->
    <ErrorModal
      :visible="showFileLimitModal"
      title="提示"
      message="最多只能上传5张照片"
      @close="showFileLimitModal = false"
    />

    <!-- 图片查看器 -->
    <ImageViewer
      :visible="showImageViewer"
      :images="getImageUrls()"
      :initial-index="imageViewerIndex"
      @close="closeImageViewer"
    />
  </div>
</template>
