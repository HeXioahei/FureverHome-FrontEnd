/**
 * HTTP请求工具
 * 封装fetch请求，提供统一的请求接口
 * 并通过 window 全局事件通知 UI 显示/隐藏“请求中”加载提示
 */

// API基础URL - 默认走 /api，由 Vite 代理到测试环境
// 开发环境使用相对路径 /api，会经过 Vite 代理转发到后端
// 生产环境可以通过环境变量 VITE_API_BASE_URL 设置完整后端地址
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 请求配置接口
interface RequestConfig extends RequestInit {
  params?: Record<string, any>
  timeout?: number
}

// 响应数据接口
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * HTTP请求类
 */
class HttpClient {
  private baseURL: string
  private timeout: number
  // 静态全局计数：所有 HttpClient 实例共享，用于控制全局 loading
  private static globalPendingCount = 0

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL
    this.timeout = timeout
  }

  /**
   * 获取前台/后台 token
   * - bearerToken：通用 Bearer token（如后台、其他接口）
   * - saTokenName / saTokenValue：Sa-Token 风格的 token（例如 header: satoken: xxx）
   */
  private getAuthTokens(): {
    bearerToken: string | null
    saTokenName: string | null
    saTokenValue: string | null
  } {
    const bearerToken = localStorage.getItem('token') || sessionStorage.getItem('token')
    const saTokenName = localStorage.getItem('saTokenName')
    const saTokenValue = localStorage.getItem('saTokenValue')
    return { bearerToken, saTokenName, saTokenValue }
  }

  /**
   * 构建完整URL
   */
  private buildURL(url: string, params?: Record<string, any>): string {
    let fullURL: string
    if (url.startsWith('http')) {
      // 已经是完整URL，直接使用
      fullURL = url
    } else if (this.baseURL) {
      // 有 baseURL，拼接
      // 确保 baseURL 和 url 之间没有重复的斜杠
      const base = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL
      const path = url.startsWith('/') ? url : `/${url}`
      fullURL = `${base}${path}`
    } else {
      // baseURL 为空（后台接口），直接使用 url（url 应该以 / 开头，如 /admin/xxx）
      // 确保 url 以 / 开头
      fullURL = url.startsWith('/') ? url : `/${url}`
    }
    
    if (params) {
      const searchParams = new URLSearchParams()
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, String(params[key]))
        }
      })
      const queryString = searchParams.toString()
      return queryString ? `${fullURL}?${queryString}` : fullURL
    }
    
    return fullURL
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')
    
    let data: any
    if (isJson) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  }

  /**
   * 发送请求
   */
  private async request<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, timeout = this.timeout, ...fetchConfig } = config

    // 构建完整URL
    const fullURL = this.buildURL(url, params)

    // 设置请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchConfig.headers as Record<string, string>),
    }

    // 添加token
    const { bearerToken, saTokenName, saTokenValue } = this.getAuthTokens()
    
    // 优先使用 saTokenName/saTokenValue（如果存在），因为这是后端返回的标准格式
    if (saTokenName && saTokenValue) {
      // 确保 tokenValue 不包含 Bearer 前缀（如果包含则去掉）
      const cleanTokenValue = saTokenValue.startsWith('Bearer ') 
        ? saTokenValue.substring(7) 
        : saTokenValue
      
      // Sa-Token 约定的 header 名称 + token 值，需要带上 Bearer 前缀
      const tokenWithBearer = `Bearer ${cleanTokenValue}`
      headers[saTokenName] = tokenWithBearer
      // 同时设置 Authorization header，确保兼容性
      headers['Authorization'] = tokenWithBearer
    } else if (bearerToken) {
      // 如果没有 saToken，使用 bearerToken
      // 确保 bearerToken 不包含 Bearer 前缀（如果包含则去掉）
      const cleanBearerToken = bearerToken.startsWith('Bearer ') 
        ? bearerToken.substring(7) 
        : bearerToken
      headers['Authorization'] = `Bearer ${cleanBearerToken}`
    }

    // 全局开始计数：通知 UI 有请求开始
    HttpClient.globalPendingCount++
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('http-request-start', {
        detail: { pending: HttpClient.globalPendingCount }
      }))
    }

    // 创建AbortController用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(fullURL, {
        ...fetchConfig,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return await this.handleResponse<T>(response)
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('请求超时')
      }
      throw error
    } finally {
      // 无论成功/失败，都减少全局计数，并通知 UI
      HttpClient.globalPendingCount = Math.max(0, HttpClient.globalPendingCount - 1)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('http-request-end', {
          detail: { pending: HttpClient.globalPendingCount }
        }))
      }
    }
  }

  /**
   * GET请求
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'GET',
    })
  }

  /**
   * POST请求
   */
  post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT请求
   */
  put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE请求
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'DELETE',
    })
  }

  /**
   * PATCH请求
   */
  patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * 文件上传
   */
  async upload<T = any>(
    url: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const fullURL = this.buildURL(url)
    const headers: Record<string, string> = {}

    // 添加token
    const { bearerToken, saTokenName, saTokenValue } = this.getAuthTokens()
    if (bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`
    }
    if (saTokenName && saTokenValue) {
      headers[saTokenName] = `Bearer ${saTokenValue}`
    }

    const controller = new AbortController()
    const timeout = config?.timeout || this.timeout
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(fullURL, {
        ...config,
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return await this.handleResponse<T>(response)
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('上传超时')
      }
      throw error
    }
  }
}

// 创建默认实例（前台接口使用，BASE_URL = '/api'）
const httpClient = new HttpClient(BASE_URL)

// 创建后台管理专用实例（后台接口使用，BASE_URL = ''，路径直接写 /admin/xxx）
// 后台接口路径：/admin/xxx，不需要 /api 前缀
const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_BASE_URL || (import.meta.env.DEV ? '' : 'http://localhost:8080')
const adminHttpClient = new HttpClient(ADMIN_BASE_URL)

export default httpClient
export { HttpClient, adminHttpClient, type ApiResponse, type RequestConfig }

