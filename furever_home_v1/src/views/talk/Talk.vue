<template>
  <div class="flex flex-col h-screen bg-[#F8F9FB]">
    <!-- 主要内容区域 -->
    <main class="flex-1 max-w-[1200px] w-full mx-auto my-5 px-5 flex gap-5 h-[calc(100vh-160px)]">
      <!-- 左侧：联系人列表 -->
      <aside class="w-80 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div class="p-5 pb-2.5">
          <div class="text-xl font-bold mb-4 text-[#111]">消息</div>
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索联系人..."
              class="w-full py-2.5 pl-9 pr-2.5 border border-[#F3F4F6] bg-[#F9FAFB] rounded-full text-sm outline-none transition-all focus:border-[#FF8C00] focus:bg-white"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto py-2.5">
          <div
            v-for="contact in filteredContacts"
            :key="contact.id"
            :class="[
              'flex items-center px-5 py-4 cursor-pointer transition-colors border-l-[3px] border-transparent',
              activeContactId === contact.id
                ? 'bg-[#FFF7ED] border-l-[#FF8C00]'
                : 'hover:bg-[#F9FAFB]'
            ]"
            @click="selectContact(contact.id)"
          >
            <div
              :class="[
                'w-[45px] h-[45px] rounded-full flex items-center justify-center font-bold text-white text-base mr-3 flex-shrink-0',
                contact.avatarColor
              ]"
            >
              {{ contact.avatar }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between mb-1">
                <span class="font-bold text-[15px] text-[#111]">{{ contact.name }}</span>
                <span class="text-xs text-[#9CA3AF]">{{ contact.time }}</span>
              </div>
              <div class="flex items-center">
                <div class="text-[13px] text-[#6B7280] whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                  {{ contact.lastMessage }}
                </div>
                <span v-if="contact.unread" class="bg-[#EF4444] text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1.5">
                  {{ contact.unread }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧：聊天窗口 -->
      <section class="flex-1 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">
        <!-- 聊天头部 -->
        <div class="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between h-[70px]">
          <div v-if="activeContact" class="flex items-center gap-3">
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base',
                activeContact.avatarColor
              ]"
            >
              {{ activeContact.avatar }}
            </div>
            <div class="font-bold">{{ activeContact.name }}</div>
          </div>
        </div>

        <!-- 消息区域 -->
        <div class="flex-1 bg-[#F9FAFB] p-5 overflow-y-auto flex flex-col gap-5">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'flex flex-col max-w-[70%]',
              message.isSent ? 'self-end items-end' : 'self-start'
            ]"
          >
            <div
              :class="[
                'px-4 py-3 rounded-xl text-sm leading-relaxed relative shadow-sm',
                message.isSent
                  ? 'bg-[#FF8C00] text-white rounded-tr-sm'
                  : 'bg-white text-[#333333] rounded-tl-sm'
              ]"
            >
              {{ message.content }}
            </div>
            <span class="text-[11px] text-[#9CA3AF] mt-1.5">{{ message.time }}</span>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="px-6 py-4 border-t border-[#E5E7EB] flex items-center gap-4 bg-white">
          <i class="fa-regular fa-face-smile text-xl text-[#9CA3AF] cursor-pointer hover:text-[#333333]"></i>
          <i class="fa-solid fa-paperclip text-xl text-[#9CA3AF] cursor-pointer hover:text-[#333333]"></i>
          <input
            v-model="messageInput"
            type="text"
            placeholder="输入消息..."
            class="flex-1 border-none bg-transparent text-sm outline-none py-1.5"
            @keypress="handleKeyPress"
          />
          <button
            class="w-9 h-9 bg-[#FF8C00] text-white rounded-full flex items-center justify-center cursor-pointer border-none transition-all hover:bg-[#D97706] hover:scale-105"
            @click="sendMessage"
          >
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="bg-[#1E293B] text-[#94A3B8] py-5 text-xs text-center mt-auto">
      <div>2025 FUREVERHOME流浪动物领养平台 - 让每个生命都有温暖的家</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Contact {
  id: number
  name: string
  avatar: string
  avatarColor: string
  lastMessage: string
  time: string
  unread?: number
}

interface Message {
  id: number
  content: string
  time: string
  isSent: boolean // true=我发送的, false=对方发送的
}

// Mock联系人数据
const contacts = ref<Contact[]>([
  {
    id: 1,
    name: '张同学',
    avatar: '张',
    avatarColor: 'bg-[#FBBF24]',
    lastMessage: '关于小橘的领养问题...',
    time: '10:25'
  },
  {
    id: 2,
    name: '王老师',
    avatar: '王',
    avatarColor: 'bg-[#34D399]',
    lastMessage: '感谢您救助了校园里的流浪猫',
    time: '昨天'
  },
  {
    id: 3,
    name: '宠物救助中心',
    avatar: '宠',
    avatarColor: 'bg-[#60A5FA]',
    lastMessage: '新一批流浪猫需要临时寄养',
    time: '周一'
  },
  {
    id: 4,
    name: '刘女士',
    avatar: '刘',
    avatarColor: 'bg-[#A78BFA]',
    lastMessage: '我想申请领养小橘',
    time: '11月3日'
  },
  {
    id: 5,
    name: '陈同学',
    avatar: '陈',
    avatarColor: 'bg-[#F87171]',
    lastMessage: '关于小白的生活习惯...',
    time: '11月2日',
    unread: 3
  }
])

// 当前选中的联系人
const activeContactId = ref(1)

// 搜索关键词
const searchQuery = ref('')

// 输入框内容
const messageInput = ref('')

// Mock消息数据
const messages = ref<Message[]>([
  {
    id: 1,
    content: '您好！我在平台看到了您发布的小橘信息，想了解一下领养流程。',
    time: '10:15',
    isSent: false
  },
  {
    id: 2,
    content: '您好！很高兴您对小橘感兴趣。小橘是一只1岁的橘猫，已经完成疫苗接种和绝育手术，性格非常亲人。',
    time: '10:18',
    isSent: true
  },
  {
    id: 3,
    content: '太好了！我家已经有一只猫咪了，不知道小橘能否与其他猫咪相处？',
    time: '10:20',
    isSent: false
  },
  {
    id: 4,
    content: '小橘性格温和，之前在我这里与其他猫咪相处得很好。如果您有兴趣，我们可以安排一次见面，让两只猫咪先接触一下。',
    time: '10:22',
    isSent: true
  }
])

// 过滤后的联系人列表
const filteredContacts = computed(() => {
  if (!searchQuery.value.trim()) {
    return contacts.value
  }
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 当前选中的联系人
const activeContact = computed(() => {
  return contacts.value.find(c => c.id === activeContactId.value)
})

// 选择联系人
const selectContact = (id: number) => {
  activeContactId.value = id
  // TODO: 加载该联系人的聊天记录
}

// 发送消息
const sendMessage = () => {
  if (!messageInput.value.trim()) return

  const newMessage: Message = {
    id: messages.value.length + 1,
    content: messageInput.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isSent: true
  }

  messages.value.push(newMessage)
  messageInput.value = ''

  // TODO: 这里未来接后端发送消息接口
}

// 按回Enter发送
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}
</script>

<style scoped>
</style>