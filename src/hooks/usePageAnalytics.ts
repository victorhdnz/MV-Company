'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/utils/analytics'

interface UsePageAnalyticsProps {
  pageType: 'homepage' | 'service' | 'product'
  pageId?: string | null
  pageSlug?: string
}

export function usePageAnalytics({ pageType, pageId, pageSlug }: UsePageAnalyticsProps) {
  const startTimeRef = useRef<number>(Date.now())
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxScrollDepthRef = useRef<number>(0)
  const hasTrackedPageView = useRef<boolean>(false)

  useEffect(() => {
    // Registrar page_view apenas uma vez
    if (!hasTrackedPageView.current) {
      trackEvent({
        pageType,
        pageId,
        pageSlug,
        eventType: 'page_view',
        eventData: {
          url: typeof window !== 'undefined' ? window.location.href : '',
          referrer: typeof window !== 'undefined' ? document.referrer : '',
        }
      })
      hasTrackedPageView.current = true
    }

    // Tracking de scroll
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        if (typeof window === 'undefined') return
        
        const scrollDepth = Math.round(
          ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
        )
        
        // Só registrar se for maior que o máximo já registrado (evitar spam)
        if (scrollDepth > maxScrollDepthRef.current) {
          maxScrollDepthRef.current = scrollDepth
          
          // Registrar apenas em marcos importantes (25%, 50%, 75%, 100%)
          const milestones = [25, 50, 75, 100]
          const shouldTrack = milestones.some(milestone => 
            scrollDepth >= milestone && maxScrollDepthRef.current < milestone + 5
          )
          
          if (shouldTrack) {
            trackEvent({
              pageType,
              pageId,
              pageSlug,
              eventType: 'scroll',
              eventData: { scroll_depth: scrollDepth }
            })
          }
        }
      }, 500)
    }

    // Tracking de tempo na página ao sair
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
      if (timeOnPage > 5) {
        // Usar API route com keepalive para garantir que o evento seja enviado mesmo ao fechar a página
        const sessionId = sessionStorage.getItem('analytics_session_id')
        if (sessionId) {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page_type: pageType,
              page_id: pageId || null,
              page_slug: pageSlug,
              session_id: sessionId,
              event_type: 'time_on_page',
              event_data: { time_seconds: timeOnPage },
              user_agent: navigator.userAgent,
              referrer: document.referrer || null,
            }),
            keepalive: true,
          }).catch(() => {
            // Fallback silencioso - não quebrar a experiência do usuário
          })
        }
      }
    }

    // Tracking de tempo periódico (a cada 30 segundos)
    const timeInterval = setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
      if (timeOnPage > 0 && timeOnPage % 30 === 0) {
        trackEvent({
          pageType,
          pageId,
          pageSlug,
          eventType: 'time_on_page',
          eventData: { time_seconds: timeOnPage }
        })
      }
    }, 30000)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      clearInterval(timeInterval)
    }
  }, [pageType, pageId, pageSlug])

  return {
    trackClick: (element: string, text?: string) => {
      trackEvent({
        pageType,
        pageId,
        pageSlug,
        eventType: 'click',
        eventData: {
          element,
          url: typeof window !== 'undefined' ? window.location.href : '',
          text,
        }
      })
    },
    trackConversion: (element: string) => {
      trackEvent({
        pageType,
        pageId,
        pageSlug,
        eventType: 'conversion',
        eventData: {
          element,
        }
      })
    }
  }
}
