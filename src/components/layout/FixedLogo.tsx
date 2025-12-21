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
          .select('site_logo, site_name')
          .eq('key', 'general')
          .maybeSingle()

        if (!error && data) {
          if (data.site_logo) {
            setSiteLogo(data.site_logo)
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
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center items-center py-4 px-4 pointer-events-none">
      <Link 
        href="/" 
        className="pointer-events-auto transition-opacity hover:opacity-80"
        prefetch={true}
      >
        <div className="relative w-32 h-16 md:w-40 md:h-20 lg:w-48 lg:h-24">
          <Image
            src={siteLogo}
            alt={siteName}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
          />
        </div>
      </Link>
    </header>
  )
}

