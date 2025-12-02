import httpClient, { type ApiResponse } from './request'

// 会话摘要
export interface ConversationDto {
  conversationId?: number
  targetUserId?: number
  targetUserName?: string
  targetUserAvatar?: string
  lastMessage?: string
  lastMessageTime?: string // 后端为 date-time，这里用字符串接收
  unreadCount?: number
}

// 消息项
export interface MessageDto {
  messageId?: number
  conversationId?: number
  senderId?: number
  receiverId?: number
  content?: string
  messageType?: string
  isRead?: boolean
  createdAt?: string // date-time
}

// 通用分页结果
export interface PageResult<T> {
  list: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type ConversationPageResult = ApiResponse<PageResult<ConversationDto>>
export type MessagePageResult = ApiResponse<PageResult<MessageDto>>

export interface ChatPageParams {
  page?: number
  pageSize?: number
}

// 发送消息请求
export interface SendMessageRequest {
  receiverId: number
  content: string
  messageType?: string
  conversationId?: number
}

/**
 * 获取会话列表
 * GET /api/conversations
 */
export function getConversations(params?: ChatPageParams) {
  return httpClient.get<PageResult<ConversationDto>>('/conversations', {
    params,
  })
}

/**
 * 获取聊天记录
 * GET /api/conversations/{conversationId}/messages
 */
export function getMessages(
  conversationId: number,
  params?: ChatPageParams & { beforeMessageId?: number }
) {
  return httpClient.get<PageResult<MessageDto>>(
    `/conversations/${conversationId}/messages`,
    {
      params,
    }
  )
}

/**
 * 发送消息
 * POST /api/messages/send
 */
export function sendMessage(data: SendMessageRequest) {
  return httpClient.post<void>('/messages/send', data)
}

/**
 * 标记会话消息为已读
 * PUT /api/conversations/{conversationId}/read
 */
export function markConversationRead(conversationId: number) {
  return httpClient.put<void>(`/conversations/${conversationId}/read`)
}


