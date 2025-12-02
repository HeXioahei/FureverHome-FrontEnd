import httpClient, { type ApiResponse } from './request'

// 获取我的待办（别人对我的申请）列表
export interface AdoptTodoItem {
  [key: string]: any
}

export type AdoptTodoListResponse = ApiResponse<AdoptTodoItem[]>

export function getMyAdoptTodoList() {
  // /api 前缀由 request.ts 的 BASE_URL 和 Vite 代理处理
  return httpClient.get<AdoptTodoItem[]>('/adopt/todo')
}

export type AdoptMineListResponse = ApiResponse<AdoptTodoItem[]>

// 获取我的领养申请列表
export function getMyAdoptMineList() {
  return httpClient.get<AdoptTodoItem[]>('/adopt/mine')
}
