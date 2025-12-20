'use client'

import { useEffect } from 'react'
import { usePageAnalytics } from '@/hooks/usePageAnalytics'
import { trackConversion } from '@/lib/utils/analytics'

interface HomepageTrackerProps {
  children: React.ReactNode
}

export function HomepageTracker({ children }: HomepageTrackerProps) {
  const { trackClick: trackClickEvent } = usePageAnalytics({
    pageType: 'homepage',
    pageSlug: '/'
  })

  // Adicionar tracking aos links e botões
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const element = target.closest('a, button')
      
      if (element) {
        const text = element.textContent?.trim() || ''
        const href = element.getAttribute('href')
        
        // Rastrear cliques em links de serviços
        if (href?.includes('/portfolio/')) {
          trackClickEvent('service-link', text)
        }
        
        // Rastrear cliques em CTA de comparação
        if (href?.includes('/comparar')) {
          trackClickEvent('comparison-cta', text)
          trackConversion({ pageType: 'homepage', pageSlug: '/', element: 'comparison-cta' })
        }
        
        // Rastrear cliques em contato
        if (href?.includes('wa.me') || 
            href?.includes('mailto:') ||
            href?.includes('instagram.com')) {
          trackClickEvent('contact-button', text)
          trackConversion({ pageType: 'homepage', pageSlug: '/', element: 'contact-button' })
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [trackClickEvent])

  return <>{children}</>
}

