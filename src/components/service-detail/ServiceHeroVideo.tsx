'use client'

import { ServiceDetailContent } from '@/types/service-detail'
import { HandWrittenTitle } from '@/components/ui/hand-writing-text'
import { 
  getYouTubeId, 
  getYouTubeEmbedUrl,
  getYouTubeContainerClasses 
} from '@/lib/utils/youtube'

interface ServiceHeroVideoProps {
  content: ServiceDetailContent
  serviceName: string
}

export function ServiceHeroVideo({ content, serviceName }: ServiceHeroVideoProps) {
  if (!content.hero_enabled) return null

  const isYouTube = content.hero_video_url ? !!getYouTubeId(content.hero_video_url) : false
  const youtubeId = content.hero_video_url ? getYouTubeId(content.hero_video_url) : null

  return (
    <section className="relative bg-black text-white py-12 md:py-20 px-4 overflow-hidden pt-24 md:pt-32">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Título com animação Hand Writing - Antes do vídeo */}
        <div className="mb-12">
          <HandWrittenTitle
            title={content.hero_title || serviceName}
            subtitle={content.hero_subtitle}
          />
        </div>

        {/* Vídeo Principal - Formato Adaptativo */}
        <div className="mb-8">
          {content.hero_video_url ? (
            isYouTube && youtubeId ? (() => {
              const containerClasses = getYouTubeContainerClasses(content.hero_video_url)
              const embedUrl = getYouTubeEmbedUrl(
                content.hero_video_url, 
                content.hero_video_autoplay || false, 
                content.hero_video_autoplay || false
              )
              
              return (
                <div className={`relative ${containerClasses.wrapper}`}>
                  <div className={`relative ${containerClasses.aspectRatio} rounded-2xl overflow-hidden shadow-2xl bg-black`}>
                    <iframe
                      src={embedUrl || ''}
                      title={content.hero_title || serviceName}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )
            })() : (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <video
                  src={content.hero_video_url}
                  autoPlay={content.hero_video_autoplay}
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            )
          ) : (
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-full flex items-center justify-center bg-gray-900/30 border border-gray-800/50 rounded-2xl">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-gray-400 text-lg">Vídeo não adicionado</p>
                  <p className="text-gray-500 text-sm mt-2">Adicione um vídeo no editor</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

