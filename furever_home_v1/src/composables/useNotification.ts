import { ref, onBeforeUnmount, onMounted } from 'vue'

interface NotificationData {
  activityId?: number
  id?: number
  targetType?: string
  event?: string
  title?: string
  content?: string
  createTime?: string
  time?: string
  animalName?: string
  postTitle?: string
  applicantUserName?: string
  [key: string]: any
}

// 全局通知状态
const showToast = ref(false)
const toastTitle = ref('')
const toastContent = ref('')
const wsRef = ref<WebSocket | null>(null)

// 根据通知数据生成消息内容
function generateNotificationContent(item: NotificationData): string {
  const targetType = item.targetType || ''
  const event = item.event || ''
  
  if (targetType === 'animal') {
    const animalName = item.animalName || '未知宠物'
    return `您的名为"${animalName}"的宠物的发布或修改已被管理员${event}`
  } else if (targetType === 'post') {
    const postTitle = item.postTitle || '未知标题'
    return `您的标题为"${postTitle}"的帖子的发布或修改已被管理员${event}`
  } else if (targetType === 'adopt') {
    const animalName = item.animalName || '未知宠物'
    if (event === '通过') {
      return `您对名为"${animalName}"的宠物的申请已被管理员通过，已成功发送至被申请者处`
    } else if (event === '拒绝') {
      return `您对名为"${animalName}"的宠物的申请已被管理员拒绝，请重新申请`
    } else if (event === '申请成功') {
      return `您对名为"${animalName}"的宠物的申请已被对方同意`
    } else if (event === '申请失败') {
      return `您对名为"${animalName}"的宠物的申请已被对方拒绝，请重新申请`
    }
  } else if (targetType === 'review') {
    const animalName = item.animalName || '未知宠物'
    if (event === '新的待办事项') {
      return `您的名为"${animalName}"的宠物正在被用户"${item.applicantUserName}"申请，请及时处理`
    }
  }
  
  // 默认情况：使用原有的content或event
  return item.content || item.extraInfo || event || '您有新的通知'
}

const normalizeTokenValue = (value?: string | null) => {
  if (!value) return ''
  return value.startsWith('Bearer ') ? value.slice(7) : value
}

const getStoredToken = () => {
  const raw =
    localStorage.getItem('saTokenValue') ||
    localStorage.getItem('bearerToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('Authorization')
  return normalizeTokenValue(raw)
}

const resolveWsUrl = (base?: string) => {
  if (!base) return ''
  if (base.startsWith('ws://') || base.startsWith('wss://')) return base
  const origin = window.location.origin.replace(/^http/, 'ws')
  return `${origin}${base}`
}

const handleWsMessage = (event: MessageEvent) => {
  try {
    if (event.data === 'ping' || event.data === 'pong' || event.data === 'heartbeat') {
      return
    }

    const payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
    const data: NotificationData = payload?.data || payload
    
    // 过滤无效数据或空数据
    if (!data || Object.keys(data).length === 0) {
      return
    }

    // 过滤心跳包（如果后端以JSON格式发送心跳）
    if (data.type === 'heartbeat' || data.type === 'ping') {
      return
    }

    console.log('收到通知消息:', data)
    
    const title = data.title || '系统通知'
    const content = generateNotificationContent(data)
    
    // 如果生成的内容有效，才显示弹窗
    if (content) {
      showToastMessage(title, content)
    }
  } catch (err) {
    // 忽略解析错误（可能是非JSON格式的心跳包等）
    // console.error('解析通知消息失败', err, event.data)
  }
}

const initWs = () => {
  // 检查是否已登录
  const token = getStoredToken()
  if (!token) {
    console.log('未登录，跳过 WebSocket 连接')
    return // 未登录时不连接 WebSocket
  }

  // 如果已经连接，先关闭
  if (wsRef.value) {
    wsRef.value.close()
    wsRef.value = null
  }

  const base = import.meta.env.VITE_CHAT_WS_URL || '/api/ws/common'
  let url = resolveWsUrl(base)
  if (token) {
    url += url.includes('?') ? `&token=${encodeURIComponent(token)}` : `?token=${encodeURIComponent(token)}`
  }
  
  console.log('正在连接 WebSocket:', url)
  
  try {
    const ws = new WebSocket(url)
    wsRef.value = ws
    
    ws.onopen = () => {
      console.log('通知 WebSocket 连接成功')
    }
    
    ws.onmessage = handleWsMessage
    
    ws.onerror = (err) => {
      console.error('通知WebSocket错误', err)
    }
    
    ws.onclose = () => {
      // WebSocket 关闭时，可以尝试重连（可选）
      console.log('通知WebSocket连接已关闭')
      wsRef.value = null
    }
  } catch (err) {
    console.error('通知WebSocket连接失败', err)
  }
}

const closeWs = () => {
  if (wsRef.value) {
    wsRef.value.close()
    wsRef.value = null
  }
}

const showToastMessage = (title: string, content: string) => {
  console.log('显示通知弹窗:', { title, content })
  toastTitle.value = title
  toastContent.value = content
  showToast.value = true
  console.log('通知状态已更新，showToast:', showToast.value)
}

const hideToast = () => {
  showToast.value = false
}

// 导出 composable
export function useNotification() {
  return {
    showToast,
    toastTitle,
    toastContent,
    initWs,
    closeWs,
    hideToast
  }
}

