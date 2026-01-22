'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MetaPixel } from './MetaPixel'

export function MetaPixelWrapper() {
  const [pixelId, setPixelId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPixelId = async () => {
      try {
        const supabase = createClient()
        
        // Buscar meta_pixel_id do site_settings
        const { data, error } = await (supabase as any)
          .from('site_settings')
          .select('value')
          .eq('key', 'meta_pixel_id')
          .maybeSingle()

        if (error && error.code !== 'PGRST116') {
          console.error('Erro ao buscar Meta Pixel ID:', error)
          return
        }

        // Se não encontrar, usar o ID padrão fornecido
        const defaultPixelId = '1898008444135638'
        
        if (data?.value) {
          setPixelId(data.value)
        } else {
          // Se não tiver no banco, usar o ID padrão
          setPixelId(defaultPixelId)
        }
      } catch (error) {
        console.error('Erro ao buscar Meta Pixel ID:', error)
        // Em caso de erro, usar o ID padrão
        setPixelId('1898008444135638')
      }
    }

    fetchPixelId()
  }, [])

  return <MetaPixel pixelId={pixelId} />
}

