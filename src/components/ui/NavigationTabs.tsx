'use client'

import { useRouter } from 'next/navigation'
import { DollarSign, MessageCircle, GitCompare, Home } from 'lucide-react'
import { ExpandableTabs } from './expandable-tabs'

interface NavigationTabsProps {
  variant: 'homepage' | 'service'
  className?: string
}

export function NavigationTabs({ variant, className }: NavigationTabsProps) {
  const router = useRouter()

  const handleTabChange = (index: number | null) => {
    if (index === null) return

    if (variant === 'homepage') {
      // Homepage tabs: Preço (0), Contato (1), Comparador (2)
      switch (index) {
        case 0: // Preço
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
          break
        case 1: // Contato
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
          break
        case 2: // Comparador
          // Função para fazer scroll até a seção
          const scrollToComparison = () => {
            // Tentar encontrar por ID primeiro
            let comparisonSection = document.getElementById('comparison-section')
            
            // Se não encontrar por ID, tentar por querySelector
            if (!comparisonSection) {
              comparisonSection = document.querySelector('[id="comparison-section"]') as HTMLElement
            }
            
            // Se ainda não encontrar, tentar encontrar qualquer elemento com o texto "Compare"
            if (!comparisonSection) {
              const sections = document.querySelectorAll('section')
              sections.forEach((section) => {
                const text = section.textContent || ''
                if (text.includes('Compare') || text.includes('Comparar')) {
                  comparisonSection = section as HTMLElement
                }
              })
            }
            
            if (comparisonSection) {
              // Usar scrollIntoView com opções para melhor controle
              comparisonSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
              })
              
              // Ajustar offset após um pequeno delay para compensar header fixo
              setTimeout(() => {
                const headerOffset = 100
                const elementPosition = comparisonSection!.getBoundingClientRect().top
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                
                window.scrollTo({
                  top: Math.max(0, offsetPosition),
                  behavior: 'smooth'
                })
              }, 100)
            } else {
              // Se a seção não existir, redirecionar para a página de comparação
              console.warn('Seção de comparação não encontrada, redirecionando para /comparar')
              router.push('/comparar')
            }
          }
          
          // Aguardar um pouco para garantir que o DOM esteja atualizado
          setTimeout(scrollToComparison, 50)
          break
      }
    } else {
      // Service page tabs: Preço (0), Contato (1), Homepage (2)
      switch (index) {
        case 0: // Preço
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
          break
        case 1: // Contato
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
          break
        case 2: // Homepage
          window.location.href = '/'
          break
      }
    }
  }

  const homepageTabs = [
    { title: 'Preço', icon: DollarSign },
    { title: 'Contato', icon: MessageCircle },
    { type: 'separator' as const },
    { title: 'Comparador', icon: GitCompare },
  ]

  const serviceTabs = [
    { title: 'Preço', icon: DollarSign },
    { title: 'Contato', icon: MessageCircle },
    { type: 'separator' as const },
    { title: 'Homepage', icon: Home },
  ]

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] ${className || ''}`}>
      <ExpandableTabs
        tabs={variant === 'homepage' ? homepageTabs : serviceTabs}
        onChange={handleTabChange}
        className="bg-gray-900 border-gray-700"
      />
    </div>
  )
}

