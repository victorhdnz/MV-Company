'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function LoadingSpinner({ size = 'md', showText = false, className = '' }: LoadingSpinnerProps) {
  const [loadingLogo, setLoadingLogo] = useState<string | null>(null)
  const [loadingEmoji, setLoadingEmoji] = useState('⌚')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('site_settings')
          .select('loading_logo, loading_emoji')
          .eq('key', 'general')
          .maybeSingle()

        if (data) {
          // Priorizar logo, se não tiver usa emoji
          if (data.loading_logo) {
            setLoadingLogo(data.loading_logo)
          } else if (data.loading_emoji) {
            setLoadingEmoji(data.loading_emoji)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações de loading:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const sizeClasses = {
    sm: 'h-8 w-8 border-t-2 border-b-2',
    md: 'h-12 w-12 border-t-2 border-b-2',
    lg: 'h-20 w-20 border-t-4 border-b-4',
  }

  const logoSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-12 h-12',
  }

  const emojiSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-black`}></div>
        {!isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            {loadingLogo ? (
              <div className={`${logoSizes[size]} flex items-center justify-center`}>
                <Image
                  src={loadingLogo}
                  alt="Loading"
                  width={size === 'sm' ? 20 : size === 'md' ? 28 : 48}
                  height={size === 'sm' ? 20 : size === 'md' ? 28 : 48}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
            ) : (
              <span className={emojiSizes[size]}>{loadingEmoji}</span>
            )}
          </div>
        )}
      </div>
      {showText && (
        <p className="mt-6 text-gray-600 font-medium">Carregando...</p>
      )}
    </div>
  )
}

