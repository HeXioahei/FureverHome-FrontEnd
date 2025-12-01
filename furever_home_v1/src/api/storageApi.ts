import httpClient, { type ApiResponse } from './request'

/**
 * 上传图片，返回图片 URL 字符串
 */
export function uploadImage(file: File): Promise<ApiResponse<string>> {
  const formData = new FormData()
  formData.append('file', file)
  return httpClient.upload<string>('/storage/upload/image', formData)
}


