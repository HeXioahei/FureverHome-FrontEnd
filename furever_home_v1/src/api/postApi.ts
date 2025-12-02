/**
 * 帖子相关API
 */
import httpClient, { type ApiResponse } from './request'

// 帖子接口（用于论坛列表与详情）
export interface Post {
  id: number
  title: string
  date: string
  summary: string
  content?: string
  status: 'approved' | 'pending' | 'rejected'
  statusLabel: string
  colorClass: string
  reason?: string
  authorId: number
  authorName?: string
  authorAvatar?: string
  images?: string[]
  likes?: number
  comments?: number
  views?: number
  tags?: string[]
  category?: string
}

// 分页参数接口
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应接口
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 前台论坛：获取帖子列表（分页）
 * 这里先按照常见约定使用 /post/list，你后端如果是别的路径，可以再告诉我一起改。
 */
export interface PostListRequest {
  page?: number
  pageSize?: number
}

export type PostListResponse = ApiResponse<Post[]>

export function getPostList(params?: PostListRequest): Promise<PostListResponse> {
  return httpClient.get<Post[]>('/post/list', { params })
}

/**
 * 获取用户发布的帖子列表（分页）
 * @param userId 用户ID
 * @param params 分页参数
 */
export function getUserPosts(
  userId: number,
  params: PaginationParams
): Promise<ApiResponse<PaginatedResponse<Post>>> {
  return httpClient.get<PaginatedResponse<Post>>(
    `/users/${userId}/posts`,
    { params }
  )
}

/**
 * 获取帖子详情
 * @param postId 帖子ID
 */
export function getPostDetail(postId: number): Promise<ApiResponse<Post>> {
  return httpClient.get<Post>(`/posts/${postId}`)
}

/**
 * 创建帖子
 * @param data 帖子数据
 */
export function createPost(data: {
  title: string
  content: string
  summary?: string
  images?: File[]
  tags?: string[]
  category?: string
}): Promise<ApiResponse<Post>> {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('content', data.content)
  if (data.summary) formData.append('summary', data.summary)
  if (data.tags) formData.append('tags', JSON.stringify(data.tags))
  if (data.category) formData.append('category', data.category)
  
  if (data.images && data.images.length > 0) {
    data.images.forEach((image, index) => {
      formData.append(`images`, image)
    })
  }
  
  return httpClient.upload<Post>('/posts', formData)
}

/**
 * 更新帖子
 * @param postId 帖子ID
 * @param data 更新数据
 */
export function updatePost(
  postId: number,
  data: Partial<Post>
): Promise<ApiResponse<Post>> {
  return httpClient.put<Post>(`/posts/${postId}`, data)
}

/**
 * 删除帖子
 * @param postId 帖子ID
 */
export function deletePost(postId: number): Promise<ApiResponse<void>> {
  return httpClient.delete<void>(`/posts/${postId}`)
}

/**
 * 获取用户帖子统计
 * @param userId 用户ID
 */
export function getUserPostStats(
  userId: number
): Promise<ApiResponse<{ total: number; approved: number; pending: number; rejected: number }>> {
  return httpClient.get<{ total: number; approved: number; pending: number; rejected: number }>(
    `/users/${userId}/posts/stats`
  )
}

