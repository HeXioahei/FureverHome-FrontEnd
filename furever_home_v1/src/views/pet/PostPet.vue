<script setup lang="ts">
import { ref } from 'vue'

interface PetForm {
  name: string
  breed: string
  gender: 'male' | 'female' | ''
  age: string
  vaccinated: boolean
  neutered: boolean
  dewormed: boolean
  personality: string
  story: string
  phone: string
  email: string
}

const form = ref<PetForm>({
  name: '',
  breed: '',
  gender: '',
  age: '',
  vaccinated: false,
  neutered: false,
  dewormed: false,
  personality: '',
  story: '',
  phone: '',
  email: ''
})

const saveDraft = () => {
  // TODO: 接后端前先简单打印，后续可改为本地存储或草稿接口
  console.log('保存草稿', form.value)
}

const submitForm = () => {
  // TODO: 这里未来接后端提交接口，现在先简单打印
  console.log('提交审核', form.value)
}
</script>

<template>
  <main class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <div class="flex flex-col gap-10">
      <div class="flex flex-wrap justify-between gap-3 p-4">
        <h1
          class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72"
        >
          发布待领养动物信息
        </h1>
      </div>

      <div
        class="flex flex-col gap-8 bg-white dark:bg-gray-900/50 p-6 sm:p-8 rounded-xl border border-[#e6e0db] dark:border-gray-800"
      >
        <!-- 宠物基本信息 -->
        <section>
          <h2
            class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            宠物基本信息
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-4 py-3">
            <label class="flex flex-col min-w-40 flex-1">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                动物名称
              </p>
              <input
                v-model="form.name"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="例如：豆豆"
              />
            </label>

            <label class="flex flex-col min-w-40 flex-1">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                品种
              </p>
              <input
                v-model="form.breed"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="例如：金毛寻回犬"
              />
            </label>

            <div class="flex flex-col">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                性别
              </p>
              <div class="flex items-center gap-4 h-14">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="form.gender"
                    class="form-radio text-primary focus:ring-primary/50 bg-background-light dark:bg-background-dark border-[#e6e0db] dark:border-gray-700"
                    type="radio"
                    name="gender"
                    value="male"
                  />
                  <span class="text-slate-700 dark:text-slate-300">公</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="form.gender"
                    class="form-radio text-primary focus:ring-primary/50 bg-background-light dark:bg-background-dark border-[#e6e0db] dark:border-gray-700"
                    type="radio"
                    name="gender"
                    value="female"
                  />
                  <span class="text-slate-700 dark:text-slate-300">母</span>
                </label>
              </div>
            </div>

            <label class="flex flex-col min-w-40 flex-1">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                年龄
              </p>
              <input
                v-model="form.age"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="例如：2岁"
              />
            </label>
          </div>
        </section>

        <!-- 健康状况 -->
        <section>
          <h2
            class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            健康状况
          </h2>
          <div class="flex flex-wrap gap-x-8 gap-y-4 px-4 py-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.vaccinated"
                class="form-checkbox rounded text-primary focus:ring-primary/50 bg-background-light dark:bg-background-dark border-[#e6e0db] dark:border-gray-700"
                type="checkbox"
              />
              <span class="text-slate-700 dark:text-slate-300">已免疫</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.neutered"
                class="form-checkbox rounded text-primary focus:ring-primary/50 bg-background-light dark:bg-background-dark border-[#e6e0db] dark:border-gray-700"
                type="checkbox"
              />
              <span class="text-slate-700 dark:text-slate-300">已绝育</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.dewormed"
                class="form-checkbox rounded text-primary focus:ring-primary/50 bg-background-light dark:bg-background-dark border-[#e6e0db] dark:border-gray-700"
                type="checkbox"
              />
              <span class="text-slate-700 dark:text-slate-300">已驱虫</span>
            </label>
          </div>
        </section>

        <!-- 性格特点 -->
        <section>
          <h2
            class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            性格特点
          </h2>
          <div class="px-4 py-3">
            <textarea
              v-model="form.personality"
              class="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary min-h-[120px] placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              placeholder="例如：活泼亲人，喜欢玩球，对小孩和其它动物友好..."
            />
          </div>
        </section>

        <!-- 故事/详细描述 -->
        <section>
          <h2
            class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            救助故事/详细描述
          </h2>
          <div class="px-4 py-3">
            <textarea
              v-model="form.story"
              class="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary min-h-[200px] placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              placeholder="请详细描述宠物的背景、故事和任何特殊需求..."
            />
          </div>
        </section>

        <!-- 联系信息 -->
        <section>
          <h2
            class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            联系信息
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-4 py-3">
            <label class="flex flex-col min-w-40 flex-1">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                联系电话
              </p>
              <input
                v-model="form.phone"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="请输入您的电话号码"
              />
            </label>
            <label class="flex flex-col min-w-40 flex-1">
              <p class="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                电子邮箱
              </p>
              <input
                v-model="form.email"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#e6e0db] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="请输入您的电子邮箱"
              />
            </label>
          </div>
        </section>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-wrap justify-end items-center gap-4 px-4 py-5">
        <RouterLink
          to="/"
          class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-200 text-base font-bold leading-normal tracking-[0.015em]"
        >
          <span class="truncate">返回列表</span>
        </RouterLink>
        <button
          type="button"
          class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-slate-200 text-base font-bold leading-normal tracking-[0.015em]"
          @click="saveDraft"
        >
          <span class="truncate">保存草稿</span>
        </button>
        <button
          type="button"
          class="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-orange-500 hover:bg-orange-600 shadow-md text-white text-base font-bold leading-normal tracking-[0.015em]"
          @click="submitForm"
        >
          <span class="truncate">提交审核</span>
        </button>
      </div>
    </div>
  </main>
</template>
