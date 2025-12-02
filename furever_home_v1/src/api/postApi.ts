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

// 我的帖子列表 DTO（与后端 /post/mine/list 返回结构对齐）
export interface MyPostItemDTO {
  commentCount?: number
  content?: string
  createTime?: string
  likeCount?: number
  mediaUrls?: string
  postId?: number
  reviewStatus?: string
  title?: string
  userId?: number
  viewCount?: number
  [property: string]: any
}

export interface MyPostListParams {
  page?: number
  pageSize?: number
  [property: string]: any
}

export interface MyPostListPageResult {
  page?: number
  pageSize?: number
  records?: MyPostItemDTO[]
  total?: number
  [property: string]: any
}

export type MyPostListResponse = ApiResponse<MyPostListPageResult>

/**
 * 获取当前登录用户发布的帖子列表（我的帖子）
 * @param params 分页参数
 */
export function getMyPostList(params: MyPostListParams): Promise<MyPostListResponse> {
  return httpClient.get<MyPostListPageResult>('/post/mine/list', { params })
}

/**
 * 获取帖子列表（论坛首页）
 * @param params 分页参数
 */
export function getPostList(params?: Partial<PaginationParams>): Promise<ApiResponse<Post[]>> {
  return httpClient.get<Post[]>('/post/list', { params })
}

/**
 * 搜索帖子
 * @param params 搜索参数
 */
export function searchPosts(params: {
  keyword: string
  page?: number
  pageSize?: number
}): Promise<ApiResponse<PaginatedResponse<Post>>> {
  return httpClient.get<PaginatedResponse<Post>>('/post/search', { params })
}

/**
 * 获取用户发布的帖子列表（他人帖子）
 * @param userId 用户ID
 * @param params 分页参数
 */
export function getUserPosts(
  userId: number,
  params: PaginationParams
): Promise<ApiResponse<PaginatedResponse<Post>>> {
  return httpClient.get<PaginatedResponse<Post>>(
    `/post/user/${userId}/list`,
    { params }
  )
}

/**
 * 获取帖子详情
 * @param postId 帖子ID
 */
export function getPostDetail(postId: number): Promise<ApiResponse<Post>> {
  return httpClient.get<Post>(`/post/${postId}`)
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
  
  return httpClient.upload<Post>('/post', formData)
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
  return httpClient.put<Post>(`/post/${postId}`, data)
}

/**
 * 删除帖子
 * @param postId 帖子ID
 */
export function deletePost(postId: number): Promise<ApiResponse<void>> {
  return httpClient.delete<void>(`/post/${postId}`)
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

