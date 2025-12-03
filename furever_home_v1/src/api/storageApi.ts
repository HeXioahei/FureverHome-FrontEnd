import httpClient, { type ApiResponse } from './request'

/**
 * 上传图片，返回图片 URL 字符串
 */
export function uploadImage(file: File): Promise<ApiResponse<string>> {
  const formData = new FormData()
  formData.append('file', file)
  return httpClient.upload<string>('/storage/upload/image', formData)
}

/**
 * 删除图片
 * @param object 图片对象名（或从 URL 提取出的文件名）
 */
export function deleteImage(object: string): Promise<ApiResponse<any>> {
  return httpClient.delete<any>(`/storage/image/${encodeURIComponent(object)}`)
}

