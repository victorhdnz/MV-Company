'use client'

import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { FadeInSection } from '@/components/ui/FadeInSection'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'

interface SplineSectionProps {
  enabled?: boolean
  title?: string
  description?: string
  sceneUrl?: string
}

export function SplineSection({
  enabled = true,
  title,
  description,
  sceneUrl = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode',
}: SplineSectionProps) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  useEffect(() => {
    if (inView) {
      // Delay para carregar quando estiver visível
      const timer = setTimeout(() => {
        setShouldLoad(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [inView])

  if (enabled === false) return null

  return (
    <FadeInSection>
      <section 
        ref={ref}
        className="relative bg-black text-white py-16 md:py-24 px-4"
        style={{ minHeight: '600px' }}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="w-full h-[600px] md:h-[700px] bg-black/[0.96] relative overflow-hidden rounded-lg border border-gray-800 shadow-lg pointer-events-auto">
            <Spotlight
              className="-top-40 left-0 md:left-60 md:-top-20"
              fill="white"
            />
            
            <div className="flex h-full flex-col md:flex-row relative z-10">
              {/* Left content - Texto */}
              <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
                {title && (
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-6">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* Right content - Spline Scene */}
              <div className="flex-1 relative min-h-[300px] md:min-h-0">
                {shouldLoad ? (
                  <SplineScene 
                    scene={sceneUrl}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </FadeInSection>
  )
}

