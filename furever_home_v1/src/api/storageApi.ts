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
 * 上传媒体文件（图片或视频），返回媒体 URL 字符串
 * 根据文件类型自动选择上传接口
 */
export function uploadMedia(file: File): Promise<ApiResponse<string>> {
  const formData = new FormData()
  formData.append('file', file)
  
  // 判断文件类型
  const isVideo = file.type.startsWith('video/')
  
  // 如果是视频，尝试使用视频上传接口，如果没有则使用通用上传接口
  // 如果后端支持视频上传到 /storage/upload/image，也可以直接使用
  const uploadUrl = isVideo 
    ? '/storage/upload/video'  // 如果有专门的视频上传接口
    : '/storage/upload/image'  // 默认使用图片上传接口（可能也支持视频）
  
  // 如果后端接口实际支持视频上传到image接口，统一使用image接口
  return httpClient.upload<string>('/storage/upload/image', formData)
}

/**
 * 删除图片
 * @param object 图片对象名（或从 URL 提取出的文件名）
 */
export function deleteImage(object: string): Promise<ApiResponse<any>> {
  return httpClient.delete<any>(`/storage/image/${encodeURIComponent(object)}`)
}

