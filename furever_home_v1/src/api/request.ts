/**
 * HTTP请求工具
 * 封装fetch请求，提供统一的请求接口
 */

// API基础URL - 根据实际后端地址修改
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
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`
    
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
    if (bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`
    }
    if (saTokenName && saTokenValue) {
      // Sa-Token 约定的 header 名称 + token 值，需要带上 Bearer 前缀
      headers[saTokenName] = `Bearer ${saTokenValue}`
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

// 创建默认实例
const httpClient = new HttpClient(BASE_URL)

export default httpClient
export { HttpClient, type ApiResponse, type RequestConfig }

