import httpClient, { type ApiResponse } from './request'

export interface UserLoginRequest {
  account: string
  password: string | number
}

export interface SaTokenInfo {
  isLogin?: boolean
  loginDevice?: string
  loginId?: any
  loginType?: string
  sessionTimeout?: number
  tag?: string
  tokenActiveTimeout?: number
  tokenName?: string
  tokenSessionTimeout?: number
  tokenTimeout?: number
  tokenValue?: string
  [property: string]: any
}

export type UserLoginResponse = ApiResponse<SaTokenInfo>

/**
 * 前台用户登录
 */
export function userLogin(data: UserLoginRequest) {
  // 对应后端示例：POST /api/auth/login
  return httpClient.post<SaTokenInfo>('/auth/login', data)
}

