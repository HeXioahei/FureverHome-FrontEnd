<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const petId = computed(() => Number(route.params.id))

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
  user_id: number
}

// TODO: 这里先用本地 mock 数据，后续可以替换为后端接口返回
const mockDetails: PetDetail[] = [
  {
    id: 1,
    animal_name: '小橘',
    photo_urls: [
      'https://static.xxx/img1.jpg',
      'https://static.xxx/img2.jpg',
      'https://static.xxx/img3.jpg'
    ],
    species: '猫',
    breed: '橘猫',
    gender: '公',
    animal_age: 13,
    health_status: '良好',
    is_sterilized: '是',
    animal_location: '福州大学 xx 校区',
    adoption_status: '短期领养',
    short_description: '性格活泼温顺的小橘。',
    detail_info: '小橘于2022年在福州大学校园被发现，健康状况良好...',
    user_id: 1003
  }
]

const currentPet = computed<PetDetail | undefined>(() => {
  const found = mockDetails.find((p) => p.id === petId.value)
  return found ?? mockDetails[0]
})

const goBack = () => {
  router.push('/')
}

const goToFostererProfile = () => {
  // TODO: 未来接入临时收养者主页路由
  console.log('查看主页')
}

const contactFosterer = () => {
  // TODO: 未来接入聊天/私信功能
  console.log('联系TA')
}
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-slate-700 dark:text-slate-300 min-h-screen">
    <main v-if="currentPet" class="container mx-auto px-6 py-8">
      <div class="space-y-8">
        <!-- 顶部卡片 -->
        <div class="relative bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-8">
          <button
            type="button"
            class="absolute top-8 right-8 flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            @click="goBack"
          >
            <span class="material-icons text-base mr-1">arrow_back_ios_new</span>
            <span>返回宠物列表</span>
          </button>

          <div class="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
            <!-- 图片区域 -->
            <div class="lg:w-1/3 w-full">
              <div class="bg-amber-100 rounded-lg aspect-[4/3] flex items-center justify-center">
                <p class="text-amber-600 dark:text-amber-400">{{ currentPet.animal_name }}的照片</p>
              </div>
            </div>

            <!-- 基本信息 -->
            <div class="lg:w-2/3 w-full flex flex-col">
              <div class="flex-grow">
                <h1 class="text-4xl font-bold text-primary mb-6">
                  {{ currentPet.animal_name }}
                </h1>

                <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div class="border-b border-slate-200 dark:border-zinc-700 pb-3">
                    <p class="text-slate-500 dark:text-slate-400">性别</p>
                    <p class="font-medium text-slate-800 dark:text-slate-200 mt-1">
                      {{ currentPet.gender }}
                    </p>
                  </div>
                  <div class="border-b border-slate-200 dark:border-zinc-700 pb-3">
                    <p class="text-slate-500 dark:text-slate-400">年龄</p>
                    <p class="font-medium text-slate-800 dark:text-slate-200 mt-1">
                      {{ currentPet.animal_age }}个月
                    </p>
                  </div>
                  <div class="border-b border-slate-200 dark:border-zinc-700 pb-3">
                    <p class="text-slate-500 dark:text-slate-400">品种</p>
                    <p class="font-medium text-slate-800 dark:text-slate-200 mt-1">
                      {{ currentPet.breed }}
                    </p>
                  </div>
                  <div class="border-b border-slate-200 dark:border-zinc-700 pb-3">
                    <p class="text-slate-500 dark:text-slate-400">健康状况</p>
                    <p class="font-medium text-slate-800 dark:text-slate-200 mt-1">
                      {{ currentPet.health_status }}
                    </p>
                  </div>
                  <div>
                    <p class="text-slate-500 dark:text-slate-400">性情特点</p>
                    <p class="font-medium text-slate-800 dark:text-slate-200 mt-1">
                      {{ currentPet.short_description }}
                    </p>
                  </div>
                  <div>
                    <p class="text-slate-500 dark:text-slate-400">目前位置</p>
                    <p class="font-medium text-slate-800 dark:text-slate-200 mt-1">
                      {{ currentPet.animal_location }}
                    </p>
                  </div>
                  <div>
                    <p class="text-slate-500 dark:text-slate-400">是否绝育</p>
                    <p class="font-medium text-slate-800 dark:text-slate-200 mt-1">
                      {{ currentPet.is_sterilized }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-amber-50 dark:bg-zinc-700/50 rounded-lg p-4 mt-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <span
                      class="inline-block bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs font-semibold px-2 py-1 rounded-full mb-2"
                    >
                      {{ currentPet.adoption_status }}
                    </span>
                    <p class="text-sm text-slate-600 dark:text-slate-300">
                      当前领养状态：
                      {{ currentPet.adoption_status }}
                    </p>
                    <div class="flex items-center mt-3">
                      <div class="h-10 w-10 rounded-full bg-slate-300" />
                      <div class="ml-3">
                        <p class="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                          收养者
                        </p>
                        <p class="font-semibold text-slate-800 dark:text-slate-200">
                          用户 {{ currentPet.user_id }}
                        </p>
                        <div class="flex items-center text-xs">
                          <span class="text-slate-500 dark:text-slate-400 mr-1">评分: 4.9</span>
                          <span class="text-amber-400">★★★★</span><span class="text-amber-300">★</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-3">
                    <button
                      type="button"
                      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      @click="goToFostererProfile"
                    >
                      查看主页
                    </button>
                    <button
                      type="button"
                      class="bg-primary hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition-colors bg-orange-500"
                      @click="contactFosterer"
                    >
                      联系TA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 下方信息区 -->
        <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-8">
          <div class="space-y-8">
            <section>
              <h2 class="text-2xl font-bold text-primary mb-3">宠物简介</h2>
              <p class="leading-relaxed text-slate-600 dark:text-slate-300">
                {{ currentPet.short_description }}
              </p>
            </section>

            <hr class="border-slate-200 dark:border-zinc-700" />

            <section>
              <h2 class="text-2xl font-bold text-primary mb-3">关于{{ currentPet.animal_name }}</h2>
              <p class="leading-relaxed text-slate-600 dark:text-slate-300">
                {{ currentPet.detail_info }}
              </p>
            </section>

            <hr class="border-slate-200 dark:border-zinc-700" />

            <section>
              <h2 class="text-2xl font-bold text-primary mb-4">生活照片</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="(url, index) in currentPet.photo_urls"
                  :key="url + index"
                  class="bg-slate-100 dark:bg-zinc-700 rounded-lg aspect-square overflow-hidden flex items-center justify-center"
                >
                  <img :src="url" :alt="`${currentPet.animal_name}照片${index + 1}`" class="w-full h-full object-cover" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>

    <main v-else class="container mx-auto px-6 py-16">
      <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-10 text-center">
        <p class="text-xl font-semibold mb-4">未找到该宠物信息</p>
        <button
          type="button"
          class="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium"
          @click="goBack"
        >
          返回宠物列表
        </button>
      </div>
    </main>
  </div>
</template>
