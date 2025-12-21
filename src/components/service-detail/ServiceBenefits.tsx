'use client'

import { useState } from 'react'
import { ServiceDetailContent, BenefitItem } from '@/types/service-detail'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { BenefitDetailModal } from './BenefitDetailModal'
import { 
  Check, FileText, Calendar, Bell, Share2, Globe, 
  Search, Settings, Zap, Star, Heart, Shield,
  Award, Target, Rocket, Lightbulb, TrendingUp,
  Users, Briefcase, Code, Palette, Camera, Video,
  Music, Book, Mail, Phone, MapPin, Clock, Gift
} from 'lucide-react'

interface ServiceBenefitsProps {
  content: ServiceDetailContent
}

// Mapeamento de nomes de ícones para componentes
const iconMap: Record<string, React.ElementType> = {
  'check': Check,
  'file-text': FileText,
  'calendar': Calendar,
  'bell': Bell,
  'share': Share2,
  'globe': Globe,
  'search': Search,
  'settings': Settings,
  'zap': Zap,
  'star': Star,
  'heart': Heart,
  'shield': Shield,
  'award': Award,
  'target': Target,
  'rocket': Rocket,
  'lightbulb': Lightbulb,
  'trending-up': TrendingUp,
  'users': Users,
  'briefcase': Briefcase,
  'code': Code,
  'palette': Palette,
  'camera': Camera,
  'video': Video,
  'music': Music,
  'book': Book,
  'mail': Mail,
  'phone': Phone,
  'map-pin': MapPin,
  'clock': Clock,
  'gift': Gift,
}

// Função para obter ícone como componente React
function getIconComponent(icon: string | undefined) {
  if (!icon || !iconMap[icon]) {
    const DefaultIcon = Check
    return DefaultIcon
  }
  
  return iconMap[icon]
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

  // Gradientes branco/cinza como nos exemplos
  const backgroundGradients = [
    'from-white/10 via-gray-200/5 to-white/10',
    'from-gray-100/10 via-white/5 to-gray-200/10',
    'from-white/5 via-gray-300/10 to-white/10',
    'from-gray-200/10 via-white/10 to-gray-100/5',
    'from-white/10 via-gray-100/10 to-white/5',
    'from-gray-300/5 via-white/10 to-gray-200/10',
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
              const IconComponent = getIconComponent(item.icon)
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

