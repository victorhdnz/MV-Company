'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function FixedLogo() {
  const [siteLogo, setSiteLogo] = useState<string | null>(null)
  const [siteName, setSiteName] = useState<string>('MV Company')

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('site_settings')
          .select('site_logo, site_name, homepage_content')
          .eq('key', 'general')
          .maybeSingle()

        if (!error && data) {
          // Priorizar site_logo, mas usar hero_logo como fallback
          let logo = data.site_logo
          if (!logo && data.homepage_content && typeof data.homepage_content === 'object') {
            logo = (data.homepage_content as any)?.hero_logo || null
          }
          
          if (logo) {
            setSiteLogo(logo)
          }
          if (data.site_name) {
            setSiteName(data.site_name)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar logo:', error)
      }
    }

    loadLogo()
  }, [])

  // Se não houver logo, não renderizar
  if (!siteLogo) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center items-center py-3 px-4 pointer-events-none">
      <Link 
        href="/" 
        className="pointer-events-auto transition-opacity hover:opacity-80"
        prefetch={true}
      >
        <div className="relative w-20 h-10 md:w-24 md:h-12 lg:w-28 lg:h-14">
          <Image
            src={siteLogo}
            alt={siteName}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
          />
        </div>
      </Link>
    </header>
  )
}

