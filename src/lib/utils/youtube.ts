/**
 * Utilitários para trabalhar com vídeos do YouTube
 */

/**
 * Detecta se é YouTube e extrai o ID do vídeo (suporta todos os formatos incluindo Shorts)
 */
export function getYouTubeId(url: string): string | null {
  if (!url) return null
  
  // Primeiro, verificar se é formato Shorts: youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/(?:youtube\.com\/shorts\/)([^#&?\/\s]{11})/)
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1]
  }
  
  // Depois, verificar outros formatos:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/v/VIDEO_ID
  // - https://www.youtube.com/watch?v=VIDEO_ID&t=30s
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2] && match[2].length === 11) ? match[2] : null
}

/**
 * Detecta se a URL é de um YouTube Shorts
 */
export function isYouTubeShorts(url: string): boolean {
  if (!url) return false
  return /youtube\.com\/shorts\//i.test(url)
}

/**
 * Gera URL de embed do YouTube
 */
export function getYouTubeEmbedUrl(url: string, autoplay = false, mute = false): string | null {
  const videoId = getYouTubeId(url)
  if (!videoId) return null
  
  const params = new URLSearchParams()
  if (autoplay) params.append('autoplay', '1')
  if (mute) params.append('mute', '1')
  
  const queryString = params.toString()
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`
}

/**
 * Gera URL de thumbnail do YouTube
 */
export function getYouTubeThumbnail(url: string): string | null {
  const videoId = getYouTubeId(url)
  if (!videoId) return null
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

/**
 * Retorna o aspect ratio correto baseado no tipo de vídeo
 * Shorts: 9/16 (vertical)
 * Normal: 16/9 (horizontal)
 */
export function getYouTubeAspectRatio(url: string): string {
  return isYouTubeShorts(url) ? '9/16' : '16/9'
}

/**
 * Retorna classes CSS para o container do vídeo baseado no tipo
 * Shorts: max-width menor e aspect ratio vertical
 * Normal: max-width maior e aspect ratio horizontal
 */
export function getYouTubeContainerClasses(url: string): {
  wrapper: string
  aspectRatio: string
  maxWidth: string
} {
  const isShorts = isYouTubeShorts(url)
  
  return {
    wrapper: isShorts 
      ? 'max-w-[400px] mx-auto' 
      : 'max-w-4xl mx-auto',
    aspectRatio: isShorts 
      ? 'aspect-[9/16]' 
      : 'aspect-video',
    maxWidth: isShorts
      ? 'max-w-[400px]'
      : 'max-w-4xl'
  }
}

