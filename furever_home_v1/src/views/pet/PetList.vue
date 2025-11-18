<script setup lang="ts">
import { ref, computed } from 'vue'
import { pets, type Pet } from '@/data/pets'
const locationFilter = ref('')
const genderFilter = ref<'all' | Pet['gender']>('all')
const speciesFilter = ref<'all' | Pet['species']>('all')
const adoptionStatusFilter = ref<'all' | Pet['adoption_status']>('all')

const filteredPets = computed(() => {
  return pets.filter((pet) => {
    const locationQuery = locationFilter.value.trim()
    if (locationQuery && !pet.location.includes(locationQuery)) return false

    if (genderFilter.value !== 'all' && pet.gender !== genderFilter.value) return false
    if (speciesFilter.value !== 'all' && pet.species !== speciesFilter.value) return false
    if (adoptionStatusFilter.value !== 'all' && pet.adoption_status !== adoptionStatusFilter.value)
      return false

    return true
  })
})
</script>

<template>
  <div
    class="bg-background-light dark:bg-background-dark font-display text-gray-700 dark:text-gray-300 min-h-screen"
  >
    <!-- Main -->
    <main class="container mx-auto px-6 py-8">
      <!-- Hero -->
      <section class="text-center py-12">
        <h1 class="text-4xl font-bold text-primary">为这些可爱的小生命寻找一个永久的家</h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          领养代替购买，给流浪动物一个温暖的家
        </p>
      </section>

      <!-- Filter bar -->
      <section class="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm mb-8">
        <div class="flex flex-wrap items-center gap-4">
          <span class="font-medium text-gray-800 dark:text-gray-200">筛选条件:</span>

          <!-- 地区筛选（搜索省市区） -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600 dark:text-gray-300">地区</span>
            <input
              v-model="locationFilter"
              type="text"
              placeholder="输入省/市/区搜索"
              class="text-sm rounded-full border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <!-- 性别筛选 -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600 dark:text-gray-300">性别</span>
            <select
              v-model="genderFilter"
              class="text-sm rounded-full border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200  pl-5 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">全部</option>
              <option value="male"> 公 </option>
              <option value="female"> 母 </option>
            </select>
          </div>

          <!-- 品种（猫/狗）筛选 -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600 dark:text-gray-300">品种</span>
            <select
              v-model="speciesFilter"
              class="text-sm rounded-full border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200  pl-5 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">全部</option>
              <option value="cat"> 猫 </option>
              <option value="dog"> 狗 </option>
            </select>
          </div>

          <!-- 领养状态筛选 -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600 dark:text-gray-300">领养状态</span>
            <select
              v-model="adoptionStatusFilter"
              class="text-sm rounded-full border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 px-5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">全部</option>
              <option value="available">短期领养</option>
              <option value="adopted">长期领养</option>
            </select>
          </div>

          <div class="ml-auto flex items-center">
            <RouterLink
              to="/post-pet"
              class="px-4 py-2 text-sm font-medium rounded-full bg-primary text-white bg-orange-500 transition-colors"
            >
              + 发布待领养动物
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- 结果数量提示（仅在有结果时显示） -->
      <section
        v-if="filteredPets.length > 0"
        class="mt-4 mb-4 text-sm text-gray-600 dark:text-gray-300"
      >
        共找到 {{ filteredPets.length }} 只符合条件的待领养宠物
      </section>

      <!-- Pet cards -->
      <section
        v-if="filteredPets.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <article
          v-for="pet in filteredPets"
          :key="pet.id"
          class="bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden flex flex-col"
        >
          <RouterLink
            :to="{ name: 'PetDetail', params: { id: pet.id } }"
            class="block hover:shadow-md transition-shadow duration-150 flex-1 flex flex-col"
          >
            <div class="bg-orange-100 dark:bg-orange-900/20 h-56 flex items-center justify-center">
              <span class="text-gray-400 dark:text-gray-500">
                {{ pet.photoText }}
              </span>
            </div>

            <div class="p-6 flex-grow flex flex-col">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
                {{ pet.name }}
              </h3>
            <div class="my-4">
              <span
                v-if="pet.adoption_status === 'available'"
                class="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-yellow-800 dark:text-yellow-300 bg-yellow-200 dark:bg-yellow-900/50"
              >
                短期领养
              </span>
              <span
                v-else
                class="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-zinc-700/80"
              >
                长期领养
              </span>
            </div>

              <div class="mt-auto pt-4 flex justify-end items-center gap-3">
                <span class="text-sm text-gray-600 dark:text-gray-300">
                  {{ pet.adoption_status === 'available' ? '短期收养者' : '长期收养者' }}: {{ pet.fosterer }}
                </span>
                <button
                  class="flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-md bg-primary text-white bg-orange-500 transition-colors"
                  type="button"
                  @click.stop
                >
                  <span class="material-icons text-base">chat_bubble_outline</span>
                  <span>联系TA</span>
                </button>
              </div>
            </div>
          </RouterLink>
        </article>
      </section>

      <!-- Empty state illustration -->
      <section
        v-else
        class="mt-8 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400"
      >
        <span class="material-icons text-5xl mb-3 text-gray-300 dark:text-gray-600">
          pets
        </span>
        <p class="text-base font-medium mb-1">暂时没有符合条件的宠物</p>
        <p class="text-sm">可以尝试修改筛选条件，或稍后再来看看新发布的待领养宠物。</p>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-slate-800 dark:bg-zinc-950 text-slate-300 mt-12">
      <div class="container mx-auto px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-white">数据统计</h3>
            <p class="mt-2 text-sm max-w-md">
              我们与多家救助站建立了长期合作关系，致力于为流浪动物提供更好的临时安置和长期领养服务。
            </p>
            <a
              class="mt-4 inline-block text-primary hover:text-orange-300 transition-colors text-sm"
              href="#"
            >
              查看合作救助站 →
            </a>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-white">联系开发团队</h3>
            <p class="mt-2 text-sm max-w-md">
              如果您有任何问题、建议或合作意向，请随时联系我们的开发团队。
            </p>
            <div class="mt-4 flex space-x-4">
              <a class="text-2xl hover:text-white" href="#">💬</a>
              <a class="text-2xl hover:text-white" href="#">💌</a>
              <a class="text-2xl hover:text-white" href="#">🌐</a>
            </div>
          </div>
        </div>

        <div
          class="border-t border-slate-700 dark:border-zinc-800 mt-8 pt-6 text-center text-sm text-slate-400"
        >
          <p>© 2025 FUREVERHOME流浪动物领养平台 - 让每个生命都有温暖的家</p>
        </div>
      </div>
    </footer>
  </div>
</template>
