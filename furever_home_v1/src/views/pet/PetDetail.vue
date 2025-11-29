<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const petId = computed(() => Number(route.params.id))

interface Publisher {
  user_id: string
  username: string
  avatar_url: string
  credit_score: string
}

interface PetDetail {
  id: number
  animal_name: string
  photo_urls: string[]
  species: string
  breed: string
  gender: string
  animal_age: number
  health_status: string
  is_sterilized: string
  animal_location: string
  adoption_status: string
  short_description: string
  detail_info: string
  publisher: Publisher
}

// TODO: 这里先用本地 mock 数据，后续可以替换为后端接口返回
const mockDetails: PetDetail[] = [
  {
    id: 1,
    animal_name: '小橘',
    photo_urls: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400',
      'https://images.unsplash.com/photo-1573865526739-10c1dd7e1e0e?w=400',
      'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400'
    ],
    species: '猫',
    breed: '中华田园猫',
    gender: '公',
    animal_age: 12,
    health_status: '已免疫、已驱虫，无重大疾病史',
    is_sterilized: '已绝育',
    animal_location: 'xx省xx市',
    adoption_status: '短期领养',
    short_description: '性格活泼温顺的小橘。',
    detail_info: '小橘是2022年秋天在xx大学被发现的流浪小猫，当时只有两个月大，被李同学救助并临时收养至今，已经健康成长为一只活跃可爱的猫咪。小橘性格异常温顺，喜欢与人互动，会主动蹭腿示好，特别喜欢玩逗猫棒和在线球，作息规律，已经学会使用猫砂盆，非常适合家庭培养。作为临时收养者，李同学已为小橘完成绝育、三联疫苗和体外驱虫，健康状况良好，希望能为小橘找到一个有爱心、负责任的长期家庭。',
    publisher: {
      user_id: '1003',
      username: '李同学',
      avatar_url: '',
      credit_score: '4.9'
    }
  }
]

const currentPet = computed<PetDetail | undefined>(() => {
  const found = mockDetails.find((p) => p.id === petId.value)
  return found ?? mockDetails[0]
})

const mainImage = ref(0)

const goToFostererProfile = () => {
  // TODO: 未来接入临时收养者主页路由
  console.log('查看主页')
}

const contactFosterer = () => {
  // 跳转到沟通对接页面
  router.push({ name: 'Communication' })
}

const requestAdoption = () => {
  // 跳转到申请领养页面
  router.push({ name: 'ApplyAdoption', params: { id: petId.value } })
}
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FB]">
    <main v-if="currentPet" class="max-w-[1200px] mx-auto py-8 px-5">
      <!-- 宠物档案卡片 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8 flex flex-col lg:flex-row">
        <!-- 左侧图片区域 -->
        <div class="flex-1 lg:min-w-[380px] bg-[#FFE4B5] flex items-center justify-center p-8">
          <img
            v-if="currentPet.photo_urls[mainImage]"
            :src="currentPet.photo_urls[mainImage]"
            :alt="currentPet.animal_name"
            class="w-full h-[300px] object-cover rounded-xl"
          />
          <div v-else class="text-[#999] text-center">
            <i class="fa-solid fa-image text-6xl mb-4"></i>
            <p>暂无照片</p>
          </div>
        </div>

        <!-- 右侧信息区域 -->
        <div class="flex-1 lg:min-w-[380px] p-8">
          <h1 class="text-[28px] text-[#FF8C00] mb-1.5 font-bold">{{ currentPet.animal_name }}</h1>
          <p class="text-[#666666] mb-5">{{ currentPet.breed }} · {{ currentPet.species }}</p>

          <!-- 信息网格 -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="py-2.5 border-b border-[#eee]">
              <div class="font-semibold text-[#666666] mb-1 text-sm">性别</div>
              <div class="text-[#333333]">{{ currentPet.gender }}</div>
            </div>
            <div class="py-2.5 border-b border-[#eee]">
              <div class="font-semibold text-[#666666] mb-1 text-sm">年龄</div>
              <div class="text-[#333333]">{{ currentPet.animal_age }}个月</div>
            </div>
            <div class="py-2.5 border-b border-[#eee]">
              <div class="font-semibold text-[#666666] mb-1 text-sm">绝育状况</div>
              <div class="text-[#333333]">{{ currentPet.is_sterilized }}</div>
            </div>
            <div class="py-2.5 border-b border-[#eee]">
              <div class="font-semibold text-[#666666] mb-1 text-sm">目前位置</div>
              <div class="text-[#333333]">{{ currentPet.animal_location }}</div>
            </div>
          </div>

          <!-- 领养状态卡片 -->
          <div class="bg-[#fffaf0] p-4 rounded-xl my-5">
            <span class="inline-block px-2.5 py-1 rounded-full text-[13px] font-semibold mb-2.5 bg-[#fff3cd] text-[#856404]">
              {{ currentPet.adoption_status }}
            </span>
            <p class="text-sm mb-3">当前领养状态：临时收养</p>
            <div class="flex items-center gap-3 mt-3">
              <div class="w-[46px] h-[46px] rounded-full bg-[#F3C697] flex items-center justify-center font-semibold text-white">
                {{ currentPet.publisher.username.charAt(0) }}
              </div>
              <div class="flex-1">
                <div class="font-semibold text-[#333333]">{{ currentPet.publisher.username }}</div>
                <div class="text-[#f5a623] text-[13px]">
                  评分: {{ currentPet.publisher.credit_score }} ★★★★☆
                </div>
              </div>
              <button
                type="button"
                class="inline-block px-5 py-2.5 bg-[#4A90E2] text-white rounded-xl font-semibold transition-all hover:bg-[#3a7bc8] hover:-translate-y-0.5 hover:shadow-lg"
                @click="goToFostererProfile"
              >
                查看主页
              </button>
              <button
                type="button"
                class="inline-block px-5 py-2.5 bg-[#4A90E2] text-white rounded-xl font-semibold transition-all hover:bg-[#3a7bc8] hover:-translate-y-0.5 hover:shadow-lg"
                @click="contactFosterer"
              >
                联系TA
              </button>
            </div>
          </div>

          <button
            type="button"
            class="inline-block px-6 py-2.5 bg-[#FF8C00] text-white rounded-xl font-semibold transition-all hover:bg-[#e6722a] hover:-translate-y-0.5 hover:shadow-lg"
            @click="requestAdoption"
          >
            请求领养
          </button>
        </div>
      </div>

      <!-- 详细描述卡片 -->
      <div class="bg-white rounded-xl shadow-sm p-8">
        <h2 class="text-xl font-bold mb-4 text-[#333333]">关于{{ currentPet.animal_name }}</h2>
        <div class="text-[#333333] leading-relaxed space-y-4">
          <p>{{ currentPet.detail_info }}</p>
        </div>

        <h2 class="text-xl font-bold mb-4 mt-8 text-[#333333]">生活照片</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(url, index) in currentPet.photo_urls"
            :key="index"
            class="h-[150px] bg-[#f0f0f0] rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            @click="mainImage = index"
          >
            <img
              v-if="url"
              :src="url"
              :alt="`照片${index + 1}`"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-[#999] text-sm">照片{{ index + 1 }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- 未找到宠物 -->
    <main v-else class="max-w-[1200px] mx-auto py-16 px-5">
      <div class="bg-white rounded-xl shadow-sm p-10 text-center">
        <p class="text-xl font-semibold mb-4">未找到该宠物信息</p>
        <button
          type="button"
          class="mt-2 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#FF8C00] hover:bg-[#e6722a] text-white font-medium"
          @click="() => $router.push('/pets')"
        >
          返回宠物列表
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-[#1E293B] text-white py-10 px-[5%] mt-16">
      <div class="max-w-[1200px] mx-auto flex flex-wrap gap-10">
        <div class="flex-1 min-w-[260px]">
          <h3 class="mb-4 text-lg font-semibold">数据统计</h3>
          <p class="text-sm leading-relaxed mb-3">
            我们与多家救助站建立了长期合作关系，致力于为流浪动物提供更好的临时安置和长期领养服务。
          </p>
          <a href="#" class="text-[#FF8C00] text-sm hover:underline">查看合作救助站 →</a>
        </div>
        <div class="flex-1 min-w-[260px]">
          <h3 class="mb-4 text-lg font-semibold">联系开发团队</h3>
          <p class="text-sm leading-relaxed mb-3">
            如果您有任何问题、建议或合作意向，请随时联系我们的开发团队。
          </p>
          <div class="flex gap-3 mt-2.5">
            <i class="fa-brands fa-weixin text-2xl hover:text-[#FF8C00] cursor-pointer transition-colors"></i>
            <i class="fa-brands fa-qq text-2xl hover:text-[#FF8C00] cursor-pointer transition-colors"></i>
            <i class="fa-brands fa-weibo text-2xl hover:text-[#FF8C00] cursor-pointer transition-colors"></i>
          </div>
        </div>
      </div>
      <div class="text-center pt-6 mt-6 border-t border-white/10 text-sm">
        2025 FUREVERHOME 流浪动物领养平台 - 让每个生命都有温暖的家
      </div>
    </footer>
  </div>
</template>
