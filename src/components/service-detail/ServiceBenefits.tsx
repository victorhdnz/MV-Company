'use client'

import { useState } from 'react'
import { ServiceDetailContent, BenefitItem } from '@/types/service-detail'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { BenefitDetailModal } from './BenefitDetailModal'
import Image from 'next/image'

interface ServiceBenefitsProps {
  content: ServiceDetailContent
}

// Função para obter ícone como componente React
function getIconComponent(icon: string | undefined, title: string) {
  if (!icon) {
    return ({ className }: { className?: string }) => (
      <span className={className}>✓</span>
    )
  }

  if (icon.startsWith('http')) {
    return ({ className }: { className?: string }) => (
      <div className={className}>
        <Image
          src={icon}
          alt={title}
          width={48}
          height={48}
          className="object-contain"
        />
      </div>
    )
  }

  return ({ className }: { className?: string }) => (
    <span className={className}>{icon}</span>
  )
}

export function ServiceBenefits({ content }: ServiceBenefitsProps) {
  if (!content.benefits_enabled) return null

  const hasItems = content.benefits_items && content.benefits_items.length > 0
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (benefit: BenefitItem) => {
    setSelectedBenefit(benefit)
    setIsModalOpen(true)
  }

  // Paleta de cores neutras (preto, branco, cinza)
  const backgroundGradients = [
    'from-gray-800/20 to-gray-900/20',
    'from-gray-700/20 to-gray-800/20',
    'from-gray-800/20 to-gray-700/20',
    'from-gray-900/20 to-gray-800/20',
    'from-gray-700/20 to-gray-900/20',
    'from-gray-800/20 to-gray-700/20',
  ]

  if (!hasItems) {
    return (
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-black via-gray-950 to-black text-white relative">
        <div className="container mx-auto max-w-7xl">
          {content.benefits_title && (
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
              {content.benefits_title}
            </h2>
          )}
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum benefício adicionado ainda</p>
          </div>
        </div>
      </section>
    )
  }

  const items = content.benefits_items || []
  
  // Determinar layout baseado no número de itens
  const getCardClassName = (index: number, total: number) => {
    if (total === 1) {
      return 'lg:col-span-3'
    }
    if (total === 2) {
      return index === 0 ? 'lg:col-span-2' : 'lg:col-span-1'
    }
    if (total === 3) {
      return 'lg:col-span-1'
    }
    if (total === 4) {
      if (index === 0) return 'lg:col-span-2 lg:row-span-2'
      return 'lg:col-span-1'
    }
    if (total === 5) {
      if (index === 0) return 'lg:col-span-2 lg:row-span-2'
      if (index === 1) return 'lg:col-span-1 lg:row-span-2'
      return 'lg:col-span-1'
    }
    // Para 6 ou mais, layout padrão
    if (index === 0) return 'lg:col-span-2 lg:row-span-2'
    if (index === 1) return 'lg:col-span-1 lg:row-span-2'
    return 'lg:col-span-1'
  }

  return (
    <>
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-black via-gray-950 to-black text-white relative">
        <div className="container mx-auto max-w-7xl">
          {content.benefits_title && (
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
              {content.benefits_title}
            </h2>
          )}

          <BentoGrid className="lg:grid-rows-3">
            {items.map((item, index) => {
              const IconComponent = getIconComponent(item.icon, item.title)
              const gradient = backgroundGradients[index % backgroundGradients.length]

              return (
                <BentoCard
                  key={item.id}
                  name={item.title}
                  description={item.description || ''}
                  href="#"
                  cta="Ver mais"
                  Icon={IconComponent}
                  className={getCardClassName(index, items.length)}
                  background={
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl`} />
                  }
                  onClick={() => handleCardClick(item)}
                />
              )
            })}
          </BentoGrid>
        </div>
      </section>

      <BenefitDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        benefit={selectedBenefit}
      />
    </>
  )
}

