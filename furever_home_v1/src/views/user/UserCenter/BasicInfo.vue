<template>
  <div>
    <h2 class="text-2xl font-bold mb-5" style="color: #111;">基本信息</h2>

    <div class="bg-white rounded-xl p-10 shadow-sm">
      <div class="grid grid-cols-[120px_1fr] gap-6 items-center">
        <!-- 头像 -->
        <label class="text-sm font-medium text-right" style="color: #4B5563;">头像</label>
        <div class="flex items-center gap-5">
          <div class="w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white border-2 border-white shadow-md" style="background-color: #F3C697;">
            <i class="fa-regular fa-circle"></i>
          </div>
          <button class="px-4 py-2 bg-white border border-gray-300 rounded-md text-xs cursor-pointer transition-colors hover:border-[#FF8C00] hover:text-[#FF8C00]" style="color: #4B5563;">
            <i class="fa-solid fa-camera"></i> 更换头像
          </button>
        </div>

        <!-- 用户ID -->
        <label class="text-sm font-medium text-right" style="color: #4B5563;">用户ID</label>
        <div class="relative max-w-[500px]">
          <input 
            type="text" 
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-500 cursor-not-allowed outline-none"
            value="20742" 
            disabled
          />
        </div>

        <!-- 用户名 -->
        <label class="text-sm font-medium text-right" style="color: #4B5563;">用户名</label>
        <div class="relative max-w-[500px]">
          <input 
            type="text" 
            v-model="formData.username"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm outline-none transition-colors focus:border-[#FF8C00] focus:bg-white"
            style="color: #111;"
          />
        </div>

        <!-- 年龄 -->
        <label class="text-sm font-medium text-right" style="color: #4B5563;">年龄</label>
        <div class="relative max-w-[500px]">
          <input 
            type="number" 
            v-model="formData.age"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm outline-none transition-colors focus:border-[#FF8C00] focus:bg-white"
            style="color: #111;"
          />
        </div>

        <!-- 账户密码 -->
        <label class="text-sm font-medium text-right" style="color: #4B5563;">账户密码</label>
        <div class="relative max-w-[500px]">
          <input 
            type="password" 
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-200 text-sm text-gray-500 cursor-not-allowed outline-none"
            value="password123" 
            disabled
          />
          <span 
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs cursor-pointer font-medium transition-colors hover:opacity-80"
            style="color: #FF8C00;"
            @click="handleModifyPassword"
          >
            修改
          </span>
        </div>

        <!-- 邮箱号 -->
        <label class="text-sm font-medium text-right" style="color: #4B5563;">邮箱号</label>
        <div class="relative max-w-[500px]">
          <input 
            type="email" 
            v-model="formData.email"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm outline-none transition-colors focus:border-[#FF8C00] focus:bg-white"
            style="color: #111;"
          />
        </div>

        <!-- 性别 -->
        <label class="text-sm font-medium text-right" style="color: #4B5563;">性别</label>
        <div class="flex gap-5">
          <label class="flex items-center gap-1.5 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="gender" 
              value="male"
              v-model="formData.gender"
              style="accent-color: #FF8C00;"
            />
            男
          </label>
          <label class="flex items-center gap-1.5 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="gender" 
              value="female"
              v-model="formData.gender"
              style="accent-color: #FF8C00;"
            />
            女
          </label>
          <label class="flex items-center gap-1.5 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="gender" 
              value="secret"
              v-model="formData.gender"
              style="accent-color: #FF8C00;"
            />
            保密
          </label>
        </div>

        <!-- 所在地 -->
        <label class="text-sm font-medium text-right" style="color: #4B5563;">所在地</label>
        <div class="relative max-w-[500px]">
          <input 
            type="text" 
            v-model="formData.location"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm outline-none transition-colors focus:border-[#FF8C00] focus:bg-white"
            style="color: #111;"
          />
        </div>

        <!-- 爱宠证明简介 -->
        <label class="text-sm font-medium text-right self-start mt-2.5" style="color: #4B5563;">爱宠证明简介</label>
        <div class="relative max-w-[500px]">
          <textarea 
            v-model="formData.petProofIntro"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm outline-none transition-colors focus:border-[#FF8C00] focus:bg-white min-h-[100px] resize-y"
            style="color: #111;"
            placeholder="请简要描述您的养宠经验、环境条件等..."
          ></textarea>
        </div>

        <!-- 爱宠证明 -->
        <label class="text-sm font-medium text-right" style="color: #4B5563;">爱宠证明</label>
        <div class="relative max-w-[500px]">
          <div 
            class="border-2 border-dashed border-gray-300 bg-gray-50 rounded-md p-5 text-center cursor-pointer text-xs transition-colors hover:border-[#FF8C00] hover:bg-[#FFF7ED]"
            style="color: #6B7280;"
            @click="handleFileUpload"
          >
            <i class="fa-solid fa-cloud-arrow-up text-2xl mb-1 block"></i>
            <div>点击上传文件或图片</div>
            <div class="text-xs mt-1" style="color: #999;">支持 JPG, PNG, PDF 格式</div>
          </div>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="mt-10 pt-5 border-t border-gray-200 flex justify-end">
        <button 
          class="px-8 py-3 rounded-md text-base font-semibold cursor-pointer transition-colors hover:opacity-90"
          style="background-color: #FF8C00; color: white;"
          @click="handleSave"
        >
          保存更改
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FormData {
  username: string;
  age: number;
  email: string;
  gender: string;
  location: string;
  petProofIntro: string;
}

const formData = ref<FormData>({
  username: '李同学',
  age: 21,
  email: 'student_li@university.edu.cn',
  gender: 'male',
  location: '福州市 大学城',
  petProofIntro: ''
});

function handleModifyPassword() {
  alert('修改密码功能待实现');
}

function handleFileUpload() {
  alert('文件上传功能待实现');
}

function handleSave() {
  alert('保存成功！');
  console.log('保存的数据：', formData.value);
}
</script>

<style scoped>
</style>

