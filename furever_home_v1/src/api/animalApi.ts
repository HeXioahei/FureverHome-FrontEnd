import httpClient, { type ApiResponse } from './request'

export interface AnimalListRequest {
  page?: number
  pageSize?: number
  [property: string]: any
}

export interface PageResult动物信息 {
  page?: number
  pageSize?: number
  records?: 动物信息[]
  total?: number
  [property: string]: any
}

export interface 动物信息 {
  adoptionStatus?: AdoptionStatus
  animalAge?: number
  animalId?: number
  animalName?: string
  breed?: string
  gender?: Gender
  healthStatus?: string
  isSterilized?: IsSterilized
  photoUrls?: string[]
  reviewStatus?: ReviewStatus
  shortDescription?: string
  species?: Species
  userId?: number
  [property: string]: any
}

export enum AdoptionStatus {
  短期领养 = '短期领养',
  长期领养 = '长期领养',
}

export enum Gender {
  公 = '公',
  未知 = '未知',
  母 = '母',
}

export enum IsSterilized {
  否 = '否',
  是 = '是',
  未知 = '未知',
}

export enum ReviewStatus {
  待审核 = '待审核',
  拒绝 = '拒绝',
  通过 = '通过',
}

export enum Species {
  仓鼠 = '仓鼠',
  兔子 = '兔子',
  其他 = '其他',
  狗 = '狗',
  猫 = '猫',
  鱼类 = '鱼类',
  鸟类 = '鸟类',
  龟类 = '龟类',
}

export type AnimalListResponse = ApiResponse<PageResult动物信息>
export type AnimalDetailResponse = ApiResponse<动物信息>

export function getAnimalList(params: AnimalListRequest) {
  return httpClient.get<PageResult动物信息>('/animal/list', { params })
}

export function getAnimalDetail(id: number) {
  return httpClient.get<动物信息>(`/animal/${id}`)
}

// 获取当前用户发布的短期宠物列表
export function getMyShortAnimals(params: AnimalListRequest) {
  return httpClient.get<PageResult动物信息>('/animal/mine/short', { params })
}

// 获取当前用户发布的长期宠物列表
export function getMyLongAnimals(params: AnimalListRequest) {
  return httpClient.get<PageResult动物信息>('/animal/mine/long', { params })
}
