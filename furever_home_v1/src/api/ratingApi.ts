import httpClient, { type ApiResponse } from './request'

export interface ReceivedRatingItemDTO {
  content?: string
  createTime?: string
  otherUserAvatar?: string
  otherUserId?: number
  otherUserName?: string
  ratingId?: number
  score?: number
  [property: string]: any
}

export interface PageResultReceivedRatingItemDTO {
  page?: number
  pageSize?: number
  records?: ReceivedRatingItemDTO[]
  total?: number
  [property: string]: any
}

export interface RatingListRequest {
  page?: number
  pageSize?: number
  [property: string]: any
}

export type ReceivedRatingListResponse = ApiResponse<PageResultReceivedRatingItemDTO>

// 添加我对某个用户的评价
export interface AddMyRatingRequest {
  content: string
  score: number
  [property: string]: any
}

// 获取我的评价（他人对我的评价）列表
export function getReceivedRatings(params: RatingListRequest) {
  return httpClient.get<PageResultReceivedRatingItemDTO>('/rating/received', { params })
}

// 获取他人对某个用户的评价列表（用于个人主页查看他人评价）
// 按后端定义：GET /api/rating/others?targetUserId=xxx&page=1&pageSize=50
export function getOthersRatings(
  targetUserId: number,
  params: RatingListRequest
) {
  return httpClient.get<PageResultReceivedRatingItemDTO>('/rating/others', {
    params: { targetUserId, ...params },
  })
}

// 添加我对某个用户的评价
// 对应后端接口：POST /api/rating/mine/{targetUserId}
export function addMyRating(
  targetUserId: number,
  data: AddMyRatingRequest
) {
  return httpClient.post<void>(`/rating/mine/${targetUserId}`, data)
}