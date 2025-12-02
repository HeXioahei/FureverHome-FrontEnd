import httpClient, { type ApiResponse } from './request'

// ===================== 登录 =====================

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
 * POST /api/auth/login
 */
export function userLogin(data: UserLoginRequest) {
  return httpClient.post<SaTokenInfo>('/auth/login', data)
}

// ===================== 注册 =====================

// 1. 发送注册验证码
export interface RegisterSendCodeRequest {
  /**
   * 邮箱
   */
  email: string
  [property: string]: any
}

export type RegisterSendCodeResponse = ApiResponse<string>

/**
 * 发送注册验证码
 * POST /api/auth/register/send-code
 */
export function sendRegisterCode(data: RegisterSendCodeRequest) {
  return httpClient.post<string>('/auth/register/send-code', data)
}

// 2. 确认注册
export interface ConfirmRegisterRequest {
  /**
   * 验证码
   */
  code: string
  /**
   * 邮箱
   */
  email: string
  /**
   * 密码
   */
  password: string
  /**
   * 昵称
   */
  userName: string
  [property: string]: any
}

export type ConfirmRegisterResponse = ApiResponse<number>

/**
 * 确认注册
 * POST /api/auth/register/confirm
 */
export function confirmRegister(data: ConfirmRegisterRequest) {
  return httpClient.post<number>('/auth/register/confirm', data)
}

