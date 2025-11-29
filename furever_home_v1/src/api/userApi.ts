/**
 * 用户相关API
 */
import httpClient, { type ApiResponse } from './request'

// 用户基本信息接口
export interface UserInfo {
  id: number
  name: string
  title?: string
  bio?: string
  avatar?: string
  username: string
  age: number
  gender: '男' | '女' | '保密'
  location: string
  email: string
  registerTime: string
  stats?: {
    helpTimes: number
    rescues: number
  }
}

// 用户统计数据接口
export interface UserStats {
  helpTimes: number
  rescues: number
  adoptions: number
  posts: number
}

// 用户基本信息（用于显示）接口
export interface BaseInfo {
  label: string
  value: string
  spanAll?: boolean
}

// 徽章接口
export interface Badge {
  id: number
  name: string
  icon?: string
  description?: string
  obtainedAt?: string
}

// 养宠经历接口
export interface Experience {
  id: number
  text: string
  startDate?: string
  endDate?: string
}

// 证明材料接口
export interface Proof {
  id: number
  title: string
  status: 'approved' | 'pending' | 'rejected'
  reason?: string
  fileUrl?: string
  uploadTime?: string
}

// 信誉积分接口
export interface CreditScore {
  score: number
  total: number
  breakdown?: {
    excellent: number
    good: number
    average: number
    poor: number
  }
}

/**
 * 获取用户基本信息
 * @param userId 用户ID
 */
export function getUserInfo(userId: number): Promise<ApiResponse<UserInfo>> {
  return httpClient.get<UserInfo>(`/users/${userId}`)
}

/**
 * 获取用户统计数据
 * @param userId 用户ID
 */
export function getUserStats(userId: number): Promise<ApiResponse<UserStats>> {
  return httpClient.get<UserStats>(`/users/${userId}/stats`)
}

/**
 * 获取用户基本信息（格式化后的显示数据）
 * @param userId 用户ID
 */
export function getUserBaseInfo(userId: number): Promise<ApiResponse<BaseInfo[]>> {
  return httpClient.get<BaseInfo[]>(`/users/${userId}/base-info`)
}

/**
 * 获取用户徽章列表
 * @param userId 用户ID
 */
export function getUserBadges(userId: number): Promise<ApiResponse<Badge[]>> {
  return httpClient.get<Badge[]>(`/users/${userId}/badges`)
}

/**
 * 获取用户养宠经历
 * @param userId 用户ID
 */
export function getUserExperiences(userId: number): Promise<ApiResponse<Experience[]>> {
  return httpClient.get<Experience[]>(`/users/${userId}/experiences`)
}

/**
 * 获取用户证明材料
 * @param userId 用户ID
 */
export function getUserProofs(userId: number): Promise<ApiResponse<Proof[]>> {
  return httpClient.get<Proof[]>(`/users/${userId}/proofs`)
}

/**
 * 获取用户信誉积分
 * @param userId 用户ID
 */
export function getUserCreditScore(userId: number): Promise<ApiResponse<CreditScore>> {
  return httpClient.get<CreditScore>(`/users/${userId}/credit-score`)
}

/**
 * 上传证明材料
 * @param userId 用户ID
 * @param file 文件
 * @param title 证明标题
 */
export function uploadProof(
  userId: number,
  file: File,
  title: string
): Promise<ApiResponse<Proof>> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', title)
  formData.append('userId', String(userId))
  
  return httpClient.upload<Proof>(`/users/${userId}/proofs`, formData)
}

/**
 * 更新用户基本信息
 * @param userId 用户ID
 * @param data 更新数据
 */
export function updateUserInfo(
  userId: number,
  data: Partial<UserInfo>
): Promise<ApiResponse<UserInfo>> {
  return httpClient.put<UserInfo>(`/users/${userId}`, data)
}

/**
 * 更新用户头像
 * @param userId 用户ID
 * @param file 头像文件
 */
export function updateUserAvatar(
  userId: number,
  file: File
): Promise<ApiResponse<{ avatar: string }>> {
  const formData = new FormData()
  formData.append('avatar', file)
  
  return httpClient.upload<{ avatar: string }>(`/users/${userId}/avatar`, formData)
}

