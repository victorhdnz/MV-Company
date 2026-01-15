'use client'

import { useRouter } from 'next/navigation'
import { DollarSign, MessageCircle } from 'lucide-react'
import { ExpandableTabs } from './expandable-tabs'

interface NavigationTabsProps {
  variant: 'homepage' | 'service'
  pricingEnabled?: boolean
  className?: string
}

export function NavigationTabs({ variant, pricingEnabled = true, className }: NavigationTabsProps) {
  const router = useRouter()

  const handleTabChange = (index: number | null) => {
    if (index === null) return

    // Determinar quais tabs estão disponíveis
    const availableTabs = variant === 'homepage' 
      ? (pricingEnabled ? ['pricing', 'contact'] : ['contact'])
      : (pricingEnabled ? ['pricing', 'contact'] : ['contact'])

    // Mapear índice para seção baseado nas tabs disponíveis
    const section = availableTabs[index]
    
    if (!section) return

    if (section === 'pricing') {
      setTimeout(() => {
        const pricingSection = document.getElementById('pricing-section')
        if (pricingSection) {
          const headerOffset = 100
          const elementPosition = pricingSection.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    } else if (section === 'contact') {
      setTimeout(() => {
        const contactSection = document.getElementById('contact-section')
        if (contactSection) {
          const headerOffset = 100
          const elementPosition = contactSection.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }

  // Construir tabs dinamicamente baseado em pricingEnabled
  const homepageTabs = pricingEnabled
    ? [
        { title: 'Preço', icon: DollarSign },
        { title: 'Contato', icon: MessageCircle },
      ]
    : [
        { title: 'Contato', icon: MessageCircle },
      ]

  const serviceTabs = pricingEnabled
    ? [
        { title: 'Preço', icon: DollarSign },
        { title: 'Contato', icon: MessageCircle },
      ]
    : [
        { title: 'Contato', icon: MessageCircle },
      ]

  // Não renderizar se não houver tabs
  const tabs = variant === 'homepage' ? homepageTabs : serviceTabs
  if (tabs.length === 0) return null

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] ${className || ''}`}>
      <ExpandableTabs
        tabs={tabs}
        onChange={handleTabChange}
        className="bg-white border-[#F7C948]/30 shadow-lg"
      />
    </div>
  )
}

