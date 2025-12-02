//评论相关接口
import request from './request'

export interface Comment {
  id: number
  content: string
  authorName: string
  authorAvatar?: string
  date: string
}

export const getPostComments = (postId: number) => {
  return request.get<{ data: Comment[] }>(`/posts/${postId}/comments`)
}

export const submitComment = (postId: number, payload: { content: string }) => {
  return request.post<{ data: Comment }>(`/posts/${postId}/comments`, payload)
}

export const likePost = (postId: number) => {
  return request.post(`/posts/${postId}/like`)
}
