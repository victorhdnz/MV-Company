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
          // Função para fazer scroll até a seção com múltiplas tentativas
          let attemptCount = 0
          const maxAttempts = 15
          
          const scrollToComparison = () => {
            attemptCount++
            
            // Tentar encontrar por ID primeiro
            let comparisonSection = document.getElementById('comparison-section')
            
            // Se não encontrar por ID, tentar por querySelector com diferentes variações
            if (!comparisonSection) {
              comparisonSection = document.querySelector('[id="comparison-section"]') as HTMLElement
            }
            
            if (!comparisonSection) {
              comparisonSection = document.querySelector('section#comparison-section') as HTMLElement
            }
            
            // Se ainda não encontrar, tentar encontrar qualquer elemento com o texto "Compare" ou "Comparar"
            if (!comparisonSection) {
              const sections = document.querySelectorAll('section')
              for (const section of sections) {
                const text = section.textContent || ''
                if (text.includes('Compare') || text.includes('Comparar') || text.includes('MV Company')) {
                  const hasGitCompare = section.querySelector('svg') || section.innerHTML.includes('GitCompare')
                  if (hasGitCompare) {
                    comparisonSection = section as HTMLElement
                    break
                  }
                }
              }
            }
            
            if (comparisonSection) {
              console.log('✅ Seção de comparação encontrada! Fazendo scroll...', comparisonSection)
              
              // Calcular posição com offset para header fixo
              const headerOffset = 120
              const elementTop = comparisonSection.getBoundingClientRect().top + window.pageYOffset
              const targetPosition = elementTop - headerOffset
              
              console.log('📍 Posição do elemento:', elementTop, 'Posição alvo:', targetPosition)
              
              // Fazer scroll suave
              window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
              })
              
              // Verificar se o scroll funcionou após um delay
              setTimeout(() => {
                const currentPosition = window.pageYOffset
                const elementPosition = comparisonSection!.getBoundingClientRect().top + window.pageYOffset - headerOffset
                const distance = Math.abs(currentPosition - elementPosition)
                
                console.log('📊 Verificação de scroll - Posição atual:', currentPosition, 'Distância:', distance)
                
                // Se ainda não estiver próximo o suficiente, tentar novamente
                if (distance > 50 && attemptCount < maxAttempts) {
                  console.log('🔄 Tentando scroll novamente...')
                  scrollToComparison()
                } else {
                  console.log('✅ Scroll concluído com sucesso!')
                }
              }, 300)
            } else if (attemptCount < maxAttempts) {
              console.log(`🔍 Tentativa ${attemptCount}/${maxAttempts} - Seção não encontrada, tentando novamente...`)
              // Tentar novamente após um delay maior
              setTimeout(scrollToComparison, 200)
            } else {
              // Se a seção não existir após várias tentativas, redirecionar para a página de comparação
              console.warn('Seção de comparação não encontrada após', maxAttempts, 'tentativas, redirecionando para /comparar')
              router.push('/comparar')
            }
          }
          
          // Usar requestAnimationFrame para garantir que o DOM esteja pronto
          requestAnimationFrame(() => {
            setTimeout(scrollToComparison, 100)
          })
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

