'use client'

import { HandWrittenTitle } from '@/components/ui/hand-writing-text'

interface HomepageVideoProps {
  enabled?: boolean
  videoUrl?: string
  videoAutoplay?: boolean
  title?: string
  subtitle?: string
}

// Função para detectar se é YouTube e extrair ID
function getYouTubeId(url: string): string | null {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(youtubeRegex)
  return match ? match[1] : null
}

export function HomepageVideo({ enabled = true, videoUrl, videoAutoplay = false, title, subtitle }: HomepageVideoProps) {
  if (!enabled) return null

  const isYouTube = videoUrl ? !!getYouTubeId(videoUrl) : false
  const youtubeId = videoUrl ? getYouTubeId(videoUrl) : null

  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-12 md:py-20 px-4 overflow-hidden pt-24 md:pt-32">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Título com animação Hand Writing - Antes do vídeo */}
        {title && (
          <div className="mb-12">
            <HandWrittenTitle
              title={title}
              subtitle={subtitle}
            />
          </div>
        )}

        {/* Vídeo Principal */}
        <div className="mb-8">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            {videoUrl ? (
              isYouTube && youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}${videoAutoplay ? '?autoplay=1&mute=1' : ''}`}
                  title={title || 'Vídeo sobre nós'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  autoPlay={videoAutoplay}
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900/30 border border-gray-800/50 rounded-2xl">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-gray-400 text-lg">Vídeo não adicionado</p>
                  <p className="text-gray-500 text-sm mt-2">Adicione um vídeo no editor</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

