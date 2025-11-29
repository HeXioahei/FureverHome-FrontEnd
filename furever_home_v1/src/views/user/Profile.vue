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
            <div class="w-20 h-20 rounded-full mr-5 flex items-center justify-center font-bold text-gray-600 text-2xl" style="background-color: #FFD700;">
              {{ user.name.charAt(0) }}
            </div>
            <div>
              <h1 class="text-2xl mb-1" style="color: #FF8C42;">{{ user.name }}</h1>
            </div>
          </div>
          <!-- 个人中心按钮 -->
          <RouterLink 
            to="/user-center" 
            class="block w-full px-4 py-2.5 mb-5 text-center text-white font-semibold rounded-2xl transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            style="background-color: #FF8C42;"
          >
            个人中心
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
          <!-- 个人简介 -->
          <h2 class="text-xl my-6 pb-2.5 border-b-2" style="color: #FF8C42; border-color: #FFF9F0;">个人简介</h2>
          <p class="text-gray-600 leading-relaxed mb-5">{{ user.bio }}</p>

          <!-- 爱宠证明档案 -->
          <h2 class="text-xl my-6 pb-2.5 border-b-2" style="color: #FF8C42; border-color: #FFF9F0;">爱宠证明档案</h2>
          <h3 class="font-semibold text-gray-700 mb-2">养宠经历</h3>
          <ul class="ml-5 mb-4 text-gray-600 leading-7" style="list-style-type: disc;">
            <li v-for="exp in experiences" :key="exp.id">{{ exp.text }}</li>
          </ul>

          <h3 class="font-semibold text-gray-700 mb-2">证明材料</h3>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 mt-4">
            <div 
              v-for="proof in proofs" 
              :key="proof.id" 
              class="h-30 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 text-sm text-center p-2.5 cursor-pointer hover:opacity-80 transition-opacity"
              @click="handleProofClick(proof)"
            >
              {{ proof.title }}
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
            <button 
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
                <div class="font-bold">{{ eva.author }}</div>
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
              class="bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:-translate-y-1"
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
              class="bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:-translate-y-1"
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
              class="bg-white rounded-2xl p-5 shadow-md"
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
                <div class="font-bold">{{ eva.author }}</div>
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
              class="bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:-translate-y-1"
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
              class="bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:-translate-y-1"
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
              class="bg-white rounded-2xl shadow-lg p-6 transition-transform hover:-translate-y-1"
            >
              <div class="flex flex-col gap-2 mb-4">
                <div class="flex items-center gap-3 text-gray-600 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-semibold" style="background-color: #F3C697;">
                      {{ user.name.charAt(0) }}
                    </div>
                    <span>{{ user.name }}</span>
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';

interface Stat { key: string; label: string; value: number; }
interface Experience { id: number; text: string; }
interface Proof { id: number; title: string; status: 'approved' | 'pending' | 'rejected'; reason?: string; }
interface Evaluation { id: number; author: string; stars: number; content: string; date: string; appealable?: boolean; }
interface AdoptionPet { id: number; name: string; gender: string; desc: string; days: number; status: 'approved' | 'pending' | 'rejected'; statusLabel: string; bgClass: string; titleClass: string; reason?: string; }
interface Post { id: number; title: string; date: string; summary: string; status: 'approved' | 'pending' | 'rejected'; statusLabel: string; colorClass: string; reason?: string; }
interface Badge { id: number; name: string; }

const user = ref({
  name: '李同学',
  title: '爱心铲屎官',
  bio: '大家好！我是一名大学生，也是一名热爱动物的志愿者。我致力于校园流浪动物的救助与临时寄养，希望成为这些小生命寻找温暖的家。有3年养宠经验，有护宠证书，有爱心有耐心。',
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
  // { label: '用户名', value: '李同学' },
  { label: '年龄', value: '22' },
  { label: '性别', value: '女' },
  { label: '所在地', value: '大学城校区' },
  { label: '邮箱', value: 'li@example.com' },
  { label: '注册时间', value: '2023年3月' }
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

// 生成50条评价数据
const generateEvaluations = (): Evaluation[] => {
  const authors = ['张同学', '王老师', '刘同学', '陈学姐', '赵同学', '孙老师', '周同学', '吴同学', '郑同学', '钱老师', '李同学', '周老师', '吴学姐', '郑老师', '钱同学', '冯同学', '陈老师', '褚同学', '卫老师', '蒋同学'];
  const contents = [
    '李同学非常有爱心，对小橘照顾得无微不至，定期分享小橘的成长动态，让我们很放心。',
    '感谢李同学救助了校园里的流浪猫，并帮助它们找到了温暖的家，非常有责任心。',
    '李同学救助的小白非常健康活泼，领养过程很顺利，提供了详细的饲养指南。',
    '非常感谢李同学救助了花花，现在花花在我们家生活得很幸福，性格也越来越开朗。',
    '李同学对动物很有爱心，救助的猫咪都得到了很好的照顾，值得信赖。',
    '李同学不仅救助动物，还积极宣传动物保护知识，是校园里的动物保护先锋。',
    '从李同学那里领养的小橘现在已经完全适应了新家，非常感谢她的帮助和指导。',
    '李同学救助的动物都很健康，领养流程规范，后续还会关心动物的适应情况。',
    '非常负责任，定期回访，确保宠物在新家生活得很好。',
    '李同学的专业知识和爱心让人印象深刻，强烈推荐！',
    '非常有耐心，对每只宠物都很用心，值得信赖的救助者。',
    '领养过程非常顺利，李同学提供了很多有用的建议和帮助。',
    '救助的宠物都很健康，性格也很好，非常适合领养。',
    '李同学不仅救助动物，还帮助它们找到合适的家庭，非常专业。',
    '非常有爱心和责任心，强烈推荐！'
  ];
  
  const evaluations: Evaluation[] = [];
  const months = ['10', '09', '08', '07', '06', '05', '04', '03', '02', '01'];
  const days = ['15', '20', '25', '10', '05', '28', '18', '12', '08', '22'];
  
  for (let i = 1; i <= 50; i++) {
    const month = months[Math.floor((i - 1) / 5) % months.length] || '10';
    const day = days[(i - 1) % days.length] || '15';
    const year = i <= 25 ? '2023' : '2024';
    evaluations.push({
      id: i,
      author: authors[(i - 1) % authors.length] ?? '用户',
      stars: Math.floor(Math.random() * 2) + 4, // 4-5星
      content: contents[(i - 1) % contents.length] ?? contents[0] ?? '评价内容',
      date: `${year}-${month}-${day}`
    });
  }
  
  return evaluations;
};

const evaluations = ref<Evaluation[]>(generateEvaluations());
const rating = ref({ score: 4.9, total: evaluations.value.length });

const shortTermAdoptions = ref<AdoptionPet[]>([
  { id: 1, name: '小黑', gender: '公', desc: '狗 · 8个月 · 未绝育', days: 8, status: 'approved', statusLabel: '短期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 2, name: '灰灰', gender: '母', desc: '猫 · 5个月 · 已绝育', days: 5, status: 'approved', statusLabel: '短期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 4, name: '小橘', gender: '公', desc: '橘猫 · 9个月', days: 45, status: 'approved', statusLabel: '短期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 5, name: '小白', gender: '母', desc: '比熊犬 · 1岁', days: 12, status: 'approved', statusLabel: '短期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 6, name: '豆豆', gender: '公', desc: '泰迪 · 6个月', days: 20, status: 'approved', statusLabel: '短期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 7, name: '球球', gender: '母', desc: '金毛 · 1岁', days: 30, status: 'approved', statusLabel: '短期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 11, name: '毛毛', gender: '公', desc: '拉布拉多 · 10个月', days: 15, status: 'approved', statusLabel: '短期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 12, name: '乐乐', gender: '母', desc: '英短 · 7个月', days: 25, status: 'approved', statusLabel: '短期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 13, name: '欢欢', gender: '公', desc: '哈士奇 · 1岁', days: 18, status: 'approved', statusLabel: '短期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 14, name: '甜甜', gender: '母', desc: '波斯猫 · 8个月', days: 22, status: 'approved', statusLabel: '短期领养', bgClass: '', titleClass: '', reason: '' }
]);

const longTermAdoptions = ref<AdoptionPet[]>([
  { id: 3, name: '雪球', gender: '母', desc: '猫 · 3岁 · 已绝育', days: 120, status: 'approved', statusLabel: '长期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 8, name: '花花', gender: '母', desc: '三花猫 · 2岁', days: 150, status: 'approved', statusLabel: '长期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 9, name: '旺财', gender: '公', desc: '金毛犬 · 2岁', days: 200, status: 'approved', statusLabel: '长期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 10, name: '米洛', gender: '母', desc: '布偶猫 · 1岁', days: 90, status: 'approved', statusLabel: '长期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 15, name: '多多', gender: '公', desc: '边牧 · 2岁', days: 180, status: 'approved', statusLabel: '长期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 16, name: '咪咪', gender: '母', desc: '美短 · 1.5岁', days: 100, status: 'approved', statusLabel: '长期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 17, name: '大毛', gender: '公', desc: '阿拉斯加 · 3岁', days: 250, status: 'approved', statusLabel: '长期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 18, name: '小美', gender: '母', desc: '加菲猫 · 2岁', days: 140, status: 'approved', statusLabel: '长期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 19, name: '阿黄', gender: '公', desc: '中华田园犬 · 2.5岁', days: 220, status: 'approved', statusLabel: '长期领养', bgClass: '', titleClass: '', reason: '' },
  { id: 20, name: '小咪', gender: '母', desc: '暹罗猫 · 1岁', days: 95, status: 'approved', statusLabel: '长期领养', bgClass: '', titleClass: '', reason: '' }
]);

const recentPosts = ref<Post[]>([
  { id: 1, title: '小橘的近况更新', date: '2023-11-05', summary: '小橘最近状态很好，体重增加了，也越来越亲人了。每天都会在门口迎接我回家...', status: 'approved', statusLabel: '已通过', colorClass: 'text-orange-500' },
  { id: 2, title: '寻找小白的新家', date: '2023-10-20', summary: '小白是一只非常温顺的比熊犬，已经完成所有疫苗接种，正在寻找一个有爱的永久家庭...', status: 'approved', statusLabel: '已通过', colorClass: 'text-blue-500' }
]);

// 生成20条帖子数据
const generateAllPosts = (): Post[] => {
  const titles = [
    '小橘的近况更新',
    '寻找小白的新家',
    '校园流浪猫救助记录',
    '自制猫饭配方分享',
    '金毛犬戈尔迪领养信息',
    '猫咪米洛的日常',
    '宠物健康护理小贴士',
    '领养后的适应期注意事项',
    '如何训练新领养的狗狗',
    '猫咪行为解读指南',
    '宠物疫苗接种时间表',
    '流浪动物救助经验分享',
    '宠物日常饮食搭配',
    '领养前的准备工作',
    '宠物绝育的重要性',
    '如何选择适合的宠物',
    '宠物日常护理技巧',
    '领养成功案例分享',
    '宠物心理健康关注',
    '社区宠物救助活动'
  ];
  
  const summaries = [
    '小橘最近状态很好，体重增加了，也越来越亲人了。每天都会在门口迎接我回家...',
    '小白是一只非常温顺的比熊犬，已经完成所有疫苗接种，正在寻找一个有爱的永久家庭...',
    '最近在校园里发现了几只流浪猫，已经为它们提供了食物和临时住所。如果有同学愿意领养，请联系我。',
    '经过多次尝试和改良，终于找到了一套适合学生党的自制猫饭配方。分享如何用有限的预算为猫咪提供营养均衡的饮食。',
    '戈尔迪是一只3岁的金毛犬，性格温顺，喜欢和人互动，适合有孩子的家庭。',
    '米洛是一只非常活泼的布偶猫，喜欢玩耍和互动。今天分享一些它的日常照片。',
    '定期体检、合理饮食、适量运动是保持宠物健康的关键要素。',
    '新领养的宠物需要时间适应新环境，主人需要给予足够的耐心和关爱。',
    '通过正向强化训练方法，可以帮助新领养的狗狗更快地适应家庭生活。',
    '了解猫咪的行为语言，可以更好地与它们沟通，建立良好的关系。',
    '按照正确的时间表为宠物接种疫苗，是预防疾病的重要措施。',
    '分享一些在救助流浪动物过程中积累的宝贵经验和心得体会。',
    '合理的饮食搭配对宠物的健康至关重要，需要根据年龄和健康状况调整。',
    '在领养宠物之前，需要做好充分的准备工作，包括心理和物质准备。',
    '宠物绝育不仅可以控制数量，还能预防多种疾病，提高生活质量。',
    '选择适合自己生活方式的宠物，是建立良好关系的第一步。',
    '日常的护理工作包括梳毛、清洁、修剪等，需要定期进行。',
    '分享一些成功的领养案例，希望能给准备领养的朋友一些启发。',
    '关注宠物的心理健康，及时发现和处理行为问题。',
    '参与社区宠物救助活动，为流浪动物提供帮助，传递爱心。'
  ];
  
  const dates = [
    '2023-11-05', '2023-10-20', '2023-10-15', '2023-10-10', '2023-10-05',
    '2023-09-28', '2023-09-20', '2023-09-15', '2023-09-10', '2023-09-05',
    '2023-08-28', '2023-08-20', '2023-08-15', '2023-08-10', '2023-08-05',
    '2023-07-28', '2023-07-20', '2023-07-15', '2023-07-10', '2023-07-05'
  ];
  
  const colorClasses = ['text-orange-500', 'text-blue-500', 'text-green-500', 'text-purple-500', 'text-pink-500'];
  
  return titles.map((title, index) => ({
    id: index + 1,
    title,
    date: dates[index] || '2023-11-05',
    summary: summaries[index] ?? summaries[0] ?? '帖子内容',
    status: 'approved' as const,
    statusLabel: '已通过',
    colorClass: colorClasses[index % colorClasses.length] ?? 'text-orange-500'
  }));
};

const allPosts = ref<Post[]>(generateAllPosts());

// 模态框状态
const showReviewModal = ref(false);
const showAllReviewsModal = ref(false);
const showAllPetsModal = ref(false);
const showShortTermPetsModal = ref(false);
const showLongTermPetsModal = ref(false);
const showAllPostsModal = ref(false);
const currentRating = ref(0);
const reviewText = ref('');

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

function handleProofClick(proof: Proof) {
  if (proof.status === 'rejected' && proof.reason) {
    alert('拒绝理由：' + proof.reason + '\n您可以点击"重新提交"按钮再次上传。');
  }
}

function submitReview() {
  if (currentRating.value === 0) {
    alert('请选择评分');
    return;
  }
  if (!reviewText.value.trim()) {
    alert('请输入评价内容');
    return;
  }
  alert('评价提交成功！');
  showReviewModal.value = false;
  currentRating.value = 0;
  reviewText.value = '';
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
</script>

<style scoped>
</style>
