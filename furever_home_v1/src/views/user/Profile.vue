<template>
  <div class="min-h-screen" style="background-color: #FFF9F0;">
    <main class="max-w-6xl mx-auto px-5 py-8">
      <!-- 返回按钮 -->
      <!-- <RouterLink to="/" class="inline-flex items-center gap-2 px-4 py-2 mb-5 text-white font-medium rounded-full transition-all hover:opacity-90 hover:-translate-y-0.5" style="background-color: #FF8C42;">
        ← 返回
      </RouterLink> -->

      <div class="flex flex-wrap bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
        <!-- 左侧边栏 -->
        <div class="flex-1 min-w-[300px] p-8" style="background-color: #FFF9F0;">
          <!-- 用户头像和信息 -->
          <div class="flex items-center mb-5">
            <div 
              class="w-20 h-20 rounded-full mr-5 flex items-center justify-center font-bold text-gray-600 text-2xl cursor-pointer transition-transform hover:scale-105 overflow-hidden" 
              style="background-color: #FFD700;"
              @click="router.push({ name: 'UserProfile', params: { userId: viewedUserId } })"
            >
              <img
                v-if="user.avatarUrl"
                :src="user.avatarUrl"
                alt="用户头像"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ user.name.charAt(0) }}</span>
            </div>
            <div>
              <h1 
                class="text-2xl mb-1 cursor-pointer transition-colors hover:text-[#E67A2A]" 
                style="color: #FF8C42;"
                @click="router.push({ name: 'UserProfile', params: { userId: viewedUserId } })"
              >
                {{ user.name }}
              </h1>
            </div>
          </div>
          <!-- 个人中心按钮（仅在自己的主页显示） -->
          <RouterLink 
            v-if="isOwnProfile"
            to="/user-center" 
            class="block w-full px-4 py-2.5 mb-5 text-center text-white font-semibold rounded-2xl transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            style="background-color: #FF8C42;"
          >
            个人中心
          </RouterLink>
          <!-- 联系TA按钮（仅在他人主页显示） -->
          <RouterLink 
            v-if="!isOwnProfile"
            :to="{ name: 'Communication', query: { userId: viewedUserId } }" 
            class="block w-full px-4 py-2.5 mb-5 text-center text-white font-semibold rounded-2xl transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            style="background-color: #FF8C42;"
          >
            联系TA
          </RouterLink>

          <!-- 基本信息 -->
          <h2 class="text-xl my-6 pb-2.5 border-b-2" style="color: #FF8C42; border-color: #FFF9F0;">基本信息</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="py-2.5" v-for="info in baseInfo" :key="info.label" :class="info.spanAll ? 'col-span-2' : ''">
              <div class="font-bold text-gray-600 mb-1">{{ info.label }}</div>
              <div>{{ info.value }}</div>
            </div>
          </div>

          <!-- 勋章区域 -->
          <h2 class="text-xl my-6 pb-2.5 border-b-2" style="color: #FF8C42; border-color: #FFF9F0;">TA的勋章</h2>
          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="badge in badges" 
              :key="badge.id" 
              class="h-30 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 text-sm text-center p-2.5"
            >
              {{ badge.name }}
            </div>
          </div>
        </div>

        <!-- 右侧主内容 -->
        <div class="flex-[2] min-w-[300px] p-8">
          <!-- 爱宠证明档案 -->
          <h2 class="text-xl my-6 pb-2.5 border-b-2" style="color: #FF8C42; border-color: #FFF9F0;">爱宠证明档案</h2>
      <h3 class="font-semibold text-gray-700 mb-2">爱宠证明简介</h3>
      <p class="mb-4 text-gray-600 leading-7">
        {{ proofIntro || experiences.map(exp => exp.text).join(' ') }}
          </p>

          <h3 class="font-semibold text-gray-700 mb-2">证明材料</h3>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 mt-4">
            <div 
              v-for="proof in proofs" 
              :key="proof.id" 
              class="h-30 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 text-sm text-center p-2.5 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
              @click="openProofPreview(proof)"
            >
              <template v-if="proof.fileUrl">
                <img :src="proof.fileUrl" alt="爱宠证明" class="w-full h-full object-cover" />
              </template>
              <template v-else>
                {{ proof.title }}
              </template>
            </div>
          </div>

          <!-- 信誉积分 -->
          <h2 class="text-xl my-6 pb-2.5 border-b-2" style="color: #FF8C42; border-color: #FFF9F0;">信誉积分</h2>
          <div class="flex items-center mb-5">
            <div class="text-4xl font-bold mr-4" style="color: #FF8C42;">{{ rating.score.toFixed(1) }}</div>
            <div>
              <div class="text-yellow-400 text-xl mb-1">★★★★★</div>
              <div class="text-gray-600 text-sm">基于{{ rating.total }}条评价</div>
            </div>
          </div>

          <!-- 他人评价 -->
          <div class="flex justify-between items-center my-6 pb-2.5 border-b-2" style="border-color: #FFF9F0;">
            <h2 class="text-xl m-0" style="color: #FF8C42;">他人评价</h2>
            <!-- 添加评价按钮（仅在他人主页显示） -->
            <button 
              v-if="!isOwnProfile"
              type="button" 
              class="px-5 py-2.5 text-white font-bold rounded-2xl cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
              style="background-color: #FF8C42;"
              @click="showReviewModal = true"
            >
              添加评价
            </button>
          </div>

          <div class="mt-5">
            <div 
              v-for="eva in evaluations.slice(0, 2)" 
              :key="eva.id" 
              class="bg-white rounded-2xl p-4 mb-4 shadow-sm"
            >
              <div class="flex justify-between mb-2.5">
                <div 
                  class="font-bold cursor-pointer transition-colors hover:text-[#FF8C42]"
                  @click="router.push({ name: 'UserProfile', params: { userId: getUserIdByName(eva.author) } })"
                >
                  {{ eva.author }}
                </div>
                <div class="text-gray-500 text-sm">{{ eva.date }}</div>
              </div>
              <div class="text-yellow-400 mb-1">
                <span v-for="i in 5" :key="i">{{ i <= eva.stars ? '★' : '☆' }}</span>
              </div>
              <div class="text-gray-600 leading-relaxed">{{ eva.content }}</div>
            </div>
          </div>

          <div class="flex justify-center mt-5">
            <button 
              type="button" 
              class="px-5 py-2.5 font-bold rounded-2xl cursor-pointer transition-all border-2 hover:bg-[#FF8C42] hover:text-white hover:border-[#FF8C42]"
              style="background-color: transparent; border-color: #FF8C42; color: #FF8C42;"
              @click="openReviewsModal"
            >
              查看全部评价
            </button>
          </div>

          <!-- TA领养的宠物 -->
          <h2 class="text-xl my-6 pb-2.5 border-b-2 m-0" style="color: #FF8C42; border-color: #FFF9F0;">TA领养的宠物</h2>

          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold text-gray-700">短期领养</h3>
            <button 
              type="button" 
              class="px-4 py-1.5 text-sm text-white font-semibold rounded-xl cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
              style="background-color: #FF8C42;"
              @click="openShortTermPetsModal"
            >
              查看全部
            </button>
          </div>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 mb-8">
            <div 
              v-for="pet in shortTermAdoptions.slice(0, 2)" 
              :key="pet.id" 
              class="bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:-translate-y-1 cursor-pointer"
              @click="router.push({ name: 'PetDetail', params: { id: pet.id } })"
            >
              <div class="h-38 flex items-center justify-center text-gray-600" style="background-color: #FFE4B5;">
                {{ pet.name }}的照片
              </div>
              <div class="p-4">
                <div class="text-lg mb-1" style="color: #FF8C42;">{{ pet.name }}</div>
                <div class="text-gray-600 mb-2.5 text-sm">{{ pet.desc }}</div>
                <div class="inline-block px-3 py-1 rounded-2xl text-xs font-bold mb-2.5" style="background-color: #FFF3CD; color: #856404;">
                  短期领养
                </div>
                <div class="text-center text-sm py-2 px-2 rounded" style="background-color: #FFF9F0; margin-top: 10px;">
                  已短期领养 {{ pet.days }} 天
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold text-gray-700">长期领养</h3>
            <button 
              type="button" 
              class="px-4 py-1.5 text-sm text-white font-semibold rounded-xl cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
              style="background-color: #FF8C42;"
              @click="openLongTermPetsModal"
            >
              查看全部
            </button>
          </div>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 mb-8">
            <div 
              v-for="pet in longTermAdoptions.slice(0, 2)" 
              :key="pet.id" 
              class="bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:-translate-y-1 cursor-pointer"
              @click="router.push({ name: 'PetDetail', params: { id: pet.id } })"
            >
              <div class="h-38 flex items-center justify-center text-gray-600" style="background-color: #FFE4B5;">
                {{ pet.name }}的照片
              </div>
              <div class="p-4">
                <div class="text-lg mb-1" style="color: #FF8C42;">{{ pet.name }}</div>
                <div class="text-gray-600 mb-2.5 text-sm">{{ pet.desc }}</div>
                <div class="inline-block px-3 py-1 rounded-2xl text-xs font-bold mb-2.5" style="background-color: #D1FAE5; color: #059669;">
                  长期领养
                </div>
                <div class="text-center text-sm py-2 px-2 rounded" style="background-color: #FFF9F0; margin-top: 10px;">
                  已长期领养 {{ pet.days }} 天
                </div>
              </div>
            </div>
          </div>

          <!-- TA最近发布的帖子 -->
          <div class="flex justify-between items-center my-6 pb-2.5 border-b-2" style="border-color: #FFF9F0;">
            <h2 class="text-xl m-0" style="color: #FF8C42;">TA最近发布的帖子</h2>
            <button 
              type="button" 
              class="px-5 py-2.5 text-white font-bold rounded-2xl cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
              style="background-color: #FF8C42;"
              @click="openPostsModal"
            >
              查看全部
            </button>
          </div>

          <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 mt-5">
            <div 
              v-for="post in recentPosts.slice(0, 2)" 
              :key="post.id" 
              class="bg-white rounded-2xl p-5 shadow-md cursor-pointer transition-transform hover:-translate-y-1"
              @click="router.push({ name: 'PostDetail', params: { id: post.id } })"
            >
              <h3 class="text-lg mb-2.5" style="color: #FF8C42;">{{ post.title }}</h3>
              <div class="text-gray-500 text-sm mb-2.5">{{ post.date }}</div>
              <div class="text-gray-600 leading-relaxed mb-4">{{ post.summary }}</div>
              <div class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5 my-4">
                <div class="w-full h-38 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                  帖子图片
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 评价模态框 -->
    <div 
      v-if="showReviewModal" 
      class="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center"
      @click.self="showReviewModal = false"
    >
      <div class="bg-white rounded-2xl w-[90%] max-w-4xl max-h-[80vh] p-8 shadow-xl overflow-y-auto">
        <h2 class="mb-5 text-center" style="color: #FF8C42;">添加评价</h2>
        <div class="mb-5">
          <div class="block mb-2 font-bold">评分</div>
          <div class="flex gap-1.5 mb-2.5">
            <span 
              v-for="i in 5" 
              :key="i" 
              class="text-2xl cursor-pointer transition-colors"
              :class="i <= currentRating ? 'text-yellow-400' : 'text-gray-300'"
              @click="currentRating = i"
            >
              ★
            </span>
          </div>
        </div>
        <div class="mb-5">
          <label class="block mb-2 font-bold" for="reviewText">评价内容</label>
          <textarea 
            id="reviewText" 
            v-model="reviewText"
            class="w-full p-2.5 border border-gray-300 rounded-2xl text-base h-30 resize-y"
            placeholder="请输入您的评价..."
          ></textarea>
        </div>
        <div class="flex justify-end gap-2.5">
          <button 
            type="button" 
            class="px-5 py-2.5 font-bold rounded-2xl cursor-pointer transition-all hover:opacity-90"
            style="background-color: #4A90E2; color: white;"
            @click="showReviewModal = false"
          >
            取消
          </button>
          <button 
            type="button" 
            class="px-5 py-2.5 text-white font-bold rounded-2xl cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            style="background-color: #FF8C42;"
            @click="submitReview"
          >
            提交评价
          </button>
        </div>
      </div>
    </div>

    <!-- 全部评价模态框 -->
    <div 
      v-if="showAllReviewsModal" 
      class="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center"
      @click.self="showAllReviewsModal = false"
    >
      <div class="bg-white rounded-2xl w-[90%] max-w-4xl max-h-[80vh] p-8 shadow-xl flex flex-col">
        <h2 class="mb-5 text-center" style="color: #FF8C42;">全部评价 ({{ evaluations.length }})</h2>
        <div class="flex-1 overflow-y-auto mb-5">
          <div class="flex flex-col gap-4">
            <div 
              v-for="eva in paginatedEvaluations" 
              :key="eva.id" 
              class="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div class="flex justify-between mb-2.5">
                <div 
                  class="font-bold cursor-pointer transition-colors hover:text-[#FF8C42]"
                  @click="router.push({ name: 'UserProfile', params: { userId: getUserIdByName(eva.author) } })"
                >
                  {{ eva.author }}
                </div>
                <div class="text-gray-500 text-sm">{{ eva.date }}</div>
              </div>
              <div class="text-yellow-400 mb-1">
                <span v-for="i in 5" :key="i">{{ i <= eva.stars ? '★' : '☆' }}</span>
              </div>
              <div class="text-gray-600 leading-relaxed">{{ eva.content }}</div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div class="flex justify-center mt-10 mb-5">
          <div class="flex gap-2.5">
            <button 
              v-if="currentReviewPage > 1"
              class="w-10 h-10 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              style="color: #6B7280;"
              @click="currentReviewPage--"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              v-for="page in totalReviewPages" 
              :key="page"
              class="w-10 h-10 rounded-lg border border-gray-300 text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              :class="page === currentReviewPage ? 'bg-[#FF8C00] text-white border-[#FF8C00]' : 'bg-white text-gray-600'"
              @click="currentReviewPage = page"
            >
              {{ page }}
            </button>
            <button 
              v-if="currentReviewPage < totalReviewPages"
              class="w-10 h-10 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              style="color: #6B7280;"
              @click="currentReviewPage++"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="flex justify-end mt-5">
          <button 
            type="button" 
            class="px-5 py-2.5 text-white font-bold rounded-2xl cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            style="background-color: #FF8C42;"
            @click="showAllReviewsModal = false"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 全部短期领养宠物模态框 -->
    <div 
      v-if="showShortTermPetsModal" 
      class="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center"
      @click.self="showShortTermPetsModal = false"
    >
      <div class="bg-white rounded-2xl w-[90%] max-w-4xl max-h-[80vh] p-8 shadow-xl flex flex-col">
        <h2 class="mb-5 text-center" style="color: #FF8C42;">TA短期领养的全部宠物 ({{ shortTermAdoptions.length }})</h2>
        <div class="flex-1 overflow-y-auto mb-5">
          <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
            <div 
              v-for="pet in paginatedShortTermPets" 
              :key="pet.id" 
              class="bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:-translate-y-1 cursor-pointer"
              @click="router.push({ name: 'PetDetail', params: { id: pet.id } })"
            >
              <div class="h-38 flex items-center justify-center text-gray-600" style="background-color: #FFE4B5;">
                {{ pet.name }}的照片
              </div>
              <div class="p-4">
                <div class="text-lg mb-1" style="color: #FF8C42;">{{ pet.name }}</div>
                <div class="text-gray-600 mb-2.5 text-sm">{{ pet.desc }}</div>
                <div class="inline-block px-3 py-1 rounded-2xl text-xs font-bold mb-2.5" style="background-color: #FFF3CD; color: #856404;">
                  短期领养
                </div>
                <div class="text-center text-sm py-2 px-2 rounded" style="background-color: #FFF9F0; margin-top: 10px;">
                  已短期领养 {{ pet.days }} 天
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div class="flex justify-center mt-10 mb-5">
          <div class="flex gap-2.5">
            <button 
              v-if="currentShortTermPage > 1"
              class="w-10 h-10 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              style="color: #6B7280;"
              @click="currentShortTermPage--"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              v-for="page in totalShortTermPages" 
              :key="page"
              class="w-10 h-10 rounded-lg border border-gray-300 text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              :class="page === currentShortTermPage ? 'bg-[#FF8C00] text-white border-[#FF8C00]' : 'bg-white text-gray-600'"
              @click="currentShortTermPage = page"
            >
              {{ page }}
            </button>
            <button 
              v-if="currentShortTermPage < totalShortTermPages"
              class="w-10 h-10 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              style="color: #6B7280;"
              @click="currentShortTermPage++"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="flex justify-end mt-5">
          <button 
            type="button" 
            class="px-5 py-2.5 text-white font-bold rounded-2xl cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            style="background-color: #FF8C42;"
            @click="showShortTermPetsModal = false"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 全部长期领养宠物模态框 -->
    <div 
      v-if="showLongTermPetsModal" 
      class="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center"
      @click.self="showLongTermPetsModal = false"
    >
      <div class="bg-white rounded-2xl w-[90%] max-w-4xl max-h-[80vh] p-8 shadow-xl flex flex-col">
        <h2 class="mb-5 text-center" style="color: #FF8C42;">TA长期领养的全部宠物 ({{ longTermAdoptions.length }})</h2>
        <div class="flex-1 overflow-y-auto mb-5">
          <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
            <div 
              v-for="pet in paginatedLongTermPets" 
              :key="pet.id" 
              class="bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:-translate-y-1 cursor-pointer"
              @click="router.push({ name: 'PetDetail', params: { id: pet.id } })"
            >
              <div class="h-38 flex items-center justify-center text-gray-600" style="background-color: #FFE4B5;">
                {{ pet.name }}的照片
              </div>
              <div class="p-4">
                <div class="text-lg mb-1" style="color: #FF8C42;">{{ pet.name }}</div>
                <div class="text-gray-600 mb-2.5 text-sm">{{ pet.desc }}</div>
                <div class="inline-block px-3 py-1 rounded-2xl text-xs font-bold mb-2.5" style="background-color: #D1FAE5; color: #059669;">
                  长期领养
                </div>
                <div class="text-center text-sm py-2 px-2 rounded" style="background-color: #FFF9F0; margin-top: 10px;">
                  已长期领养 {{ pet.days }} 天
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div class="flex justify-center mt-10 mb-5">
          <div class="flex gap-2.5">
            <button 
              v-if="currentLongTermPage > 1"
              class="w-10 h-10 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              style="color: #6B7280;"
              @click="currentLongTermPage--"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              v-for="page in totalLongTermPages" 
              :key="page"
              class="w-10 h-10 rounded-lg border border-gray-300 text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              :class="page === currentLongTermPage ? 'bg-[#FF8C00] text-white border-[#FF8C00]' : 'bg-white text-gray-600'"
              @click="currentLongTermPage = page"
            >
              {{ page }}
            </button>
            <button 
              v-if="currentLongTermPage < totalLongTermPages"
              class="w-10 h-10 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              style="color: #6B7280;"
              @click="currentLongTermPage++"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="flex justify-end mt-5">
          <button 
            type="button" 
            class="px-5 py-2.5 text-white font-bold rounded-2xl cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            style="background-color: #FF8C42;"
            @click="showLongTermPetsModal = false"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 全部帖子模态框 -->
    <div 
      v-if="showAllPostsModal" 
      class="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center"
      @click.self="showAllPostsModal = false"
    >
      <div class="bg-white rounded-2xl w-[90%] max-w-4xl max-h-[80vh] p-8 shadow-xl flex flex-col">
        <h2 class="mb-5 text-center" style="color: #FF8C42;">TA发布的全部帖子 ({{ allPosts.length }})</h2>
        <div class="flex-1 overflow-y-auto mb-5">
          <div class="flex flex-col gap-5">
            <div 
              v-for="post in paginatedPosts" 
              :key="post.id" 
              class="bg-white rounded-2xl shadow-lg p-6 transition-transform hover:-translate-y-1 cursor-pointer"
              @click="router.push({ name: 'PostDetail', params: { id: post.id } })"
            >
              <div class="flex flex-col gap-2 mb-4">
                <div class="flex items-center gap-3 text-gray-600 text-sm">
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-semibold cursor-pointer transition-transform hover:scale-105" 
                      style="background-color: #F3C697;"
                      @click.stop="router.push({ name: 'UserProfile', params: { userId: viewedUserId } })"
                    >
                      {{ user.name.charAt(0) }}
                    </div>
                    <span 
                      class="cursor-pointer transition-colors hover:text-[#FF8C42]"
                      @click.stop="router.push({ name: 'UserProfile', params: { userId: viewedUserId } })"
                    >
                      {{ user.name }}
                    </span>
                  </div>
                  <span>{{ post.date }}</span>
                </div>
                <div class="text-xl font-bold leading-tight" style="color: #FF8C42;">{{ post.title }}</div>
              </div>
              <div class="text-gray-800 mb-4 leading-relaxed">{{ post.summary }}</div>
              <div class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5 my-4">
                <div class="w-full h-38 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                  帖子图片
                </div>
              </div>
              <div class="flex gap-5 text-gray-600 text-sm border-t border-gray-200 pt-4">
                <div class="flex items-center gap-1.5">❤️ 128</div>
                <div class="flex items-center gap-1.5">💬 42</div>
                <div class="flex items-center gap-1.5">👁️ 568</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div class="flex justify-center mt-10 mb-5">
          <div class="flex gap-2.5">
            <button 
              v-if="currentPostPage > 1"
              class="w-10 h-10 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              style="color: #6B7280;"
              @click="currentPostPage--"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              v-for="page in totalPostPages" 
              :key="page"
              class="w-10 h-10 rounded-lg border border-gray-300 text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              :class="page === currentPostPage ? 'bg-[#FF8C00] text-white border-[#FF8C00]' : 'bg-white text-gray-600'"
              @click="currentPostPage = page"
            >
              {{ page }}
            </button>
            <button 
              v-if="currentPostPage < totalPostPages"
              class="w-10 h-10 rounded-lg border border-gray-300 bg-white text-base cursor-pointer flex items-center justify-center transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              style="color: #6B7280;"
              @click="currentPostPage++"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="flex justify-end mt-5">
          <button 
            type="button" 
            class="px-5 py-2.5 text-white font-bold rounded-2xl cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            style="background-color: #FF8C42;"
            @click="showAllPostsModal = false"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 评价成功弹窗 -->
    <SuccessModal
      :visible="showReviewSuccessModal"
      title="评价提交成功！"
      message="您的评价已成功提交。"
      @close="closeReviewSuccessModal"
    />

    <!-- 评价错误/提示弹窗 -->
    <ErrorModal
      :visible="showReviewErrorModal"
      title="提示"
      :message="reviewErrorMessage"
      @close="closeReviewErrorModal"
    />

    <!-- Footer -->
    <footer class="text-white py-10 mt-12 px-[5%]" style="background-color: #2C3E50;">
      <div class="flex flex-wrap justify-between max-w-6xl mx-auto">
        <div class="flex-1 min-w-[250px] mb-5">
          <h3 class="mb-5 text-lg font-bold">数据统计</h3>
          <p class="text-sm leading-loose mb-2">我们与多家救助站建立了长期合作关系，致力于为流浪动物提供更好的临时安置和长期领养服务。</p>
          <RouterLink to="/shelters" class="text-sm hover:underline mt-2 inline-block" style="color: #FF8C42;">查看合作救助站 →</RouterLink>
        </div>
        <div class="flex-1 min-w-[250px] mb-5">
          <h3 class="mb-5 text-lg font-bold">联系开发团队</h3>
          <p class="text-sm leading-loose mb-2">如果您有任何问题、建议或合作意向，请随时联系我们的开发团队。</p>
          <div class="flex gap-3 mt-2 items-center">
            <span class="text-2xl">💬</span>
            <span class="text-2xl">💌</span>
            <span class="text-2xl">🌐</span>
          </div>
        </div>
      </div>
      <div class="text-center pt-5 mt-5 border-t border-white border-opacity-10 text-sm">
        <p>2025 FUREVERHOME流浪动物领养平台 - 让每个生命都有温暖的家</p>
      </div>
    </footer>
  </div>

  <!-- 爱宠证明大图预览 -->
  <div
    v-if="showProofPreview"
    class="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center"
    @click.self="closeProofPreview"
  >
    <div class="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-xl">
      <button
        type="button"
        class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center text-lg cursor-pointer"
        @click="closeProofPreview"
      >
        ×
      </button>
      <img
        v-if="previewProofUrl"
        :src="previewProofUrl"
        alt="爱宠证明预览"
        class="max-w-[90vw] max-h-[90vh] object-contain block"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import SuccessModal from '../../components/common/SuccessModal.vue';
import ErrorModal from '../../components/common/ErrorModal.vue';
import { getCurrentUser, getUserById, type CurrentUserInfo } from '../../api/userApi';
import { getUserPosts, type 帖子公开信息 } from '../../api/postApi';
import { getUserShortAnimals, getUserLongAnimals, type 动物公开信息 } from '../../api/animalApi';
import { getOthersRatings, getReceivedRatings, addMyRating, type ReceivedRatingItemDTO } from '../../api/ratingApi';

const router = useRouter();
const route = useRoute();

// 获取当前登录用户ID
const currentUserId = ref<number | null>(null);

// 获取查看的用户ID（从路由参数获取，如果没有参数则认为是查看自己的主页）
const viewedUserId = computed(() => {
  const userId = route.params.userId;
  return userId ? Number(userId) : (currentUserId.value ?? 0);
});

// 判断是否是查看自己的主页
const isOwnProfile = computed(() => {
  return currentUserId.value !== null && viewedUserId.value === currentUserId.value;
});

interface Stat { key: string; label: string; value: number; }
interface Experience { id: number; text: string; }
interface Proof { id: number; title: string; status: 'approved' | 'pending' | 'rejected'; reason?: string; fileUrl?: string; }
interface Evaluation { id: number; author: string; stars: number; content: string; date: string; appealable?: boolean; }
interface AdoptionPet { id: number; name: string; gender: string; desc: string; days: number; status: 'approved' | 'pending' | 'rejected'; statusLabel: string; bgClass: string; titleClass: string; reason?: string; }
interface Post { id: number; title: string; date: string; summary: string; status: 'approved' | 'pending' | 'rejected'; statusLabel: string; colorClass: string; reason?: string; }
interface Badge { id: number; name: string; }

const user = ref({
  name: '用户',
  avatarUrl: '',
  title: '爱心铲屎官',
  bio: '大家好！我是一名大学生，也是一名热爱动物的志愿者。我致力于校园流浪动物的救助与临时寄养，希望成为这些小生命寻找温暖的家。',
  stats: [
    { key: 'helpTimes', label: '帮助次数', value: 96 },
    { key: 'rescues', label: '救助宠物', value: 5 }
  ] as Stat[]
});

interface BaseInfo {
  label: string;
  value: string;
  spanAll?: boolean;
}

const baseInfo = ref<BaseInfo[]>([
  { label: '年龄', value: '-' },
  { label: '性别', value: '-' },
  { label: '所在地', value: '-' },
  { label: '邮箱', value: '-' },
  { label: '注册时间', value: '-' }
]);

const badges = ref<Badge[]>([
  { id: 1, name: '爱心救助者' },
  { id: 2, name: '优秀志愿者' },
  { id: 3, name: '长期贡献者' }
]);

const experiences = ref<Experience[]>([
  { id: 1, text: '2021-2023年 饲养金毛犬"旺财" - 负责任照顾，包括日常护理、定期带去宠物医院体检' },
  { id: 2, text: '2020-至今 救助并寄养校园流浪猫狗 - 跨校区协作，协助它们寻找合适的领养家庭' }
]);

const proofs = ref<Proof[]>([
  { id: 1, title: '护宠证书照片', status: 'approved' },
  { id: 2, title: '宠物饲养保证书', status: 'approved' },
  { id: 3, title: '动物救助服务证书', status: 'approved' }
]);

const proofIntro = ref<string>('');

// 他人评价列表（从接口获取）
const evaluations = ref<Evaluation[]>([]);
// 信誉积分（平均分 & 评价总数），默认值先占位，实际加载后按接口更新
const rating = ref({ score: 0, total: 0 });

const shortTermAdoptions = ref<AdoptionPet[]>([]);
const longTermAdoptions = ref<AdoptionPet[]>([]);

// 帖子数据（从接口获取）
const recentPosts = ref<Post[]>([]);
const allPosts = ref<Post[]>([]);
const totalPostCount = ref(0);

// 加载评价列表：
// - 查看自己的主页：使用 /rating/received（别人对“我”的评价）
// - 查看他人主页：使用 /rating/others/{targetUserId}（别人对“TA”的评价）
async function loadUserRatings() {
  const userId = viewedUserId.value;
  if (!userId) return;
  try {
    const params = { page: 1, pageSize: 50 };
    const res = isOwnProfile.value
      ? await getReceivedRatings(params)
      : await getOthersRatings(userId, params);
    if ((res.code === 0 || res.code === 200) && res.data) {
      const records: ReceivedRatingItemDTO[] = res.data.records ?? [];
      const mapped: Evaluation[] = records.map((item, index) => {
        const raw = item.createTime ? String(item.createTime) : '';
        let date = '';
        if (raw) {
          date = raw.includes('T') ? raw.split('T')[0] : raw;
        }
        return {
          id: item.ratingId ?? index + 1,
          author: item.otherUserName ?? '用户',
          authorId: item.otherUserId ?? 0,
          stars: item.score ?? 0,
          content: item.content ?? '',
          date,
        } as Evaluation;
      });
      evaluations.value = mapped;
      if (mapped.length > 0) {
        const totalScore = mapped.reduce((sum, ev) => sum + ev.stars, 0);
        rating.value.score = totalScore / mapped.length;
        rating.value.total = mapped.length;
      } else {
        rating.value.score = 0;
        rating.value.total = 0;
      }
    } else {
      console.error('获取他人评价列表失败(Profile)', res);
    }
  } catch (e) {
    console.error('获取他人评价列表异常(Profile)', e);
  }
}

function applyUserData(data: CurrentUserInfo, options?: { asCurrent?: boolean }) {
  if (options?.asCurrent && data.userId) {
    currentUserId.value = data.userId;
  }
  if (data.userName) {
    user.value.name = data.userName;
  }
  user.value.avatarUrl = data.avatarUrl || '';
  baseInfo.value = [
    { label: '年龄', value: data.userAge != null ? String(data.userAge) : '-' },
    { label: '性别', value: data.sex || '-' },
    { label: '所在地', value: data.location || '-' },
    { label: '邮箱', value: data.email || '-' },
    { label: '注册时间', value: data.createTime || '-' }
  ];

  proofIntro.value = data.proofText || proofIntro.value;

  if (data.proofPhoto && data.proofPhoto.length) {
    proofs.value = data.proofPhoto.map((url, index) => ({
      id: index + 1,
      title: `爱宠证明 ${index + 1}`,
      status: 'approved',
      fileUrl: url
    }));
  }
}

// 加载他人短期领养宠物列表
async function loadUserShortAnimals() {
  const userId = viewedUserId.value;
  if (!userId) return;
  try {
    const res = await getUserShortAnimals(userId, { page: 1, pageSize: 50 });
    if ((res.code === 0 || res.code === 200) && res.data) {
      const records: 动物公开信息[] = res.data.records ?? [];
      const mapped: AdoptionPet[] = records.map((item, index) => {
        const id = item.animalId ?? index + 1;
        const name = item.animalName ?? '';
        const gender = item.gender ?? '';
        const species = item.species ?? '';
        const ageText = item.animalAge != null ? `${item.animalAge}岁` : '';
        const sterilizedText = item.isSterilized ?? '';
        const descParts = [species, ageText, sterilizedText].filter(Boolean);
        const desc = descParts.join(' · ');
        const days = item.adoptionDays ?? 0;
        return {
          id,
          name,
          gender: String(gender),
          desc,
          days,
          status: 'approved',
          statusLabel: '短期领养',
          bgClass: '',
          titleClass: '',
          reason: ''
        } as AdoptionPet;
      });
      shortTermAdoptions.value = mapped;
    } else {
      console.error('获取他人短期宠物列表失败', res);
    }
  } catch (e) {
    console.error('获取他人短期宠物列表异常', e);
  }
}

function loadUserFromCache() {
  try {
    const cached = localStorage.getItem('currentUser');
    if (cached) {
      const me = JSON.parse(cached) as CurrentUserInfo;
      applyUserData(me, { asCurrent: true });
    }
  } catch (e) {
    console.error('解析缓存用户信息失败', e);
  }
}

async function loadUserFromApi() {
  try {
    const res = await getCurrentUser();
    if ((res.code === 0 || res.code === 200) && res.data) {
      applyUserData(res.data, { asCurrent: true });
      localStorage.setItem('currentUser', JSON.stringify(res.data));
    }
  } catch (e) {
    console.error('获取当前用户信息失败(Profile)', e);
  }
}

// 根据路由中的 userId 加载他人主页信息
async function loadViewedUserFromApi() {
  const userId = viewedUserId.value;
  if (!userId || userId === currentUserId.value) {
    return;
  }
  try {
    const res = await getUserById(userId);
    if ((res.code === 0 || res.code === 200) && res.data) {
      applyUserData(res.data, { asCurrent: false });
    } else {
      console.error('获取他人用户信息失败(Profile)', res);
    }
  } catch (e) {
    console.error('获取他人用户信息异常(Profile)', e);
  }
}

// 模态框状态
const showReviewModal = ref(false);
const showAllReviewsModal = ref(false);
const showAllPetsModal = ref(false);
const showShortTermPetsModal = ref(false);
const showLongTermPetsModal = ref(false);
const showAllPostsModal = ref(false);
const currentRating = ref(0);
const reviewText = ref('');
const showProofPreview = ref(false);
const previewProofUrl = ref<string | null>(null);

// 分页相关状态
const reviewsPerPage = 5; // 评论每页显示5条
const petsPerPage = 6; // 宠物每页显示6条
const postsPerPage = 3; // 帖子每页显示3条

const currentReviewPage = ref(1);
const currentShortTermPage = ref(1);
const currentLongTermPage = ref(1);
const currentPostPage = ref(1);

// 分页计算属性
const totalReviewPages = computed(() => Math.ceil(evaluations.value.length / reviewsPerPage));
const paginatedEvaluations = computed(() => {
  const start = (currentReviewPage.value - 1) * reviewsPerPage;
  const end = start + reviewsPerPage;
  return evaluations.value.slice(start, end);
});

const totalShortTermPages = computed(() => Math.ceil(shortTermAdoptions.value.length / petsPerPage));
const paginatedShortTermPets = computed(() => {
  const start = (currentShortTermPage.value - 1) * petsPerPage;
  const end = start + petsPerPage;
  return shortTermAdoptions.value.slice(start, end);
});

const totalLongTermPages = computed(() => Math.ceil(longTermAdoptions.value.length / petsPerPage));
const paginatedLongTermPets = computed(() => {
  const start = (currentLongTermPage.value - 1) * petsPerPage;
  const end = start + petsPerPage;
  return longTermAdoptions.value.slice(start, end);
});

const totalPostPages = computed(() => Math.ceil(allPosts.value.length / postsPerPage));
const paginatedPosts = computed(() => {
  const start = (currentPostPage.value - 1) * postsPerPage;
  const end = start + postsPerPage;
  return allPosts.value.slice(start, end);
});

const allPetsCount = computed(() => shortTermAdoptions.value.length + longTermAdoptions.value.length);

const showReviewSuccessModal = ref(false);
const showReviewErrorModal = ref(false);
const reviewErrorMessage = ref('');

function handleProofClick(proof: Proof) {
  if (proof.status === 'rejected' && proof.reason) {
    reviewErrorMessage.value = '拒绝理由：' + proof.reason + '\n您可以点击"重新提交"按钮再次上传。';
    showReviewErrorModal.value = true;
  }
}

function openProofPreview(proof: Proof) {
  if (proof.fileUrl) {
    previewProofUrl.value = proof.fileUrl;
    showProofPreview.value = true;
  }
}

function closeProofPreview() {
  showProofPreview.value = false;
  previewProofUrl.value = null;
}

async function submitReview() {
  if (currentRating.value === 0) {
    reviewErrorMessage.value = '请选择评分';
    showReviewErrorModal.value = true;
    return;
  }
  if (!reviewText.value.trim()) {
    reviewErrorMessage.value = '请输入评价内容';
    showReviewErrorModal.value = true;
    return;
  }

  const targetUserId = viewedUserId.value;
  if (!targetUserId) {
    reviewErrorMessage.value = '无法获取被评价用户信息，请稍后重试';
    showReviewErrorModal.value = true;
    return;
  }

  try {
    await addMyRating(targetUserId, {
      content: reviewText.value.trim(),
      score: currentRating.value,
    });
    // 提交成功后刷新评价列表和评分
    await loadUserRatings();
    showReviewSuccessModal.value = true;
    showReviewModal.value = false;
    currentRating.value = 0;
    reviewText.value = '';
  } catch (e) {
    console.error('提交评价失败(Profile)', e);
    const msg = (e as any)?.message || '提交评价失败，请稍后重试';
    reviewErrorMessage.value = msg;
    showReviewErrorModal.value = true;
  }
}

function closeReviewSuccessModal() {
  showReviewSuccessModal.value = false;
}

function closeReviewErrorModal() {
  showReviewErrorModal.value = false;
}

// 打开弹窗时重置分页
function openReviewsModal() {
  showAllReviewsModal.value = true;
  currentReviewPage.value = 1;
}

function openShortTermPetsModal() {
  showShortTermPetsModal.value = true;
  currentShortTermPage.value = 1;
}

function openLongTermPetsModal() {
  showLongTermPetsModal.value = true;
  currentLongTermPage.value = 1;
}

function openPostsModal() {
  showAllPostsModal.value = true;
  currentPostPage.value = 1;
}

// 根据用户名获取用户ID（这里应该从API获取，暂时使用映射）
function getUserIdByName(name: string): number {
  const nameToIdMap: Record<string, number> = {
    '张同学': 2,
    '王老师': 3,
    '刘同学': 4,
    '陈学姐': 5,
    '赵同学': 6,
    '孙老师': 7,
    '周同学': 8,
    '吴同学': 9,
    '郑同学': 10,
    '钱老师': 11,
    '李同学': 1,
    '周老师': 12,
    '吴学姐': 13,
    '郑老师': 14,
    '钱同学': 15,
    '冯同学': 16,
    '陈老师': 17,
    '褚同学': 18,
    '卫老师': 19,
    '蒋同学': 20
  };
  return nameToIdMap[name] || 1;
}

// 加载用户帖子列表（他人帖子）
async function loadUserPosts() {
  const userId = viewedUserId.value;
  if (!userId) return;
  try {
    const res = await getUserPosts(userId, { page: 1, pageSize: 50 });
    if ((res.code === 0 || res.code === 200) && res.data) {
      const records: 帖子公开信息[] = res.data.records ?? [];
      const mapped: Post[] = records.map((item, index) => {
        const raw = item.createTime ? String(item.createTime) : '';
        let date: string = '';
        if (raw) {
          date = raw.includes('T') ? raw.split('T')[0] : raw;
        }
        return {
          id: item.postId ?? index + 1,
          title: item.title ?? '',
          date,
          summary: item.content ?? '',
          status: 'approved',
          statusLabel: '已发布',
          colorClass: 'text-orange-500'
        };
      });
      allPosts.value = mapped;
      recentPosts.value = mapped.slice(0, 2);
      totalPostCount.value = res.data.total ?? mapped.length;
    } else {
      console.error('获取用户帖子列表失败', res);
    }
  } catch (e) {
    console.error('获取用户帖子列表异常', e);
  }
}

// 加载他人长期领养宠物列表
async function loadUserLongAnimals() {
  const userId = viewedUserId.value;
  if (!userId) return;
  try {
    const res = await getUserLongAnimals(userId, { page: 1, pageSize: 50 });
    if ((res.code === 0 || res.code === 200) && res.data) {
      const records: 动物公开信息[] = res.data.records ?? [];
      const mapped: AdoptionPet[] = records.map((item, index) => {
        const id = item.animalId ?? index + 1;
        const name = item.animalName ?? '';
        const gender = item.gender ?? '';
        const species = item.species ?? '';
        const ageText = item.animalAge != null ? `${item.animalAge}岁` : '';
        const sterilizedText = item.isSterilized ?? '';
        const descParts = [species, ageText, sterilizedText].filter(Boolean);
        const desc = descParts.join(' · ');
        const days = item.adoptionDays ?? 0;
        return {
          id,
          name,
          gender: String(gender),
          desc,
          days,
          status: 'approved',
          statusLabel: '长期领养',
          bgClass: '',
          titleClass: '',
          reason: ''
        } as AdoptionPet;
      });
      longTermAdoptions.value = mapped;
    } else {
      console.error('获取他人长期宠物列表失败', res);
    }
  } catch (e) {
    console.error('获取他人长期宠物列表异常', e);
  }
}

onMounted(() => {
  loadUserFromCache();
  loadUserFromApi().then(() => {
    // 当前用户信息加载完成后，如果路由上带有 userId 且不是自己，再加载他人信息
    loadViewedUserFromApi();
    // 初始化加载评价/帖子/宠物等数据
    loadUserPosts();
    loadUserShortAnimals();
    loadUserLongAnimals();
    loadUserRatings();
  });
});

// 监听：路由中的 userId 或当前登录用户ID 变化
// 用于区分「查看自己主页」还是「查看他人主页」，并重新加载相关数据
watch(
  () => [viewedUserId.value, currentUserId.value],
  () => {
    loadViewedUserFromApi();
    loadUserPosts();
    loadUserShortAnimals();
    loadUserLongAnimals();
    loadUserRatings();
  },
  { immediate: true }
);
</script>

<style scoped>
</style>
