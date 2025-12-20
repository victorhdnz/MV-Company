'use client'

import { usePathname } from 'next/navigation'
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat'

/**
 * Renderiza o WhatsAppFloat apenas em páginas que não sejam catálogos e suporte
 */
export function ConditionalWhatsAppFloat() {
  const pathname = usePathname()
  
  // Não mostrar o botão global em catálogos e suporte
  const isCatalog = pathname?.startsWith('/catalogo')
  const isSupport = pathname?.startsWith('/suporte')
  
  if (isCatalog || isSupport) {
    return null
  }
  
  return <WhatsAppFloat />
}

