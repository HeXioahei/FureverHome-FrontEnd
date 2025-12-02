//评论相关接口
import request, { type ApiResponse } from './request'

export interface Comment {
  id: number
  content: string
  authorName: string
  authorAvatar?: string
  date: string
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
export const submitComment = (postId: number, payload: { content: string }): Promise<ApiResponse<Comment>> => {
  return request.post<Comment>(`/post/${postId}/comments`, payload)
}

/**
 * 点赞/取消点赞帖子
 * @param postId 帖子ID
 */
export const likePost = (postId: number): Promise<ApiResponse<void>> => {
  return request.post<void>(`/post/${postId}/like`)
}

/**
 * 增加帖子浏览数
 * @param postId 帖子ID
 */
export const incrementPostViews = (postId: number): Promise<ApiResponse<void>> => {
  return request.post<void>(`/post/${postId}/view`)
}
