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

// 获取我的评价（他人对我的评价）列表
export function getReceivedRatings(params: RatingListRequest) {
  return httpClient.get<PageResultReceivedRatingItemDTO>('/rating/received', { params })
}
