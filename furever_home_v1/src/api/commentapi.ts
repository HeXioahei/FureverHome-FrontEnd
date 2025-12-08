//评论相关接口
import request, { type ApiResponse } from './request'

export interface Comment {
  id: number
  content: string
  authorName: string
  authorAvatar?: string
  date: string
  parentId?: number | null
  replyTo?: string
  likes: number
  isLiked: boolean
  children?: Comment[]
}

/**
 * 获取帖子评论列表
 * @param postId 帖子ID
 */
export const getPostComments = (postId: number): Promise<ApiResponse<Comment[]>> => {
  return request.get<Comment[]>(`/post/${postId}/comments`)
}

/**
 * 提交评论
 * @param postId 帖子ID
 * @param payload 评论内容
 */
export const submitComment = (postId: number, payload: { content: string, parentId?: number, replyTo?: string }): Promise<ApiResponse<Comment>> => {
  // 兼容后端可能接受的字段名（驼峰或下划线）
  const data = {
    ...payload,
    // Apifox 定义的字段名
    parentCommentId: payload.parentId,
    // 兼容其他命名习惯
    parent_id: payload.parentId,
    root_parent_id: payload.parentId,
    reply_comment_id: payload.parentId,
    reply_to: payload.replyTo,
    reply_to_user: payload.replyTo,
    commentContent: payload.content,
    text: payload.content
  }
  return request.post<Comment>(`/post/${postId}/comments`, data)
}

/**
 * 点赞/取消点赞帖子
 * @param postId 帖子ID
 */
export const likePost = (postId: number): Promise<ApiResponse<void>> => {
  return request.post<void>(`/post/${postId}/like`)
}

/**
 * 点赞/取消点赞评论
 * @param commentId 评论ID
 */
export const likeComment = (commentId: number): Promise<ApiResponse<void>> => {
  return request.post<void>(`/post/comments/${commentId}/like`)
}

/**
 * 增加帖子浏览数
 * @param postId 帖子ID
 */
export const incrementPostViews = (postId: number): Promise<ApiResponse<void>> => {
  return request.post<void>(`/post/${postId}/view`)
}
