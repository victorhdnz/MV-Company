'use client'

import Link from 'next/link'
import Image from 'next/image'
import { trackClick } from '@/lib/utils/analytics'
import { ArrowRight } from 'lucide-react'
import { ServiceCard as ServiceCardType } from '@/components/ui/ServiceCardsManager'

interface CustomServiceCardProps {
  card: ServiceCardType
}

export const CustomServiceCard = ({ card }: CustomServiceCardProps) => {
  // Não rastrear clique no card - o HomepageTracker já rastreia o link interno
  // Isso evita duplicação de cliques

  const cardContent = (
    <div className="relative h-[300px] md:h-[350px] rounded-3xl overflow-hidden bg-[#0A0A0A] border border-gray-800 hover:border-[#F7C948]/50 hover:shadow-2xl hover:shadow-[#F7C948]/10 transition-all duration-300 cursor-pointer group">
      {/* Gradient Background - Similar to Compare section */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(247,201,72,0.03),transparent_50%)]" />
      
      {/* Background Image - Optional, subtle */}
      {card.image && (
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        {/* Text and CTA */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 tracking-tight">
              {card.title}
            </h3>
            {card.description && (
              <p className="text-white/80 text-sm md:text-base font-light line-clamp-2">
                {card.description}
              </p>
            )}
          </div>
          
          {/* CTA Button */}
          <div className="flex items-center gap-2 text-white/90 group-hover:text-[#F7C948] transition-colors">
            <span className="text-sm font-medium">{card.buttonText || 'Saiba Mais'}</span>
            <ArrowRight 
              size={18} 
              className="group-hover:translate-x-1 transition-transform duration-300" 
            />
          </div>
        </div>
      </div>
    </div>
  )

  if (card.link) {
    return (
      <Link 
        href={card.link}
        className="block"
        prefetch={true}
      >
        {cardContent}
      </Link>
    )
  }

  return <div>{cardContent}</div>
}

