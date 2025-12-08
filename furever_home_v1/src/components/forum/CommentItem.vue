<template>
  <div class="comment-root flex gap-4 py-4 border-b border-gray-100">
    <!-- Left: Avatar -->
    <div class="flex-shrink-0">
      <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
        <img v-if="comment.authorAvatar" :src="comment.authorAvatar" class="w-full h-full object-cover" />
        <span v-else class="text-lg font-bold">{{ comment.authorName?.[0] || 'User' }}</span>
      </div>
    </div>

    <!-- Right: Content -->
    <div class="flex-grow">
      <!-- Author Name -->
      <div class="text-sm font-bold text-gray-700 mb-1">{{ comment.authorName }}</div>
      
      <!-- Content -->
      <div class="text-base text-gray-800 leading-relaxed mb-2">{{ comment.content }}</div>
      
      <!-- Footer: Time, Like, Reply -->
      <div class="flex items-center gap-6 text-sm text-gray-400 mb-3">
        <span>{{ comment.date }}</span>
        <button 
          v-if="!readonly"
          class="flex items-center gap-1 hover:text-orange-500 transition-colors" 
          :class="{ 'text-orange-500': comment.isLiked }"
          @click="$emit('like', comment.id)"
        >
          <i class="fa-regular fa-thumbs-up" v-if="!comment.isLiked"></i>
          <i class="fa-solid fa-thumbs-up" v-else></i>
          <span>{{ comment.likes || 0 }}</span>
        </button>
        <button v-if="!readonly" class="hover:text-blue-500 transition-colors" @click="toggleReply(comment)">
          回复
        </button>
      </div>

      <!-- Reply Input (for Root) -->
      <div v-if="replyingTo?.id === comment.id" class="mb-4 fade-in">
        <div class="flex gap-2">
          <textarea 
            v-model="replyContent"
            class="flex-grow p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none text-sm"
            rows="3"
            :placeholder="`回复 @${comment.authorName}:`"
          ></textarea>
          <button 
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 self-end text-sm"
            @click="submitReply(comment.id)"
            :disabled="!replyContent.trim()"
          >
            发布
          </button>
        </div>
      </div>

      <!-- Child Comments (Sub-comments) -->
      <div v-if="comment.children && comment.children.length > 0" class="bg-gray-50 rounded-lg p-4 space-y-4">
        <!-- Expand Button -->
        <button 
          v-if="!isExpanded"
          @click="toggleExpand"
          class="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
        >
          <span>展开 {{ comment.children.length }} 条回复</span>
          <i class="fa-solid fa-chevron-down text-xs"></i>
        </button>

        <!-- Children List -->
        <div v-show="isExpanded" class="space-y-4">
          <div v-for="child in comment.children" :key="child.id" class="flex gap-3">
            <!-- Child Avatar -->
            <div class="flex-shrink-0">
               <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                  <img v-if="child.authorAvatar" :src="child.authorAvatar" class="w-full h-full object-cover" />
                  <span v-else class="text-xs font-bold">{{ child.authorName?.[0] || 'U' }}</span>
               </div>
            </div>
            
            <!-- Child Content -->
            <div class="flex-grow">
              <div class="text-sm">
                <span class="font-bold text-gray-700">{{ child.authorName }}</span>
                <span v-if="child.replyTo" class="text-gray-500 mx-1">回复</span>
                <span v-if="child.replyTo" class="text-blue-500">@{{ child.replyTo }}</span>
                <span class="text-gray-800 ml-1">: {{ child.content }}</span>
              </div>
              
              <!-- Child Footer -->
              <div class="flex items-center gap-4 text-xs text-gray-400 mt-1">
                <span>{{ child.date }}</span>
                <button 
                  v-if="!readonly"
                  class="flex items-center gap-1 hover:text-orange-500 transition-colors"
                  :class="{ 'text-orange-500': child.isLiked }"
                  @click="$emit('like', child.id)"
                >
                  <i class="fa-regular fa-thumbs-up" v-if="!child.isLiked"></i>
                  <i class="fa-solid fa-thumbs-up" v-else></i>
                  <span>{{ child.likes || 0 }}</span>
                </button>
                <button v-if="!readonly" class="hover:text-blue-500 transition-colors" @click="toggleReply(child)">
                  回复
                </button>
              </div>

              <!-- Reply Input (for Child) -->
              <div v-if="replyingTo?.id === child.id" class="mt-2 fade-in">
                <div class="flex gap-2">
                  <textarea 
                    v-model="replyContent"
                    class="flex-grow p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none text-xs"
                    rows="2"
                    :placeholder="`回复 @${child.authorName}:`"
                  ></textarea>
                  <button 
                    class="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 self-end text-xs"
                    @click="submitReply(comment.id, child)"
                    :disabled="!replyContent.trim()"
                  >
                    发布
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Collapse Button -->
          <button 
            @click="toggleExpand"
            class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mt-2"
          >
            <span>收起回复</span>
            <i class="fa-solid fa-chevron-up text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Comment } from '@/api/commentapi';

const props = defineProps<{
  comment: Comment;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: 'like', id: number): void;
  (e: 'reply', parentId: number, content: string, replyToUser?: string): void;
}>();

const isExpanded = ref(false);
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const replyingTo = ref<Comment | null>(null);
const replyContent = ref('');

const toggleReply = (target: Comment) => {
  if (replyingTo.value?.id === target.id) {
    replyingTo.value = null;
    replyContent.value = '';
  } else {
    replyingTo.value = target;
    replyContent.value = '';
  }
};

const submitReply = (rootId: number, target?: Comment) => {
  if (!replyContent.value.trim()) return;
  
  // If replying to a child, we pass the child's ID as parentId
  // If replying to the root, we pass the root's ID
  const parentId = target ? target.id : rootId;
  
  emit('reply', parentId, replyContent.value, target ? target.authorName : undefined);
  
  replyingTo.value = null;
  replyContent.value = '';
};
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
