<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ImageViewer from '../../components/common/ImageViewer.vue'

interface Pet {
  id: number
  name: string
  photo_url: string
  fosterer: string
  location: string
  species: string
  age: number // 年龄（月）
  gender: string
  adoption_status: string // '短期领养' | '长期领养'
  breed: string
  health_status: string
  days_adopted: number // 领养天数
}

const router = useRouter()

// Mock数据
const pets: Pet[] = [
  {
    id: 1,
    name: '小橘',
    photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300',
    fosterer: '李同学',
    location: '广东省',
    species: '猫',
    age: 12,
    gender: '公',
    adoption_status: '短期领养',
    breed: '中华田园猫',
    health_status: '已绝育',
    days_adopted: 15
  },
  {
    id: 2,
    name: '煤球',
    photo_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300',
    fosterer: '王同学',
    location: '北京市',
    species: '狗',
    age: 6,
    gender: '母',
    adoption_status: '长期领养',
    breed: '黑色中型犬',
    health_status: '未绝育',
    days_adopted: 6
  },
  {
    id: 3,
    name: '雪球',
    photo_url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=300',
    fosterer: '赵同学',
    location: '上海市',
    species: '猫',
    age: 36,
    gender: '母',
    adoption_status: '长期领养',
    breed: '长毛白猫',
    health_status: '已绝育',
    days_adopted: 3
  },
  {
    id: 4,
    name: '小黑',
    photo_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300',
    fosterer: '李同学',
    location: '四川省',
    species: '狗',
    age: 8,
    gender: '公',
    adoption_status: '短期领养',
    breed: '黑色小型犬',
    health_status: '未绝育',
    days_adopted: 8
  },
  {
    id: 5,
    name: '灰灰',
    photo_url: 'https://images.unsplash.com/photo-1573865526739-10c1dd7e1e0e?w=300',
    fosterer: '刘同学',
    location: '浙江省',
    species: '猫',
    age: 5,
    gender: '母',
    adoption_status: '短期领养',
    breed: '蓝猫',
    health_status: '已绝育',
    days_adopted: 5
  },
  {
    id: 6,
    name: '小金',
    photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300',
    fosterer: '陈同学',
    location: '江苏省',
    species: '狗',
    age: 3,
    gender: '公',
    adoption_status: '长期领养',
    breed: '金毛寻回犬',
    health_status: '未绝育',
    days_adopted: 26
  }
]

// 筛选条件
const provinceFilter = ref('')
const speciesFilter = ref('')
const genderFilter = ref('')
const ageFilter = ref('')
const adoptionStatusFilter = ref('')

// 分页
const currentPage = ref(1)
const pageSize = 6

const filteredPets = computed(() => {
  return pets.filter((pet) => {
    if (provinceFilter.value && pet.location !== provinceFilter.value) return false
    if (speciesFilter.value && pet.species !== speciesFilter.value) return false
    if (genderFilter.value && pet.gender !== genderFilter.value) return false
    if (adoptionStatusFilter.value && pet.adoption_status !== adoptionStatusFilter.value) return false
    
    // 年龄筛选
    if (ageFilter.value) {
      const age = pet.age
      if (ageFilter.value === '0-6' && (age < 0 || age > 6)) return false
      if (ageFilter.value === '6-12' && (age < 6 || age > 12)) return false
      if (ageFilter.value === '12-36' && (age < 12 || age > 36)) return false
      if (ageFilter.value === '36-84' && (age < 36 || age > 84)) return false
      if (ageFilter.value === '84+' && age < 84) return false
    }
    
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredPets.value.length / pageSize))

const paginatedPets = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredPets.value.slice(start, end)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPetDetail = (id: number) => {
  router.push({ name: 'PetDetail', params: { id } })
}

const showImageViewer = ref(false)
const imageViewerIndex = ref(0)
const currentImageList = ref<string[]>([])

const openImageViewer = (imageUrl: string, event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  // 获取所有宠物的图片URL列表
  const allImages = pets.map(p => p.photo_url).filter(url => url)
  const index = allImages.indexOf(imageUrl)
  if (index > -1) {
    currentImageList.value = allImages
    imageViewerIndex.value = index
    showImageViewer.value = true
  }
}

const closeImageViewer = () => {
  showImageViewer.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f5f5]">
    <!-- Hero Section -->
    <section class="text-center pt-24 pb-10">
      <h1 class="text-[28px] text-[#FF8C42] mb-2.5 font-bold">
        为这些可爱的小生命寻找一个永久的家
      </h1>
      <p class="text-base text-[#666]">领养代替购买，给流浪动物一个温暖的家</p>
    </section>

    <!-- Main Container -->
    <div class="max-w-[1200px] mx-auto px-[5%] pb-8">
      <!-- Filter Bar -->
      <div class="bg-white rounded-2xl p-5 mb-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-sm text-[#666] whitespace-nowrap">筛选条件：</span>

          <!-- 地区 -->
          <span class="text-sm text-[#666] whitespace-nowrap">地区</span>
          <select
            v-model="provinceFilter"
            class="px-3 py-1.5 border border-[#ddd] rounded-full text-sm bg-white cursor-pointer transition-colors hover:border-[#FF8C42] focus:outline-none focus:border-[#FF8C42]"
          >
            <option value="">请选择</option>
            <option>北京市</option>
            <option>上海市</option>
            <option>广东省</option>
            <option>江苏省</option>
            <option>浙江省</option>
            <option>四川省</option>
            <option>湖北省</option>
            <option>山东省</option>
          </select>

          <!-- 种类 -->
          <span class="text-sm text-[#666] whitespace-nowrap">种类</span>
          <select
            v-model="speciesFilter"
            class="px-3 py-1.5 border border-[#ddd] rounded-full text-sm bg-white cursor-pointer transition-colors hover:border-[#FF8C42] focus:outline-none focus:border-[#FF8C42]"
          >
            <option value="">请选择</option>
            <option>猫</option>
            <option>狗</option>
            <option>其他</option>
          </select>

          <!-- 性别 -->
          <span class="text-sm text-[#666] whitespace-nowrap">性别</span>
          <select
            v-model="genderFilter"
            class="px-3 py-1.5 border border-[#ddd] rounded-full text-sm bg-white cursor-pointer transition-colors hover:border-[#FF8C42] focus:outline-none focus:border-[#FF8C42]"
          >
            <option value="">请选择</option>
            <option>公</option>
            <option>母</option>
          </select>

          <!-- 年龄 -->
          <span class="text-sm text-[#666] whitespace-nowrap">年龄</span>
          <select
            v-model="ageFilter"
            class="px-3 py-1.5 border border-[#ddd] rounded-full text-sm bg-white cursor-pointer transition-colors hover:border-[#FF8C42] focus:outline-none focus:border-[#FF8C42]"
          >
            <option value="">请选择</option>
            <option value="0-6">0-6个月</option>
            <option value="6-12">6-12个月</option>
            <option value="12-36">1-3岁</option>
            <option value="36-84">3-7岁</option>
            <option value="84+">7岁以上</option>
          </select>

          <!-- 领养状态 -->
          <span class="text-sm text-[#666] whitespace-nowrap">领养状态</span>
          <select
            v-model="adoptionStatusFilter"
            class="px-3 py-1.5 border border-[#ddd] rounded-full text-sm bg-white cursor-pointer transition-colors hover:border-[#FF8C42] focus:outline-none focus:border-[#FF8C42]"
          >
            <option value="">请选择</option>
            <option>短期领养</option>
            <option>长期领养</option>
          </select>
        </div>
      </div>

      <!-- Pets Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div
          v-for="pet in paginatedPets"
          :key="pet.id"
          class="bg-white rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer transition-transform hover:-translate-y-1"
          @click="goToPetDetail(pet.id)"
        >
          <div class="w-full h-[200px] bg-[#FFE4B5] flex items-center justify-center overflow-hidden">
            <img
              v-if="pet.photo_url"
              :src="pet.photo_url"
              :alt="pet.name"
              class="w-full h-full object-cover cursor-pointer"
              @click="openImageViewer(pet.photo_url, $event)"
            />
            <span v-else class="text-[#999] font-bold">{{ pet.name }}的照片</span>
          </div>
          <div class="p-5">
            <div class="text-lg font-bold mb-1.5 text-[#333]">{{ pet.name }}</div>
            <div class="text-sm text-[#666] mb-2.5">
              {{ pet.species }} · {{ Math.floor(pet.age / 12) }}岁{{ pet.age % 12 }}个月 · {{ pet.health_status }}
            </div>
            <span
              :class="[
                'inline-block px-3 py-1.5 rounded-2xl text-xs font-bold',
                pet.adoption_status === '短期领养'
                  ? 'bg-[#FFF3CD] text-[#856404]'
                  : 'bg-[#D1FAE5] text-[#059669]'
              ]"
            >
              {{ pet.adoption_status }}
            </span>
            <div class="text-xs text-[#666] mt-1.5">
              临时收养者：{{ pet.fosterer }}
            </div>
            <div class="bg-[#FFF9F0] p-2 rounded text-center text-sm mt-2.5">
              已{{ pet.adoption_status }} {{ pet.days_adopted }} 天
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2 mt-10">
        <button
          :disabled="currentPage === 1"
          class="px-4 py-2 border border-[#ddd] bg-white rounded-lg cursor-pointer transition-all hover:border-[#FF8C42] hover:text-[#FF8C42] disabled:text-[#ccc] disabled:cursor-not-allowed disabled:hover:border-[#ddd] disabled:hover:text-[#ccc]"
          @click="goToPage(currentPage - 1)"
        >
          上一页
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          :class="[
            'px-4 py-2 border rounded-lg cursor-pointer transition-all',
            currentPage === page
              ? 'bg-[#FF8C42] text-white border-[#FF8C42]'
              : 'border-[#ddd] bg-white hover:border-[#FF8C42] hover:text-[#FF8C42]'
          ]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border border-[#ddd] bg-white rounded-lg cursor-pointer transition-all hover:border-[#FF8C42] hover:text-[#FF8C42] disabled:text-[#ccc] disabled:cursor-not-allowed disabled:hover:border-[#ddd] disabled:hover:text-[#ccc]"
          @click="goToPage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-[#2C3E50] text-white py-10 px-[5%] mt-16">
      <div class="flex flex-wrap justify-between max-w-[1200px] mx-auto gap-8">
        <div class="flex-1 min-w-[220px]">
          <h3 class="mb-4 text-lg font-semibold">数据统计</h3>
          <p class="mb-2 text-sm text-[#ccc]">我们与多家救助站建立了长期合作关系</p>
          <p class="mb-2 text-sm text-[#ccc]">已为 <strong>1,286</strong> 只小动物找到新家</p>
          <a href="#" class="text-[#FF8C42] text-sm hover:underline">查看合作救助站 →</a>
        </div>
        <div class="flex-1 min-w-[220px]">
          <h3 class="mb-4 text-lg font-semibold">联系开发团队</h3>
          <p class="mb-2 text-sm text-[#ccc]">
            如果您有任何问题、建议或合作意向，请随时联系我们的开发团队。
          </p>
          <div class="flex gap-3 mt-2.5">
            <i class="fa-brands fa-weixin text-2xl hover:text-[#FF8C42] cursor-pointer transition-colors"></i>
            <i class="fa-brands fa-qq text-2xl hover:text-[#FF8C42] cursor-pointer transition-colors"></i>
            <i class="fa-brands fa-weibo text-2xl hover:text-[#FF8C42] cursor-pointer transition-colors"></i>
          </div>
        </div>
      </div>
      <div class="text-center mt-8 pt-5 border-t border-white/10 text-sm text-[#aaa]">
        2025 FUREVERHOME动物领养平台 - 让每个生命都有温暖的家
      </div>
    </footer>

    <!-- 图片查看器 -->
    <ImageViewer
      :visible="showImageViewer"
      :images="currentImageList"
      :initial-index="imageViewerIndex"
      @close="closeImageViewer"
    />
  </div>
</template>
