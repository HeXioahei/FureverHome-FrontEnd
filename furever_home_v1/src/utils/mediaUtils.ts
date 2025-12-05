/**
 * 媒体文件工具函数
 */

/**
 * 判断URL是否为视频文件
 * @param url 文件URL
 * @returns true表示是视频，false表示是图片或其他
 */
export function isVideoUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // 提取URL的文件扩展名
  const urlLower = url.toLowerCase();
  const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];
  
  // 检查URL是否包含视频扩展名
  return videoExtensions.some(ext => urlLower.includes(ext) || urlLower.endsWith(ext));
}

/**
 * 判断URL是否为图片文件
 * @param url 文件URL
 * @returns true表示是图片，false表示是视频或其他
 */
export function isImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // 提取URL的文件扩展名
  const urlLower = url.toLowerCase();
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  
  // 检查URL是否包含图片扩展名
  return imageExtensions.some(ext => urlLower.includes(ext) || urlLower.endsWith(ext));
}

/**
 * 获取媒体类型
 * @param url 文件URL
 * @returns 'video' | 'image' | 'unknown'
 */
export function getMediaType(url: string): 'video' | 'image' | 'unknown' {
  if (isVideoUrl(url)) {
    return 'video';
  }
  if (isImageUrl(url)) {
    return 'image';
  }
  return 'unknown';
}
