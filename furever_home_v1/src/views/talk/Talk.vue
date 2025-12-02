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
import { ref, computed, onMounted, watch } from 'vue'
import { getConversations, getMessages, sendMessage as sendChatMessage, type ConversationDto, type MessageDto } from '@/api'

// 左侧联系人（会话）用于展示的结构
interface Contact {
  id: number
  name: string
  avatar: string
  avatarColor: string
  lastMessage: string
  time: string
  unread?: number
}

// 右侧消息展示结构
interface Message {
  id: number
  content: string
  time: string
  isSent: boolean // true=我发送的, false=对方发送的
}

// 会话原始数据
const rawConversations = ref<ConversationDto[]>([])
// 左侧展示用联系人列表
const contacts = ref<Contact[]>([])
// 当前选中的会话ID
const activeConversationId = ref<number | null>(null)
// 当前登录用户ID（用于判断消息方向）
const currentUserId = ref<number | null>(null)

// 搜索关键词
const searchQuery = ref('')
// 输入框内容
const messageInput = ref('')
// 右侧消息列表
const messages = ref<Message[]>([])

// 根据用户名首字生成头像底色（简单 hash）
const getAvatarColor = (name: string) => {
  const colors = ['bg-[#FBBF24]', 'bg-[#34D399]', 'bg-[#60A5FA]', 'bg-[#A78BFA]', 'bg-[#F87171]']
  if (!name) return colors[0]
  const code = name.charCodeAt(0)
  return colors[code % colors.length]
}

// 把后端会话数据映射到左侧联系人列表
const mapConversationsToContacts = (list: ConversationDto[]): Contact[] => {
  return list.map(item => {
    const name = item.targetUserName || '用户'
    const avatar = name.charAt(0)
    return {
      id: item.conversationId || 0,
      name,
      avatar,
      avatarColor: getAvatarColor(name),
      lastMessage: item.lastMessage || '',
      time: item.lastMessageTime
        ? new Date(item.lastMessageTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        : '',
      unread: item.unreadCount && item.unreadCount > 0 ? item.unreadCount : undefined,
    }
  })
}

// 加载会话列表
const loadConversations = async () => {
  try {
    const res = await getConversations({ page: 1, pageSize: 50 })
    rawConversations.value = res.data.list || []
    contacts.value = mapConversationsToContacts(rawConversations.value)

    // 如果当前没有选中的会话，默认选中第一个
    if (!activeConversationId.value && rawConversations.value.length > 0) {
      activeConversationId.value = rawConversations.value[0].conversationId || null
    }
  } catch (e) {
    console.error('加载会话列表失败', e)
  }
}

// 加载某个会话的消息列表
const loadMessages = async (conversationId: number) => {
  try {
    const res = await getMessages(conversationId, { page: 1, pageSize: 50 })
    const list: MessageDto[] = res.data.list || []

    messages.value = list
      .slice()
      .sort((a, b) => {
        const t1 = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const t2 = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return t1 - t2
      })
      .map(m => ({
        id: m.messageId || 0,
        content: m.content || '',
        time: m.createdAt
          ? new Date(m.createdAt).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '',
        isSent: currentUserId.value != null && m.senderId === currentUserId.value,
      }))
  } catch (e) {
    console.error('加载消息列表失败', e)
  }
}

// 过滤后的联系人列表
const filteredContacts = computed(() => {
  if (!searchQuery.value.trim()) {
    return contacts.value
  }
  const keyword = searchQuery.value.toLowerCase()
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(keyword)
  )
})

// 当前选中的联系人
const activeContact = computed(() => {
  if (!activeConversationId.value) return undefined
  return contacts.value.find(c => c.id === activeConversationId.value)
})

// 选择联系人（会话）
const selectContact = (conversationId: number) => {
  if (activeConversationId.value === conversationId) return
  activeConversationId.value = conversationId
  loadMessages(conversationId)
}

// 发送消息
const sendMessage = async () => {
  if (!messageInput.value.trim() || !activeConversationId.value) return

  const content = messageInput.value.trim()

  // 先本地追加一条已发送消息，提升交互体验
  const optimistic: Message = {
    id: Date.now(),
    content,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isSent: true,
  }
  messages.value.push(optimistic)
  messageInput.value = ''

  try {
    // 在会话中发送消息（后端如果要求 receiverId，可以从会话详情中取；这里先只传 conversationId）
    await sendChatMessage({
      conversationId: activeConversationId.value,
      receiverId: 0, // 具体值依赖后端，如果后端可以根据会话ID推断接收者，可忽略此字段
      content,
    })

    // 发送成功后重新拉一遍最新消息，防止顺序或状态不一致
    await loadMessages(activeConversationId.value)
    await loadConversations()
  } catch (e) {
    console.error('发送消息失败', e)
  }
}

// 按回车发送
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// 初次挂载时加载当前用户和会话列表
onMounted(() => {
  try {
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      const u = JSON.parse(userStr)
      if (u && typeof u.userId === 'number') {
        currentUserId.value = u.userId
      }
    }
  } catch (e) {
    console.warn('解析 currentUser 失败', e)
  }

  loadConversations().then(() => {
    if (activeConversationId.value) {
      loadMessages(activeConversationId.value)
    }
  })
})

// 当选中会话变化时，如果没有消息则尝试加载
watch(activeConversationId, (id) => {
  if (id && messages.value.length === 0) {
    loadMessages(id)
  }
})
</script>

<style scoped>
</style>