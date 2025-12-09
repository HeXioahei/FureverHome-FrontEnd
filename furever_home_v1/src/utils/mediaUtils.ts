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
  
  const urlLower = url.toLowerCase();
  const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv', '.m4v', 'mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv', 'm4v'];
  
  // 检查URL路径中是否包含视频扩展名
  try {
    const urlObj = new URL(urlLower.startsWith('http') ? urlLower : `http://example.com${urlLower}`);
    const pathname = urlObj.pathname;
    
    // 检查路径中的扩展名
    if (videoExtensions.some(ext => pathname.includes(`.${ext}`) || pathname.endsWith(ext))) {
      return true;
    }
    
    // 检查完整的URL字符串中是否包含视频扩展名
    if (videoExtensions.some(ext => urlLower.includes(`.${ext}`) || urlLower.endsWith(ext))) {
      return true;
    }
    
    // 检查URL中是否包含视频相关的关键词（用于后端可能没有扩展名的情况）
    const videoKeywords = ['/video/', '/videos/', 'video', 'mp4', 'mov'];
    if (videoKeywords.some(keyword => urlLower.includes(keyword))) {
      // 排除图片相关关键词
      const imageKeywords = ['/image/', '/images/', 'image', 'jpg', 'jpeg', 'png', 'gif'];
      if (!imageKeywords.some(keyword => urlLower.includes(keyword))) {
        return true;
      }
    }
  } catch (e) {
    // 如果URL解析失败，使用简单的字符串匹配
    if (videoExtensions.some(ext => urlLower.includes(`.${ext}`) || urlLower.includes(ext))) {
      return true;
    }
  }
  
  return false;
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

/**
 * 生成用于请求服务端截图的默认封面地址，时间戳默认 0.5s
 */
export function buildSnapshotUrl(url: string, timeMs = 500): string {
  if (!url) return '';
  const hasQuery = url.includes('?');
  const safeTime = Number.isFinite(timeMs) && timeMs >= 0 ? timeMs : 500;
  return `${url}${hasQuery ? '&' : '?'}x-oss-process=video/snapshot,t_${safeTime},f_jpg,w_800,h_600,m_fast`;
}

/**
 * 尝试在浏览器端截取指定时间点的帧作为视频封面
 * - 返回 base64 图片；失败时返回 undefined
 * - 默认截取 0.5 秒处的帧
 */
export async function generateVideoThumbnail(url: string, timeSeconds = 0.5): Promise<string | undefined> {
  if (!url) return undefined;
  if (typeof document === 'undefined') return undefined;

  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.src = url;

      const cleanup = () => {
        video.src = '';
        video.remove();
      };

      // 如果 3 秒仍未加载到 metadata，则直接回退
      const fallbackTimer = window.setTimeout(() => {
        cleanup();
        resolve(undefined);
      }, 3000);

      video.addEventListener('loadedmetadata', () => {
        const duration = video.duration || 1;
        const target = Math.max(0, Math.min(timeSeconds, duration - 0.1));
        video.currentTime = Number.isFinite(target) ? target : 0.5;
      });

      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 800;
        canvas.height = video.videoHeight || 600;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          window.clearTimeout(fallbackTimer);
          cleanup();
          resolve(undefined);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          const dataUrl = canvas.toDataURL('image/jpeg');
          window.clearTimeout(fallbackTimer);
          cleanup();
          resolve(dataUrl);
        } catch (e) {
          console.warn('生成视频封面失败: toDataURL', e);
          window.clearTimeout(fallbackTimer);
          cleanup();
          resolve(undefined);
        }
      });

      video.addEventListener('error', () => {
        window.clearTimeout(fallbackTimer);
        cleanup();
        resolve(undefined);
      });
    } catch (e) {
      console.warn('生成视频封面异常', e);
      resolve(undefined);
    }
  });
}