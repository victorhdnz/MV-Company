'use client'

import { useState, useEffect, useRef } from 'react'
import { Play } from 'lucide-react'
import { PointerHighlight } from '@/components/ui/pointer-highlight'

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

// Função para dividir o título e aplicar PointerHighlight na palavra "nós"
function renderTitleWithHighlight(title: string) {
  if (!title) return null

  // Procurar pela palavra "nós" (case insensitive, com acentuação)
  const regex = /(\b[nN]ós\b)/i
  const parts = title.split(regex)

  if (parts.length === 1) {
    // Se não encontrar "nós", retornar o título normal
    return <>{title}</>
  }

  return (
    <>
      {parts.map((part, index) => {
        if (regex.test(part)) {
          // Aplicar PointerHighlight na palavra "nós"
          return (
            <PointerHighlight 
              key={index} 
              rectangleClassName="border-gogh-yellow" 
              pointerClassName="text-gogh-yellow"
            >
              <span className="inline">{part}</span>
            </PointerHighlight>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}

export function HomepageVideo({ enabled = true, videoUrl, videoAutoplay = false, title, subtitle }: HomepageVideoProps) {
  if (!enabled) return null

  const isYouTube = videoUrl ? !!getYouTubeId(videoUrl) : false
  const youtubeId = videoUrl ? getYouTubeId(videoUrl) : null

  // Estado para detectar se o vídeo é vertical
  const [isVertical, setIsVertical] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Detectar orientação do vídeo quando carregar
  useEffect(() => {
    if (videoUrl && !isYouTube && videoRef.current) {
      const video = videoRef.current
      const handleLoadedMetadata = () => {
        if (video.videoWidth && video.videoHeight) {
          // Se altura > largura, é vertical
          setIsVertical(video.videoHeight > video.videoWidth)
        }
      }
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [videoUrl, isYouTube])

  return (
    <div className={`${isVertical && !isYouTube ? 'w-full max-w-[360px] mx-auto' : 'w-full'}`}>
      {/* Título com animação Pointer Highlight - Antes do vídeo */}
      {title && (
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gogh-black tracking-tight mb-4 md:mb-6 leading-tight">
            {renderTitleWithHighlight(title)}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-gogh-grayDark mt-4 md:mt-6">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Vídeo Principal - Sem container de fundo */}
      <div className={`relative ${
        isVertical && !isYouTube 
          ? 'aspect-[9/16] w-full' 
          : 'aspect-video w-full'
      }`}>
        {videoUrl ? (
          isYouTube && youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={title || 'Vídeo sobre nós'}
              className="w-full h-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={videoUrl}
                preload="metadata"
                playsInline
                controls={isPlaying}
                className="w-full h-full object-contain bg-black rounded-lg"
                onPlay={() => setIsPlaying(true)}
                onError={(e) => {
                  console.error('Erro ao carregar vídeo:', e)
                  const video = e.currentTarget
                  // Tentar recarregar o vídeo
                  if (videoUrl && video) {
                    const currentSrc = video.currentSrc || video.src
                    video.load()
                    // Se ainda falhar, tentar recarregar a URL
                    setTimeout(() => {
                      if (video.error && video.error.code === 4) {
                        // MEDIA_ELEMENT_ERROR: Format error
                        video.src = videoUrl
                        video.load()
                      }
                    }, 1000)
                  }
                }}
                onLoadedMetadata={() => {
                  // Verificar se o vídeo tem fontes suportadas
                  const video = videoRef.current
                  if (video && video.readyState >= 2) {
                    // Vídeo carregou corretamente
                    console.log('Vídeo carregado com sucesso')
                  }
                }}
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 cursor-pointer group z-10 rounded-lg" onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch((error) => {
                      console.error('Erro ao reproduzir vídeo:', error)
                      // Tentar recarregar e reproduzir
                      if (videoRef.current && videoUrl) {
                        videoRef.current.load()
                        setTimeout(() => {
                          videoRef.current?.play().catch(console.error)
                        }, 500)
                      }
                    })
                    setIsPlaying(true)
                  }
                }}>
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gogh-yellow/90 group-hover:bg-gogh-yellow flex items-center justify-center transition-all transform group-hover:scale-110 shadow-lg">
                    <Play className="w-10 h-10 md:w-12 md:h-12 text-gogh-black ml-1" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gogh-beige-light border border-gogh-yellow/20 rounded-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-gogh-grayDark text-lg">Vídeo não adicionado</p>
              <p className="text-gogh-grayDark/70 text-sm mt-2">Adicione um vídeo no editor</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

