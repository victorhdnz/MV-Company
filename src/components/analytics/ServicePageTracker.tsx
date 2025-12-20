'use client'

import { useEffect } from 'react'
import { usePageAnalytics } from '@/hooks/usePageAnalytics'
import { trackConversion } from '@/lib/utils/analytics'

interface ServicePageTrackerProps {
  children: React.ReactNode
  serviceId: string
  serviceSlug: string
}

export function ServicePageTracker({ children, serviceId, serviceSlug }: ServicePageTrackerProps) {
  const { trackClick: trackClickEvent } = usePageAnalytics({
    pageType: 'service',
    pageId: serviceId,
    pageSlug: serviceSlug
  })

  // Adicionar tracking aos links e botões
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const element = target.closest('a, button')
      
      if (element) {
        const text = element.textContent?.trim() || ''
        const href = element.getAttribute('href')
        
        // Rastrear cliques em WhatsApp
        if (href?.includes('wa.me')) {
          trackClickEvent('whatsapp-button', text)
          trackConversion({ 
            pageType: 'service', 
            pageId: serviceId, 
            pageSlug: serviceSlug,
            element: 'whatsapp-button' 
          })
        }
        
        // Rastrear cliques em Instagram
        if (href?.includes('instagram.com')) {
          trackClickEvent('instagram-button', text)
        }
        
        // Rastrear cliques em email
        if (href?.includes('mailto:')) {
          trackClickEvent('email-button', text)
        }
        
        // Rastrear cliques em serviços relacionados
        if (href?.includes('/portfolio/')) {
          trackClickEvent('related-service-link', text)
        }
        
        // Rastrear cliques em CTA de contato
        if (element.id === 'contato' || href === '#contato') {
          trackClickEvent('cta-contact', text)
          trackConversion({ 
            pageType: 'service', 
            pageId: serviceId, 
            pageSlug: serviceSlug,
            element: 'cta-contact' 
          })
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [trackClickEvent, serviceId, serviceSlug])

  return <>{children}</>
}

